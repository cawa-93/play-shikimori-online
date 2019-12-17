module.exports = {
  'transpileDependencies': [
    'vuetify',
  ],

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
          target: 'dmg',
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
