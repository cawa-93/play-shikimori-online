import Vue           from 'vue'
import {clearString} from '../../../../helpers'


export function clear(state) {
	state.episodes = []
	state.currentEpisode = null
	state.currentTranslation = null
}


/**
 * Сохраняет аниме
 * @param {vuex.Player} state
 * @param {anime365.Episode[]} episodes
 */
export function setEpisodes(state, episodes) {
	state.episodes.push(...episodes)
}


/**
 * Изменяет ID текущей серии
 * @param {vuex.Player} state
 * @param {anime365.Episode} episode
 */
export function selectEpisode(state, episode) {
	state.currentEpisode = episode
}


/**
 * Сохраняет отфильтрованный массив переводов для серии
 * @param {vuex.Player} state
 * @param {{episode: anime365.Episode, translations: anime365.Translation[]}} param1
 */
export function setTranslations(state, {episode, translations}) {
	if (!episode) {
		return
	}

	Vue.set(episode, 'translations', translations.filter(translation => {
		if (translation.isActive) return true

		const currentAuthor = clearString(translation.authorsSummary)

		return currentAuthor && !(
			translations.find(t => {
				if (!t.isActive || translation.type !== t.type) return false

				const author = clearString(t.authorsSummary)

				return author && author === currentAuthor
			})
		)
	}))
}


/**
 * Изменяет ID текущего перевода
 * @param {vuex.Player} state
 * @param {anime365.Translation} translation
 */
export function selectTranslation(state, translation) {
	state.currentTranslation = translation
}


/**
 * Обновляет заголовки для серий
 * @param {vuex.Player} state
 * @param {myanimelist.Episode[]} episodes
 */
export function loadEpisodesTitle(state, episodes) {
	if (!state.episodes || !state.episodes.length || !episodes || !episodes.length) return

	for (const {title, episode_id} of episodes) {
		if (!title) continue

		const episode = state.episodes.find(e => parseFloat(e.episodeInt) === episode_id)

		if (!episode || episode.episodeTitle) continue

		episode.episodeTitle = title
		episode.episodeFull = `${episode.episodeInt}. ${episode.episodeTitle}`
	}

}