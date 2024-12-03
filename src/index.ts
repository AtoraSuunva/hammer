import { REST } from '@discordjs/rest'
import { createHandler } from 'workers-discord'

import { API } from '@discordjs/core/http-only'
import { Toucan } from 'toucan-js'
import { commands, components } from './commands'
import type { CtxWithEnv, Env } from './env.js'

let handler: ReturnType<
  typeof createHandler<CtxWithEnv, Request, Toucan>
> | null = null
let rest: REST | null = null
let api: API | null = null

const worker: ExportedHandler<Env> = {
  fetch: async (request, env, ctx) => {
    let sentry: Toucan | undefined = undefined

    if (env.SENTRY_DSN) {
      sentry ??= new Toucan({
        dsn: env.SENTRY_DSN,
        context: ctx,
        request,
      })
    }

    // Create the handler if it doesn't exist yet
    handler ??= createHandler<CtxWithEnv, Request, Toucan>(
      commands,
      components,
      env.DISCORD_PUBLIC_KEY,
      true,
    )

    // Create the REST client if it doesn't exist yet
    rest ??= new REST({ version: '10' }).setToken(env.DISCORD_BOT_TOKEN)
    api ??= new API(rest)

    const reqClone = request.clone()
    console.log(reqClone.method, reqClone.url)
    try {
      console.log(await reqClone.json())
    } catch (err) {
      console.log('Non-JSON')
    }
    // Run the handler, passing the environment to the command/component context
    ;(ctx as CtxWithEnv).env = env
    ;(ctx as CtxWithEnv).rest = rest
    ;(ctx as CtxWithEnv).api = api

    const resp = await handler(request, ctx as CtxWithEnv, sentry)
    if (resp) return resp

    // Fallback for any requests not handled by the handler
    return new Response('Not found', { status: 404 })
  },
}

export default worker
