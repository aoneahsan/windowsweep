/**
 * One reporting surface. Call track(); never call a provider at a feature site.
 * GA4 uses the authenticated analytics-ingest broker, so its Measurement Protocol
 * secret stays on the server. Amplitude and Sentry stay bundled in the window.
 *
 * A development build reports nothing. A production build with no destination
 * configured still opens, and an event failure never blocks the user's action.
 */

import type { EventName } from './events';
import { supabaseConfig } from './config';
import { readStored, writeStored } from './storage';

export interface AnalyticsKeys {
  ga4IngestEnabled?: boolean | undefined;
  amplitudeApiKey?: string | undefined;
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

/**
 * Events tracked before every destination has registered, replayed to each one as
 * it registers.
 *
 * 🔴 WHY: `main.tsx` starts analytics with `void` and does not wait, and the router
 * emits the first `screen.view` as it resolves - before GA4 and Amplitude have
 * finished loading. `track()` sends only to providers already in the list, so that
 * first screen view reached nothing but whatever happened to be ready first. Proved
 * on the wire on the marketing site, whose code has the same shape.
 *
 * 🔴 REPLAYED TO THE PROVIDER THAT JUST REGISTERED, AND ONLY TO IT. A destination
 * that was already ready received each event live; replaying the whole queue to
 * everyone would send those twice. So an event goes to a provider exactly once:
 * live if the provider was ready when it was tracked, or in that provider's own
 * replay if it was not. The queue holds already-scrubbed events, is capped (the
 * oldest go first), and is cleared for good once `startAnalytics` settles.
 */
const PENDING_CAP = 50;
const pending: { event: string; props: EventProps }[] = [];
let queueing = true;

/** Add a destination, then hand it what was tracked before it existed. */
function register(provider: Provider): void {
  providers.push(provider);
  if (!provider.ready) return;
  for (const queued of pending) {
    try {
      provider.send(queued.event, queued.props);
    } catch {
      /* a replay that fails is dropped for that destination only, as a live send is */
    }
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

const CLIENT_ID_KEY = 'windowsweep:analytics-client-id';
const SESSION_KEY = 'windowsweep:analytics-session';
const SESSION_IDLE_MS = 30 * 60 * 1000;
const PARAM_KEYS = ['route', 'control', 'version', 'reason'] as const;

interface AnalyticsSession {
  id: string;
  lastEventMs: number;
}

function eventContext(): { clientId: string; sessionId: string; engagementMs: number } {
  let clientId = readStored(CLIENT_ID_KEY, '');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId)) {
    clientId = crypto.randomUUID();
    writeStored(CLIENT_ID_KEY, clientId);
  }
  const now = Date.now();
  const prior = readStored<AnalyticsSession>(SESSION_KEY, { id: '', lastEventMs: 0 });
  const lastEventMs = Number.isFinite(prior.lastEventMs) ? prior.lastEventMs : 0;
  const active =
    /^[1-9][0-9]{0,15}$/.test(prior.id) &&
    now >= lastEventMs &&
    now - lastEventMs < SESSION_IDLE_MS;
  const sessionId = active ? prior.id : String(Math.floor(now / 1000));
  const engagementMs = active ? Math.min(Math.max(now - lastEventMs, 1), 60_000) : 1;
  writeStored(SESSION_KEY, { id: sessionId, lastEventMs: now });
  return { clientId, sessionId, engagementMs };
}

async function sendGa4(event: string, props: EventProps): Promise<void> {
  if (!supabaseConfig.url || !supabaseConfig.publishableKey) return;
  const { supabase } = await import('./auth');
  const client = supabase();
  if (!client) return;
  const { data, error } = await client.auth.getSession();
  // The D72 device-session wave supplies an anonymous JWT for signed-out use.
  // Analytics never creates an account as a side effect of tracking an event.
  if (error || !data.session) return;
  const params: Record<string, string> = {};
  for (const key of PARAM_KEYS) {
    const value = props[key];
    if (typeof value === 'string') {
      params[key] = key === 'reason' ? (value === 'deadline' ? 'deadline' : 'other') : value;
    }
  }
  const { clientId, sessionId, engagementMs } = eventContext();
  await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/functions/v1/analytics-ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseConfig.publishableKey,
      Authorization: `Bearer ${data.session.access_token}`,
    },
    body: JSON.stringify({
      event: event.replaceAll('.', '_'),
      client_id: clientId,
      session_id: sessionId,
      engagement_time_msec: engagementMs,
      app_version: appVersion,
      params,
    }),
    signal: AbortSignal.timeout(5000),
  });
}

