<template>
  <v-card class="player-container d-flex">
    <iframe
      id="player"
      ref="player"
      v-if="$store.state.player.currentTranslationID"
      :src="src"
      height="100%"
      width="100%"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </v-card>
</template>


<script>
let _listener = null;

export default {
  name: "player",

  computed: {
    translationID() {
      return this.$store.state.player.currentTranslationID;
    },
    src() {
      const base = new URL(
        `https://smotret-anime-365.ru/translations/embed/${this.translationID}`
      );
      base.searchParams.append("extension-id", chrome.runtime.id);
      base.searchParams.append(
        "play-shikimori[seriesId]",
        this.$store.getters["player/currentTranslation"].seriesId
      );
      base.searchParams.append(
        "play-shikimori[episodeId]",
        this.$store.getters["player/currentTranslation"].episodeId
      );
      base.searchParams.append(
        "play-shikimori[id]",
        this.$store.getters["player/currentTranslation"].id
      );

      return base.toString();
    }
  },

  watch: {
    translationID() {
      this.setTitle();
    }
  },

  methods: {
    setTitle() {
      if (!this.$store.getters["player/currentTranslation"]) return;
      document.title = `${
        this.$store.getters["player/currentTranslation"].title
      } — онлайн просмотр`;
    }
  },

  created() {
    this.setTitle();

    _listener = ({ data: event }) => {
      if (event === "watched") {
        this.$store.dispatch("shikimori/markAsWatched");
      } else if (event.name === "ended" || event.name === "mark-as-watched") {
        this.$store.dispatch("shikimori/markAsWatched");
        this.$store.dispatch("player/initNextEpisode");
      } else if (event.name === "timeupdate") {
        if (this.$store.getters["player/nextEpisode"]) {
          const endingTime = event.duration > 600 ? 120 : event.duration * 0.1;
          const hidden = event.duration - event.currentTime >= endingTime;
          this.$refs.player.contentWindow.postMessage(
            { button: "next-episode", hidden },
            "*"
          );
        }
      } else if (event.name === "play" || event.name === "pause") {
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
