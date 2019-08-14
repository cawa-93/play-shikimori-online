import * as Sentry                              from '@sentry/browser'
import {anime365API, filterEpisodes, pluralize} from '../helpers'


Sentry.init({
	dsn: process.env.SENTRY_DSN,
	release: `${chrome.runtime.getManifest().name}@${chrome.runtime.getManifest().version}`,
})

// Запуск главной функции
const mainObserver = new MutationObserver(main)
const observerConfig = {attributes: true, subtree: true, childList: true}
mainObserver.observe(document, observerConfig)
main()


async function main() {

	/** @type {HTMLDivElement} */
	const infoSection = document.body.querySelector('#animes_show .c-info-right')
	/** @type {HTMLAnchorElement} */
	let WatchOnlineButton = document.body.querySelector('#watch-online-button')

	if (!infoSection || WatchOnlineButton) return

	// Скрываем старый блок с кнопкой, так как в некоторых темах он ломает отображение
	// infoSection.querySelector('.watch-online-placeholer').remove() // Это может сломать работу других расширений

	WatchOnlineButton = createButton(infoSection)

	// Загрузка метаданных аниме
	const anime = getAnime()

	if (!anime || !anime.id) {
		WatchOnlineButton.textContent = 'Не удалось определить ID аниме'
		WatchOnlineButton.classList.remove('b-ajax')
		WatchOnlineButton.style.cursor = 'not-allowed'
		return
	}

	const episodes = await getEpisodes(anime.id)

	if (episodes && episodes.length) {
		const episodeInt = getEpisodeInt()
		if (!episodeInt) {
			WatchOnlineButton.textContent = 'Начать просмотр'
		} else {
			// Определяем максимальный номер серии. Он не всегда соответствует количеству серий
			const max = Math.min(anime.episodes, Math.max(...episodes.map(e => parseFloat(e.episodeInt))))
			const from = max > 0 ? `из ${max}` : ''

			const watchedWord = pluralize(episodeInt, ['Просмотрена', 'Просмотрено', 'Просмотрено'])
			let episodeWord = from ? ['серии', 'серий', 'серий'] : ['серия', 'серии', 'серий']
			episodeWord = pluralize(max > 0 ? max : episodeInt, episodeWord)

			WatchOnlineButton.textContent = `${watchedWord} ${episodeInt} ${from} ${episodeWord}`
		}

		const playerURL = new URL(chrome.runtime.getURL(`UI/index.html`))
		playerURL.hash = `/player/anime/${anime.id}`
		if (episodeInt) {
			playerURL.hash += `/${episodeInt + 1}`
		}

		WatchOnlineButton.href = playerURL.toString()
		WatchOnlineButton.style.cursor = 'pointer'
	} else {
		WatchOnlineButton.textContent = 'Пока нет серий'
		WatchOnlineButton.style.cursor = 'not-allowed'
	}

	WatchOnlineButton.classList.remove('b-ajax')

}


/**
 *
 * @param {HTMLElement} infoSection
 * @returns {HTMLAnchorElement}
 */
function createButton(infoSection) {
	// Создание кнопки для перехода к плееру
	const WatchButtonSection = document.createElement('section')
	WatchButtonSection.classList.add('block')
	WatchButtonSection.classList.add('watch-online-block')
	WatchButtonSection.innerHTML = `
		<div class="subheadline m10">Онлайн просмотр</div>
		<a id="watch-online-button" class="b-link_button dark b-ajax" style="cursor: wait;user-select: none;"><!-- Неразрывный пробел--> <!-- /Неразрывный пробел--></a>
		<p style="color:#7b8084;text-align:center">Все новости и предложения в клубе<br><strong><a href="/clubs/2372">Play Шикимори Online</a></strong></p>
		`

	if (infoSection.querySelector('.block[itemprop="aggregateRating"] + .block')) {
		infoSection.querySelector('.block[itemprop="aggregateRating"] + .block').after(WatchButtonSection)
	} else if (infoSection.querySelector('.block[itemprop="aggregateRating"]')) {
		infoSection.querySelector('.block[itemprop="aggregateRating"]').after(WatchButtonSection)
	} else {
		infoSection.prepend(WatchButtonSection)
	}

	return WatchButtonSection.querySelector('#watch-online-button')
}


function getAnime() {
	try {
		const data = JSON.parse(document.querySelector('.b-user_rate[data-target_type="Anime"]').dataset.entry)
		return data
	} catch {
		return null
	}
}


async function getEpisodes(myAnimeListId) {
	/** @type {anime365.api.SeriesCollection} */
	const {data: [series]} = await anime365API(`/series/?myAnimeListId=${myAnimeListId}`)
	if (!series) {
		return []
	}
	
	return filterEpisodes(series)
}


function getEpisodeInt() {
	const episodeElement = document.querySelector('.b-user_rate[data-target_type="Anime"] .current-episodes')
	if (!episodeElement) return 0

	const episodeItn = parseInt(episodeElement.textContent)

	return isNaN(episodeItn) ? 0 : episodeItn
}