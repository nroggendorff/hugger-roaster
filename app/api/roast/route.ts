import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  // fetch the user's username from the body
  const { username } = body;

  // fetch user from hugging face API
  const user = await fetch(`https://huggingface.co/api/users/${username}`);

  console.log(user);
  
  return NextResponse.json({ message: "Roasted!" });
}