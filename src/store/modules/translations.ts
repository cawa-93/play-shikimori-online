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
  | 'embedUrl';
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



  get getForEpisode() {
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
        translations = translations.sort((t1, t2) => t1.priority - t2.priority);
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

    const promise = anime365Client.getTranslationsCollection({
      episodeId,
      isActive: 1,
    }, [
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
    ]);

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
