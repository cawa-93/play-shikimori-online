import {local} from './chrome-storage'


export async function push(message) {
	if (!message.html) {
		return
	}

	const defaults = {
		important: false,
		color: 'info',
	}

	message = Object.assign({}, defaults, message)
	let {runtimeMessages} = await local.get({runtimeMessages: []})

	// Если у сообщения указан уникальный ID,
	// необходимо удалить из очереди сообщений все сообщения с аналогичным ID.
	// Это необходимо, чтобы избегать повторяющихся однотипных сообщений
	if (message.id) {
		runtimeMessages = runtimeMessages.filter(m => m.id && m.id !== message.id)
	}

	runtimeMessages.push(message)
	await local.set({runtimeMessages})
}


export async function shift(...args) {
	const {runtimeMessages} = await local.get({runtimeMessages: []})
	const message = runtimeMessages.shift(...args)
	await local.set({runtimeMessages})
	return message
}


export function errorMessage(str) {
	return push({
		color: 'error',
		html: str,
		mode: 'single',
		timeout: 15000,
	})
}