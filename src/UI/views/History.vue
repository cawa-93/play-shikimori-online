<template>
    <main>
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
    let chromeOnChangeListener: ((changes: { [key: string]: chrome.storage.StorageChange }) => void) | null = null;
    const historyLoadPromise = sync.get<{ watching_history: WatchingHistoryItem[] }>({watching_history: []});

    @Component
    export default class History extends Vue {
        public history: WatchingHistoryItem[] = [];

        public beforeCreate() {
            document.title = 'История просмотров';
            if (iconLink) {
                iconLink.href = `/play.png`;
            }
        }

        public async created() {
            const {watching_history} = await historyLoadPromise;
            this.history = watching_history;

            if (this.history && this.history[0] && this.history[0]) {
                await playerStore.loadEpisodes({
                    anime: this.history[0].id,
                    episode: this.history[0].episodes || 0,
                });
            }

            chromeOnChangeListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
                if (!changes.watching_history) {
                    return;
                }

                this.history = changes.watching_history.newValue || [];
            };


            chrome.storage.onChanged.addListener(chromeOnChangeListener);
        }

        public destroyed() {
            if (chromeOnChangeListener) {
                chrome.storage.onChanged.removeListener(chromeOnChangeListener);
                chromeOnChangeListener = null;
            }
        }
    }
</script>


<style scoped>

    .v-card--hover:focus {
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    }


    .d-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        grid-gap: 20px;
    }

    .grid-item {
        max-width: 360px;
    }
</style>
