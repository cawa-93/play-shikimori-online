import {Anime} from '@/interfaces/Anime';



export interface AnimeFactory {
  single(id: number): Promise<Anime>;

  search(query: any): Promise<Anime[]>;
}
