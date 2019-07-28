function createButton(infoSection) {

  const link = document.createElement('a')
  link.classList.add('btn-user-status-add-list')
  link.classList.add('watch-online-button')
  link.innerText = 'Watch now'
  const animeId = getAnimeId()
  let episodeInt = getEpisodeInt()

  const playerURL = new URL(chrome.runtime.getURL(`UI/index.html`))
  playerURL.hash = '/player/anime/' + animeId
  if (episodeInt) {
    playerURL.hash += `/${episodeInt + 1}` // Открываем следующую после просмотренной серию
  }

  link.href = playerURL.toString()

  infoSection.appendChild(link)

}

function getAnimeId() {
  try {
    return location.pathname.split("/")[2].replace(/\D/g, "");
  } catch (e) {
    console.error(e)
    return null
  }
}

function episodeInt() {
  try {
    document.querySelector('input#myinfo_watchedeps').value
  } catch (e) {

  }
}


function getEpisodeInt() {
  const episodeElement = document.querySelector('input#myinfo_watchedeps')
  if (!episodeElement) return 0

  const episodeItn = parseInt(episodeElement.value)

  return isNaN(episodeItn) ? 0 : episodeItn
}

function main() {
  let infoSection = document.querySelector('.user-status-block')

  if (!infoSection) {
    infoSection = document.querySelector('.status-unit')
    infoSection.classList.add('four-columns')
  }

  if (!infoSection) {
    console.error('Can\'t find infoSection')
    return
  }

  createButton(infoSection)
}

main()