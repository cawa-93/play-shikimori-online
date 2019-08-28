import {sync} from '@/helpers';
import {Player} from '@/UI/store/player';
import {Profile} from '@/UI/store/profile';
import {Shikimori} from '@/UI/store/shikimori';
import Vue from 'vue';
import Vuex from 'vuex';
import {getModule} from 'vuex-module-decorators';
// @ts-ignore
import Worker from 'worker-loader!./worker.ts';
import {RootState} from './types';

Vue.use(Vuex);

/**
 * FIXME:
 *  Error: ERR_ACTION_ACCESS_UNDEFINED: Are you trying to access this.someMutation() or this.someGetter inside an @Action?
 *  That works only in dynamic modules.
 *  If not dynamic use this.context.commit("mutationName", payload) and this.context.getters["getterName"]
 *  Error: Could not perform action loadAnime
 */

let profileStore: Profile;
let playerStore: Player;
let shikimoriStore: Shikimori;

export default new Vuex.Store<RootState>({
    modules: {
        profile: Profile,
        player: Player,
        shikimori: Shikimori,
    },
    plugins: [
        (store) => {
            profileStore = getModule(Profile, store);
            playerStore = getModule(Player, store);
            shikimoriStore = getModule(Shikimori, store);
        },


        (store) => {
            chrome.storage.onChanged.addListener((changes) => {
                if (changes.userAuth) {
                    profileStore.loadCredentialsFromServer(changes.userAuth.newValue);
                    profileStore.loadUser();
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
    profileStore,
    playerStore,
    shikimoriStore,
    worker,
};
