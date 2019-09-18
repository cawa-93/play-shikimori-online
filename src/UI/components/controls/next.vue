<template>
    <v-btn
        :icon="compact"
        :text="!compact"
        @click.prevent="nextEpisode"
        aria-label="Следующая серия"
        class="next-episode"
        target="_self"
        v-if="next"
    >
        <span class="long-and-truncated mr-2" v-if="!compact">Следующая серия</span>
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

        get next() {
            return playerStore.currentEpisode ? playerStore.currentEpisode.next : null;
        }

        public nextEpisode() {
            shikimoriStore.markAsWatched();
            return playerStore.selectNextEpisode();
        }
    }
</script>

<style scoped>

</style>
