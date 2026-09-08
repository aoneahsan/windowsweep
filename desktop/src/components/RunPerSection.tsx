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
 * 🔴 `pending.runProgress` IS RE-CLASSED `prototype`, AND IT STAYS DECLARED -
 * PERMANENTLY. It is the one declaration on this screen that does not describe
 * unbuilt work, so it is not a `pending-wave` and no later wave closes it. The
 * dummy's sliding bar is animation over phases that do not exist, which is
 * `prototype` under §10a's exemption classes; there is no engine change that would
 * make it real, because "how far through a section is" is not a question the
 * engine can answer - it walks a tree it has not finished measuring. Deleting this
 * sentence would leave a one-step bar with no explanation and read as a defect;
 * leaving it classed `pending-wave` would promise a wave that is never coming.
 * Both are wrong, in opposite directions.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
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
  /** What a scan measured, shown while the section is still waiting its turn. */
  expectedBytes: number | null;
  state: 'queued' | 'running' | 'done';
}

/**
 * Merge the three things that know about a section into one row list, in a fixed
 * order so rows never jump around while a person is watching them.
 */
export function perSectionRows({
  catalogue,
  queue,
  progress,
  results,
  scanTargets,
  labels,
}: {
  catalogue: Catalogue | null;
  queue: number[];
  progress: Record<number, ProgressEvent>;
  results: RunSectionResult[];
  scanTargets: ScanTarget[];
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
  return ids.map((id) => {
    const event = progress[id];
    const result = results.find((r) => r.section === id);
    const targets = scanTargets.filter((x) => x.section === id);
    const ended = event?.event === 'end';
    const state = ended || result ? 'done' : event?.event === 'start' ? 'running' : 'queued';
    return {
      id,
      key: catalogue?.sections.find((s) => s.id === id)?.key ?? String(id),
      status: ended ? (event.status ?? labels.done) : result?.status ?? labels[state],
      freedBytes: ended ? (event.freedBytes ?? null) : (result?.freed_bytes ?? null),
      expectedBytes: targets.length > 0 ? targets.reduce((sum, x) => sum + x.bytes, 0) : null,
      state,
    };
  });
}

function Row({ row }: { row: PerSectionRow }) {
  const { t } = useTranslation();
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
              ? `${formatBytes(row.expectedBytes)} ${t('run.expected')}`
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

export function RunPerSection({ rows }: { rows: PerSectionRow[] }) {
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
        {rows.length === 0 ? (
          <p className="t-sm ink-3">{t('run.nothingToRun')}</p>
        ) : (
          rows.map((row) => <Row row={row} key={row.id} />)
        )}
        {/* The permanent `prototype` declaration for the bar that does not creep.
            Not a gap - a difference from the dummy that will not close. */}
        <p className="t-xs ink-3">{t('pending.runProgress')}</p>
      </div>
    </div>
  );
}
