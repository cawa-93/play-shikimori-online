import Vue from 'vue';
import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {anime365} from '@/plugins/anime365';
import {Anime365Response, Episode} from '@/types/anime365';

const fields = [
    'id',
    'episodeInt',
    'episodeInt',
    'episodeType',
    'seriesId',
] as const;

type E = Pick<Episode, typeof fields[number]>;

@Module({
    dynamic: true,
    namespaced: true,
    name: 'episodes',
    store,
})

export class EpisodesStore extends VuexModule {
    public items: E[] = [];


    @Mutation
    public set(episodes: E[]) {
        Vue.set(this, 'items', episodes);
    }

    @Mutation
    public push(episode: E | E[]) {
        if (Array.isArray(episode)) {
            this.items.push(...episode);
        } else {
            this.items.push(episode);
        }
    }

    @Mutation
    public remove(seriesIds: number | number[]) {
        const ids = Array.isArray(seriesIds) ? seriesIds : [seriesIds];

        Vue.set(this, 'items', this.items.filter((e) => !ids.includes(e.seriesId)));
    }

    @Action
    public async loadEpisodesForSeries(seriesIds: number | number[], force = false) {
        if (!Array.isArray(seriesIds)) {
            seriesIds = [seriesIds];
        }

        if (!force) {
            seriesIds = seriesIds.filter((id) => !this.items.some((e) => e.seriesId === id));
        }

        if (!seriesIds.length) {
            return;
        }


        const promise = anime365.get<Anime365Response<E[]>>('/episodes', {
            params: {
                fields: fields.join(','),
                seriesId: seriesIds,
            },
        });

        if (force) {
            this.remove(seriesIds);
        }

        const {data: {data: episodes}} = await promise;

        if (episodes.length) {
            this.push(episodes);
        }
    }

}

export const episodesStore = getModule(EpisodesStore);
