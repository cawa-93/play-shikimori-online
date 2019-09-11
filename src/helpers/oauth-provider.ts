import {ShikimoriProvider} from '@/helpers/API/ShikimoriProvider';
import {sync} from './chrome-storage';


export async function getAuth(): Promise<shikimori.Oauth> {
    const {userAuth} = await sync.get<{ userAuth: shikimori.Oauth }>('userAuth');
    return userAuth;
}


export async function updateAuth() {
    const oldAuth = await getAuth();

    if (!oldAuth || !oldAuth.refresh_token) {
        const code = await getNewCode();
        const newAuth = await ShikimoriProvider.fetch<shikimori.Oauth>('/oauth/token', {
            errorMessage: 'Невозможно получить access_token',
            method: 'POST',
            body: JSON.stringify({
                code,
                grant_type: 'authorization_code',
                client_id: process.env.VUE_APP_SHIKIMORI_CLIENT_ID,
                client_secret: process.env.VUE_APP_SHIKIMORI_CLIENT_SECRET,
                redirect_uri: process.env.VUE_APP_SHIKIMORI_REDIRECT_URI,
            }),
        });

        if (newAuth.access_token && newAuth.refresh_token) {
            await sync.set({userAuth: newAuth});
            return newAuth;
        } else {
            return Promise.reject(newAuth);
        }
    } else {
        const newAuth = await ShikimoriProvider.fetch<shikimori.Oauth>('/oauth/token', {
            errorMessage: 'Невозможно обновить access_token',
            method: 'POST',
            body: JSON.stringify({
                grant_type: 'refresh_token',
                client_id: process.env.VUE_APP_SHIKIMORI_CLIENT_ID,
                client_secret: process.env.VUE_APP_SHIKIMORI_CLIENT_SECRET,
                refresh_token: oldAuth.refresh_token,
            }),
        });

        if (newAuth.access_token && newAuth.refresh_token) {
            await sync.set({userAuth: newAuth});
            return newAuth;
        } else {
            return Promise.reject(newAuth);
        }
    }
}


export function getNewCode() {
    return new Promise((resolve, reject) => {
        const url = new URL('https://shikimori.one/oauth/authorize');
        url.searchParams.set('client_id', process.env.VUE_APP_SHIKIMORI_CLIENT_ID);
        url.searchParams.set('redirect_uri', process.env.VUE_APP_SHIKIMORI_REDIRECT_URI);
        url.searchParams.set('response_type', 'code');
        chrome.tabs.query({active: true}, ([selectedTab]) =>
            chrome.tabs.create({active: true, url: url.toString()}, (createdTab: chrome.tabs.Tab) => {

                const onRemoved = (tabId: number) => {
                    if (tabId === createdTab.id) {
                        reject({error: 'tab-removed'});
                        clear();
                    }
                };

                const onUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
                    if (tabId !== createdTab.id || !changeInfo.url) {
                        return;
                    }

                    const tabUrl = new URL(changeInfo.url);
                    if (tabUrl.hostname !== 'shikimori.one'
                        || tabUrl.pathname !== '/tests/oauth'
                        || tabUrl.searchParams.get('app') !== 'play-shikimori-online') {
                        return;
                    }

                    const error = tabUrl.searchParams.get('error');
                    const errorDescription = tabUrl.searchParams.get('error_description');

                    if (error || errorDescription) {
                        reject({error, error_description: errorDescription});
                    } else {
                        const code = tabUrl.searchParams.get('code');
                        resolve(code);
                    }

                    clear();
                    if (selectedTab && selectedTab.id) {
                        chrome.tabs.update(selectedTab.id, {active: true}, () => {
                            if (createdTab && createdTab.id) {
                                chrome.tabs.remove(createdTab.id);
                            }
                        });
                    }

                };

                const clear = () => {
                    chrome.tabs.onRemoved.removeListener(onRemoved);
                    chrome.tabs.onUpdated.removeListener(onUpdated);
                };

                chrome.tabs.onRemoved.addListener(onRemoved);
                chrome.tabs.onUpdated.addListener(onUpdated);
            }));

    });
}

