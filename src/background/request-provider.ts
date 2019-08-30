/**
 * Исполнение сетевых запросов
 */
import {RequestProvider} from '@/helpers/API/RequestProvider';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.contentScriptQuery === 'fetchUrl') {
        RequestProvider.fetch(request.url, request.options)
            .then((response) => sendResponse({response}))
            .catch((error) => sendResponse({error: error.toJSON ? error.toJSON() : error}));

        return true; // Will respond asynchronously.
    }
});


chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const requestHeaders = details.requestHeaders;
        if (!requestHeaders || details.initiator !== `chrome-extension://${chrome.runtime.id}`) {
            return {requestHeaders};
        }

        for (const header of requestHeaders) {
            if (header.name === 'User-Agent') {
                const manifest = chrome.runtime.getManifest();
                header.value = `${manifest.name}; Browser extension; ${manifest.homepage_url}`;
                break;
            }
        }
        return {requestHeaders};
    },
    {
        urls: [
            'https://shikimori.one/api/*',
            'https://shikimori.one/oauth/*',
            'https://smotret-anime-365.ru/api/*',
        ],
    },
    ['requestHeaders', 'blocking'],
);
