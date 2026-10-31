/**
 * Build-time public configuration. The GA4 enable flag contains no secret:
 * analytics-ingest holds the Measurement Protocol credentials server-side.
 * Missing optional destinations never block the app.
 */

import type { AnalyticsKeys } from './analytics';

const env = import.meta.env;

export const keys: AnalyticsKeys = {
  ga4IngestEnabled: env.VITE_GA4_INGEST_ENABLED === 'true',
  amplitudeApiKey: env.VITE_AMPLITUDE_API_KEY,
  sentryDsn: env.VITE_SENTRY_DSN,
};

/**
 * Supabase, since 2026-09-05: it is the default backend for every new project
 * (`~/.claude/rules/services-integrations.md`). The publishable key is a PUBLIC
 * client key whose whole security model is RLS - it is meant to ship in a bundle.
 * 🔴 The SECRET key never touches this process, and there is no code path here
 * that could read one.
 */
export const supabaseConfig = {
  url: env.VITE_SUPABASE_URL,
  publishableKey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
};

/**
 * The version this build was cut at (`desktop/package.json`, injected at build time), so it moves
 * with the version cascade and never goes stale on its own. Analytics and Sentry report it, and the
 * About panel shows it until the Rust side answers. 🔴 It was the literal '1.2.0' until 2026-09-26:
 * the 1.3.0 cascade did not reach it, so every installed 1.3.0 reported app_version 1.2.0 and the
 * Sentry release `windowsweep-desktop@1.2.0`.
 */
export const buildVersion = __APP_VERSION__;

/**
 * The house support link. `project-id` is the npm package name and
 * `project-identifier` is the desktop bundle identifier, per the fleet standard.
 */
export const SUPPORT_URL =
  'https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=com.aoneahsan.windowsweep';

export const REPO_URL = 'https://github.com/aoneahsan/windowsweep';

/** Each configured destination is reported separately; no provider is inferred from another. */
export interface TelemetryConfigured {
  ga4: boolean;
  amplitude: boolean;
  sentry: boolean;
}

/** True only when NO destination is configured - the one claim `settings.noKeys` makes. */
export function noDestinationConfigured(t: TelemetryConfigured): boolean {
  return !t.ga4 && !t.amplitude && !t.sentry;
}

/** Which of these are configured, for the settings screen to state honestly. */
export function configuredFeatures(): {
  signIn: boolean;
  sync: boolean;
  telemetry: TelemetryConfigured;
} {
  const supabaseReady = Boolean(supabaseConfig.url && supabaseConfig.publishableKey);
  return {
    // One backend, so sign-in and sync are configured together or not at all -
    // which is simpler to state honestly on the Settings screen than two flags
    // that can disagree.
    signIn: supabaseReady,
    sync: supabaseReady,
    telemetry: {
      ga4: Boolean(keys.ga4IngestEnabled && supabaseReady),
      amplitude: Boolean(keys.amplitudeApiKey),
      sentry: Boolean(keys.sentryDsn),
    },
  };
}
