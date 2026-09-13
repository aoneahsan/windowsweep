/**
 * A selection file, read in the window and matched the way the engine matches one.
 *
 * `picker.html`'s "Drive this from a file instead" field. The file is read in the
 * webview and never leaves the machine: nothing is uploaded, and nothing about it
 * reaches the engine except the rows it ticks - which "Remove these" then writes
 * into the run's own select file, exactly as it does a row ticked by hand.
 *
 * 🔴 THE ENGINE'S READING, NOT A SECOND ONE. `windowsweep.ps1` reads a
 * `--select-file` with `ReadAllLines`, trims every line and skips blank lines and
 * `#` comments; `lib/ui.ps1` -> `Resolve-SelectedPaths` then compares each line with
 * the prompt's candidate paths case-insensitively, and notes every line that matched
 * nothing ("no candidate here matches <line>") rather than failing the run over it.
 * Both halves are mirrored here, so the rows a file ticks in this window are the
 * rows the engine would pick from the same file.
 *
 * 🔴 THE LIMITS SHOWN ARE THE LIMITS ENFORCED. The field's info affordance and hint
 * print ".txt or .list" and "256 KB", and these are the numbers `refuseSelectionFile`
 * checks - "a limit shown that is not enforced, or enforced and not shown, is the
 * same defect twice" (the dummy gallery's own note under this field).
 */

/** The largest file read: the "256 KB" the hint and the tooltip print. */
export const SELECTION_FILE_MAX_BYTES = 256 * 1024;

/** The extensions accepted, lower-case, as the tooltip lists them. */
export const SELECTION_FILE_TYPES: readonly string[] = ['.txt', '.list'];

/** Why a file was refused before a line of it was read. */
export type SelectionFileRefusal =
  | { reason: 'type'; name: string }
  | { reason: 'size'; bytes: number };

/** What one file, read against one section's candidates, found. */
export interface SelectionFileMatch {
  /** Path lines the file carried, once blank lines and comments are skipped. */
  lines: number;
  /** How many of those lines named a candidate on offer. */
  matchedLines: number;
  /** The candidate paths to tick, in the candidates' own spelling. */
  paths: string[];
  /** Every line that matched nothing, once each, as the file spelled it. */
  unmatched: string[];
}

/**
 * Refuse a file by its name and size alone, before reading a byte of it.
 * Returns `null` for a file the field accepts.
 */
export function refuseSelectionFile(file: { name: string; size: number }): SelectionFileRefusal | null {
  const name = file.name.toLowerCase();
  if (!SELECTION_FILE_TYPES.some((ext) => name.endsWith(ext))) return { reason: 'type', name: file.name };
  if (file.size > SELECTION_FILE_MAX_BYTES) return { reason: 'size', bytes: file.size };
  return null;
}

/**
 * The path lines in a file's text, as the engine reads them: split on any line
 * break, every line trimmed (which also drops a leading byte-order mark), blank
 * lines and `#` comments skipped.
 */
export function selectionLines(text: string): string[] {
  return text
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'));
}

/**
 * Match path lines against the candidates ONE section offers, case-insensitively.
 *
 * Only that section's paths are passed in, which is the engine's own scoping: the
 * same file is offered to every interactive prompt, so a line naming a path from
 * another section is "no candidate here", never an error.
 */
export function matchSelection(
  lines: readonly string[],
  candidatePaths: readonly string[],
): SelectionFileMatch {
  const byKey = new Map<string, string[]>();
  for (const path of candidatePaths) {
    const key = path.toLowerCase();
    byKey.set(key, [...(byKey.get(key) ?? []), path]);
  }
  const paths = new Set<string>();
  const missed = new Set<string>();
  let matchedLines = 0;
  for (const line of lines) {
    const hits = byKey.get(line.toLowerCase());
    if (hits) {
      matchedLines += 1;
      for (const path of hits) paths.add(path);
    } else {
      missed.add(line);
    }
  }
  return { lines: lines.length, matchedLines, paths: [...paths], unmatched: [...missed] };
}
