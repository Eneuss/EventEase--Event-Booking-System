import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server proxies API calls to the Express backend, so the browser sees a single origin
// and the session cookie just works. Override the target with API_PROXY_TARGET if needed.
const apiTarget = process.env.API_PROXY_TARGET || 'http://localhost:3000';
const proxy = Object.fromEntries(
  ['/user', '/event', '/booking'].map((path) => [path, { target: apiTarget, changeOrigin: true }])
);

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
