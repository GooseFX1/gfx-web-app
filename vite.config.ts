import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import macrosPlugin from 'vite-plugin-babel-macros'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import requireTransform from 'vite-plugin-require-transform'

import * as path from 'path'
import { cpus } from 'os'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    macrosPlugin(),
    nodePolyfills(),
    wasm(),
    topLevelAwait(),
    requireTransform({}),
    splitVendorChunkPlugin()
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
    sourcemap: mode === 'development',
    output: {
      cache: false,
      sourcemap: mode === 'development',
      preserveModule: true,
      maxParallelFileOps: Math.max(1, cpus().length - 1),
      manualChunks: (id) => {
        if (id.includes('node_modules')) return 'vendor'
        if (id.includes('openbook-package')) return 'openbook'
        if (id.includes('perps-wasm') || id.includes('wasm')) return 'wasm'
      },
      sourcemapIgnoreList: (relativeSourcePath) => {
        const normalizedPath = path.normalize(relativeSourcePath)
        return (
          normalizedPath.includes('node_modules') ||
          normalizedPath.includes('openbook-package') ||
          normalizedPath.includes('perps-wasm') ||
          normalizedPath.includes('wasm')
        )
      }
    }
  }
}))
