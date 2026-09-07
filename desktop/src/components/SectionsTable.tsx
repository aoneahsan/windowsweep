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
import type { Section, SectionTier } from '../lib/catalogue';
import type { ScanTarget } from '../lib/cli';

/** Report-only rows have nothing to select. `page-sections.js:60`. */
const REPORT_ONLY: ReadonlySet<SectionTier> = new Set<SectionTier>(['report', 'config']);

function batchBadgeClass(batch: Section['batch']): string {
  if (batch === 'safe') return 'badge-neutral';
  if (batch === 'interactive') return 'badge-warn';
  if (batch === 'deep') return 'badge-danger';
  return 'badge-outline';
}

function DetailRow({
  section,
  targets,
  reportOnly,
}: {
  section: Section;
  targets: ScanTarget[];
  reportOnly: boolean;
}) {
  const { t } = useTranslation();
  return (
    <tr className="detail-row">
      <td colSpan={8}>
        {targets.length === 0 ? (
          <p className="t-xs ink-3">
            {reportOnly ? t('sections.detailReportOnly') : t('sections.detailNothing')}
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) auto',
              gap: 'var(--sp-1) var(--sp-4)',
            }}
          >
            {targets.map((target) => (
              <span key={`${String(section.id)}-${target.path}`} style={{ display: 'contents' }}>
                <span className="mono t-xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {target.path}
                </span>
                <span className="num t-xs ink-3">{formatBytes(target.bytes)}</span>
              </span>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

export function SectionsTable({
  rows,
  scanTargets,
  selection,
  onToggleSelect,
}: {
  rows: Section[];
  scanTargets: ScanTarget[];
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
          <th style={{ width: '6rem' }} className="num-cell">{t('sections.colReclaimable')}</th>
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
          const bytes = targets.reduce((sum, x) => sum + x.bytes, 0);
          const isOpen = open.includes(section.id);

          return [
            <tr key={section.id} data-selected={selected ? 'true' : 'false'}>
              <td>
                {reportOnly ? (
                  <span className="t-xs ink-3" title={t('sections.reportOnlyTitle')}>—</span>
                ) : (
                  <button
                    className="switch"
                    type="button"
                    role="switch"
                    aria-checked={selected}
                    aria-label={t('sections.selectAria', { id: section.id, key: section.key })}
                    style={{ ['--sw-w' as string]: 'calc(1.9rem * var(--density))' }}
                    onClick={() => { onToggleSelect(section.id); }}
                  />
                )}
              </td>
              <td className="num t-sm ink-3">{section.id}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <span className="t-sm" style={{ fontWeight: 600 }}>{section.key}</span>
                  {section.dev ? (
                    <span className="badge badge-outline">{t('sections.badgeDev')}</span>
                  ) : null}
                </div>
                <div
                  className="t-xs ink-3"
                  style={{
                    maxWidth: '46rem',
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
                {reportOnly ? '—' : targets.length === 0 ? t('sections.totalUnmeasured') : formatBytes(bytes)}
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
                        : [...current, section.id],
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
                reportOnly={reportOnly}
              />
            ) : null,
          ];
        })}
      </tbody>
    </table>
  );
}
