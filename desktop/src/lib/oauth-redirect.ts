/**
 * The loopback address Supabase sends one sign-in back to.
 *
 * 🔴 THE STATE RIDES IN THIS ADDRESS, BECAUSE NOTHING ELSE CARRIES IT BACK. Supabase
 * keeps its own `state` with Google and never forwards one to `redirect_to`. What it
 * does keep is the query `redirect_to` already has: on success it adds `code`, on a
 * refusal `error` (GoTrue v2.197.0, `prepPKCERedirectURL` and `redirectErrors`, read
 * 2026-09-28). A state placed here therefore comes back beside the code, where the Rust
 * listener compares it. Until 1.3.2 this address carried no state at all, so the
 * listener refused every desktop sign-in with "the sign-in reply did not match the
 * request that started it" - the Firebase flow before it had put the state on Google's
 * own address, and Google echoed it.
 *
 * No `/` before the `?`: the project's allow-list entry is `http://127.0.0.1:*`, and this
 * form stays inside that pattern even if Supabase ever stopped accepting every loopback
 * address by itself (RFC 8252 section 7.3, which it does today).
 */
export function loopbackRedirect(port: number, state: string): string {
  return `http://127.0.0.1:${String(port)}?state=${encodeURIComponent(state)}`;
}
