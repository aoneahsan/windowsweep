/**
 * The weekly Scheduled Task, from this window.
 *
 * 🔴 THE DECLARATION THIS REPLACES NAMED THE WRONG BLOCKER, and it is worth
 * recording which one was real. `pending.schedule` said the engine registers the
 * task "but that is not one of the things this window is allowed to ask it to do" -
 * an allowlist problem, and it was fixed on 2026-09-08 when `--install-task` and
 * `--uninstall-task` went into `src-tauri/src/args.rs`. Two further things had to
 * be true before a switch here could be honest, and neither was about the
 * allowlist:
 *
 * 1. **The engine asks.** `Install-WeeklyTask` calls `Confirm-Ui`, this window
 *    spawns PowerShell with a null stdin, and the non-interactive branch answers
 *    its own question **no** and exits 0. So `--yes` is part of the invocation,
 *    which is why `scheduleArgs` is a builder and not a literal.
 * 2. **Neither mode writes a `--json` summary.** Both end in their own function
 *    without reaching `Write-JsonSummary`, and `run_clean` turns a missing summary
 *    into a hard error - so the task would be created and the window would report
 *    the engine broken. Fixed by name in `args.rs` -> `NO_SUMMARY_FLAGS`.
 *
 * 🔴 AND THE THIRD, WHICH IS WHAT THIS FILE IS FOR: nothing could read back
 * whether the task exists. A switch drawn from what this window last asked for
 * sits at "on" over a task somebody deleted in Task Scheduler. `schedule_status`
 * asks Windows, and it can answer "I could not tell" - which is a third state, not
 * a tidier way of saying off.
 */

import { invoke } from '@tauri-apps/api/core';

import { devEngine } from './dev-gate';

/**
 * What this window knows about the task. The words are the Rust enum's, serialised
 * lowercase (`src-tauri/src/schedule.rs` -> `TaskState`), and a test there pins
 * all three because a serde rename is invisible to every Rust gate.
 */
export type TaskState = 'installed' | 'absent' | 'unknown';

export interface ScheduleStatus {
  state: TaskState;
  /** The name a person would look for in Task Scheduler. */
  task_name: string;
}

/**
 * Ask Windows whether the weekly task is registered.
 *
 * 🔴 THIS NEVER THROWS, and the fallback lives here rather than at the call site.
 * A query that could not be made is `unknown`, which the switch renders as a state
 * of its own rather than as off - an Off switch over a live weekly task is the
 * window telling somebody nothing is scheduled while their disk is cleaned every
 * Sunday. "Unreadable is unknown" is a property of the reader, not a thing each
 * consumer has to remember, and a second consumer that forgot the `catch` would
 * get a rejected promise where this one gets a state.
 *
 * The Rust command itself cannot fail - it answers `unknown` internally when
 * `schtasks.exe` will not run - so the only route here is the IPC call itself
 * failing, which is the same class of "could not ask" and gets the same answer.
 */
export async function scheduleStatus(): Promise<ScheduleStatus> {
  const dev = await devEngine();
  if (dev) return dev.devScheduleStatus();
  try {
    return await invoke<ScheduleStatus>('schedule_status');
  } catch {
    return { state: 'unknown', task_name: '' };
  }
}

/**
 * Whether the switch should read as on.
 *
 * Split out so the two screens that draw this control cannot answer it
 * differently. `unknown` is NOT on - and it is not off either, which is why the
 * component that calls this also renders the state word beside it.
 */
export function isScheduled(status: ScheduleStatus | null): boolean {
  return status?.state === 'installed';
}
