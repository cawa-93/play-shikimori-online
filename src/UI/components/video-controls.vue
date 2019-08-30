<template>
    <v-layout>
        <v-flex class="trunc">
            <v-btn
                :disabled="!previous"
                :href="urls.previous"
                @click.prevent="selectPreviousEpisode"
                class="flex-parent"
                target="_self"
                text
            >
                <v-icon left>mdi-skip-previous</v-icon>
                <span class="long-and-truncated">Предыдущая {{ $vuetify.breakpoint.xsOnly ? '' : 'серия'}}</span>
            </v-btn>
        </v-flex>

        <v-flex class="text-center main-menu trunc">
            <slot></slot>
        </v-flex>

        <v-flex class="text-right trunc">
            <v-btn
                :disabled="!next"
                :href="urls.next"
                @click.prevent="nextEpisode"
                class="flex-parent"
                target="_self"
                text
                v-if="next || !nextSeason"
            >
                <span class="long-and-truncated">Следующая {{ $vuetify.breakpoint.xsOnly ? '' : 'серия'}}</span>
                <v-icon right>mdi-skip-next</v-icon>
            </v-btn>

            <v-btn
                @click.prevent="selectNextSeason"
                text
                v-else-if="nextSeason"
            >
                {{nextSeason.name}}
                <v-icon right>mdi-skip-next</v-icon>
            </v-btn>
        </v-flex>
    </v-layout>
</template>


<script lang="ts">
    import playerStore from '@/UI/store/player';
    import shikimoriStore from '@/UI/store/shikimori';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        name: 'video-controls',
    })
    export default class VideoControls extends Vue {
        get previous() {
            return playerStore.currentEpisode ? playerStore.currentEpisode.previous : null;
        }


        get next() {
            return playerStore.currentEpisode ? playerStore.currentEpisode.next : null;
        }


        get urls() {
            let next;
            let previous;

            if (this.previous) {
                previous = new URL(chrome.runtime.getURL(`UI/index.html`));
                previous.hash = `/player/anime/${this.previous.myAnimelist}/${this.previous.episodeInt}`;

                previous = previous.toString();
            }

            if (this.next) {
                next = new URL(chrome.runtime.getURL(`UI/index.html`));
                next.hash = `/player/anime/${this.next.myAnimelist}/${this.next.episodeInt}`;

                next = next.toString();
            }

            return {next, previous};
        }


        get nextSeason() {
            return shikimoriStore.nextSeason;
        }

        public nextEpisode() {
            shikimoriStore.markAsWatched();
            return playerStore.selectNextEpisode();
        }

        public selectPreviousEpisode() {
            return playerStore.selectPreviousEpisode();
        }


        public async selectNextSeason() {
            shikimoriStore.markAsWatched();
            if (!shikimoriStore.nextSeason) {
                return;
            }

            playerStore.clear();

            // Загрузка списка серий и запуск видео
            await playerStore.loadEpisodes({
                anime: shikimoriStore.nextSeason.id,
                episode: shikimoriStore.nextSeason.episodeInt || 0,
            });

            // Загрузка информации про аниме и оценку от пользователя если тот авторизован
            await shikimoriStore.loadAnime(shikimoriStore.nextSeason.id);
        }
    }
</script>

<style>
    .flex.trunc,
    .flex.trunc .v-btn__content {
        min-width: 0 !important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .long-and-truncated {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
