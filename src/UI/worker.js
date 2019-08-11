import {storage}                                                      from 'kv-storage-polyfill'
import {getMostPriorityTranslation, getPriorityTranslationForEpisode} from '../helpers/get-translation-priority.js'
// import {clearString} from '../helpers/clear-string'


onmessage = async ({data: {episode}}) => {
	let history = await storage.get('lastSelectedTranslations')

	if (!history) {
		history = new Map()
		await storage.set('lastSelectedTranslations', history)
	}

	if (!episode || !episode.translations || !episode.translations.length) {
		return postMessage({translation: undefined})
	}

	const previousUserTranslation = history.get(episode.seriesId)

	// Если предыдущий перевод принадлежит текущей серии — его и возвращаем
	if (previousUserTranslation && previousUserTranslation.episodeId === episode.id) {
		return postMessage({translation: previousUserTranslation})
	}

	const primaryTranslations = getPriorityTranslationForEpisode(history, episode)
	const primaryActiveTranslations = filterActiveTranslations(primaryTranslations)

	if (primaryActiveTranslations.length) {
		return postMessage({translation: getMostPriorityTranslation(primaryActiveTranslations)})
	}

	if (primaryTranslations.length) {
		return postMessage({translation: getMostPriorityTranslation(primaryTranslations)})
	}

	return postMessage({translation: getMostPriorityTranslation(episode.translations)})


}


function filterActiveTranslations(translations) {
	return translations.filter(t => t.isActive)
}