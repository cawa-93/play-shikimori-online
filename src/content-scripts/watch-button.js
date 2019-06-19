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
		<a href="#" id="watch-online-button" class="b-link_button dark b-ajax"><!-- Неразрывный пробел--> <!-- /Неразрывный пробел--></a>
		<p style="color:#7b8084;text-align:center">Все новости и предложения в клубе<br><strong><a href="/clubs/2372">Play Шикимори Online</a></strong></p>
		`
	infoSection.appendChild(WatchButtonSection)
	WatchOnlineButton = WatchButtonSection.querySelector('#watch-online-button')

	// Загрузка метаданных аниме
	const anime = await getAnime()

	if (!anime || !anime.id) {
		WatchOnlineButton.textContent = 'Не удалось определить ID аниме'
		WatchOnlineButton.classList.remove('b-ajax')
		return
	}


	const seriesID = await getSeriesId(anime.id)

	if (seriesID) {
		const currentEpisodes = document.querySelector('.b-user_rate[data-target_type="Anime"] .current-episodes')
		if (!currentEpisodes) {
			WatchOnlineButton.textContent = 'Начать просмотр'
		} else if (currentEpisodes.textContent >= anime.episodes) {
			WatchOnlineButton.textContent = 'Пересмотреть'
		} else {
			WatchOnlineButton.textContent = 'Продолжить просмотр'
		}

		const playerURL = new URL(chrome.runtime.getURL(`player/index.html`))
		playerURL.searchParams.append('series', seriesID)
		playerURL.searchParams.append('anime', anime.id)

		WatchOnlineButton.href = playerURL.toString()
	} else {
		WatchOnlineButton.textContent = 'Нет видео'
	}

	WatchOnlineButton.classList.remove('b-ajax')

}



async function getAnime() {
	try {
		const data = JSON.parse(document.querySelector('.b-user_rate[data-target_type="Anime"]').dataset.entry)
		return data
	} catch {
		return null
	}
}

async function getSeriesId(myAnimeListId) {
	const cache = JSON.parse(sessionStorage.getItem('series-cache') || '{}')
	if (cache[myAnimeListId]) {
		return cache[myAnimeListId]
	}

	const { data: [series] } = await anime365API(`/series/?myAnimeListId=${myAnimeListId}`)
	if (!series) {
		return
	}
	cache[myAnimeListId] = series.id
	sessionStorage.setItem('series-cache', JSON.stringify(cache))
	return cache[myAnimeListId]
}