/**
 * Picker - the interactive sections, where a person chooses row by row.
 *
 * Translated from `picker.html`. Sections 17, 18, 19 and 23 never auto-confirm:
 * `--yes` does not answer them, by design in the engine. This screen is how a
 * person answers them in advance, and the answer travels to the engine as a
 * `--select-file` of full paths.
 *
 * 🔴 The consequence line is not decoration. The segmented control chooses between
 * the Recycle Bin and permanent deletion, and those differ in the one way that
 * matters - "The Recycle Bin can be emptied later. Permanent has no undo." It sits
 * next to the control, not in a toast after the fact.
 *
 * 🔴 "REMOVE THESE" IS WIRED, and the declaration beside it is gone. The chosen
 * paths are written into the run's own folder by `write_select_file`
 * (`src-tauri/src/runs.rs`, which owns the encoding: no BOM, CRLF, and a refusal
 * for any path carrying a line break, a NUL or a leading `#`), and the run is
 * `--only <the sections those rows belong to> --select-file <that file>`.
 *
 * 🔴 NO `--yes` ON THIS PATH, and that is the point of the screen. `--yes` never
 * answers an interactive section - those pickers pass `-NoAutoYes`. Matching the
 * select file is what marks the choice as scripted, and the confirmation that
 * follows is the one prompt `-ScriptedOk` answers. So the rows a person ticked are
 * what confirms the deletion, which is exactly what `picker.lede` promises.
 *
 * ⚠️ THE MODE CONTROL GOVERNS THE `recycle` SECTIONS ONLY - 18, 19 and 23.
 * Section 17 is tier `rebuilds` and its artefacts go through `Remove-PathSafe`
 * outright whichever way this is set (`modules/projects.ps1:157`). The dummy's
 * consequence line does not say so, and the CLI's own copy is being corrected for
 * the same overclaim. Reported as a dummy question rather than reworded here.
 */

import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useRunPreferences, useStore } from '../state/store';
import { formatBytes } from '../lib/format';
import { candidatesBySection } from '../lib/cli';
import { newRunId, run, selectionArgs, writeSelectFile } from '../lib/engine';
import { stateOf } from '../lib/control-state';
import { PrimaryButton } from '../components/PrimaryButton';

/** The two values the segmented control offers, and the one that is the default. */
type DeleteMode = 'recycle' | 'permanent';

