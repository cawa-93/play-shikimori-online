<template>
    <v-btn
        :href="`https://shikimori.one/animes/${shikiID}`"
        :icon="compact"
        :text="!compact"
        @click.stop
        class="flex-parent open-on-shikimori"
        v-if="shikiID"
    >
        <img height="24px" id="shikimori-logo-light" src="/shikimori-logo.svg" width="24px">
        <span class="long-and-truncated"
              style="margin-left: 8px;"
              v-if="!compact">Открыть на Шикимори</span>
    </v-btn>
</template>

<script lang="ts">
import playerStore from '@/UI/store/player';
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
    name: 'open-on-shikimori',
})
export default class OpenOnShikimori extends Vue {
    @Prop() public readonly compact!: boolean;

    get shikiID() {
        if (playerStore.currentEpisode) {
            return playerStore.currentEpisode.myAnimelist;
        }

        return this.$route.params.anime;
    }
}
</script>

<style scoped>
    #shikimori-logo-light {
        filter: invert(1);
    }
</style>
