window.onload = function () {
	window.playerGlobal.ready(function () {

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


			setCuttentTime()
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
		 * Создаёт кнопку переключения эпизода и инизиализурует обработчик собитий на ней
		 */
		function createNextEpisodeButton() {
			const nextEpisodeButton = document.createElement('button')
			nextEpisodeButton.innerText = "Следующий эпизод"
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
					nextEpisodeButton.hidden = event.hidden
				}
			});
		}

		/**
		 * 
		 */
		function setCuttentTime() {
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
	})







};



// const extensionId = (new URL(location.href)).searchParams.get('extension-id')

// if (window.parent && extensionId === chrome.runtime.id) {
//   /** @type {HTMLVideoElement} */
//   const video = document.querySelector('video#main-video')

//   if (video) {
//     const events = ["pause", "play"]
//     events.forEach(eventName => {
//       video.addEventListener(eventName, (event) => {
//         window.parent.postMessage({
//           name: eventName,
//         }, '*')
//       });
//     })


//     function videoChunksObserverHandler() {
//       const sources = JSON.parse(video.dataset.sources)
//       const selectedSource = sources.find(s => s.urls.includes(video.src))
//       if (!selectedSource || !video.src) {
//         return
//       }

//       if (selectedSource.urls[selectedSource.urls.length - 1] === video.src) {
//         video.addEventListener('timeupdate', timeupdateHandler)
//         video.addEventListener('ended', endedHandler)
//       } else {
//         video.removeEventListener('timeupdate', timeupdateHandler)
//         video.removeEventListener('ended', endedHandler)
//       }
//     }

//     const videoChunksObserver = new MutationObserver(videoChunksObserverHandler)
//     const observerConfig = { attributeFilter: ['src'], subtree: false, childList: false }
//     videoChunksObserver.observe(video, observerConfig)

//     function timeupdateHandler() {
//       const currentTime = video.currentTime
//       const duration = video.duration
//       const endingTime = duration > 600 ? 120 : duration * 0.1
//       /** @type {HTMLButtonElement} */
//       let nextEpisodeButton = document.querySelector('.next-episode')

//       if (duration - currentTime <= endingTime) {
//         if (!nextEpisodeButton) {
//           nextEpisodeButton = document.createElement('button')
//           nextEpisodeButton.innerText = "Следующий эпизод"
//           nextEpisodeButton.classList.add('next-episode')
//           nextEpisodeButton.hidden = true
//           document.querySelector('#main-video').appendChild(nextEpisodeButton)

//           nextEpisodeButton.onclick = function () {
//             window.parent.postMessage({
//               name: 'mark-as-watched',
//               currentTime: video.currentTime,
//               duration: video.duration,
//               paused: video.paused,
//             }, '*')
//           }
//         }

//         nextEpisodeButton.hidden = false
//       } else if (nextEpisodeButton) {
//         nextEpisodeButton.hidden = true
//       }
//     }

//     function endedHandler() {
//       window.parent.postMessage({
//         name: 'ended',
//       }, '*')
//     }


//   }

// }