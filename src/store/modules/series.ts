import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Vue from 'vue';
import {Series} from '@/types/anime365';
import {anime365Client} from '@/ApiClasses/Anime365Client';


type Fields = 'id' | 'myAnimeListId' | 'numberOfEpisodes' | 'posterUrl' | 'posterUrlSmall' | 'titles' | 'url' | 'type';
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
    [key: number]: number,
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


    // @ts-ignore
    const s = await anime365Client.getSeriesSingle<Fields>(id, {
      fields: [
        'numberOfEpisodes',
        'posterUrl',
        'posterUrlSmall',
        'titles',
        'url',
        'type',
      ]
    });

    if (s) {
      this.set(s);
    }


    return this.items[id];
  }



  // @Action
  // public async requestSeries(myAnimeListIds: number[]) {
  //   const {data: {data: series}} = await anime365
  //     .get<Anime365Response<S[]>>(
  //       '/series',
  //       {
  //         params: {
  //           fields: fields.join(','),
  //           myAnimeListId: myAnimeListIds,
  //         },
  //       });
  //
  //   return series;
  // }

}



export const seriesStore = getModule(SeriesStore);
