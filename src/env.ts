import type { API } from '@discordjs/core/http-only'
import type { REST } from '@discordjs/rest'

export interface Env {
  DISCORD_PUBLIC_KEY: string
  DISCORD_BOT_TOKEN: string
  SENTRY_DSN?: string
}

export interface CtxWithEnv extends ExecutionContext {
  env: Env
  rest: REST
  api: API
}
