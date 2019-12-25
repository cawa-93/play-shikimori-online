module.exports = {
  'transpileDependencies': [
    'vuetify',
  ],
  pwa: {
    workboxOptions: {
      importWorkboxFrom: 'local',
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https:\/\/smotret-anime\.online\/api\/series'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'anime365-series-cache',
            expiration: {
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
            },
            matchOptions: {
              ignoreSearch: false,
            },
          },
        },
      ],
    },
  },

  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'Аниме Центр',

        win: {
          target: [
            {
              target: 'nsis',
              arch: [
                'x64',
                'ia32',
              ],
            },
          ],
        },

        nsis: {
          deleteAppDataOnUninstall: true,
        },

        mac: {
          darkModeSupport: true,
          electronLanguages: 'ru',
          category: 'public.app-category.video',

          hardenedRuntime: true,
          entitlements: 'build/entitlements.mac.plist',
          entitlementsInherit: 'build/entitlements.mac.plist',
        },

        dmg: {
          sign: false,
        },

        linux: {
          category: 'Video',
        },
      },
    },
  },
};
