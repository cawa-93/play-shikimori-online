import Vue from "../../node_modules/vue/dist/vue.esm.browser.min.js";

export const namespaced = true

export const state = {
  series: null,
  currentEpisodeID: null,
  currentTranslationID: null,
}

export const getters = {
  episodes(state) {
    return state.series && state.series.episodes ? state.series.episodes : []
  },

  closestEpisodes(state, getters) {
    if (!state.currentEpisodeID) return [undefined, undefined, undefined]

    const currentEpisodeIndex = getters.episodes.findIndex(episode => episode.id === state.currentEpisodeID)

    if (currentEpisodeIndex < 0) return [undefined, undefined, undefined]

    return [
      getters.episodes[currentEpisodeIndex - 1],
      getters.episodes[currentEpisodeIndex],
      getters.episodes[currentEpisodeIndex + 1],
    ]
  },

  previousEpisode(state, getters) {
    return getters.closestEpisodes[0]
  },

  currentEpisode(state, getters) {
    return getters.closestEpisodes[1]
  },


  nextEpisode(state, getters) {
    return getters.closestEpisodes[2]
  },

  currentTranslation(state, getters) {
    if (!state.currentTranslationID || !getters.currentEpisode || !getters.currentEpisode.translations) return undefined
    return getters.currentEpisode.translations.find(translation => translation.id === state.currentTranslationID)
  },
}


export const mutations = {

  setSeries(state, series) {
    state.series = series
  },

  setCurrentEpisode(state, playload) {
    state.currentEpisodeID = playload
  },

  setTranslations(state, { episodeID, translations }) {
    const episode = state.series.episodes.find(episode => episode.id === episodeID)
    Vue.set(episode, 'translations', translations)
  },


  setCurrentTranslation(state, playload) {
    state.currentTranslationID = playload
  },
}


export const actions = {


  async initSeries({ state, commit, dispatch }, seriesID) {
    if (!state.series) {
      const { data } = await window.api.anime365(`/series/${seriesID}`)
      commit('setSeries', data)

      let startEpisode = (new URL(location.href)).searchParams.get('episode')
      if (!startEpisode) {
        startEpisode = data.episodes.find(episode => episode.episodeInt === '1').id
      }
      return dispatch('setCurrentEpisode', parseInt(startEpisode))
    }
  },


  async setCurrentEpisode({ state, commit, getters, dispatch }, episodeID) {
    commit('setCurrentEpisode', episodeID)

    if (!getters.currentEpisode.translations) {
      const { data } = await window.api.anime365(`/episodes/${getters.currentEpisode.id}`)
      commit('setTranslations', { episodeID, translations: data.translations })
    }

    return dispatch('setTranslation', getters.currentEpisode.translations[0])
  },


  async setTranslation({ commit }, translation) {
    commit('setCurrentTranslation', translation.id)
  },


  initpreviousEpisode({ getters, dispatch }) {
    if (getters.previousEpisode) {
      dispatch('setCurrentEpisode', getters.previousEpisode.id)
    }
  },


  initNextEpisode({ getters, dispatch }) {
    if (getters.nextEpisode) {
      dispatch('setCurrentEpisode', getters.nextEpisode.id)
    }
  }
}