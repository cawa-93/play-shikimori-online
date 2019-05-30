import Vue from "vue";
import Vuex from "vuex";

import * as player from './player.module.js'
import * as shikimori from './shikimori.module.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    player,
    shikimori
  }
})