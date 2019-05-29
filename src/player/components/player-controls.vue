<template>
  <div>
    <button
      v-if="$store.getters['player/previousEpisode']"
      @click="$store.dispatch('player/initpreviousEpisode')"
    >previous</button>
    <button
      v-if="$store.getters['player/nextEpisode']"
      @click="$store.dispatch('player/initNextEpisode')"
    >Next</button>
  </div>
</template>

<script>
export default {
  name: "player-controls"
};
</script>
