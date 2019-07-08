chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
  if (reason !== 'update') {  // reason = ENUM "install", "update", "chrome_update", or "shared_module_update"
    return
  }

  const manifest = chrome.runtime.getManifest()

  chrome.storage.local.get({ runtimeMessages: [] }, ({ runtimeMessages }) => {

    runtimeMessages.push({
      html: `${manifest.name} обновлен до версии <b>${manifest.version}</b><br><a href="https://shikimori.one/clubs/2372/topics/285394">Открыть список изменений</a>`,
      data: { previousVersion }
    })

    chrome.storage.local.set({ runtimeMessages })
  })
})


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