
<template>
  <v-list>
    <v-list-tile
      v-if="shikiID"
      key="open-on-shikimori"
      :href="shikiLink.url"
      rel="noopener noreferrer"
      v-ga="$ga.commands.trackAction.bind(this, 'open-on-shikimori')"
    >
      <v-list-tile-action>
        <v-icon>open_in_new</v-icon>
      </v-list-tile-action>

      <v-list-tile-title>{{ shikiLink.label }}</v-list-tile-title>
    </v-list-tile>

    <v-list-tile
      v-if="$store.state.player.currentTranslation"
      key="report-about-error"
      :href="reportAboutError.url"
      rel="noopener noreferrer"
      v-ga="$ga.commands.trackAction.bind(this, 'report-about-error')"
    >
      <v-list-tile-action>
        <v-icon>report</v-icon>
      </v-list-tile-action>

      <v-list-tile-title>{{ reportAboutError.label }}</v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  name: "actions",
  computed: {
    shikiID() {
      if (this.$store.state.player.currentEpisode) {
        return this.$store.state.player.currentEpisode.myAnimelist;
      }

      return window.config.anime;
    },
    shikiLink() {
      return {
        label: "Открыть на Шикимори",
        url: `https://shikimori.one/animes/${this.shikiID}`
      };
    },

    reportAboutError() {
      return {
        label: "Сообщить о проблеме с видео",
        url: `https://smotret-anime-365.ru/translations/report/${this.$store.state.player.currentTranslation.id}`
      };
    }
  }
};
</script>
