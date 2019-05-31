
<template>
  <section class="translation-list">
    {{currentTranslationID}}
    <v-select
      item-text="authorsSummary"
      item-value="id"
      :items="groupedTranslations"
      box
      :label="label"
      v-model="currentTranslationID"
    >
      <template v-slot:item="data">
        <template v-if="data.item.label">
          <v-subheader>{{data.item.label}}</v-subheader>
        </template>
        <template v-else>
          <v-list-tile-content class="inset">
            <v-list-tile-title>{{data.item.authorsSummary}}</v-list-tile-title>
          </v-list-tile-content>
        </template>
      </template>
    </v-select>
  </section>
</template>


<script>
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
          this.$store.dispatch("player/setCurrentTranslation", translation);
        }
      }
    },

    label() {
      if (!this.$store.getters["player/currentTranslation"]) {
        return "Выберите перевод";
      }
      switch (this.$store.getters["player/currentTranslation"].type) {
        case "voiceRu":
          return "Озвучка";
        case "subRu":
          return "Русские Субтиитры";
        case "subEn":
          return "Английские Субтиитры";
        case "subJa":
          return "Японские Субтиитры";
        case "raw":
          return "Оригинал";
      }
    }
  }
};
</script>


<style>
.v-list__tile__content.inset {
  padding-left: 30px;
}
</style>
