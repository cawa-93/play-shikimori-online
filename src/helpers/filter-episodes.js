export function filterEpisodes({episodes, type, numberOfEpisodes} = {}) {
	if (!episodes || !episodes.length) {
		return []
	}

	let filteredEpisodes = episodes.filter(e => e.isActive && (
		!numberOfEpisodes || parseFloat(e.episodeInt) <= numberOfEpisodes
	))

	if (!filteredEpisodes.length) {
		return []
	}

	const episodeType = filteredEpisodes[0].episodeType
	if (!filteredEpisodes.every(e => e.episodeType === episodeType)) {
		filteredEpisodes = filteredEpisodes.filter(e => e.episodeType === type)
	}

	return filteredEpisodes
}