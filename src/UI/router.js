import Vue       from 'vue'
import VueRouter from 'vue-router'
import History   from './pages/history.vue'

import Player from './pages/player.vue'


Vue.use(VueRouter)

export default new VueRouter({
	routes: [
		{name: 'history', path: '/history', component: History},
		{name: 'player', path: '/player/anime/:anime/:episode?', component: Player},
		{path: '/player/anime', redirect: '/history'},
		{path: '/player', redirect: '/history'},
		{path: '/', redirect: '/history'},
	],
})