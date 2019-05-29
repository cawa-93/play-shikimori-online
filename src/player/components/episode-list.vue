<template>
  <section class="episode-list">
    <div class="mdc-select" v-if="episodes">
      <i class="mdc-select__dropdown-icon"></i>
      <select class="mdc-select__native-control" v-model="currentEpisodeID">
        <option value disabled selected>Выберите эпизод</option>
        <option
          v-for="episode in episodes"
          :key="episode.id"
          v-if="episode.isActive"
          :value="episode.id"
        >{{episode.episodeTitle || episode.episodeFull}}</option>
      </select>
      <label
        class="mdc-floating-label"
      >{{$store.getters['player/currentEpisode'].episodeTitle || $store.getters['player/currentEpisode'].episodeFull}}</label>
      <div class="mdc-line-ripple"></div>
    </div>
  </section>
</template>

<script>
export default {
  name: "episode-list",

  computed: {
    episodes() {
      return this.$store.getters["player/episodes"];
    },

    currentEpisodeID: {
      get() {
        return this.$store.state.player.currentEpisodeID;
      },

      set(id) {
        return this.$store.dispatch("player/setCurrentEpisode", id);
      }
    }
  },

  mounted() {}
};
</script>