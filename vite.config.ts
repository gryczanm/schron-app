/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serwuje aplikację pod https://gryczanm.github.io/schron-app/
export default defineConfig({
  base: '/schron-app/',
  plugins: [react()],
  server: { host: true },
});
