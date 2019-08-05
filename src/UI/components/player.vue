<template>
  <v-card class="player-container d-flex w-100 h-100">
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
    translation(newTranslation, oldTranslation) {
      const n = newTranslation || {};
      const o = oldTranslation || {};
      if ((n.title && n.title !== o.title) || !o.title) {
        this.setTitle();
      }
    }
  },

  methods: {
    setTitle() {
      if (!this.$store.state.player.currentTranslation)
        document.title = `Загрузка ...`;
      else
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

      // TODO: Сохранять прогресс просмотра серии в облачное хранилище для синхронизации между устройствами
      // else if (event.name === "timeupdate") {

      // }
      else if (event.name === "play" || event.name === "pause") {
        document.head.querySelector(
          'link[rel="icon"]'
        ).href = `/icons/${event.name}.png`;
      } else if (event.name === "error") {
        this.$ga.exception(event.error, true);
      }
    };
    window.addEventListener("message", _listener);
  },

  destroyed() {
    window.removeEventListener("message", _listener);
  }
};
</script>
