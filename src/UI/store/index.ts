import {sync} from '@/helpers/chrome-storage';
import Vue from 'vue';
import Vuex from 'vuex';
import Worker from 'worker-loader!./worker.ts';
import {RootState} from './types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    plugins: [
        (store) => {
            chrome.storage.onChanged.addListener((changes) => {
                if (changes.userAuth) {
                    store.commit('profile/loadCredentialsFromServer', changes.userAuth.newValue);
                    store.dispatch('profile/loadUser');
                }
            });


            store.subscribe((mutation, state) => {
                // вызывается после каждой мутации
                // мутация передаётся в формате `{ type, payload }`.

                if (mutation.type === 'profile/saveCredentials' || mutation.type === 'profile/logout') {
                    sync.set({userAuth: state.profile.credentials});
                }
            });
        },
    ],
});

const worker = new Worker();

export {
    worker,
};
