import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/* The dev port is registered in ~/.dev-ports.json; never a default (3000/5173/8080).
   `strictPort` matters here because Tauri's devUrl is a fixed string - a silent
   port bump would leave the desktop window pointing at nothing. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5974, strictPort: true },
  preview: { port: 5974, strictPort: true },
  clearScreen: false,
  build: {
    // 🔴 Source maps stay off by default, every project (build-test-quality.md).
    sourcemap: false,
    target: 'chrome120',
    chunkSizeWarningLimit: 900,
  },
});
