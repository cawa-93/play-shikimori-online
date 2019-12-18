<template>
  <div class="component-root episodes-list-component-root">
    <v-btn @click="drawer = !drawer" class="toggle-episode-drawer" icon>
      <v-icon>mdi-format-list-bulleted</v-icon>
    </v-btn>
    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
    >
      <v-list subheader v-if="episodes.length">
        <v-subheader v-if="title">
          <span class="text-no-wrap overflow-hidden text-overflow-ellipsis">{{title}}</span>
          <v-spacer/>
          <v-tooltip :open-delay="500" right transition="slide-x-transition">
            <template v-slot:activator="{on, attr}">
              <v-btn :href="`https://shikimori.one/animes/${series.myAnimeListId}`"
                     icon
                     target="_blank"
                     v-bind="attr"
                     v-on="on">
                <v-icon>mdi-link</v-icon>
              </v-btn>
            </template>
            <span>Открыть на Shikimori</span>
          </v-tooltip>
        </v-subheader>
        <v-list-item :key="episode.id"
                     :to="{name: 'player', params: {seriesId: $route.params.seriesId, episodeId: episode.id}}"
                     v-for="episode in episodes">
          <v-list-item-content>
            <v-list-item-title>{{episode.episodeInt}} Серия</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-else-if="loading">
        <v-skeleton-loader :key="i" type="list-item-two-line" v-for="i in 12"/>
      </template>
      <p v-else>Нет серий</p>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {episodesStore} from '@/store/modules/episodes';
  import {seriesStore} from '@/store/modules/series';


  @Component
  export default class EpisodesList extends Vue {
    public drawer = null;
    public loading = true;



    get seriesId() {
      return Number.parseInt(this.$route.params.seriesId, 10);
    }



    get series() {
      return seriesStore.items[this.seriesId];
    }



    get title() {
      if (!this.series || !this.series.titles) {
        return '';
      }

      return this.series.titles.ru || this.series.titles.en || this.series.titles.romaji || this.series.titles.ja;
    }



    get episodes() {
      return episodesStore.getForSeries(this.seriesId);
    }



    public async created() {
      if (this.episodes.length) {
        this.loading = false;
        return;
      }

      const seriesId = Number.parseInt(this.$route.params.seriesId, 10);
      if (seriesId && !isNaN(seriesId)) {
        this.loading = true;
        try {
          await episodesStore.loadEpisodesForSeries(seriesId);
        } finally {
          this.loading = false;
        }
      }
    }

  }
</script>


<style scoped>
  .toggle-episode-drawer {
    position: absolute;
    left: 0;
    top: 0
  }

  .text-overflow-ellipsis {
    text-overflow: ellipsis;
  }
</style>
