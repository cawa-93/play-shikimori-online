import { sync as storage } from './chrome-storage'

export async function rotate(key, value) {
  let { [key]: array } = await storage.get({ [key]: [] })
  array = (array || []).filter(item => item && item.id !== value.id)
  array.unshift(value)

  while (array.length) {
    try {
      await storage.set({ [key]: array })
      break
    } catch (error) {
      if (error.message === 'QUOTA_BYTES_PER_ITEM quota exceeded') {
        array.pop()
      } else {
        return Promise.reject(error)
      }
    }
  }

  return array
}