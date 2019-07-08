/**
 * Оптимальный поиск серии на основе её порядкового номера
 * @param {anime365.Episode[]} episodes 
 * @param {number} episodeInt 
 */
export function findEpisode(episodes, episodeInt) {
  let targetEpisode = episodes[episodeInt]
  if (targetEpisode && parseFloat(targetEpisode.episodeInt) === episodeInt) {
    return targetEpisode
  }

  let index = 1
  while (episodes[episodeInt + index] || episodes[episodeInt - index]) {
    if (episodes[episodeInt - index] && parseFloat(episodes[episodeInt - index].episodeInt) === episodeInt) {
      return episodes[episodeInt - index]
    }

    if (episodes[episodeInt + index] && parseFloat(episodes[episodeInt + index].episodeInt) === episodeInt) {
      return episodes[episodeInt + index]
    }

    index++
  }

  return undefined
}