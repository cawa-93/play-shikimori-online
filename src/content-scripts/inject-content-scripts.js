import {injectScript} from '../helpers'


const config = new URLSearchParams(location.hash)
if (config.get('#extension-id') === chrome.runtime.id) {
	window.addEventListener('load', () => {
		injectScript(chrome.runtime.getURL('content-scripts/anime365-player-events.js'), false, document.body)
	})
}

