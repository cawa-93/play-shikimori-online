import Vue from 'vue';
import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {anime365} from '@/plugins/anime365';

export interface Episode {
    id: number;
    episodeFull: string;
    episodeInt: number;
    episodeTitle: string;
    episodeType: string;
    seriesId: number;
    myAnimeListId: number;
}

export interface SeriesWithEpisodes {
    data: Array<{
        id: number;
        myAnimeListId: number;
        episodes: Episode[];
    }>;
}

@Module({
    dynamic: true,
    namespaced: true,
    name: 'episodes',
    store,
})

export class EpisodesStore extends VuexModule {
    public items: Episode[] = [];


    @Mutation
    public set(episodes: Episode[]) {
        Vue.set(this, 'items', episodes);
    }

    @Mutation
    public push(episode: Episode) {
        this.items.push(episode);
    }

    @Action
    public async loadEpisodesForSeries(myAnimeListIds: number | number[], force = false) {
        if (!Array.isArray(myAnimeListIds)) {
            myAnimeListIds = [myAnimeListIds];
        }

        // const seriesIds = myAnimeListIds.map(malId =>)

        if (!force) {
            myAnimeListIds = myAnimeListIds.filter((id) => !this.items.some((e) => e.myAnimeListId === id));
        }


        const fields = [
            'id',
            'myAnimeListId',
            'episodes',
        ];

        const {data: {data: series}} = await anime365.get<SeriesWithEpisodes>('/series', {
            params: {
                fields: fields.join(','),
                myAnimeListId: myAnimeListIds,
            },
        });

        const newEpisodes: Episode[] = [];

        if (!force) {
            newEpisodes.push(...this.items);
        }

        series.forEach(({myAnimeListId, episodes}) => {
            episodes.forEach((e) => {
                newEpisodes.push({
                    id: e.id,
                    myAnimeListId,
                    episodeFull: e.episodeFull,
                    episodeInt: parseInt(`${e.episodeInt}`, 10),
                    episodeTitle: e.episodeTitle,
                    episodeType: e.episodeType,
                    seriesId: e.seriesId,
                });
            });
        });

        this.set(newEpisodes);
    }

}

export const episodesStore = getModule(EpisodesStore);
