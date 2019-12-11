<template>
  <div>
    <v-btn @click="drawer = !drawer" class="toggle-translation-drawer" icon>
      <v-icon>mdi-translate</v-icon>
    </v-btn>
    <v-navigation-drawer
      app
      clipped
      right
      v-model="drawer"
    >
      <v-list dense>
        <v-list-item :key="translation.id"
                     :to="{name: 'player', params: {
                       seriesId: $route.params.seriesId,
                       episodeId: $route.params.episodeId,
                       translationId: translation.id
                     }}"
                     v-for="translation in translations"
        >
          <v-list-item-content>
            <v-list-item-title>{{translation.authorsSummary || 'Неизвестный'}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {translationsStore} from '@/store/modules/translations';


  @Component
  export default class TranslationsList extends Vue {
    drawer = true;



    get translations() {
      const episodeId = Number.parseInt(this.$route.params.episodeId, 10);
      return translationsStore.getForEpisode(episodeId);
    }
  }
</script>

<style scoped>
  .toggle-translation-drawer {
    position: absolute;
    right: 0;
    top: 0
  }
</style>
