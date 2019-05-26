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

    <select v-model="filters.type.value">
      <option v-for="option in filters.type.options" :key="option.value" :value="option.value">{{option.label}}</option>
    </select>

    <select v-model="currentTranslationID">
      <option
        v-for="translation in filteredTranslations" 
        :key="translation.id" 
        v-if="translation.isActive"
        :value="translation.id"
      >{{translation.authorsSummary || 'Неизвестный'}}</option>
    </select>
  
  </section>`,

  data() {
    return {
      filters: {
        type: {
          value: 'voiceRu',
          options: [
            { value: 'voiceRu', label: 'Озвучка' },
            { value: 'subRu', label: 'Русские Субтиитры' },
            { value: 'subEn', label: 'Английские Субтиитры' },
            { value: 'subJa', label: 'Японские Субтиитры' },
            { value: 'raw', label: 'Оригинал' },
          ]
        }
      }
    }
  },

  computed: {
    translations() {
      if (!this.$store.getters['player/currentEpisode'] || !this.$store.getters['player/currentEpisode'].translations) {
        return []
      }
      return this.$store.getters['player/currentEpisode'].translations
    },

    filteredTranslations() {
      return this.translations
        .filter(translation => translation.type === this.filters.type.value)
    },

    currentTranslationID: {
      get() {
        return this.$store.state.player.currentTranslationID
      },
      set(id) {
        const translation = this.filteredTranslations.find(translation => translation.id === id)
        this.$store.dispatch('player/setTranslation', translation)
      }
    }
  },
}