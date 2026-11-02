/**
 * Google sign-in for a desktop application, through Supabase Auth.
 *
 * 🔴 PKCE in the SYSTEM browser, not an embedded webview. Google refuses the
 * OAuth flow inside one, and an app that asks for a Google password in its own
 * window teaches the exact habit phishing relies on. The system browser shows the
 * real address bar.
 *
 * Cleanup works without a Google account. The app uses a separate anonymous
 * device session for run allowance; the cleanup engine makes no network calls.
 *
 * 🔴 No secret exists here. `VITE_SUPABASE_PUBLISHABLE_KEY` is a public client
 * key whose whole security model is RLS - it is meant to ship in a bundle. The
 * secret key never touches this process.
 *
 * The Rust loopback listener (`oauth_listen_start` / `oauth_listen_await`) came
 * over from the Firebase version: a browser page cannot bind a port, and the
 * `state` check happens on the Rust side. 🔴 What did NOT carry over is how the
 * state travels. Firebase's flow put it on Google's own address and Google echoed
 * it; Supabase keeps its own state with Google and forwards none, so the state has
 * to ride inside the redirect address itself (`loopbackRedirect`). 1.3.0 and 1.3.1
 * sent it nowhere, and the listener refused every sign-in at its last step.
 */

import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { invoke } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';

import { supabaseConfig } from './config';
import { errorText, logger } from './logger';
import { loopbackRedirect } from './oauth-redirect';
import { clearRunLedger } from './sync-local';
import { authStorage, readStored, removeStored, writeStored } from './storage';

export interface AuthUser {
  /** `auth.users.id` - the value every RLS policy compares against. */
  uid: string;
  email: string;
  displayName: string | null;
}

let client: SupabaseClient | null = null;
const DEVICE_KEY = 'windowsweep:device-id';
const DEVICE_ID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
const HANDOFF_CODE = /^[\da-f]{32}$/;
let sessionReady: Promise<SupabaseClient> | null = null;

/**
 * The one client. Built lazily, so a build with no Supabase configuration opens
 * a window and works locally instead of failing at import time.
 *
 * 🔴 `detectSessionInUrl: false` - this is a desktop window, not a page the
 * provider redirects back into. The code arrives through the loopback listener
 * and is exchanged explicitly, so letting the SDK sniff the URL would only give
 * it a second, wrong path to the same thing.
 */
export function supabase(): SupabaseClient | null {
  if (!supabaseConfig.url || !supabaseConfig.publishableKey) return null;
  client ??= createClient(supabaseConfig.url, supabaseConfig.publishableKey, {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'windowsweep:supabase-auth',
      storage: authStorage,
    },
  });
  return client;
}

export function isConfigured(): boolean {
  return supabase() !== null;
}

function toUser(session: Session): AuthUser {
  const meta = session.user.user_metadata as { full_name?: string; name?: string } | undefined;
  return {
    uid: session.user.id,
    email: session.user.email ?? '',
    displayName: meta?.full_name ?? meta?.name ?? null,
  };
}

/** Random installation identity, kept across account and anonymous sessions. */
export function installationId(): string {
  const saved = readStored(DEVICE_KEY, '');
  if (DEVICE_ID.test(saved)) return saved;
  const created = crypto.randomUUID();
  writeStored(DEVICE_KEY, created);
  return created;
}

