import Vue from "../../node_modules/vue/dist/vue.esm.browser.min.js";
import Vuex from "../../node_modules/vuex/dist/vuex.esm.browser.min.js";

import * as player from './player.module.js'
import * as user from './user.module.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    player,
    user
  }
})