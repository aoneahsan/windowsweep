/**
 * Splash - three things happen here and none of them touches the disk.
 *
 * Translated from `splash.html`. The disclosure says exactly what runs, because a
 * progress bar with no explanation on a tool that deletes files is the wrong first
 * impression: the reader's first question is "what is it doing?", and the answer
 * is "reading its own catalogue".
 *
 * 🔴 The route exists for the real boot, not for decoration. It shows while the
 * catalogue is being read and moves on by itself; a person is never made to watch
 * an animation finish.
 *
 * 🔴 THE UPDATE GATE IS REAL NOW. `splash.detailsWhat` has always told the reader
 * that "the updater checks whether a newer build exists", and until this change
 * nothing under `src/` imported the updater plugin at all - approved copy with no
 * behaviour behind it. The band, its two buttons and the skipped note are
 * `splash.html` lines 52-83, transcribed; the order of events is `page-splash.js`,
 * including its recorded reason for revealing the band only after the engine is
 * ready: "an update prompt over a half-started app is the wrong first thing".
 *
 * 🔴 Nothing here resolves a Tauri object during render - see `lib/updater.ts`.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Shell } from '../components/Shell';
import { useStore } from '../state/store';
import { readNotice } from '../lib/consent';
import { checkForUpdate, restartApp, type UpdateHandle } from '../lib/updater';
import { stateOf } from '../lib/control-state';
import { PrimaryButton } from '../components/PrimaryButton';

const STEPS: [string, number][] = [
  ['splash.step.engine', 18],
  ['splash.step.catalogue', 46],
  ['splash.step.update', 78],
  ['splash.step.ready', 100],
];

/** The heading names the download, so the bar borrows it rather than inventing a label. */
const UPDATE_HEADING_ID = 'ws-update-heading';

/**
 * How long the skipped note stays before the app carries on. Long enough to read
 * two short sentences and reach "Try again"; bounded, because a dead network must
 * never be able to strand someone on a screen with nothing on it.
 */
const SKIPPED_NOTE_MS = 3600;
const RETRIED_NOTE_MS = 2200;
const READY_MS = 450;

/**
 * How long the step text holds "Checking for a newer build… no answer".
 *
 * 🔴 The dummy pre-sets that sentence before its sequence starts, because a
 * prototype knows the outcome in advance; the app learns it only when the check
 * returns. So the words are shown at the moment they become true and then the
 * boot finishes normally - which leaves the dummy's FINAL frame and the app's
 * final frame identical: "Ready" at 100% with the skipped note below.
 */
const NO_ANSWER_MS = 1400;

type Gate =
  | { kind: 'checking' }
  | { kind: 'none' }
  | { kind: 'later' }
  | { kind: 'available'; version: string }
  | { kind: 'downloading'; version: string; percent: number | null }
  | { kind: 'installed'; version: string }
  /** `settled` flips once the "no answer" step text has had its moment. */
  | { kind: 'skipped'; retried: boolean; settled: boolean };

