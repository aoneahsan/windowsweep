/**
 * The selection bar. `sections.html:98-109`, `page-sections.js:195-263`.
 *
 * It exists because a select switch with nothing to hand its selection to is a
 * control that does nothing - the same reasoning that removed the four consent
 * switches. `--only <ids>` is a real engine flag, so this bar really does run
 * what has been ticked.
 *
 * 🔴 Interactive sections BLOCK a run rather than being silently skipped, and the
 * refusal appears next to the button that was pressed rather than in a toast that
 * disappears. `--yes` never answers those sections, so a run including one would
 * hang or skip - either way the person would not get what they asked for.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import type { Section } from '../lib/catalogue';
import { controlState, stateOf } from '../lib/control-state';

export function SectionSelbar({
  selection,
  sections,
  bytesOf,
  busy,
  blocked,
  onClear,
  onDryRun,
  onRun,
}: {
  selection: number[];
  sections: Section[];
  bytesOf: (id: number) => number | null;
  busy: 'dry' | 'run' | null;
  blocked: string | null;
  onClear: () => void;
  onDryRun: () => void;
  onRun: () => void;
}) {
  const { t } = useTranslation();
  if (selection.length === 0) return null;

  const chosen = sections.filter((s) => selection.includes(s.id));
  const measured = selection.map(bytesOf).filter((b): b is number => b !== null);
  const total = measured.reduce((sum, b) => sum + b, 0);
  const needsAdmin = chosen.filter((s) => s.admin).length;
  const needsPick = chosen.filter((s) => s.batch === 'interactive').length;

  const warn = [
    needsAdmin > 0 ? t('sections.selNeedsAdmin', { count: needsAdmin }) : '',
    needsPick > 0 ? t('sections.selNeedsPick', { count: needsPick }) : '',
  ].filter(Boolean).join(' · ');

  return (
    <div className="selbar">
      <span className="num t-md wide">{selection.length}</span>
      <span className="t-sm ink-2">{t('sections.selSelected')}</span>
      <span className="tb-sep" />
      <span className="num t-md wide accent-ink">
        {measured.length === 0 ? t('sections.totalUnmeasured') : formatBytes(total)}
      </span>
      {warn ? <span className="t-xs ink-3 only-wide">{warn}</span> : null}
      {/* `page-sections.js:258-259` passes `assertive: true`, so this is a live
          region that interrupts - the refusal has to reach a screen reader at the
          moment the button was pressed. Warn ink comes from the token, as the
          dummy's own "These need a person" label does. */}
      {blocked ? (
        <span className="t-xs" role="alert" style={{ color: 'var(--c-warn-ink)' }}>
          {blocked}
        </span>
      ) : null}
      <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 'var(--sp-2)' }}>
        <button className="btn btn-sm" type="button" onClick={onClear}>
          <span className="btn-label">{t('sections.selClear')}</span>
        </button>
        <button
          className="btn btn-sm"
          type="button"
          onClick={onDryRun}
          disabled={busy !== null}
          {...controlState(stateOf(busy === 'dry'))}
        >
          <span className="btn-label">{t('sections.selDry')}</span>
        </button>
        <button
          className="btn btn-sm btn-primary"
          type="button"
          onClick={onRun}
          disabled={busy !== null}
          {...controlState(stateOf(busy === 'run'))}
        >
          <span className="btn-label">{t('sections.selRun')}</span>
        </button>
      </div>
    </div>
  );
}
