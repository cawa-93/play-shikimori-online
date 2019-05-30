<template>
  <v-layout tag="footer" row>
    <v-flex align-self-end>
      <v-icon left size="13" class="mr-1">copyright</v-icon>
      <span>
        <a
          :href="'https://shikimori.org' + $store.state.shikimori.anime.url"
          v-if="$store.state.shikimori.anime"
        >Шикимори</a>
        |
        <a
          :href="$store.state.player.series.url"
          v-if="$store.state.player.series"
        >Anime365</a>
        |
        <a :href="manifest.homepage_url">{{manifest.name}}</a>
      </span>
    </v-flex>
    <v-flex class="text-xs-right">
      <v-tooltip left v-if="$store.getters['player/currentTranslation']">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            flat
            icon
            small
            right
            :href="'https://smotretanime.ru/translations/report/' + $store.getters['player/currentTranslation'].id"
            color="gray"
            class="ma-0"
          >
            <v-icon>report</v-icon>
          </v-btn>
        </template>
        <span>Сообщить о проблеме</span>
      </v-tooltip>
    </v-flex>
  </v-layout>
</template>


<script>
let _listener = null;
export default {
  data() {
    return {
      manifest: chrome.runtime.getManifest()
    };
  },

  computed: {
    animeId() {
      return this.$store.state.shikimori.anime.id;
    }
  },

  methods: {
    setTitle() {
      document.title = `${this.$store.state.shikimori.anime.russian ||
        this.$store.state.shikimori.anime.name} — онлайн просмотр`;
    }
  },

  watch: {
    animeId() {
      this.setTitle();
    }
  },

  created() {
    this.setTitle();

    _listener = ({ data: event }) => {
      if (event.name === "play" || event.name === "pause") {
        document.head.querySelector('link[rel="icon"]').href = `/icons/${
          event.name
        }.png`;
      }
    };

    window.addEventListener("message", _listener);
  },

  destroyed() {
    window.removeEventListener("message", _listener);
  }
};
</script>

