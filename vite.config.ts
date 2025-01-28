import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
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
      rollupOptions: {
        input: {
          main: './index.html'
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      },
      sourcemap: mode === 'development',
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