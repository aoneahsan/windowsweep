/**
 * Run - the log as it arrives, section by section, with the number at the end.
 *
 * Translated from `run.html`. The engine's own log is shown rather than a
 * paraphrase of it: the point of this screen is that a person can see exactly
 * what the tool said, in the order it said it, and find the same text in the log
 * file afterwards.
 */

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { formatBytes } from '../lib/format';

export function RunScreen() {
  const { t } = useTranslation();
  const phase = useStore((s) => s.phase);
  const log = useStore((s) => s.log);
  const progress = useStore((s) => s.progress);
  const summary = useStore((s) => s.summary);
  const catalogue = useStore((s) => s.catalogue);

  const tailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    tailRef.current?.scrollTo({ top: tailRef.current.scrollHeight });
  }, [log.length]);

  const done = Object.values(progress).filter((p) => p.event === 'end').length;
  const running = Object.values(progress).find((p) => p.event === 'start' && progress[p.section]?.event !== 'end');

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">
            {phase === 'running' ? t('run.eyebrowRunning') : phase === 'failed' ? t('run.eyebrowFailed') : t('run.eyebrowDone')}
          </p>
          <h1 className="t-xl wide">
            {phase === 'running'
              ? t('run.titleRunning', { done })
              : summary
                ? summary.dry_run
                  ? t('run.titleDryRun', { amount: formatBytes(summary.estimated_bytes) })
                  : t('run.titleDone', { amount: formatBytes(summary.freed_bytes) })
                : t('run.titleUnknown')}
          </h1>
          {summary?.dry_run ? <p className="lede">{t('run.dryRunNote')}</p> : null}
          {running && catalogue ? (
            <p className="t-sm ink-3">
              {t('run.currentSection', {
                id: running.section,
                title: catalogue.sections.find((s) => s.id === running.section)?.title ?? '',
              })}
            </p>
          ) : null}
        </div>
      </section>

      <section className="band band-well band-tight">
        <div className="wrap">
          <div className="zone-label">
            <span className="caps">{t('run.logTitle')}</span>
          </div>
          <div className="panel pad logpane" ref={tailRef} style={{ maxHeight: '26rem', overflowY: 'auto' }}>
            {log.length === 0 ? (
              <p className="t-sm ink-3">{t('run.logEmpty')}</p>
            ) : (
              log.map((entry, i) => (
                <div className="t-sm mono" key={`${String(entry.at)}-${String(i)}`}>
                  {entry.line}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {summary ? (
        <section className="band band-app band-tight">
          <div className="wrap">
            <div className="zone-label">
              <span className="caps">{t('run.perSection')}</span>
            </div>
            <div className="xscroll" style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>{t('run.colSection')}</th>
                    <th>{t('run.colStatus')}</th>
                    <th>{t('run.colFreed')}</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.sections.map((s) => (
                    <tr key={s.section}>
                      <td>
                        <span className="num">{s.section}</span>{' '}
                        {catalogue?.sections.find((x) => x.id === s.section)?.key ?? ''}
                      </td>
                      <td>{s.status}</td>
                      <td className="num">{formatBytes(s.freed_bytes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
