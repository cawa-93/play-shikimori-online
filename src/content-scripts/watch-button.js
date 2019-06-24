import { anime365API } from '../helpers'

// Запуск главной функции
const mainObserver = new MutationObserver(main)
const observerConfig = { attributes: true, subtree: true, childList: true }
mainObserver.observe(document, observerConfig)
main()


async function main() {
	const infoSection = document.querySelector('body#animes_show .c-info-right')
	/** @type {HTMLAnchorElement} */
	let WatchOnlineButton = document.querySelector('#watch-online-button')

	if (!infoSection || WatchOnlineButton) return

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
	WatchOnlineButton = WatchButtonSection.querySelector('#watch-online-button')

	// Загрузка метаданных аниме
	const anime = getAnime()

	if (!anime || !anime.id) {
		WatchOnlineButton.textContent = 'Не удалось определить ID аниме'
		WatchOnlineButton.classList.remove('b-ajax')
		WatchOnlineButton.style.cursor = 'not-allowed'
		return
	}

	const seriesID = await getSeriesId(anime.id)

	if (seriesID) {
		const episodeInt = getEpisodeInt()
		if (episodeInt === 1) {
			WatchOnlineButton.textContent = 'Начать просмотр'
		} else if (episodeInt >= anime.episodes) {
			WatchOnlineButton.textContent = 'Пересмотреть'
		} else {
			WatchOnlineButton.textContent = 'Продолжить просмотр'
		}

		const playerURL = new URL(chrome.runtime.getURL(`player/index.html`))
		playerURL.searchParams.append('series', seriesID)
		playerURL.searchParams.append('anime', anime.id)
		playerURL.searchParams.append('episodeInt', episodeInt)

		WatchOnlineButton.href = playerURL.toString()
		WatchOnlineButton.style.cursor = 'pointer'
	} else {
		WatchOnlineButton.textContent = 'Нет видео'
		WatchOnlineButton.style.cursor = 'not-allowed'
	}

	WatchOnlineButton.classList.remove('b-ajax')

}



function getAnime() {
	try {
		const data = JSON.parse(document.querySelector('.b-user_rate[data-target_type="Anime"]').dataset.entry)
		return data
	} catch {
		return null
	}
}

async function getSeriesId(myAnimeListId) {
	const cacheKey = `series-cache-${myAnimeListId}`
	let cache = sessionStorage.getItem(cacheKey)
	if (cache) {
		return cache
	}

	const { data: [series] } = await anime365API(`/series/?myAnimeListId=${myAnimeListId}`)
	if (!series) {
		return
	}
	cache = series.id
	sessionStorage.setItem(cacheKey, cache)
	return cache
}

function getEpisodeInt() {
	const episodeElement = document.querySelector('.b-user_rate[data-target_type="Anime"] .current-episodes')
	if (!episodeElement) return 1

	const episodeItn = parseInt(episodeElement.textContent)

	return isNaN(episodeItn) ? 1 : episodeItn + 1
}