// Запуск главной функции
main()


async function main() {


	// Созданиие кнопки для перехода к плееру
	const WatchButtonSection = document.createElement('section')
	WatchButtonSection.classList.add('block')
	WatchButtonSection.classList.add('watch-online-block')
	WatchButtonSection.innerHTML = `
		<div class="subheadline m10">Онлайн просмотр</div>
		<a href="#" id="watch-online-button" class="b-link_button dark">Загрузка</a>
		`
	document.querySelector('.c-info-right').appendChild(WatchButtonSection)


	// Поиск сериала сопостовляя ссылки на сторонние источники
	const extendServices = [
		{ class: 'myanimelist', query: 'myAnimeListId' },
		{ class: 'anime_news_network', query: 'animeNewsNetworkId' },
		{ class: 'anime_db', query: 'aniDbId' },
		{ class: 'world_art', query: 'worldArtId' },
	]

	const series = await getOnlineServiceID(extendServices)

	if (series && series.episodes && series.episodes.length) {
		/** @type {HTMLAnchorElement} */
		const link = WatchButtonSection.querySelector('#watch-online-button')
		link.textContent = 'Смотреть онлайн'
		link.href = chrome.runtime.getURL(`player/index.html?series=${series.id}`)
	} else {
		WatchButtonSection.querySelector('#watch-online-button').textContent = 'Нет видео'
	}
}


async function getOnlineServiceID(extendServices) {
	for (const service of extendServices) {
		/** @type {HTMLAnchorElement} */
		const link = document.querySelector(`.b-external_link.${service.class} a`)
		if (!link || !link.href) {
			continue
		}

		let serviceID = null
		let match = null

		switch (service.class) {
			case 'myanimelist':
				match = link.href.match(/[0-9]+$/)
				if (match) serviceID = match[0]
				break;

			case 'anime_news_network':
				match = link.href.match(/[0-9]+$/)
				if (match) serviceID = match[0]
				break;

			case 'anime_db':
				match = link.href.match(/[0-9]+$/)
				if (match) serviceID = match[0]
				break;

			case 'world_art':
				match = link.href.match(/[0-9]+$/)
				if (match) serviceID = match[0]
				break;
		}

		if (!serviceID) {
			continue
		}

		const { data } = await apiCall(`/series/?${service.query}=${serviceID}`)

		if (data.length) {
			return data[0]
		}

	}

	return null
}