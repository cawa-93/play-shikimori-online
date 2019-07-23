<template>
  <section>
    <v-app id="app" :dark="theme.dark">
      <v-container class="__layout">
        <v-layout column style="height: calc(100vh - 110px);min-height: 378px;">
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
            <video-controls>
              <main-menu></main-menu>
            </video-controls>
          </v-flex>
        </v-layout>

        <comments v-if="$store.state.shikimori.anime && $store.state.player.currentEpisode"></comments>

        <app-footer></app-footer>

        <v-flex class="mt-5 mt-5 text-xs-center">
          <clear-btn class>Сбросить все данные</clear-btn>
        </v-flex>
      </v-container>

      <messages></messages>
    </v-app>
  </section>
</template>

<script>
import {
  myanimelistAPI,
  sync,
  push as message,
  getReviewUrl
} from "../../helpers";
import episodeList from "./episode-list.vue";
import translationList from "./translation-list.vue";
import player from "./player.vue";
import videoControls from "./video-controls.vue";
import mainMenu from "./main-menu.vue";
import comments from "./comments.vue";
import appFooter from "./app-footer.vue";
import clearBtn from "./clear-btn.vue";
import messages from "./messages.vue";

import theme from "../../mixins/theme";

export default {
  components: {
    episodeList,
    translationList,
    player,
    videoControls,
    mainMenu,
    comments,
    appFooter,
    clearBtn,
    messages
  },

  mixins: [theme],

  async mounted() {
    const { installAt, leaveReview, userAuth } = await sync.get([
      "installAt",
      "leaveReview",
      "userAuth"
    ]);

    this.$store.commit("shikimori/loadCredentialsFromServer", userAuth);

    this.$store.dispatch("player/loadEpisodes", window.config); // Загрузка списка серий и запуск видео
    this.$store.dispatch("shikimori/loadUser"); // Загрузка информации про пользователя если тот авторизован
    this.$store.dispatch("shikimori/loadAnime"); // Загрузка информации про аниме и оценку от пользователя если тот авторизован

    // Если пользователь установил расширение неделю назад
    // и ещё не получал предложения оставить отзыв — создать сообщение с предложением
    const WEEK = 604800000;
    if (!installAt || installAt + WEEK > Date.now() || leaveReview) {
      return;
    }

    const manifest = chrome.runtime.getManifest();
    const url = getReviewUrl();

    message({
      color: "info",
      html: `За каждый отзыв жена покупает мне вкусную печеньку.<br><b><a href="${url}" class="white--text">Спасите, очень нужна печенька к чаю!</a></b>`
    });

    sync.set({ leaveReview: 1 });
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
