/**
 * Google sign-in for a desktop application, through Supabase Auth.
 *
 * 🔴 PKCE in the SYSTEM browser, not an embedded webview. Google refuses the
 * OAuth flow inside one, and an app that asks for a Google password in its own
 * window teaches the exact habit phishing relies on. The system browser shows the
 * real address bar.
 *
 * 🔴 Sign-in is never a gate. Every cleanup feature works signed out; an account
 * adds settings sync and run history across machines, and nothing else. The
 * engine itself has no account and makes no network calls at all.
 *
 * 🔴 No secret exists here. `VITE_SUPABASE_PUBLISHABLE_KEY` is a public client
 * key whose whole security model is RLS - it is meant to ship in a bundle. The
 * secret key never touches this process.
 *
 * The Rust loopback listener (`oauth_listen_start` / `oauth_listen_await`) is
 * unchanged from the Firebase version: a browser page cannot bind a port, the
 * `state` check happens on the Rust side, and Supabase's PKCE flow needs exactly
 * the same redirect. Only the exchange changed.
 */

import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { invoke } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';

import { supabaseConfig } from './config';

export interface AuthUser {
  /** `auth.users.id` - the value every RLS policy compares against. */
  uid: string;
  email: string;
  displayName: string | null;
}

let client: SupabaseClient | null = null;

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

/**
 * Run the whole flow: ask Rust for a loopback port, ask Supabase for the provider
 * URL bound to it, open the system browser, wait for the code, exchange it.
 */
export async function signIn(): Promise<AuthUser> {
  const sb = supabase();
  if (!sb) throw new Error('sign-in is not configured in this build');

  // Rust binds 127.0.0.1 on a free port and reports which one, so the redirect
  // URI is exact rather than a guess at a port that might be taken.
  const state = crypto.randomUUID();
  const port = await invoke<number>('oauth_listen_start', { state });
  const redirectTo = `http://127.0.0.1:${String(port)}`;

  const { data, error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      // The SDK must not navigate this window - it would replace the app.
      skipBrowserRedirect: true,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });
  if (error) throw new Error(`sign-in could not start: ${error.message}`);
  if (!data.url) throw new Error('sign-in could not start: no provider URL');

  await openUrl(data.url);
  const code = await invoke<string>('oauth_listen_await', { timeoutSecs: 300 });

  const exchanged = await sb.auth.exchangeCodeForSession(code);
  if (exchanged.error) throw new Error(`sign-in failed: ${exchanged.error.message}`);
  if (!exchanged.data.session) throw new Error('sign-in returned no session');
  return toUser(exchanged.data.session);
}

/** The session the SDK restored, if any. Called once at boot. */
export async function currentUser(): Promise<AuthUser | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session ? toUser(data.session) : null;
}

/** 🔴 Signing out clears every local trace of the account, cached rows included. */
export async function signOut(): Promise<void> {
  const sb = supabase();
  if (sb) await sb.auth.signOut();
  try {
    window.localStorage.removeItem('windowsweep:history-cloud');
  } catch {
    /* nothing cached, or storage unavailable */
  }
}
