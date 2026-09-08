/**
 * The weekly Scheduled Task switch. `index.html:238-242` (Home zone 11) and
 * `page-settings.js:120-126` (Settings -> General).
 *
 * 🔴 ONE COMPONENT FOR BOTH SCREENS, and that is not tidiness. The reason the
 * Settings row stayed disabled after `--install-task` reached the allowlist was
 * written down at the time: "Home's own schedule band still declares the gap, so
 * enabling only this one would leave the two screens contradicting each other."
 * Two switches over one Windows task is a state that can disagree with itself; one
 * component reading one status cannot.
 *
 * 🔴 IT READS THE TASK BACK RATHER THAN REMEMBERING WHAT IT ASKED FOR. A switch
 * drawn from a stored preference sits at "on" over a task somebody deleted in Task
 * Scheduler. `schedule_status` asks Windows every time this mounts and again after
 * every change, so the control shows the task rather than the intention.
 *
 * 🔴 THE ACKNOWLEDGEMENT IS AT THE CONTROL, NOT IN A TOAST. This app deliberately
 * ships no toast component - a refusal or a confirmation appears next to the thing
 * that was pressed, the way `SectionSelbar` does it. The dummy delivers these two
 * sentences as toasts; the words are its, the placement is this app's, and the
 * live region is what makes the change reach a screen reader at the moment it
 * happens.
 *
 * ⚠️ `unknown` renders as a DISABLED switch with no state word. It means the query
 * itself could not be made, and the two words the dummy owns - "On - Sundays at
 * 03:00" and "Off" - are both assertions this window would not be entitled to
 * make. Drawing "Off" there is the actual defect: an off switch over a live weekly
 * task. The sentence that belongs in that slot is a dummy amendment and is
 * reported rather than invented; the state is unreachable on a healthy Windows
 * install, where `schtasks.exe` always answers.
 */

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { newRunId, run, scheduleArgs } from '../lib/engine';
import { isScheduled, scheduleStatus, type ScheduleStatus } from '../lib/schedule';

export function ScheduleSwitch() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ScheduleStatus | null>(null);
  const [busy, setBusy] = useState(false);
  /** The engine's own words when it refused - data, never a key. */
  const [failed, setFailed] = useState<string | null>(null);
  /** Which change just landed, so the acknowledgement names what happened. */
  const [done, setDone] = useState<'installed' | 'removed' | null>(null);

  /* 🔴 No `.catch` here, and that is the fix rather than a shortcut.
     `scheduleStatus` resolves to `unknown` when it cannot ask, so "unreadable is
     unknown" lives once in the reader instead of in every consumer - and this
     component is left passing a setter reference rather than calling a setter
     inside an effect, which is what `@eslint-react/set-state-in-effect` was
     objecting to. The rule was pointing at a real thing: the fallback state was
     being decided in a component effect instead of derived where the fact is
     known. */
  const refresh = useCallback(() => {
    void scheduleStatus().then(setStatus);
  }, []);

  /** The same read, but handing the answer back so a caller can act on it. */
  const reread = useCallback(async (): Promise<ScheduleStatus> => {
    const next = await scheduleStatus();
    setStatus(next);
    return next;
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /* The acknowledgement says "that happened" and then gets out of the way, in the
     700 ms shape Home's scan tick already uses. The switch itself is the lasting
     answer. */
  useEffect(() => {
    if (done === null) return;
    const to = window.setTimeout(() => { setDone(null); }, 4000);
    return () => { window.clearTimeout(to); };
  }, [done]);

  const on = isScheduled(status);
  /* Unknown is not a switch you may throw: the window does not know what throwing
     it would change. */
  const unreadable = status !== null && status.state === 'unknown';

  const toggle = useCallback(() => {
    if (status === null || unreadable || busy) return;
    const install = !isScheduled(status);
    setBusy(true);
    setFailed(null);
    setDone(null);
    const id = newRunId();
    /* 🔴 NOT `startRun` - this is not a cleanup and must not take over the Run
       screen, blank its log or land in the run history. It is an engine invocation
       that registers a Scheduled Task and prints nothing; `scheduleArgs` carries
       the `--yes` that stops the engine answering its own confirmation with "no". */
    void run(scheduleArgs(install), id, { onLog: () => undefined, onProgress: () => undefined })
      /* 🔴 THE ACKNOWLEDGEMENT IS EARNED FROM THE READBACK, NOT FROM THE REQUEST -
         and this is the difference between a confirmation and a claim. `run_clean`
         RESOLVES for a refused `--install-task`: these two modes owe no `--json`
         summary, so the guard that would otherwise reject an empty stdout is
         exempted by name, and a non-zero exit from an engine that declined (under
         npx, or because Windows would not register the task) arrives here looking
         exactly like a success. Announcing "Scheduled for Sundays at 03:00." on
         that path would be the window confirming something that did not happen.
         So the task is read back, and the sentence is shown only when Windows now
         agrees with what was asked for. */
      .then(() => reread())
      .then((next) => {
        const nowOn = isScheduled(next);
        if (nowOn === install) setDone(install ? 'installed' : 'removed');
      })
      .catch((e: unknown) => { setFailed(e instanceof Error ? e.message : String(e)); })
      .finally(() => { setBusy(false); });
  }, [status, unreadable, busy, reread]);

  return (
    <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
      <button
        className="switch"
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t('settings.scheduleTitle')}
        disabled={status === null || unreadable || busy}
        aria-busy={busy}
        onClick={toggle}
      />
      <div style={{ minWidth: 0 }}>
        {/* The dummy's `scheduleState` slot. Nothing is printed for `unknown`,
            because both of its words would be claims. */}
        {unreadable ? null : (
          <p className="t-sm">{on ? t('home.scheduleOn') : t('home.scheduleOff')}</p>
        )}
        {/* 🔴 `role="status"` - polite, at the control, within a frame of the
            answer arriving. Not a toast; this app ships none. */}
        <p role="status" className="t-xs ink-3">
          {done === 'installed'
            ? t('home.scheduleDone')
            : done === 'removed'
              ? t('home.scheduleRemoved')
              : ''}
        </p>
        {/* The engine's own refusal, verbatim. It is data - the reasons are the
            engine's (npx, a registration Windows declined) and paraphrasing one
            would put this window's words over the engine's fact. */}
        {failed === null ? null : (
          <p role="alert" className="t-xs" style={{ color: 'var(--c-warn-ink)' }}>
            {failed}
          </p>
        )}
      </div>
    </div>
  );
}
