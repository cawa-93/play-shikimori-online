import retry from 'async-retry'
import { versionCompare, local, sync, push as message } from '../helpers'

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

    local.set({
      runtimeMessagesLastCheck: Date.now()
    })
  }

  // Создаем сообщение об обновлении
  // if (reason === 'update') {


  //   const manifest = chrome.runtime.getManifest()
  //   message({
  //     id: 'update-notify',
  //     html: `${manifest.name} обновлен до версии <b>${manifest.version}</b><br><a href="https://shikimori.one/clubs/2372/topics/285394">Открыть список изменений</a>`,
  //     color: 'success',
  //     payload: { previousVersion }
  //   })
  // }

})



/**
 * Исполнение сетевых запросов
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.contentScriptQuery == 'fetchUrl') {


    backgroundFetch(request).then(resp => sendResponse(resp))


    return true;  // Will respond asynchronously.
  }
});

function backgroundFetch(request) {
  return new Promise(resolve => {
    if (inMemoryCache.has(request.url)) {
      const { response, date } = inMemoryCache.get(request.url)
      const MINUTE = 60000
      if (Date.now() - date <= MINUTE * 5) {
        resolve({ response })
      } else {
        inMemoryCache.delete(request.url)
      }
    }

    const info = new URL(request.url)

    chrome.permissions.contains({
      origins: [`${info.protocol}//${info.hostname}/*`]
    }, async function (granted) {
      if (!granted) {
        resolve({ error: { error: 'not-granted', message: `User not allow access to ${request.url}`, runtime: chrome.runtime.lastError, request } })
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
            resolve({
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
          resolve({ response })
        }
      })
    });
  })
}


chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
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


chrome.browserAction.onClicked.addListener(function () { //Fired when User Clicks ICON
  const url = chrome.runtime.getURL('/UI/index.html#/history')
  chrome.tabs.create({ url, active: true })
});


async function loadBroadcast() {
  try {
    const DAY = 86400000
    let [{ runtimeMessagesLastCheck }, comments] = await Promise.all([
      local.get({
        runtimeMessagesLastCheck: Date.now() - DAY * 5
      }),

      shikimoriCallAPI(
        `/comments/?desc=1&commentable_id=285393&commentable_type=Topic&limit=100&page=1`
      )
    ])

    if (!runtimeMessagesLastCheck) {
      runtimeMessagesLastCheck = Date.now() - DAY * 5
    }

    // await не нужен
    local.set({
      runtimeMessagesLastCheck: Date.now()
    })

    comments = comments
      .filter(comment =>
        comments
        && comment.user.id === 143570
        && /\[broadcast\]/m.test(comment.body)
        && /\[div=runtime-message-broadcast hidden\]/m.test(comment.body)
        && new Date(comment.created_at) >= runtimeMessagesLastCheck
      )

    for (let comment of comments) {
      try {
        const runtimeMessage = JSON.parse(comment.body.replace(/\n+/gim, '<br>').match(/\[div=runtime-message-broadcast hidden\](.+?)\[\/div\]/is)[1])
        message({
          id: comment.id,
          color: runtimeMessage.color || 'info',
          html: `${runtimeMessage.text}<br><b><a class="white--text" href="https://shikimori.one/comments/${comment.id}">${runtimeMessage.linkText}</a></b>`
        })
      } catch (error) {
        console.error('Can\'t show broadcast message', { error })
      }
    }

    console.log({ comments })
  } catch (error) {
    console.error('Can\'t check broadcast message', { error })
  }
}

function shikimoriCallAPI(path, options = {}) {
  return new Promise((resolve, reject) => {

    if (!options.headers) {
      options.headers = {}
    }

    options.headers["Accept"] = "application/json"
    options.headers["Content-Type"] = "application/json"

    options.credentials = 'omit'

    backgroundFetch({
      contentScriptQuery: 'fetchUrl',
      url: `https://shikimori.one/api${path}`,
      options,
    }).then(({ response, error }) => {
      if (error) {
        return reject(error)
      }

      resolve(response)
    })
  })
}

loadBroadcast()
setInterval(() => {
  loadBroadcast()
}, 1000 * 60 * 5);