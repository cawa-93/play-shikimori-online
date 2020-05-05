import {Anime} from '@/interfaces/Anime';
import {SmAnimeResponse} from '@/interfaces/smotret-anime-api';



export class SmAnime implements Anime {

  public readonly id: number;
  public readonly malId: number;



  constructor(data: SmAnimeResponse) {
    this.malId = data.myAnimeListId;
    this.id = data.id;
  }
}
