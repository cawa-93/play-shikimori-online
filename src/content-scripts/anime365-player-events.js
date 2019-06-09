window.onload = function () {
	window.playerGlobal.ready(function () {

		/**
		 * Главная функция
		 * Запускается один раз, при первом запуске видео после рекламы
		 */
		function main() {
			// console.log('firstActivatedHandler', playerGlobal.concatenate.activated)
			if (!playerGlobal.concatenate.activated) return
			playerGlobal.off('play', main)


			setCurrentTime()
			initSaveCurrentTime()
			initSaveFullScreenState()
			initEventProxy()
			createNextEpisodeButton()
		}

		playerGlobal.on('play', main)


		/**
		 * Инициализирует отправку событий плеера к родительскому окну
		 */
		function initEventProxy() {
			const events = ['play', 'pause', 'ended', 'timeupdate']
			events.forEach(name => {
				playerGlobal.on(name, () => {
					if (!playerGlobal.concatenate.activated) return
					const message = {
						name,
						currentTime: playerGlobal.currentTime(),
						duration: playerGlobal.duration(),
					}
					window.parent.postMessage(message, '*')
				})
			})
		}


		/**
		 * Создаёт кнопку переключения эпизода и инизиализурует обработчик собитий на ней
		 */
		function createNextEpisodeButton() {
			const nextEpisodeButton = document.createElement('button')
			nextEpisodeButton.innerText = "Следующий епизод"
			nextEpisodeButton.classList.add('next-episode')
			nextEpisodeButton.hidden = true
			document.querySelector('#main-video').appendChild(nextEpisodeButton)
			nextEpisodeButton.addEventListener('click', function () {
				const message = {
					name: 'mark-as-watched',
					currentTime: playerGlobal.currentTime(),
					duration: playerGlobal.duration(),
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
		function setCurrentTime() {
			const currentURL = new URL(location.href)
			const seriesId = currentURL.searchParams.get('play-shikimori[seriesId]')
			const episodeId = currentURL.searchParams.get('play-shikimori[episodeId]')
			let savedTime = localStorage.getItem(`play-${seriesId}-time`)
			if (!seriesId || !episodeId || !savedTime) return

			savedTime = JSON.parse(savedTime)
			if (savedTime.episodeId === episodeId) {
				playerGlobal.currentTime(Math.max(0, savedTime.time - 10))
			}
		}

		function initSaveCurrentTime() {
			const currentURL = new URL(location.href)
			const seriesId = currentURL.searchParams.get('play-shikimori[seriesId]')
			const episodeId = currentURL.searchParams.get('play-shikimori[episodeId]')
			if (!seriesId || !episodeId) return

			playerGlobal.on('timeupdate', () => {
				let savedTime = JSON.stringify({
					episodeId,
					time: playerGlobal.currentTime()
				})
				localStorage.setItem(`play-${seriesId}-time`, savedTime)

			})
		}

		function initSaveFullScreenState() {
			playerGlobal.on('fullscreenchange', () => {
				localStorage.setItem(`play-fullscreen-state`, playerGlobal.isFullscreen())
			})
		}

		/**
		 * Функция автоматически запускает воспроизведение, если нет рекламной вставки
		 */
		function autoPlay() {
			if (!playerGlobal.concatenate.activated) return

			if (localStorage.getItem(`play-fullscreen-state`) === 'true') {
				playerGlobal.requestFullscreen()
			}
			playerGlobal.play()
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
//           nextEpisodeButton.innerText = "Следующий епизод"
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
