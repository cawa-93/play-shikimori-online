import Vue from "vue";
import { anime365API } from "../../helpers";
import { storage } from "kv-storage-polyfill";

const worker = new Worker('/player/worker.js')


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
    if (!state.currentTranslationID) return undefined
    const episodesOrder = [
      getters.currentEpisode,
      getters.nextEpisode,
      getters.previousEpisode,
      ...getters.episodes,
    ]

    for (const episode of episodesOrder) {
      if (!episode || !episode.translations || !episode.translations.length) continue
      const translation = episode.translations.find(translation => translation.id === state.currentTranslationID)
      if (translation) return translation

    }

    return undefined
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
  async initSeries({ state, commit, dispatch, rootState }, seriesID) {
    if (!state.series) {
      const { data } = await anime365API(`/series/${seriesID}`)
      commit('setSeries', data)
    }

    let episodeInt = 1;
    if (
      rootState.shikimori.anime &&
      rootState.shikimori.anime.user_rate
    ) {
      episodeInt = rootState.shikimori.anime.user_rate.episodes + 1;
    }

    const startEpisode = state.series.episodes.find(e => e.episodeInt == episodeInt)
    if (startEpisode) {
      dispatch('setCurrentEpisode', startEpisode.id)
    } else if (episodeInt !== 1) {

      episodeInt =
        rootState.shikimori.anime &&
          rootState.shikimori.anime.user_rate
          ? rootState.shikimori.anime.user_rate.episodes
          : 1


      const startEpisode = state.series.episodes.find(e => e.episodeInt == episodeInt)
      if (startEpisode) {
        dispatch('setCurrentEpisode', startEpisode.id)
      }
    }
  },


  async setCurrentEpisode({ state, commit, getters, dispatch }, episodeID) {
    const targetEpisode = getters.episodes.find(e => e.id === episodeID)
    commit('setCurrentEpisode', targetEpisode.id)

    await dispatch('loadTranslations', targetEpisode)
    const priorityTranslation = await dispatch('getPriorityTranslation', targetEpisode)

    dispatch('setCurrentTranslation', priorityTranslation)

    // Предварительная загрузка переводов для следующей серии
    Vue.nextTick(() => {
      dispatch('loadTranslations', getters.nextEpisode)
    })
  },

  async loadTranslations({ getters, commit }, episode) {
    if (!episode.translations) {
      const { data } = await anime365API(`/episodes/${episode.id}`)
      data.translations = data.translations.map(translation => {
        if (!translation.authorsSummary) {
          translation.authorsSummary = 'Неизвестный'
        }

        return translation
      })
      commit('setTranslations', { episodeID: episode.id, translations: data.translations })
    }
  },


  async setCurrentTranslation({ commit }, translation) {
    commit('setCurrentTranslation', translation.id)

    let lastSelectedTranslations = await storage.get("lastSelectedTranslations");

    // Если ранее хранилище переводов не создавалось — инициализировать его
    if (!lastSelectedTranslations) {
      lastSelectedTranslations = new Map()
    }

    lastSelectedTranslations.set(translation.seriesId, translation)

    await storage.set("lastSelectedTranslations", lastSelectedTranslations);
  },


  initPreviousEpisode({ getters, dispatch }) {
    if (getters.previousEpisode) {
      dispatch('setCurrentEpisode', getters.previousEpisode.id)
    }
  },


  initNextEpisode({ getters, dispatch }) {
    if (getters.nextEpisode) {
      dispatch('setCurrentEpisode', getters.nextEpisode.id)
    }
  },





  getPriorityTranslation({ }, episode) {

    return new Promise(resolve => {

      worker.onmessage = ({ data: { translation } }) => {
        worker.onmessage = null
        resolve(translation)
      }
      worker.postMessage({ episode })
    })
  }
}
