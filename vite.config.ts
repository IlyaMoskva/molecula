import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['molecula.svg'],
      manifest: {
        name: 'Молекула',
        short_name: 'Молекула',
        description: 'Учимся собирать молекулы из атомов',
        lang: 'ru',
        theme_color: '#315c4d',
        background_color: '#f7f4ed',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/molecula.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
