<template>
  <v-form @submit="runSearch" class="component-root search-field-component-root" lazy-validation>
    <v-text-field
      :disabled="loading"
      :error-messages="errorText"
      :loading="loading"
      @keydown="() => errorText = ''"
      label="Найти аниме по ссылке"
      prepend-inner-icon="mdi-movie-search-outline"
      required
      solo
      type="url"
      v-model.trim="url"
    />
  </v-form>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {seriesStore} from '@/store/modules/series';


  @Component
  export default class SearchField extends Vue {
    public url = '';
    public loading = false;
    public errorText = '';
    public pattern = /\/animes?\/[a-z]?([0-9]+)/i;



    public async runSearch() {
      const match = this.url.match(this.pattern);

      if (!match || !match[1]) {
        this.errorText = 'Ведите ссылку с Shikimori или MyAnimeList';
        return;
      }

      const malId = Number.parseInt(match[1], 10);

      if (isNaN(malId)) {
        this.errorText = 'Ведите ссылку с Shikimori или MyAnimeList';
        return;
      }

      /**
       * Если требуемый серииал ещё не загружен в локальную память его нужно загрузить.
       */
      if (!seriesStore.malMap[malId]) {
        this.loading = true;

        try {
          // Поиск и загрузка сериала
          await seriesStore.search({myAnimeListId: malId});
        } catch (e) {
          console.error({e});
        }

        // Если ничего не найдено — показать ошибку
        if (!seriesStore.malMap[malId]) {
          this.errorText = 'Не найдено ни одной серии для данного аниме';
          this.loading = false;
          return;
        }
      }

      await this.$router.push({
        name: 'player',
        params: {
          seriesId: String(seriesStore.malMap[malId]),
        },
      });

      // После перехода к просмотру отключаем лоадер и очищаем поле
      this.loading = false;
      this.url = '';
    }
  }
</script>

<style scoped>
  .search-field-component-root {
    grid-column: container;
    width: 100%;
  }
</style>
