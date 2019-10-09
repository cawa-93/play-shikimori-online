<template>
    <div class="flex-parent open-on-shikimori">
        <v-btn
            :disabled="!shikiID"
            :href="`https://shikimori.one/animes/${shikiID}`"
            @click.stop
            aria-label="Открыть на Шикимори"

            text
            v-if="readyToShow"
        >
            <img height="24px" id="shikimori-logo-light" src="/shikimori-logo.svg" width="24px">
            <span class="long-and-truncated ml-2" v-if="!compact">Открыть на Шикимори</span>
        </v-btn>
        <v-skeleton-loader min-width="100%" type="button" v-else></v-skeleton-loader>
    </div>
</template>

<script lang="ts">
    import Boilerplate from '@/UI/mixins/boilerplate';
    import playerStore from '@/UI/store/player';
    import {mixins} from 'vue-class-component';
    import {Component, Prop, Watch} from 'vue-property-decorator';

    @Component({
        name: 'open-on-shikimori',
    })
    export default class OpenOnShikimori extends mixins(Boilerplate) {
        @Prop() public readonly compact!: boolean;

        get shikiID() {
            if (playerStore.currentEpisode) {
                return playerStore.currentEpisode.myAnimelist;
            }

            return this.$route.params.anime;
        }

        @Watch('shikiID')
        public nextEpisodeOnChange() {
            this.readyToShow = true;
        }
    }
</script>

<style scoped>
    .open-on-shikimori .theme--dark #shikimori-logo-light {
        filter: invert(1);
    }
</style>
