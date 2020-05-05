import {AnimeFactory} from '@/interfaces/AnimeFactory';
import {SmAnimeQuery, SmAnimeResponse} from '@/interfaces/smotret-anime-api';
import {Anime} from '@/interfaces/Anime';
import {SmAnime} from '@/classes/SmAnime';
import {SmAbstractFactory} from '@/classes/SmAbstractFactory';



class SmAnimeFactory extends SmAbstractFactory<SmAnimeQuery, SmAnimeResponse> implements AnimeFactory {
  constructor() {
    super('/series');
  }



  public search(query: SmAnimeQuery): Promise<Anime[]> {
    return this.apiClient.search(query).then((r) => r.map((i) => new SmAnime(i)));
  }



  public single(id: number): Promise<Anime> {
    return this.apiClient.getSingle(id).then((r) => new SmAnime(r));
  }

}



export default new SmAnimeFactory();
