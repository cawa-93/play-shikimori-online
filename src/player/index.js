// import devtools from '@vue/devtools'
// if (process.env.NODE_ENV === 'development') {
//   devtools.connect(/* host, port */)
// }

import Vue from 'vue';
import Vuetify from 'vuetify'
import store from './store/index.js'
import App from './components/App.vue';
import VueAnalytics from 'vue-analytics'


Vue.use(Vuetify)

Vue.use(VueAnalytics, {
  id: 'UA-71609511-7',
  autoTracking: {
    pageviewOnLoad: false,
    exception: true,
    exceptionLogs: process.env.NODE_ENV === 'development'
  },
  set: [
    { field: 'checkProtocolTask', value: function () { } }
  ],
  debug: {
    enabled: process.env.NODE_ENV === 'development'
  },

  commands: {
    trackView() {
      const currentTranslation = this.$store.getters["player/currentTranslation"]
      this.$ga.page({
        page: `/player/series/${currentTranslation.seriesId}/episode/${currentTranslation.episodeId}/translation/${currentTranslation.id}`,
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