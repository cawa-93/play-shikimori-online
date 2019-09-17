const permissions = [
    'webRequest',
    'webRequestBlocking',
    'storage',
    'tabs',
]

const origins = [
    'https://shikimori.one/*',
    'https://smotret-anime-365.ru/*',
    'https://api.jikan.moe/*',
]

const manifest = {
    manifest_version: 2,

    name: '__MSG_extName__',

    default_locale: 'ru',

    homepage_url: 'https://t.me/playshikionline',

    icons: {
        '192': 'play.png',
        '128': 'play-128.png',
    },

    minimum_chrome_version: '73',

    incognito: 'split',

    browser_action: {
        default_title: 'Открыть историю просмотров',
    },

    background: {
        page: 'background.html',
        persistent: true,
    },

    'options_ui': {
        'page': 'player.html#/options',
        'open_in_tab': false,
    },

    content_security_policy: `script-src 'self' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://tagmanager.google.com; object-src 'self'`,

    web_accessible_resources: [
        '*',
        'anime365-player-events.js',
    ],

    permissions: [
        ...permissions,
        ...origins,
    ],

    content_scripts: [
        {
            matches: [
                'https://shikimori.org/*',
                'https://shikimori.one/*',
            ],
            js: [
                'shikimori-watch-button.js',
            ],
            run_at: 'document_idle',
        },
        {
            matches: [
                'https://smotret-anime-365.ru/translations/embed/*',
                'https://hentai365.ru/translations/embed/*',
            ],
            js: [
                'anime-365-inject.js',
            ],
            css: [
                'css/anime-365-player.css',
            ],
            run_at: 'document_end',
            all_frames: true,
        },
        // 	{
        // 		matches: [
        // 			'https://myanimelist.net/anime/*',
        // 		],
        // 		js: [
        // 			'watch-button-myanime-list.js',
        // 		],
        // 		run_at: 'document_end',
        // 	},
    ],
}

if (process.env.BROWSER === 'firefox') {

    manifest.browser_specific_settings = {
        gecko: {
            id: process.env.FIREFOX_EXTENSION_ID,
            strict_min_version: '67.0',
        },
    }

    manifest.incognito = 'spanning'

}

module.exports = {
    default: manifest,
    permissions,
    origins,
}
