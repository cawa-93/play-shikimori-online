import {sync} from '@/helpers/chrome-storage';

import Vue from 'vue';
import Vuex from 'vuex';
import Worker from 'worker-loader!./worker.ts';
import {SelectedTranslation, WatchingHistoryItem} from '../../../types/UI';
import {RootState} from './types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    plugins: [
        async (store) => {
            chrome.storage.onChanged.addListener((changes) => {
                if (changes.userAuth) {
                    store.commit('profile/loadCredentialsFromServer', changes.userAuth.newValue);
                    store.dispatch('profile/loadUser');
                }

                if (changes.watching_history) {
                    store.commit('player/setWatchingHistory', changes.watching_history.newValue || []);
                }

                if (changes.selectedTranslations) {
                    store.commit('player/setSelectedTranslations', changes.selectedTranslations.newValue || []);
                }
            });


            store.subscribe((mutation, state) => {
                // вызывается после каждой мутации
                // мутация передаётся в формате `{ type, payload }`.

                if (mutation.type === 'profile/saveCredentials' || mutation.type === 'profile/logout') {
                    sync.set({userAuth: state.profile.credentials});
                }
            });


            const {
                userAuth,
                watching_history,
                selectedTranslations,
            } = await sync.get<{
                userAuth: shikimori.Oauth | null
                watching_history: WatchingHistoryItem[],
                selectedTranslations: SelectedTranslation[],
            }>({
                userAuth: null,
                watching_history: [],
                selectedTranslations: [],
            });

            if (userAuth) {
                store.commit('profile/loadCredentialsFromServer', userAuth);
                store.dispatch('profile/loadUser');
            }

            if (watching_history) {
                store.commit('player/setWatchingHistory', watching_history);
            }

            if (selectedTranslations) {
                store.commit('player/setSelectedTranslations', selectedTranslations);
            }
        },
    ],
});

const worker = new Worker();

export {
    worker,
};
