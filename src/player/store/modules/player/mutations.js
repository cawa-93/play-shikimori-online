import Vue from "vue";


/**
 * Сохраняет аниме
 * @param {vuex.Player} state 
 * @param {anime365.Series} series 
 */
export function setSeries(state, series) {
  state.series = series
}

/**
 * Изменяет ID текущей серии
 * @param {vuex.Player} state 
 * @param {number} payload 
 */
export function selectEpisode(state, payload) {
  state.currentEpisodeID = payload
}

/**
 * Сохраняет массив переводов для серии
 * @param {vuex.Player} state 
 * @param {{episodeID: number, translations: anime365.Translation[]}} param1 
 */
export function setTranslations(state, { episodeID, translations }) {
  const episode = state.series.episodes.find(episode => episode.id === episodeID)
  if (!episode) {
    return
  }

  Vue.set(episode, 'translations', translations)
}

/**
 * Изменяет ID текущего перевода
 * @param {vuex.Player} state 
 * @param {number} payload 
 */
export function selectTranslation(state, payload) {
  state.currentTranslationID = payload
}


/**
 * Обновляет заголовки для серий
 * @param {vuex.Player} state 
 * @param {Map} episodes
 */
export function loadEpisodesTitle(state, episodes) {
  if (!state.series.episodes) return
  for (const episode of state.series.episodes) {
    if (episode.episodeTitle || episode.episodeType === 'special') continue

    const episodeInfo = episodes.get(parseInt(episode.episodeInt))
    if (!episodeInfo || !episodeInfo.title) continue

    episode.episodeTitle = episodeInfo.title
    episode.episodeFull = `${episode.episodeInt}. ${episode.episodeTitle}`
  }

}

/**
 * 
 * @param {vuex.Player} state 
 * @param {{episode: anime365.Episode, translation: anime365.Translation}} param1 
 */
export function savePreselectedTranslation(state, { episode, translation }) {
  if (!episode || !translation) {
    return
  }

  // const index = state.series.episodes.findIndex(e => e.id === episode.id)
  // if (index < 0) {
  //   return
  // }

  Vue.set(episode, 'preselectedTranslation', translation)
}