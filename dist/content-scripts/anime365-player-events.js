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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWUzNjUtcGxheWVyLWV2ZW50cy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRlbnQtc2NyaXB0cy9hbmltZTM2NS1wbGF5ZXItZXZlbnRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImlmICh3aW5kb3cucGFyZW50KSB7XG4gIC8qKiBAdHlwZSB7SFRNTFZpZGVvRWxlbWVudH0gKi9cbiAgY29uc3QgdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlbyNtYWluLXZpZGVvJylcblxuICBpZiAodmlkZW8pIHtcbiAgICBjb25zdCBldmVudHMgPSBbXCJhYm9ydFwiLCBcImNhbnBsYXlcIiwgXCJjYW5wbGF5dGhyb3VnaFwiLCBcImR1cmF0aW9uY2hhbmdlXCIsIFwiZW1wdGllZFwiLCBcImVuZGVkXCIsIFwiZXJyb3JcIiwgXCJsb2FkZWRkYXRhXCIsIFwibG9hZGVkbWV0YWRhdGFcIiwgXCJsb2Fkc3RhcnRcIiwgXCJwYXVzZVwiLCBcInBsYXlcIiwgXCJwbGF5aW5nXCIsIFwicHJvZ3Jlc3NcIiwgXCJyYXRlY2hhbmdlXCIsIFwic2Vla2VkIFwiLCBcInNlZWtpbmdcIiwgXCJzdGFsbGVkXCIsIFwic3VzcGVuZFwiLCBcInRpbWV1cGRhdGVcIiwgXCJ2b2x1bWVjaGFuZ2VcIiwgXCJ3YWl0aW5nXCJdXG4gICAgZXZlbnRzLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB2aWRlby5jdXJyZW50VGltZVxuICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHZpZGVvLmR1cmF0aW9uXG4gICAgICAgIGNvbnN0IHBhdXNlZCA9IHZpZGVvLnBhdXNlZFxuXG4gICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIG5hbWU6IGV2ZW50TmFtZSxcbiAgICAgICAgICBjdXJyZW50VGltZSxcbiAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICBwYXVzZWQsXG4gICAgICAgIH0sICcqJylcblxuXG4gICAgICAgIGlmIChldmVudE5hbWUgPT09ICd0aW1ldXBkYXRlJykge1xuICAgICAgICAgIC8qKiBAdHlwZSB7SFRNTEJ1dHRvbkVsZW1lbnR9ICovXG4gICAgICAgICAgbGV0IG5leHRFcGlzb2RlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5leHQtZXBpc29kZScpXG5cbiAgICAgICAgICBpZiAoZHVyYXRpb24gLSBjdXJyZW50VGltZSA8IDEyMCkge1xuICAgICAgICAgICAgaWYgKCFuZXh0RXBpc29kZUJ1dHRvbikge1xuICAgICAgICAgICAgICBuZXh0RXBpc29kZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgICAgICAgICAgIG5leHRFcGlzb2RlQnV0dG9uLmlubmVyVGV4dCA9IFwi0KHQu9C10LTRg9GO0YnQuNC5INC10L/QuNC30L7QtFwiXG4gICAgICAgICAgICAgIG5leHRFcGlzb2RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ25leHQtZXBpc29kZScpXG4gICAgICAgICAgICAgIG5leHRFcGlzb2RlQnV0dG9uLmhpZGRlbiA9IHRydWVcbiAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW4tdmlkZW8nKS5hcHBlbmRDaGlsZChuZXh0RXBpc29kZUJ1dHRvbilcblxuICAgICAgICAgICAgICBuZXh0RXBpc29kZUJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgbmFtZTogJ21hcmstYXMtd2F0Y2hlZCcsXG4gICAgICAgICAgICAgICAgICBjdXJyZW50VGltZTogdmlkZW8uY3VycmVudFRpbWUsXG4gICAgICAgICAgICAgICAgICBkdXJhdGlvbjogdmlkZW8uZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICBwYXVzZWQ6IHZpZGVvLnBhdXNlZCxcbiAgICAgICAgICAgICAgICB9LCAnKicpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV4dEVwaXNvZGVCdXR0b24uaGlkZGVuID0gZmFsc2VcbiAgICAgICAgICB9IGVsc2UgaWYgKG5leHRFcGlzb2RlQnV0dG9uKSB7XG4gICAgICAgICAgICBuZXh0RXBpc29kZUJ1dHRvbi5oaWRkZW4gPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KVxuICB9XG59Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTs7RUFFakIsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBQzs7RUFFeEQsSUFBSSxLQUFLLEVBQUU7SUFDVCxNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBQztJQUM1UixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSTtNQUMxQixLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxLQUFLO1FBQzNDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxZQUFXO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFRO1FBQy9CLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFNOztRQUUzQixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztVQUN4QixJQUFJLEVBQUUsU0FBUztVQUNmLFdBQVc7VUFDWCxRQUFRO1VBQ1IsTUFBTTtTQUNQLEVBQUUsR0FBRyxFQUFDOzs7UUFHUCxJQUFJLFNBQVMsS0FBSyxZQUFZLEVBQUU7O1VBRTlCLElBQUksaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUM7O1VBRS9ELElBQUksUUFBUSxHQUFHLFdBQVcsR0FBRyxHQUFHLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO2NBQ3RCLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFDO2NBQ3BELGlCQUFpQixDQUFDLFNBQVMsR0FBRyxtQkFBa0I7Y0FDaEQsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUM7Y0FDL0MsaUJBQWlCLENBQUMsTUFBTSxHQUFHLEtBQUk7Y0FDL0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUM7O2NBRXBFLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxZQUFZO2dCQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztrQkFDeEIsSUFBSSxFQUFFLGlCQUFpQjtrQkFDdkIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2tCQUM5QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7a0JBQ3hCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtpQkFDckIsRUFBRSxHQUFHLEVBQUM7Z0JBQ1I7YUFDRjs7WUFFRCxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsTUFBSztXQUNqQyxNQUFNLElBQUksaUJBQWlCLEVBQUU7WUFDNUIsaUJBQWlCLENBQUMsTUFBTSxHQUFHLEtBQUk7V0FDaEM7U0FDRjtPQUNGLENBQUMsQ0FBQztLQUNKLEVBQUM7R0FDSDsifQ==
