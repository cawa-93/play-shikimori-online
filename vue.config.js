module.exports = {
  'transpileDependencies': [
    'vuetify',
  ],

  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'Аниме Центр',

        mac: {
          target: 'dmg',
          darkModeSupport: true,
          electronLanguages: 'ru',
          category: 'public.app-category.video',

          identity: null,
          hardenedRuntime: true,
          entitlements: 'build/entitlements.mac.plist',
          entitlementsInherit: 'build/entitlements.mac.plist',
        },

        linux: {
          target: [
            {target: 'apk'},
          ],
        },
      },
    },
  },
};
