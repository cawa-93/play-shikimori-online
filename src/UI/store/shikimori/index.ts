import {Anime365Provider} from '@/helpers/API/Anime365Provider';
import {ShikimoriProvider} from '@/helpers/API/ShikimoriProvider';
import {sync} from '@/helpers/chrome-storage';
import store from '@/UI/store';
import playerStore from '@/UI/store/player';
import profileStore from '@/UI/store/profile';
import Vue from 'vue';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';


@Module({
    dynamic: true,
    namespaced: true,
    name: 'shikimori',
    store,
})
export class Shikimori extends VuexModule {
    public anime: shikimori.Anime | null = null;
    public nextSeason: shikimori.FranchiseNode | null = null;

    @Mutation
    public setAnime(anime: shikimori.Anime) {
        this.anime = anime;
    }

    @Mutation
    public setUserRate(userRate: shikimori.UserRate) {
        if (!this.anime) {
            return;
        }

        Vue.set(this.anime, 'user_rate', userRate);
    }

    @Mutation
    public setNextSeason(nextSeason: shikimori.FranchiseNode) {
        this.nextSeason = nextSeason;
    }


    /**
     * Загружает данный об аниме
     * @param {number} animeId
     */
    @Action({commit: 'setAnime'})
    public async loadAnime(animeId: number) {
        if (!animeId) {
            throw new Error('Anime ID is required. Got ' + animeId);
        }
        const headers: Record<string, string> = {};

        const auth = await profileStore.getValidCredentials();
        if (auth) {
            headers.Authorization = `${auth.token_type} ${auth.access_token}`;
        }

        try {
            return await ShikimoriProvider.fetch<shikimori.Anime>(`/api/animes/${animeId}`, {
                headers,
                errorMessage: 'Невозможно информацию про аниме',
            });
        } catch (e) {
            console.error(e);
            e.alert().track();
        }
    }

    /**
     * Отправляет оценку пользователя на Шикимори
     * @param {shikimori.UserRate} UserRate
     */
    @Action
    public async saveUserRate(UserRate: shikimori.UserRate) {
        if (!this.anime) {
            return null;
        }

        if (this.anime.user_rate) {
            this.setUserRate(Object.assign({}, this.anime.user_rate, UserRate));
        }

        const auth = await profileStore.getValidCredentials();
        if (!auth || !profileStore.user || !profileStore.user.id) {
            return;
        }

        const userRateForSave = Object.assign(
            {},
            {
                target_type: 'Anime',
                target_id: this.anime.id,
                user_id: profileStore.user.id,
                status: this.anime.user_rate && (
                    this.anime.user_rate.status === 'completed' || this.anime.user_rate.status === 'rewatching'
                ) ? 'rewatching' : 'watching',
            },
            UserRate,
        );

        if (userRateForSave.status === 'watching'
            && userRateForSave.episodes
            && this.anime.episodes
            && userRateForSave.episodes >= this.anime.episodes
        ) {
            userRateForSave.status = 'completed';
        }


        try {
            /** @type {shikimori.UserRate} */
            const savedUserRate = await ShikimoriProvider.fetch<shikimori.UserRate>('/api/v2/user_rates', {
                method: 'POST',
                body: JSON.stringify({
                    user_rate: userRateForSave,
                }),
                headers: {
                    Authorization: `${auth.token_type} ${auth.access_token}`,
                },
                errorMessage: 'Невозможно синхронизироваться с вашим списком',
            });


            this.setUserRate(savedUserRate);


            sync.unshift('watching_history', {
                id: this.anime.id,
                name: this.anime.russian || this.anime.name,
                image: this.anime.image.original,
                episodes: savedUserRate.episodes,
            });

            return savedUserRate;
        } catch (e) {
            console.error(e);
            e.alert().track();
            return userRateForSave;
        }

    }


    /**
     * Сохраняет текущую серию как просмотренную
     */
    @Action
    public markAsWatched() {
        if (this.anime
            && this.anime.user_rate
            && playerStore.currentEpisode
            && this.anime.user_rate.episodes === playerStore.currentEpisode.episodeInt
        ) {
            return this.anime.user_rate;
        }

        if (playerStore.currentEpisode) {
            return this.saveUserRate({
                episodes: playerStore.currentEpisode.episodeInt,
            });
        }
    }


    /**
     * Загружает данные о следующем сезоне во франшизе
     */
    @Action
    public async loadNextSeason() {
        if (!this.anime) {
            return;
        }

        let franchise: shikimori.Franchise;
        try {
            franchise =
                await ShikimoriProvider.fetch<shikimori.Franchise>(`/api/animes/${this.anime.id}/franchise`, {
                    errorMessage: 'Невозможно выполнить поиск следующего сезона',
                });
        } catch (e) {
            console.error(e);
            e.track();
            return;
        }

        const sequelLink = franchise.links.find((link) => {
            return link.source_id === this.anime!.id && link.relation === 'sequel';
        });

        if (!sequelLink) {
            return;
        }

        const sequelNode = franchise.nodes.find((n) => n.id === sequelLink.target_id);

        if (!sequelNode) {
            return;
        }


        const [{data: [series]}, anime] = await Promise.all([
            await Anime365Provider.fetch<anime365.api.SeriesCollection>(`/series/?myAnimeListId=${sequelNode.id}`, {
                errorMessage: 'Невозможно загрузить следующий сезон',
            })
                .catch((e: Error) => {
                    console.error(e);
                    e.track();
                    return {data: []};
                }),

            (
                async () => {
                    const headers: Record<string, string> = {};

                    const auth = await profileStore.getValidCredentials();
                    if (!auth) {
                        return null; // Если пользователь не авторизован, нет смысла загружать его оценку
                    }

                    headers.Authorization = `${auth.token_type} ${auth.access_token}`;

                    return ShikimoriProvider.fetch<shikimori.Anime>(`/api/animes/${sequelNode.id}`, {
                        headers,
                        errorMessage: 'Невозможно загрузить ваш список',
                    })
                        .catch((e) => {
                            console.error(e);
                            e.track();
                            return null;
                        });
                }
            )(),
        ]);

        if (!series || !series.episodes || !series.episodes.length) {
            return;
        }

        const episodeType = series.episodes[0].episodeType;
        if (series.episodes.every((e) => e.episodeType === episodeType)) {
            series.type = episodeType;
        } else {
            series.episodes = series.episodes
                .filter((e) =>
                    e.isActive
                    // @ts-ignore
                    // episodeInt может быть строкой
                    && parseFloat(e.episodeInt) <= series.numberOfEpisodes
                    && e.episodeType === series.type,
                );
        }

        if (!series || !series.episodes || !series.episodes.length) {
            return;
        }

        sequelNode.series = series.id;

        if (anime && anime.user_rate && anime.user_rate.episodes) {
            sequelNode.episodeInt = anime.user_rate.episodes + 1;
        }

        this.setNextSeason(sequelNode);
    }

}

export default getModule(Shikimori);
