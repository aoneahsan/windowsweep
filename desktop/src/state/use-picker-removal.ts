/** Runs exactly the selectable rows a person chose in the Picker. */
import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import type { Candidate } from '../lib/cli';
import { newRunId, run, selectionArgs, writeSelectFile, type RunPreferences } from '../lib/engine';
import { tailElevatedRun } from '../lib/run-tail';
import { useStore } from './store';

export function usePickerRemoval({
  chosen,
  permanent,
  prefs,
  excludedPaths,
}: {
  chosen: readonly Candidate[];
  permanent: boolean;
  prefs: RunPreferences;
  excludedPaths: readonly string[];
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const spendScanTargets = useStore((s) => s.spendScanTargets);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const remove = useCallback(async () => {
    const paths = chosen.filter((row) => row.selectable !== false).map((row) => row.path);
    if (paths.length === 0) return;
    const sections = [...new Set(chosen.map((row) => row.section))].sort((a, b) => a - b);
    const elevate = chosen.some(
      (row) =>
        row.section === 27 || (row.section === 26 && row.path.startsWith('HKEY_LOCAL_MACHINE'))
    );
    const id = newRunId();
    setBusy(true);
    setFailed(null);
    let started = false;
    try {
      const selectFilePath = await writeSelectFile(id, paths);
      started = true;
      startRun(id);
      void navigate({ to: '/run' });
      // The elevated child may write before its parent resolves. Start tailing now.
      const tail = elevate
        ? tailElevatedRun(id, appendLog, (totals) => t('elevation.childReport', totals))
        : null;
      try {
        const result = await run(
          selectionArgs({ selectFilePath, sections, ...prefs, permanent, elevate, excludedPaths }),
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
          }
        );
        finishRun(result.summary, result.exitCode > 1 && !result.cancelled);
      } finally {
        if (tail) void tail.finish().then(spendScanTargets);
      }
    } catch (error: unknown) {
      const reason = error instanceof Error ? error.message : String(error);
      if (started) {
        appendLog(reason);
        finishRun(null, true);
      } else {
        // A refused selection file never started a run; keep its error beside the button.
        setFailed(reason);
      }
    } finally {
      setBusy(false);
    }
  }, [
    chosen,
    permanent,
    prefs,
    excludedPaths,
    navigate,
    startRun,
    appendLog,
    applyProgress,
    finishRun,
    spendScanTargets,
    t,
  ]);

  return {
    busy,
    failed,
    clearFailed: () => {
      setFailed(null);
    },
    remove,
  };
}
