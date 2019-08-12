// import devtools from '@vue/devtools'
// if (process.env.NODE_ENV === 'development') {
//   devtools.connect(/* host, port */)
// }

import * as Sentry       from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Vue               from 'vue'
import VueAnalytics      from 'vue-analytics'
import Vuetify           from 'vuetify'
import ru                from 'vuetify/es5/locale/ru'

import Root   from './root.vue'
import router from './router'
import store  from './store/index.js'


window.Sentry = Sentry
Sentry.init({
	dsn: process.env.SENTRY_DSN,
	release: `${chrome.runtime.getManifest().name}@${chrome.runtime.getManifest().version}`,
	environment: process.env.NODE_ENV || 'dev',
	integrations: [new Integrations.Vue({Vue, attachProps: true})],
})


Vue.use(Vuetify)
Vue.use(VueAnalytics, {
	id: 'UA-71609511-7',
	autoTracking: {
		pageviewOnLoad: false,
		exception: process.env.NODE_ENV === 'production',
		exceptionLogs: process.env.NODE_ENV === 'development',
	},
	set: [
		{
			field: 'checkProtocolTask', value: function () {
			},
		},
		{field: 'dimension1', value: chrome.runtime.getManifest().version},
	],
	debug: {
		enabled: false, // process.env.NODE_ENV === 'development',
		sendHitTask: process.env.NODE_ENV === 'production',

	},

	commands: {
		trackView() {
			/** @type {anime365.Translation} */
			const currentTranslation = this.$store.state.player.currentTranslation
			this.$ga.set('dimension2', currentTranslation.typeKind)
			this.$ga.page({
				page: `/player/series/${currentTranslation.seriesId}`,
				title: currentTranslation.title,
			})
		},
		trackVideoControls(action, label) {
			this.$ga.event('player-controls', action, label)
		},
		trackAction(action) {
			this.$ga.event('actions', action)
		},
	},
})


/**
 * Настройки темы
 */
const savedTheme = localStorage.getItem('theme') || 'dark'

const app = new Vue({
	render: h => h(Root),
	store,
	router,
	vuetify: new Vuetify({
		lang: {
			locale: {ru},
			current: 'ru',
		},
		theme: {
			// Используется именно конструкция !light чтобы по умолчанию была темная тема
			// light === false когда в системе темная тема
			// light === false когда браузер не поддерживает настройки темы
			dark: savedTheme === 'dark',
		},
	}),
}).$mount('root')

document.querySelector('html').style.background = app.$vuetify.theme.dark ? '#303030' : '#fafafa'
