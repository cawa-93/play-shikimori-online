import Vue from 'vue';
import store from '@/store';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {anime365} from '@/plugins/anime365';
import {Anime365Response, Translation} from '@/types/anime365';


const fields = [
    'id',
    'isActive',
    'priority',
    'qualityType',
    'type',
    'seriesId',
    'episodeId',
    'embedUrl',
    'authorsSummary',
    'height',
] as const;

type T = Pick<Translation, typeof fields[number]>;


@Module({
    dynamic: true,
    namespaced: true,
    name: 'translations',
    store,
})

export class TranslationsStore extends VuexModule {
    public items: T[] = [];


    @Mutation
    public set(translations: T[]) {
        Vue.set(this, 'items', translations);
    }

    @Mutation
    public push(translation: T | T[]) {
        if (Array.isArray(translation)) {
            this.items.push(...translation);
        } else {
            this.items.push(translation);
        }
    }

    @Mutation
    public remove(seriesOrEpisodeIds: number | number[]) {
        const ids = Array.isArray(seriesOrEpisodeIds) ? seriesOrEpisodeIds : [seriesOrEpisodeIds];

        Vue.set(this, 'items', this.items.filter(
            (e) => !ids.includes(e.seriesId) && !ids.includes(e.episodeId),
        ));
    }

    @Action
    public async loadTranslationsForEpisodes(episodeIds: number | number[], force = false) {
        if (!Array.isArray(episodeIds)) {
            episodeIds = [episodeIds];
        }

        if (!force) {
            episodeIds = episodeIds.filter((id) => !this.items.some((e) => e.episodeId === id));
        }

        if (!episodeIds.length) {
            return;
        }


        const promise = anime365.get<Anime365Response<T[]>>('/translations', {
            params: {
                limit: 0,
                feed: 'all',
                fields: fields.join(','),
                episodeId: episodeIds,
            },
        });

        if (force) {
            this.remove(episodeIds);
        }

        const {data: {data: translations}} = await promise;

        if (translations.length) {
            this.push(translations);
        }
    }

}

export const translationsStore = getModule(TranslationsStore);
