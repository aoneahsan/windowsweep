/**
 * The runs table - `history.html:63-80` and `page-history.js` -> `paint`.
 *
 * Six columns in the dummy's order. `When` reads twice: the relative day for a
 * person, the exact local minute for matching a report's file name (S-082). `Mode`
 * is the dry-run / real-run badge; the run's own words - `safe batch`, `sections
 * 1, 2, 3` - head the `Sections` column, from the one vocabulary Home uses too
 * (`lib/run-mode.ts`, D-44).
 *
 * 🔴 EVERY LOCAL ROW OPENS ITS OWN REPORT. The link carries the run's id, and the
 * Report screen reads that run's file, so a row from last month opens last month's
 * report rather than whatever ran last. Its name is the dummy's; the row's `When`
 * is attached as its description, so six identical "Open this run's report" links
 * are told apart by a screen reader.
 *
 * 🔴 `Other machines` IS DECLARED, NOT FAKED (`pending-wave`, TASK-013): a summary
 * from another machine arrives only through cloud sync, which this build does not
 * run, so the chip shows a stated gap in the table's own empty state.
 */

import { useId } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../../lib/format';
import { exactStamp, relativeDay } from '../../lib/history-dates';
import { sectionCountOf, type HistoryFilter } from '../../lib/history-rows';
import { runModeLabel } from '../../lib/run-mode';
import type { HistoryEntry } from '../../state/store';

function HistoryRow({ entry, now, whenId }: { entry: HistoryEntry; now: number; whenId: string }) {
  const { t } = useTranslation();
  return (
    <tr>
      <td id={whenId}>
        <div className="t-sm">{relativeDay(entry.startedAt, now)}</div>
        <div className="t-xs ink-3">{exactStamp(entry.startedAt)}</div>
      </td>
      <td>
        <span className={entry.dryRun ? 'badge badge-outline' : 'badge badge-neutral'}>
          {t(entry.dryRun ? 'history.dryRun' : 'history.realRun')}
        </span>
      </td>
      <td>
        <div className="t-sm">{runModeLabel(entry, t)}</div>
        <div className="t-xs ink-3">{t('history.sections', { count: sectionCountOf(entry.sections) })}</div>
      </td>
      <td className="t-sm ink-3">{t('history.whereThisMachine')}</td>
      {/* A dry-run's figure is its estimate, drawn without the accent - the badge
          beside it says which of the two the number is (`page-history.js:77-79`). */}
      <td className={entry.dryRun ? 'num-cell t-sm' : 'num-cell t-sm accent-ink'}>
        {formatBytes(entry.dryRun ? entry.estimatedBytes : entry.freedBytes)}
      </td>
      <td>
        <Link
          to="/report"
          search={{ view: entry.runId }}
          className="btn btn-sm btn-ghost"
          aria-label={t('history.openAria')}
          aria-describedby={whenId}
        >
          {t('history.openGlyph')}
        </Link>
      </td>
    </tr>
  );
}

/** The table's one empty row, in the words of whichever list is empty. */
function EmptyRow({ filter, hasRuns }: { filter: HistoryFilter; hasRuns: boolean }) {
  const { t } = useTranslation();
  let title = t('history.emptyTitle');
  let body = t('history.emptyBody');
  if (filter === 'otherMachines') {
    title = t('history.cloudEmptyTitle');
    body = t('history.cloudPending');
  } else if (filter === 'dryRuns' && hasRuns) {
    title = t('history.emptyDryTitle');
    body = t('history.emptyDryBody');
  }
  return (
    <tr>
      <td colSpan={6}>
        <div className="empty">
          {/* h2, not the dummy's h3: the page's only other heading is its h1. */}
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
      </td>
    </tr>
  );
}

export function HistoryTable({
  rows,
  filter,
  hasRuns,
  now,
}: {
  rows: readonly HistoryEntry[];
  filter: HistoryFilter;
  hasRuns: boolean;
  now: number;
}) {
  const { t } = useTranslation();
  const baseId = useId();
  return (
    <div className="panel hist-table">
      <div className="xscroll">
        <table className="tbl">
          <thead>
            <tr>
              <th className="hist-col-when">{t('history.colWhen')}</th>
              <th className="hist-col-mode">{t('history.colMode')}</th>
              <th>{t('history.colSections')}</th>
              <th className="hist-col-where">{t('history.colWhere')}</th>
              <th className="num-cell hist-col-freed">{t('history.colFreed')}</th>
              <th className="hist-col-open">
                <span className="visually-hidden">{t('history.colOpen')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <EmptyRow filter={filter} hasRuns={hasRuns} />
            ) : (
              rows.map((entry, i) => (
                <HistoryRow
                  key={`${entry.runId}-${String(i)}`}
                  entry={entry}
                  now={now}
                  whenId={`${baseId}-when-${String(i)}`}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
