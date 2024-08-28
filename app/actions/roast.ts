"use server"

import { AutoTokenizer } from "@xenova/transformers";
import { HfInference } from '@huggingface/inference'

import { formatInformations, transformForInference } from "@/utils/roast";
import { FormProps } from "@/components/form";

const MODEL_ID = "meta-llama/Meta-Llama-3.1-70B-Instruct";

export async function roast({ username, language }: FormProps) {
  const userResponse = await fetch(`https://huggingface.co/api/users/${username}/overview`);
  const user = await userResponse.json();
  if (!user || user.error) {
    return { error: user.error ?? "Something wrong happened, please retry.", status: 404 };
  }

  if (!username) {
    return { error: "Please provide a valid username", status: 400 };
  }

  const requests = Promise.all([
    await fetch(`https://huggingface.co/api/users/${username}/following`),
    await fetch(`https://huggingface.co/api/users/${username}/followers`),
    await fetch(`https://huggingface.co/api/spaces?author=${username}&sort=likes&limit=300&full=false&l`),
    await fetch(`https://huggingface.co/api/models?author=${username}&sort=downloads&limit=300&full=false`),
    await fetch(`https://huggingface.co/api/collections?owner=${username}&limit=100&sort=upvotes&full=false`)
  ]);

  const [followingResponse, followersResponse, spacesResponse, modelsResponse, collectionsResponse] = await requests;
  const [following, followers, spaces, models, collections] = await Promise.all([
    followingResponse.json(),
    followersResponse.json(),
    spacesResponse.json(),
    modelsResponse.json(),
    collectionsResponse.json()
  ]);
  const [spacesLikes, modelsLikes] = [spaces, models].map((items) => items.reduce((acc: number, item: any) => acc + item.likes, 0));
  const collectionsUpvotes = collections?.reduce((acc: number, item: any) => acc + item.upvotes, 0);
  
  const datas = formatInformations(user, following.length, followers.length, spaces, models, collections,  spacesLikes, modelsLikes, collectionsUpvotes);
  const chat = transformForInference(datas, language, username);

  const hf = new HfInference(process.env.HF_ACCESS_TOKEN);
  const tokenizer = await AutoTokenizer.from_pretrained("philschmid/meta-llama-3-tokenizer")

  const formattedPrompt = tokenizer.apply_chat_template(chat, { tokenize: false, add_generation_prompt: true })
  const res = await hf.textGeneration({
    model: MODEL_ID,
    inputs: formattedPrompt as string,
    parameters: {
      return_full_text: false,
      max_new_tokens: 1024,
      stop_sequences: ["<|end|>", "<|endoftext|>", "<|assistant|>"],
    }
  }, {
    use_cache: false,
  })

  return {
    data: res.generated_text
  }
}