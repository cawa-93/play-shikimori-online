import Vue from 'vue';
import Vuetify from 'vuetify'
import store from './store/index.js'
import App from './components/App.vue';

Vue.use(Vuetify)

const app = new Vue({
  render: h => h(App),
  store
});

app.$mount('app');