import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ru from 'vuetify/src/locale/ru';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
      locales: { ru },
      current: 'ru',
    },
});
