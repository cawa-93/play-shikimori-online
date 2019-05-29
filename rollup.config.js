import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy'
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import replace from 'rollup-plugin-replace'



module.exports = [{
  input: 'src/background/background.js',
  output: {
    file: 'dist/background/background.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    copy({
      targets: {
        'src/manifest.json': 'dist/manifest.json'
      }
    })
  ]
},

{
  input: 'src/content-scripts/player-events.js',
  output: {
    file: 'dist/content-scripts/player-events.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
  ]
},

{
  input: 'src/content-scripts/watch-button.js',
  output: {
    file: 'dist/content-scripts/watch-button.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
  ]
},


{
  input: 'src/player/index.js',
  output: {
    file: 'dist/player/bundle.js',
    format: 'esm'
  },
  plugins: [
    commonjs(),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': JSON.stringify('browser')
    }),
    VuePlugin(),
    copy({
      targets: {
        'src/player/index.html': 'dist/player/index.html'
      }
    })
  ],
}]