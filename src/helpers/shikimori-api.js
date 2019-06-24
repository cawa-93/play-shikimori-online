export function shikimoriAPI(path, options = {}) {
  const url = `https://shikimori.one/api${path}`

  return shikimoriCallAPI(url, options)
}


export function shikimoriOauthAPI(path, options = {}) {
  const url = `https://shikimori.one/oauth${path}`

  return shikimoriCallAPI(url, options)
}


export function shikimoriCallAPI(url, options = {}) {
  return new Promise((resolve, reject) => {

    if (!options.headers) {
      options.headers = {}
    }

    options.headers["Accept"] = "application/json"
    options.headers["Content-Type"] = "application/json"

    options.credentials = 'omit'

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

export default shikimoriAPI