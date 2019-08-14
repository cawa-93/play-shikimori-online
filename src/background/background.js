import * as Sentry                    from '@sentry/browser'
import retry                          from 'async-retry'
import {local, push as message, sync} from '../helpers'


Sentry.init({
	dsn: process.env.SENTRY_DSN,
	release: `${chrome.runtime.getManifest().name}@${chrome.runtime.getManifest().version}`,
	environment: process.env.NODE_ENV || 'dev',
})

/**
 * Отслеживание установок и обновлений
 */
chrome.runtime.onInstalled.addListener(async ({reason}) => {
	// reason = ENUM "install", "update", "chrome_update", or "shared_module_update"

	if (reason === 'install') {
		// Сохраняем время установки расширения
		sync.set({
			installAt: Date.now(),
		})

		// Загружать сообщения из рассылки начиная с времени установки
		local.set({
			runtimeMessagesLastCheck: Date.now(),
		})
	}

	// Создаем сообщение об обновлении
	if (reason === 'update') {
		const version = chrome.runtime.getManifest().version.replace(/\./g, '-')
		loadRuntimeMessages(0, `update-${version}`, 1)
	}

})


/**
 * Исполнение сетевых запросов
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.contentScriptQuery == 'fetchUrl') {
		makeRequest(request).then(resp => sendResponse(resp))
		return true // Will respond asynchronously.
	}
})


chrome.webRequest.onBeforeSendHeaders.addListener(
	function (details) {
		const requestHeaders = details.requestHeaders
		if (details.initiator !== `chrome-extension://${chrome.runtime.id}`) {
			return {requestHeaders}
		}

		for (let header of requestHeaders) {
			if (header.name === 'User-Agent') {
				const manifest = chrome.runtime.getManifest()
				header.value = `${manifest.name}; Browser extension; ${manifest.homepage_url}`
				break
			}
		}
		return {requestHeaders}
	},
	{
		urls: [
			'https://shikimori.org/api/*',
			'https://shikimori.one/api/*',
			'https://shikimori.org/oauth/*',
			'https://shikimori.one/oauth/*',
			'https://smotret-anime-365.ru/api/*',
		],
	},
	['requestHeaders', 'blocking'],
)


chrome.browserAction.onClicked.addListener(function () { //Fired when User Clicks ICON
	const url = chrome.runtime.getURL('/UI/index.html#/history')
	chrome.tabs.create({url, active: true})
})


async function loadRuntimeMessages(minTimestamp, broadcastType = 'broadcast', maxLoadedMessages = 10) {
	const commentWithMessages = []
	let page = 1
	let lastCommentTimestamp = Date.now()
	try {
		while (minTimestamp <= lastCommentTimestamp && commentWithMessages.length < maxLoadedMessages) {
			const {response: comments, error} = await makeRequest({
				url: `https://shikimori.one/api/comments/?desc=1&commentable_id=285393&commentable_type=Topic&limit=100&page=${page++}`,
				options: {
					headers: {
						['Accept']: 'application/json',
						['Content-Type']: 'application/json',
					},
				},
			})

			if (error) {
				throw error // Обработчик этой ошибки находится в блоке catch ниже
			}

			if (!comments.length) {
				break
			}

			lastCommentTimestamp = new Date(comments[comments.length - 1].created_at).getTime()

			commentWithMessages.push(
				...comments
					.filter(comment =>
						comment.user.id === 143570
						&& new RegExp(`\\[div=runtime-message-${broadcastType} hidden\\]`, 'mi').test(comment.body)
						&& new Date(comment.created_at).getTime() >= minTimestamp,
					),
			)

		}
	} catch (e) {
		if (e.error === 'not-granted') {
			console.error('Невозможно загрузить уведомления: вы запретили доступ к shikimori.one')
		} else {
			console.error(`Can't check broadcast message`, {error})
			Sentry.captureException(error)
		}
	}

	if (commentWithMessages.length) {
		for (let comment of commentWithMessages) {
			try {
				const runtimeMessage = JSON.parse(
					comment.body
						.replace(/\n+/gim, '<br>')
						.match(new RegExp(`\\[div=runtime-message-${broadcastType} hidden\\](.+?)\\[\\/div\\]`, 'im'))[1],
				)

				runtimeMessage.id = comment.id

				if (!runtimeMessage.link) {
					runtimeMessage.link = `https://shikimori.one/comments/${comment.id}`
				}

				if (!runtimeMessage.html) {
					const rows = []

					if (runtimeMessage.text) rows.push(runtimeMessage.text)
					if (runtimeMessage.linkText) rows.push(`<b><a class="white--text" href="${runtimeMessage.link}">${runtimeMessage.linkText}</a></b>`)

					runtimeMessage.html = rows.join('<br>')
				}

				message(runtimeMessage)
			} catch (e) {
				console.error(`Can't show broadcast message`, {error: e, comment})
				Sentry.captureException(e)
			}
		}
	}
}


async function loadBroadcast() {
	let {runtimeMessagesLastCheck} = await local.get('runtimeMessagesLastCheck')

	// Сохраняем время запуска для ограничения следующей итерации
	await local.set({
		runtimeMessagesLastCheck: Date.now(),
	})

	if (!runtimeMessagesLastCheck || isNaN(runtimeMessagesLastCheck)) {
		runtimeMessagesLastCheck = Date.now()
		return []
	}

	return loadRuntimeMessages(runtimeMessagesLastCheck, 'broadcast')
}


setInterval(loadBroadcast, /* каждые 15 минут */1000 * 60 * 15)

