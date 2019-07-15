<template>
  <v-card class="player-container d-flex">
    <iframe
      id="player"
      ref="player"
      v-ga.load="'trackView'"
      v-if="$store.state.player.currentTranslation"
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

  data() {
    return {};
  },

  computed: {
    translation() {
      return this.$store.state.player.currentTranslation;
    },
    src() {
      const src = new URL(this.translation.embedUrl);
      const config = new URLSearchParams();

      config.append("extension-id", chrome.runtime.id);
      config.append("play-shikimori[seriesId]", this.translation.seriesId);
      config.append("play-shikimori[episodeId]", this.translation.episodeId);
      config.append("play-shikimori[id]", this.translation.id);
      config.append("play-shikimori[isAutoPlay]", "1");

      config.set(
        "play-shikimori[nextEpisode]",
        this.$store.state.player.currentEpisode.next ? "1" : "0"
      );

      src.hash = config.toString();

      return src.toString();
    }
  },

  watch: {
    translation() {
      this.setTitle();
    }
  },

  methods: {
    setTitle() {
      if (!this.$store.state.player.currentTranslation) return;
      document.title = `${this.$store.state.player.currentTranslation.title} — онлайн просмотр`;
    }
  },

  created() {
    this.setTitle();

    _listener = ({ data: event }) => {
      if (event === "watched") {
        this.$store.dispatch("shikimori/markAsWatched");
        this.$store.dispatch("player/preloadNextEpisode");
      } else if (event.name === "ended" || event.name === "mark-as-watched") {
        if (event.name === "mark-as-watched") {
          // console.log({ event: event.name });
          this.$ga.event("player-controls", "next-episode", "in-frame");
        }

        this.$store.dispatch("shikimori/markAsWatched");
        this.$store.dispatch("player/selectNextEpisode");
      }

      // else if (event.name === "timeupdate") {
      //   if (this.$store.getters["player/nextEpisode"]) {
      //     const endingTime = event.duration > 600 ? 120 : event.duration * 0.1;
      //     const hidden = event.duration - event.currentTime >= endingTime;
      //     this.$refs.player.contentWindow.postMessage(
      //       { button: "next-episode", hidden },
      //       "*"
      //     );
      //   }
      // }
      else if (event.name === "play" || event.name === "pause") {
        document.head.querySelector(
          'link[rel="icon"]'
        ).href = `/icons/${event.name}.png`;
      }
    };
    window.addEventListener("message", _listener);
  },

  destroyed() {
    window.removeEventListener("message", _listener);
  }
};
</script>
