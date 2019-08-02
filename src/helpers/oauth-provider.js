import { sync } from "./chrome-storage";
import { shikimoriOauthAPI } from "./shikimori-api";

export async function getAuth() {
  const { userAuth } = await sync.get('userAuth')
  return userAuth
}

export async function updateAuth() {
  const oldAuth = await getAuth()

  if (!oldAuth || !oldAuth.refresh_token) {
    const code = await getNewCode()
    const newAuth = await shikimoriOauthAPI('/token', {
      method: 'POST',
      body: JSON.stringify({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.SHIKIMORI_CLIENT_ID,
        client_secret: process.env.SHIKIMORI_CLIENT_SECRET,
        redirect_uri: process.env.SHIKIMORI_REDIRECT_URI
      })
    })

    if (newAuth.access_token && newAuth.refresh_token) {
      await sync.set({ 'userAuth': newAuth })
      return newAuth
    } else {
      return Promise.reject(newAuth)
    }
  } else {
    const newAuth = await shikimoriOauthAPI('/token', {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.SHIKIMORI_CLIENT_ID,
        client_secret: process.env.SHIKIMORI_CLIENT_SECRET,
        refresh_token: oldAuth.refresh_token
      })
    })

    if (newAuth.access_token && newAuth.refresh_token) {
      await sync.set({ userAuth: newAuth })
      return newAuth
    } else {
      return Promise.reject(newAuth)
    }
  }
}

export function getNewCode() {
  return new Promise((resolve, reject) => {
    const url = new URL('https://shikimori.one/oauth/authorize')
    url.searchParams.set('client_id', process.env.SHIKIMORI_CLIENT_ID)
    url.searchParams.set('redirect_uri', process.env.SHIKIMORI_REDIRECT_URI)
    url.searchParams.set('response_type', 'code')
    chrome.tabs.getSelected(selectedTab =>
      chrome.tabs.create({ active: true, url: url.toString() }, createdTab => {

        const _onRemoved = tabId => {
          if (tabId === createdTab.id) {
            reject({ error: 'tab-removed' })
            _clear()
          }
        }

        const _onUpdated = (tabId, changeInfo) => {
          if (tabId !== createdTab.id || !changeInfo.url) {
            return
          }

          const tabUrl = new URL(changeInfo.url)
          if (tabUrl.hostname !== 'shikimori.one' || tabUrl.pathname !== '/tests/oauth' || tabUrl.searchParams.get('app') !== 'play-shikimori-online') {
            return
          }

          const error = tabUrl.searchParams.get('error')
          const error_description = tabUrl.searchParams.get('error_description')

          if (error || error_description) {
            reject({ error, error_description })
          } else {
            const code = tabUrl.searchParams.get('code')
            resolve(code)
          }

          _clear()
          chrome.tabs.update(selectedTab.id, { active: true }, () => chrome.tabs.remove(createdTab.id))

        }

        const _clear = () => {
          chrome.tabs.onRemoved.removeListener(_onRemoved)
          chrome.tabs.onUpdated.removeListener(_onUpdated)
        }

        chrome.tabs.onRemoved.addListener(_onRemoved)
        chrome.tabs.onUpdated.addListener(_onUpdated)
      }))

  })
}

