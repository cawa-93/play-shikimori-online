import { local } from '../helpers'


export async function push(message) {
  const { runtimeMessages } = await local.get({ runtimeMessages: [] })
  runtimeMessages.push(message)
  await local.set({ runtimeMessages })
}

export async function shift(...args) {
  const { runtimeMessages } = await local.get({ runtimeMessages: [] });
  const message = runtimeMessages.shift(...args)
  await local.set({ runtimeMessages });
  return message
}