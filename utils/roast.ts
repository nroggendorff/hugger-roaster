import { Language } from "@/components/form";

export const formatInformations = (
  user: any,
  countFollowing: number,
  countFollowers: number,
  spaces: any,
  models: any,
  collections: any,
  spacesLikes: number,
  modelsLikes: number,
  collectionsUpvotes: number
) => {
  const datas = {
		name: user.fullname,
		bio: user.details,
		organizations: user.orgs?.map((org: any) => ({
      name: org.fullname
    })),
		followers: countFollowers === 500 ? "500+" : countFollowers,
		following: countFollowing === 500 ? "500+" : countFollowing,
    total_spaces_likes: spacesLikes,
    total_models_likes: modelsLikes,
    total_collections_likes: collectionsUpvotes,
		last_5_spaces: spaces
			.map((space: any) => ({
				name: space?.cardData?.title ?? space.id?.split("/")[1],
				description: space?.cardData?.short_description,
				likes_count: space.likes,
				last_modified: space.lastModified,
        created_at: space.createdAt
			}))
			.slice(0, 5),
    last_5_models: models
    .map((model: any) => ({
      name: model.id?.split("/")[1],
      has_inference: model.inference,
      likes_count: model.likes,
      downloads_count: model.downloads,
      pipeline_tag: model.pipeline_tag,
      last_modified: model.lastModified,
        created_at: model.createdAt
    }))
    .slice(0, 5),
    last_5_collections: collections
    .map((collection: any) => ({
      name: collection.title,
      description: collection.description,
      upvotes_count: collection.upvotes,
    }))
    .slice(0, 5),
	};

  return datas;
}

export const transformForInference = (
  datas: Record<string, any>,
  language: Language,
  username: string,
) => {
  let user_content = `give a short and harsh roasting for the following hugging face profile: ${username}. Here are the details: "${JSON.stringify(datas)}"`

  switch (language) {
    case "fr":
      user_content = `fais une courte et cruelle critique sarcastique en argot pour le profil Hugging Face suivant en français :  ${username}. Voici les détails: "${JSON.stringify(datas)}"`
      break;
    case "es":
      user_content = `haz una crítica corta y cruel para el siguiente perfil de Hugging Face en español: ${username}. Aquí están los detalles: "${JSON.stringify(datas)}"`
      break;
  }

  const chat = [{
    role: 'assistant',
    content:
      'You roast people hugging face account based on their bio, name, spaces, and models as harsh and spicy as possible, and keep it short.'
  },
  { role: 'user', content: user_content }]

  return chat;
}