import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ru from 'vuetify/src/locale/ru';

Vue.use(Vuetify);
const savedTheme = localStorage.getItem('theme') || 'dark';
export default new Vuetify({
    theme: {
        dark: savedTheme === 'dark',
    },
    lang: {
        locales: {ru},
        current: 'ru',
    },
    icons: {
        iconfont: 'mdi',
    },
});

document.querySelector('html')!.style.background = savedTheme === 'dark' ? '#303030' : '#fafafa';
