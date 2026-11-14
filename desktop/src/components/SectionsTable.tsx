/**
 * The section catalogue as the dummy's eight-column table. `sections.html:59-92`,
 * `page-sections.js:49-193`.
 *
 * The app's table had four columns - #, Key, What it touches, What it needs - and
 * the dummy specifies eight: a select switch, #, Section (key over title), Tier,
 * Batch, Needs, Reclaimable, and an expander showing what the section declares.
 *
 * 🔴 Every column reads the catalogue the engine printed at startup. The bytes
 * come from the last `--scan`; a section nothing has measured shows nothing
 * rather than a zero, because a zero here reads as "this section is empty".
 *
 * The open rows are local state on purpose. Filter and search are linkable and
 * live in the URL; which disclosure a person has flipped open is transient, and
 * 26 booleans in a query string is not a link anybody would send.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import { isInstallSection, type Section, type SectionTier } from '../lib/catalogue';
import { idleDaysOf, type Candidate, type ScanTarget } from '../lib/cli';
import { downloadOf, installVerb, reclaimOf } from '../lib/candidate-extras';

/** Report-only rows have nothing to select. `page-sections.js:60`. */
const REPORT_ONLY: ReadonlySet<SectionTier> = new Set<SectionTier>(['report', 'config']);

const VERB_KEY = {
  install: 'picker.verb.install',
  remove: 'picker.verb.remove',
} as const;

/**
 * An install section's detail (1.5.0, A4-02): what each offered row fetches or reclaims and what it
 * does - it has no path on disk and no idle age. `page-sections.js` `updateDetail`.
 */
function UpdateDetail({ rows }: { rows: Candidate[] }) {
  const { t } = useTranslation();
  return (
    <>
      {rows.map((row) => {
        const verb = installVerb(row);
        const download = downloadOf(row);
        return (
          <span key={row.path} style={{ display: 'contents' }}>
            <span className="t-xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {row.label ?? row.path}
            </span>
            <span className="num t-xs ink-3">
              {verb === 'remove'
                ? t('sections.detailReclaims', { size: formatBytes(row.bytes) })
                : download === null
                  ? t('picker.sizeUnknown')
                  : t('sections.detailDownload', { size: formatBytes(download) })}
            </span>
            <span className="t-xs ink-3">{t(VERB_KEY[verb])}</span>
          </span>
        );
      })}
    </>
  );
}

function batchBadgeClass(batch: Section['batch']): string {
  if (batch === 'safe') return 'badge-neutral';
  if (batch === 'interactive') return 'badge-warn';
  if (batch === 'deep') return 'badge-danger';
  return 'badge-outline';
}

