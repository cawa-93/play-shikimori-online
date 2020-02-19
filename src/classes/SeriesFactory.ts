import {SeriesLoader} from '@/interfaces/SeriesLoader';
import {SeriesChainInMemoryCache} from '@/classes/SeriesChainInMemoryCache';
import {Anime365SeriesLoader} from '@/classes/Anime365SeriesLoader';



export class SeriesFactory implements SeriesLoader {



  public static getInstance() {
    if (!SeriesFactory.instance) {
      SeriesFactory.instance = new SeriesFactory(new Anime365SeriesLoader());
    }
    return SeriesFactory.instance;
  }
  private static instance: SeriesFactory | undefined;



  private readonly chain: SeriesLoader;



  private constructor(chainNetwork?: SeriesLoader) {
    this.chain = new SeriesChainInMemoryCache(chainNetwork);
  }



  public getSeries(id: number) {
    return this.chain.getSeries(id);
  }
}



