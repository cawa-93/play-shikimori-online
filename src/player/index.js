import Vue from 'vue';
import store from './store/index.js'
import App from './components/App.vue';

const app = new Vue({
  render: h => h(App),
  store
});

app.$mount('app');