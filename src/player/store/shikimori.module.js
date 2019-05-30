import { shikimoriAPI } from "../../helpers";
import Vue from "vue";

export const namespaced = true
export const state = {
  anime: null,
  user: null,
  domain: 'shikimori.one'
}

export const mutations = {
  setAnime(state, anime) {
    state.anime = anime
  },

  setUserRate(state, userRate) {
    Vue.set(state.anime, 'user_rate', userRate)
  },

  setUser(state, user) {
    state.user = user
  },
}

export const actions = {
  async initAnime({ commit }) {
    const animeId = (new URL(location.href)).searchParams.get('anime')
    const anime = await shikimoriAPI(`/animes/${animeId}`)
    commit('setAnime', anime)
  },

  async initUser({ commit }) {
    const user = await shikimoriAPI(`/users/whoami`)
    if (user) {
      commit('setUser', user)
    }
  },

  async saveUserRate({ commit, state }, user_rate) {
    if (!state.anime || !state.user) {
      return null
    }
    
    user_rate.target_type = 'Anime'
    user_rate.target_id = state.anime.id
    user_rate.user_id = state.user.id

    const newUserRate = await shikimoriAPI('/v2/user_rates', {
      method: 'POST',
      body: JSON.stringify({ user_rate })
    })

    commit('setUserRate', newUserRate)

    return newUserRate
  },

  markAsWatched({ rootGetters, dispatch }) {
    return dispatch('saveUserRate', {
      episodes: rootGetters['player/currentEpisode'].episodeInt
    })
  }
}