export default {
  name: 'episode-list',

  template: `<section class="episode-list">
  <ul v-if="episodes" class="">
    <li v-for="episode in episodes" :key="episode.id" class="">
      <a href="#" @click.prevent="setEpisode(episode)">
        {{episode.episodeTitle || episode.episodeFull}}
      </a>
    </li>
  </ul>
  
  </section>`,


  computed: {
    episodes() {
      return this.$store.getters['player/episodes']
    },

    currentEpisode() {
      return this.$store.getters['player/currentEpisode']
    },
  },


  methods: {
    async setEpisode(episode) {
      await this.$store.dispatch('player/setCurrentEpisode', episode.id)
    }
  }


}