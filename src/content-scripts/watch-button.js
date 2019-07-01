import { anime365API } from '../helpers'

// Запуск главной функции
const mainObserver = new MutationObserver(main)
const observerConfig = { attributes: true, subtree: true, childList: true }
mainObserver.observe(document, observerConfig)
main()


async function main() {

	/** @type {HTMLDivElement} */
	const infoSection = document.body.querySelector('#animes_show .c-info-right')
	/** @type {HTMLAnchorElement} */
	let WatchOnlineButton = document.body.querySelector('#watch-online-button')

	if (!infoSection || WatchOnlineButton) return

	WatchOnlineButton = createButton(infoSection)

	// Загрузка метаданных аниме
	const anime = getAnime()

	if (!anime || !anime.id) {
		WatchOnlineButton.textContent = 'Не удалось определить ID аниме'
		WatchOnlineButton.classList.remove('b-ajax')
		WatchOnlineButton.style.cursor = 'not-allowed'
		return
	}

	const series = await getSeries(anime.id)

	if (series && series.episodes.length) {
		const episodeInt = getEpisodeInt()
		if (!episodeInt) {
			WatchOnlineButton.textContent = 'Начать просмотр'
		} else {
			// Определяем максимальный номер серии. Он не всегда соответствует количеству серий
			const max = Math.min(anime.episodes, Math.max(...series.episodes.map(e => parseFloat(e.episodeInt))))
			WatchOnlineButton.textContent = `Просмотрено ${episodeInt} из ${max}`
		}

		const playerURL = new URL(chrome.runtime.getURL(`player/index.html`))
		playerURL.searchParams.set('series', series.id)
		playerURL.searchParams.set('anime', anime.id)
		playerURL.searchParams.set('episodeInt', episodeInt + 1) // Открываем следующую после просмотренной серию

		WatchOnlineButton.href = playerURL.toString()
		WatchOnlineButton.style.cursor = 'pointer'
	} else {
		WatchOnlineButton.textContent = 'Нет видео'
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
		<a id="watch-online-button" class="b-link_button dark b-ajax" style="cursor: wait"><!-- Неразрывный пробел--> <!-- /Неразрывный пробел--></a>
		<p style="color:#7b8084;text-align:center">Все новости и предложения в клубе<br><strong><a href="/clubs/2372">Play Шикимори Online</a></strong></p>
		`
	infoSection.appendChild(WatchButtonSection)
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


async function getSeries(myAnimeListId) {
	/** @type {anime365.api.SeriesCollection} */
	const { data: [series] } = await anime365API(`/series/?myAnimeListId=${myAnimeListId}`)
	return series
}

function getEpisodeInt() {
	const episodeElement = document.querySelector('.b-user_rate[data-target_type="Anime"] .current-episodes')
	if (!episodeElement) return 1

	const episodeItn = parseInt(episodeElement.textContent)

	return isNaN(episodeItn) ? 1 : episodeItn
}