export function Splash() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const catalogue = useStore((s) => s.catalogue);
  const engineError = useStore((s) => s.engineError);
  /* 🔴 Recorded, not merely rendered. The About tab may only say "up to date"
     when this check actually said so, and this screen is the one place that ever
     asks - a second question at the moment a badge is drawn would be an update
     check nobody asked for. */
  const setUpdateOutcome = useStore((s) => s.setUpdateOutcome);

  const [gate, setGate] = useState<Gate>({ kind: 'checking' });
  const [attempt, setAttempt] = useState(0);
  const handleRef = useRef<UpdateHandle | null>(null);
  /* One check per attempt. The effect below runs twice under StrictMode, and a
     boot that asks the update server the same question twice is a defect even
     though nothing visible would differ. */
  const startedRef = useRef(-1);

  /* Derived, like everything else on this screen - the only thing held in state
     is whether the sentence has had its moment, and that is flipped by a timer
     rather than synchronously inside an effect. */
  const noAnswer = gate.kind === 'skipped' && !gate.settled;

  /* The step is DERIVED, not stored. It was a `useState` set from inside an
     effect, which the react-hooks rule correctly rejected: nothing here is state
     the app owns, it is a reading of the values it already has. */
  const step = engineError ? 1 : !catalogue ? 0 : gate.kind === 'checking' || noAnswer ? 2 : 3;

  useEffect(() => {
    if (engineError || !catalogue) return;
    if (gate.kind !== 'checking') return;
    if (startedRef.current === attempt) return;
    startedRef.current = attempt;

    let cancelled = false;
    void (async () => {
      const outcome = await checkForUpdate();
      if (cancelled) return;
      if (outcome.kind === 'available') {
        handleRef.current = outcome.handle;
        setUpdateOutcome('available');
        setGate({ kind: 'available', version: outcome.handle.version });
        return;
      }
      if (outcome.kind === 'none') {
        setUpdateOutcome('none');
        setGate({ kind: 'none' });
        return;
      }
      setUpdateOutcome('skipped');
      setGate({ kind: 'skipped', retried: attempt > 0, settled: false });
    })();
    return () => { cancelled = true; };
  }, [engineError, catalogue, gate.kind, attempt, setUpdateOutcome]);

  /* The one effect that leaves for another route, and the one that lets the "no
     answer" sentence be read first. An update waiting to be answered holds the
     screen; every other outcome carries on by itself.
     🔴 Both branches set state from a TIMER CALLBACK, never synchronously in the
     effect body - the react-hooks gate rejects the latter, and it is right to:
     an effect that sets state on entry is a cascading render. */
  useEffect(() => {
    if (gate.kind === 'skipped' && !gate.settled) {
      const settle = window.setTimeout(() => {
        setGate({ kind: 'skipped', retried: gate.retried, settled: true });
      }, NO_ANSWER_MS);
      return () => { window.clearTimeout(settle); };
    }
    if (gate.kind !== 'none' && gate.kind !== 'later' && gate.kind !== 'skipped') return;
    const ms =
      gate.kind === 'skipped'
        ? (gate.retried ? RETRIED_NOTE_MS : SKIPPED_NOTE_MS) - NO_ANSWER_MS
        : READY_MS;
    const to = window.setTimeout(() => {
      // First run shows the notice; after it has been seen, straight to Home.
      void navigate({ to: readNotice().seen ? '/' : '/consent' });
    }, ms);
    return () => { window.clearTimeout(to); };
  }, [gate, navigate]);

  const onLater = useCallback(() => {
    setUpdateOutcome('later');
    setGate({ kind: 'later' });
  }, [setUpdateOutcome]);

  const onRetry = useCallback(() => {
    setGate({ kind: 'checking' });
    setAttempt((n) => n + 1);
  }, []);

  const onInstall = useCallback(() => {
    const handle = handleRef.current;
    if (!handle) return;
    setGate({ kind: 'downloading', version: handle.version, percent: 0 });
    void (async () => {
      try {
        await handle.downloadAndInstall((percent) => {
          setGate({ kind: 'downloading', version: handle.version, percent });
        });
        setGate({ kind: 'installed', version: handle.version });
        // On Windows the installer exits this process itself, so this is usually
        // never reached there; it is what makes "and restart" true elsewhere.
        await restartApp();
      } catch {
        /* 🔴 The click dummy carries no sentence for a download that fails, so
           none is invented here: the screen falls back to its one approved
           failure surface - the check was skipped and the app carries on. The
           wording gap is reported rather than papered over. */
        setGate({ kind: 'skipped', retried: false, settled: false });
      }
    })();
  }, []);

  const stepKey = noAnswer ? 'splash.step.updateNoAnswer' : (STEPS[step]?.[0] ?? 'splash.step.engine');
  const width = STEPS[step]?.[1] ?? STEPS[0]?.[1] ?? 8;

  const busy = gate.kind === 'downloading' || gate.kind === 'installed';
  const percent = gate.kind === 'downloading' ? gate.percent : gate.kind === 'installed' ? 100 : null;
  const bandVersion =
    gate.kind === 'available' || gate.kind === 'downloading' || gate.kind === 'installed'
      ? gate.version
      : null;

  return (
    /* 🔴 The real chrome, with the rail dropped. This screen rendered its own
       bare `.app` and an EMPTY title bar, which meant the one theme control was
       missing here and on Consent - 2 of 11 routes - while the dummy carries it
       on all of them. What this screen must not have is the RAIL: nothing is
       navigable yet, so offering navigation would be a lie about what is ready. */
    <Shell rail={false} statusNote={t('splash.statusNote')}>
      <>
          <section
            className="band band-app"
            style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}
          >
            <div className="wrap wrap-narrow" style={{ textAlign: 'center' }}>
              <div className="hero-ring" aria-hidden="true" />
              <p className="caps ink-3">{t('app.name')}</p>
              <h1 className="t-2xl wide" style={{ marginBlock: 'var(--sp-2) var(--sp-4)' }}>
                {t('splash.wordmark')}
              </h1>

              <div className="prog" style={{ maxWidth: '22rem', marginInline: 'auto' }}>
                <i className="prog-fill" style={{ width: `${String(width)}%` }} />
              </div>
              <p
                className="t-sm ink-3"
                style={{ marginTop: 'var(--sp-3)' }}
                role="status"
                aria-live="polite"
              >
                {t(stepKey)}
              </p>

              <details className="disclose" style={{ marginTop: 'var(--sp-8)', textAlign: 'start' }}>
                <summary>
                  <span className="disclose-line">{t('splash.detailsSummary')}</span>
                  <span className="disclose-more">{t('consent.detailsMore')}</span>
                </summary>
                <div className="disclose-body">
                  <p>{t('splash.detailsWhat')}</p>
                  <p>{t('splash.detailsNothing')}</p>
                </div>
              </details>
            </div>
          </section>

          {/* 🔴 The band appears only once the engine is ready, never before, and
              never at all if the check did not complete - `page-splash.js`. */}
          {bandVersion !== null ? (
            <section className="band band-well band-tight">
              <div className="wrap wrap-narrow">
                <div className="panel pad">
                  <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div className="dlg-icon" aria-hidden="true">↑</div>
                    <div style={{ flex: 1, minWidth: '14rem' }}>
                      <h2 className="t-md wide" id={UPDATE_HEADING_ID}>
                        {t('splash.update.ready', { version: bandVersion })}
                      </h2>
                      {/* 🔴 The dummy's approved sentence, verbatim. Its first half
                          describes install-on-close, which this build does not do -
                          reported for the dummy's owner to settle, never silently
                          reworded here. */}
                      <p className="t-sm ink-3">{t('splash.update.body')}</p>
                      {/* Determinate only when the server said how big it is. A bar
                          drawn from a guess is worse than the pending spinner on the
                          button, which is what carries an unknown length. */}
                      {percent !== null ? (
                        <div
                          className="prog"
                          style={{ marginTop: 'var(--sp-3)' }}
                          role="progressbar"
                          aria-labelledby={UPDATE_HEADING_ID}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(percent)}
                        >
                          <i className="prog-fill" style={{ width: `${String(Math.round(percent))}%` }} />
                        </div>
                      ) : null}
                      {gate.kind === 'installed' ? (
                        <p className="t-sm" style={{ marginTop: 'var(--sp-2)' }} role="status">
                          {t('splash.update.downloaded')}
                        </p>
                      ) : null}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                      <button className="btn" type="button" onClick={onLater} disabled={busy}>
                        <span className="btn-label">{t('splash.update.later')}</span>
                      </button>
                      {/* Pending, then done, ON the control that was pressed - the
                          dummy's own vocabulary (`wire.js` busy(), widgets.js pending()).
                          Through the shared primitive, so the press is reported from
                          one place rather than from this screen. */}
                      <PrimaryButton
                        control="splash.updateNow"
                        onPress={onInstall}
                        disabled={busy}
                        state={stateOf(gate.kind === 'downloading', gate.kind === 'installed')}
                        label={t('splash.update.now')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {gate.kind === 'skipped' ? (
            <section className="band band-app band-tight">
              <div className="wrap wrap-narrow">
                {/* Polite, not assertive: nothing is at risk and the sentence says
                    so. An alert would interrupt to report that an optional courtesy
                    did not happen. */}
                <div className="note note-warn" role="status">
                  <span aria-hidden="true">⚠</span>
                  <span>
                    <strong>{t('splash.update.offlineTitle')}</strong>{' '}
                    {gate.retried ? t('splash.update.retriedOffline') : t('splash.update.offlineBody')}{' '}
                    {gate.retried ? null : (
                      <button className="btn btn-sm" type="button" onClick={onRetry}>
                        <span className="btn-label">{t('splash.update.retry')}</span>
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </section>
          ) : null}

          {engineError ? (
            <section className="band band-app band-tight">
              <div className="wrap wrap-narrow">
                <div className="note note-warn" role="alert">
                  <span aria-hidden="true">⚠</span>
                  <span>{t('error.engineMissing')}</span>
                </div>
              </div>
            </section>
          ) : null}
      </>
    </Shell>
  );
}
