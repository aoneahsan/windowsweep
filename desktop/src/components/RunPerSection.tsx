/**
 * Run's `Per section` band. `run.html:71-77`, `page-run.js:34-76`.
 *
 * 🔴 The progress events were already arriving with nowhere to render. Rust routes
 * the engine's `##windowsweep section=NN event=start|end` lines to `clean:progress`
 * and `applyProgress` has been storing them all along; this is the surface that
 * reads them. Nothing here reimplements any cleanup logic - it parses those lines
 * and draws them, which is what the CLI grew them for in 1.1.0.
 *
 * 🔴 A bar fills in ONE step, and that is not a shortcut: the engine reports when
 * a section starts and when it ends, never how far through it is. The dummy slides
 * its bars through 12 / 38 / 64 / 90 on a `setInterval` over invented phases
 * (`page-run.js:161-163`). A bar that crept along while the engine said nothing
 * would be inventing progress.
 *
 * 🔴 THE ONE-STEP BAR IS `prototype`, AND A `prototype` DIFFERENCE CARRIES NO
 * SENTENCE ON SCREEN. The dummy's sliding bar is animation over phases that do not
 * exist; no engine change could make it real, because "how far through a section
 * is" is not a question the engine can answer. An in-app declaration is owed by a
 * `pending-wave` gap only, and this is not one. The note that stood under the rows
 * named the design artefact to a person using the product (D-31, GATE 4 round 7)
 * and carried words the dummy does not have, so it is gone rather than reworded.
 *
 * 🔴 A waiting row shows the scan's figure bare, as the dummy's row does
 * (`page-run.js:51`) - the word `expected` after it was this app's own (D-30).
 *
 * 🔴 AND SINCE D-61 (GATE 4 round 10) THAT FIGURE FOLLOWS THE RECLAIM BUTTON'S
 * RULE, because a waiting row describes what the run would free and that is the
 * same claim. Round 10 read eleven rows totalling 34.3 GB - `pkg 13.7 GB`,
 * `browsers 8.1 GB`, `build 5.1 GB` - above a hero carrying the engine's own
 * 1.9 GB estimate for that exact run, whose rows were `0 B`, `245.0 MB` and
 * `42.6 MB`. The figures are `runFigures` now (`lib/rehearsal.ts`), and the band
 * says once, at rest, which of the two they are.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import { measuredBySection } from '../lib/reclaim';
import type { Catalogue } from '../lib/catalogue';
import type { ProgressEvent, RunSectionResult, ScanTarget } from '../lib/cli';
import { SCAN_PSEUDO_SECTION } from '../lib/cli';

export interface PerSectionRow {
  id: number;
  key: string;
  /** The engine's own word once it has one: `ran`, `skipped`, `refused`, ... */
  status: string;
  /** Reclaimed, once the section has ended. */
  freedBytes: number | null;
  /** What a run would free here, shown while the section is still waiting its turn. */
  expectedBytes: number | null;
  state: 'queued' | 'running' | 'done';
}

/**
 * Merge the three things that know about a section into one row list.
 *
 * 🔴 BIGGEST FIRST, the dummy's own rule (`page-run.js` builds its queue from
 * `db.derive.safeRunSections()`, sorted by bytes) and the order Home's ladder already
 * uses - then the sections with nothing measured, in catalogue order. The key is
 * the scan's figure, which does not change while a run is in flight, so no row moves
 * while a person watches it; a section the finished run has spent keys on what it
 * freed instead. It used to be catalogue order (GATE 4 round 8 prep).
 */
