const CracoEsbuildPlugin = require('craco-esbuild')
const CracoLessPlugin = require('craco-less')
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const isDevelopment = process.env.NODE_ENV !== 'production'
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
  babel: {
    plugins: ['babel-plugin-styled-components']
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensions.push('.tsx', '.ts', '.js', '.jsx', '.cjs', '.mjs', '.json')

      // ---- WASM ----
      const wasmExtensionRegExp = /\.wasm$/
      webpackConfig.resolve.extensions.push('.wasm')

      webpackConfig.experiments = {
        asyncWebAssembly: true,
        syncWebAssembly: true
        // topLevelAwait: true,
        // layers:true,
        // outputModule:true
      }
      webpackConfig.module.rules.forEach((rule) => {
        ;(rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.type === 'asset/resource') {
            oneOf.exclude.push(wasmExtensionRegExp)
          }
        })
      })
      // JS/MJS loading
      webpackConfig.module.rules.push(
        {
          test: /\.m?js/i,
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.js$/i,
          enforce: 'pre',
          use: ['source-map-loader']
        }
      )
      // POLYFILLS
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser'
        }),
        new webpack.ProvidePlugin({
          // you must `npm install buffer` to use this.
          Buffer: ['buffer', 'Buffer']
        })
      )
      if (isDevelopment) {
        webpackConfig.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: true }))
      }
      // SOURCEMAP warning removal for older packages
      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          )
        },
        /Failed to parse source map/
      ]
      webpackConfig.snapshot = {
        managedPaths: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'openbook-package'),
          path.resolve(__dirname, 'wasm'),
          path.resolve(__dirname, 'perps-wasm')
        ]
      }
      // CHUNKING - optimizing our builds
      webpackConfig.optimization = {
        usedExports: true,
        sideEffects: false,
        minimize: true,
        minimizer: [new TerserPlugin()],
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'async',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          automaticNameDelimiter: '~',
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
              chunks: 'initial',
              name: 'common_app',
              minSize: 0,
              minChunks: 4
            },
            default: {
              minChunks: 4,
              priority: -30,
              reuseExistingChunk: true,
              name: 'default_main'
            }
          }
        }
      }

      //webpackConfig.resolve.modules = [path.resolve("./src"), 'node_modules']

      // TODO: determine if below would be possibly better when building for prod
      // webpackConfig.output = {
      //   filename: '[name].bundle.js',
      //   chunkFilename: '[id].[contenthash].js',
      //   path: path.resolve(__dirname, 'build'),
      //   clean:true,
      //   asyncChunks:true,
      // }

      // sourcemapping
      webpackConfig.devtool = 'source-map'
      // WEBPACK 5 POLYFILL
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

      return webpackConfig
    },
    plugins: []
  }
}
