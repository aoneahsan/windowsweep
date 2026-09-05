/**
 * Elevation - a SAFETY SURFACE. Humor is off entirely.
 *
 * Translated from `elevation.html`. 🔴 windowsweep never elevates itself, and this
 * screen says so. What makes that true rather than a claim: the app passes
 * `--elevate` to the ENGINE, which opens the second window; the Rust side requests
 * no privilege of its own, and its argument allowlist is what stops the webview
 * asking for anything else.
 *
 * The SmartScreen note is here rather than hidden, because meeting that dialog
 * unexplained is worse than reading about it in advance. It names the two
 * artefacts a reader can actually check, and says plainly that neither is a
 * code-signing certificate.
 */

import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { elevatedArgs, newRunId, run } from '../lib/engine';

export function Elevation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const catalogue = useStore((s) => s.catalogue);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const [busy, setBusy] = useState(false);

  const admin = (catalogue?.sections ?? []).filter((s) => s.admin);

  function go(dryRun: boolean) {
    setBusy(true);
    const id = newRunId();
    startRun(id);
    if (!dryRun) void navigate({ to: '/run' });
    void run(elevatedArgs(admin.map((s) => s.id), dryRun), id, {
      onLog: appendLog,
      onProgress: (section, event, status, freedBytes) => {
        applyProgress({
          section,
          event,
          ...(status ? { status } : {}),
          ...(freedBytes !== undefined ? { freedBytes } : {}),
        });
      },
    })
      .then((r) => { finishRun(r.summary, r.exitCode > 1); })
      .finally(() => { setBusy(false); });
  }

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">{t('elevation.eyebrow')}</p>
          <h1 className="t-xl wide">{t('elevation.title', { count: admin.length })}</h1>
          <p className="lede">{t('elevation.lede')}</p>
        </div>
      </section>

      <section className="band band-app band-tight">
        <div className="wrap">
          <div className="cards">
            {admin.map((s) => (
              <div className="card" key={s.id}>
                <div className="card-bd">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}
                  >
                    <span className="num t-sm ink-3">{s.id}</span>
                    <span className="t-base" style={{ fontWeight: 600 }}>
                      {s.key}
                    </span>
                    <span className="badge badge-danger">{t('sections.admin')}</span>
                    {s.batch === 'deep' ? (
                      <span className="badge badge-warn">{t('elevation.deep')}</span>
                    ) : null}
                  </div>
                  <p className="t-sm ink-3">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-well band-tight">
        <div className="wrap">
          <h2 className="t-md wide">{t('elevation.whatHappens')}</h2>
          <div className="tl" style={{ marginTop: 'var(--sp-4)', maxWidth: '44rem' }}>
            {(['asks', 'second', 'tails', 'reports'] as const).map((k, i) => (
              <div className="tl-i" key={k} {...(i === 3 ? { 'data-tone': 'muted' } : {})}>
                <span className="tl-dot" />
                <div>
                  <div className="t-sm">
                    <strong>{t(`elevation.step.${k}.title`)}</strong>
                  </div>
                  <div className="t-sm ink-3">{t(`elevation.step.${k}.body`)}</div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{ marginTop: 'var(--sp-5)', display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}
          >
            <button className="btn btn-primary" type="button" disabled={busy} onClick={() => { go(false); }}>
              {t('elevation.askAndRun')}
            </button>
            <button className="btn" type="button" disabled={busy} onClick={() => { go(true); }}>
              {t('elevation.measureOnly')}
            </button>
          </div>
          <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-2)' }}>
            {t('elevation.measureNote')}
          </p>
        </div>
      </section>

      <section className="band band-app band-tight">
        <div className="wrap">
          <details className="disclose">
            <summary>
              <span className="disclose-line">{t('elevation.smartScreenSummary')}</span>
              <span className="disclose-more">{t('consent.detailsMore')}</span>
            </summary>
            <div className="disclose-body">
              <p>{t('elevation.smartScreenWhy')}</p>
              <p>{t('elevation.smartScreenHow')}</p>
              <p>{t('elevation.smartScreenWhyHere')}</p>
            </div>
          </details>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
