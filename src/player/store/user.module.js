import { shikimoriAPI } from "../../helpers";

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
    const info = await shikimoriAPI('/users/whoami')

    commit('setUserInfo', info)
  }
}