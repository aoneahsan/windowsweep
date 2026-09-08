/**
 * Run's Cancel control. `run.html:37`, `page-run.js` -> the `runCancel` action.
 *
 * 🔴 THE `pending.runCancel` DECLARATION THAT STOOD HERE IS GONE, because the
 * capability is built. It said: "Stopping a run once it has started means
 * signalling the engine while it works, and this build has no way to do that."
 * `cancel_run` is that way (`src-tauri/src/cancel.rs`): every run registers its
 * child process while it runs, and this command reaches into it.
 *
 * 🔴 WHAT CANCEL ACTUALLY DOES, BECAUSE THE WORDS DEPEND ON IT. It terminates the
 * PowerShell process. It does NOT ask the engine to stop tidily, and there is no
 * flag that would - so the section in flight is cut off wherever it had reached.
 * That has three consequences the screen has to respect:
 *
 *   - **A partly-emptied folder is a real outcome.** Deletion is per item, so
 *     whatever had already gone is gone. Nothing is left half-deleted in the sense
 *     of a corrupted file; the tool's own chokepoint removes complete entries.
 *   - **The engine writes no summary.** `Write-JsonSummary` runs at the end of the
 *     batch, which the process never reaches, so there is no `freed_bytes` for the
 *     run and no report file for it. The log the engine streamed IS still on disk
 *     in the run folder - `--logs-dir` points there and the engine writes as it
 *     goes - so a person can read what happened even though this window cannot
 *     total it.
 *   - **So the only figure this window may quote is the sum of the sections the
 *     engine itself reported finished** (`##windowsweep ... event=end
 *     freed_bytes=N`). Those are complete and true. The section that was
 *     interrupted contributes an unknown amount on top, which is why the sentence
 *     below is shown only when that sum is above zero: at zero the honest answer is
 *     not "0 B was freed" - the engine may well have deleted files in the section
 *     it was cut off in - it is the Rust side's own sentence, which claims no
 *     quantity at all.
 *
 * 🔴 THE DUMMY'S CANCEL LOG LINE IS DECLINED, and this is the one place in this
 * change where its words are not shipped. `page-run.js` logs "cancel requested -
 * finishing the section in flight", which describes a cooperative cancel its own
 * `setInterval` performs and this product does not: the process is terminated, and
 * the section in flight is not finished. Shipping that sentence verbatim would be
 * the window telling somebody their files were being tidily accounted for while a
 * process was being killed underneath them. Reported for the dummy to be amended
 * rather than reworded here.
 *
 * 🔴 The reason sentence comes from Rust and is rendered as data. Which of the
 * four things happened - a process was signalled, the run had already ended, it
 * ended in that instant, or it is an elevated window this app cannot reach - is
 * known only there, and `cancel.rs` keeps the wording beside the fact so the two
 * cannot drift apart.
 */

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cancelRun, type CancelOutcome } from '../lib/engine';
import { controlState, stateOf } from '../lib/control-state';

export function RunCancel({
  runId,
  running,
}: {
  runId: string | null;
  running: boolean;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<CancelOutcome | null>(null);
  /** A failure to signal at all - rare, and different from a refusal with a reason. */
  const [failed, setFailed] = useState<string | null>(null);

  const onCancel = useCallback(() => {
    if (runId === null) return;
    /* Set before the await, so the control answers the press in the same frame
       rather than after an IPC round trip. */
    setBusy(true);
    setOutcome(null);
    setFailed(null);
    cancelRun(runId)
      .then(setOutcome)
      .catch((e: unknown) => { setFailed(e instanceof Error ? e.message : String(e)); })
      .finally(() => { setBusy(false); });
  }, [runId]);

  return (
    <>
      <button
        className="btn"
        type="button"
        onClick={onCancel}
        disabled={!running || runId === null || busy}
        {...controlState(stateOf(busy))}
      >
        <span className="btn-label">{t('run.cancel')}</span>
      </button>
      {/* 🔴 Assertive when the press did NOT stop anything - an elevated run, or a
          run that had already ended. That is the case where somebody believes they
          have stopped a deletion and have not, so it has to interrupt. A successful
          stop is polite: the run visibly ending is the primary answer. */}
      {outcome === null ? null : (
        <span
          className="t-xs"
          role={outcome.cancelled ? 'status' : 'alert'}
          style={outcome.cancelled ? undefined : { color: 'var(--c-warn-ink)' }}
        >
          {outcome.reason}
        </span>
      )}
      {failed === null ? null : (
        <span className="t-xs" role="alert" style={{ color: 'var(--c-warn-ink)' }}>
          {failed}
        </span>
      )}
    </>
  );
}
