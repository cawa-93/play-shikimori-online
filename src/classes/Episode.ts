import {Anime365Item} from '@/classes/Anime365Item';



export interface EpisodeContext {
  id: number;
  episodeFull: string;
  episodeInt: string;
  episodeTitle: string;
  episodeType: string;
  firstUploadedDateTime: string;
  isActive: boolean;
  seriesId: number;
}



class Episode extends Anime365Item {

  public readonly int: number;
  public readonly title: EpisodeContext['episodeTitle'];
  public readonly type: EpisodeContext['episodeType'];
  public readonly firstUploadedDateTime: EpisodeContext['firstUploadedDateTime'];
  public readonly seriesId: EpisodeContext['seriesId'];



  constructor(context: EpisodeContext) {
    super(context);
    this.int = Number(context.episodeInt);
    this.title = context.episodeTitle;
    this.type = context.episodeType;
    this.firstUploadedDateTime = context.firstUploadedDateTime;
    this.seriesId = context.seriesId;

    Object.freeze(this);
  }
}
