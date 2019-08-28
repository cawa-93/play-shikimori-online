<template>
    <main>
        <v-layout column style="height: calc(100vh - 110px);min-height: 378px;" tag="article">
            <v-flex class="flex-grow-unset mb-4">
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

            <v-flex class="flex-grow-unset mt-4">
                <video-controls>
                    <main-menu></main-menu>
                </video-controls>
            </v-flex>
        </v-layout>

        <comments v-if="anime && currentEpisode"></comments>
    </main>
</template>


<script lang="ts">

    import {getReviewUrl, push as message, sync} from '@/helpers';
    import Comments from '@/UI/components/comments.vue';
    import EpisodeList from '@/UI/components/episode-list.vue';
    import MainMenu from '@/UI/components/main-menu.vue';
    import Player from '@/UI/components/player.vue';
    import TranslationList from '@/UI/components/translation-list.vue';
    import VideoControls from '@/UI/components/video-controls.vue';
    import {playerStore, profileStore, shikimoriStore} from '@/UI/store';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        name: 'PlayerView',
        components: {
            EpisodeList,
            TranslationList,
            Player,
            VideoControls,
            MainMenu,
            Comments,
        },
    })
    export default class PlayerView extends Vue {

        get anime() {
            return shikimoriStore.anime;
        }

        get currentEpisode() {
            return playerStore.currentEpisode;
        }


        public async mounted() {
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

            const {installAt, leaveReview, userAuth, isAlreadyShare} = await sync.get<{
                installAt?: number,
                leaveReview?: 1 | 0,
                userAuth?: shikimori.Oauth,
                isAlreadyShare?: 1 | 0,
            }>(
                [
                    'installAt',      // Timestamp когда пользоватеь установил расширение
                    'leaveReview',    // Оставлял ли пользователь отзыв
                    'userAuth',       // Данные для авторизации пользователя
                    'isAlreadyShare', // Получал ли пользователь предложение поделиться в ВК
                ],
            );

            if (userAuth) {
                profileStore.loadCredentialsFromServer(userAuth);
            }

            // Очередь асинхронных операций
            const promises = [];

            if (needReloadEpisodes) {
                promises.push(playerStore.loadEpisodes({anime, episode})); // Загрузка списка серий и запуск видео
            }

            if (userAuth && !profileStore.user) {
                promises.push(profileStore.loadUser()); // Загрузка информации про пользователя если тот авторизован
            }

            if (!shikimoriStore.anime || shikimoriStore.anime.id !== anime) {
                // Загрузка информации про аниме и оценку от пользователя если тот авторизован
                promises.push(shikimoriStore.loadAnime(anime));
            }

            // Дожидаемся выполнения всех операций в очереди
            // @ts-ignore
            await Promise.all(promises);

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
