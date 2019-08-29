import {Anime365Provider} from '@/helpers/API/Anime365Provider';
import {MyAnimeListProvider} from '@/helpers/API/MyAnimeListProvider';
import {clearString} from '@/helpers/clear-string';
import {filterEpisodes} from '@/helpers/filter-episodes';
import {findEpisode} from '@/helpers/find-episode';
import router from '@/UI/router';
import store, {worker} from '@/UI/store';
import shikimoriStore from '@/UI/store/shikimori';
import Vue from 'vue';
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';


// tslint:disable-next-line:no-var-requires
// const worker = new Worker(require('@/UI/store/worker.ts'));

@Module({
    dynamic: true,
    namespaced: true,
    name: 'player',
    store,
})
export class Player extends VuexModule {
    public episodes: anime365.Episode[] = [];
    public currentEpisode: anime365.Episode | null = null;
    public currentTranslation: anime365.Translation | null = null;


    /**
     * Сохраняет данные аниме
     */
    @Mutation
    public clear() {
        this.episodes = [];
        this.currentEpisode = null;
        this.currentTranslation = null;
    }

    /**
     * Сохраняет серии аниме
     * @param {anime365.Episode[]} episodes
     */
    @Mutation
    public pushEpisodes(episodes: anime365.Episode[]) {
        this.episodes.push(...episodes);
    }

    /**
     * Изменяет текущую серию
     * @param {anime365.Episode} episode
     */
    @Mutation
    public setCurrentEpisode(episode: anime365.Episode) {
        this.currentEpisode = episode;
    }

    /**
     * Сохраняет отфильтрованный массив переводов для серии
     * @param {{episode: anime365.Episode, translations: anime365.Translation[]}} param1
     */
    @Mutation
    public setTranslations(
        {episode, translations}: { episode: anime365.Episode, translations: anime365.Translation[] },
    ) {
        if (!episode) {
            return;
        }

        /**
         * TODO: Фильтрация переводов, потенциально,  может занимать длительное время.
         *       Стоит вынести этот процесс в отдельный поток
         */
        Vue.set(episode, 'translations', translations.filter((translation) => {
            if (translation.isActive) {
                return true;
            }

            const currentAuthor = clearString(translation.authorsSummary);

            return currentAuthor && !(
                translations.find((t) => {
                    if (!t.isActive || translation.type !== t.type) {
                        return false;
                    }

                    const author = clearString(t.authorsSummary);

                    return author && author === currentAuthor;
                })
            );
        }));
    }

    /**
     * Изменяет текущий перевод
     * @param {anime365.Translation} translation
     */
    @Mutation
    public setCurrentTranslation(translation: anime365.Translation) {
        this.currentTranslation = translation;
    }


    /**
     * Обновляет заголовки для серий
     * @param {myanimelist.Episode[]} episodes
     */
    @Mutation
    public setEpisodesTitle(episodes: myanimelist.Episode[]) {
        if (!this.episodes || !this.episodes.length || !episodes || !episodes.length) {
            return;
        }

        for (const {title, episode_id} of episodes) {
            if (!title) {
                continue;
            }

            const episode = this.episodes.find((e) => e.episodeInt === episode_id);

            if (!episode || episode.episodeTitle) {
                continue;
            }

            episode.episodeTitle = title;
            episode.episodeFull = `${episode.episodeInt}. ${episode.episodeTitle}`;
        }

    }


    /**
     * Загружает данные по аниме
     * @param {{anime: number, episode: number}} payload
     */
    @Action
    public async loadEpisodes({anime, episode: startEpisodeInt = 0}: { anime: number, episode: number }) {
        try {
            const {data} =
                await Anime365Provider.fetch<anime365.api.SeriesCollection>(`/series/?myAnimeListId=${anime}`, {
                    errorMessage: 'Невозможно загрузить список серий',
                });

            if (!data || !data[0] || !data[0].episodes || !data[0].episodes.length) {
                return;
            }


            let episodes = filterEpisodes(data[0]);

            episodes = episodes.map((episode, index) => {
                episode.myAnimelist = anime;
                episode.next = episodes[index + 1];
                episode.previous = episodes[index - 1];
                // @ts-ignore
                // episode.episodeInt приходит в виде строки!
                // Но для дальнейшего использования значение приводится к числу
                episode.episodeInt = parseFloat(episode.episodeInt);
                return episode;
            });

            this.pushEpisodes(episodes);

            if (!startEpisodeInt) {
                startEpisodeInt = 0;
            }

            /**
             * startEpisodeInt — Номер серии которую необходимо запустить
             *
             * Поиск наиболее подходящей серии для запуска
             */
            let startEpisode = findEpisode(this.episodes, startEpisodeInt);

            // Если следующей серии не найдено — выполнить поиск предыдущей серии перебором
            if (!startEpisode) {
                startEpisode = findEpisode(this.episodes, startEpisodeInt - 1);
            }


            // Если предыдущая серия не найдена — выполнить поиск нулевой серии перебором
            if (!startEpisode && startEpisodeInt > 2) {
                startEpisode = findEpisode(this.episodes, 0);
            }

            // Если нулевая серия не найдена — выполнить поиск первой серии перебором
            if (!startEpisode && startEpisodeInt > 2) {
                startEpisode = findEpisode(this.episodes, 1);
            }

            // Если первая серия не найдена — использовать первый элемент из массива серий
            if (!startEpisode) {
                startEpisode = this.episodes[0];
            }

            if (startEpisode) {
                await this.selectEpisode(startEpisode);
            }

            await this.loadEpisodesTitle();
        } catch (e) {
            console.error(e);
            e.track();
        }
    }


