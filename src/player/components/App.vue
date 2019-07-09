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
        </v-layout>

        <comments v-if="$store.state.shikimori.anime && $store.state.player.currentEpisodeID"></comments>

        <app-footer></app-footer>

        <v-flex class="mt-5 mt-5 text-xs-center">
          <clear-btn class>Сбросить все данные</clear-btn>
        </v-flex>
      </v-container>

      <v-snackbar v-model="snackbar.show" top :timeout="0" multi-line>
        <span v-html="snackbar.html"></span>
        <v-btn icon @click="closeSnackbar">
          <v-icon color="pink">close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-app>
  </section>
</template>

<script>
import { myanimelistAPI } from "../../helpers";
import episodeList from "./episode-list.vue";
import translationList from "./translation-list.vue";
import player from "./player.vue";
import videoControls from "./video-controls.vue";
import mainMenu from "./main-menu.vue";
import comments from "./comments.vue";
import appFooter from "./app-footer.vue";
import clearBtn from "./clear-btn.vue";

export default {
  components: {
    episodeList,
    translationList,
    player,
    videoControls,
    mainMenu,
    comments,
    appFooter,
    clearBtn
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
      darkMode,
      snackbar: {
        show: false,
        html: null
      }
    };
  },

  computed: {},

  async mounted() {
    const promises = Promise.all([
      this.$store.dispatch("player/loadSeries", {
        seriesID: new URL(location.href).searchParams.get("series"),
        episodeInt: parseFloat(
          new URL(location.href).searchParams.get("episodeInt")
        )
      }),

      this.$store.dispatch("shikimori/loadUser"),
      this.$store.dispatch("shikimori/loadAnime")
    ]);

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (changes.userAuth) {
        if (
          changes.userAuth.newValue &&
          changes.userAuth.newValue.access_token
        ) {
          this.$store.dispatch("shikimori/loadUser");
        } else {
          this.$store.commit("shikimori/setUser", null);
        }
      }

      if (changes.runtimeMessages && this.snackbar.html === null) {
        this.loadOneRuntimeMessage();
      }
    });

    await promises;

    this.loadOneRuntimeMessage();
  },

  methods: {
    loadOneRuntimeMessage() {
      chrome.storage.local.get(
        { runtimeMessages: [] },
        ({ runtimeMessages }) => {
          if (!runtimeMessages.length) {
            return;
          }

          const message = runtimeMessages.shift();
          this.snackbar.html = message.html;
          this.snackbar.show = true;

          chrome.storage.local.set({ runtimeMessages });
        }
      );
    },

    closeSnackbar() {
      this.snackbar.show = false;

      setTimeout(() => {
        this.snackbar.html = null;
        this.loadOneRuntimeMessage();
      }, 1000);
    }
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
