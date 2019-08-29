<template>
    <main>
        <v-progress-linear :indeterminate="true" class="ma-0" v-if="loading"></v-progress-linear>

        <div class="d-grid" v-if="history.length">
            <div :key="anime.id" class="grid-item" v-for="anime of history">
                <v-card :to="'/player/anime/' + anime.id + '/' + (anime.episodes + 1)" hover>
                    <v-img
                        :aspect-ratio="225/314"
                        :src="'https://shikimori.one' + anime.image"
                        gradient="to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 68%,rgba(0,0,0,0.8) 100%"
                    >
                        <v-container class="fill-height" fill-height fluid>
                            <v-layout fill-height>
                                <v-flex align-end d-flex xs12>
                                    <span class="white--text body-1">{{anime.name}}</span>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-img>
                </v-card>
            </div>
        </div>

        <div class="text-center py-12" v-else>
            <p class="headline">Здесь будет отображаться ваша история просмотров</p>
            <p class="body-2">
                Откройте любое аниме на
                <a href="https://shikimori.one/animes" target="_self">Шикимори</a>
                или
                <a href="https://myanimelist.net/anime/season" target="_self">MyAnimeList</a>
                и нажмите «Начать просмотр»
            </p>
        </div>
    </main>
</template>

<script lang="ts">
    import {sync} from '@/helpers/chrome-storage';
    import playerStore from '@/UI/store/player';
    import {Component, Vue} from 'vue-property-decorator';
    import {WatchingHistoryItem} from '../../../types/UI';

    const iconLink: HTMLLinkElement | null = document.head.querySelector('link[rel="icon"]');

    @Component
    export default class History extends Vue {
        public history: WatchingHistoryItem[] = [];
        public loading: boolean = true;


        public created() {
            document.title = 'История просмотров';
            if (iconLink) {
                iconLink.href = `/play.png`;
            }
        }

        public async mounted() {
            const {watching_history} = await sync.get<{ watching_history: WatchingHistoryItem[] }>({watching_history: []});
            this.history = watching_history;
            this.loading = false;

            chrome.storage.onChanged.addListener((changes) => {
                if (!changes.watching_history) {
                    return;
                }

                this.history = changes.watching_history.newValue || [];
            });

            if (this.history && this.history[0] && this.history[0]) {
                await playerStore.loadEpisodes({
                    anime: this.history[0].id,
                    episode: this.history[0].episodes || 0,
                });
            }
        }
    }
</script>


<style scoped>

    .v-card--hover:focus {
        -webkit-box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    }


    .d-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 20px;
    }


    @media (min-width: 428px) {
        .d-grid {
            grid-template-columns: 1fr 1fr;
        }
    }


    @media (min-width: 663px) {
        .d-grid {
            grid-template-columns: 1fr 1fr 1fr;
        }
    }


    @media (min-width: 1264px) {
        .d-grid {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    }


    @media (min-width: 1904px) {
        .d-grid {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }
</style>
