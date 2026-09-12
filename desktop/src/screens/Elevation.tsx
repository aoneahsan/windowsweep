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
 * unexplained is worse than reading about it in advance.
 *
 * 🔴 THREE THINGS THIS SCREEN IMPLIED AND DID NOT DO, all closed here
 * (PENDING-TASKS TASK-004), and the dummy was amended first in every case:
 *
 * 1. **It ran all six.** The lede has always said "when you ask for ONE of these"
 *    and the screen passed every admin id, so the copy described a product the
 *    screen was not. Each card now carries its own control.
 * 2. **Three of the six were refused on every run.** `modules/runner.ps1:89-92`
 *    refuses every `Batch = 'deep'` section without `--i-understand-deep` - 15, 16
 *    and 20 - and the app never passed it. The flag is not a default this window
 *    may add: the gate below names what each of the three actually does and asks.
 * 3. **Nothing tailed the elevated child's log**, while the screen's own third step
 *    said "This window tails the log." The child is a separate process in its own
 *    console, so its output never reaches this one's stderr; `run-tail.ts` reads
 *    its log and its report out of the shared run folder instead.
 *
 * 🔴 Section 15 also needs `--hiberfil off|reduced|keep`, which is why its card
 * carries three options rather than a switch: with no value the engine prints "pass
 * --hiberfil off|reduced|keep to run this section unattended" and does nothing -
 * a silent no-op behind a UAC prompt.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useRunPreferences, useStore } from '../state/store';
import { commandLine, elevatedArgs, newRunId, run, scanArgs } from '../lib/engine';
import { formatBytes } from '../lib/format';
import { tailElevatedRun } from '../lib/run-tail';
import { controlState, stateOf } from '../lib/control-state';
import { PrimaryButton } from '../components/PrimaryButton';
import type { Section } from '../lib/catalogue';

/** What section 15 may be told to do. `keep` is "not chosen", so it is never sent. */
type Hiberfil = 'keep' | 'reduced' | 'off';
const HIBERFIL_OPTIONS: Hiberfil[] = ['keep', 'reduced', 'off'];

/**
 * The one section whose choice is a value rather than a yes.
 * 🔴 Keyed by id, which IRON rule 4 freezes: "Section numbers are frozen; a number
 * is never reused." A key or a title would be free to drift; 15 cannot.
 */
const HIBERFIL_SECTION = 15;
/** `Dev = $true` sections the engine skips with developer mode off (`runner.ps1:105`). */
const DEV_GATED = new Set([4, 17, 20]);