export function perSectionRows({
  catalogue,
  queue,
  progress,
  results,
  scanTargets,
  figures,
  labels,
}: {
  catalogue: Catalogue | null;
  queue: number[];
  progress: Record<number, ProgressEvent>;
  results: RunSectionResult[];
  scanTargets: ScanTarget[];
  /**
   * What a run would free per section (D-61). A section it does not answer for -
   * a `--only` run outside the safe batch - falls back to what the scan measured,
   * which is the honest answer when nothing has rehearsed that run.
   */
  figures: Map<number, number>;
  labels: { queued: string; running: string; done: string };
}): PerSectionRow[] {
  /* 🔴 Once anything has run, the rows are what the ENGINE reported - not the
     safe batch. A run started from Sections carries `--only 1,2`, so listing the
     whole safe batch would have this band describing a queue that never existed.
     The safe batch is only the preview shown before the first run. */
  /* 🔴 `--scan` reports one step with `section: -1` - the scan is not one of the
     numbered sections. Without this filter the band rendered a row reading
     `-1 · -1 · ran · 0 B` after a read-only scan. */
  const reported = [
    ...new Set([...results.map((r) => r.section), ...Object.keys(progress).map(Number)]),
  ]
    .filter((id) => id !== SCAN_PSEUDO_SECTION)
    .sort((a, b) => a - b);
  const ids = reported.length > 0 ? reported : queue;
  const onDisk = measuredBySection(scanTargets);
  const rows = ids.map((id): PerSectionRow => {
    const event = progress[id];
    const result = results.find((r) => r.section === id);
    const ended = event?.event === 'end';
    const state: PerSectionRow['state'] =
      ended || result ? 'done' : event?.event === 'start' ? 'running' : 'queued';
    /* D-61: what this section would free - the shared figure when there is one for
       it, and otherwise the size on disk, which is all a run outside the safe batch
       has ever been able to say. */
    const expected = figures.get(id) ?? onDisk.get(id)?.bytes ?? null;
    return {
      id,
      key: catalogue?.sections.find((s) => s.id === id)?.key ?? String(id),
      status: ended ? (event.status ?? labels.done) : result?.status ?? labels[state],
      freedBytes: ended ? (event.freedBytes ?? null) : (result?.freed_bytes ?? null),
      expectedBytes: expected,
      state,
    };
  });
  const key = (row: PerSectionRow): number => row.expectedBytes ?? row.freedBytes ?? -1;
  /* `ids` is in catalogue order already, and `sort` is stable, so ties keep it. */
  return rows.sort((a, b) => key(b) - key(a));
}

function Row({ row }: { row: PerSectionRow }) {
  const width = row.state === 'done' ? '100%' : '0%';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)' }}>
        <span className="num t-2xs ink-3">{row.id}</span>
        <span className="t-sm">{row.key}</span>
        <span
          className={row.state === 'done' ? 't-xs state-ok' : 't-xs ink-3'}
          style={{ marginInlineStart: 'auto' }}
        >
          {row.status}
        </span>
        <span className="num t-xs">
          {row.freedBytes !== null
            ? formatBytes(row.freedBytes)
            : row.expectedBytes !== null
              ? formatBytes(row.expectedBytes)
              : ''}
        </span>
      </div>
      <div className="prog" style={{ marginTop: 'var(--sp-1)' }}>
        <i
          className="prog-fill"
          style={{ width }}
          {...(row.state === 'done' ? { 'data-tone': 'ok' } : {})}
        />
      </div>
    </div>
  );
}

export function RunPerSection({
  rows,
  basis,
}: {
  rows: PerSectionRow[];
  /**
   * Which figure the waiting rows carry, or `null` once a run has started and they
   * are the engine's own reports rather than a description of a run (D-61).
   */
  basis: 'bound' | 'estimate' | null;
}) {
  const { t } = useTranslation();

  return (
    <div className="c5 rise">
      <div className="zone-label">
        <span className="caps">{t('run.perSection')}</span>
      </div>
      <div
        className="panel pad"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}
      >
        {basis === null ? null : (
          <p className="t-xs ink-3">
            {basis === 'bound' ? t('offer.basisBound') : t('offer.basisEstimate')}
          </p>
        )}
        {rows.length === 0 ? (
          <p className="t-sm ink-3">{t('run.nothingToRun')}</p>
        ) : (
          rows.map((row) => <Row row={row} key={row.id} />)
        )}
      </div>
    </div>
  );
}