async function makeRequest({url, options}) {

	/**
	 * TODO: Здесь необходимо проверять находится ли запрос в кэше
	 */
		// if (options && options.method && options.method === 'GET' && options.maxAge) {
		// }

	let isGranted = await isPermissionsGranted(url)

	if (!isGranted) {
		try {
			isGranted = await requestPermissions([
				'webRequest',
				'webRequestBlocking',
				'storage',
				'tabs',
			], [
				'https://shikimori.one/*',
				'https://shikimori.org/*',
				'https://smotret-anime-365.ru/*',
				'https://api.jikan.moe/*',
			])
		} catch (e) {
		}
	}

	if (!isGranted) {
		return {
			error: {
				error: 'not-granted',
				message: `User not allow access to ${url}`,
				runtime: chrome.runtime.lastError,
				request: {url, options},
			},
		}
	}

	const {response, error} = await fetchAndRetry({url, options})
	if (error) {
		return {error}
	}

	/**
	 * TODO: Здень необходимо кешировать полученный ответ
	 */

	return {response}

}


/**
 * Проверяет разрешил ли пользователь доступ к указанному URL
 * @param {string} url URL для проверки
 */
function isPermissionsGranted(url) {
	return new Promise(resolve => {
		const info = new URL(url)
		chrome.permissions.contains(
			{
				origins: [`${info.protocol}//${info.hostname}/*`],
			},
			resolve,
		)
	})
}


function requestPermissions(permissions = [], origins = []) {
	return new Promise(resolve => {
		chrome.permissions.request({
				permissions,
				origins,
			},
			resolve,
		)
	})
}


/**
 * Выполняет указанный запрос и в случае ошибки повторяет попытку
 * @param {*} request
 */
function fetchAndRetry(request) {
	return new Promise(resolve => {
		retry(async () => {
			const resp = await fetch(request.url, request.options)
			if (!resp.ok) {

				if (resp.status !== 429 && resp.status >= 400 && resp.status < 500) {
					let response = await resp.text()

					if (response) {
						try {
							response = JSON.parse(response)
						} catch (e) {
						}
					}
					resolve({
						error: {
							status: resp.status,
							message: resp.statusText,
							request,
							response,
						},
					})
				} else {
					throw resp.status
				}
			} else {
				const response = await resp.json()
				resolve({response})
			}
		})
	})

}


async function setBadgeMessageCount() {
	let {runtimeMessages} = await local.get('runtimeMessages')
	if (!runtimeMessages || !Array.isArray(runtimeMessages)) {
		return chrome.browserAction.setBadgeText({text: ``})
	}

	const count = runtimeMessages.filter(m => !!m.important).length
	const text = count ? `${count}` : ''
	return chrome.browserAction.setBadgeText({text})
}


setBadgeMessageCount()

chrome.storage.onChanged.addListener(({runtimeMessages}) => {
	if (runtimeMessages) {
		return setBadgeMessageCount()
	}
})