/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serwuje aplikację pod https://gryczanm.github.io/schron-app/
export default defineConfig({
  base: '/schron-app/',
  plugins: [
    react(),
    VitePWA({
      // 'prompt' bez komunikatu: nowy service worker czeka i przejmuje aplikację przy kolejnym otwarciu (#6).
      registerType: 'prompt',
      manifest: {
        name: 'Punkty schronienia',
        short_name: 'Schronienie',
        description: 'Mapa punktów schronienia w Polsce ze zbioru PSP, działa też bez sieci.',
        lang: 'pl',
        display: 'standalone',
        theme_color: '#0d9488',
        background_color: '#f8f4f0',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Powłoka aplikacji, plik danych i glify cyfr klastrów: punkty schronienia działają offline zawsze.
        // Ikony z manifestu plugin dokłada do precache sam.
        globPatterns: ['**/*.{js,css,html,json,pbf,svg,ico}'],
        maximumFileSizeToCacheInBytes: 16 * 1024 * 1024, // punkty.json ma ok. 7,5 MB
        // Pierwsza wizyta: service worker od razu obsługuje stronę, więc oglądane kafelki trafiają do cache.
        clientsClaim: true,
        // Podkład w miarę możliwości: offline widać obszary oglądane wcześniej.
        // Wzorce jako wyrażenia regularne, bo funkcje trafiają do sw.js jako tekst, bez stałych z tego pliku.
        runtimeCaching: [
          {
            // Styl i TileJSON wskazują aktualną wersję kafelków, więc najpierw sieć.
            urlPattern: /^https:\/\/tiles\.openfreemap\.org\/(styles\/|planet$)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'podklad-styl',
              networkTimeoutSeconds: 2, // krócej niż limit w wczytajStyl, żeby styl z cache zdążył
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            // Kafelki, glify i sprite mają wersję w adresie, więc wystarczy cache.
            urlPattern: /^https:\/\/tiles\.openfreemap\.org\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'podklad',
              expiration: { maxEntries: 3000, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
  server: { host: true },
});
