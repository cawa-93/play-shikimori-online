<template>
    <v-btn
        @click.prevent="selectPreviousEpisode"
        aria-label="Предыдущая серия"
        class="flex-parent previous-episode"
        target="_self"
        text
        v-if="previous"
    >
        <v-icon>mdi-skip-previous</v-icon>
        <span class="long-and-truncated ml-2" v-if="!compact">Предыдущая серия</span>
    </v-btn>
</template>

<script lang="ts">
    import playerStore from '@/UI/store/player';
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Previous extends Vue {
        @Prop() public readonly compact!: boolean;

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
