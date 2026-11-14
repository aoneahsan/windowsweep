/**
 * Runs exactly the selectable rows a person chose in the Picker - in the mode in view: what goes
 * (17-27) or what is installed (30-32), never both in one run.
 *
 * 🔴 AFTER A REAL SECTION 26 RUN THE WINDOW OPENS SECTION 27's CHOOSE SCREEN (1.5.0, decided for
 * this release by the main session). 27 lists what the removed programs left, from the engine's
 * uninstall history and without the idle wait; it is admin, so its list comes from the elevated
 * dry-run that screen already asks for - nothing here raises a prompt on the person's behalf. It
 * happens only while the person is still watching the run, never pulling them off another screen.
 */
import { useCallback, useState } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import type { Candidate, RunSummary } from '../lib/cli';
import { needsElevatedRun } from '../lib/candidate-extras';
import { newRunId, run, selectionArgs, writeSelectFile, type RunPreferences } from '../lib/engine';
import { tailElevatedRun } from '../lib/run-tail';
import { useStore } from './store';

/** The uninstall section, and the one that lists what its removals left. Frozen ids (IRON rule 4). */
const UNINSTALL_SECTION = 26;
const LEFTOVERS_SECTION = 27;

/** Whether a real run's own summary says section 26 ran, or failed part-way after removing some. */
function uninstalled(summary: RunSummary | null): boolean {
  return (
    summary !== null &&
    !summary.dry_run &&
    summary.sections.some(
      (step) =>
        step.section === UNINSTALL_SECTION && (step.status === 'ran' || step.status === 'failed')
    )
  );
}

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
  const router = useRouter();
  const catalogue = useStore((s) => s.catalogue);
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
    const admin = new Set(
      (catalogue?.sections ?? []).filter((section) => section.admin).map((section) => section.id)
    );
    const elevate = chosen.some((row) => needsElevatedRun(row, admin.has(row.section)));
    const id = newRunId();
    setBusy(true);
    setFailed(null);
    let started = false;
    let opened = false;
    /* The hand-off to 27, at most once, and only while the Run screen is still in view. */
    const openLeftovers = () => {
      if (opened || router.state.location.pathname !== '/run') return;
      opened = true;
      void navigate({ to: '/picker', search: { section: LEFTOVERS_SECTION } });
    };
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
        if (uninstalled(result.summary)) openLeftovers();
      } finally {
        /* An elevated child's own report is the only record of what it ran: no `--json`
           summary reaches this window from it, so its spent sections decide the hand-off. */
        if (tail) {
          void tail.finish().then((spent) => {
            spendScanTargets(spent);
            if (spent.includes(UNINSTALL_SECTION)) openLeftovers();
          });
        }
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
    catalogue,
    navigate,
    router,
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
