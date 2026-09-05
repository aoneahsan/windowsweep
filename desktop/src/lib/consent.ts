/**
 * The consent record. Every destination is OFF until this says otherwise, and
 * revoking one stops it immediately.
 *
 * 🔴 Nothing in this app reads a provider key or constructs a provider client
 * except through `analytics.ts`, and `analytics.ts` refuses to initialise a
 * provider whose flag here is false. The gate is on CONSTRUCTION, not on the
 * report call - a provider built and then not called is still a provider that
 * has opened a connection.
 */

export interface ConsentState {
  ga4: boolean;
  amplitude: boolean;
  clarity: boolean;
  sentry: boolean;
  /** Set once the person has actually answered, so the app never asks twice. */
  answered: boolean;
  answeredAt: string | null;
}

export const CONSENT_STORAGE_KEY = 'windowsweep:consent';

export const NO_CONSENT: ConsentState = {
  ga4: false,
  amplitude: false,
  clarity: false,
  sentry: false,
  answered: false,
  answeredAt: null,
};

export type ConsentProvider = 'ga4' | 'amplitude' | 'clarity' | 'sentry';

export const CONSENT_PROVIDERS: readonly ConsentProvider[] = ['ga4', 'amplitude', 'clarity', 'sentry'];

export function readConsent(): ConsentState {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return { ...NO_CONSENT };
    const parsed: unknown = JSON.parse(raw);
    const wrapped = parsed as { v?: unknown };
    const value = (typeof wrapped === 'object' && wrapped !== null && 'v' in wrapped ? wrapped.v : parsed) as
      | Partial<ConsentState>
      | undefined;
    if (typeof value !== 'object' || value === null) return { ...NO_CONSENT };
    return {
      ga4: value.ga4 === true,
      amplitude: value.amplitude === true,
      clarity: value.clarity === true,
      sentry: value.sentry === true,
      answered: value.answered === true,
      answeredAt: typeof value.answeredAt === 'string' ? value.answeredAt : null,
    };
  } catch {
    // 🔴 An unreadable record is treated as NO consent, never as the last known
    // answer. Failing open here would mean sending data because storage broke.
    return { ...NO_CONSENT };
  }
}

export function writeConsent(state: ConsentState): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: state }));
  } catch {
    /* nothing is enabled if we cannot record that it was - see readConsent */
  }
}

export function anyConsentGiven(state: ConsentState): boolean {
  return CONSENT_PROVIDERS.some((p) => state[p]);
}
