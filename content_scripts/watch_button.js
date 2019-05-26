// Запуск главной функции
const mainObserver = new MutationObserver(main)
const observerConfig = { attributes: true, subtree: true, childList: true }
mainObserver.observe(document, observerConfig)
main()






async function main() {
	const infoSection = document.querySelector('body#animes_show .c-info-right')
	const WatchOnlineButton = document.querySelector('#watch-online-button')

	if (!infoSection || WatchOnlineButton) return

	// Созданиие кнопки для перехода к плееру
	const WatchButtonSection = document.createElement('section')
	WatchButtonSection.classList.add('block')
	WatchButtonSection.classList.add('watch-online-block')
	WatchButtonSection.innerHTML = `
		<div class="subheadline m10">Онлайн просмотр</div>
		<a href="#" target="_blank" id="watch-online-button" class="b-link_button dark">Загрузка</a>
		`
	infoSection.appendChild(WatchButtonSection)

	// Загрузка метаданных аниме
	const anime = await getAnime()

	if (!anime) {
		WatchButtonSection.querySelector('#watch-online-button').textContent = 'Нет видео'
		return
	}

	// 
	const { data } = await api.anime365(`/series/?myAnimeListId=${anime.myanimelist_id}`)
	const series = data[0]

	if (series && series.episodes && series.episodes.length) {
		/** @type {HTMLAnchorElement} */
		const link = WatchButtonSection.querySelector('#watch-online-button')
		link.textContent = 'Смотреть онлайн'

		const playerURL = new URL(chrome.runtime.getURL(`player/index.html`))
		playerURL.searchParams.append('series', series.id)

		if (anime.user_rate) {
			const startFromEpisode =
				series.episodes.find(episode => episode.episodeInt == anime.user_rate.episodes + 1)
				|| series.episodes.find(episode => episode.episodeInt == anime.user_rate.episodes)
				|| series.episodes.find(episode => episode.episodeInt == 1)

			playerURL.searchParams.append('episode', startFromEpisode.id)
		}

		link.href = playerURL.toString()
	} else {
		WatchButtonSection.querySelector('#watch-online-button').textContent = 'Нет видео'
	}

}



async function getAnime() {
	const idMatch = location.pathname.match('animes/([0-9]+)')
	if (!idMatch || !idMatch[1]) {
		return undefined
	}

	const response = await fetch(`${location.protocol}//${location.host}/api/animes/${idMatch[1]}`)
	const data = await response.json()

	return data
}