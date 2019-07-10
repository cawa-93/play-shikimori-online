declare module anime365 {
	interface Link {
		title: string;
		url: string;
	}

	interface Titles {
		ru?: string;
		en?: string;
		romaji?: string;
		ja?: string;
		short?: string;
	}

	interface Description {
		source: string;
		value: string;
		updatedDateTime: string;
	}

	interface Episode {
		id: number;
		episodeFull: string;
		episodeInt: string;
		episodeTitle: string;
		episodeType: string;
		firstUploadedDateTime: string;
		isActive: boolean;
		isFirstUploaded: boolean;
		seriesId: number;
		countViews: number;
		translations?: Translation[];
		preselectedTranslation?: Translation
	}

	interface Translation {
		id: number;
		addedDateTime: string;
		activeDateTime: string;
		authorsList: string[];
		fansubsTranslationId: number;
		isActive: number;
		priority: number;
		qualityType: string;
		type: string;
		typeKind: string;
		typeLang: string;
		updatedDateTime: string;
		title: string;
		seriesId: number;
		episodeId: number;
		countViews: number;
		url: string;
		embedUrl: string;
		authorsSummary: string;
		duration: string;
		width: number;
		height: number;
	}


	interface Genre {
		id: number;
		title: string;
		url: string;
	}

	interface Series {
		id: number;
		aniDbId: number;
		animeNewsNetworkId: number;
		fansubsId: number;
		imdbId: number;
		worldArtId: number;
		isActive: boolean;
		isAiring: boolean;
		isHentai: boolean;
		links: Link[];
		myAnimeListId: number;
		myAnimeListScore: string;
		worldArtScore: string;
		worldArtTopPlace: number;
		numberOfEpisodes: number;
		season: string;
		year: number;
		type: string;
		typeTitle: string;
		countViews: number;
		titles: Titles;
		posterUrl: string;
		posterUrlSmall: string;
		titleLines: string[];
		allTitles: string[];
		title: string;
		url: string;
		descriptions: Description[];
		episodes: Episode[];
		genres: Genre[];
	}

	namespace api {
		interface SeriesCollection {
			data: Series[]
		}

		interface SeriesSelf {
			data: Series
		}

		interface EpisodeSelf {
			data: Episode
		}
	}
}

declare module shikimori {

	interface Image {
		original: string;
		preview: string;
		x96: string;
		x48: string;
	}

	interface RatesScoresStat {
		name: number;
		value: number;
	}

	interface RatesStatusesStat {
		name: string;
		value: number;
	}

	interface Genre {
		id: number;
		name: string;
		russian: string;
		kind: string;
	}

	interface Studio {
		id: number;
		name: string;
		filtered_name: string;
		real: boolean;
		image?: any;
	}

	interface Video {
		id: number;
		url: string;
		image_url: string;
		player_url: string;
		name: string;
		kind: string;
		hosting: string;
	}

	interface Screenshot {
		original: string;
		preview: string;
	}

	interface UserRate {
		id?: number;
		score?: number;
		status?: string;
		text?: any;
		episodes?: number;
		chapters?: any;
		volumes?: any;
		text_html?: any;
		rewatches?: number;
	}

	interface Anime {
		id: number;
		name: string;
		russian: string;
		image: Image;
		url: string;
		kind: string;
		status: string;
		episodes: number;
		episodes_aired: number;
		aired_on: string;
		released_on: string;
		rating: string;
		english: string[];
		japanese: string[];
		synonyms: string[];
		license_name_ru?: any;
		duration: number;
		score: string;
		description: string;
		description_html: string;
		description_source?: any;
		franchise: string;
		favoured: boolean;
		anons: boolean;
		ongoing: boolean;
		thread_id: number;
		topic_id: number;
		myanimelist_id: number;
		rates_scores_stats: RatesScoresStat[];
		rates_statuses_stats: RatesStatusesStat[];
		updated_at: Date;
		next_episode_at: Date;
		genres: Genre[];
		studios: Studio[];
		videos: Video[];
		screenshots: Screenshot[];
		user_rate?: UserRate;
	}

	interface Avatar {
		x160?: string;
		x148?: string;
		x80?: string;
		x64?: string;
		x48?: string;
		x32?: string;
		x16?: string;
	}

	interface User {
		id: number;
		nickname: string;
		avatar: string;
		image: Avatar;
		last_online_at: Date;
		name?: string;
		sex?: string;
		website?: string;
		birth_on?: any;
		locale: string;
	}

	interface FranchiseLink {
		id: number;
		source_id: number;
		target_id: number;
		source: number;
		target: number;
		weight: number;
		relation: string;
	}

	interface FranchiseNode {
		id: number;
		date: number;
		name: string;
		image_url: string;
		url: string;
		year: number;
		kind: string;
		weight: number;
		series?: number;
		episodeInt?: number;
	}

}

declare module myanimelist {

	interface VideoUrl {
	}

	interface Episode {
		episode_id: number;
		title: string;
		title_japanese: string;
		title_romanji: string;
		aired: Date;
		filler: boolean;
		recap: boolean;
		video_url: VideoUrl;
		forum_url: string;
	}

}



namespace vuex {
	interface Context {
		state: State
		commit: Funtion
		dispatch: Function
		getters: Object
	}

	interface State {
		player: Player
		shikimori: Shikimori
	}

	interface Player {
		series?: anime365.Series
		currentEpisodeID?: number
		currentTranslationID?: number
	}

	interface Shikimori {
		anime?: shikimori.Anime
		franchise?: shikimori.FranchiseNode
		user?: shikimori.User
		domain: string
	}
}
