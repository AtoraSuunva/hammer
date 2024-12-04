import type { Toucan } from 'toucan-js'
import type { Command, Component } from 'workers-discord'
import type { CtxWithEnv } from '../env'
import { raw_message } from './raw_message'
import { raw_user } from './raw_user'

export const commands: Command<CtxWithEnv, Request, Toucan>[] = [
  raw_message,
  raw_user,
  raw_message,
]

export const components: Component<CtxWithEnv, Request, Toucan>[] = []
