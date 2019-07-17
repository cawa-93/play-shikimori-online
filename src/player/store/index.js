import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules/index";

import {
  local,
  sync,
} from "../../helpers";

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    store => {
      chrome.storage.onChanged.addListener(changes => {
        if (changes.userAuth) {
          store.commit('shikimori/loadCredentialsFromServer', changes.userAuth.newValue)
          store.dispatch("shikimori/loadUser");
        }
      });

      store.subscribe((mutation, state) => {
        // вызывается после каждой мутации
        // мутация передаётся в формате `{ type, payload }`.

        if (mutation.type === 'saveCredentials' || mutation.type === 'logout') {
          sync.set({ userAuth: state.credentials });
        }
      });
    }
  ]
})