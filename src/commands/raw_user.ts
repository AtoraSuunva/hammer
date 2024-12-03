import {
  type APIUserApplicationCommandInteraction,
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/payloads'
import type { Command } from 'workers-discord'

import type { API } from '@discordjs/core/http-only'
import { ApplicationCommandType } from 'discord-api-types/v10'
import type { Toucan } from 'toucan-js'
import type { CtxWithEnv } from '../env.js'
import { bufferfy } from '../utils/bufferfy.js'

export const raw_user: Command<CtxWithEnv, Request, Toucan> = {
  name: 'Raw',
  type: ApplicationCommandType.User,
  contexts: {
    installation: [
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ],
    interaction: [
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ],
  },
  execute: async ({ response, wait, interaction, context }) => {
    wait(editInAttachment(context.api, interaction))

    return response({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
      },
    })
  },
}

async function editInAttachment(
  api: API,
  interaction: APIUserApplicationCommandInteraction,
) {
  const user = interaction.data.resolved.users[interaction.data.target_id]

  return api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    {
      files: [
        {
          name: 'raw_user.json',
          data: bufferfy(user),
          contentType: 'application/json',
        },
      ],
    },
  )
}
