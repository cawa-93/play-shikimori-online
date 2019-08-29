const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const baseManifest = require('./src/manifest.js').default
const pkg = require('./package.json')
process.env.BROWSER = process.env.BROWSER || 'chrome'


module.exports = {

    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.hotReload = false
                options.fix = true
                return options
            })

        // config.module
        // 	.rule('worker')
        // 	.test(/worker\.js$/)
        // 	.use('worker-loader')
        // 	.loader('worker-loader')
        // 	.end()

        config.optimization.delete('splitChunks')
    },


    filenameHashing: false,

    pages: {
        player: {
            entry: './src/UI/main.ts',
            template: './src/UI/index.html',
        },

        background: {
            entry: './src/background/background.ts',
            template: './src/background/index.html',
        },
    },

    lintOnSave: 'error',

    outputDir: `./dist/${process.env.BROWSER}`,

    configureWebpack: {
        devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',

        performance: {
            maxEntrypointSize: 2048000,
            maxAssetSize: 2048000,
        },

        entry: {
            'shikimori-watch-button': './src/content-scripts/shikimori-watch-button.ts',
            // 'watch-button-myanime-list': './src/content-scripts/myanimelist.ts',
            'anime-365-inject': './src/content-scripts/inject-content-scripts.ts',
            'anime-365-player': './src/content-scripts/anime365-player-events.ts',
        },

        output: {
            filename: '[name].js',
            chunkFilename: '[name].js',
        },

        plugins: [
            new WebpackExtensionManifestPlugin({
                config: {
                    base: baseManifest,
                    extend: {
                        description: pkg.description,
                        version: pkg.version,
                        author: pkg.author,
                    },
                },
            }),
            new CopyPlugin([
                {from: './src/_locales', to: '_locales'},
            ]),
        ],
    },


    css: {
        extract: false,
    },
}
