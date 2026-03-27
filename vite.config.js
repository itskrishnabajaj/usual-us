import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
});
