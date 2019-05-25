window.apiCall = function (path) {

  return new Promise((resolve, reject) => {
    const url = 'https://smotretanime.ru/api' + path
    let headers = new Headers({
      // "cache-control": "no-cache",
      // "Postman-Token": "27094d24-2917-4dd7-a302-d348ad352d84"
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