function DetailRow({
  section,
  targets,
  offered,
  reportOnly,
}: {
  section: Section;
  targets: ScanTarget[];
  /** An install section's offered rows; empty for every other tier. */
  offered: Candidate[];
  reportOnly: boolean;
}) {
  const { t } = useTranslation();
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) auto auto',
    gap: 'var(--sp-1) var(--sp-4)',
  };
  if (isInstallSection(section)) {
    return (
      <tr className="detail-row">
        <td colSpan={8}>
          {offered.length === 0 ? (
            <p className="t-xs ink-3">{t('sections.detailNothing')}</p>
          ) : (
            <div style={grid}>
              <UpdateDetail rows={offered} />
            </div>
          )}
        </td>
      </tr>
    );
  }
  return (
    <tr className="detail-row">
      <td colSpan={8}>
        {targets.length === 0 ? (
          <p className="t-xs ink-3">
            {reportOnly ? t('sections.detailReportOnly') : t('sections.detailNothing')}
          </p>
        ) : (
          /* 🔴 THREE columns, which is the dummy's own shape here
             (`page-sections.js:159-169`): path, size, and how long it has sat
             unused. The third was missing while `--scan` reported no age; the
             1.2.0 engine reports `newest_write_utc` per target, so it is the
             same measurement the map shades tiles with, printed as a number. */
          <div style={grid}>
            {targets.map((target) => {
              const idle = idleDaysOf(target.newest_write_utc);
              return (
                <span key={`${String(section.id)}-${target.path}`} style={{ display: 'contents' }}>
                  <span
                    className="mono t-xs"
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {target.path}
                  </span>
                  <span className="num t-xs ink-3">{formatBytes(target.bytes)}</span>
                  {/* A target with no stamp says so rather than printing `idle 0d`,
                      which would read as "used today". */}
                  <span className="t-xs ink-3">
                    {idle === null
                      ? t('sections.detailIdleUnknown')
                      : t('sections.detailIdle', { days: idle })}
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </td>
    </tr>
  );
}

export function SectionsTable({
  rows,
  scanTargets,
  candidates,
  selection,
  onToggleSelect,
}: {
  rows: Section[];
  scanTargets: ScanTarget[];
  /** What the interactive sections offered - an install section's rows and reclaim come from here. */
  candidates: Candidate[];
  selection: number[];
  onToggleSelect: (id: number) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<readonly number[]>([]);

  return (
    <table className="tbl">
      <thead>
        <tr>
          <th style={{ width: '2.4rem' }}>
            <span className="visually-hidden">{t('sections.colSelect')}</span>
          </th>
          <th style={{ width: '3rem' }}>{t('sections.colId')}</th>
          <th>{t('sections.colSection')}</th>
          <th style={{ width: '7.5rem' }}>{t('sections.colTier')}</th>
          <th style={{ width: '6rem' }}>{t('sections.colBatch')}</th>
          <th style={{ width: '5rem' }}>{t('sections.colNeeds')}</th>
          <th style={{ width: '6rem' }} className="num-cell">
            {t('sections.colReclaimable')}
          </th>
          <th style={{ width: '2.5rem' }}>
            <span className="visually-hidden">{t('sections.colExpand')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((section) => {
          const reportOnly = REPORT_ONLY.has(section.tier);
          const selected = selection.includes(section.id);
          const targets = scanTargets.filter((x) => x.section === section.id);
          /* 🔴 An install section reclaims only what 31's old packages free (A4-02): its
             figure is the offered rows' `reclaimOf`, never a download, and a dash at zero. */
          const update = isInstallSection(section);
          const offered = update ? candidates.filter((c) => c.section === section.id) : [];
          const bytes = update
            ? offered.reduce((sum, c) => sum + reclaimOf(c, true), 0)
            : targets.reduce((sum, x) => sum + x.bytes, 0);
          const isOpen = open.includes(section.id);

          return [
            <tr key={section.id} data-selected={selected ? 'true' : 'false'}>
              <td>
                {reportOnly ? (
                  <span className="t-xs ink-3" title={t('sections.reportOnlyTitle')}>
                    —
                  </span>
                ) : (
                  <button
                    className="switch"
                    type="button"
                    role="switch"
                    aria-checked={selected}
                    aria-label={t('sections.selectAria', { id: section.id, key: section.key })}
                    style={{ ['--sw-w' as string]: 'calc(1.9rem * var(--density))' }}
                    onClick={() => {
                      onToggleSelect(section.id);
                    }}
                  />
                )}
              </td>
              <td className="num t-sm ink-3">{section.id}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <span className="t-sm" style={{ fontWeight: 600 }}>
                    {section.key}
                  </span>
                  {section.dev ? (
                    <span className="badge badge-outline">{t('sections.badgeDev')}</span>
                  ) : null}
                </div>
                {/* 🔴 The title YIELDS to its cell (1.5.0, A4-02): the engine's 26-32 titles
                    are long, and a fixed 46rem line pushed Reclaimable and the expander off
                    the table at 1440. One line, ellipsised; the full words stay in the cell
                    for assistive tech and in the hover title. */}
                <div
                  className="t-xs ink-3"
                  title={section.title}
                  style={{
                    width: 0,
                    minWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {section.title}
                </div>
              </td>
              <td>
                <span className={`tier tier-${section.tier}`}>
                  <span className="t-xs">{section.tier}</span>
                </span>
              </td>
              <td>
                <span className={`badge ${batchBadgeClass(section.batch)}`}>{section.batch}</span>
              </td>
              <td>
                {section.admin ? (
                  <span className="badge badge-danger">{t('sections.admin')}</span>
                ) : section.batch === 'interactive' ? (
                  <span className="badge badge-warn">{t('sections.badgeYou')}</span>
                ) : (
                  <span className="t-xs ink-3">—</span>
                )}
              </td>
              <td className={`num-cell t-sm${!reportOnly && bytes > 0 ? ' accent-ink' : ''}`}>
                {reportOnly || (update && bytes === 0)
                  ? '—'
                  : !update && targets.length === 0
                    ? t('sections.totalUnmeasured')
                    : formatBytes(bytes)}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-ghost"
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={t('sections.expandAria', { id: section.id })}
                  onClick={() => {
                    setOpen((current) =>
                      current.includes(section.id)
                        ? current.filter((x) => x !== section.id)
                        : [...current, section.id]
                    );
                  }}
                >
                  {isOpen ? '▴' : '▾'}
                </button>
              </td>
            </tr>,
            isOpen ? (
              <DetailRow
                key={`${String(section.id)}-detail`}
                section={section}
                targets={targets}
                offered={offered}
                reportOnly={reportOnly}
              />
            ) : null,
          ];
        })}
      </tbody>
    </table>
  );
}
