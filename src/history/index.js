// import devtools from '@vue/devtools'
// if (process.env.NODE_ENV === 'development') {
//   devtools.connect(/* host, port */)
// }

import Vue from 'vue';
import Vuetify from 'vuetify'
import App from './components/App.vue';
import VueAnalytics from 'vue-analytics'

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
})

const app = new Vue({
  render: h => h(App),
});

app.$mount('app');