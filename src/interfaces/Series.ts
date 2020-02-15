import {Title} from '@/interfaces/Title';



export enum SeriesTypes {
  tv = 'tv',
  ova = 'ova',
}



export interface Series {
  readonly id: number;
  readonly title: Title;
  readonly type: SeriesTypes;
}
