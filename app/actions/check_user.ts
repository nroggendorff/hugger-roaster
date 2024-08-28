"use server";

export const check_user = async (username: string) => {
  const userResponse = await fetch(
    `https://huggingface.co/api/users/${username}/overview`
  );
  const user = await userResponse.json();
  if (!user || user.error) {
    return false;
  }

  return true;
}