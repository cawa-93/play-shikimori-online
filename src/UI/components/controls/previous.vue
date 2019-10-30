<template>
    <v-btn
        :disabled="!previous"
        @click.prevent="selectPreviousEpisode"
        aria-label="Предыдущая серия"
        class="previous-episode"
        target="_self"
        text
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

        get currentEpisode() {
            return playerStore.currentEpisode;
        }

        get previous() {
            return this.currentEpisode && this.currentEpisode.previous;
        }

        public selectPreviousEpisode() {
            return playerStore.selectPreviousEpisode();
        }
    }
</script>
