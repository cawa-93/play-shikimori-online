import Vue from "../vue.esm.browser.js";
import Vuex from "../vuex.esm.browser.min.js";

import * as player from './player.module.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    player
  }
})