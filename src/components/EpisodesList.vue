<template>
  <div>
    <v-btn @click="drawer = !drawer" class="toggle-episode-drawer" icon>
      <v-icon>mdi-format-list-bulleted</v-icon>
    </v-btn>
    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
    >
      <v-list dense v-if="episodes.length">
        <v-list-item :key="episode.id"
                     :to="{name: 'player', params: {seriesId: $route.params.seriesId, episodeId: episode.id}}"
                     v-for="episode in episodes">
          <v-list-item-content>
            <v-list-item-title>{{episode.episodeInt}} Серия</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-else-if="loading">
        <v-skeleton-loader :key="i" type="list-item" v-for="i in 12"/>
      </template>
      <p v-else>Нет серий</p>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {episodesStore} from '@/store/modules/episodes';


  @Component
  export default class EpisodesList extends Vue {
    public drawer = null;
    public loading = true;



    get episodes() {
      const seriesId = Number.parseInt(this.$route.params.seriesId, 10);
      return episodesStore.getForSeries(seriesId);
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
</style>
