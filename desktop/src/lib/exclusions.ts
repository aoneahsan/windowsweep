/**
 * The targets a person has clicked out of the next run, and the ONE rule that
 * decides whether a path is inside one.
 *
 * 🔴 THE RULE IS TRANSCRIBED FROM THE ENGINE, NOT INVENTED HERE. `--exclude-path`
 * protects the named folder AND everything beneath it, and the engine decides that
 * in `lib/safety.ps1` -> `Get-ProtectionReason`:
 *
 *     $pSlash = $p + '\'
 *     $pSlash.StartsWith($root.TrimEnd('\') + '\', OrdinalIgnoreCase)
 *       -or $p.Equals($root, OrdinalIgnoreCase)
 *
 * The `TrimEnd` is load-bearing and is the fix for a real defect: the prefix used
 * to end in a doubled backslash, so only the folder ITSELF was protected and
 * nothing inside it was - which is why self-test check [18c] now asserts on a
 * CHILD path specifically. A copy of this rule that forgets the descendant arm
 * would show a person a folder marked kept while the run deleted its contents.
 *
 * 🔴 This module decides what the WINDOW shows. The engine decides what is
 * actually refused, and it is the only thing that can: the flag reaches it on
 * every run (`engine.ts`), and what it refused comes back in `excluded[]`. Nothing
 * here is a substitute for that - it exists so the figure on screen matches the
 * run rather than contradicting it.
 *
 * 🔴 No path normalisation happens here, deliberately. Both sides are already
 * absolute and resolved: an exclusion root is only ever a `targets[].path` the
 * engine printed, and the engine resolved it with `Get-FullPath` before printing.
 * Adding a second normaliser would be a second opinion about the same string.
 */

/** The one shape this module needs of a row. `ScanTarget` and `Candidate` both fit. */
interface HasPath {
  path: string;
}

const SEP = String.fromCharCode(92); // a backslash, kept out of the string literals below

/** `root` with any trailing separators removed, then exactly one appended. */
function prefixOf(root: string): string {
  let end = root.length;
  while (end > 0 && root[end - 1] === SEP) end -= 1;
  return root.slice(0, end) + SEP;
}

/**
 * Whether `path` is one of the excluded roots, or sits beneath one.
 *
 * Case-insensitive, because Windows paths are and the engine compares with
 * `OrdinalIgnoreCase`.
 */
export function isExcluded(path: string, roots: readonly string[]): boolean {
  if (roots.length === 0) return false;
  const p = path.toLowerCase();
  const pSlash = p + SEP;
  for (const root of roots) {
    const r = root.toLowerCase();
    if (p === r) return true;
    if (pSlash.startsWith(prefixOf(r))) return true;
  }
  return false;
}

/**
 * The rows a run would actually touch.
 *
 * 🔴 ONE derivation with many consumers - the hero figure, the Reclaim button, the
 * safe-run ladder, the Sections table and the status bar all read it. The recorded
 * failure this shape prevents is `reclaimableBytes`, which existed twice and was
 * wrong the same way in both copies.
 */
export function includedOnly<T extends HasPath>(rows: readonly T[], roots: readonly string[]): T[] {
  if (roots.length === 0) return [...rows];
  return rows.filter((row) => !isExcluded(row.path, roots));
}

/** Add a path to the set, or take it out again. Returns a new array either way. */
export function toggleExclusion(roots: readonly string[], path: string): string[] {
  const key = path.toLowerCase();
  const without = roots.filter((root) => root.toLowerCase() !== key);
  return without.length === roots.length ? [...roots, path] : without;
}

/**
 * A stored value made safe to pass.
 *
 * 🔴 The Rust side refuses a value that starts with `--` (`src-tauri/src/args.rs`),
 * because a flag arriving where a value was expected would silently change what
 * the run does. Every path here came from the engine's own output, so the filter
 * never fires in ordinary use - it fires on a hand-edited or corrupted store, and
 * this is the one place the value is read back, which is where a stored number is
 * clamped for exactly the same reason.
 */
export function usableExclusions(roots: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const root of roots) {
    if (typeof root !== 'string') continue;
    const value = root.trim();
    if (!/^[A-Za-z]:\\/.test(value)) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}
