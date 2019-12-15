import Vue from 'vue';
import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {Episode} from '@/types/anime365';
import {anime365Client} from '@/ApiClasses/Anime365Client';
import {seriesStore} from '@/store/modules/series';
import {Route} from 'vue-router';


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



  get getForSeries(): (seriesId: number) => E[] {
    const map = new Map<number, E[]>();

    // tslint:disable-next-line:no-unused-expression
    this.items; // Необходимо чтобы геттер пересчитывался при изменении this.items

    return (seriesId: number) => {
      if (map.has(seriesId)) {
        return map.get(seriesId)!;
      }

      let episodes: E[] = [];

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



  /**
   * Возвращает функциию, которая принимает роут и возвращает объект с ИД серий
   */
  get episodeMap(): (route: Route) => {

    startEpisode: E['id'],    // Начальная серия. Обычно это серия под номером 1 или 0
    selectedEpisode: E['id'], // Текущая выбранная серия
    previousEpisode: E['id'], // Предыдущая серия относительно выбранной
    nextEpisode: E['id'],     // Следующая  серия относительно выбранной
  } {

    const cache = new Map();

    return (route: Route) => {
      const key = route.params && route.params.episodeId ? route.params.episodeId : null;

      if (key && cache.has(key)) {
        return cache.get(key);
      }

      const selectedEpisode = this.items[Number.parseInt(route.params.episodeId, 10)];

      const map
        : {
        startEpisode: E['id'],
        selectedEpisode: E['id'],
        previousEpisode: E['id'],
        nextEpisode: E['id'],
      }
        = {
        startEpisode: 0,
        selectedEpisode: 0,
        previousEpisode: 0,
        nextEpisode: 0,
      };

      if (!selectedEpisode) {
        return map;
      }

      map.selectedEpisode = selectedEpisode.id;

      const episodes = this.getForSeries(selectedEpisode.seriesId);

      if (!episodes.length) {
        return map;
      }

      let minimalEpisodeInt = Number.parseFloat(episodes[0].episodeInt);
      let previousEpisode: E | undefined;
      let nextEpisode: E | undefined;


      episodes.forEach((episode) => {
        const episodeInt = Number.parseFloat(episode.episodeInt);


        // Стартовая серия
        if (episodeInt <= minimalEpisodeInt) {
          minimalEpisodeInt = episodeInt;
          map.startEpisode = episode.id;
        }

        // Следующая серия
        if (
          episodeInt > Number.parseFloat(selectedEpisode.episodeInt)
          && (!nextEpisode || episodeInt < Number.parseFloat(nextEpisode.episodeInt))
        ) {
          nextEpisode = episode;
        }

        // Предыдущая серия
        if (
          episodeInt < Number.parseFloat(selectedEpisode.episodeInt)
          && (!previousEpisode || episodeInt > Number.parseFloat(previousEpisode.episodeInt))
        ) {
          previousEpisode = episode;
        }
      });

      if (nextEpisode) {
        map.nextEpisode = nextEpisode.id;
      }

      if (previousEpisode) {
        map.previousEpisode = previousEpisode.id;
      }

      if (key) {
        cache.set(key, map);
      }


      return map;

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


    const promise = anime365Client.getEpisodesCollection({
      seriesId,
      episodeType: seriesStore.items[seriesId].type,
      isActive: 1,
    }, [
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
