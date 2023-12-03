import { defineConfig } from 'vite'
// port over to plugin-react-swc once we no longer need babel
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import macrosPlugin from 'vite-plugin-babel-macros'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import requireTransform from 'vite-plugin-require-transform'
import viteCompression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros', 'babel-plugin-styled-components']
      }
    }),
    eslint(),
    macrosPlugin(),
    nodePolyfills(),
    wasm(),
    topLevelAwait(),
    requireTransform({}),
    ViteImageOptimizer({
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false // https://github.com/svg/svgo/issues/1128
              },
              cleanupIDs: {
                minify: false,
                remove: false
              },
              convertPathData: false
            }
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }]
            }
          }
        ]
      },
      png: {
        // https://sharp.pixelplumbing.com/api-output#png
        quality: 90
      },
      jpeg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 80
      },
      jpg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 80
      },
      tiff: {
        // https://sharp.pixelplumbing.com/api-output#tiff
        quality: 80
      }
    }),
    viteCompression()
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 3000
  },
  esbuild: {
    drop: mode == 'development' ? [] : ['console', 'debugger'],
    pure: mode === 'production' ? ['console.log'] : []
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      transformMixedEsModules: true
    },
    minify: 'esbuild',
    cssMinify: 'esbuild',
    sourcemap: false,
    output: {
      cache: false,
      sourcemap: false,
      maxParallelFileOps: 1
    }
  }
}))