function startGa4(): void {
  register({
    name: 'ga4',
    ready: true,
    send: (event, props) => {
      void sendGa4(event, props).catch(() => {
        // Telemetry failure does not change the user's action or block the window.
      });
    },
  });
}
async function startAmplitude(apiKey: string): Promise<void> {
  const amplitude = await import('@amplitude/analytics-browser');
  // 🔴 awaited on `.promise`, not on the call - init resolves before its
  // destination plugins attach, and events fired in that window are dropped.
  // 🔴 No remote config. The SDK otherwise fetches settings from Amplitude's
  // dashboard (sr-client-cfg.amplitude.com), which can switch autocapture on - so
  // what this window collects would change without a release, past the notice.
  // The window's CSP refused that fetch in every release up to 1.3.2 (six console
  // errors a boot), so turning it off keeps exactly the behaviour that shipped.
  await amplitude.init(apiKey, undefined, {
    appVersion,
    autocapture: false,
    remoteConfig: { fetchRemoteConfig: false },
  }).promise;
  register({
    name: 'amplitude',
    ready: true,
    send: (event, props) => {
      amplitude.track(event, props);
    },
  });
}

async function startSentry(dsn: string): Promise<void> {
  const Sentry = await import('@sentry/browser');
  Sentry.init({
    dsn,
    release: `windowsweep-desktop@${appVersion}`,
    /* 🔴 SENTRY 11 INVERTED THE DEFAULT. v10's `sendDefaultPii: false` is gone, and its
       replacement COLLECTS every category it is not told about - user info (which is
       what lets the server infer an IP address), cookies, headers, bodies, query
       strings, local variables (`@sentry/core` 11.0.0's `resolveDataCollectionOptions`,
       read 2026-09-25). Deleting the removed option alone compiles cleanly and starts
       sending all of it. So every category is switched off here BY NAME - the same
       nothing-about-the-person position the old flag held, now stated field by field,
       exactly as the marketing site's `src/lib/sentry.ts` states it. `beforeSend` below
       stays the second layer. */
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      graphQL: { document: false, variables: false },
      genAI: { inputs: false, outputs: false },
      databaseQueryData: false,
      queues: false,
      stackFrameVariables: false,
    },
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
  register({
    name: 'sentry',
    ready: true,
    send: (event, props) => {
      Sentry.addBreadcrumb({ category: 'app', message: event, data: props });
    },
  });
}

/**
 * Start every provider this build has a key for. Safe to call more than once.
 *
 * 🔴 The KEY and the kind of build are the only conditions. There is no consent
 * parameter and no stored flag to read - the notice tells the person what is
 * collected and there is no switch, so a gate here would be a control nobody can
 * reach.
 *
 * 🔴 A DEVELOPMENT BUILD REPORTS NOTHING (TASK-023, D54). `yarn dev` and every
 * `tauri dev` session - each GATE 4 round included - carry the production keys
 * from `.env`, so they reported to the production projects, and Clarity recorded
 * Vite's `data-vite-dev-id` attribute, a local path, in its replay. A production
 * build replaces `import.meta.env.DEV` with `false` and drops the branch, so the
 * shipped window is unchanged. Analytics are watched on a production-protocol
 * build (`yarn tauri build --debug --no-bundle`) and on the installed first boot.
 */
export async function startAnalytics(keys: AnalyticsKeys, version: string): Promise<void> {
  if (started) return;
  started = true;
  if (import.meta.env.DEV) {
    // Nothing will register, so nothing is held for a replay either.
    queueing = false;
    return;
  }
  appVersion = version;

  const jobs: Promise<void>[] = [];
  if (keys.ga4IngestEnabled && supabaseConfig.url && supabaseConfig.publishableKey) startGa4();
  if (keys.amplitudeApiKey) jobs.push(startAmplitude(keys.amplitudeApiKey));
  if (keys.sentryDsn) jobs.push(startSentry(keys.sentryDsn));

  // A destination that fails to start must never take the app down with it.
  await Promise.allSettled(jobs);
  /* Every destination that is going to register has; nothing is replayed after
     this, so the queue would only be memory. */
  queueing = false;
  pending.length = 0;
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
  if (queueing) {
    if (pending.length >= PENDING_CAP) pending.shift();
    pending.push({ event, props: safe });
  }
  for (const p of providers) {
    if (!p.ready) continue;
    try {
      p.send(event, safe);
    } catch {
      /* one destination failing never blocks the others, and never surfaces to the user */
    }
  }
}
