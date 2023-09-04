const CracoEsbuildPlugin = require('craco-esbuild')
const CracoLessPlugin = require('craco-less')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  plugins: [
    {
      plugin: {
        ...CracoEsbuildPlugin,

        overrideWebpackConfig: ({ webpackConfig, cracoConfig }) => {
          if (typeof cracoConfig.disableEslint !== 'undefined' && cracoConfig.disableEslint === true) {
            webpackConfig.plugins = webpackConfig.plugins.filter(
              (instance) => instance.constructor.name !== 'ESLintWebpackPlugin'
            )
          }
          return webpackConfig
        }
      }
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  webpack: {
    configure: (webpackConfig) => {
      const wasmExtensionRegExp = /\.wasm$/
      webpackConfig.resolve.extensions.push('.wasm')
      webpackConfig.resolve.extensions.push('.mjs')
      webpackConfig.module.rules.forEach((rule) => {
        ;(rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
            oneOf.exclude.push(wasmExtensionRegExp)
          }
        })
      })

      webpackConfig.module.rules.push({
        test: wasmExtensionRegExp,
        include: path.resolve(__dirname, 'src'),
        use: [{ loader: require.resolve('wasm-loader'), options: {} }]
      })

      webpackConfig.module.rules.push(
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader']
        }
      )

      webpackConfig.resolve.fallback = {
        zlib: require.resolve('browserify-zlib'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer/'),
        querystring: require.resolve('querystring-es3'),
        process: require.resolve('process/browser'),
        fs: false
      }
      webpackConfig.node = {
        // provides the global variable named "global"
        global: true,
        // provide __filename and __dirname global variables
        __filename: true,
        __dirname: true
      }
      webpackConfig.experiments = {
        asyncWebAssembly: true,
        layers: true,
        lazyCompilation: true,
        outputModule: true,
        syncWebAssembly: true,
        topLevelAwait: true
      }
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser'
        }),
        new webpack.ProvidePlugin({
          // you must `npm install buffer` to use this.
          Buffer: ['buffer', 'Buffer']
        })
      )
      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          )
        }
      ]
      webpackConfig.snapshot = {
        managedPaths: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'openbook-package'),
          path.resolve(__dirname, 'wasm'),
          path.resolve(__dirname, 'perps-wasm')
        ]
      }
      // webpackConfig.optimization = {
      //   sideEffects: true,
      //   splitChunks: {
      //     chunks: 'async',
      //     minSize: 200000,
      //     minRemainingSize: 0,
      //     minChunks: 1,
      //     maxAsyncRequests: 30,
      //     maxInitialRequests: 30,
      //     enforceSizeThreshold: 500000,
      //     cacheGroups: {
      //       defaultVendors: {
      //         test: /[\\/]node_modules[\\/]/,
      //         priority: -10,
      //         reuseExistingChunk: true,
      //       },
      //       openBookTs: {
      //         test: /[\\/]openbook-package[\\/]/,
      //         minChunks: 2,
      //         priority: -20,
      //         reuseExistingChunk: true,
      //       },
      //       wasm: {
      //         test: /[\\/]wasm[\\/]/,
      //         minChunks: 2,
      //         priority: -20,
      //         reuseExistingChunk: true,
      //       },
      //       perpsWasm: {
      //         test: /[\\/]perps-wasm[\\/]/,
      //         minChunks: 2,
      //         priority: -20,
      //         reuseExistingChunk: true,
      //       },
      //       default: {
      //         minChunks: 2,
      //         priority: -30,
      //         reuseExistingChunk: true,
      //       }
      //     }
      //   }
      // }
      //webpackConfig.devtool = 'source-map'
      webpackConfig.re
      return webpackConfig
    },
    plugins: []
  }
}
