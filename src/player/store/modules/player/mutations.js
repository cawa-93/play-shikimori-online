import Vue from "vue";


/**
 * Сохраняет аниме
 * @param {vuex.Player} state 
 * @param {anime365.Series} series 
 */
export function setSeries(state, series) {
  state.series = series
  state.series.episodes = state.series.episodes.filter(e => e.isActive)
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
 * @param {{episode: anime365.Episode, translations: anime365.Translation[]}} param1 
 */
export function setTranslations(state, { episode, translations }) {
  if (!episode) {
    return
  }

  Vue.set(episode, 'translations', translations.filter(t => t.isActive))
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
 * @param {myanimelist.Episode[]} episodes
 */
export function loadEpisodesTitle(state, episodes) {
  if (!state.series.episodes || !state.series.episodes.length || !episodes || !episodes.length) return

  for (const { title, episode_id } of episodes) {
    if (!title) continue

    const episode = state.series.episodes.find(e => parseFloat(e.episodeInt) === episode_id)

    if (!episode || episode.episodeTitle) continue

    episode.episodeTitle = title
    episode.episodeFull = `${episode.episodeInt}. ${episode.episodeTitle}`
  }

}