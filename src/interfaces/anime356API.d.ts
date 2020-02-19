export interface SuccessResponse<T> {
  data: T;
}




export interface ErrorResponse {
  error: {
    code: number;
    message: string;
  };
}



export type Response<T> = SuccessResponse<T> | ErrorResponse;



export interface Series {
  id: number;
  aniDbId: number;
  animeNewsNetworkId: number;
  fansubsId: number;
  imdbId: number;
  worldArtId: number;
  isActive: number;
  isAiring: number;
  isHentai: number;
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



export interface Episode {
  id: number;
  episodeFull: string;
  episodeInt: string;
  episodeTitle: string;
  episodeType: string;
  firstUploadedDateTime: string;
  isActive: number;
  isFirstUploaded: number;
  seriesId: number;
}



export interface EpisodeFull extends Episode {
  translations: Translation[];
}



export interface Translation {
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
  url: string;
  embedUrl: string;
  authorsSummary: string;
  duration: string;
  width: number;
  height: number;
}




export interface Link {
  title: string;
  url: string;
}



export interface Titles {
  ru: string;
  romaji: string;
  ja: string;
  en: string;
  short: string;
}



export interface Description {
  source: string;
  value: string;
  updatedDateTime: string;
}



export interface Genre {
  id: number;
  title: string;
  url: string;
}



export interface Embed {
  download: DownloadItem[];
  embedUrl: string;
  stream: StreamItem[];
  subtitlesUrl: string | null;
}



export interface DownloadItem {
  height: number;
  url: string;
}



export interface StreamItem {
  height: number;
  urls: string[];
}


