import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { fontSwitch } from './vite-plugins/fontSwitch';
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
      fontSwitch(mode),
      ...(mode !== 'cf'
        ? [
            viteCompression({
              algorithm: 'brotliCompress',
              compressionOptions: { level: 11 },
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 9090,
      host: true,
      open: true,
      proxy: {
        '/api': {
          target: 'https://tools.hanekawa.top',
          changeOrigin: true,
          secure: true,
          headers: {
            Origin: 'https://tools.hanekawa.top',
          },
        },
      },
    },
    base: env.VITE_BASE_PATH || '/',
    build: {
      emptyOutDir: true,
      outDir: env.VITE_OUT_DIR || 'dist',
      reportCompressedSize: true,
    },
  };
});
