import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import macrosPlugin from 'vite-plugin-babel-macros'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import requireTransform from 'vite-plugin-require-transform'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), macrosPlugin(), nodePolyfills(), wasm(), topLevelAwait(), requireTransform({})],
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
