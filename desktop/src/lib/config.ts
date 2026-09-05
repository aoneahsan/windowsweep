/**
 * Build-time configuration.
 *
 * 🔴 Every value is optional and an absent one disables its feature quietly. The
 * app has to install and open on a machine where none of these were ever set -
 * telemetry keys and the OAuth client are owner-supplied and may not exist yet,
 * and a window that refuses to open because an analytics key is missing is a
 * worse outcome than no analytics.
 *
 * 🔴 No SERVER secret is ever read here. Everything below is a public client
 * identifier: a GA4 measurement id, a Clarity project id, a Sentry DSN, a Supabase URL
 * and its publishable key. A desktop client is a public client by definition,
 * which is why the sign-in flow uses PKCE and why the publishable key's whole
 * security model is RLS rather than secrecy.
 */

import type { AnalyticsKeys } from './analytics';

const env = import.meta.env;

export const keys: AnalyticsKeys = {
  ga4MeasurementId: env.VITE_GA4_MEASUREMENT_ID,
  amplitudeApiKey: env.VITE_AMPLITUDE_API_KEY,
  clarityProjectId: env.VITE_CLARITY_PROJECT_ID,
  sentryDsn: env.VITE_SENTRY_DSN,
};

/**
 * Supabase, since 2026-09-06: it is the default backend for every new project
 * (`~/.claude/rules/services-integrations.md`). The publishable key is a PUBLIC
 * client key whose whole security model is RLS - it is meant to ship in a bundle.
 * 🔴 The SECRET key never touches this process, and there is no code path here
 * that could read one.
 */
export const supabaseConfig = {
  url: env.VITE_SUPABASE_URL,
  publishableKey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
};

/** Used until the Rust side reports the real one. */
export const appVersionFallback = '1.1.0';

/**
 * The house support link. `project-id` is the npm package name and
 * `project-identifier` is the desktop bundle identifier, per the fleet standard.
 */
export const SUPPORT_URL =
  'https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=com.aoneahsan.windowsweep';

export const REPO_URL = 'https://github.com/aoneahsan/windowsweep';

/** Which of these are configured, for the settings screen to state honestly. */
export function configuredFeatures(): { signIn: boolean; sync: boolean; telemetry: boolean } {
  const supabaseReady = Boolean(supabaseConfig.url && supabaseConfig.publishableKey);
  return {
    // One backend, so sign-in and sync are configured together or not at all -
    // which is simpler to state honestly on the Settings screen than two flags
    // that can disagree.
    signIn: supabaseReady,
    sync: supabaseReady,
    telemetry: Boolean(keys.ga4MeasurementId ?? keys.amplitudeApiKey ?? keys.clarityProjectId ?? keys.sentryDsn),
  };
}
