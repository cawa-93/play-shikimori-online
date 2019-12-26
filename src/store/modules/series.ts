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
  public async search(params: any = {}): Promise<number[]> {
    const copyParams: typeof params = JSON.parse(JSON.stringify(params));
    if (
      copyParams.id
      && !Array.isArray(copyParams.id)
      && this.items[copyParams.id]
    ) {
      return [params.id];
    }

    if (
      copyParams.id
      && Array.isArray(copyParams.id)
    ) {
      copyParams.id = copyParams.id.filter((id: number) => !this.items[id]);

      if (!copyParams.id.length) {
        return params.id;
      }
    }

    if (
      copyParams.myAnimeListId
      && !Array.isArray(copyParams.myAnimeListId)
      && this.malMap[copyParams.myAnimeListId]
    ) {
      return [this.malMap[params.myAnimeListId]];
    }

    if (
      copyParams.myAnimeListId
      && Array.isArray(copyParams.myAnimeListId)
    ) {
      copyParams.myAnimeListId
        = copyParams.myAnimeListId
        .filter((myAnimeListId: number) => !this.malMap[myAnimeListId]);

      if (!copyParams.myAnimeListId.length) {
        return params.myAnimeListId.map((malId: number) => this.malMap[malId]);
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
    const idsToReturn: number[] = [];
    series.forEach((s) => {
      this.set(s);
      idsToReturn.push(s.id);
    });

    return idsToReturn;
  }

}



export const seriesStore = getModule(SeriesStore);


// TODO: DELETE AFTER DEBUG
if (process.env.NODE_ENV !== 'production') {
// @ts-ignore
  window.seriesStore = seriesStore;
}
