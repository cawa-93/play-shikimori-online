import Vue from 'vue';
import VueRouter from 'vue-router';
import History from '../views/History.vue';
import Player from '@/views/Player.vue';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'history',
    component: History,
  },
  //
  // {
  //   path: '/',
  //   name: 'history',
  //   component: () => import(/* webpackChunkName: "history" */'@/views/History.vue'),
  // },
  {
    path: '/player/:seriesId/:episodeId?/:translationId?',
    name: 'player',


    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
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
