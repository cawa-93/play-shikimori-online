<template>
  <v-layout row>
    <v-flex>
      <v-btn
        class="ma-0"
        outline
        :disabled="!$store.getters['player/previousEpisode']"
        @click="$store.dispatch('player/initPreviousEpisode')"
      >
        <v-icon left>skip_previous</v-icon>Предыдущий эпизод
      </v-btn>
    </v-flex>
    <v-flex class="text-xs-center">
      <v-rating
        :value="shikimori.userRate ? shikimori.userRate.score / 2 : 0"
        @input="saveRate"
        half-increments
        hover
        :readonly="!shikimori.userRate"
      ></v-rating>
    </v-flex>
    <v-flex class="text-xs-right">
      <v-btn class="ma-0" :disabled="!$store.getters['player/nextEpisode']" @click="markAsWached">
        Следующий эпизод
        <v-icon right>skip_next</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>


<script>
import { shikimoriAPI, anime365API } from "../../helpers";

export default {
  name: "video-controls",

  data() {
    return {
      shikimori: {
        animeId: null,
        userRate: null
      }
    };
  },

  computed: {
    currentEpisodeInt() {
      return parseInt(this.$store.getters["player/currentEpisode"].episodeInt);
    }
  },

  methods: {
    async init() {
      const { data: series } = await anime365API(
        `/series/${this.$store.getters["player/currentEpisode"].seriesId}`
      );
      const anime = await shikimoriAPI(`/animes/${series.myAnimeListId}`);

      document.title = `${anime.russian || anime.name} — онлайн просмотр`;

      this.shikimori.animeId = anime.id;
      this.shikimori.userRate = anime.user_rate;
    },

    async markAsWached() {
      if (this.$store.state.user.UserInfo) {
        const url = this.shikimori.userRate
          ? `/v2/user_rates/${
              this.shikimori.userRate.id
            }?user_rate[target_type]=Anime&user_rate[episodes]=${
              this.currentEpisodeInt
            }&user_rate[status]=watching&user_rate[user_id]=${
              this.$store.state.user.UserInfo.id
            }`
          : `/v2/user_rates/?user_rate[target_type]=Anime&user_rate[episodes]=${
              this.currentEpisodeInt
            }&user_rate[status]=watching&user_rate[target_id]=${
              this.shikimori.animeId
            }&user_rate[user_id]=${this.$store.state.user.UserInfo.id}`;

        const method = this.shikimori.userRate ? "PATCH" : "POST";

        const newUserRate = await shikimoriAPI(url, { method });

        this.shikimori.userRate = newUserRate;
      }

      this.$store.dispatch("player/initNextEpisode");
    },

    async saveRate(value) {
      console.log(value);
      if (!this.$store.state.user.UserInfo) {
        return;
      }

      value *= 2;

      const url = this.shikimori.userRate
        ? `/v2/user_rates/${
            this.shikimori.userRate.id
          }?user_rate[target_type]=Anime&user_rate[score]=${value}&user_rate[status]=watching&user_rate[user_id]=${
            this.$store.state.user.UserInfo.id
          }`
        : `/v2/user_rates/?user_rate[target_type]=Anime&user_rate[score]=${value}&user_rate[status]=watching&user_rate[target_id]=${
            this.shikimori.animeId
          }&user_rate[user_id]=${this.$store.state.user.UserInfo.id}`;

      const method = this.shikimori.userRate ? "PATCH" : "POST";

      const newUserRate = await shikimoriAPI(url, { method });

      this.shikimori.userRate = newUserRate;
    }
  },

  watch: {
    currentEpisodeInt() {
      return this.init();
    }
  },

  async mounted() {
    this.init();

    window.addEventListener("message", ({ data: event }) => {
      if (event.name === "ended" || event.name === "mark-as-watched") {
        this.markAsWached();
      }
    });
  }
};
</script>
