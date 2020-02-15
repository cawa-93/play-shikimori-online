import {Episode} from '@/interfaces/Episode';
import {Author} from '@/interfaces/Author';



export enum TranslationKinds {
  voice = 'voice',
  sub = 'sub',
  raw = 'raw',
}



export enum TranslationLang {
  ru = 'ru',
  en = 'en',
  ja = 'ja',
}



export interface Translation {
  readonly id: number;
  readonly isActive: boolean;
  readonly episodeId: Episode['id'];
  readonly authors: Author;
  readonly kind: TranslationKinds;
  readonly lang: TranslationLang;
}
