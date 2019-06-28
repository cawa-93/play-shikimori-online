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

module.exports = [{
  input: 'src/background/background.js',
  output: {
    file: 'dist/background/background.js',
    format: 'esm',
    // sourcemap: 'inline'
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
    copy({
      targets: {
        'src/manifest.json': 'dist/manifest.json',
        'src/icons': 'dist/icons',
        // 'src/icons/play-128.png': 'dist/icons/play-128.png',
        // 'src/icons/pause.png': 'dist/icons/pause.png',
      }
    })
  ]
},

{
  input: 'src/content-scripts/anime365-player-events.js',
  output: {
    file: 'dist/content-scripts/anime365-player-events.js',
    format: 'esm',
    // sourcemap: 'inline'
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
    copy({
      targets: {
        'src/content-scripts/anime365-player-styles.css': 'dist/content-scripts/anime365-player-styles.css'
      }
    })
  ]
},

{
  input: 'src/content-scripts/inject-content-scripts.js',
  output: {
    file: 'dist/content-scripts/inject-content-scripts.js',
    format: 'esm',
    // sourcemap: 'inline'
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
  ]
},

{
  input: 'src/content-scripts/watch-button.js',
  output: {
    file: 'dist/content-scripts/watch-button.js',
    format: 'esm',
    // sourcemap: 'inline'
  },
  plugins: [
    resolve(),
    replace(replaceEnv),
  ]
},


{
  input: 'src/player/index.js',
  output: {
    file: 'dist/player/bundle.js',
    format: 'esm',
    // sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false
  },
  plugins: [
    resolve(),
    commonjs(),
    replace(replaceEnv),
    VuePlugin(),
    copy({
      targets: {
        'src/player/index.html': 'dist/player/index.html',
        'node_modules/vuetify/dist/vuetify.min.css': 'dist/player/vuetify.min.css',
      }
    })
  ],
},

{
  input: 'src/player/worker.js',
  output: {
    file: 'dist/player/worker.js',
    format: 'esm',
    // sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false
  },
  plugins: [
    resolve(),
    commonjs(),
    replace(replaceEnv),
  ],
}]