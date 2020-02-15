import {Title} from '@/interfaces/Title';
import {Series, SeriesTypes} from '@/interfaces/Series';



export interface Episode {
  readonly id: number;
  readonly title: Title;
  readonly type: SeriesTypes;
  readonly seriesId: Series['id'];
}
