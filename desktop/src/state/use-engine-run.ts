/**
 * One engine invocation through the shared run state: start it, stream it,
 * record it.
 *
 * 🔴 The rejection path is not hypothetical and it is not rare. The engine refuses
 * a run for ordinary reasons - a missing library, a refused path, an exit before
 * the summary - and before a try/catch existed every one of them left `phase` on
 * 'running' for ever, because callers only chained `.finally()`, which does not
 * handle a rejection. The reason is appended to the log pane, beside the engine's
 * own output, and the run is recorded as failed. It resolves `null` then, never
 * rejects, so no caller can forget the catch again.
 *
 * 🔴 `finishRun` is where a summary's candidates reach the Picker (D-23), so a run
 * started here needs nothing else to feed it. What a caller still owns is what is
 * specific to its screen - Home's scan targets, where to navigate.
 */

import { useCallback } from 'react';

import { newRunId, run } from '../lib/engine';
import type { RunSummary } from '../lib/cli';
import { useStore } from './store';

export interface EngineRunResult {
  summary: RunSummary | null;
  exitCode: number;
  cancelled: boolean;
}

/**
 * Returns a function that runs `args` and resolves with the engine's result, or
 * `null` when the run could not be completed. `onStarted` fires once the run is
 * registered and before the engine is invoked - the moment to navigate to the Run
 * screen, so its first frame already shows this run.
 */
export function useEngineRun(): (args: string[], onStarted?: () => void) => Promise<EngineRunResult | null> {
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);

  return useCallback(
    async (args: string[], onStarted?: () => void) => {
      const id = newRunId();
      startRun(id);
      onStarted?.();
      try {
        const result = await run(args, id, {
          onLog: appendLog,
          onProgress: (section, event, status, freedBytes) => {
            applyProgress({
              section,
              event,
              ...(status ? { status } : {}),
              ...(freedBytes !== undefined ? { freedBytes } : {}),
            });
          },
        });
        finishRun(result.summary, result.exitCode > 1);
        return result;
      } catch (e: unknown) {
        appendLog(e instanceof Error ? e.message : String(e));
        finishRun(null, true);
        return null;
      }
    },
    [startRun, appendLog, applyProgress, finishRun],
  );
}
