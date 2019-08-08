/**
 * Возвращает массив серий
 * @param {vuex.Player} state
 */
export function episodes(state) {
	return state.series && state.series.episodes ? state.series.episodes : []
}


/**
 * Возвращает индекс текущей серии в массиве
 * @param {vuex.Player} state
 * @param {{episodes: anime365.Episode[]}} getters
 */
export function selectedEpisodeIndex(state, getters) {
	if (!state.currentEpisodeID) {
		return -1
	}
	return getters.episodes.findIndex(e => e.id === state.currentEpisodeID)
}


/**
 * Возвращает индексы близжайших серий
 * @param {vuex.Player} state
 * @param {{selectedEpisodeIndex: number}} getters
 */
export function closestEpisodesIndex(state, {selectedEpisodeIndex}) {
	return [selectedEpisodeIndex - 1, selectedEpisodeIndex, selectedEpisodeIndex + 1]
}


/**
 * Возвращает близжайшие серии по их индексам
 * @param {vuex.Player} state
 * @param {{closestEpisodesIndex: number[], episodes: anime365.Episode[]}} getters
 */
export function closestEpisodes(state, {closestEpisodesIndex, episodes}) {
	return closestEpisodesIndex.map(index => episodes[index])
}


/**
 * Возвращает предыдущую серию
 * @param {vuex.Player} state
 * @param {{closestEpisodes: anime365.Episode[]}}
 * @returns {anime365.Episode}
 */
export function previousEpisode(state, {closestEpisodes}) {
	return closestEpisodes[0]
}


/**
 * Возвращает текущую серию
 * @param {vuex.Player} state
 * @param {{closestEpisodes: anime365.Episode[]}}
 * @returns {anime365.Episode}
 */
export function selectedEpisode(state, {closestEpisodes}) {
	return closestEpisodes[1]
}


/**
 * Возвращает следующую серию
 * @param {vuex.Player} state
 * @param {{closestEpisodes: anime365.Episode[]}}
 * @returns {anime365.Episode}
 */
export function nextEpisode(state, {closestEpisodes}) {
	return closestEpisodes[2]
}


/**
 * Возвращает текущий перевод
 * @param {vuex.Player} state
 * @param {{currentEpisode: anime365.Episode, nextEpisode: anime365.Episode, previousEpisode: anime365.Episode,
 *     episodes: anime365.Episode[]}} getters
 */
export function currentTranslation(state, {currentEpisode, nextEpisode, previousEpisode, episodes}) {
	if (!state.currentTranslationID) return undefined

	/**
	 * Список серий в которых искать перевод
	 * Серии могут повторяться
	 */
	const episodesOrder = [
		currentEpisode,
		nextEpisode,
		previousEpisode,
		...episodes,
	]

	/**
	 * Список проверенных серий.
	 * Необходимо чтобы избежать проверки одной серии дважды
	 */
	const checkedEpisodes = new Set()

	for (const episode of episodesOrder) {
		if (!episode
		    || !episode.translations
		    || !episode.translations.length
		    || checkedEpisodes.has(episode.id)) {
			continue
		}
		const translation = episode.translations.find(translation => translation.id === state.currentTranslationID)
		if (translation) return translation
		checkedEpisodes.add(episode.id)
	}

	return undefined
}