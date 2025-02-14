import { API, APIInteraction } from "@discordjs/core/http-only"
import { bufferfy } from "./bufferfy"

export function editInJSONResponse(request: Request,  api: API, interaction: APIInteraction, fileName: string, fileContent: unknown) {
  const origin = new URL(request.url).origin

  return api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    {
      content: `<[Online Viewer](${origin}/json?url=)>`,
      files: [
        {
          name: fileName,
          data: bufferfy(fileContent),
          contentType: 'application/json',
        },
      ],
    },
  ).then(message => {
    const fileUrl = message.attachments[0]!.url

    return api.interactions.editReply(
      interaction.application_id,
      interaction.token,
      {
        content: `[Online Viewer](<${origin}/json?url=${encodeURIComponent(fileUrl)}>)`,
      },
    )
  })
}
