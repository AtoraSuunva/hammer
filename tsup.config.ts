import { default as sentryEsbuildPlugin } from '@sentry/esbuild-plugin'
import dotenv from 'dotenv'
import { type Options, defineConfig } from 'tsup'
import { registerCommands } from 'workers-discord'
import { commands } from './src/commands'

dotenv.config({ path: '.dev.vars' })

type Plugin = NonNullable<Options['esbuildPlugins']>[number]

const sentry =
  process.env['SENTRY_ORG'] &&
  process.env['SENTRY_PROJECT'] &&
  process.env['SENTRY_AUTH_TOKEN']
    ? (sentryEsbuildPlugin({
        org: process.env['SENTRY_ORG'],
        project: process.env['SENTRY_PROJECT'],
        authToken: process.env['SENTRY_AUTH_TOKEN'],
      }) as Plugin)
    : undefined

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  esbuildPlugins: sentry ? [sentry] : [],
  outExtension: () => ({ js: '.js' }),
  onSuccess: async () => {
    if (process.env['NODE_ENV'] !== 'production') return

    if (!process.env['DISCORD_CLIENT_ID']) {
      console.error('DISCORD_CLIENT_ID is not set')
      return
    }

    if (!process.env['DISCORD_CLIENT_SECRET']) {
      console.error('DISCORD_CLIENT_SECRET is not set')
      return
    }

    console.log('Registering commands...')

    await registerCommands(
      process.env['DISCORD_CLIENT_ID'],
      process.env['DISCORD_CLIENT_SECRET'],
      commands,
      true,
      process.env['DISCORD_GUILD_ID'],
    )

    console.log('Commands registered!')
  },
})
