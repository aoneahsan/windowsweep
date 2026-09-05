/**
 * Google sign-in for a desktop application: PKCE in the SYSTEM browser, with a
 * loopback redirect, exchanged through Identity Toolkit REST.
 *
 * 🔴 Not an embedded webview. Google refuses the OAuth flow inside one, and an
 * app that asks for a Google password in its own window is teaching the exact
 * habit that phishing relies on. The system browser shows the real address bar.
 *
 * 🔴 Sign-in is never a gate. Every cleanup feature in this app works signed out;
 * an account adds settings sync and run history across machines, and nothing else.
 * The engine itself has no account and no network at all.
 *
 * 🔴 No client SECRET exists here. A desktop client is a public client - PKCE is
 * what makes that safe, and a secret shipped in an installer is not a secret.
 */

import { invoke } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  idToken: string;
  refreshToken: string;
  /** Epoch millis. Refreshed well before this. */
  expiresAt: number;
}

export interface AuthConfig {
  /** The Google OAuth *desktop* client id. Owner row 15; absent means sign-in is off. */
  googleClientId: string | undefined;
  /** Firebase Web API key, used only for the Identity Toolkit exchange. */
  firebaseApiKey: string | undefined;
}

const IDENTITY_TOOLKIT = 'https://identitytoolkit.googleapis.com/v1';
const SECURE_TOKEN = 'https://securetoken.googleapis.com/v1';
const AUTH_STORAGE_KEY = 'windowsweep:auth';

function base64Url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function pkcePair(): Promise<{ verifier: string; challenge: string }> {
  const raw = new Uint8Array(32);
  crypto.getRandomValues(raw);
  const verifier = base64Url(raw);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return { verifier, challenge: base64Url(new Uint8Array(digest)) };
}

/**
 * Run the whole flow. The Rust side owns the loopback listener because a browser
 * page cannot bind a port; it returns the `code` once Google redirects to it.
 */
export async function signIn(config: AuthConfig): Promise<AuthUser> {
  if (!config.googleClientId) throw new Error('sign-in is not configured in this build');
  if (!config.firebaseApiKey) throw new Error('sign-in is not configured in this build');

  const { verifier, challenge } = await pkcePair();
  const state = base64Url(crypto.getRandomValues(new Uint8Array(16)));

  // Rust binds 127.0.0.1 on a free port and reports which one, so the redirect
  // URI is exact rather than a guess at a port that might be taken.
  const port = await invoke<number>('oauth_listen_start', { state });
  const redirectUri = `http://127.0.0.1:${port}`;

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', config.googleClientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('state', state);
  await openUrl(url.toString());

  const code = await invoke<string>('oauth_listen_await', { timeoutSecs: 300 });

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.googleClientId,
      code,
      code_verifier: verifier,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });
  if (!tokenResponse.ok) throw new Error(`Google refused the exchange (${tokenResponse.status})`);
  const tokens = (await tokenResponse.json()) as { id_token?: string };
  if (!tokens.id_token) throw new Error('Google returned no identity token');

  const idpResponse = await fetch(
    `${IDENTITY_TOOLKIT}/accounts:signInWithIdp?key=${encodeURIComponent(config.firebaseApiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        postBody: `id_token=${tokens.id_token}&providerId=google.com`,
        requestUri: redirectUri,
        returnSecureToken: true,
      }),
    },
  );
  if (!idpResponse.ok) throw new Error(`sign-in failed (${idpResponse.status})`);
  const account = (await idpResponse.json()) as {
    localId: string; email: string; displayName?: string; idToken: string; refreshToken: string; expiresIn: string;
  };

  const user: AuthUser = {
    uid: account.localId,
    email: account.email,
    displayName: account.displayName ?? null,
    idToken: account.idToken,
    refreshToken: account.refreshToken,
    expiresAt: Date.now() + Number(account.expiresIn) * 1000,
  };
  persist(user);
  return user;
}

/** Exchange the refresh token. Called whenever a request is within five minutes of expiry. */
export async function refresh(user: AuthUser, apiKey: string): Promise<AuthUser> {
  const res = await fetch(`${SECURE_TOKEN}/token?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: user.refreshToken }),
  });
  if (!res.ok) throw new Error('the session could not be renewed - sign in again');
  const body = (await res.json()) as { id_token: string; refresh_token: string; expires_in: string };
  const next: AuthUser = {
    ...user,
    idToken: body.id_token,
    refreshToken: body.refresh_token,
    expiresAt: Date.now() + Number(body.expires_in) * 1000,
  };
  persist(next);
  return next;
}

export async function validToken(user: AuthUser, apiKey: string): Promise<AuthUser> {
  return user.expiresAt - Date.now() > 5 * 60 * 1000 ? user : refresh(user, apiKey);
}

function persist(user: AuthUser): void {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ v: user }));
  } catch { /* the session simply does not survive a restart */ }
}

export function readStoredUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: AuthUser };
    return parsed.v ?? null;
  } catch {
    return null;
  }
}

/** 🔴 Signing out clears every local trace of the account, including cached rows. */
export function signOut(): void {
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch { /* ignore */ }
}
