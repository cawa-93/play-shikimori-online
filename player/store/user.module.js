import Vue from "../../node_modules/vue/dist/vue.esm.browser.min.js";

export const namespaced = true

export const state = {
  UserInfo: null,
}

export const mutations = {
  setUserInfo(state, info) {
    state.UserInfo = info
  }
}

export const actions = {
  async initUser({ commit }) {
    const info = await api.shikimori('/users/whoami')

    commit('setUserInfo', info)
  }
}