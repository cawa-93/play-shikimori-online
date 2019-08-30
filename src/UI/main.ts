import '@mdi/font/css/materialdesignicons.css';
// @ts-ignore
// import devtools from '@vue/devtools';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import './tagmanager.js';

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


/**
 * Отслеживание ошибок в интерфейсе
 */
if (process.env.NODE_ENV !== 'development') {
    Promise.all([
        import('@sentry/browser'),
        import('@sentry/integrations'),
    ]).then(([Sentry, Integrations]) => {

        Sentry.init({
            dsn: process.env.VUE_APP_SENTRY_DSN,
            integrations: [new Integrations.Vue({Vue, attachProps: true})],
        });

        // @ts-ignore
        self.Sentry = Sentry;
    });
}