function replaceInstallationId(): string {
  const created = crypto.randomUUID();
  writeStored(DEVICE_KEY, created);
  return created;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Serialize first-session creation so concurrent screens cannot mint two users. */
export async function ensureDeviceSession(): Promise<SupabaseClient> {
  const sb = supabase();
  if (!sb) throw new Error('account_not_configured');
  sessionReady ??= (async () => {
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    if (!data.session) {
      const created = await sb.auth.signInAnonymously();
      if (created.error) throw created.error;
    }
    return sb;
  })().finally(() => {
    sessionReady = null;
  });
  return sessionReady;
}

async function registerDevice(sb: SupabaseClient, id: string): Promise<void> {
  const result = await sb.functions.invoke(`allowance?device_id=${encodeURIComponent(id)}`, {
    method: 'GET',
  });
  if (result.error) throw result.error;
  const payload: unknown = result.data;
  if (!isRecord(payload) || payload.ok !== true) throw new Error('device_register_failed');
}

async function beginHandoff(sb: SupabaseClient, id: string): Promise<string> {
  const result = await sb.rpc('device_handoff_begin', { p_device_id: id });
  if (result.error) throw result.error;
  const payload: unknown = result.data;
  const code = isRecord(payload) ? payload.code : undefined;
  if (typeof code !== 'string' || !HANDOFF_CODE.test(code)) throw new Error('handoff_invalid');
  return code;
}

async function completeHandoff(sb: SupabaseClient, id: string, code: string): Promise<void> {
  const result = await sb.rpc('device_handoff_complete', {
    p_device_id: id,
    p_code: code,
  });
  if (result.error) throw result.error;
  const payload: unknown = result.data;
  if (
    !isRecord(payload) ||
    typeof payload.device_id !== 'string' ||
    payload.device_id.toLowerCase() !== id.toLowerCase()
  ) {
    throw new Error('handoff_invalid');
  }
}

function identityAlreadyExists(error: unknown): boolean {
  if (error === 'identity_already_exists') return true;
  return error instanceof Error && 'code' in error && error.code === 'identity_already_exists';
}

async function googleFlow(sb: SupabaseClient, link: boolean): Promise<Session> {
  const state = crypto.randomUUID();
  const port = await invoke<number>('oauth_listen_start', { state });
  const options = {
    redirectTo: loopbackRedirect(port, state),
    skipBrowserRedirect: true,
    queryParams: { access_type: 'offline', prompt: 'consent' },
  };
  const result = link
    ? await sb.auth.linkIdentity({ provider: 'google', options })
    : await sb.auth.signInWithOAuth({ provider: 'google', options });
  if (result.error) throw result.error;
  if (!result.data.url) throw new Error('sign-in could not start: no provider URL');
  await openUrl(result.data.url);
  const code = await invoke<string>('oauth_listen_await', { timeoutSecs: 300 });
  const exchanged = await sb.auth.exchangeCodeForSession(code);
  if (exchanged.error) throw exchanged.error;
  if (!exchanged.data.session) throw new Error('sign-in returned no session');
  return exchanged.data.session;
}

async function requestWelcome(sb: SupabaseClient): Promise<void> {
  try {
    const result = await sb.functions.invoke('account-welcome', { method: 'POST', body: {} });
    if (result.error)
      logger.warn('account welcome request failed', { error: errorText(result.error) });
  } catch (error: unknown) {
    logger.warn('account welcome request failed', { error: errorText(error) });
  }
}

/**
 * Link Google onto this installation's anonymous session. If that Google identity
 * already belongs to an account, transfer the device after signing in to it.
 */
export async function signIn(): Promise<AuthUser> {
  const sb = await ensureDeviceSession();
  const { data, error } = await sb.auth.getSession();
  if (error) throw error;
  const current = data.session;
  if (!current) throw new Error('sign-in could not start: no device session');
  if (!current.user.is_anonymous) {
    await requestWelcome(sb);
    return toUser(current);
  }

  const id = installationId();
  await registerDevice(sb, id);
  let signed: Session;
  try {
    signed = await googleFlow(sb, true);
    if (signed.user.id !== current.user.id || signed.user.is_anonymous) {
      throw new Error('identity_link_changed_user');
    }
  } catch (linkError: unknown) {
    if (!identityAlreadyExists(linkError)) throw linkError;
    // The anonymous user still owns the device after a rejected link. Transfer
    // that one installation to the existing Google account through a short code.
    const code = await beginHandoff(sb, id);
    signed = await googleFlow(sb, false);
    if (signed.user.is_anonymous) throw new Error('sign-in returned an anonymous session');
    try {
      await completeHandoff(sb, id, code);
    } catch (handoffError: unknown) {
      logger.warn('device handoff failed after account sign-in', {
        error: errorText(handoffError),
      });
      const replacement = replaceInstallationId();
      try {
        await registerDevice(sb, replacement);
      } catch (registrationError: unknown) {
        logger.warn('replacement device registration failed', {
          error: errorText(registrationError),
        });
      }
    }
  }
  await requestWelcome(sb);
  return toUser(signed);
}

/** The session the SDK restored, if any. Called once at boot. */
export async function currentUser(): Promise<AuthUser | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session && !data.session.user.is_anonymous ? toUser(data.session) : null;
}

