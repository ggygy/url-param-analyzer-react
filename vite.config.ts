import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const target = process.env.VITE_TARGET || 'main';
  
  return {
    plugins: [react({
      tsDecorators: true,
    })],
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCase'
      }
    },
    server: {
      watch: {
        usePolling: true,
        interval: 500
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      sourcemap: mode === 'development',
      rollupOptions: {
        input: target === 'main' 
          ? { main: resolve(__dirname, 'index.html') }
          : {
              background: resolve(__dirname, 'src/background/background.ts'),
              contentScript: resolve(__dirname, 'src/background/contentScript.tsx')
            },
        output: {
          sourcemapFileNames: '[name].js.map',
          entryFileNames: (chunkInfo) => {
            if (target !== 'main' || chunkInfo.name === 'background' || chunkInfo.name === 'contentScript') {
              return '[name].js';
            }
            return 'assets/[name].[hash].js';
          },
          chunkFileNames: () => {
            if (target === 'main') {
              return 'assets/[name]-[hash].js';
            }
            return '[name]-[hash].js';
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              if (target !== 'main') {
                return '[name].css';
              }
              return 'assets/[name].[hash].[ext]';
            }
            return 'assets/[name].[ext]';
          }
        },
        preserveEntrySignatures: 'strict'
      },
      cssCodeSplit: true,
      minify: mode === 'production',
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.ts': 'ts',
          '.tsx': 'tsx'
        }
      },
      force: true  // 强制依赖预构建
    },
    esbuild: {
      legalComments: 'none'  // 移除注释
    },
  }
});