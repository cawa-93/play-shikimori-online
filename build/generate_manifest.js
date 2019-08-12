const fs = require('fs')
const package = JSON.parse(fs.readFileSync('./package.json'))
const browser = process.env.BROWSER ? process.env.BROWSER : 'chrome'

const manimest = {
	manifest_version: 2,

	name: '__MSG_extName__',
	description: package.description,
	version: package.version,

	default_locale: 'ru',

	homepage_url: 'https://shikimori.one/clubs/2372',
	author: package.author,
	icons: {
		'192': 'icons/play.png',
		'128': 'icons/play-128.png',
	},

	minimum_chrome_version: '73',

	incognito: 'split',

	browser_action: {
		default_title: 'Открыть историю просмотров',
	},

	background: {
		scripts: [
			'background/background.js',
		],
		persistent: true,
	},

	content_security_policy: 'script-src \'self\' \'unsafe-eval\' https://ssl.google-analytics.com https://www.google-analytics.com; object-src \'self\'',


	web_accessible_resources: [
		'UI/*',
		'content-scripts/anime365-player-events.js',
	],


	content_scripts: [
		{
			matches: [
				'https://shikimori.org/*',
				'https://shikimori.one/*',
			],
			js: [
				'content-scripts/watch-button.js',
			],
			run_at: 'document_idle',
		}, {
			matches: [
				'https://smotretanime.ru/translations/embed/*',
				'https://smotret-anime-365.ru/translations/embed/*',
				'https://hentai365.ru/translations/embed/*',
			],
			js: [
				'content-scripts/inject-content-scripts.js',
			],
			css: [
				'content-scripts/anime365-player-styles.css',
			],
			run_at: 'document_end',
			all_frames: true,
		}, {
			matches: [
				'https://myanimelist.net/anime/*',
			],
			js: [
				'content-scripts/myanimelist.js',
			],
			css: [
				'content-scripts/myanimelist.css',
			],
			run_at: 'document_end',
		},
	],
	permissions: [
		'https://shikimori.one/*',
		'https://shikimori.org/*',
		'https://smotretanime.ru/*',
		'https://smotret-anime-365.ru/*',
		'https://api.jikan.moe/*',
		'webRequest',
		'webRequestBlocking',
		'storage',
		'tabs',
	],
}


if (browser === 'firefox') {

	manimest.browser_specific_settings = {
		gecko: {
			id: process.env.FIREFOX_EXTENSION_ID,
			strict_min_version: '67.0',
		},
	}

	manimest.incognito = 'spanning'

}


fs.writeFileSync(`dist/${browser}/manifest.json`, JSON.stringify(manimest), {flag: 'w+'})