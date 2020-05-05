export interface SmBaseQuery {
  readonly limit?: number;
}



export interface SmAnimeResponse {
  readonly id: number;
  readonly myAnimeListId: number;
  readonly title: string;
  readonly episodes: Array<Omit<SmEpisodeResponse, 'translations'>>;
}



export interface SmAnimeQuery extends SmBaseQuery {
  readonly myAnimeListId?: number;
}



export interface SmEpisodeResponse {
  readonly id: number;
  title: string;
  readonly translations: SmTranslationResponse[];
  episodeType: 'ova' | 'tv';
  animeId: number;
}



export interface SmEpisodeQuery extends SmBaseQuery {
  readonly seriesId?: number;
}



export interface SmTranslationResponse {
  readonly id: number;
  readonly author: string;
  readonly type: 'voice' | 'sub' | 'raw';
}



export interface SmTranslationQuery extends SmBaseQuery {
  readonly episodeID: number;
}



export interface SmSuccessResponse<T> {
  readonly data: T;
}



export interface SmFailResponse {
  readonly error: {
    readonly code: number;
    readonly message: string;
  };
}



export type SmResponse<T> = SmSuccessResponse<T> | SmFailResponse;
