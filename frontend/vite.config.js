import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /events → forward to Express backend
      '/event': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Any request to /ticketing (booking endpoint)
      '/booking': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Future routes (e.g., /login, /signup)
      '/user': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/signup': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/tickets': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
