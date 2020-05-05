import type {Episode} from '@/interfaces/Episode';
import {SmEpisodeResponse} from '@/interfaces/smotret-anime-api';



export class SmEpisode implements Episode {
  public readonly animeId: number;
  public readonly id: number;
  public readonly title: string;
  public readonly type: 'ova' | 'tv' | 'ona';



  constructor(props: SmEpisodeResponse) {
    this.id = props.id;
    this.title = props.title;
    this.animeId = props.animeId;
    this.type = props.episodeType;
  }


}
