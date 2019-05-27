export default {
  name: 'user-list-controls',

  template: `<section>
    <button @click="markAsWached">{{text}}</button>
  </section>`,

  data() {
    return {
      text: 'Смотреть',
      shikimori: {
        animeId: null,
        userRate: null,
      }
    }
  },

  computed: {
    currentEpisodeInt() {
      return parseInt(this.$store.getters['player/currentEpisode'].episodeInt)
    }
  },

  methods: {
    async init() {
      const { data: series } = await api.anime365(`/series/${this.$store.getters['player/currentEpisode'].seriesId}`)
      const anime = await api.shikimori(`/animes/${series.myAnimeListId}`)

      this.shikimori.animeId = anime.id
      this.shikimori.userRate = anime.user_rate

      if (anime.user_rate && this.currentEpisodeInt <= anime.user_rate.episodes) {
        this.text = 'Просмотрено'
      } else {
        this.text = 'Смотреть'

      }

    },

    async markAsWached() {
      const url =
        this.shikimori.userRate
          ? `/v2/user_rates/${this.shikimori.userRate.id}?user_rate[target_type]=Anime&user_rate[episodes]=${this.currentEpisodeInt}&user_rate[status]=watching&user_rate[user_id]=${this.$store.state.user.UserInfo.id}`
          : `/v2/user_rates/?user_rate[target_type]=Anime&user_rate[episodes]=${this.currentEpisodeInt}&user_rate[status]=watching&user_rate[target_id]=${this.shikimori.animeId}&user_rate[user_id]=${this.$store.state.user.UserInfo.id}`

      const method = this.shikimori.userRate
        ? 'PATCH'
        : 'POST'

      const newUserRate = await api.shikimori(url, { method })

      this.shikimori.userRate = newUserRate

      this.$store.dispatch('player/initNextEpisode')
    }
  },

  watch: {
    currentEpisodeInt() {
      return this.init()
    },
  },


  async mounted() {
    this.init()
  }
}