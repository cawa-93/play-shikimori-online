<template>
  <section id="app">
    <template v-if="$store.getters['player/currentEpisode']">
      <div>
        <episode-list></episode-list>
        <translation-list v-if="translations && translations.length"></translation-list>
      </div>

      <player></player>
      <player-controls></player-controls>
      <user-list-controls></user-list-controls>
    </template>
  </section>
</template>

<script>
import episodeList from "./episode-list.vue";
import translationList from "./translation-list.vue";
import player from "./player.vue";
import playerControls from "./player-controls.vue";
import userListControls from "./user-list-controls.vue";

export default {
  components: {
    episodeList,
    translationList,
    player,
    playerControls,
    userListControls
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
    }
  },

  mounted() {
    this.$store.dispatch(
      "player/initSeries",
      new URL(location.href).searchParams.get("series")
    );
    this.$store.dispatch("user/initUser");
  }
};
</script>
