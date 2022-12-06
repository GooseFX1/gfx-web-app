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

      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: path.resolve(__dirname, 'node_modules'),
        type: 'javascript/auto'
      })

      return webpackConfig
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /@ledgerhq\/devices\/hid-framing/,
        '@ledgerhq/devices/lib/hid-framing'
      )
    ]
  }
}
