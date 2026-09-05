/**
 * Report - the last run, section by section, from the file the engine wrote.
 *
 * Translated from `report.html`. 🔴 Every section key here comes from the
 * catalogue, never from a list in this file. The dummy once named four sections
 * by keys the engine does not use, on the one screen whose own disclosure claims
 * it cannot disagree with the file on disk - deriving the key removes the class of
 * defect rather than the instance.
 */

import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { formatBytes } from '../lib/format';
import { PERMANENT_TIERS } from '../lib/catalogue';

export function Report() {
  const { t } = useTranslation();
  const summary = useStore((s) => s.summary);
  const catalogue = useStore((s) => s.catalogue);

  if (!summary) {
    return (
      <section className="band band-app">
        <div className="wrap wrap-narrow">
          <p className="caps ink-3">{t('report.eyebrow')}</p>
          <h1 className="t-lg wide">{t('report.emptyTitle')}</h1>
          <p className="lede">{t('report.emptyBody')}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">{t('report.eyebrow')}</p>
          <h1 className="t-xl wide">
            {summary.dry_run
              ? t('run.titleDryRun', { amount: formatBytes(summary.estimated_bytes) })
              : t('run.titleDone', { amount: formatBytes(summary.freed_bytes) })}
          </h1>
          <p className="t-sm ink-3">
            {t('report.meta', {
              mode: summary.mode,
              version: summary.version,
              sections: summary.sections.length,
            })}
          </p>
        </div>
      </section>

      <section className="band band-well band-tight">
        <div className="wrap">
          <div className="xscroll" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>{t('sections.colId')}</th>
                  <th>{t('sections.colKey')}</th>
                  <th>{t('run.colStatus')}</th>
                  <th>{t('run.colFreed')}</th>
                  <th>{t('report.colNote')}</th>
                </tr>
              </thead>
              <tbody>
                {summary.sections.map((row) => {
                  const meta = catalogue?.sections.find((s) => s.id === row.section);
                  return (
                    <tr key={row.section}>
                      <td className="num">{row.section}</td>
                      {/* derived from the catalogue, never a literal in this file */}
                      <td className="mono">{meta?.key ?? String(row.section)}</td>
                      <td>
                        {row.status}
                        {meta && PERMANENT_TIERS.has(meta.tier) ? (
                          <span className="badge badge-danger" style={{ marginInlineStart: 'var(--sp-2)' }}>
                            {t('sections.permanent')}
                          </span>
                        ) : null}
                      </td>
                      <td className="num">{formatBytes(row.freed_bytes)}</td>
                      <td className="t-sm ink-3">{meta?.title ?? ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {summary.report_file ? (
            <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>
              {t('report.onDisk')} <code className="mono">{summary.report_file}</code>
            </p>
          ) : null}
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
