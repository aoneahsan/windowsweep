/**
 * The one way to reach the development stand-in.
 *
 * 🔴 A DYNAMIC import behind a build-time constant. `engine.ts` and `updater.ts`
 * each grew their own copy of this three-line gate, and both carry the same
 * recorded reason: gating only the CALL SITES of a statically imported module was
 * measurably not enough. Vite eliminated the identifiers, the module stayed in the
 * graph, and its string literals shipped to `dist/` anyway - two of five needles
 * present, with a control proving the grep worked.
 *
 * `import.meta.env.DEV` is a literal `false` in a production build, so this whole
 * function collapses and `./dev-engine` is never reached. It is never a runtime
 * environment variable: a runtime comparison survives into the bundle with all the
 * code behind it, which is how a project shipped a dev-only gallery route with
 * every gate green.
 *
 * Written once here rather than a fourth time inline. The two existing gates are
 * deliberately left alone - they are load-bearing, they are correct, and
 * rewriting them to import this would put the leak gate's evidence at risk for a
 * tidiness that buys nothing.
 *
 * Verify it the only way that counts: grep `dist/` for `DEV_MARKER` from
 * `dev-engine.ts`, with a control string that must be found.
 */
export async function devEngine(): Promise<typeof import('./dev-engine') | null> {
  if (!import.meta.env.DEV) return null;
  /* Inside a real Tauri window the real commands exist, so the stand-in must not
     answer even in development - or a developer would be reading fixtures while
     believing they were reading their own disk. */
  if ('__TAURI_INTERNALS__' in window) return null;
  return import('./dev-engine');
}
