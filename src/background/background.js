chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.contentScriptQuery == 'fetchUrl') {

      fetch(request.url, request.options)
        .then(response => response.json())
        .then(response => sendResponse({ response }))
        .catch(error => sendResponse({ error }));

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
        header.value = 'Play Shikimori; Browser extension; https://github.com/cawa-93/play-shikimori'
        break;
      }
    }
    return { requestHeaders };
  },
  { urls: ["https://shikimori.org/api/*", "https://shikimori.one/api/*", "https://smotret-anime-365.ru/api/*"] },
  ["requestHeaders", 'blocking']);