chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.contentScriptQuery == 'fetchUrl') {

      console.log(request)

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
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'User-Agent') {
        details.requestHeaders[i].value = 'Play Shikimori; Browser extension; https://github.com/cawa-93/play-shikimori'
        break;
      }
    }
    console.log(details.requestHeaders)
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://shikimori.org/api/*", "https://shikimori.one/api/*", "https://smotret-anime-365.ru/api/*"] },
  ["requestHeaders", 'blocking']);