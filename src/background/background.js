import retry from 'async-retry'
import { versionCompare, sync, push as message } from '../helpers'

const inMemoryCache = new Map()


/**
 * Отслеживание установок и обновлений
 */
chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  // reason = ENUM "install", "update", "chrome_update", or "shared_module_update"

  // Сохраняем время установки расширения или время обновления начиная с версии 0.4.11
  if (reason === 'install' || (reason === 'update' && versionCompare('0.4.11', previousVersion) >= 0)) {
    sync.set({
      installAt: Date.now()
    })
  }

  // Создаем сообщение об обновлении
  if (reason === 'update') {
    const manifest = chrome.runtime.getManifest()
    message({
      html: `${manifest.name} обновлен до версии <b>${manifest.version}</b><br><a href="https://shikimori.one/clubs/2372/topics/285394">Открыть список изменений</a>`,
      color: 'success',
      payload: { previousVersion }
    })
  }

})



/**
 * Исполнение сетевых запросов
 */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.contentScriptQuery == 'fetchUrl') {

      if (inMemoryCache.has(request.url)) {
        const { response, date } = inMemoryCache.get(request.url)
        const MINUTE = 60000
        if (Date.now() - date <= MINUTE * 5) {
          sendResponse({ response })
          return
        } else {
          inMemoryCache.delete(request.url)
        }
      }

      const info = new URL(request.url)

      chrome.permissions.contains({
        origins: [`${info.protocol}//${info.hostname}/*`]
      }, async function (granted) {
        if (!granted) {
          sendResponse({ error: { error: 'not-granted', message: `User not allow access to ${request.url}`, runtime: chrome.runtime.lastError, request } })
          return
        }

        await retry(async bail => {
          const resp = await fetch(request.url, request.options)
          if (!resp.ok) {

            if (resp.status >= 400 && resp.status < 500) {
              let response = await resp.text()

              if (response) {
                try {
                  response = JSON.parse(response)
                } catch (e) { }
              }
              sendResponse({
                error: {
                  status: resp.status,
                  message: resp.statusText,
                  request,
                  response,
                }
              })
            } else {
              throw resp.status
            }
          } else {
            const response = await resp.json()

            if (!request.options || !request.options.method || request.options.method === 'GET') {
              inMemoryCache.set(request.url, { response, date: Date.now() })
            }
            sendResponse({ response })
          }
        })
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