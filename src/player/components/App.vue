<template>
  <section>
    <v-app id="app" :dark="darkMode">
      <v-container class="__layout">
        <v-layout column style="	height: calc(100vh - 110px);min-height: 378px;">
          <v-flex class="flex-grow-unset">
            <v-layout row>
              <v-flex xs6 mr-3>
                <episode-list></episode-list>
              </v-flex>
              <v-flex xs6>
                <translation-list></translation-list>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex d-flex>
            <player></player>
          </v-flex>

          <v-flex class="flex-grow-unset mt-3">
            <video-controls v-if="$store.state.player.currentEpisodeID">
              <main-menu></main-menu>
            </video-controls>
          </v-flex>

          <!-- <v-flex class="flex-grow-unset mt-3">
            <origins v-if="$store.state.shikimori.anime"></origins>
          </v-flex>-->
        </v-layout>

        <comments v-if="$store.state.shikimori.anime && $store.state.player.currentEpisodeID"></comments>
      </v-container>

      <app-footer></app-footer>
    </v-app>
  </section>
</template>

<script>
import { myanimelistAPI } from "../../helpers";
import episodeList from "./episode-list.vue";
import translationList from "./translation-list.vue";
import player from "./player.vue";
import videoControls from "./video-controls.vue";
// import origins from "./origins.vue";
// import actions from "./actions.vue";
import mainMenu from "./main-menu.vue";
import comments from "./comments.vue";
import appFooter from "./app-footer.vue";

export default {
  components: {
    episodeList,
    translationList,
    player,
    videoControls,
    // origins,
    // actions,
    mainMenu,
    comments,
    appFooter
  },

  data() {
    let darkMode = true;

    if (window.matchMedia) {
      darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (!darkMode) {
        darkMode = !window.matchMedia("(prefers-color-scheme: light)").matches;
      }
    }

    if (darkMode) {
      document.querySelector("html").style.backgroundColor = "#303030";
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

  async mounted() {
    await Promise.all([
      this.$store.dispatch("player/initSeries", {
        seriesID: new URL(location.href).searchParams.get("series"),
        episodeInt: parseInt(
          new URL(location.href).searchParams.get("episodeInt")
        )
      }),

      this.$store.dispatch("shikimori/initUser"),
      this.$store.dispatch("shikimori/initAnime")
    ]);

    chrome.storage.onChanged.addListener(async (changes, namespace) => {
      if (!changes.userAuth) {
        return;
      }

      if (changes.userAuth.newValue && changes.userAuth.newValue.access_token) {
        await this.$store.dispatch("shikimori/initUser");
      } else {
        this.$store.commit("shikimori/setUser", null);
      }
    });
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
