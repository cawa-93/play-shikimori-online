import '@mdi/font/css/materialdesignicons.css';
// @ts-ignore
// import devtools from '@vue/devtools';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

// if (process.env.NODE_ENV === 'development') {
//     devtools.connect(/* host, port */);
// }

Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.config.performance = process.env.NODE_ENV === 'development';

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');

