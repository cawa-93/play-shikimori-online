{/* <ul v-if="series && series.episodes" class="">
<li v-for="episode in series.episodes" :key="episode.id" class="">
  <a href="#" @click.prevent="setEpisode(episode)">
    <i class="mdl-list__item-icon">{{episode.episodeInt}}</i>
    {{episode.episodeTitle || episode.episodeFull}}
  </a>
</li>
</ul> */}


export default {
  name: 'translation-list',

  template: `<section class="translation-list" v-if="translations && translations.length">


    <ul>
      <li v-for="translation in translations" :key="translation.id">
      {{translation}}
        <a :href="translation.url">{{translation.authorsSummary}}</a>
      </li>
    </ul>

  
  </section>`,

  computed: {
    translations() {
      if (!this.$store.getters['player/currentEpisode'] || !this.$store.getters['player/currentEpisode'].translations) {
        return []
      }
      return this.$store.getters['player/currentEpisode'].translations
    }
  },

  methods: {
  }


}