    /**
     * Устанавливает текущую серию
     * Загружает переводы для текущейсерии
     * Предзагружает данные для следующей серии
     * @param {anime365.Episode} episode
     */
    @Action
    public async selectEpisode(episode: anime365.Episode) {
        this.setCurrentEpisode(episode);

        if (router.currentRoute.name === 'player'
            && this.currentEpisode
            && this.currentEpisode.myAnimelist
            && (
                router.currentRoute.params.anime !== `${this.currentEpisode.myAnimelist}`
                || router.currentRoute.params.episode !== `${this.currentEpisode.episodeInt}`
            )
        ) {
            router.replace({
                name: 'player', params: {
                    anime: `${this.currentEpisode.myAnimelist}`,
                    episode: `${this.currentEpisode.episodeInt}`,
                },
            });
        }

        await this.loadTranslations(episode);
        const translation = await this.getPriorityTranslation(episode);

        this.setCurrentTranslation(translation);

        Vue.nextTick(() => {
            if (this.currentEpisode && !this.currentEpisode.next) {
                shikimoriStore.loadNextSeason();
            }
        });

    }

    /**
     * Загружает доступные переводы для серии
     * Может вызываться неограниченное число раз.
     * Поэтому необходимо обязательно проверять наличие переводов, чтобы избежать повторной загрузки
     * @param {anime365.Episode} episode
     */
    @Action
    public async loadTranslations(episode: anime365.Episode) {
        try {
            if (!episode || (Array.isArray(episode.translations) && episode.translations.length > 0)) {
                return;
            }

            const {data: {translations}} =
                await Anime365Provider.fetch<anime365.api.EpisodeSelf>(`/episodes/${episode.id}`, {
                    errorMessage: 'Невозможно загрузить список переводов',
                });

            if (translations && translations.length) {
                this.setTranslations({episode, translations});
            }
            return translations;
        } catch (e) {
            console.error(e);
            e.alert().track();
        }
    }


    /**
     * Переключает на предыдущую серию
     */
    @Action
    public selectPreviousEpisode() {
        if (this.currentEpisode && this.currentEpisode.previous) {
            return this.selectEpisode(this.currentEpisode.previous);
        }
    }


    /**
     * Переключает на следующую серию
     */
    @Action
    public selectNextEpisode() {
        if (this.currentEpisode && this.currentEpisode.next) {
            return this.selectEpisode(this.currentEpisode.next);
        }
    }


    /**
     *  Загружает заголовки для серий
     */
    @Action
    public async loadEpisodesTitle() {
        if (!this.currentEpisode) {
            return;
        }
        const myAnimelist = this.currentEpisode.myAnimelist;
        let promise: Promise<myanimelist.api.EpisodeCollection>;
        let currentPage = 1;
        let episodesToCommit: myanimelist.Episode[] = [];


        try {
            while (true) {
                const path = `/anime/${myAnimelist}/episodes/${currentPage}`;
                promise = MyAnimeListProvider.fetch<myanimelist.api.EpisodeCollection>(path, {
                    errorMessage: 'Невозможно загрузить названия серий',
                });

                if (episodesToCommit.length) {
                    this.setEpisodesTitle(episodesToCommit);
                    episodesToCommit = [];
                }

                const resp = await promise;
                if (!resp.episodes || !resp.episodes.length) {
                    break;
                }

                episodesToCommit = resp.episodes;

                if (currentPage >= resp.episodes_last_page) {
                    break;
                }

                currentPage++;
            }
        } catch (e) {
            console.error(e);
            e.alert().track();
        }


        if (episodesToCommit.length) {
            this.setEpisodesTitle(episodesToCommit);
        }

    }


    /**
     *
     * @param {anime365.Episode} episode
     */
    @Action
    public getPriorityTranslation(episode: anime365.Episode): Promise<anime365.Translation> {
        return new Promise((resolve) => {

            worker.onmessage = ({data: {translation}}: { data: { translation: anime365.Translation } }) => {
                worker.onmessage = null;
                resolve(translation);
            };
            worker.postMessage({episode});
        });
    }


    /**
     * Загружает переводы для следующей серии
     */
    @Action
    public async preloadNextEpisode() {
        if (!this.currentEpisode || !this.currentEpisode.next) {
            return;
        }

        await this.loadTranslations(this.currentEpisode.next);

        const translation = await this.getPriorityTranslation(this.currentEpisode.next);
        if (translation) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = translation.embedUrl;
            link.as = 'document';
            document.head.appendChild(link);
        }

        return translation;
    }
}

export default getModule(Player);
