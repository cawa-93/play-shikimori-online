// import devtools from '@vue/devtools'
// if (process.env.NODE_ENV === 'development') {
//   devtools.connect(/* host, port */)
// }

import Vue from 'vue';
import store from './store/index.js'
import router from './router';
import VueAnalytics from 'vue-analytics'
import Vuetify from 'vuetify'
import ru from 'vuetify/es5/locale/ru'


import Root from './root.vue'

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
    enabled: process.env.NODE_ENV === 'development',
    sendHitTask: process.env.NODE_ENV === 'production',

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


/**
 * Настройки темы
 */

const mq = window.matchMedia('(prefers-color-scheme: light)')

mq.addEventListener('change', (e) => {
  app.$vuetify.theme.dark = !e.matches
  document.querySelector('html').style.background = e.matches ? '#fafafa' : '#303030';
})

document.querySelector('html').style.background = mq.matches ? '#fafafa' : '#303030';

const app = new Vue({
  render: h => h(Root),
  store,
  router,
  vuetify: new Vuetify({
    lang: {
      locale: { ru },
      current: 'ru'
    },
    theme: {
      // Используется именно конструкция !light чтобы по умолчанию была темная тема
      // light === false когда в системе темная тема
      // light === false когда браузер не поддерживает настройки темы
      dark: !mq.matches,
    },
  })
}).$mount('root')

