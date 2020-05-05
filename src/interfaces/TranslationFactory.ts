import {Translation} from '@/interfaces/Translation';



export interface TranslationFactory {
  single(id: number): Promise<Translation>;

  search(query: any): Promise<Translation[]>;
}
