import {storage}  from 'kv-storage-polyfill'
import {throttle} from '../helpers/throttle'


(
	function () {
		try {
			const config = new URLSearchParams(location.hash.slice(1))
			/**
			 * @type {videojs.default.Player & {concatenate: {activated: boolean}}}
			 */
			const player = window.playerGlobal
			if (!player) {
				const waitUntilEmbedAvailable = document.body.querySelector('.wait-until-embed-available')
				if (!waitUntilEmbedAvailable) {
					// Исключение обрабатывается в блоке catch ниже
					throw new Error(`window.playerGlobal is ${window.playerGlobal}`)
				}

				const addUploadRequestForm = document.body.querySelector('form[action*="/translations/embedAddUploadRequest"]')
				if (addUploadRequestForm) {
					addUploadRequestForm.submit()
				}

				return
			}
			const seriesId = config.get('play-shikimori[seriesId]')
			const episodeId = config.get('play-shikimori[episodeId]')
			const nextEpisode = config.get('play-shikimori[nextEpisode]') === '1'
			const isAutoPlay = config.get('play-shikimori[isAutoPlay]') === '1'


			/**
			 * Главная функция
			 * Запускается один раз, при первом запуске видео после рекламы
			 */
			function init() {
				if (!player.concatenate.activated) return
				player.off('play', init)


				setCurrentTime()
				initSaveFullScreenState()
				let nextEpisodeButton
				if (nextEpisode) {
					nextEpisodeButton = createNextEpisodeButton()
				}

				/**
				 * Инициализирует отправку событий плеера к родительскому окну
				 */
				player.on(['play', 'pause', 'ended'], proxyEventToParent)

				const saveCurrentTimeThrottled = throttle(saveCurrentTime, 10000)
				const toggleNextEpisodeButtonThrottled = throttle(toggleNextEpisodeButton, 1000)

				player.on('timeupdate', () => {

					const currentTime = player.currentTime()
					const duration = player.duration()

					saveCurrentTimeThrottled({seriesId, episodeId, currentTime})
					if (nextEpisode && nextEpisodeButton) {
						toggleNextEpisodeButtonThrottled({currentTime, duration, nextEpisodeButton})
					}
				})

				/**
				 * Подписываем обработчик на события переключения режима Картинка в картинке
				 */
				window.addEventListener('message', ({data: event}) => {
					if (event && event.name === 'pictureInPictureToggle') {
						pictureInPictureToggle()
					}
				})
			}


			player.on('play', init)


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
				nextEpisodeButton.innerText = 'Следующая серия'
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
			function toggleNextEpisodeButton({nextEpisodeButton, duration, currentTime}) {
				if (!nextEpisodeButton || !duration || !currentTime) {
					return
				}

				const endingTime = duration > 600 ? 120 : duration * 0.1
				if (player.isFullscreen() && duration - currentTime <= endingTime) {
					nextEpisodeButton.style.display = 'block'
				} else {
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
			async function saveCurrentTime({seriesId, episodeId, currentTime}) {

				if (!seriesId || !episodeId || !currentTime) {
					return
				}

				let savedTime = {
					episodeId,
					time: currentTime,
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


			if (isAutoPlay) {
				autoPlay()
			}


			function pictureInPictureToggle() {
				if (!player || !player.tag) {
					return
				}

				if (!document.pictureInPictureElement) {
					player.tag.requestPictureInPicture()
						.catch(error => {
							// Video failed to enter Picture-in-Picture mode.
							console.error('Video failed to enter Picture-in-Picture mode.', {error})
						})
				} else {
					document.exitPictureInPicture()
						.catch(error => {
							// Video failed to leave Picture-in-Picture mode.
							console.error('Video failed to leave Picture-in-Picture mode.', {error})
						})
				}
			}
		} catch (error) {
			window.parent.postMessage({
				name: 'error',
				error: `${error.message}\n\n${error.stack}`,
			}, '*')
		}
	}
)()
