const extensionId = (new URL(location.href)).searchParams.get('extension-id')

if (window.parent && extensionId === chrome.runtime.id) {
  /** @type {HTMLVideoElement} */
  const video = document.querySelector('video#main-video')

  if (video) {
    const events = ["pause", "play"]
    events.forEach(eventName => {
      video.addEventListener(eventName, (event) => {
        window.parent.postMessage({
          name: eventName,
        }, '*')
      });
    })


    function videoChunksObserverHandler() {
      const sources = JSON.parse(video.dataset.sources)
      const selectedSource = sources.find(s => s.urls.includes(video.src))
      if (!selectedSource || !video.src) {
        return
      }

      if (selectedSource.urls[selectedSource.urls.length - 1] === video.src) {
        video.addEventListener('timeupdate', timeupdateHandler)
        video.addEventListener('ended', endedHandler)
      } else {
        video.removeEventListener('timeupdate', timeupdateHandler)
        video.removeEventListener('ended', endedHandler)
      }
    }

    const videoChunksObserver = new MutationObserver(videoChunksObserverHandler)
    const observerConfig = { attributeFilter: ['src'], subtree: false, childList: false }
    videoChunksObserver.observe(video, observerConfig)

    function timeupdateHandler() {
      const currentTime = video.currentTime
      const duration = video.duration
      const endingTime = duration > 600 ? 120 : duration * 0.1
      /** @type {HTMLButtonElement} */
      let nextEpisodeButton = document.querySelector('.next-episode')

      if (duration - currentTime <= endingTime) {
        if (!nextEpisodeButton) {
          nextEpisodeButton = document.createElement('button')
          nextEpisodeButton.innerText = "Следующий епизод"
          nextEpisodeButton.classList.add('next-episode')
          nextEpisodeButton.hidden = true
          document.querySelector('#main-video').appendChild(nextEpisodeButton)

          nextEpisodeButton.onclick = function () {
            window.parent.postMessage({
              name: 'mark-as-watched',
              currentTime: video.currentTime,
              duration: video.duration,
              paused: video.paused,
            }, '*')
          }
        }

        nextEpisodeButton.hidden = false
      } else if (nextEpisodeButton) {
        nextEpisodeButton.hidden = true
      }
    }

    function endedHandler() {
      window.parent.postMessage({
        name: 'ended',
      }, '*')
    }


  }

}