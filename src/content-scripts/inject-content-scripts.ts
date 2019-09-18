import {injectScript} from '@/helpers/injectScript';


const config = new URLSearchParams(location.hash);
if (config.get('#extension-id') === chrome.runtime.id) {
    injectScript(chrome.runtime.getURL('anime-365-player.js'), false, document.body);
}

