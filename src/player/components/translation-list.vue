
<template>
  <section class="translation-list" v-if="translations && translations.length">
    <select v-model="filters.type.value">
      <option
        v-for="option in filters.type.options"
        :key="option.value"
        :value="option.value"
      >{{option.label}}</option>
    </select>

    <select v-model="currentTranslationID" @change="saveTranslationPreference">
      <option disabled value v-if="!filteredTranslations || !filteredTranslations.length">Нет видео</option>
      <option
        v-for="translation in filteredTranslations"
        :key="translation.id"
        v-if="translation.isActive"
        :value="translation.id"
      >{{translation.authorsSummary || 'Неизвестный'}}</option>
    </select>
  </section>
</template>


<script>
import { storage } from "kv-storage-polyfill";

export default {
  name: "translation-list",

  data() {
    return {
      filters: {
        type: {
          value: "voiceRu",
          options: [
            { value: "voiceRu", label: "Озвучка" },
            { value: "subRu", label: "Русские Субтиитры" },
            { value: "subEn", label: "Английские Субтиитры" },
            { value: "subJa", label: "Японские Субтиитры" },
            { value: "raw", label: "Оригинал" }
          ]
        }
      }
    };
  },

  computed: {
    translations() {
      if (
        !this.$store.getters["player/currentEpisode"] ||
        !this.$store.getters["player/currentEpisode"].translations
      ) {
        return [];
      }
      return this.$store.getters["player/currentEpisode"].translations;
    },

    filteredTranslations() {
      return this.translations.filter(
        translation => translation.type === this.filters.type.value
      );
    },

    currentTranslationID: {
      get() {
        return this.$store.state.player.currentTranslationID;
      },
      set(id) {
        const translation = this.filteredTranslations.find(
          translation => translation.id === id
        );
        if (translation) {
          this.$store.dispatch("player/setTranslation", translation);
        }
      }
    }
  },

  watch: {
    async translations() {
      const preference = await storage.get("translationPreference");

      if (!preference) {
        await storage.set("translationPreference", {
          bySeries: new Map()
        });
      }

      /** ID Текущего тайтла */
      const seriesId = this.$store.getters["player/currentEpisode"].seriesId;

      /**
       * Последний установленный перевод для текущего тайтла
       */
      const preferenceForSeries = preference.bySeries.get(seriesId);

      if (preferenceForSeries) {
        const primaryTranslation = this.getPrimaryTranslation(
          this.filteredTranslations,
          preferenceForSeries
        );

        this.currentTranslationID = primaryTranslation.id;
      }
    }
  },

  methods: {
    async saveTranslationPreference() {
      // this.lastSavedTranslation = this.$store.getters['player/currentTranslation']

      const preference = await storage.get("translationPreference");
      preference.bySeries.set(
        this.$store.getters["player/currentEpisode"].seriesId,
        this.$store.getters["player/currentTranslation"]
      );

      await storage.set("translationPreference", preference);
    },

    getPrimaryTranslation(translationForSearch, preferedTranslation) {
      // Сохранённый перевод применим к текущей серии
      if (
        translationForSearch.find(
          translation => translation.id == preferedTranslation.id
        )
      ) {
        return preferedTranslation;
      }

      // Сохранённый перевод не применим к текущей серии
      // Поиск альтернативы по названию автора
      const savedAuthor = preferedTranslation.authorsSummary
        .replace(/[^\p{L}\d]/giu, "")
        .trim()
        .toLowerCase();

      if (!savedAuthor) {
        return translationForSearch[0];
      }

      // Сопоставление переводов по имении автора
      const translationFromSameAuthor = translationForSearch.find(
        translation => {
          const translationAuthor = translation.authorsSummary
            .replace(/[^\p{L}\d]/giu, "")
            .trim()
            .toLowerCase();
          if (!translationAuthor) return false;
          return (
            new RegExp(translationAuthor).test(savedAuthor) ||
            new RegExp(savedAuthor).test(translationAuthor)
          );
        }
      );

      // Перевод того же автора найден
      if (translationFromSameAuthor) {
        return translationFromSameAuthor;
      }

      // Перевода от того же автора не найдено
      return translationForSearch[0];
    }
  },

  async mounted() {
    let preference = await storage.get("translationPreference");

    if (!preference || !preference.bySeries) {
      (preference = preference || {}).bySeries = new Map();

      await storage.set("translationPreference", preference);
    }

    /** ID Текущего тайтла */
    const seriesId = this.$store.getters["player/currentEpisode"].seriesId;

    /**
     * Последний установленный перевод для текущего тайтла
     */
    const preferenceForSeries = preference.bySeries.get(seriesId);

    if (preferenceForSeries) {
      // Устанавливаем в фильтрах тиип перевода
      this.filters.type.value = preferenceForSeries.type;

      const primaryTranslation = this.getPrimaryTranslation(
        this.filteredTranslations,
        preferenceForSeries
      );

      this.currentTranslationID = primaryTranslation.id;
    } else {
      this.currentTranslationID = this.filteredTranslations[0].id;
    }
  }
};
</script>
