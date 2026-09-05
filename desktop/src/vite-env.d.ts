/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly VITE_AMPLITUDE_API_KEY?: string;
  readonly VITE_CLARITY_PROJECT_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GOOGLE_DESKTOP_CLIENT_ID?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
