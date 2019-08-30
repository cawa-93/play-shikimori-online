declare namespace anime365 {
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
        episodeInt: number;
        episodeTitle: string;
        episodeType: string;
        firstUploadedDateTime: string;
        isActive: boolean;
        isFirstUploaded: boolean;
        seriesId: number;
        countViews: number;
        translations?: Translation[];
        preselectedTranslation?: Translation;
        myAnimelist?: number;
        next?: Episode;
        previous?: Episode;
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
            data: Series[];
        }

        interface SeriesSelf {
            data: Series;
        }

        interface EpisodeSelf {
            data: Episode;
        }
    }
}


// namespace vuex {
//     interface Context {
//         state: State;
//         commit: Funtion;
//         dispatch: Function;
//         getters: Object;
//     }
//
//     interface State {
//         player: Player;
//         shikimori: Shikimori;
//     }
//
//     interface Player {
//         episodes?: anime365.Episode[];
//         currentEpisode?: anime365.Episode;
//         currentTranslation?: anime365.Translation;
//     }
//
//     interface Shikimori {
//         anime?: shikimori.Anime;
//         franchise?: shikimori.FranchiseNode;
//         user?: shikimori.User;
//         domain: string;
//     }
// }
