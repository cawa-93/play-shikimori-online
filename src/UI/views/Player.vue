<template>
    <main>
        <v-layout column style="height: calc(100vh - 75px);min-height: 378px;" tag="article">
            <v-flex class="flex-grow-unset mb-2">
                <v-container fluid grid-list-md pa-0>
                    <v-layout wrap>
                        <v-flex sm6 xs12>
                            <episode-list></episode-list>
                        </v-flex>
                        <v-flex sm6 xs12>
                            <translation-list></translation-list>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <v-flex d-flex>
                <player></player>
            </v-flex>

            <controls class="mt-2"></controls>
        </v-layout>

        <comments-feed class="mt-2" v-if="anime && currentEpisode"></comments-feed>
    </main>
</template>


<script lang="ts">
    import {sync} from '@/helpers/chrome-storage';
    import {getReviewUrl} from '@/helpers/get-review-url';
    import {push as message} from '@/helpers/runtime-messages';
    import CommentsFeed from '@/UI/components/comments-feed/index.vue';
    import Controls from '@/UI/components/controls/index.vue';
    import EpisodeList from '@/UI/components/episode-list.vue';
    import Player from '@/UI/components/player.vue';
    import TranslationList from '@/UI/components/translation-list.vue';
    import playerStore from '@/UI/store/player';
    import shikimoriStore from '@/UI/store/shikimori';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        name: 'PlayerView',
        components: {
            EpisodeList,
            TranslationList,
            Player,
            CommentsFeed,
            Controls,
        },
    })
    export default class PlayerView extends Vue {

        get anime() {
            return shikimoriStore.anime;
        }

        get currentEpisode() {
            return playerStore.currentEpisode;
        }

        public initAnimePlayer() {

            const anime = parseInt(this.$route.params.anime, 10);
            const episode = parseFloat(this.$route.params.episode);

            // Нужно ли перезагружать серии
            // true — если открытое аниме не соответствует загруженному
            const needReloadEpisodes = !playerStore.episodes
                || !playerStore.episodes.length
                || playerStore.episodes[0].myAnimelist !== anime;

            // Удаляем все серии если открытое аниме не соответствует загруженному
            if (needReloadEpisodes) {
                playerStore.clear();
            }

            // Очередь асинхронных операций
            const promises: Array<Promise<any>> = [];

            if (needReloadEpisodes) {
                promises.push(playerStore.loadEpisodes({anime, episode})); // Загрузка списка серий и запуск видео
            }

            if (!shikimoriStore.anime || shikimoriStore.anime.id !== anime) {
                // Загрузка информации про аниме и оценку от пользователя если тот авторизован
                promises.push(shikimoriStore.loadAnime(anime));
            }

            // Дожидаемся выполнения всех операций в очереди
            return Promise.all(promises);
        }


        public async created() {

            await this.initAnimePlayer();

            const {installAt, leaveReview, isAlreadyShare} = await sync.get<{
                installAt?: number,
                leaveReview?: 1 | 0,
                isAlreadyShare?: 1 | 0,
            }>(
                [
                    'installAt',      // Timestamp когда пользоватеь установил расширение
                    'leaveReview',    // Оставлял ли пользователь отзыв
                    'isAlreadyShare', // Получал ли пользователь предложение поделиться в ВК
                ],
            );

            if (!installAt) {
                return;
            }

            const WEEK = 604800000;

            // Если пользователь установил расширение неделю назад
            // и ещё не получал предложения оставить отзыв — создать сообщение с предложением
            if (installAt + WEEK < Date.now() && !leaveReview) {
                const url = getReviewUrl();

                await message({
                    color: 'info',
                    html: `За каждый отзыв жена покупает мне вкусную печеньку.
                        <br>
                        <b><a href="${url}" class="white--text">Спасите, очень нужна печенька к чаю!</a></b>`,
                });

                await sync.set({leaveReview: 1});
            }

            // Если пользователь установил расширение 3 недели назад
            // и ещё не получал предложения поделиться в ВК — создать сообщение с предложением
            if (installAt + WEEK * 3 < Date.now() && !isAlreadyShare) {
                const url = new URL('https://vk.com/share.php');
                url.searchParams.append(
                    'url',
                    'https://github.com/cawa-93/play-shikimori-online/blob/master/README.md#%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0',
                );
                url.searchParams.append('title', 'Play Шикимори Online');
                url.searchParams.append(
                    'comment',
                    'Лучший способ смотреть аниме прямо на сайте shikimori.one',
                );

                await message({
                    color: 'info',
                    html: `Чем больше пользователей в расширении, тем чаще выходят обновления с приятными бонусами
                        <br>
                        <b>
                            <a href="${url.toString()}" class="white--text">
                                Расскажи о нас друзьям и жди новых возможностей в ближайшее время!
                            </a>
                            😎
                        </b>`,
                    mode: this.$vuetify.breakpoint.smAndDown ? 'vertical' : 'multi-line',
                });

                await sync.set({isAlreadyShare: 1});
            }
        }

        // @Watch('$route.params', {immediate: true})
        // onRouteChange(to: { anime?: string, episode?: string }, from: { anime?: string, episode?: string } = {}) {
        //     if (to.anime !== from.anime) {
        //         this.initAnimePlayer();
        //     } else if (to.episode && to.episode !== from.episode) {
        //         const targetEpisode = playerStore.episodes.find((e) => e.episodeInt === parseInt(to.episode!, 10));
        //
        //         if (targetEpisode) {
        //             playerStore.selectEpisode(targetEpisode);
        //         }
        //     }
        // }

    }
</script>

<style>
    .v-select__selections {
        overflow: hidden;
    }

    .v-select__selection.v-select__selection--comma {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: block;
    }

    .flex-grow-unset {
        flex-grow: unset;
    }

    .player-container {
        height: 100%;
    }
</style>
