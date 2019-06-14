function myanimelistAPI(path, options = {}) {

  return new Promise((resolve, reject) => {
    const url = 'https://api.jikan.moe/v3' + path
    let headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };

    options.headers = headers
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

export { myanimelistAPI }
export default myanimelistAPI