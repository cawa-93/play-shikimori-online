import * as Sentry                                    from '@sentry/browser'
import retry                                          from 'async-retry'
import {local, push as message, sync, versionCompare} from '../helpers'


Sentry.init({
	dsn: process.env.SENTRY_DSN,
	release: `${chrome.runtime.getManifest().name}@${chrome.runtime.getManifest().version}`,
	environment: process.env.NODE_ENV || 'dev',
})

/**
 * Отслеживание установок и обновлений
 */
chrome.runtime.onInstalled.addListener(async ({reason, previousVersion}) => {
	// reason = ENUM "install", "update", "chrome_update", or "shared_module_update"

	// Сохраняем время установки расширения или время обновления начиная с версии 0.4.11
	if (reason === 'install' || (
		reason === 'update' && versionCompare('0.4.11', previousVersion) >= 0
	)) {
		sync.set({
			installAt: Date.now(),
		})

		local.set({
			runtimeMessagesLastCheck: Date.now(),
		})
	}

	// Создаем сообщение об обновлении
	// if (reason === 'update') {


	//   const manifest = chrome.runtime.getManifest()
	//   message({
	//     id: 'update-notify',
	//     html: `${manifest.name} обновлен до версии <b>${manifest.version}</b><br><a
	// href="https://shikimori.one/clubs/2372/topics/285394">Открыть список изменений</a>`, color: 'success', payload:
	// { previousVersion } }) }

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


async function loadBroadcast() {
	try {
		const DAY = 86400000
		let [{runtimeMessagesLastCheck}, {response: comments, error}] = await Promise.all([
			local.get({
				runtimeMessagesLastCheck: Date.now() - DAY * 5,
			}),

			makeRequest({
				url: `https://shikimori.one/api/comments/?desc=1&commentable_id=285393&commentable_type=Topic&limit=100&page=1`,
				options: {
					headers: {
						['Accept']: 'application/json',
						['Content-Type']: 'application/json',
					},
				},
			}),
		])

		if (!runtimeMessagesLastCheck) {
			runtimeMessagesLastCheck = Date.now() - DAY * 5
		}

		// await не нужен
		local.set({
			runtimeMessagesLastCheck: Date.now(),
		})

		if (error) {
			throw error // Обработчик этой ошибки находится в блоке catch ниже
		}

		// Отфильтровывает все комментарии в которых нет кодов [broadcast] и [div=runtime-message-broadcast hidden]
		comments = comments
			.filter(comment =>
				comments
				&& comment.user.id === 143570
				&& /\[broadcast\]/m.test(comment.body)
				&& /\[div=runtime-message-broadcast hidden\]/m.test(comment.body)
				&& new Date(comment.created_at) >= runtimeMessagesLastCheck,
			)

		for (let comment of comments) {
			try {
				const runtimeMessage = JSON.parse(comment.body.replace(/\n+/gim, '<br>').match(/\[div=runtime-message-broadcast hidden\](.+?)\[\/div\]/im)[1])
				message({
					id: comment.id,
					color: runtimeMessage.color || 'info',
					html: `${runtimeMessage.text}<br><b><a class="white--text" href="https://shikimori.one/comments/${comment.id}">${runtimeMessage.linkText}</a></b>`,
				})
			} catch (error) {
				console.error(`Can't show broadcast message`, {error})
			}
		}

	} catch (error) {
		console.error(`Can't check broadcast message`, {error})
	}
}


loadBroadcast()
setInterval(() => {
	loadBroadcast()
}, 1000 * 60 * 5)


async function makeRequest({url, options}) {

	/**
	 * TODO: Здесь необходимо проверять находится ли запрос в кэше
	 */
		// if (options && options.method && options.method === 'GET' && options.maxAge) {
		// }

	const isGranted = await isPermissionsGranted(url)
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


chrome.storage.onChanged.addListener(({runtimeMessages}) => {
	if (runtimeMessages) {
		const count = (
			runtimeMessages.newValue || []
		).length
		// await не нужен
		setBadgeMessageCount(count)
	}
})

local.get({runtimeMessages: []}).then(({runtimeMessages}) => {
	const count = (
		runtimeMessages || []
	).length
	// await не нужен
	setBadgeMessageCount(count)
})


function setBadgeMessageCount(count) {
	return new Promise(resolve => {
		if (count) {
			// @ts-ignore
			chrome.browserAction.setBadgeText({text: `${count}`}, () => resolve())
		} else {
			// @ts-ignore
			chrome.browserAction.setBadgeText({text: ``}, () => resolve())
		}
	})
}