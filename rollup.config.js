import dotenv from 'dotenv';
dotenv.config()
import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy'
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import replace from 'rollup-plugin-replace'

const replaceEnv = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  'process.env.VUE_ENV': JSON.stringify('browser'),

  'process.env.SHIKIMORI_CLIENT_ID': JSON.stringify(process.env.SHIKIMORI_CLIENT_ID),
  'process.env.SHIKIMORI_CLIENT_SECRET': JSON.stringify(process.env.SHIKIMORI_CLIENT_SECRET),
  'process.env.SHIKIMORI_REDIRECT_URI': JSON.stringify(process.env.SHIKIMORI_REDIRECT_URI),
  'process.env.SHIKIMORI_SYSTEM_TOKEN': JSON.stringify(process.env.SHIKIMORI_SYSTEM_TOKEN),
}

const browser = process.env.BROWSER ? process.env.BROWSER : 'chrome'

const path = {
  src: 'src',
  dist: `dist/${browser}`
}

module.exports = [{
  input: `${path.src}/background/background.js`,
  output: {
    file: `${path.dist}/background/background.js`,
    format: `esm`,
    // sourcemap: process.env.NODE_ENV === `development`
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
    commonjs(),
    copy({
      targets: {
        [`${path.src}/manifest.json`]: `${path.dist}/manifest.json`,
        // `${path.src}/icons/play-128.png`: `${path.dist}/icons/play-128.png`,
        // `${path.src}/icons/pause.png`: `${path.dist}/icons/pause.png`,
      }
    })
  ]
},

{
  input: `${path.src}/content-scripts/anime365-player-events.js`,
  output: {
    file: `${path.dist}/content-scripts/anime365-player-events.js`,
    format: `esm`,
    // sourcemap: process.env.NODE_ENV === `development`
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
    copy({
      targets: {
        [`${path.src}/content-scripts/anime365-player-styles.css`]: `${path.dist}/content-scripts/anime365-player-styles.css`
      }
    })
  ]
},

{
  input: `${path.src}/content-scripts/myanimelist.js`,
  output: {
    file: `${path.dist}/content-scripts/myanimelist.js`,
    format: `esm`,
    // sourcemap: process.env.NODE_ENV === `development`
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
    copy({
      targets: {
        [`${path.src}/content-scripts/myanimelist.css`]: `${path.dist}/content-scripts/myanimelist.css`
      }
    })
  ]
},

{
  input: `${path.src}/content-scripts/inject-content-scripts.js`,
  output: {
    file: `${path.dist}/content-scripts/inject-content-scripts.js`,
    format: `esm`,
    // sourcemap: process.env.NODE_ENV === `development`
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
  ]
},

{
  input: `${path.src}/content-scripts/watch-button.js`,
  output: {
    file: `${path.dist}/content-scripts/watch-button.js`,
    format: `esm`,
    // sourcemap: process.env.NODE_ENV === `development`
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
  ]
},


{
  input: `${path.src}/player/index.js`,
  output: {
    file: `${path.dist}/player/bundle.js`,
    format: `esm`,
    // sourcemap: process.env.NODE_ENV === `development`
  },
  plugins: [
    resolve(),
    commonjs(),
    replace(replaceEnv),
    VuePlugin(),
    copy({
      targets: {
        [`${path.src}/fonts`]: `${path.dist}/fonts`,
        [`${path.src}/player/index.html`]: `${path.dist}/player/index.html`,
        [`node_modules/material-design-icons/iconfont`]: `${path.dist}/fonts/iconfont`,
        [`node_modules/vuetify/${path.dist}/vuetify.min.css`]: `${path.dist}/vuetify.min.css`,
        [`${path.src}/icons`]: `${path.dist}/icons`,
      }
    })
  ],
},

{
  input: `${path.src}/player/worker.js`,
  output: {
    file: `${path.dist}/player/worker.js`,
    format: `esm`,
    // sourcemap: process.env.NODE_ENV === `development`
  },
  plugins: [
    resolve(),
    commonjs(),
    replace(replaceEnv),
  ],
},

{
  input: `${path.src}/history/index.js`,
  output: {
    file: `${path.dist}/history/bundle.js`,
    format: `esm`,
    // sourcemap: process.env.NODE_ENV === `development`
  },
  plugins: [
    resolve(),
    commonjs(),
    replace(replaceEnv),
    VuePlugin(),
    copy({
      targets: {
        [`${path.src}/history/index.html`]: `${path.dist}/history/index.html`,
      }
    })
  ],
},

]