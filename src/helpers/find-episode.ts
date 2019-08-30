/**
 * Оптимальный поиск серии на основе её порядкового номера
 * @param {anime365.Episode[]} episodes
 * @param {number} episodeInt
 */
export function findEpisode(episodes: anime365.Episode[], episodeInt: number) {
    const targetEpisode = episodes[episodeInt];
    // @ts-ignore
    if (targetEpisode && parseFloat(targetEpisode.episodeInt) === episodeInt) {
        return targetEpisode;
    }

    let index = 1;
    while (episodes[episodeInt + index] || episodes[episodeInt - index]) {
        // @ts-ignore
        if (episodes[episodeInt - index] && parseFloat(episodes[episodeInt - index].episodeInt) === episodeInt) {
            return episodes[episodeInt - index];
        }

        // @ts-ignore
        if (episodes[episodeInt + index] && parseFloat(episodes[episodeInt + index].episodeInt) === episodeInt) {
            return episodes[episodeInt + index];
        }
        index++;
    }

    return undefined;
}
