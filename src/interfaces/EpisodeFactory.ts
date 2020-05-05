import {Episode} from '@/interfaces/Episode';



export interface EpisodeFactory {
  single(id: number): Promise<Episode>;

  search(query: any): Promise<Episode[]>;
}
