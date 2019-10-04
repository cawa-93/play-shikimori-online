<template>
    <div>
        <v-btn
            :aria-label="label"
            :disabled="!label"
            @click.prevent="gotoNext"
            class="next-episode"
            target="_self"
            text
            v-if="readyToShow"
        >
            <span class="long-and-truncated mr-2" v-if="!compact">{{label}}</span>
            <v-icon>mdi-skip-next</v-icon>
        </v-btn>
        <v-skeleton-loader type="button" v-else></v-skeleton-loader>
    </div>
</template>

<script lang="ts">
    import Boilerplate from '@/UI/mixins/boilerplate';
    import playerStore from '@/UI/store/player';
    import shikimoriStore from '@/UI/store/shikimori';
    import {mixins} from 'vue-class-component';
    import {Component, Prop} from 'vue-property-decorator';

    @Component
    export default class Next extends mixins(Boilerplate) {
        @Prop() public readonly compact!: boolean;


        get nextEpisode() {
            return playerStore.currentEpisode ? playerStore.currentEpisode.next : null;
        }

        get nextSeason() {
            return shikimoriStore.nextSeason;
        }


        get label() {
            if (this.nextEpisode) {
                return 'Следующая серия';
            }

            if (this.nextSeason) {
                return 'Следующий сезон';
            }

            return null;
        }

        public gotoNext() {
            shikimoriStore.markAsWatched();

            if (this.nextEpisode) {
                return playerStore.selectNextEpisode();
            }

            if (this.nextSeason) {
                playerStore.clear();

                return Promise.all([
                    // Загрузка списка серий и запуск видео
                    playerStore.loadEpisodes({
                        anime: this.nextSeason.id,
                        episode: this.nextSeason.episodeInt || 0,
                    }),

                    // Загрузка информации про аниме и оценку от пользователя если тот авторизован
                    shikimoriStore.loadAnime(this.nextSeason.id),
                ]);


            }


        }
    }
</script>

<style scoped>

</style>
