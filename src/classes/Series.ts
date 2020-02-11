import {Titles, TitlesContext} from '@/classes/Titles';
import {Anime365Item} from '@/classes/Anime365Item';



export interface SeriesContext {
  id: number;
  isActive: boolean;
  myAnimeListId: number;
  numberOfEpisodes: number;
  type: string;
  titles: TitlesContext;
  posterUrl: string;
  posterUrlSmall: string;
  url: string;
  // episodes?: EpisodeContext[];
}



export class Series extends Anime365Item {
  public readonly myAnimeListId: SeriesContext['myAnimeListId'];
  public readonly numberOfEpisodes: SeriesContext['numberOfEpisodes'];
  public readonly posterUrl: SeriesContext['posterUrl'];
  public readonly posterUrlSmall: SeriesContext['posterUrlSmall'];
  public readonly titles: Titles;
  public readonly url: SeriesContext['url'];
  public readonly type: SeriesContext['type'];



  constructor(context: SeriesContext) {
    super(context);
    this.myAnimeListId = context.myAnimeListId;
    this.numberOfEpisodes = context.numberOfEpisodes;
    this.posterUrl = context.posterUrl;
    this.posterUrlSmall = context.posterUrlSmall;
    this.url = context.url;
    this.type = context.type;

    this.titles = new Titles(context.titles);

    Object.freeze(this);
  }
}
