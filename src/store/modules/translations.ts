import Vue from 'vue';
import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {Translation} from '@/types/anime365';
import {anime365Client} from '@/ApiClasses/Anime365Client';


type Fields =
  'id'
  | 'activeDateTime'
  | 'isActive'
  | 'priority'
  | 'qualityType'
  | 'type'
  | 'title'
  | 'seriesId'
  | 'episodeId'
  | 'authorsSummary'
  | 'embedUrl'
  | 'height';
type E = Pick<Translation, Fields>;



@Module({
  dynamic: true,
  namespaced: true,
  name: 'translations',
  store,
})

export class TranslationsStore extends VuexModule {
  public items: {
    [key: number]: E,
  } = {};



  get getForEpisode(): (episodeId: number) => E[] {
    const map = new Map();

    // tslint:disable-next-line:no-unused-expression
    this.items; // Необходимо чтобы геттер пересчитывался при изменении this.items

    return (episodeId: number) => {
      if (map.has(episodeId)) {
        return map.get(episodeId);
      }

      let translations = [];

      for (const translationId in this.items) {
        if (this.items[translationId].episodeId === episodeId) {
          translations.push(this.items[translationId]);
        }
      }

      if (translations.length) {
        translations = translations.sort((t1, t2) => {
          if (t1.qualityType === 'dvd' || t1.qualityType === 'bd' && t2.qualityType === 'tv') {
            return -1;
          }

          if (t2.qualityType === 'dvd' || t2.qualityType === 'bd' && t1.qualityType === 'tv') {
            return 1;
          }

          return t2.height - t1.height;
        });
        map.set(episodeId, translations);
      }

      return translations;
    };
  }



  @Mutation
  public set(translation: E) {
    Vue.set(this.items, translation.id, translation);
  }



  @Mutation
  public remove(ids: number | number[]) {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    ids.forEach((id) => Vue.delete(this.items, id));
  }



  @Action
  public async loadTranslations(episodeId: number) {


    if (this.getForEpisode(episodeId).length) {
      return;
    }

    const fields: Fields[] = [
      'activeDateTime',
      'isActive',
      'priority',
      'qualityType',
      'type',
      'title',
      'seriesId',
      'episodeId',
      'authorsSummary',
      'embedUrl',
      'height',
    ];

    const promise = anime365Client.getTranslationsCollection({
      episodeId,
      isActive: 1,
    }, fields);

    const translations = await promise;

    if (translations.length) {
      translations.forEach((t) => this.set(t));
    }
  }

}



export const translationsStore = getModule(TranslationsStore);


// TODO: DELETE AFTER DEBUG
if (process.env.NODE_ENV !== 'production') {
// @ts-ignore
  window.transactionsStore = translationsStore;
}
