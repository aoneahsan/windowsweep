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
 * identifier: a GA4 measurement id, a Clarity project id, a Sentry DSN, a Firebase
 * web API key and a public OAuth desktop client id. A desktop client is a public
 * client by definition, which is why the sign-in flow uses PKCE.
 */

import type { AnalyticsKeys } from './analytics';

const env = import.meta.env;

export const keys: AnalyticsKeys = {
  ga4MeasurementId: env.VITE_GA4_MEASUREMENT_ID,
  amplitudeApiKey: env.VITE_AMPLITUDE_API_KEY,
  clarityProjectId: env.VITE_CLARITY_PROJECT_ID,
  sentryDsn: env.VITE_SENTRY_DSN,
};

export const authConfig = {
  googleClientId: env.VITE_GOOGLE_DESKTOP_CLIENT_ID,
  firebaseApiKey: env.VITE_FIREBASE_API_KEY,
};

export const syncConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  apiKey: env.VITE_FIREBASE_API_KEY,
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
  return {
    signIn: Boolean(authConfig.googleClientId && authConfig.firebaseApiKey),
    sync: Boolean(syncConfig.projectId && syncConfig.apiKey),
    telemetry: Boolean(keys.ga4MeasurementId ?? keys.amplitudeApiKey ?? keys.clarityProjectId ?? keys.sentryDsn),
  };
}
