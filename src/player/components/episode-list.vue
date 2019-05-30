<template>
  <section class="episode-list">
    <div class="mdc-select" v-if="episodes">
      <v-select
        item-text="episodeFull"
        item-value="id"
        :items="filteredEpisodes"
        box
        label="Епизод"
        v-model="currentEpisodeID"
      ></v-select>
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

    filteredEpisodes() {
      return this.episodes.filter(e => e.isActive);
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

  mounted() {
    let episodeInt = 1;
    if (this.$store.state.shikimori.anime.user_rate) {
      episodeInt = this.$store.state.shikimori.anime.user_rate.episodes + 1;
    }

    const episode = this.$store.getters["player/episodes"].find(
      episode => parseInt(episode.episodeInt) === episodeInt
    );
    console.log({
      episodeInt,
      episode,
      episodes: this.$store.getters["player/episodes"]
    });

    if (episode) {
      this.$store.dispatch("player/setCurrentEpisode", episode.id);
    }
  }
};
</script>

<style>
</style>