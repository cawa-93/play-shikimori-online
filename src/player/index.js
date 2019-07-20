// import devtools from '@vue/devtools'
// if (process.env.NODE_ENV === 'development') {
//   devtools.connect(/* host, port */)
// }

import Vue from 'vue';
import Vuetify from 'vuetify'
import store from './store/index.js'
import App from './components/App.vue';
import VueAnalytics from 'vue-analytics'

import workerpool from 'workerpool'

window.pool = workerpool.pool()

{
  const params = (new URL(location.href)).searchParams
  window.config = {
    anime: parseInt(params.get('anime')),
    episode: parseFloat(params.get('episode')),
  }
}

Vue.use(Vuetify)
Vue.use(VueAnalytics, {
  id: 'UA-71609511-7',
  autoTracking: {
    pageviewOnLoad: false,
    exception: process.env.NODE_ENV === 'production',
    exceptionLogs: process.env.NODE_ENV === 'development'
  },
  set: [
    { field: 'checkProtocolTask', value: function () { } },
    { field: 'dimension1', value: chrome.runtime.getManifest().version },
  ],
  debug: {
    enabled: false //process.env.NODE_ENV === 'development'
  },

  commands: {
    trackView() {
      /** @type {anime365.Translation} */
      const currentTranslation = this.$store.state.player.currentTranslation
      this.$ga.set('dimension2', currentTranslation.typeKind)
      this.$ga.page({
        page: `/player/series/${currentTranslation.seriesId}`,
        title: currentTranslation.title
      })
    },
    trackVideoControls(action, label) {
      this.$ga.event('player-controls', action, label)
    },
    trackAction(action) {
      this.$ga.event('actions', action)
    }
  }
})

const app = new Vue({
  render: h => h(App),
  store,
});

app.$mount('app');