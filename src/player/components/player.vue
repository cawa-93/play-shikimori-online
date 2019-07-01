<template>
  <v-card class="player-container d-flex">
    <iframe
      id="player"
      ref="player"
      v-ga.load="'trackView'"
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
import { buildIframeURL } from "../../helpers";
let _listener = null;

export default {
  name: "player",

  data() {
    return {
      src: ""
    };
  },

  computed: {
    translationID() {
      return this.$store.state.player.currentTranslationID;
    }
  },

  watch: {
    translationID() {
      this.setTitle();

      {
        const src = new URL(
          this.$store.getters["player/currentTranslation"].embedUrl
        );
        const config = new URLSearchParams();
        config.append("extension-id", chrome.runtime.id);

        config.append(
          "play-shikimori[seriesId]",
          this.$store.getters["player/currentTranslation"].seriesId
        );

        config.append(
          "play-shikimori[episodeId]",
          this.$store.getters["player/currentTranslation"].episodeId
        );

        config.append(
          "play-shikimori[id]",
          this.$store.getters["player/currentTranslation"].id
        );

        config.append("play-shikimori[isAutoPlay]", "1");

        config.set(
          "play-shikimori[nextEpisode]",
          this.$store.getters["player/nextEpisode"] ? "1" : "0"
        );

        src.hash = config.toString();

        this.src = src.toString();
      }
    }
  },

  methods: {
    setTitle() {
      if (!this.$store.getters["player/currentTranslation"]) return;
      document.title = `${this.$store.getters["player/currentTranslation"].title} — онлайн просмотр`;
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
