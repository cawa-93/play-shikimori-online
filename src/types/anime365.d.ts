export interface Anime365Response<T> {
  data: T;
}



export interface Link {
  title: string;
  url: string;
}



export interface Titles {
  ru?: string;
  en?: string;
  romaji?: string;
  ja?: string;
  short?: string;
}



export interface Description {
  source: string;
  value: string;
  updatedDateTime: string;
}



export interface Episode {
  id: number;
  episodeFull: string;
  episodeInt: string;
  episodeTitle: string;
  episodeType: string;
  firstUploadedDateTime: string;
  isActive: boolean;
  isFirstUploaded: boolean;
  seriesId: number;
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
  countViews: number;
  url: string;
  embedUrl: string;
  authorsSummary: string;
  duration: string;
  width: number;
  height: number;
}



export interface Genre {
  id: number;
  title: string;
  url: string;
}



export interface Series {
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
  genres: Genre[];
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
