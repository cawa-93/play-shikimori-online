<template>
  <div class="component-root translations-list-component-root">
    <v-btn @click="drawer = !drawer" class="toggle-translation-drawer" fab icon right top>
      <v-icon>mdi-translate</v-icon>
    </v-btn>
    <v-navigation-drawer
      app
      clipped
      right
      v-model="drawer"
    >
      <v-list subheader v-if="listItems.length">
        <template v-for="listItem in listItems">
          <template v-if="!listItem.id">
            <v-divider :key="(listItem.label || listItem.type) + '-divider'"/>
            <v-subheader :key="listItem.label || listItem.type"
            >{{listItem.label || listItem.type}}
            </v-subheader>
          </template>

          <v-list-item :key="listItem.id"
                       :to="{
                          name: 'player',
                          params: {
                           seriesId: $route.params.seriesId,
                           episodeId: $route.params.episodeId,
                           translationId: listItem.id
                         }
                        }"
                       v-else

          >


            <v-list-item-content>
              <v-list-item-title>{{listItem.authorsSummary || 'Неизвестный'}}</v-list-item-title>
            </v-list-item-content>

            <v-tooltip open-delay="500" top v-if="listItem.qualityType === 'bd' || listItem.qualityType === 'dvd'">
              <template v-slot:activator="{on, attr}">
                <v-list-item-icon class="ml-0" v-bind="attr" v-on="on">
                  <v-icon>mdi-quality-high</v-icon>
                </v-list-item-icon>
              </template>
              {{listItem.qualityType.toLocaleUpperCase()}}
            </v-tooltip>


            <v-tooltip open-delay="500" top v-if="listItem.height >= 900">
              <template v-slot:activator="{on, attr}">
                <v-list-item-icon class="ml-0" v-bind="attr" v-on="on">
                  <v-icon>{{listItem.height > 2000 ? 'mdi-ultra-high-definition' : 'mdi-high-definition'}}</v-icon>
                </v-list-item-icon>
              </template>
              {{listItem.height}}p
            </v-tooltip>


          </v-list-item>
        </template>
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
  import {translationsStore} from '@/store/modules/translations';
  import {Translation} from '@/types/anime365';


  @Component
  export default class TranslationsList extends Vue {
    public drawer = null;
    public loading = true;



    get translations() {
      const episodeId = Number.parseInt(this.$route.params.episodeId, 10);
      return translationsStore.getForEpisode(episodeId);
    }



    get listItems() {
      const groups: {
        [key: string]: Array<typeof translationsStore.items[number]>;
      } = {};

      this.translations.forEach((translation) => {
        if (!groups[translation.type]) {
          groups[translation.type] = [];
        }

        groups[translation.type].push(translation);
      });

      const listItems: Array<typeof translationsStore.items[number] | { type: Translation['type'], label: string }> = [];

      ([
        {type: 'voiceRu', label: 'Русская Озвучка'},
        {type: 'subRu', label: 'Русские Субтитры'},
        {type: 'voiceEn', label: 'Английская Озвучка'},
        {type: 'subEn', label: 'Английские Субтитры'},
        {type: 'subJa', label: 'Японские Субтитры'},
        {type: 'raw', label: 'Оригинал'},
      ]).forEach((g) => {
        if (!groups[g.type]) {
          return;
        }

        listItems.push(g, ...groups[g.type]);
      });

      return listItems;
    }



    public async created() {
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
