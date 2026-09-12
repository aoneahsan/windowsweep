/**
 * One reporting surface. Call `track()`; never call a provider.
 *
 * 🔴 The fan-out happens INSIDE this module's report function, not at the call
 * sites. A call site that names a provider is a call site that will one day name
 * three of the four - the recorded failure is a product where two destinations
 * silently received a different set of events from the third.
 *
 * 🔴 THERE IS NO CONSENT GATE, since 2026-09-07. The owner removed the opt-out:
 * the product is free, it collects usage data to improve itself, and the first-run
 * screen is a notice rather than a decision. A provider is therefore constructed
 * whenever its KEY is present, and nothing here reads a stored flag.
 *
 * 🔴 A missing key still skips its provider silently and never blocks boot. That
 * is a BUILD fact, not a user choice - no key is configured in this build, so
 * nothing is actually sent from it - and it is the one thing that must not be
 * confused with the setting that no longer exists.
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

import type { EventName } from './events';

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
 *
 * 🔴 The drive-letter rule needs TWO backslashes and had one. `\[` is an escaped
 * bracket, so the pattern read "letter, colon, a literal [" and matched nothing;
 * the UNC rule below then caught everything from the first backslash onward and
 * left the drive letter standing, so `C:\Users\PC\x.ts` scrubbed to `C:<unc>`.
 * No folder or user name escaped - but a DRIVE LABEL did, and the consent notice
 * lists a drive label among the things never sent. One character, invisible to
 * typecheck, lint and review because both forms are valid regexes.
 *
 * 🔴 AND THE FIXED RULE ONLY EVER SAW ONE OF THE TWO SLASHES. Re-measured
 * 2026-09-08 by running the real function over real strings rather than reading
 * it: `C:\Users\PC\AppData` scrubbed correctly, and `C:/Users/PC/AppData` came
 * back as `C:<home>/AppData/Local/Temp` - drive label AND two folder names intact.
 * `D:/work/windowsweep-root` came back untouched in full. That is the shape
 * this app leaks most, not the backslash one: a Vite stack frame, an
 * `import.meta.url` and every `file:///C:/...` in a Sentry payload use forward
 * slashes. The class matches EITHER separator now.
 *
 * 🔴 The lookbehind is load-bearing, not tidiness. Without it `[A-Za-z]:[\\/]`
 * matches the `s://` in `https://www.googletagmanager.com/...`, so every URL in a
 * message would scrub to `http<path>` - over-scrubbing that destroys the one thing
 * a crash report is for. A drive letter is never preceded by another letter.
 */
export function scrub(value: string): string {
  return value
    .replace(/(?<![A-Za-z])[A-Za-z]:[\\/][^\s"']*/g, '<path>')
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
      /* 🔴 BREADCRUMBS TOO, and leaving them out was a real leak rather than an
         oversight worth one line. Sentry's default DOM integration serialises a
         clicked element and appends selected attributes to the description -
         `aria-label` is first in that list (`@sentry/core` `utils/browser.js`).
         `Picker.tsx` labels every row `Choose {{path}}` with the real path,
         because a screen reader needs to know which row it is on. So: click a
         row, hit any error later in the same session, and the path left the
         machine in a breadcrumb while `message`, `exception` and `frames` were
         all scrubbed clean.

         That falsifies the one promise this product repeats everywhere -
         `consent.neverSent`, "Never a file path" - which ships on Home today and
         is about to ship again on the marketing site's privacy page.

         Scrubbing here rather than disabling DOM breadcrumbs keeps the click
         trail, which is most of a crash report's value, and closes every
         attribute route at once instead of the one element we happened to find.
         Found by a fact-check reading the app against the installed SDK; nothing
         had leaked yet only because no DSN is configured in this build. */
      for (const crumb of event.breadcrumbs ?? []) {
        if (crumb.message) crumb.message = scrub(crumb.message);
        if (crumb.data) {
          for (const [k, v] of Object.entries(crumb.data)) {
            if (typeof v === 'string') crumb.data[k] = scrub(v);
          }
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
 * Start every provider this build has a key for. Safe to call more than once.
 *
 * 🔴 The only condition is the KEY. There is no consent parameter and no stored
 * flag to read - the notice tells the person what is collected and there is no
 * switch, so a gate here would be a control nobody can reach.
 */
export async function startAnalytics(keys: AnalyticsKeys, version: string): Promise<void> {
  if (started) return;
  started = true;
  appVersion = version;

  const jobs: Promise<void>[] = [];
  if (keys.ga4MeasurementId) jobs.push(startGa4(keys.ga4MeasurementId));
  if (keys.amplitudeApiKey) jobs.push(startAmplitude(keys.amplitudeApiKey));
  if (keys.clarityProjectId) jobs.push(startClarity(keys.clarityProjectId));
  if (keys.sentryDsn) jobs.push(startSentry(keys.sentryDsn));

  // A destination that fails to start must never take the app down with it.
  await Promise.allSettled(jobs);
}

/**
 * The one call site vocabulary. Nothing outside this module names a provider.
 *
 * 🔴 `EventName`, not `string`: the registry in `events.ts` is the whole list, so
 * a misspelling does not compile rather than quietly creating a second name for
 * the same thing. The fan-out is here and never at a call site - a call site that
 * named a provider would one day name three of the four.
 */
export function track(event: EventName, props: EventProps = {}): void {
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