export function Elevation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const catalogue = useStore((s) => s.catalogue);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const developer = useStore((s) => s.developer);
  const prefs = useRunPreferences();
  /* 🔴 The elevated run is the largest blast radius of the four run paths - it
     runs as administrator over Windows Update, the component store and the event
     logs - so it carries the exclusions like every other one. */
  const excludedPaths = useStore((s) => s.excludedPaths);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const setScanTargets = useStore((s) => s.setScanTargets);
  /* 🔴 WHICH one is running, not just that something is. Pressing "Ask for
     permission and run" hands over to Windows' own UAC prompt, which can take
     seconds to appear - and both buttons looked untouched the whole time. */
  const [busy, setBusy] = useState<'run' | 'measure' | null>(null);
  /** Bytes the last measurement found across the chosen sections; null until one finishes. */
  const [measured, setMeasured] = useState<number | null>(null);

  const admin = useMemo(
    () => (catalogue?.sections ?? []).filter((s) => s.admin),
    [catalogue],
  );

  /* 🔴 TWO LISTS, BECAUSE THE TWO KINDS HAVE OPPOSITE DEFAULTS. The three ordinary
     admin sections start chosen - that is what this screen has always done for them
     - so their state is what has been turned OFF. A deep section starts unchosen
     and is only ever chosen by an explicit press, because turning one on is exactly
     the decision the gate below exists to make visible; so its state is what has
     been turned ON. One list could not express both.
     Section 15 is in neither: its choice IS its `--hiberfil` value. */
  const [off, setOff] = useState<number[]>([]);
  const [deepOn, setDeepOn] = useState<number[]>([]);
  const [hiberfil, setHiberfil] = useState<Hiberfil>('keep');
  const [deepOk, setDeepOk] = useState(false);

  function isChosen(s: Section): boolean {
    if (s.id === HIBERFIL_SECTION) return hiberfil !== 'keep';
    if (s.batch === 'deep') return deepOn.includes(s.id);
    return !off.includes(s.id);
  }

  function toggle(s: Section) {
    const flip = (list: number[]) =>
      list.includes(s.id) ? list.filter((x) => x !== s.id) : [...list, s.id];
    if (s.batch === 'deep') setDeepOn(flip);
    else setOff(flip);
  }

  const chosen = admin.filter(isChosen);
  const chosenDeep = chosen.filter((s) => s.batch === 'deep');
  const deep = chosenDeep.length > 0 && deepOk;
  /* The reason the run button is blocked, worked out once so the button and the
     sentence beside it cannot disagree about why. */
  const blocked =
    chosen.length === 0
      ? t('elevation.blockedNone')
      : chosenDeep.length > 0 && !deepOk
        ? t('elevation.blockedDeep')
        : null;

  /** The invocation this screen would run, from the one builder. */
  function buildArgs(): string[] {
    return elevatedArgs({
      sections: chosen.map((s) => s.id),
      deep,
      hiberfil: hiberfil === 'keep' ? null : hiberfil,
      ...prefs,
      excludedPaths,
    });
  }

  /**
   * "Measure without elevating" - the engine's read-only `--scan`, and nothing else.
   *
   * 🔴 IT USED TO PASS `--elevate --dry-run`, which broke the one promise the
   * button's own label makes. The engine relaunches as administrator on
   * `--elevate` WHATEVER the mode (`windowsweep.ps1:294`), so pressing "Measure
   * without elevating" raised a UAC prompt. And had someone declined it, the
   * unelevated `--dry-run` measures nothing at all: the runner skips every
   * `Admin = $true` section before it reads a byte (`modules/runner.ps1:98`).
   * `--scan` is the path the dummy's note describes - "A scan can measure these
   * sections without administrator rights" - because `Show-ScanTable` sizes every
   * target and never reaches that skip. Found by A-DESK on 2026-09-12.
   */
  function measure() {
    if (busy !== null || chosen.length === 0) return;
    setBusy('measure');
    setMeasured(null);
    const id = newRunId();
    startRun(id);
    const ids = new Set(chosen.map((s) => s.id));
    void run(scanArgs({ ...prefs, excludedPaths }), id, {
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
      .then((r) => {
        finishRun(r.summary, r.exitCode > 1);
        if (!r.summary) return;
        /* `targets[]` is filled by `--scan`, so the measurement also refreshes
           Home's map - the same rule Home's own scan follows: it only ever ADDS. */
        if (r.summary.targets.length > 0) setScanTargets(r.summary.targets);
        const bytes = r.summary.targets
          .filter((target) => ids.has(target.section))
          .reduce((sum, target) => sum + target.bytes, 0);
        setMeasured(bytes);
      })
      .catch((e: unknown) => {
        appendLog(e instanceof Error ? e.message : String(e));
        finishRun(null, true);
      })
      .finally(() => { setBusy(null); });
  }

  function go() {
    if (busy !== null || blocked !== null || chosen.length === 0) return;
    setBusy('run');
    const id = newRunId();
    startRun(id);
    void navigate({ to: '/run' });

    /* 🔴 THE TAIL STARTS BEFORE THE RUN, not after it. The elevated child begins
       writing the moment the UAC prompt is answered, and a tail attached afterwards
       would miss everything up to that point - the same reason `run()` attaches its
       listeners before it invokes. */
    const tail = tailElevatedRun(
      id,
      appendLog,
      (totals) => t('elevation.childReport', totals),
    );

    void run(buildArgs(), id, {
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
      .catch((e: unknown) => {
        /* 🔴 Without this the screen hung for ever. The elevated parent hands the
           work to a new window and exits before printing a summary, so run()
           rejects; `void promise.finally()` does not handle a rejection, so
           finishRun never fired and the Run screen stayed on "Running" while the
           child had already finished. The reason goes into the log pane, which is
           where the run's own output already is, rather than into a toast that
           disappears. */
        appendLog(e instanceof Error ? e.message : String(e));
        finishRun(null, true);
      })
      .finally(() => {
        /* One last sweep before stopping: the child writes its closing lines and
           its report as it exits, so a tail stopped on the promise alone loses the
           end of the run - which is the part carrying the number. */
        void tail.finish();
        setBusy(null);
      });
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
                    <span style={{ fontWeight: 600 }}>
                      {s.key}
                    </span>
                    <span className="badge badge-danger">{t('sections.admin')}</span>
                    {s.batch === 'deep' ? (
                      <span className="badge badge-warn">{t('elevation.deep')}</span>
                    ) : null}
                  </div>
                  <p className="t-sm ink-3">{s.title}</p>

                  {s.id === HIBERFIL_SECTION ? (
                    <div
                      className="seg"
                      role="radiogroup"
                      aria-label={t('elevation.hiberfilLegend')}
                      style={{ marginTop: 'var(--sp-3)' }}
                    >
                      {HIBERFIL_OPTIONS.map((option) => (
                        <label className="seg-opt" key={option}>
                          <input
                            type="radio"
                            name="elevation-hiberfil"
                            value={option}
                            checked={hiberfil === option}
                            onChange={() => { setHiberfil(option); }}
                          />
                          <span>{t(`elevation.hiberfil.${option}`)}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <label
                      className="t-sm"
                      style={{
                        display: 'flex',
                        gap: 'var(--sp-2)',
                        alignItems: 'center',
                        marginTop: 'var(--sp-3)',
                      }}
                    >
                      <button
                        className="switch"
                        type="button"
                        role="switch"
                        aria-checked={isChosen(s)}
                        aria-label={t('elevation.chooseAria', { id: s.id, key: s.key })}
                        onClick={() => { toggle(s); }}
                      />
                      <span>{t('elevation.chooseThis')}</span>
                    </label>
                  )}

                  {/* Declared on the card rather than discovered in the log: with
                      developer mode off the engine skips this section outright. */}
                  {DEV_GATED.has(s.id) && !developer ? (
                    <p className="t-xs ink-3">{t('elevation.devOff')}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔴 THE DEEP GATE, and it lists only the sections actually chosen. A warning
          naming all three when one is ticked is a warning about work that is not
          happening, which teaches the reader to skip it. */}
      {chosenDeep.length > 0 ? (
        <section className="band band-app band-tight">
          <div className="wrap">
            <div className="note note-danger">
              <span aria-hidden="true">!</span>
              <div>
                <p className="t-sm">
                  <strong>{t('elevation.deepGateTitle')}</strong> {t('elevation.deepGateBody')}
                </p>
                <ul
                  className="t-sm ink-3"
                  style={{ margin: 'var(--sp-2) 0 0', paddingInlineStart: 'var(--sp-5)' }}
                >
                  {chosenDeep.map((s) => (
                    <li key={s.id}>{t(`elevation.deepWhat.${s.id}`)}</li>
                  ))}
                </ul>
                <label
                  className="t-sm"
                  style={{
                    display: 'flex',
                    gap: 'var(--sp-2)',
                    alignItems: 'center',
                    marginTop: 'var(--sp-3)',
                  }}
                >
                  <button
                    className="switch"
                    type="button"
                    role="switch"
                    aria-checked={deepOk}
                    aria-label={t('elevation.deepConfirmAria')}
                    onClick={() => { setDeepOk((x) => !x); }}
                  />
                  <span>{t('elevation.deepConfirm')}</span>
                </label>
              </div>
            </div>
          </div>
        </section>
      ) : null}

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
            <PrimaryButton
              control="elevation.askAndRun"
              onPress={() => { go(); }}
              disabled={busy !== null || blocked !== null}
              state={stateOf(busy === 'run')}
              label={t('elevation.askAndRun')}
            />
            <button
              className="btn"
              type="button"
              disabled={busy !== null || chosen.length === 0}
              onClick={() => { measure(); }}
              {...controlState(stateOf(busy === 'measure'))}
            >
              <span className="btn-label">{t('elevation.measureOnly')}</span>
            </button>
          </div>
          {/* The reason is beside the control that is blocked, never in a toast. */}
          {blocked !== null ? (
            <p className="t-sm" style={{ marginTop: 'var(--sp-2)', color: 'var(--c-warn-ink)' }}>
              {blocked}
            </p>
          ) : null}
          <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-2)' }}>
            {t('elevation.measureNote')}
          </p>
          {/* The measurement lands beside the control that asked for it - the dummy's
              own sentence with the product's own number in it, never a toast. */}
          {measured !== null ? (
            <p className="note note-info" style={{ marginTop: 'var(--sp-3)' }} role="status">
              {t('elevation.measured', { amount: formatBytes(measured) })}
            </p>
          ) : null}
          {/* The invocation itself, built from the same builder the buttons run -
              `run.html:132`'s rule, so a sentence cannot drift from the flags. */}
          <p className="t-xs mono ink-3" style={{ marginTop: 'var(--sp-3)', wordBreak: 'break-all' }}>
            {commandLine(buildArgs())}
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
