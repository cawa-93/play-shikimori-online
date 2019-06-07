<template>
  <v-card class="player-container">
    <iframe
      id="player"
      ref="player"
      v-if="$store.state.player.currentTranslationID"
      :src="'https://smotret-anime-365.ru/translations/embed/' + $store.state.player.currentTranslationID + '?&extension-id=' + extensionId"
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
    return {
      extensionId: chrome.runtime.id
    };
  },

  computed: {
    src() {}
  },

  created() {
    _listener = ({ data: event }) => {
      if (event === "watched") {
        this.$store.dispatch("shikimori/markAsWatched");
      } else if (event.name === "ended" || event.name === "mark-as-watched") {
        this.$store.dispatch("shikimori/markAsWatched");
        this.$store.dispatch("player/initNextEpisode");
      } else if (event.name === "timeupdate") {
        console.log({ parent: event });

        if (this.$store.getters["player/nextEpisode"]) {
          const endingTime = event.duration > 600 ? 120 : event.duration * 0.1;
          const hidden = event.duration - event.currentTime >= endingTime;
          this.$refs.player.contentWindow.postMessage(
            { button: "next-episode", hidden },
            "*"
          );
        }
      }
    };
    window.addEventListener("message", _listener);
  },

  destroyed() {
    window.removeEventListener("message", _listener);
  }
};
</script>
