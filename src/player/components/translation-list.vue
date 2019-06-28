
<template>
  <section class="translation-list">
    <v-select
      item-text="authorsSummary"
      item-value="id"
      :items="groupedTranslations"
      box
      :label="label"
      v-model="currentTranslationID"
      :loading="filteredTranslations.length === 0"
      no-data-text="Пока нет ни одного перевода"
    >
      <template v-slot:item="{item}">
        <template v-if="item.label">
          <v-subheader>{{item.label}}</v-subheader>
        </template>
        <template v-else>
          <v-list-tile-action>
            <span
              class="qualityType"
              v-if="item.qualityType !== 'tv'"
            >{{item.qualityType.toUpperCase()}}</span>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{item.authorsSummary}}</v-list-tile-title>
          </v-list-tile-content>
        </template>
      </template>

      <template v-slot:append-item>
        <v-list-tile href="https://smotret-anime-365.ru/translations/create" class="mt-2">
          <v-list-tile-action>
            <v-icon>add</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Добавить перевод</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-icon>open_in_new</v-icon>
          </v-list-tile-action>
        </v-list-tile>
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
        !this.$store.getters["player/selectedEpisode"] ||
        !this.$store.getters["player/selectedEpisode"].translations
      ) {
        return [];
      }
      return this.$store.getters["player/selectedEpisode"].translations;
    },

    filteredTranslations() {
      return this.translations.filter(t => t.isActive);
    },

    groupedTranslations() {
      const groups = [
        { type: "voiceRu", label: "Озвучка" },
        { type: "subRu", label: "Русские Субтитры" },
        { type: "subEn", label: "Английские Субтитры" },
        { type: "subJa", label: "Японские Субтитры" },
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
      async set(id) {
        const translation = this.filteredTranslations.find(
          translation => translation.id === id
        );
        if (translation) {
          this.$store.dispatch("player/selectTranslation", translation);
        }
      }
    },

    label() {
      if (!this.$store.getters["player/currentTranslation"]) {
        return this.filteredTranslations.length
          ? "Выберите перевод"
          : "Загрузка...";
      }
      switch (this.$store.getters["player/currentTranslation"].type) {
        case "voiceRu":
          return "Озвучка";
        case "subRu":
          return "Русские Субтитры";
        case "subEn":
          return "Английские Субтитры";
        case "subJa":
          return "Японские Субтитры";
        case "raw":
          return "Оригинал";
      }
    }
  }
};
</script>


<style>
.qualityType {
  text-align: center;
  flex: 1;
}
</style>
