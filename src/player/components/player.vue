<template>
  <div
    class="player-container mdl-card mdl-shadow--2dp"
    v-if="$store.getters['player/currentTranslation']"
  >
    <iframe
      :src="$store.getters['player/currentTranslation'].embedUrl + '?autoplay=1'"
      height="100%"
      width="100%"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>


<script>
export default {
  name: "player"
};
</script>
