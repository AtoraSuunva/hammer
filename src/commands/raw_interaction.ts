import {
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10'
import type { Command } from 'workers-discord'

import type { API } from '@discordjs/core/http-only'
import {
  type APIChatInputApplicationCommandInteraction,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import type { Toucan } from 'toucan-js'
import type { CtxWithEnv } from '../env.js'
import { editInJSONResponse } from '../utils/editInJSONResponse.js'

export const raw_interaction: Command<CtxWithEnv, Request, Toucan> = {
  name: 'raw_interaction',
  description: 'Get raw data about the interaction this was run with',
  type: ApplicationCommandType.ChatInput,
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
  interaction: APIChatInputApplicationCommandInteraction,
) {
  return editInJSONResponse({
    request,
    api,
    interaction,
    fileName: 'raw_interaction.json',
    fileContent: interaction,
  })
}
