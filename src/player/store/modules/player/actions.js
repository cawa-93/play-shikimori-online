import Vue from "vue";
import { anime365API, myanimelistAPI, buildIframeURL, findEpisode } from "../../../../helpers";
import { storage } from "kv-storage-polyfill";

const worker = new Worker('/player/worker.js')


/**
 * Загружает данные по аниме
 * @param {{getters: {episodes: anime365.Episode[]}, commit: Function, dispatch: Function}} context 
 * @param {{seriesID: number, episodeInt: number}} payload 
 */
export async function loadSeries({ getters, commit, dispatch }, { seriesID = null, episodeInt = 1 }) {
  /**
   * @type {anime365.api.SeriesSelf}
   */
  const { data } = await anime365API(`/series/${seriesID}`)
  commit('setSeries', data)

  if (!getters.episodes.length) {
    return
  }

  /**
   * episodeInt — Номер серии которую необходимо запустить
   * 
   * Поиск наиболее подходящей серии для запуска
   */
  let startEpisode = findEpisode(getters.episodes, episodeInt)

  // Если следующей серии не найдено — выполнить поиск предыдущей серии перебором
  if (!startEpisode) {
    startEpisode = findEpisode(getters.episodes, episodeInt - 1)
  }

  // Если предыдущая серия не найдена — выполнить поиск первой серии перебором
  if (!startEpisode && episodeInt > 2) {
    startEpisode = findEpisode(getters.episodes, 1)
  }

  // Если первая серия не найдена — использовать первый элемент из массива серий
  if (!startEpisode) {
    startEpisode = getters.episodes[0]
  }

  if (startEpisode) {
    await dispatch('selectEpisode', startEpisode.id)
  }

  await dispatch('loadEpisodesTitle')
}


/**
 * Устанавливает текущую серию
 * Загружает переводы для текущейсерии
 * Предзагружает данные для следующей серии
 * @param {{getters: {episodes: anime365.Episode[], nextEpisode?: anime365.Episode, previousEpisode?: anime365.Episode}, commit: Function, dispatch: Function}} context 
 * @param {number} episodeID 
 */
export async function selectEpisode({ getters, commit, dispatch }, episodeID) {
  commit('selectEpisode', episodeID)


  let targetEpisode

  if (getters.nextEpisode && episodeID === getters.nextEpisode.id) {
    targetEpisode = getters.nextEpisode
  } else if (getters.previousEpisode && episodeID === getters.previousEpisode.id) {
    targetEpisode = getters.previousEpisode
  } else {
    targetEpisode = getters.episodes.find(e => e.id === episodeID)
  }

  if (!targetEpisode) {
    return
  }


  {
    const currentURL = new URL(location.href)
    currentURL.searchParams.set('episodeInt', targetEpisode.episodeInt)
    history.replaceState(history.state, '', currentURL.toString())
  }

  await dispatch('loadTranslations', targetEpisode)
  let translation = await dispatch('getPriorityTranslation', targetEpisode)

  await dispatch('selectTranslation', { translation })

}


/**
 * Загружает доступные переводы для серии
 * Может вызываться неограниченное число раз.
 * Поэтому необходимо обязательно проверять наличие переводов, чтобы избежать повторной загрузки
 * @param {{commit: Function}} context
 * @param {anime365.Episode} episode 
 */
export async function loadTranslations({ commit }, episode) {
  if (!episode || (Array.isArray(episode.translations) && episode.translations.length > 0)) {
    return
  }

  /**
   * @type {anime365.api.EpisodeSelf}
   */
  const { data } = await anime365API(`/episodes/${episode.id}`)
  data.translations = data.translations.map(translation => {
    if (!translation.authorsSummary) {
      translation.authorsSummary = 'Неизвестный'
    }

    return translation
  })

  commit('setTranslations', { episode, translations: data.translations })
  return data
}


/**
 * Устанавливает текущий перевод
 * Сохраняет перевод в хранилище приоритетных переводов
 * @param {{commit: Function, dispatch: Function, getters: {selectedEpisode: anime365.Episode, nextEpisode: anime365.Episode}}} context
 * @param {{translation: anime365.Translation, trusted: boolean}} translation 
 */
export async function selectTranslation({ commit }, { translation }) {
  commit('selectTranslation', translation.id)


  Vue.nextTick(async () => {
    /**
     * @type {Map<number, anime365.Translation>}
     */
    let lastSelectedTranslations = await storage.get("lastSelectedTranslations");

    // Если ранее хранилище переводов не создавалось — инициализировать его
    if (!lastSelectedTranslations) {
      lastSelectedTranslations = new Map()
    }

    lastSelectedTranslations.set(translation.seriesId, translation)

    await storage.set("lastSelectedTranslations", lastSelectedTranslations);
  })

}


/**
 * Переключает на предыдущую серию
 * @param {{getters: {previousEpisode: anime365.Episode}, dispatch: Function}} context 
 */
export function selectPreviousEpisode({ getters: { previousEpisode }, dispatch }) {
  if (previousEpisode) {
    dispatch('selectEpisode', previousEpisode.id)
  }
}


/**
 * Переключает на следующую серию
 * @param {{getters: {nextEpisode: anime365.Episode}, dispatch: Function}} context 
 */
export function selectNextEpisode({ getters: { nextEpisode }, dispatch }) {
  if (nextEpisode) {
    dispatch('selectEpisode', nextEpisode.id)
  }
}


/**
 * 
 * @param {{state: vuex.Player, commit: Function}} context 
 */
export async function loadEpisodesTitle({ commit, state }) {
  let currentPage = 1
  let episodeMap = new Map()

  while (true) {
    const promise = myanimelistAPI(`/anime/${state.series.myAnimeListId}/episodes/${currentPage}`);

    if (episodeMap.size) {
      commit('loadEpisodesTitle', episodeMap)
      episodeMap = new Map()
    }

    const resp = await promise
    if (!resp.episodes || !resp.episodes.length) break

    resp.episodes.forEach(e => episodeMap.set(e.episode_id, e))

    if (currentPage >= resp.episodes_last_page) {
      break
    }

    currentPage++
  }

  if (episodeMap.size) {
    commit('loadEpisodesTitle', episodeMap)
  }

}


/**
 * 
 * @param {any} context
 * @param {anime365.Episode} episode 
 */
export function getPriorityTranslation({ }, episode) {

  return new Promise(resolve => {

    worker.onmessage = ({ data: { translation } }) => {
      worker.onmessage = null
      resolve(translation)
    }
    worker.postMessage({ episode })
  })
}

/**
 * Загружает переводы для следующей серии
 * @param {{getters: {nextEpisode: anime365.Episode}, dispatch: Function}} context 
 */
export async function preloadNextEpisode({ getters, dispatch }) {
  if (!getters.nextEpisode) {
    return
  }

  await dispatch('loadTranslations', getters.nextEpisode)
  /** @type {anime365.Translation} */
  const translation = await dispatch('getPriorityTranslation', getters.nextEpisode)
  if (translation) {
    const link = document.createElement('link');
    link.href = translation.embedUrl
    link.as = 'document'
    document.head.appendChild(link);
  }

  return translation
}