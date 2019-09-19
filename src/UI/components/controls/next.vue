<template>
    <v-btn
        :aria-label="label"
        @click.prevent="gotoNext"
        class="next-episode"
        target="_self"
        text
        v-if="label"
    >
        <span class="long-and-truncated mr-2" v-if="!compact">{{label}}</span>
        <v-icon>mdi-skip-next</v-icon>
    </v-btn>
</template>

<script lang="ts">
    import playerStore from '@/UI/store/player';
    import shikimoriStore from '@/UI/store/shikimori';
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Next extends Vue {
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
