import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { defineConfig, loadEnv } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import htmlBuildTime from './vite-plugins/htmlBuildTime';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, 'env');
  const env = loadEnv(mode, envDir, '');

  return {
    envDir: 'env',
    plugins: [
      tailwindcss(),
      react(),
      nodePolyfills({
        include: ['path'],
      }),
      htmlBuildTime(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 9090,
      open: true,
      proxy: {
        '/api': {
          target: 'https://holiday-cn-worker.angelbeast.workers.dev',
          changeOrigin: true,
          secure: true,
          headers: {
            Origin: 'https://toolset.hanekawa.top',
          },
          agent: new HttpsProxyAgent('http://127.0.0.1:7897'),
        },
      },
    },
    base: env.VITE_BASE_PATH || '/',
    build: {
      outDir: env.VITE_OUT_DIR || 'dist',
    },
  };
});
