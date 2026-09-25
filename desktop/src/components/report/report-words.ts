/**
 * The Report screen's words for what the file says, in one place so the header, the
 * chart and the table cannot name one step two ways.
 *
 * 🔴 Everything here is READ off the report file; nothing is recomputed. The counts
 * are its `steps[]` tallied by status, the duration is the engine's own
 * `meta.duration_seconds`, and a section is named by the catalogue's key for the id
 * the file records - which is the screen's own promise that it "does not compute
 * anything of its own" (`report.whereBody`).
 */

import type { TFunction } from 'i18next';

import { sectionById, type Catalogue } from '../../lib/catalogue';
import { durationWords } from '../../lib/report-format';
import { numberedSteps, stepCounts, type ReportStep, type RunReport } from '../../lib/report-file';
import { runModeLabel } from '../../lib/run-mode';

/**
 * *"safe batch · 8 sections attempted · 6 ran · 2 skipped · nothing refused · 17
 * seconds"* (S-129). A failure is named in the same line when there is one, for the
 * reason the dummy gives "nothing refused" its place: a run that did something
 * wrong has to say so where the reader is already looking.
 *
 * 🔴 The opening words are `lib/run-mode.ts` -> `runModeLabel` (D-44), fed from the
 * FILE's own mode and steps - the same words the run's History row and Home's
 * last-runs line print, so one run is named one way on every screen. The dummy's
 * line was amended from "Safe batch" to match rather than keep a second mapping.
 */
export function metaLine(report: RunReport, t: TFunction): string {
  const counts = stepCounts(report.steps);
  const sections = numberedSteps(report.steps).map((s) => s.section);
  const parts = [
    runModeLabel({ mode: report.mode, sections }, t),
    t('report.attempted', { count: counts.attempted }),
    t('report.ran', { count: counts.ran }),
    t('report.skipped', { count: counts.skipped }),
    counts.refused > 0
      ? t('report.refused', { count: counts.refused })
      : t('report.nothingRefused'),
  ];
  if (counts.failed > 0) parts.push(t('report.failed', { count: counts.failed }));
  if (report.durationSeconds !== null) parts.push(durationWords(report.durationSeconds));
  return parts.join(t('report.metaSeparator'));
}

/** A step's name: the catalogue's key for its id, or the engine's own title when the catalogue has none. */
export function stepKey(step: ReportStep, catalogue: Catalogue | null): string {
  const section = catalogue ? sectionById(catalogue, step.section) : undefined;
  return section?.key ?? step.title;
}

/**
 * The status badge. The word is always the engine's own (S-133); the tone only
 * reinforces it - a failure and a refusal are never drawn in the neutral grey a
 * skip gets, and a dry-run step wears the outline its History row wears.
 */
export function statusBadge(status: string): string {
  if (status === 'ran') return 'badge badge-ok';
  if (status === 'dry-run') return 'badge badge-outline';
  if (status === 'failed') return 'badge badge-danger';
  if (status === 'refused') return 'badge badge-warn';
  return 'badge badge-neutral';
}
