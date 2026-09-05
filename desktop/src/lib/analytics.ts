/**
 * One reporting surface. Call `track()`; never call a provider.
 *
 * 🔴 The fan-out happens INSIDE this module's report function, not at the call
 * sites. A call site that names a provider is a call site that will one day name
 * three of the four - the recorded failure is a product where two destinations
 * silently received a different set of events from the third.
 *
 * 🔴 A provider is CONSTRUCTED only when its consent flag is true and its key is
 * present. An absent key skips its provider and never blocks boot; an absent
 * consent does the same. Gating the report call instead of the construction still
 * opens the connection, which is the thing being consented to.
 *
 * 🔴 Amplitude's ready flag is set on the init PROMISE, never on the init call.
 * `init()` returns before its destination plugins attach, so every event fired in
 * that window is dropped. The failure is INTERMITTENT - a clean run proves nothing,
 * so this is asserted by reading the code, not by watching one session.
 *
 * 🔴 A hand-rolled gtag shim pushes `arguments`, never a spread array.
 * `dataLayer.push(args)` pushes one array object; `config` then never registers
 * and GA4 sends nothing while every visitor still downloads gtag.js. The check
 * that catches it: `dataLayer.push === Array.prototype.push` being true means
 * gtag.js never took over.
 */

import { readConsent, type ConsentState } from './consent';

export interface AnalyticsKeys {
  ga4MeasurementId?: string | undefined;
  amplitudeApiKey?: string | undefined;
  clarityProjectId?: string | undefined;
  sentryDsn?: string | undefined;
}

type EventProps = Record<string, string | number | boolean | null>;

interface Provider {
  name: string;
  ready: boolean;
  send: (event: string, props: EventProps) => void;
}

const providers: Provider[] = [];
let appVersion = '0.0.0';
let started = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * 🔴 Every path this app might report is scrubbed here before it can reach a
 * destination. The consent screen promises that no file path, folder name, drive
 * label, user name or machine name is ever sent; this function is where that
 * promise is kept, rather than in the discipline of every call site.
 */
export function scrub(value: string): string {
  return value
    .replace(/[A-Za-z]:\[^\s"']*/g, '<path>')
    .replace(/\\[^\s"']+/g, '<unc>')
    .replace(/\/(?:home|Users)\/[^/\s"']+/g, '<home>');
}

function scrubProps(props: EventProps): EventProps {
  const out: EventProps = {};
  for (const [k, v] of Object.entries(props)) out[k] = typeof v === 'string' ? scrub(v) : v;
  return out;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.async = true;
    el.src = src;
    el.onload = () => { resolve(); };
    el.onerror = () => { reject(new Error(`could not load ${src}`)); };
    document.head.appendChild(el);
  });
}

async function startGa4(measurementId: string): Promise<void> {
  window.dataLayer = window.dataLayer ?? [];
  /* 🔴 It pushes `arguments`, NOT the rest array. `dataLayer.push(args)` pushes one
     array object; gtag.js reads an arguments object, so `config` never registers
     and GA4 sends nothing while every visitor still downloads the tag. The rest
     parameter exists only to type the call sites - it is deliberately unused. */
  function gtag(..._args: unknown[]): void {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  await loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`);
  gtag('config', measurementId, { send_page_view: false, app_version: appVersion });

  providers.push({
    name: 'ga4',
    ready: true,
    send: (event, props) => { window.gtag?.('event', event, props); },
  });
}

async function startAmplitude(apiKey: string): Promise<void> {
  const amplitude = await import('@amplitude/analytics-browser');
  // 🔴 awaited on `.promise`, not on the call - init resolves before its
  // destination plugins attach, and events fired in that window are dropped.
  await amplitude.init(apiKey, undefined, { appVersion, autocapture: false }).promise;
  providers.push({
    name: 'amplitude',
    ready: true,
    send: (event, props) => { amplitude.track(event, props); },
  });
}

async function startClarity(projectId: string): Promise<void> {
  await loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`);
  providers.push({
    name: 'clarity',
    ready: typeof window.clarity === 'function',
    send: (event) => { window.clarity?.('event', event); },
  });
}

async function startSentry(dsn: string): Promise<void> {
  const Sentry = await import('@sentry/browser');
  Sentry.init({
    dsn,
    release: `windowsweep-desktop@${appVersion}`,
    sendDefaultPii: false,
    beforeSend(event) {
      // the same promise as `scrub`, applied to anything Sentry assembled itself
      if (event.message) event.message = scrub(event.message);
      for (const value of event.exception?.values ?? []) {
        if (value.value) value.value = scrub(value.value);
        for (const frame of value.stacktrace?.frames ?? []) {
          if (frame.filename) frame.filename = scrub(frame.filename);
          delete frame.abs_path;
        }
      }
      return event;
    },
  });
  providers.push({
    name: 'sentry',
    ready: true,
    send: (event, props) => { Sentry.addBreadcrumb({ category: 'app', message: event, data: props }); },
  });
}

/**
 * Start exactly the providers that are both consented to and configured.
 * Safe to call more than once; later calls are ignored until `reset()`.
 */
export async function startAnalytics(keys: AnalyticsKeys, version: string, consent?: ConsentState): Promise<void> {
  if (started) return;
  started = true;
  appVersion = version;
  const c = consent ?? readConsent();

  const jobs: Promise<void>[] = [];
  if (c.ga4 && keys.ga4MeasurementId) jobs.push(startGa4(keys.ga4MeasurementId));
  if (c.amplitude && keys.amplitudeApiKey) jobs.push(startAmplitude(keys.amplitudeApiKey));
  if (c.clarity && keys.clarityProjectId) jobs.push(startClarity(keys.clarityProjectId));
  if (c.sentry && keys.sentryDsn) jobs.push(startSentry(keys.sentryDsn));

  // A destination that fails to start must never take the app down with it.
  await Promise.allSettled(jobs);
}

/**
 * Revoking a destination has to stop it immediately, and the only way to be
 * certain a loaded third-party script has stopped is to reload the window with
 * the new record already written. The caller writes consent, then calls this.
 */
export function reset(): void {
  providers.length = 0;
  started = false;
}

/** The one call site vocabulary. Nothing outside this module names a provider. */
export function track(event: string, props: EventProps = {}): void {
  const safe = scrubProps(props);
  for (const p of providers) {
    if (!p.ready) continue;
    try {
      p.send(event, safe);
    } catch {
      /* one destination failing never blocks the others, and never surfaces to the user */
    }
  }
}

/** Test seam: which destinations actually came up. Used by the settings screen. */
export function activeProviders(): string[] {
  return providers.filter((p) => p.ready).map((p) => p.name);
}
