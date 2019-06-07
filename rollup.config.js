import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy'
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import replace from 'rollup-plugin-replace'



module.exports = [{
  input: 'src/background/background.js',
  output: {
    file: 'dist/background/background.js',
    format: 'esm',
    // sourcemap: 'inline'
  },
  plugins: [
    resolve(),
    copy({
      targets: {
        'src/manifest.json': 'dist/manifest.json',
        'src/icons/play.png': 'dist/icons/play.png',
        'src/icons/play-128.png': 'dist/icons/play-128.png',
        'src/icons/pause.png': 'dist/icons/pause.png',
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
    copy({
      targets: {
        'src/content-scripts/inject-content-scripts.js': 'dist/content-scripts/inject-content-scripts.js',
        'src/content-scripts/anime365-player-styles.css': 'dist/content-scripts/anime365-player-styles.css'
      }
    })
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
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': JSON.stringify('browser')
    }),
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
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': JSON.stringify('browser')
    }),
  ],
}]