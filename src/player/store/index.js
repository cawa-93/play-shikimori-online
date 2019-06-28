import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules/index";

// import * as player from './player.module.js'
// import * as shikimori from './shikimori.module.js'

Vue.use(Vuex)

console.log(modules)

export default new Vuex.Store({
  modules
})