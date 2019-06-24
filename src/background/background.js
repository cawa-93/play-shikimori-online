chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.contentScriptQuery == 'fetchUrl') {

      const info = new URL(request.url)

      chrome.permissions.contains({
        origins: [`${info.protocol}//${info.hostname}/*`]
      }, function (granted) {
        if (granted) {
          fetch(request.url, request.options)
            .then(response => response.json())
            .then(response => sendResponse({ response }))
            .catch(error => sendResponse({ error }));
        } else {
          sendResponse({ error: { error: 'not-granted', message: `User not allow access to ${request.url}`, runtime: chrome.runtime.lastError, request } })
        }
      });


      return true;  // Will respond asynchronously.
    }
  }
);


chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const requestHeaders = details.requestHeaders
    if (details.initiator !== `chrome-extension://${chrome.runtime.id}`) {
      return { requestHeaders }
    }

    for (let header of requestHeaders) {
      if (header.name === 'User-Agent') {
        const manifest = chrome.runtime.getManifest()
        header.value = `${manifest.name}; Browser extension; ${manifest.homepage_url}`
        break;
      }
    }
    return { requestHeaders };
  },
  {
    urls: [
      "https://shikimori.org/api/*",
      "https://shikimori.one/api/*",
      "https://shikimori.org/oauth/*",
      "https://shikimori.one/oauth/*",
      "https://smotret-anime-365.ru/api/*"
    ]
  },
  ["requestHeaders", 'blocking']);