/**
 * Delete the account through the server path that cancels active Polar periods
 * before it calls the caller-bound `delete_my_account()` RPC. No service key
 * enters the desktop; the function derives the account from its caller.
 *
 * 🔴 THE SIGN-OUT IS PART OF THE OPERATION, not a courtesy afterwards. The session
 * token outlives the row it was issued for, so a window left signed in would hold
 * a JWT for a user that no longer exists and every later call would fail with
 * something that reads like a bug.
 */
export async function deleteAccount(): Promise<void> {
  const sb = supabase();
  if (!sb) throw new Error('sign-in is not configured in this build');
  const result = await sb.functions.invoke('delete-account', { method: 'POST', body: {} });
  if (result.error) throw new Error(`the account could not be deleted: ${errorText(result.error)}`);
  const payload: unknown = result.data;
  if (!isRecord(payload) || payload.ok !== true)
    throw new Error('the account could not be deleted');
  try {
    await signOut({ deleted: true });
  } catch (signOutError: unknown) {
    logger.warn('local sign-out failed after account deletion', { error: errorText(signOutError) });
    removeStored('windowsweep:history-cloud');
    clearRunLedger();
  } finally {
    // The Auth row is gone. Discard even a stale in-memory session and token.
    removeStored('windowsweep:supabase-auth');
    client = null;
  }
}

/**
 * 🔴 Signing out clears every local trace of the account, cached rows included.
 *
 * 🔴 SCOPE `'local'`, NEVER THE DEFAULT. supabase-js signs out `'global'` unless
 * told otherwise, which revokes EVERY session the account holds - and the website
 * at windowsweep.aoneahsan.com shares this auth pool, so signing out of this window
 * would have signed the same person out of the site in their browser too. The
 * sentence on the Account screen promises the local traces go, and nothing about
 * other devices; `'local'` ends this machine's session and only that. (The
 * website made the same change on 2026-09-13.)
 *
 * 🔴 THE RUN LEDGER IS ONE OF THOSE TRACES (TASK-013): which of this machine's runs
 * the account holds, and the uploads still waiting to be tried. It goes here; the
 * settings and the History stay, because they were never the account's.
 */
export async function signOut(options: { deleted?: boolean } = {}): Promise<void> {
  const sb = supabase();
  if (sb) {
    const { data, error } = await sb.auth.getSession();
    if (error && !options.deleted) throw error;
    const account = data.session && !data.session.user.is_anonymous && !options.deleted;
    const id = account ? installationId() : null;
    let code: string | null = null;
    if (id) {
      try {
        await registerDevice(sb, id);
        code = await beginHandoff(sb, id);
      } catch (handoffError: unknown) {
        // A disconnected account may still sign out of this machine. The
        // unchanged device id will need recovery when the server returns.
        logger.warn('device handoff could not start before sign-out', {
          error: errorText(handoffError),
        });
      }
    }
    const signedOut = await sb.auth.signOut({ scope: 'local' });
    if (signedOut.error && !options.deleted) {
      const after = await sb.auth.getSession();
      if (after.error || (data.session && after.data.session?.user.id === data.session.user.id)) {
        throw signedOut.error;
      }
    }
    if (code && id) {
      try {
        const anonymous = await sb.auth.signInAnonymously();
        if (anonymous.error) throw anonymous.error;
        await completeHandoff(sb, id, code);
      } catch (handoffError: unknown) {
        logger.warn('anonymous device handoff failed after sign-out', {
          error: errorText(handoffError),
        });
        const replacement = replaceInstallationId();
        try {
          await registerDevice(sb, replacement);
        } catch (registrationError: unknown) {
          logger.warn('replacement device registration failed', {
            error: errorText(registrationError),
          });
        }
      }
    }
  }
  removeStored('windowsweep:history-cloud');
  clearRunLedger();
}
