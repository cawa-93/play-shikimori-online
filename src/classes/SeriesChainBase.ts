import {SeriesLoader} from '@/interfaces/SeriesLoader';
import {Series} from '@/interfaces/Series';



export class SeriesChainBase implements SeriesLoader {

  constructor(private nextChain?: SeriesLoader) {
  }



  public getSeries(id: number): Promise<Series | undefined> {
    if (this.nextChain) {
      return this.nextChain.getSeries(id);
    }

    return Promise.resolve(undefined);
  }

}
