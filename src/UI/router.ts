import History from '@/UI/views/History.vue';
import Player from '@/UI/views/Player.vue';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {name: 'player', path: '/player/anime/:anime/:episode?', component: Player},
        {name: 'history', path: '/history', component: History},
        {path: '/player/anime', redirect: '/history'},
        {path: '/player', redirect: '/history'},
        {path: '/', redirect: '/history'},
    ],
});
