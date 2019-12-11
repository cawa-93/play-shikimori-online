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
      <v-list dense>
        <v-list-item :key="episode.id"
                     :to="{name: 'player', params: {seriesId: $route.params.seriesId, episodeId: episode.id}}"
                     v-for="episode in episodes">
          <v-list-item-content>
            <v-list-item-title>{{episode.episodeInt}} Серия</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {episodesStore} from '@/store/modules/episodes';


  @Component
  export default class EpisodesList extends Vue {
    drawer = true;



    get episodes() {
      const seriesId = Number.parseInt(this.$route.params.seriesId, 10);
      return episodesStore.getForSeries(seriesId);
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
