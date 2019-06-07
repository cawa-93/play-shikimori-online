async function shikimoriAPI(path, options = {}) {
  let domain = sessionStorage.getItem('shiki-domain')
  if (!domain) {
    domain = await getShikiDomain()
    sessionStorage.setItem('shiki-domain', domain)
  }
  const url = `https://${domain}/api${path}`
  return callAPI(url, options)
}

async function getShikiDomain() {
  let domain = 'shikimori.one'
  try {
    const resp = await callAPI('https://shikimori.org/api/users/whoami')
    if (resp && resp.id) {
      domain = 'shikimori.org'
    }
  } catch (e) { }

  return domain
}

function callAPI(fullURL, options = {}) {
  return new Promise((resolve, reject) => {

    let headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Play Shikimori; Browser extension; https://github.com/cawa-93/play-shikimori"
    };

    options.headers = headers
    options.credentials = 'include'

    chrome.runtime.sendMessage({
      contentScriptQuery: 'fetchUrl',
      url: fullURL,
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

export { shikimoriAPI }
export default shikimoriAPI