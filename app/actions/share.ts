"use server";
import prisma from "@/utils/prisma";

export interface ShareProps {
  hf_user: string;
  text: string;
}

export async function share(form: ShareProps) {

  const quote = await prisma.quote.create({
    data: {
      hf_user: form.hf_user,
      text: form.text
    }
  })

  return {
    data: quote
  }
}