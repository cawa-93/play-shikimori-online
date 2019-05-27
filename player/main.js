
import Vue from './vue.esm.browser.js'
import store from './store/index.js'

import episodeList from './components/episodeList.js'
import translationList from './components/translationList.js'
import player from './components/player.js'
import playerControls from './components/player-controls.js'

new Vue({
  el: '#app',
  store,
  components: {
    episodeList,
    translationList,
    player,
    playerControls
  },

  computed: {
    translations() {
      if (!this.$store.getters['player/currentEpisode'] || !this.$store.getters['player/currentEpisode'].translations) {
        return []
      }
      return this.$store.getters['player/currentEpisode'].translations
    },
  },

  mounted() {
    this.$store.dispatch('player/initSeries', (new URL(location.href)).searchParams.get('series'))
  }
})