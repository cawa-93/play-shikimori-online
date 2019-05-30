<template>
  <v-card class="player-container" v-if="$store.getters['player/currentTranslation']">
    <iframe
      :src="$store.getters['player/currentTranslation'].embedUrl + '?autoplay=1&extension-id=' + extensionId"
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
      extensionId: chrome.runtime.id
    };
  }
};
</script>
