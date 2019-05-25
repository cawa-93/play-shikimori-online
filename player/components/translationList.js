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
      <li>
        <label for="typeKind-voiceRu">Озвучка</label>
        <input type="radio" name="typeKind" v-model="filters.type" value="voiceRu" id="typeKind-voiceRu">
      </li>

      <li>
        <label for="typeKind-subRu">Русские Субтиитры</label>
        <input type="radio" name="typeKind" v-model="filters.type" value="subRu" id="typeKind-subRu">
      </li>

      <li>
        <label for="typeKind-subEn">Английские Субтиитры</label>
        <input type="radio" name="typeKind" v-model="filters.type" value="subEn" id="typeKind-subEn">
      </li>
      <li>
        <label for="typeKind-subJa">Японские Субтиитры</label>
        <input type="radio" name="typeKind" v-model="filters.type" value="subJa" id="typeKind-subJa">
      </li>
      <li>
        <label for="typeKind-raw">Оригинал</label>
        <input type="radio" name="typeKind" v-model="filters.type" value="raw" id="typeKind-raw">
      </li>
    </ul>


    <ul>
      <li v-for="translation in filteredTranslations" :key="translation.id">
      {{translation.type}}
        <a :href="translation.url">{{translation.authorsSummary || 'Неизвестный'}}</a>
      </li>
    </ul>

  
  </section>`,

  data() {
    return {
      filters: {
        type: 'voiceRu',
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
        .filter(translation => translation.type === this.filters.type)
    }
  },

  methods: {
  }


}