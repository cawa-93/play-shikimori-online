<template>
  <v-card
    :class="{
      'cursor-wait': !!loading
    }"
    :to="route"
    class="anime-item anime-poster" height="314" hover
    width="225"
  >
    <v-img
      :aspect-ratio="225/314"
      :lazy-src="series.posterUrlSmall"
      :src="series.posterUrl"

      d-flex
      height="314"
      v-if="!loading"
    >
      <v-container class="anime-title bottom-gradient" fluid>
        <span class="white--text body-1">{{title}}</span>
      </v-container>
    </v-img>
  </v-card>
</template>

<script lang="ts">
  import {seriesStore} from '@/store/modules/series';
  import {Component, Prop, Vue} from 'vue-property-decorator';


  @Component
  export default class Anime extends Vue {
    @Prop() public readonly series!: typeof seriesStore.items[number];



    get loading() {
      return !this.series;
    }



    get title() {
      if (!this.series || !this.series.titles) {
        return '';
      }

      return this.series.titles.ru || this.series.titles.en || this.series.titles.romaji || this.series.titles.ja;
    }



    get route() {
      if (!this.series || !this.series.id) {
        return '';
      }

      return {
        name: 'player',
        params: {
          seriesId: this.series.id,
        },
      };
    }

  }
</script>

<style scoped>
  .v-card.anime-item.anime-poster .v-responsive.v-image {
    background-color: rgba(0, 0, 0, 0.12);
  }

  .v-card.anime-item.anime-poster .anime-title {
    position: absolute;
    bottom: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 40%, rgba(255, 255, 255, 0) 100%);
    padding-top: 20%;

    transform: translate(0, 100%);
    transition: transform 300ms;
    will-change: transform;
  }

  .v-card.anime-item.anime-poster:hover .anime-title,
  .v-card.anime-item.anime-poster:focus .anime-title {
    transform: translate(0, 0);
  }


</style>
