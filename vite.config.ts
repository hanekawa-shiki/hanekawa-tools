import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';
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
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'hanekawa-tools',
          short_name: 'hanekawa-tools',
          description: '日常小工具集合 - 万年历、油价查询、种子转磁力链、发票合并等实用工具',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
          runtimeCaching: [
            {
              // 缓存 CDN 字体 CSS
              urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'cdn-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
                },
              },
            },
            {
              // 缓存 API 响应（节假日、油价）
              urlPattern: /\/api\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 1 天
                },
                networkTimeoutSeconds: 5,
              },
            },
          ],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
        },
        devOptions: {
          enabled: false,
        },
      }),
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
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              if (id.includes('pdf-lib')) {
                return 'vendor-pdf';
              }
              if (id.includes('@dnd-kit')) {
                return 'vendor-dnd';
              }
              if (id.includes('@hugeicons')) {
                return 'vendor-icons';
              }
              if (id.includes('dayjs') || id.includes('lunisolar') || id.includes('date-fns')) {
                return 'vendor-date';
              }
              if (id.includes('parse-torrent')) {
                return 'vendor-torrent';
              }
              if (id.includes('tailwindcss') || id.includes('tw-animate')) {
                return 'vendor-css';
              }
            }
            return undefined;
          },
        },
      },
    },
  };
});
