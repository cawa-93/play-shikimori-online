<template>
    <v-btn
        @click.prevent="selectPreviousEpisode"
        aria-label="Предыдущая серия"
        class="flex-parent previous-episode"
        icon
        target="_self"
        v-if="previous"
    >
        <v-icon>mdi-skip-previous</v-icon>
    </v-btn>
</template>

<script lang="ts">
    import playerStore from '@/UI/store/player';
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Previous extends Vue {
        get previous() {
            return playerStore.currentEpisode ? playerStore.currentEpisode.previous : null;
        }

        public selectPreviousEpisode() {
            return playerStore.selectPreviousEpisode();
        }
    }
</script>

<style scoped>

</style>