export function Picker() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const candidates = useStore((s) => s.candidates);
  const selectedPaths = useStore((s) => s.selectedPaths);
  const toggleCandidate = useStore((s) => s.toggleCandidate);
  const setSelection = useStore((s) => s.setSelection);
  const catalogue = useStore((s) => s.catalogue);
  /* 🔴 The same four preferences every other run path carries. The engine
     re-derives each section's candidate list on this run and matches the select
     file against it, so a threshold that differs from the one the rows were
     offered under changes what is on offer - and a picked row that matches
     nothing is silently not deleted. */
  const prefs = useRunPreferences();
  const excludedPaths = useStore((s) => s.excludedPaths);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);

  /* 🔴 THE MODE LIVES IN THE URL, not in a bare `useState`. It decides whether
     what a person picked goes to the Recycle Bin or goes for good, so it is the
     kind of choice a refresh must not silently reset to the softer option - and
     the URL-state rule covers a selection like this explicitly. `recycle` is the
     default and is therefore omitted from the query rather than written into it. */
  const search: { mode?: string } = useSearch({ strict: false });
  const mode: DeleteMode = search.mode === 'permanent' ? 'permanent' : 'recycle';
  const permanent = mode === 'permanent';
  const setMode = useCallback(
    (next: DeleteMode) => {
      void navigate({
        to: '/picker',
        search: next === 'recycle' ? {} : { mode: next },
        /* Replace: this is a setting on the screen, not a step somebody should
           have to press Back through. */
        replace: true,
      });
    },
    [navigate],
  );

  const [busy, setBusy] = useState(false);
  /** The engine's own refusal, rendered as data beside the button that was pressed. */
  const [failed, setFailed] = useState<string | null>(null);

  const grouped = useMemo(() => candidatesBySection(candidates), [candidates]);
  const chosenBytes = candidates
    .filter((c) => selectedPaths.has(c.path))
    .reduce((total, c) => total + c.bytes, 0);

  /**
   * Write the selection file, then run only the sections those rows came from.
   *
   * 🔴 The sections are DERIVED from the chosen rows, never from the whole
   * interactive set: running a section nobody picked a row in would put that
   * section's own prompt in front of an unattended engine, which `--select-file`
   * answers with nothing and `--yes` is not allowed to answer at all.
   */
  const onRemove = useCallback(() => {
    const paths = candidates.filter((c) => selectedPaths.has(c.path)).map((c) => c.path);
    if (paths.length === 0) return;
    const sections = [...new Set(candidates.filter((c) => selectedPaths.has(c.path)).map((c) => c.section))]
      .sort((a, b) => a - b);

    setBusy(true);
    setFailed(null);
    const id = newRunId();
    writeSelectFile(id, paths)
      .then((selectFilePath) => {
        startRun(id);
        void navigate({ to: '/run' });
        return run(
          selectionArgs({ selectFilePath, sections, ...prefs, permanent, excludedPaths }),
          id,
          {
            onLog: appendLog,
            onProgress: (section, event, status, freedBytes) => {
              applyProgress({
                section,
                event,
                ...(status ? { status } : {}),
                ...(freedBytes !== undefined ? { freedBytes } : {}),
              });
            },
          },
        );
      })
      .then((r) => { finishRun(r.summary, r.exitCode > 1 && !r.cancelled); })
      .catch((e: unknown) => {
        /* 🔴 Two different failures land here and they are shown differently. The
           selection file is written BEFORE the run starts, so a refusal from
           `write_select_file` - a path with a line break in it, say - means nothing
           ran at all, and there is no Run screen to carry the message. It is shown
           next to the button instead. Once the run has started, the reason belongs
           in the log with the engine's own lines. */
        const reason = e instanceof Error ? e.message : String(e);
        setFailed(reason);
        appendLog(reason);
        finishRun(null, true);
      })
      .finally(() => { setBusy(false); });
  }, [candidates, selectedPaths, prefs, permanent, excludedPaths, navigate, startRun,
    appendLog, applyProgress, finishRun]);

  if (candidates.length === 0) {
    return (
      <section className="band band-app">
        <div className="wrap wrap-narrow">
          <p className="caps ink-3">{t('picker.eyebrow')}</p>
          <h1 className="t-lg wide">{t('picker.emptyTitle')}</h1>
          <p className="lede">{t('picker.emptyBody')}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">{t('picker.eyebrow')}</p>
          <h1 className="t-xl wide">{t('picker.title')}</h1>
          <p className="lede">{t('picker.lede')}</p>
        </div>
      </section>

      {[...grouped.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([section, rows]) => {
          const meta = catalogue?.sections.find((s) => s.id === section);
          const allChosen = rows.every((r) => selectedPaths.has(r.path));
          return (
            <section className="band band-app band-tight" key={section}>
              <div className="wrap">
                <div className="zone-label">
                  <span className="caps">
                    <span className="num">{section}</span> {meta?.key ?? ''}
                  </span>
                  <button
                    className="btn btn-sm btn-ghost"
                    type="button"
                    style={{ flex: 'none' }}
                    onClick={() => {
                      const others = [...selectedPaths].filter(
                        (p) => !rows.some((r) => r.path === p),
                      );
                      setSelection(allChosen ? others : [...others, ...rows.map((r) => r.path)]);
                    }}
                  >
                    {allChosen ? t('picker.chooseNone') : t('picker.chooseAll')}
                  </button>
                </div>
                <div className="lst">
                  {rows.map((r) => (
                    <div className="lst-i" key={r.path} data-selected={selectedPaths.has(r.path)}>
                      <div className="lst-x">
                        {/* 🔴 The dummy's row control is a switch at a reduced
                            width, not a bare `<input type="checkbox">`. The bare
                            input had no style in this design system at all - a
                            raw UA control on the one screen where what is ticked
                            decides what gets deleted. The row itself now carries
                            `data-selected`, so the choice is legible from across
                            the row rather than from one 16px box. */}
                        <button
                          className="switch"
                          type="button"
                          role="switch"
                          aria-checked={selectedPaths.has(r.path)}
                          aria-label={t('picker.chooseRow', { path: r.path })}
                          style={{ ['--sw-w' as string]: 'calc(1.9rem * var(--density))' }}
                          onClick={() => { toggleCandidate(r.path); }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="t-sm mono" style={{ overflowWrap: 'anywhere' }}>
                          {r.path}
                        </div>
                        {r.project ? <div className="t-xs ink-3">{r.project}</div> : null}
                      </div>
                      <div className="lst-x">
                        <span className="num t-sm">{formatBytes(r.bytes)}</span>
                        {r.idle_days !== null ? (
                          <span className="t-xs ink-3">
                            {t('picker.idleDays', { count: r.idle_days })}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

      <section className="band band-bleed band-tight">
        <div className="wrap">
          <div
            style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <span className="num t-md wide accent-ink">{formatBytes(chosenBytes)}</span>
            <span className="t-sm ink-2">
              {t('picker.chosen', { count: selectedPaths.size })}
            </span>
            <div
              style={{ marginInlineStart: 'auto', display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}
            >
              {/* 🔴 A label wrapping a real radio, which is what `.seg-opt` is
                  styled for: the selected paint is `.seg-opt:has(input:checked)`,
                  so the previous `<button role="radio" aria-checked>` matched NO
                  rule - the control that chooses between the Recycle Bin and
                  permanent deletion showed no selection at all. Native radios in
                  one group also bring arrow-key traversal with them. */}
              <div className="seg" role="radiogroup" aria-label={t('picker.howToDelete')}>
                <label className="seg-opt">
                  <input
                    type="radio"
                    name="pick-mode"
                    value="recycle"
                    checked={!permanent}
                    onChange={() => { setMode('recycle'); }}
                  />
                  <span>{t('picker.recycleBin')}</span>
                </label>
                <label className="seg-opt">
                  <input
                    type="radio"
                    name="pick-mode"
                    value="permanent"
                    checked={permanent}
                    onChange={() => { setMode('permanent'); }}
                  />
                  <span>{t('picker.permanent')}</span>
                </label>
              </div>
              {/* 🔴 Live. It writes the selection file and runs the sections those
                  rows came from - and it refuses a press with nothing ticked
                  rather than starting a run that would select nothing. The pending
                  state is set before the write, so the control answers the press
                  in the same frame. */}
              <PrimaryButton
                control="picker.remove"
                size="sm"
                onPress={onRemove}
                disabled={busy || selectedPaths.size === 0}
                state={stateOf(busy)}
                label={t('picker.remove')}
              />
            </div>
          </div>
          {/* 🔴 Beside the control, not after the deletion. */}
          {/* 🔴 `selbar-note` was removed here, not styled. The class exists in
              NEITHER stylesheet - not the app's and not the dummy's - so it
              resolved to nothing in both, and the note has always rendered from
              `.t-sm.ink-3` alone. Adding a rule for it in the app only would have
              made this line render DIFFERENTLY from the page that specifies it,
              which is the opposite of the fix. The dummy carries the same dead
              class at `picker.html:120`; giving it a real treatment is a dummy
              amendment and is reported rather than taken unilaterally.
              (PENDING-TASKS TASK-007.) */}
          <p className="t-sm ink-3">{t('picker.consequence')}</p>
          {/* 🔴 The engine's own refusal, verbatim, beside the button that was
              pressed - this app ships no toast, deliberately. It appears only when
              nothing ran: once a run has started its reasons go to the Run screen's
              log with the engine's other lines. */}
          {failed === null ? null : (
            <p className="t-xs" role="alert" style={{ color: 'var(--c-warn-ink)' }}>
              {failed}
            </p>
          )}
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
