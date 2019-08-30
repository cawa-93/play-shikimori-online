export function filterEpisodes(
    {episodes, type, numberOfEpisodes}
        : { episodes?: anime365.Episode[], type?: string, numberOfEpisodes?: number }
        = {},
) {
    if (!episodes || !episodes.length) {
        return [];
    }

    let filteredEpisodes = episodes.filter((e) => e.isActive && (
        // @ts-ignore
        !numberOfEpisodes || parseFloat(e.episodeInt) <= numberOfEpisodes
    ));

    if (!filteredEpisodes.length) {
        return [];
    }

    const episodeType = filteredEpisodes[0].episodeType;
    if (!filteredEpisodes.every((e) => e.episodeType === episodeType)) {
        filteredEpisodes = filteredEpisodes.filter((e) => e.episodeType === type);
    }

    return filteredEpisodes;
}
