import {SeriesChainBase} from '@/classes/SeriesChainBase';
import {Series} from '@/interfaces/Series';



export class SeriesChainInMemoryCache extends SeriesChainBase {
  private cache = new Map<number, Promise<Series | undefined>>();



  public getSeries(id: number) {
    let series = this.cache.get(id);

    if (!series) {
      series = super.getSeries(id);
      this.cache.set(id, series);
    }

    return series;
  }
}
