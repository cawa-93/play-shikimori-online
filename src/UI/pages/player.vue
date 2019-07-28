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
import episodeList from "../components/episode-list.vue";
import translationList from "../components/translation-list.vue";
import player from "../components/player.vue";
import videoControls from "../components/video-controls.vue";
import mainMenu from "../components/main-menu.vue";
import comments from "../components/comments.vue";
import appFooter from "../components/app-footer.vue";
import messages from "../components/messages.vue";

import theme from "../mixins/theme";

export default {
  components: {
    episodeList,
    translationList,
    player,
    videoControls,
    mainMenu,
    comments,
    appFooter,
    messages
  },

  mixins: [theme],

  async mounted() {
    console.log(this.$route.params)
    const { installAt, leaveReview, userAuth, isAlreadyShare } = await sync.get(
      [
        "installAt", // Timestamp когда пользователь установил расширение
        "leaveReview", // Оставлял ли пользователь отзыв
        "userAuth", // Данные для авторизации пользователя
        "isAlreadyShare" // Получал ли пользователь предложение поделиться в ВК
      ]
    );


    this.$store.commit("shikimori/loadCredentialsFromServer", userAuth);

    this.$store.dispatch("player/loadEpisodes", {
      anime: parseInt(this.$route.params.anime),
      episode: parseFloat(this.$route.params.episode),
    }); // Загрузка списка серий и запуск видео
    this.$store.dispatch("shikimori/loadUser"); // Загрузка информации про пользователя если тот авторизован
    this.$store.dispatch("shikimori/loadAnime", this.$route.params.anime); // Загрузка информации про аниме и оценку от пользователя если тот авторизован

    if (!installAt) {
      return;
    }

    const WEEK = 604800000;

    // Если пользователь установил расширение неделю назад
    // и ещё не получал предложения оставить отзыв — создать сообщение с предложением
    if (installAt + WEEK < Date.now() && !leaveReview) {
      const url = getReviewUrl();

      message({
        color: "info",
        html: `За каждый отзыв жена покупает мне вкусную печеньку.<br><b><a href="${url}" class="white--text">Спасите, очень нужна печенька к чаю!</a></b>`
      });

      sync.set({ leaveReview: 1 });
    }

    // Если пользователь установил расширение 3 недели назад
    // и ещё не получал предложения поделиться в ВК — создать сообщение с предложением
    if (installAt + WEEK * 3 < Date.now() && !isAlreadyShare) {
      const url = new URL("https://vk.com/share.php");
      url.searchParams.append(
        "url",
        "https://gitlab.com/kozackunisoft/play-shikimori-online/blob/master/README.md#%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0"
      );
      url.searchParams.append("title", "Play Шикимори Online");
      url.searchParams.append(
        "comment",
        "Лучший способ смотреть аниме прямо на сайте shikimori.one"
      );

      message({
        color: "info",
        html: `Чем больше пользователей в расширении, тем чаще выходят обновления с приятными бонусами<br><b><a href="${url.toString()}" class="white--text">Расскажи о нас друзьям и жди новых возможностей в ближайшее время!</a> 😎</b>`,
        mode: this.$vuetify.breakpoint.smAndDown ? "vertical" : "multi-line"
      });

      sync.set({ isAlreadyShare: 1 });
    }
  },

  watch: {
    '$route.params': function(n,o) {
      console.log({n, o})
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
