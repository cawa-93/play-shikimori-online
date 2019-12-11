import Vue from 'vue';
import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {Episode} from '@/types/anime365';
import {anime365Client} from '@/ApiClasses/Anime365Client';
import {seriesStore} from '@/store/modules/series';


type Fields = 'id' | 'episodeInt' | 'episodeType' | 'seriesId';
type E = Pick<Episode, Fields>;



@Module({
  dynamic: true,
  namespaced: true,
  name: 'episodes',
  store,
})

export class EpisodesStore extends VuexModule {
  public items: {
    [key: number]: E,
  } = {};



  get getForSeries() {
    const map = new Map();
    this.items; // Необходимо чтобы геттер пересчитывался при изменении this.items

    return (seriesId: number) => {
      if (map.has(seriesId)) {
        return map.get(seriesId);
      }

      let episodes = [];

      for (const episodeId in this.items) {
        if (this.items[episodeId].seriesId === seriesId) {
          episodes.push(this.items[episodeId]);
        }
      }

      if (episodes.length) {
        episodes = episodes.sort((episode1, episode2) => {
          return Number.parseFloat(episode1.episodeInt) - Number.parseFloat(episode2.episodeInt);
        });
        map.set(seriesId, episodes);
      }

      return episodes;
    };
  }



  @Mutation
  public set(episode: E) {
    Vue.set(this.items, episode.id, episode);
  }



  @Mutation
  public remove(ids: number | number[]) {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    ids.forEach((id) => Vue.delete(this.items, id));
  }



  @Mutation
  public removeAllForSeries(seriesId: number | number[]) {
    if (!Array.isArray(seriesId)) {
      seriesId = [seriesId];
    }

    for (const episodeId in this.items) {
      if (seriesId.includes(this.items[episodeId].seriesId)) {
        Vue.delete(this.items, Number.parseInt(episodeId, 10));
      }
    }
  }



  @Action
  public async loadEpisodesForSeries(seriesId: number) {

    if (this.getForSeries(seriesId).length) {
      return;
    }

    await seriesStore.load(seriesId);

    if (!seriesStore.items[seriesId]) {
      return;
    }


    const promise = anime365Client.getEpisodesCollection({seriesId, episodeType: seriesStore.items[seriesId].type}, [
      'episodeInt',
      'episodeType',
      'seriesId',
    ]);

    const episodes = await promise;

    if (episodes.length) {
      episodes.forEach((episode) => this.set(episode));
    }
  }

}



export const episodesStore = getModule(EpisodesStore);


// TODO: DELETE AFTER DEBUG
if (process.env.NODE_ENV !== 'production') {
// @ts-ignore
  window.episodesStore = episodesStore;
}
