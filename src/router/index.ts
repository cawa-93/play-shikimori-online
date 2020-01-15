import Vue from 'vue';
import VueRouter from 'vue-router';


const History = () => import(/* webpackChunkName: "HistoryView" */ '@/views/History.vue');
const Player = () => import(/* webpackChunkName: "PlayerView" */ '@/views/Player.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'history',
    component: History,
  },
  {
    path: '/player/:seriesId/:episodeId?/:translationId?',
    name: 'player',
    component: Player,
  },

  {path: '*', redirect: '/'},
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
});


export default router;


// TODO: DELETE AFTER DEBUG
if (process.env.NODE_ENV !== 'production') {
// @ts-ignore
  window.router = router;
}
