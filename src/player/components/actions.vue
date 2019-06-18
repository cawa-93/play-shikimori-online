
<template>
  <v-menu transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn outline v-on="on" class="ma-0 pr-2">
        Действия
        <v-icon class="ml-1">arrow_drop_down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-tile
        key="open-on-shikimori"
        :href="shikiLink.url"
        v-ga="$ga.commands.trackAction.bind(this, 'open-on-shikimori')"
      >
        <v-list-tile-action>
          <v-icon>open_in_new</v-icon>
        </v-list-tile-action>

        <v-list-tile-title>{{ shikiLink.label }}</v-list-tile-title>
      </v-list-tile>

      <v-list-tile
        key="report-about-error"
        :href="reportAboutError.url"
        v-ga="$ga.commands.trackAction.bind(this, 'report-about-error')"
      >
        <v-list-tile-action>
          <v-icon>report</v-icon>
        </v-list-tile-action>

        <v-list-tile-title>{{ reportAboutError.label }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "actions",
  computed: {
    shikiLink() {
      return {
        label: "Открыть на Шикимори",
        url: `https://${sessionStorage.getItem("shiki-domain") ||
          "shikimori.one"}${this.$store.state.shikimori.anime.url}`
      };
    },

    reportAboutError() {
      return {
        label: "Сообщить о проблеме с видео",
        url: `https://smotret-anime-365.ru/translations/report/${
          this.$store.state.player.currentTranslationID
        }`
      };
    }
  }
};
</script>
