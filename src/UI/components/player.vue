<template>
    <v-card class="player-container d-flex w-100 h-100" v-if="translation">
        <iframe
            :src="src"
            allowfullscreen
            height="100%"
            id="player"
            loading="eager"
            ref="player"
            style="border: none;"
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
            config.append('play-shikimori[isAutoPlay]', '1');

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

            listener = ({data: event}) => {
                if (event === 'watched') {
                    shikimoriStore.markAsWatched();
                    playerStore.preloadNextEpisode();
                } else if (event.name === 'ended' || event.name === 'mark-as-watched') {

                    // FIXME: Логирование
                    if (event.name === 'mark-as-watched') {
                        // console.log({ event: event.name });
                        // this.$ga.event('player-controls', 'next-episode', 'in-frame');
                    }

                    shikimoriStore.markAsWatched();
                    playerStore.selectNextEpisode();
                } else if (event.name === 'play' || event.name === 'pause') {
                    if (iconLink) {
                        iconLink.href = `/${event.name}.png`;
                    }
                } else if (event.name === 'error') {
                    console.error(event.error);
                    // window.Sentry.captureException(event.error);
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
