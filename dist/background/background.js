const sync = {
  get: (keys) => {
    let promise = new Promise((resolve, reject) => {
      chrome.storage.sync.get(keys, (items) => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
    return promise;
  },
  set: (items) => {
    let promise = new Promise((resolve, reject) => {
      chrome.storage.sync.set(items, () => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return promise;
  },
  getBytesInUse: (keys) => {
    let promise = new Promise((resolve, reject) => {
      chrome.storage.sync.getBytesInUse(keys, (items) => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
    return promise;
  },
  remove: (keys) => {
    let promise = new Promise((resolve, reject) => {
      chrome.storage.sync.remove(keys, () => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return promise;
  },
  clear: () => {
    let promise = new Promise((resolve, reject) => {
      chrome.storage.sync.clear(() => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return promise;
  }
};

async function updateAuth() {
  const { userAuth: oldAuth } = await sync.get('userAuth');

  if (!oldAuth || !oldAuth.refresh_token) {
    const code = await getNewCode();

    const response = await fetch('https://shikimori.one/oauth/token', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Play Shikimori; Browser extension; https://github.com/cawa-93/play-shikimori"
      },
      body: JSON.stringify({
        code,
        grant_type: 'authorization_code',
        client_id: "dfe897f91e37ce4fbc5a0f393ac0f7d8dddccc572b83ed52720b73c24a3cef8b",
        client_secret: "eb73006e026d606b9b6a1b5ec00e5cb8580f69e68e2def5ec62e2e665cf3d9f2",
        redirect_uri: "https://shikimori.one/tests/oauth?app=play-shikimori-online"
      })
    });

    const newAuth = await response.json();
    if (newAuth.access_token && newAuth.refresh_token) {
      await sync.set({ 'userAuth': newAuth });
      return newAuth
    } else {
      return Promise.reject(newAuth)
    }
  } else {
    const response = await fetch('https://shikimori.one/oauth/token', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Play Shikimori; Browser extension; https://github.com/cawa-93/play-shikimori"
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: "dfe897f91e37ce4fbc5a0f393ac0f7d8dddccc572b83ed52720b73c24a3cef8b",
        client_secret: "eb73006e026d606b9b6a1b5ec00e5cb8580f69e68e2def5ec62e2e665cf3d9f2",
        refresh_token: oldAuth.refresh_token
      })
    });

    const newAuth = await response.json();
    console.log({ refresh: newAuth });
    if (newAuth.access_token && newAuth.refresh_token) {
      await sync.set({ 'userAuth': newAuth });
      return newAuth
    } else {
      return Promise.reject(newAuth)
    }
  }
}

function getNewCode() {
  return new Promise((resolve, reject) => {
    const url = new URL('https://shikimori.one/oauth/authorize');
    url.searchParams.set('client_id', "dfe897f91e37ce4fbc5a0f393ac0f7d8dddccc572b83ed52720b73c24a3cef8b");
    url.searchParams.set('redirect_uri', "https://shikimori.one/tests/oauth?app=play-shikimori-online");
    url.searchParams.set('response_type', 'code');
    chrome.tabs.create({ active: true, url: url.toString() }, createdTab => {

      const _onRemoved = tabId => {
        if (tabId === createdTab.id) {
          reject({ error: 'tab-removed' });
          _clear();
        }
      };

      const _onUpdated = (tabId, changeInfo) => {
        if (tabId !== createdTab.id || !changeInfo.url) {
          return
        }

        const tabUrl = new URL(changeInfo.url);
        if (tabUrl.hostname !== 'shikimori.one' || tabUrl.pathname !== '/tests/oauth' || tabUrl.searchParams.get('app') !== 'play-shikimori-online') {
          return
        }

        const error = tabUrl.searchParams.get('error');
        const error_description = tabUrl.searchParams.get('error_description');

        if (error || error_description) {
          reject({ error, error_description });
        } else {
          const code = tabUrl.searchParams.get('code');
          resolve(code);
        }

        _clear();
      };

      const _clear = () => {
        chrome.tabs.onRemoved.removeListener(_onRemoved);
        chrome.tabs.onUpdated.removeListener(_onUpdated);
      };

      chrome.tabs.onRemoved.addListener(_onRemoved);
      chrome.tabs.onUpdated.addListener(_onUpdated);
    });
  })
}

updateAuth();


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
    const requestHeaders = details.requestHeaders;
    if (details.initiator !== `chrome-extension://${chrome.runtime.id}`) {
      return { requestHeaders }
    }

    for (let header of requestHeaders) {
      if (header.name === 'User-Agent') {
        header.value = 'Play Shikimori; Browser extension; https://github.com/cawa-93/play-shikimori';
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
