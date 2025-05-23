import {
  type APIUserApplicationCommandInteraction,
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10'
import type { Command } from 'workers-discord'

import type { API } from '@discordjs/core/http-only'
import { ApplicationCommandType } from 'discord-api-types/v10'
import type { Toucan } from 'toucan-js'
import type { CtxWithEnv } from '../env.js'
import { editInJSONResponse } from '../utils/editInJSONResponse.js'

export const raw_user: Command<CtxWithEnv, Request, Toucan> = {
  name: 'Raw User',
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
  execute: async ({ request, response, wait, interaction, context }) => {
    wait(editInAttachment(request, context.api, interaction))

    return response({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
      },
    })
  },
}

async function editInAttachment(
  request: Request,
  api: API,
  interaction: APIUserApplicationCommandInteraction,
) {
  const user = interaction.data.resolved.users[interaction.data.target_id]

  return editInJSONResponse(request, api, interaction, 'raw_user.json', user)
}
