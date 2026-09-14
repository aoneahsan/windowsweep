/**
 * How long the run in front of you has been going, in milliseconds, or `null`
 * before anything has been logged.
 *
 * 🔴 Lifted out of `screens/Run.tsx` when that file crossed the project's 500-line
 * ceiling, the same move `lib/engine-args.ts` and `state/derived.ts` record -
 * verbatim, reasoning included. Nothing about it changed.
 *
 * 🔴 It reads the ENGINE'S OWN first and last line rather than a stopwatch the
 * screen keeps. The log is what the run actually did, and it stops growing when the
 * run stops - which freezes the figure at the right value with no timer left
 * running behind a finished screen.
 */

import { useEffect, useState } from 'react';

import type { RunLogLine, RunPhase } from './store';

export function useElapsedMs(log: RunLogLine[], phase: RunPhase): number | null {
  const firstAt = log[0]?.at ?? null;
  const lastAt = log.length > 0 ? (log[log.length - 1]?.at ?? null) : null;
  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    if (phase !== 'running') return;
    const tick = window.setInterval(() => { setClock(Date.now()); }, 1000);
    return () => { window.clearInterval(tick); };
  }, [phase]);
  return firstAt === null ? null : (phase === 'running' ? clock : (lastAt ?? firstAt)) - firstAt;
}
