import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Vue from 'vue';
import {Series} from '@/types/anime365';
import {anime365Client} from '@/ApiClasses/Anime365Client';


type Fields =
  'id'
  | 'myAnimeListId'
  | 'numberOfEpisodes'
  | 'posterUrl'
  | 'posterUrlSmall'
  | 'titles'
  | 'url'
  | 'type'
  | 'isActive';
type S = Pick<Series, Fields>;



@Module({
  dynamic: true,
  namespaced: true,
  name: 'series',
  store,
})

export class SeriesStore extends VuexModule {
  public items: {
    [key: number]: S,
  } = {};

  public malMap: {
    [key: number]: S['id'],
  } = {};



  @Mutation
  public set(series: S) {
    Vue.set(this.items, series.id, series);
    Vue.set(this.malMap, series.myAnimeListId, series.id);
  }



  @Action
  public async load(id: number) {

    if (this.items[id]) {
      return this.items[id];
    }


    const fields: Fields[] = [
      'numberOfEpisodes',
      'posterUrl',
      'posterUrlSmall',
      'titles',
      'url',
      'type',
      'myAnimeListId',
    ];

    const s = await anime365Client.getSeriesSingle(id, {
      fields,
    });

    if (s) {
      this.set(s);
    }


    return this.items[id];
  }



  @Action
  public async search(params: Partial<Record<keyof Series, any>>) {
    const copyParams: Partial<Record<keyof Series, any>> = JSON.parse(JSON.stringify(params));
    if (
      copyParams.id
      && !Array.isArray(copyParams.id)
      && this.items[copyParams.id]
    ) {
      return;
    }

    if (
      copyParams.id
      && Array.isArray(copyParams.id)
    ) {
      copyParams.id = copyParams.id.filter((id: number) => !this.items[id]);

      if (!copyParams.id.length) {
        return;
      }
    }

    if (
      copyParams.myAnimeListId
      && !Array.isArray(copyParams.myAnimeListId)
      && this.malMap[copyParams.myAnimeListId]
    ) {
      return;
    }

    if (
      copyParams.myAnimeListId
      && Array.isArray(copyParams.myAnimeListId)
    ) {
      copyParams.myAnimeListId
        = copyParams.myAnimeListId
        .filter((myAnimeListId: number) => !this.malMap[myAnimeListId]);

      if (!copyParams.myAnimeListId.length) {
        return;
      }
    }

    if (copyParams.isActive === undefined) {
      copyParams.isActive = 1;
    }

    const fields: Fields[] = [
      'numberOfEpisodes',
      'posterUrl',
      'posterUrlSmall',
      'titles',
      'url',
      'type',
      'myAnimeListId',
      'isActive',
    ];

    const series = await anime365Client.getSeriesCollection(copyParams, fields);

    series.forEach((s) => this.set(s));

    return series;
  }

}



export const seriesStore = getModule(SeriesStore);


// TODO: DELETE AFTER DEBUG
if (process.env.NODE_ENV !== 'production') {
// @ts-ignore
  window.seriesStore = seriesStore;
}
