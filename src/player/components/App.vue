<template>
  <section>
    <v-app id="app" :dark="darkMode">
      <v-container class="layout" v-if="$store.state.shikimori.anime">
        <v-layout column>
          <v-flex class="flex-grow-unset">
            <v-layout row>
              <v-flex xs6 mr-3>
                <episode-list v-if="$store.getters['player/episodes']"></episode-list>
              </v-flex>
              <v-flex xs6>
                <translation-list v-if="translations && translations.length"></translation-list>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex>
            <player v-if="$store.getters['player/currentTranslation']"></player>
            <p v-else>Выбкрите эпизод</p>
          </v-flex>

          <v-flex class="flex-grow-unset mt-3">
            <video-controls v-if="$store.getters['player/currentTranslation']"></video-controls>
          </v-flex>

          <v-flex class="flex-grow-unset mt-3">
            <origins></origins>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </section>
</template>

<script>
import episodeList from "./episode-list.vue";
import translationList from "./translation-list.vue";
import player from "./player.vue";
import videoControls from "./video-controls.vue";
import origins from "./origins.vue";

export default {
  components: {
    episodeList,
    translationList,
    player,
    videoControls,
    origins
  },

  data() {
    let darkMode = true;

    if (window.matchMedia) {
      darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (!darkMode) {
        darkMode = !window.matchMedia("(prefers-color-scheme: light)").matches;
      }
    }

    return {
      darkMode
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
    }
  },

  mounted() {
    this.$store.dispatch(
      "player/initSeries",
      new URL(location.href).searchParams.get("series")
    );
    this.$store.dispatch("shikimori/initUser");
    this.$store.dispatch("shikimori/initAnime");
  }
};
</script>

<style>
.v-select__selections {
  overflow: hidden;
}

.v-select__selection.v-select__selection--comma {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}

.flex-grow-unset {
  flex-grow: unset;
}
.player-container {
  height: 100%;
}
</style>
