import { getAuth, updateAuth } from './oauth-provider'

export function shikimoriAPI(path, options = {}) {
  return new Promise((resolve, reject) => {

    const url = `https://shikimori.one/api${path}`

    if (!options.headers) {
      options.headers = {}
    }

    options.headers["Accept"] = "application/json"
    options.headers["Content-Type"] = "application/json"
    options.headers["User-Agent"] = "Play Shikimori; Browser extension; https://github.com/cawa-93/play-shikimori"

    options.credentials = 'include'

    chrome.runtime.sendMessage({
      contentScriptQuery: 'fetchUrl',
      url,
      options,
    },
      ({ response, error }) => {
        if (error) {
          return reject(error)
        }

        resolve(response)
      })
  })
}

// export async function shikimoriAuthAPI(path, options = {}) {
//   let auth = await getAuth()

//   if (!auth || !auth.access_token || ((auth.created_at + auth.expires_in) * 1000 <= Date.now())) {
//     auth = await updateAuth()
//   }

//   return await shikimoriAPI(path, options)
// }

export default shikimoriAPI