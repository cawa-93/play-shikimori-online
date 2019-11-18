import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Vue from 'vue';
import {anime365} from '@/plugins/anime365';
import {Anime365Response, Series} from '@/types/anime365';


const fields = [
    'id',
    'myAnimeListId',
    'numberOfEpisodes',
    'posterUrl',
    'posterUrlSmall',
    'titles',
    'url',
    'type',
] as const;

type S = Pick<Series, typeof fields[number]>;

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

    @Mutation
    public set(series: S) {
        return Vue.set(this.items, series.myAnimeListId, series);
    }

    @Action
    public async load(myAnimeListIds: number | number[], force = false) {
        if (!Array.isArray(myAnimeListIds)) {
            myAnimeListIds = [myAnimeListIds];
        }

        if (!force) {
            myAnimeListIds = myAnimeListIds.filter((id) => !this.items[id]);
        }

        if (!myAnimeListIds.length) {
            return;
        }


        const {data: {data: series}} = await anime365
            .get<Anime365Response<S[]>>(
                '/series',
                {
                    params: {
                        fields: fields.join(','),
                        myAnimeListId: myAnimeListIds,
                    },
                });

        series.forEach((s) => this.set(s));
    }

}

export const seriesStore = getModule(SeriesStore);
