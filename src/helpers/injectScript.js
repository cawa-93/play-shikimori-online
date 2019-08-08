/**
 * Вставляет скрипт на страницу
 * @param {string} src URL script
 * @param {boolean} async async attribule
 */
export function injectScript(src, async = true, parent = document.head) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.async = async
		script.src = src
		script.addEventListener('load', resolve)
		script.addEventListener('error', () => reject('Error loading script.'))
		script.addEventListener('abort', () => reject('Script loading aborted.'))
		parent.appendChild(script)
	})
}


export default injectScript