const formatSpacesInfos = (spaces: any) => {
  const texts: string[] = []
  spaces.map((space: any) => {
    let text = `${space.cardData?.title} has ${space.likes} likes and has been updated ${space.lastModified} ago.`
    if (space.cardData?.short_description) {
      text += `The space description is: ${space.cardData?.short_description}`
    }
    texts.push(text)
  })

  return texts.join("\n")
}

const formatModelsInfos = (models: any) => {
  const texts: string[] = []
  models.map((model: any) => {
    let text = `${model.id?.split("/")[1]} has ${model.likes} likes and ${model.downloads} downloads.`
    if (model.gating) {
      text += `You should ask for access to this model.`
    } else {
      text += `This model is public.`
    }
    text += `This model is about ${model.pipeline_tag}`

    texts.push(text)
  })

  return texts.join("\n")
}

const formatUserInfos = (user: any, countFollowing: number, countFollowers: number, spacesLikes: number, modelsLikes: number, spaces: any, models: any) => {
  return `
  The user ${user.fullname} has ${countFollowers} followers and is following ${countFollowing} users.
He is part of ${user.orgs?.length ?? 0} organizations.
He is owner of ${spaces?.length ?? 0} spaces and has ${models?.length ?? 0} models.
He already liked ${user.likes?.length ?? 0} models/spaces/datasets. This user is ${user.isPro ? "pro" : "not pro"}.
He has ${spacesLikes} likes on his spaces and ${modelsLikes} likes on his models.
`
}

export const formatInformations = (
  user: any,
  countFollowing: number,
  countFollowers: number,
  spaces: any,
  models: any,
  spacesLikes: number,
  modelsLikes: number
) => {
  const userInfos = formatUserInfos(user, countFollowing, countFollowers, spacesLikes, modelsLikes, spaces, models)
  const spacesInfos = formatSpacesInfos(spaces.slice(0, 6))
  const modelsInfos = formatModelsInfos(models.slice(0, 6))

  return `${userInfos}\n\n${spacesInfos}\n\n${modelsInfos}`
}