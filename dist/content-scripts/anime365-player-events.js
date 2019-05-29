if (window.parent) {
  /** @type {HTMLVideoElement} */
  const video = document.querySelector('video#main-video');

  if (video) {
    const events = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "seeked ", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"];
    events.forEach(eventName => {
      video.addEventListener(eventName, (event) => {
        const currentTime = video.currentTime;
        const duration = video.duration;
        const paused = video.paused;

        window.parent.postMessage({
          name: eventName,
          currentTime,
          duration,
          paused,
        }, '*');


        if (eventName === 'timeupdate') {
          /** @type {HTMLButtonElement} */
          let nextEpisodeButton = document.querySelector('.next-episode');

          if (duration - currentTime < 120) {
            if (!nextEpisodeButton) {
              nextEpisodeButton = document.createElement('button');
              nextEpisodeButton.innerText = "Следующий епизод";
              nextEpisodeButton.classList.add('next-episode');
              nextEpisodeButton.hidden = true;
              document.querySelector('#main-video').appendChild(nextEpisodeButton);

              nextEpisodeButton.onclick = function () {
                window.parent.postMessage({
                  name: 'mark-as-watched',
                  currentTime: video.currentTime,
                  duration: video.duration,
                  paused: video.paused,
                }, '*');
              };
            }

            nextEpisodeButton.hidden = false;
          } else if (nextEpisodeButton) {
            nextEpisodeButton.hidden = true;
          }
        }
      });
    });
  }
}
