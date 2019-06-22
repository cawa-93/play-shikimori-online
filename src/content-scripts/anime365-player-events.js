/**
 * @type {videojs.default.Player & {concatenate: {activated: boolean}}}
 */
const player = window.playerGlobal

/**
 * Главная функция
 * Запускается один раз, при первом запуске видео после рекламы
 */
function main() {
	if (!player.concatenate.activated) return
	player.off('play', main)


	setCurrentTime()
	initSaveCurrentTime()
	initSaveFullScreenState()
	createNextEpisodeButton()

	/**
	 * Инициализирует отправку событий плеера к родительскому окну
	 */
	player.on(['play', 'pause', 'ended', 'timeupdate'], proxyEventToParent)
}

player.on('play', main)


function proxyEventToParent(event) {
	const name = event.type
	const currentTime = player.currentTime()
	const duration = player.duration()

	if (name === 'ended' && duration - currentTime >= 10) {
		return
	}

	const message = {
		name,
		currentTime,
		duration,
	}
	window.parent.postMessage(message, '*')
}


/**
 * Создаёт кнопку переключения серии и инизиализурует обработчик собитий на ней
 */
function createNextEpisodeButton() {
	const nextEpisodeButton = document.createElement('button')
	nextEpisodeButton.innerText = "Следующая серия"
	nextEpisodeButton.classList.add('next-episode')
	nextEpisodeButton.hidden = true
	document.querySelector('#main-video').appendChild(nextEpisodeButton)
	nextEpisodeButton.addEventListener('click', function () {
		const message = {
			name: 'mark-as-watched',
			currentTime: player.currentTime(),
			duration: player.duration(),
		}
		window.parent.postMessage(message, '*')
	})

	window.addEventListener("message", function ({ data: event }) {
		if (event && event.button === 'next-episode') {
			nextEpisodeButton.style.display = event.hidden === false ? 'block' : 'none'
		}
	});
}

/**
 *
 */
function setCurrentTime() {
	const currentURL = new URL(location.href)
	const seriesId = currentURL.searchParams.get('play-shikimori[seriesId]')
	const episodeId = currentURL.searchParams.get('play-shikimori[episodeId]')
	let savedTime = localStorage.getItem(`play-${seriesId}-time`)
	if (!seriesId || !episodeId || !savedTime) return

	savedTime = JSON.parse(savedTime)
	if (savedTime.episodeId === episodeId) {
		player.currentTime(Math.max(0, savedTime.time - 10))
	}
}

function initSaveCurrentTime() {
	const currentURL = new URL(location.href)
	const seriesId = currentURL.searchParams.get('play-shikimori[seriesId]')
	const episodeId = currentURL.searchParams.get('play-shikimori[episodeId]')
	if (!seriesId || !episodeId) return

	player.on('timeupdate', () => {
		let savedTime = JSON.stringify({
			episodeId,
			time: player.currentTime()
		})
		localStorage.setItem(`play-${seriesId}-time`, savedTime)

	})
}

function initSaveFullScreenState() {
	player.on('fullscreenchange', () => {
		localStorage.setItem(`play-fullscreen-state`, player.isFullscreen())
	})
}

/**
 * Функция автоматически запускает воспроизведение, если нет рекламной вставки
 */
function autoPlay() {
	if (!player.concatenate.activated) return

	if (localStorage.getItem(`play-fullscreen-state`) === 'true') {
		player.requestFullscreen()
	}
	player.play()
}

autoPlay()
