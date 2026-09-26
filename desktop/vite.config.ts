import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { catalogueKeysPlugin } from './vite/catalogue-keys.js';
import { engineBundlePlugin } from './vite/engine-bundle.js';
import { prepaintPlugin } from './vite/prepaint.js';
import { tauriConfigPlugin } from './vite/tauri-config.js';

const root = fileURLToPath(new URL('.', import.meta.url));

/* The dev port is registered in ~/.dev-ports.json; never a default (3000/5173/8080).
   `strictPort` matters here because Tauri's devUrl is a fixed string - a silent
   port bump would leave the desktop window pointing at nothing. */
export default defineConfig({
  /* The build-time generators and gates are plugins, never a scripts folder (TASK-019).
     `public/prepaint.js` is written from the axis registry once the config resolves; at
     build start the Tauri config is checked against the installed CLI's schema (builds
     only), the engine is mirrored into the bundle, and a missing catalogue key stops the
     build before anything is bundled, naming the file, the line and the key. */
  plugins: [
    prepaintPlugin(root),
    tauriConfigPlugin(root),
    engineBundlePlugin(root),
    catalogueKeysPlugin(root),
    react(),
    tailwindcss(),
  ],
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
    /* No `chunkSizeWarningLimit`: a chunk over Vite's 500 kB default is split, never
       allowed to grow past the warning (the fleet baseline). The largest chunk was
       416 kB when the raised limit of 900 was removed on 2026-09-25. */
  },
});
