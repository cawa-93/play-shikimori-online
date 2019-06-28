import { injectScript } from '../helpers'

const extensionId = (new URL(location.href)).searchParams.get('extension-id')
if (extensionId === chrome.runtime.id) {
  window.addEventListener('load', () => {
    injectScript(chrome.runtime.getURL('content-scripts/anime365-player-events.js'), false, document.body)
  });
}

