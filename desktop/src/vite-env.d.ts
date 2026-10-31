/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA4_INGEST_ENABLED?: string;
  readonly VITE_AMPLITUDE_API_KEY?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * The version this build was cut at - `desktop/package.json`'s, injected by the `define` in
 * `vite.config.ts` (and `vitest.config.ts`), so the version cascade moves it with the manifest.
 */
declare const __APP_VERSION__: string;
