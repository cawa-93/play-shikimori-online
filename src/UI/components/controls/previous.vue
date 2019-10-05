<template>
    <div class="flex-parent previous-episode">
        <v-btn
            :disabled="!previous"
            @click.prevent="selectPreviousEpisode"
            aria-label="Предыдущая серия"
            target="_self"
            text
            v-if="readyToShow"
        >
            <v-icon>mdi-skip-previous</v-icon>
            <span class="long-and-truncated ml-2" v-if="!compact">Предыдущая серия</span>
        </v-btn>

        <v-skeleton-loader type="button" v-else width="64px"></v-skeleton-loader>

    </div>
</template>

<script lang="ts">
import Boilerplate from '@/UI/mixins/boilerplate';
import playerStore from '@/UI/store/player';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

@Component
export default class Previous extends mixins(Boilerplate) {
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

    @Watch('previous', {deep: false})
    public nextEpisodeOnChange() {
        this.readyToShow = true;
    }
}
</script>
