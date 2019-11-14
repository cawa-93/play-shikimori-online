import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Vue from 'vue';
import {anime365} from '@/plugins/anime365';

export interface Series {
    id: number;
    myAnimeListId: number;
    numberOfEpisodes: number;
    posterUrl: string;
    posterUrlSmall: string;
    url: string;
    type: string;
    titles: {
        ru?: string;
        en?: string;
        romaji?: string;
        ja?: string;
    };
}

@Module({
    dynamic: true,
    namespaced: true,
    name: 'series',
    store,
})

export class SeriesStore extends VuexModule {
    public items: {
        [key: number]: Series,
    } = {};

    @Mutation
    public set(series: Series) {
        return Vue.set(this.items, series.myAnimeListId, series);
    }

    @Action
    public async load(myAnimeListIds: number | number[], force = false) {
        if (!Array.isArray(myAnimeListIds)) {
            myAnimeListIds = [myAnimeListIds];
        }

        if (!force) {
            myAnimeListIds = myAnimeListIds.filter(id => !this.items[id]);
        }


        const fields: (keyof Series)[] = [
            'id',
            'myAnimeListId',
            'numberOfEpisodes',
            'posterUrl',
            'posterUrlSmall',
            'titles',
            'url',
            'type',
        ];

        const {data: {data: series}} = await anime365.get<{ data: Series[] }>('/series', {
            params: {
                fields: fields.join(','),
                myAnimeListId: myAnimeListIds,
            },
        });

        series.forEach((s) => this.set(s));
    }

}

export const seriesStore = getModule(SeriesStore);
