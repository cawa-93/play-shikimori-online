<template>
  <v-card
    :class="{
        'cursor-wait': !!loading
      }"
    :img="series.posterUrl"
    :to="route"
    @mouseover="loadEpisodes"
    class="component-root anime-component-root anime-item anime-poster"
    height="314"
    v-if="!loading"
    width="225"
  >
    <v-container class="anime-episodes top-gradient white--text body-1 text-right"
                 fluid
                 v-if="episodeCount || episodesLoading">
      <v-progress-circular indeterminate size="20" v-if="episodesLoading" width="2"/>
      <template v-else>
        {{episodeCount}}
      </template>
    </v-container>

    <v-container class="anime-title bottom-gradient white--text body-1" fluid>
      {{title}}
    </v-container>
  </v-card>
</template>

<script lang="ts">
  import {seriesStore} from '@/store/modules/series';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {anime365Client} from '@/ApiClasses/Anime365Client';
  import {episodesStore} from '@/store/modules/episodes';


  @Component
  export default class Anime extends Vue {
    @Prop(Number) public readonly malId!: number;

    public loading = true;
    public episodesLoading: boolean | null = null;



    get series() {
      const seriesId = seriesStore.malMap[this.malId];
      return seriesStore.items[seriesId];
    }



    get episodeCount() {
      if (!this.series) {
        return null;
      }
      return episodesStore.getForSeries(this.series.id).length;
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



    public async loadEpisodes() {
      if (!this.series || this.episodeCount || this.episodesLoading !== null) {
        return;
      }

      this.episodesLoading = true;

      try {
        await episodesStore.loadEpisodesForSeries(this.series.id);
      } finally {
        this.episodesLoading = false;
      }
    }



    public async created() {
      if (this.series) {
        this.loading = false;
        return;
      }

      if (!this.malId) {
        return;
      }

      try {
        const series = await anime365Client.getSeriesCollection({myAnimeListId: this.malId});
        series.forEach((s) => seriesStore.set(s));
      } finally {
        this.loading = false;
      }
    }

  }
</script>

<style lang="scss">
  .anime-poster {
    overflow : hidden;
    position : relative;


    .anime-title {
      bottom      : 0;
      padding-top : 20%;
      position    : absolute;

      transform   : translate(0, 100%);
      transition  : transform 300ms;

      /*Свойство will-change: transform слиишком нагружает графику. Скролинг начинает фризить*/
      /*will-change: transform;*/
    }


    .bottom-gradient {
      background : linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0) 100%);
    }

    .top-gradient {
      background : linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0) 100%);
    }

    .anime-episodes {
      padding-bottom : 10%;
      transform      : translate(0, -100%);
      transition     : transform 300ms;
    }


    &:hover .anime-title,
    &:focus .anime-title,
    &:hover .anime-episodes,
    &:focus .anime-episodes {
      transform : translate(0, 0);
    }


  }


</style>
