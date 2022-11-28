const CracoSwcPlugin = require('craco-swc')
const CracoLessPlugin = require('craco-less')
// const CracoEsbuildPlugin = require('craco-esbuild')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  plugins: [
    // {
    //   plugin: CracoEsbuildPlugin,
    //   options: {
    //     esbuildLoaderOptions: {
    //       loader: 'jsx', // Set the value to 'tsx' if you use typescript
    //       target: 'es5'
    //     },
    //     esbuildMinimizerOptions: {
    //       // Optional. Defaults to:
    //       target: 'es5',
    //       css: true // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
    //     },
    //     skipEsbuildJest: false, // Optional. Set to true if you want to use babel for jest tests,
    //     esbuildJestOptions: {
    //       loaders: {
    //         '.ts': 'ts',
    //         '.tsx': 'tsx'
    //       }
    //     }
    //   }
    // },
    {
      plugin: {
        ...CracoSwcPlugin,
        // overrideCracoConfig: ({ cracoConfig }) => {
        //   if (typeof cracoConfig.eslint.enable !== 'undefined') {
        //     cracoConfig.disableEslint = !cracoConfig.eslint.enable
        //   }
        //   delete cracoConfig.eslint
        //   return cracoConfig
        // },
        overrideWebpackConfig: ({ webpackConfig, cracoConfig }) => {
          if (typeof cracoConfig.disableEslint !== 'undefined' && cracoConfig.disableEslint === true) {
            webpackConfig.plugins = webpackConfig.plugins.filter(
              (instance) => instance.constructor.name !== 'ESLintWebpackPlugin'
            )
          }
          return webpackConfig
        }
      },
      options: {
        swcLoaderOptions: {
          jsc: {
            externalHelpers: true,
            target: 'es5',
            parser: {
              syntax: 'typescript',
              tsx: true,
              dynamicImport: true,
              exportDefaultFrom: true
            }
          }
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
