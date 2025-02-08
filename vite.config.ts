import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  // 根据环境变量判断是构建 contentScript 还是主应用
  const isContentScript = process.env.VITE_TARGET === 'content';
  
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
      // 始终为开发模式启用 sourcemap
      sourcemap: mode === 'development',
      rollupOptions: {
        input: isContentScript 
          ? { contentScript: './src/background/contentScript.tsx' }
          : { main: './index.html' } as Record<string, string>,
        output: {
          // 确保 sourcemap 配置对 contentScript 生效
          sourcemapFileNames: '[name].js.map', // 指定 sourcemap 文件名格式
          sourcemap: mode === 'development' ? 'inline' : false, // 开发模式使用 inline sourcemap
          entryFileNames: () => {
            // content script 相关文件输出到根目录
            if (isContentScript) {
              return '[name].js';
            }
            return 'assets/[name].[hash].js';
          },
          chunkFileNames: () => {
            if (isContentScript) {
              return '[name].js';
            }
            return 'assets/[name]-[hash].js';
          },
          assetFileNames: (assetInfo) => {
            // CSS 文件特殊处理
            if (assetInfo.name?.endsWith('.css')) {
              return isContentScript ? 'contentScript.css' : 'assets/[name].[hash].[ext]';
            }
            return 'assets/[name].[ext]';
          }
        },
        preserveEntrySignatures: 'strict'
      },
      // 确保 CSS 被分离出来
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