
<template>
  <section class="translation-list">
    <v-select
      item-text="authorsSummary"
      item-value="id"
      :items="groupedTranslations"
      filled
      :label="label"
      v-model="currentTranslation"
      :loading="translations.length === 0"
      no-data-text="Пока нет ни одного перевода"
    >
      <template v-slot:item="{item}">
        <template v-if="item.label">
          <v-subheader>{{item.label}}</v-subheader>
        </template>
        <template v-else>
          <v-list-item-action>
            <v-icon v-if="item.qualityType === 'uncensored'">explicit</v-icon>
            <v-icon v-else-if="item.qualityType !== 'tv' ">high_quality</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{item.authorsSummary}}</v-list-item-title>
          </v-list-item-content>
        </template>
      </template>

      <template v-slot:append-item>
        <v-list-item href="https://smotret-anime-365.ru/translations/create" class="mt-2">
          <v-list-item-action>
            <v-icon>add</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Добавить перевод</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>open_in_new</v-icon>
          </v-list-item-action>
        </v-list-item>
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
      return this.$store.state.player.currentEpisode &&
        this.$store.state.player.currentEpisode.translations
        ? this.$store.state.player.currentEpisode.translations
        : [];
    },

    groupedTranslations() {
      const items = [];

      if (!this.translations.length) {
        return items;
      }
      const groups = [
        { type: "voiceRu", label: "Озвучка" },
        { type: "voiceEn", label: "Английская Озвучка" },
        { type: "subRu", label: "Русские Субтитры" },
        { type: "subEn", label: "Английские Субтитры" },
        { type: "subJa", label: "Японские Субтитры" },
        { type: "raw", label: "Оригинал" }
      ];

      groups.forEach(({ type, label }) => {
        const translations = this.translations
          .filter(t => t.type === type)
          .map(translation => {
            if (!translation.authorsSummary) {
              translation.authorsSummary = "Неизвестный";
            }

            return translation;
          });

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

    currentTranslation: {
      get() {
        return this.$store.state.player.currentTranslation
          ? this.$store.state.player.currentTranslation.id
          : null;
      },
      async set(id) {
        const translation = this.translations.find(
          translation => translation.id === id
        );

        if (translation) {
          this.$store.dispatch("player/selectTranslation", {
            translation,
            trusted: true
          });
        }
      }
    },

    label() {
      if (!this.$store.state.player.currentTranslation) {
        return this.translations.length ? "Выберите перевод" : "Загрузка...";
      }
      switch (this.$store.state.player.currentTranslation.type) {
        case "voiceRu":
          return "Озвучка";
        case "voiceEn":
          return "Английская Озвучка";
        case "subRu":
          return "Русские Субтитры";
        case "subEn":
          return "Английские Субтитры";
        case "subJa":
          return "Японские Субтитры";
        case "raw":
          return "Оригинал";
        default:
          "Перевод";
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
