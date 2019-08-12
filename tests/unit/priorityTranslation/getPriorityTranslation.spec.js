import {
	filterTranslationsByAuthor,
	getAuthorsPriority,
	getPriorityTranslationForEpisode,
	getTypesPriority,
} from '../../../src/helpers/get-translation-priority.js'

import episodes                 from './sampleEpisodes.js'
import lastSelectedTranslations from './sampleHistory.js'


describe('Calculation of authors priority translation', () => {

	it('should return correct authors priority map', () => {
		const authors = getAuthorsPriority(lastSelectedTranslations)
		expect(authors).toEqual(new Map([
			['anidub', 0.6],
			['animevost', 0.2],
			['newcomers', 0.2],
		]))
	})

})

describe('Calculation of types priority translation', () => {
	it('should return correct types priority map', () => {
		const types = getTypesPriority(lastSelectedTranslations)
		expect(types).toEqual(new Map([
			['voiceRu', 1],
		]))
	})
})

describe('Filter translations by author summary', () => {
	it('should return correct translations for AniDUB', () => {
		const filtered = filterTranslationsByAuthor(episodes.Alchemist[0].translations, 'AniDUB')
		expect(filtered.map(t => t.id)).toEqual([398664, 1794388])
	})

	it('should return correct translations for Razmes', () => {
		const filtered = filterTranslationsByAuthor(episodes.Gintama[0].translations, 'Razmes')
		expect(filtered.map(t => t.id)).toEqual([228101, 255141])
	})


	it('should return empry array if author summary is empty', () => {
		expect(filterTranslationsByAuthor(episodes.Alchemist[0].translations, '').map(t => t.id)).toEqual([])
	})
	it('should return empry array if author not exist', () => {
		expect(filterTranslationsByAuthor(episodes.Alchemist[0].translations, 'Not existing author').map(t => t.id)).toEqual([])
	})

})

describe('Calculation priority translation for episode', () => {

	it('should return a translation of the same author as the one saved in history', () => {
		const translations = getPriorityTranslationForEpisode(lastSelectedTranslations, episodes.Alchemist[1])
		expect(translations.map(t => t.id)).toEqual([398668, 677084])
	})

	it('should return the translation of the most popular author', () => {
		const translations = getPriorityTranslationForEpisode(lastSelectedTranslations, episodes.Gintama[0])
		expect(translations.map(t => t.id)).toEqual([2240730])
	})


	it('should return the translation of the most popular type', () => {
		const translations = getPriorityTranslationForEpisode(lastSelectedTranslations, episodes.OnePiece[0])
		const expected = episodes.OnePiece[0].translations.filter(t => t.type === 'voiceRu')
		expect(translations).toEqual(expected)
	})



	it('should return all translations', () => {

		// Создаём копию епизода но удаляем все переводы типа voiceRu
		const episodeCopy = JSON.parse(JSON.stringify(episodes.OnePiece[1]))
		episodeCopy.translations = episodeCopy.translations.filter(t => t.type !== 'voiceRu')

		const translations = getPriorityTranslationForEpisode(lastSelectedTranslations, episodeCopy)
		expect(translations).toEqual(episodeCopy.translations)
	})
})