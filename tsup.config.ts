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
    await registerCommands(
      // biome-ignore lint/style/noNonNullAssertion: the error if you forget is your problem
      process.env['DISCORD_CLIENT_ID']!,
      // biome-ignore lint/style/noNonNullAssertion: the error if you forget is your problem
      process.env['DISCORD_CLIENT_SECRET']!,
      commands,
      true,
      process.env['DISCORD_GUILD_ID'],
    )
  },
})
