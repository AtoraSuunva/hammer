import {
  type API,
  type APIInteraction,
  ButtonStyle,
  ComponentType,
} from '@discordjs/core/http-only'
import { bufferfy } from './bufferfy'

interface EditInJSONResponseParams {
  request: Request
  api: API
  interaction: APIInteraction
  fileName: string
  fileContent: unknown
  repostButton?: boolean
  onlineViewer?: boolean
}

export function editInJSONResponse({
  request,
  api,
  interaction,
  fileName,
  fileContent,
  repostButton = true,
  onlineViewer = true,
}: EditInJSONResponseParams) {
  const origin = new URL(request.url).origin
  const copiedContent = structuredClone(fileContent)

  // @ts-expect-error
  if ('token' in copiedContent) {
    copiedContent.token = '{token}'
  }

  return api.interactions
    .editReply(interaction.application_id, interaction.token, {
      content: onlineViewer
        ? `<[Online Viewer](${origin}/json?url=)> \`${fileName}\``
        : `\`${fileName}\``,
      files: [
        {
          name: fileName,
          data: bufferfy(copiedContent),
          contentType: 'application/json',
        },
      ],
    })
    .then((message) => {
      const attachment = message.attachments[0]
      if (!attachment) {
        throw new Error(
          `No attachment found, but expected one: ${interaction.id}`,
        )
      }

      const fileUrl = attachment.url

      return api.interactions.editReply(
        interaction.application_id,
        interaction.token,
        {
          content: onlineViewer
            ? `[Online Viewer](<${origin}/json?url=${encodeURIComponent(fileUrl)}>) \`${fileName}\``
            : `\`${fileName}\``,
          components: repostButton
            ? [
                {
                  type: ComponentType.ActionRow,
                  components: [
                    {
                      type: ComponentType.Button,
                      custom_id: 'repost',
                      label: 'Repost',
                      style: ButtonStyle.Secondary,
                    },
                  ],
                },
              ]
            : [],
        },
      )
    })
}
