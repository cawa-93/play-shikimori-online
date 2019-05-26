export default {
  name: 'episode-list',

  template: `<section class="episode-list">
    <select v-if="episodes" v-model="currentEpisode">
      <option 
        v-for="episode in episodes"
        :key="episode.id"
        v-if="episode.isActive"
        :value="episode.id"
      >{{episode.episodeTitle || episode.episodeFull}}</option>
    </select>  
  </section>`,


  computed: {
    episodes() {
      return this.$store.getters['player/episodes']
    },

    currentEpisode: {
      get() {
        return this.$store.state.player.currentEpisodeID
      },

      set(id) {
        return this.$store.dispatch('player/setCurrentEpisode', id)
      }
    },
  },
}