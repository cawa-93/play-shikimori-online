import {Series} from '@/interfaces/Series';



export interface SeriesLoader {
  getSeries(id: number): Promise<Series | undefined>;
}
