/**
 * Read a run's report file once, and hand it to whichever screen asks.
 *
 * 🔴 A small external store rather than state in the screen. A report is IMMUTABLE
 * once written - the engine saves it before it prints the summary that makes the run
 * a History row - so reading it twice is waste, and returning to a run already opened
 * should cost nothing. `useSyncExternalStore` also means the screen never sets state
 * in an effect body: the effect only asks for a read, and the store announces the
 * answer.
 *
 * Both reads go through the Rust side's own confinement (`src-tauri/src/runs.rs`,
 * `engine.rs` -> `read_run_report`): the webview names a run and a file, never a
 * path. Nothing read here leaves the machine - it is rendered, not reported.
 */

import { useEffect, useSyncExternalStore } from 'react';

import { listRunFiles, readReport } from './engine';
import { parseReport, pickReportFile, stripBom, type RunReport } from './report-file';

export type ReportLoad =
  | { status: 'loading' }
  | { status: 'ready'; report: RunReport; raw: string; fileName: string }
  | { status: 'missing' }
  | { status: 'failed'; reason: string };

const LOADING: ReportLoad = { status: 'loading' };

/** Reports are a few kilobytes each; a bounded map keeps a long session from growing. */
const CACHE_LIMIT = 24;

const cache = new Map<string, ReportLoad>();
const inflight = new Set<string>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function remember(runId: string, value: ReportLoad): void {
  cache.delete(runId);
  cache.set(runId, value);
  while (cache.size > CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
  for (const listener of listeners) listener();
}

/**
 * Read one run's report. A failure is remembered so the screen can say so, and is
 * retried the next time a screen asks - a folder that was busy a moment ago may not
 * be now - while a found or definitely-absent report is final.
 */
async function load(runId: string, knownFile: string | null): Promise<void> {
  const known = cache.get(runId);
  if ((known && known.status !== 'failed') || inflight.has(runId)) return;
  inflight.add(runId);
  try {
    /* The run that just finished names its own file in the summary; any other run
       is asked for its folder's listing, which is names only. */
    const fileName = knownFile ?? pickReportFile(await listRunFiles(runId));
    if (!fileName) {
      remember(runId, { status: 'missing' });
      return;
    }
    const raw = stripBom(await readReport(runId, fileName));
    remember(runId, { status: 'ready', report: parseReport(raw), raw, fileName });
  } catch (error: unknown) {
    remember(runId, {
      status: 'failed',
      reason: error instanceof Error ? error.message : String(error),
    });
  } finally {
    inflight.delete(runId);
  }
}

/**
 * The report of `runId`, or null when there is no run to read. `knownFile` is the
 * file name when the caller already has it (the summary of the run that just
 * finished), which saves listing the folder.
 */
export function useRunReport(runId: string | null, knownFile: string | null): ReportLoad | null {
  const value = useSyncExternalStore(subscribe, () => (runId ? cache.get(runId) : undefined));
  useEffect(() => {
    if (runId) void load(runId, knownFile);
  }, [runId, knownFile]);
  if (!runId) return null;
  return value ?? LOADING;
}
