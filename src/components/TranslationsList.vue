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
      <v-list dense v-if="translations.length">
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

      <template v-else-if="loading">
        <v-skeleton-loader :key="i" type="list-item" v-for="i in 12"/>
      </template>

      <p v-else>Нет серий</p>


    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {translationsStore} from '@/store/modules/translations';


  @Component
  export default class TranslationsList extends Vue {
    drawer = null;
    loading = true;



    get translations() {
      const episodeId = Number.parseInt(this.$route.params.episodeId, 10);
      return translationsStore.getForEpisode(episodeId);
    }



    async created() {
      if (this.translations.length) {
        this.loading = false;
        return;
      }

      const episodeId = Number.parseInt(this.$route.params.episodeId, 10);
      if (episodeId && !isNaN(episodeId)) {
        this.loading = true;
        try {
          await translationsStore.loadTranslations(episodeId);
        } finally {
          this.loading = false;
        }
      }
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
