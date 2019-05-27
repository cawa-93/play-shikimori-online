(window.api = window.api || {}).shikimori = function (path) {

  return new Promise((resolve, reject) => {
    const url = 'https://shikimori.one/api' + path
    let headers = new Headers({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Play Shikimori; Browser extension; https://github.com/cawa-93/play-shikimori"
    });

    chrome.runtime.sendMessage({
      contentScriptQuery: 'fetchUrl',
      url,
      options: { headers }
    },
      ({ response, error }) => {
        if (error) {
          return reject(error)
        }

        resolve(response)
      })


  })
}