<template>
    <v-card class="player-container d-flex flex-column w-100 h-100" v-if="translation">
        <iframe
            :src="src"
            allowfullscreen
            height="100%"
            id="player"
            loading="eager"
            ref="player"
            width="100%"
        ></iframe>
    </v-card>
</template>


<script lang="ts">
    import playerStore from '@/UI/store/player';
    import shikimoriStore from '@/UI/store/shikimori';
    import {Component, Vue, Watch} from 'vue-property-decorator';

    let listener: ((this: Window, ev: WindowEventMap['message']) => any) | null = null;
    const iconLink: HTMLLinkElement | null = document.head.querySelector('link[rel="icon"]');
    @Component({
        name: 'player',
    })
    export default class Player extends Vue {
        get translation() {
            return playerStore.currentTranslation;
        }

        get src() {
            if (!this.translation) {
                return null;
            }

            const src = new URL(this.translation.embedUrl);
            const config = new URLSearchParams();

            config.append('extension-id', chrome.runtime.id);
            config.append('play-shikimori[seriesId]', `${this.translation.seriesId}`);
            config.append('play-shikimori[episodeId]', `${this.translation.episodeId}`);
            config.append('play-shikimori[id]', `${this.translation.id}`);
            config.append('play-shikimori[isAutoPlay]', process.env.NODE_ENV === 'production' ? '1' : '1');
            config.append('play-shikimori[fullScreen]', document.fullscreenElement ? '1' : '0');

            if (playerStore.currentEpisode) {
                config.set(
                    'play-shikimori[nextEpisode]',
                    playerStore.currentEpisode.next ? '1' : '0',
                );
            }

            src.hash = config.toString();

            return src.toString();
        }


        public setTitle() {
            if (!this.translation) {
                document.title = `Загрузка ...`;
            } else {
                document.title = `${this.translation.title} — онлайн просмотр`;
            }
        }

        @Watch('translation')
        public onTranslationChange(newTranslation: anime365.Translation, oldTranslation: anime365.Translation) {
            const n = newTranslation || {};
            const o = oldTranslation || {};
            if ((n.title && n.title !== o.title) || !o.title) {
                this.setTitle();
            }
        }


        public created() {
            this.setTitle();

            listener = ({data: event}: { data: string }) => {
                // Просмотрена большая часть серии
                if (event === 'watched') {
                    shikimoriStore.markAsWatched();
                    playerStore.preloadNextEpisode();

                    // Серия закончилась или пользователь нажал кнопку "Слежующая серия
                } else if (event === 'public-ended' || event === 'mark-as-watched') {
                    shikimoriStore.markAsWatched();
                    playerStore.selectNextEpisode();

                    // Плей или пауза
                } else if (event === 'public-play' || event === 'public-pause') {
                    if (iconLink) {
                        iconLink.href = `/${event === 'public-play' ? 'play' : 'pause'}.png`;
                    }
                }
            };
            window.addEventListener('message', listener);
        }

        public destroyed() {
            if (listener) {
                window.removeEventListener('message', listener);
                listener = null;
            }
        }
    }
</script>

<style scoped>
    #player {
        border: none;
        border-radius: 4px;
        width: 100%;
        height: 100%;
        position: absolute;
    }
</style>
