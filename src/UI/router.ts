import FooterTemplate from '@/UI/views/FooterView.vue';
import History from '@/UI/views/History.vue';
import Options from '@/UI/views/Options.vue';
import Player from '@/UI/views/Player.vue';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/', component: FooterTemplate,
            children: [
                {name: 'player', path: 'player/anime/:anime/:episode?', component: Player},
                {name: 'history', path: 'history', component: History},

                {path: '', redirect: '/history'},
            ],
        },
        {name: 'options', path: '/options', component: Options},
        {path: '/player/anime', redirect: '/history'},
        {path: '/player', redirect: '/history'},
    ],
});
