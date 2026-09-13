/**
 * What the interactive sections have offered, merged run by run and section by
 * section.
 *
 * 🔴 D-23 (GATE 4 round 7): THE PICKER NEVER RECEIVED A CANDIDATE. Only Home's
 * scan path stored them, and Home only ever runs `--scan` or the safe batch -
 * neither of which reaches an interactive section. The one path that does, the
 * Sections screen's Dry-run, threw its summary's candidates away. So "Remove
 * these" was built, advertised and unreachable. The store now folds EVERY run's
 * summary through `mergeOffers`, which is how every path gets it.
 *
 * 🔴 PER SECTION, NEVER PER RUN. Replacing the list with each summary's
 * `candidates[]` would have been the obvious fix and a new defect: a scan, a safe
 * batch or a Reclaim carries no candidates at all, so the next one of those would
 * have emptied the Picker again. A run only speaks for the interactive sections it
 * actually ran - every other section keeps what it had.
 *
 * 🔴 A REHEARSAL ESTABLISHES A LIST; A REAL RUN SPENDS IT. A dry-run of section 23
 * that offered eight rows makes those eight the list, and one that offered none
 * makes "nothing on this machine" a known fact rather than a gap. A real run over
 * 23 has just deleted some of them, so its list is dropped and the section reads
 * "nothing offered yet" until something asks again - the same rule the store
 * already applies to scan targets after a real run.
 */

import type { Catalogue } from './catalogue';
import type { Candidate, RunSummary } from './cli';

export interface Offers {
  /** Every row an interactive section has offered that nothing has spent since. */
  candidates: Candidate[];
  /**
   * The interactive sections whose list is KNOWN - searched by a rehearsal and not
   * spent since - including the ones that offered nothing.
   *
   * 🔴 A separate fact from "has rows", for the reason `scannedAt` is separate
   * from the scan's rows: "asked, and there is nothing here" and "never asked"
   * need different words, and only the first may say the section found nothing.
   */
  offeredSections: number[];
}

/** The interactive sections, from the catalogue's own `batch` - never a list kept here. */
export function interactiveSectionIds(catalogue: Catalogue | null): Set<number> {
  return new Set(
    (catalogue?.sections ?? []).filter((section) => section.batch === 'interactive').map((section) => section.id),
  );
}

/**
 * Fold one run's summary into what is on offer.
 *
 * Step statuses are the engine's own (`modules/runner.ps1` -> `Invoke-SectionById`):
 * `dry-run` means a rehearsal ran the section's finder to the end, `ran` means a
 * real run did, `failed` means the finder threw part-way. `refused` and `skipped`
 * mean the section never ran, so they change nothing.
 *
 * Returns `previous` itself when the run touched no interactive section, so a
 * scan does not hand every subscriber a new array to re-render over.
 */
export function mergeOffers(previous: Offers, summary: RunSummary, interactive: ReadonlySet<number>): Offers {
  const established = new Set<number>();
  const spent = new Set<number>();
  for (const step of summary.sections) {
    if (!interactive.has(step.section)) continue;
    if (summary.dry_run && step.status === 'dry-run') established.add(step.section);
    else if (step.status === 'ran' || step.status === 'failed') spent.add(step.section);
  }
  if (established.size === 0 && spent.size === 0) return previous;

  const changed = new Set([...established, ...spent]);
  return {
    candidates: [
      ...previous.candidates.filter((row) => !changed.has(row.section)),
      ...summary.candidates.filter((row) => established.has(row.section)),
    ],
    offeredSections: [
      ...previous.offeredSections.filter((id) => !changed.has(id)),
      ...established,
    ].sort((a, b) => a - b),
  };
}
