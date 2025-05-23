import type {
  API,
  APIMessageComponentInteraction,
} from '@discordjs/core/http-only'
import { InteractionResponseType } from 'discord-api-types/v10'
import type { Toucan } from 'toucan-js'
import type { Component } from 'workers-discord'
import type { CtxWithEnv } from '../env'
import { editInJSONResponse } from '../utils/editInJSONResponse'

export const repost: Component<CtxWithEnv, Request, Toucan> = {
  name: 'repost',
  execute: async ({ request, response, wait, interaction, context }) => {
    wait(editInAttachment(request, context.api, interaction))

    return response({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
    })
  },
}

async function editInAttachment(
  request: Request,
  api: API,
  interaction: APIMessageComponentInteraction,
) {
  const { message } = interaction

  const attachment = message.attachments[0]

  if (!attachment) {
    throw new Error(`No attachment found, but expected one: ${interaction.id}`)
  }

  const data = await fetch(attachment.url).then((res) => res.json())

  return editInJSONResponse(
    request,
    api,
    interaction,
    attachment.filename,
    data,
    false,
  )
}
