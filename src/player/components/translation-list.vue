
<template>
  <section class="translation-list" v-if="translations && translations.length">
    <v-select
      item-text="authorsSummary"
      item-value="id"
      :items="groupedTranslations"
      box
      label="Перевод"
      v-model="currentTranslationID"
      @change="saveTranslationPreference"
    >
      <template v-slot:item="data">
        <template v-if="data.item.label">
          <v-subheader>{{data.item.label}}</v-subheader>
        </template>
        <template v-else>
          <v-list-tile-content class="inset">
            <v-list-tile-title>{{data.item.authorsSummary || 'Неизвестный'}}</v-list-tile-title>
          </v-list-tile-content>
        </template>
      </template>
    </v-select>
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
          options: []
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
      return this.translations.filter(t => t.isActive);
    },

    groupedTranslations() {
      const groups = [
        { type: "voiceRu", label: "Озвучка" },
        { type: "subRu", label: "Русские Субтиитры" },
        { type: "subEn", label: "Английские Субтиитры" },
        { type: "subJa", label: "Японские Субтиитры" },
        { type: "raw", label: "Оригинал" }
      ];

      const items = [];

      groups.forEach(({ type, label }) => {
        const translations = this.filteredTranslations.filter(
          t => t.type === type
        );

        if (translations.length) {
          items.push({
            label,
            disabled: true
          });

          items.push(...translations);

          items.push({
            divider: true,
            disabled: true
          });
        }
      });

      return items;
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


<style>
.v-list__tile__content.inset {
  padding-left: 30px;
}
</style>
