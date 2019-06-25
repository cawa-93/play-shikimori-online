import { storage } from "kv-storage-polyfill";
import { throttle } from "../helpers";

/**
 * @type {videojs.default.Player & {concatenate: {activated: boolean}}}
 */
const player = window.playerGlobal
const currentURL = new URL(location.href)
const seriesId = currentURL.searchParams.get('play-shikimori[seriesId]')
const episodeId = currentURL.searchParams.get('play-shikimori[episodeId]')

/**
 * Главная функция
 * Запускается один раз, при первом запуске видео после рекламы
 */
function main() {
	if (!player.concatenate.activated) return
	player.off('play', main)


	setCurrentTime()
	initSaveFullScreenState()
	const nextEpisodeButton = createNextEpisodeButton()

	/**
	 * Инициализирует отправку событий плеера к родительскому окну
	 */
	player.on(['play', 'pause', 'ended'], proxyEventToParent)

	const saveCurrentTimeThrottled = throttle(saveCurrentTime, 10000)
	const toggleNextEpisodeButtonThrottled = throttle(toggleNextEpisodeButton, 1000)

	player.on('timeupdate', () => {

		const currentTime = player.currentTime()
		const duration = player.duration()

		saveCurrentTimeThrottled({ seriesId, episodeId, currentTime })
		toggleNextEpisodeButtonThrottled({ currentTime, duration, nextEpisodeButton })
	})
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

	return nextEpisodeButton
}

/**
 * Следим за временем и показываем/скрываем кнопку следующей серии
 */
function toggleNextEpisodeButton({ nextEpisodeButton, duration, currentTime }) {
	if (!nextEpisodeButton || !duration || !currentTime) {
		return
	}

	const endingTime = duration > 600 ? 120 : duration * 0.1;
	if (nextEpisodeButton.style.display === 'none' && duration - currentTime <= endingTime) {
		nextEpisodeButton.style.display = 'block'
	} else if (nextEpisodeButton.style.display !== 'none' && duration - currentTime > endingTime) {
		nextEpisodeButton.style.display = 'none'
	}
}

/**
 * Загружаем сохранённое время и устанавливаем значение в плеере
 */
async function setCurrentTime() {

	let savedTime = await storage.get(`play-${seriesId}-time`)
	if (!seriesId || !episodeId || !savedTime) return

	if (savedTime.episodeId === episodeId) {
		player.currentTime(Math.max(0, savedTime.time))
	}
}


/**
 * Сохранение текущей временной метки
 */
async function saveCurrentTime({ seriesId, episodeId, currentTime }) {

	if (!seriesId || !episodeId || !currentTime) {
		return
	}

	let savedTime = {
		episodeId,
		time: currentTime
	}
	storage.set(`play-${seriesId}-time`, savedTime)
}

function initSaveFullScreenState() {
	player.on('fullscreenchange', () => {
		storage.set(`play-fullscreen-state`, player.isFullscreen())
	})
}

/**
 * Функция автоматически запускает воспроизведение, если нет рекламной вставки
 */
async function autoPlay() {
	if (!player.concatenate.activated) return

	if (await storage.get(`play-fullscreen-state`) === true) {
		player.requestFullscreen()
	}
	player.play()
}

autoPlay()