<template>
  <v-card class="player-container">
    <iframe
      key="main-player"
      v-show="currentTranslation.embedUrl"
      :src="currentTranslation.embedUrl + '?autoplay=1&extension-id=' + extensionId"
      height="100%"
      width="100%"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </v-card>
</template>


<script>
export default {
  name: "player",
  data() {
    return {
      extensionId: chrome.runtime.id,
      displayFrame: false
    };
  },

  computed: {
    currentTranslation() {
      return this.$store.getters["player/currentTranslation"]
        ? this.$store.getters["player/currentTranslation"]
        : {};
    }
  },

  watch: {
    currentTranslation() {
      console.log(this.currentTranslation.embedUrl);
    }
  }
};
</script>
