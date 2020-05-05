import {TranslationFactory} from '@/interfaces/TranslationFactory';
import {SmTranslationQuery, SmTranslationResponse} from '@/interfaces/smotret-anime-api';
import {Translation} from '@/interfaces/Translation';
import {SmTranslation} from '@/classes/SmTranslation';
import {SmAbstractFactory} from '@/classes/SmAbstractFactory';



class SmTranslationFactory
  extends SmAbstractFactory<SmTranslationQuery, SmTranslationResponse>
  implements TranslationFactory {
  constructor() {
    super('/translations');
  }



  public search(query: SmTranslationQuery): Promise<Translation[]> {
    return this.apiClient.search(query).then((r) => r.map((i) => new SmTranslation(i)));
  }



  public single(id: number): Promise<Translation> {
    return this.apiClient.getSingle(id).then((r) => new SmTranslation(r));
  }

}



export default new SmTranslationFactory();
