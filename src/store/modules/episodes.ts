import Vue from 'vue';
import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {Episode} from '@/types/anime365';
import {anime365Client} from '@/ApiClasses/Anime365Client';
import {seriesStore} from '@/store/modules/series';
import router from '@/router';


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



  get episodeMap() {
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

    if (router.currentRoute.params && router.currentRoute.params.seriesId) {

      const episodes = this.getForSeries(Number.parseInt(router.currentRoute.params.seriesId, 10));

      if (!episodes.length) {
        return map;
      }

      let minimalEpisodeInt = Number.parseFloat(episodes[0].episodeInt);
      episodes.forEach((episode) => {
        const episodeInt = Number.parseFloat(episode.episodeInt);


        // Стартовая серия
        if (episodeInt <= minimalEpisodeInt) {
          minimalEpisodeInt = episodeInt;
          map.startEpisode = episode.id;
        }

        // Текущая серия
        if (router.currentRoute.params && router.currentRoute.params.episodeId) {
          const episodeId = Number.parseInt(router.currentRoute.params.episodeId, 10);
          if (episodeId === episode.id) {
            map.selectedEpisode = episode.id;
          }
        }
      });


      if (map.selectedEpisode) {
        // const selectedEpisodeInt = Number.parseFloat(this.items[map.selectedEpisode].episodeInt)
        const selectedEpisode = this.items[map.selectedEpisode];
        let previousEpisode: E | undefined;
        let nextEpisode: E | undefined;

        episodes.forEach((episode) => {

          // Следующая серия
          if (
            Number.parseFloat(episode.episodeInt) > Number.parseFloat(selectedEpisode.episodeInt)
            && (
              !nextEpisode
              || Number.parseFloat(episode.episodeInt) < Number.parseFloat(nextEpisode.episodeInt)
            )
          ) {
            nextEpisode = episode;
          }

          // Предыдущая серия
          if (
            Number.parseFloat(episode.episodeInt) < Number.parseFloat(selectedEpisode.episodeInt)
            && (
              !previousEpisode
              || Number.parseFloat(episode.episodeInt) > Number.parseFloat(previousEpisode.episodeInt)
            )
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
      }
    }

    return map;

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
