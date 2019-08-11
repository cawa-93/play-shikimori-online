import {clearString} from './clear-string.js'


export function clearAuthorSummary(authorsSummary) {
	return clearString(authorsSummary.replace(/\(.*\)/g, ''))
}


/**
 *
 * @param {Map<number, anime365.Translation>} translations
 */
export function getAuthorsPriority(translations) {
	const authors = new Map()

	translations.forEach(transaction => {
		if (!transaction.authorsSummary) {
			return
		}

		const authorsSummary = clearAuthorSummary(transaction.authorsSummary)

		if (!authorsSummary) {
			return
		}

		if (!authors.has(authorsSummary)) {
			authors.set(authorsSummary, 0)
		}

		authors.set(authorsSummary, authors.get(authorsSummary) + 1)
	})

	authors.forEach((count, author) => {
		authors.set(author, count / translations.size)
	})

	return authors
}


/**
 *
 * @param {Map<number, anime365.Translation>} translations
 */
export function getTypesPriority(translations) {
	const types = new Map()

	translations.forEach(transaction => {
		if (!transaction.type) {
			return
		}

		if (!types.has(transaction.type)) {
			types.set(transaction.type, 0)
		}

		types.set(transaction.type, types.get(transaction.type) + 1)
	})

	types.forEach((count, t) => {
		types.set(t, count / translations.size)
	})

	return types
}


/**
 *
 * @param {anime365.Translation[]} translations
 * @param {string} authorsSummaryRaw
 */
export function filterTranslationsByAuthor(translations, authorsSummaryRaw) {
	const authorsSummary = clearAuthorSummary(authorsSummaryRaw)
	if (!authorsSummary) {
		return []
	}

	return translations.filter(translation => {
		const summary = clearAuthorSummary(translation.authorsSummary)

		return summary && (
			authorsSummary.indexOf(summary) >= 0 || summary.indexOf(authorsSummary) >= 0
		)

	})
}


/**
 *
 * @param {anime365.Translation[]} translations
 */
export function getMostPriorityTranslation(translations) {
	if (!translations.length) {
		return null
	}
	let maxPriority = 0
	let maxPriorityTranslation = translations[0]

	for (const t of translations) {
		if (t.priority > maxPriority) {
			maxPriority = t.priority
			maxPriorityTranslation = t
		}
	}

	return maxPriorityTranslation
}


/**
 *
 * @param {Map<number, anime365.Translation>} history
 * @param {anime365.Episode} episode
 */
export function getPriorityTranslationForEpisode(history, episode) {

	// Выбираем перевод используемый для предыдущих серий
	if (history.has(episode.seriesId)) {
		const previousUserTranslation = history.get(episode.seriesId)

		// Поиск перевода от того же автора
		const priorityTranslations = filterTranslationsByAuthor(episode.translations, previousUserTranslation.authorsSummary)

		// Если для текущей серии найден перевод того же автора что сохранен в истории — возвращаем
		if (priorityTranslations.length) {
			return priorityTranslations
		}
	}

	// Карта авторов и их индекс популярности
	const authorPriorityMap = [...getAuthorsPriority(history)]
	// Не учитываем авторов которые используються реже чем в 10% случаев
		.filter(([, rating]) => rating >= 0.1)
		// Сортируем всех авторов в порядке популярности
		.sort(([, rating1], [, rating2]) => rating2 - rating1)

	// Перебираем всех авторов в порядке популярности
	for (const [author] of authorPriorityMap) {
		const filtered = filterTranslationsByAuthor(episode.translations, author)

		// Если перевод от одного из популярных авторов найден — вернуть его
		if (filtered && filtered.length) {
			return filtered
		}
	}

	// Карта типов переводов и их индекс популярности
	const typePriorityMap = [...getTypesPriority(history)]
	// Не учитываем типы которые используються реже чем в 10% случаев
		.filter(([, rating]) => rating >= 0.1)
		// Сортируем все типы в порядке популярности
		.sort(([, rating1], [, rating2]) => rating2 - rating1)

	// Перебираем все типы в порядке популярности
	for (const [type] of typePriorityMap) {
		const filtered = episode.translations.filter(t => t.type === type)

		// Если перевод одного из популярных типов найден — вернуть его
		if (filtered && filtered.length) {
			return filtered
		}
	}

	return episode.translations
}