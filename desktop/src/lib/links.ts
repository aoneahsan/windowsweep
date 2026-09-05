/**
 * External-link policy, in one place.
 *
 * 🔴 In a desktop window, "opens in a new tab" means "opens in the SYSTEM
 * browser". A navigation inside the app's own webview replaces the application
 * with a web page and there is no back button to return - the window simply stops
 * being windowsweep. Every absolute URL therefore goes through `openExternal`,
 * and a raw <a href="https://..."> is a lint error.
 *
 * 🔴 Ownership is a HOST AND PATH question, not a host question.
 * `linkedin.com/in/aoneahsan` is his profile; `linkedin.com/sharing/...` is a
 * share endpoint that happens to sit on the same host.
 */

import { openUrl } from '@tauri-apps/plugin-opener';

/** Hosts wholly owned by the author. */
const OWNED_HOSTS = new Set([
  'aoneahsan.com',
  'www.aoneahsan.com',
  'windowsweep-docs.aoneahsan.com',
  'nativeupdate.aoneahsan.com',
  'nativeupdate-docs.aoneahsan.com',
]);

/** Host + path prefix pairs: owned only when the path matches. */
const OWNED_PATHS: [string, string][] = [
  ['github.com', '/aoneahsan/'],
  ['www.npmjs.com', '/package/windowsweep'],
  ['www.npmjs.com', '/~aoneahsan'],
  ['linkedin.com', '/in/aoneahsan'],
  ['www.linkedin.com', '/in/aoneahsan'],
  ['orcid.org', '/0009-0006-2311-8687'],
];

export function isOwnedUrl(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  if (OWNED_HOSTS.has(url.hostname)) return true;
  return OWNED_PATHS.some(([host, prefix]) => url.hostname === host && url.pathname.startsWith(prefix));
}

/**
 * `rel` has no meaning inside a desktop webview, but the policy is recorded here
 * anyway: the same table drives the docs site, and keeping one answer for
 * "is this ours?" is what stops the two drifting.
 */
export function relFor(href: string): string {
  return isOwnedUrl(href) ? 'noopener' : 'noopener nofollow';
}

export async function openExternal(href: string): Promise<void> {
  const url = new URL(href);
  if (url.protocol !== 'https:' && url.protocol !== 'mailto:') {
    throw new Error(`refusing to open a ${url.protocol} link`);
  }
  await openUrl(href);
}
