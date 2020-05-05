import {EpisodeFactory} from '@/interfaces/EpisodeFactory';
import {SmEpisodeQuery, SmEpisodeResponse} from '@/interfaces/smotret-anime-api';
import {Episode} from '@/interfaces/Episode';
import {SmEpisode} from '@/classes/SmEpisode';
import {SmAbstractFactory} from '@/classes/SmAbstractFactory';



/**
 * Фабрика для серий
 */
class SmEpisodeFactory extends SmAbstractFactory<SmEpisodeQuery, SmEpisodeResponse> implements EpisodeFactory {
  constructor() {
    super('/episodes');
  }



  public search(query: SmEpisodeQuery): Promise<Episode[]> {
    return this.apiClient.search(query).then((r) => r.map((i) => new SmEpisode(i)));
  }



  public single(id: number): Promise<Episode> {
    return this.apiClient.getSingle(id).then((r) => new SmEpisode(r));
  }

}




export default new SmEpisodeFactory();
