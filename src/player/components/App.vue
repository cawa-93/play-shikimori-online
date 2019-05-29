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

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 80%;
  margin: 0 auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
  box-sizing: border-box;
}

.player-container {
  position: relative;
  overflow: hidden;
  flex: 1;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
}

.player-container > iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
