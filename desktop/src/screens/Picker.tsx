/**
 * Picker - the interactive sections, where a person chooses row by row.
 *
 * Translated from `picker.html`. Sections 17, 18, 19 and 23 never auto-confirm:
 * `--yes` does not answer them, by design in the engine. This screen is how a
 * person answers them in advance, and the answer travels to the engine as a
 * `--select-file` of full paths.
 *
 * 🔴 The consequence line is not decoration. The segmented control chooses between
 * the Recycle Bin and permanent deletion, and those differ in the one way that
 * matters - "The Recycle Bin can be emptied later. Permanent has no undo." It sits
 * next to the control, not in a toast after the fact.
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { formatBytes } from '../lib/format';
import { candidatesBySection } from '../lib/cli';

export function Picker() {
  const { t } = useTranslation();
  const candidates = useStore((s) => s.candidates);
  const selectedPaths = useStore((s) => s.selectedPaths);
  const toggleCandidate = useStore((s) => s.toggleCandidate);
  const setSelection = useStore((s) => s.setSelection);
  const catalogue = useStore((s) => s.catalogue);
  const [permanent, setPermanent] = useState(false);

  const grouped = useMemo(() => candidatesBySection(candidates), [candidates]);
  const chosenBytes = candidates
    .filter((c) => selectedPaths.has(c.path))
    .reduce((total, c) => total + c.bytes, 0);

  if (candidates.length === 0) {
    return (
      <section className="band band-app">
        <div className="wrap wrap-narrow">
          <p className="caps ink-3">{t('picker.eyebrow')}</p>
          <h1 className="t-lg wide">{t('picker.emptyTitle')}</h1>
          <p className="lede">{t('picker.emptyBody')}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">{t('picker.eyebrow')}</p>
          <h1 className="t-xl wide">{t('picker.title')}</h1>
          <p className="lede">{t('picker.lede')}</p>
        </div>
      </section>

      {[...grouped.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([section, rows]) => {
          const meta = catalogue?.sections.find((s) => s.id === section);
          const allChosen = rows.every((r) => selectedPaths.has(r.path));
          return (
            <section className="band band-app band-tight" key={section}>
              <div className="wrap">
                <div className="zone-label">
                  <span className="caps">
                    <span className="num">{section}</span> {meta?.key ?? ''}
                  </span>
                  <button
                    className="btn btn-sm btn-ghost"
                    type="button"
                    style={{ flex: 'none' }}
                    onClick={() => {
                      const others = [...selectedPaths].filter(
                        (p) => !rows.some((r) => r.path === p),
                      );
                      setSelection(allChosen ? others : [...others, ...rows.map((r) => r.path)]);
                    }}
                  >
                    {allChosen ? t('picker.chooseNone') : t('picker.chooseAll')}
                  </button>
                </div>
                <div className="lst">
                  {rows.map((r) => (
                    <div className="lst-i" key={r.path} data-selected={selectedPaths.has(r.path)}>
                      <div className="lst-x">
                        {/* 🔴 The dummy's row control is a switch at a reduced
                            width, not a bare `<input type="checkbox">`. The bare
                            input had no style in this design system at all - a
                            raw UA control on the one screen where what is ticked
                            decides what gets deleted. The row itself now carries
                            `data-selected`, so the choice is legible from across
                            the row rather than from one 16px box. */}
                        <button
                          className="switch"
                          type="button"
                          role="switch"
                          aria-checked={selectedPaths.has(r.path)}
                          aria-label={t('picker.chooseRow', { path: r.path })}
                          style={{ ['--sw-w' as string]: 'calc(1.9rem * var(--density))' }}
                          onClick={() => { toggleCandidate(r.path); }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="t-sm mono" style={{ overflowWrap: 'anywhere' }}>
                          {r.path}
                        </div>
                        {r.project ? <div className="t-xs ink-3">{r.project}</div> : null}
                      </div>
                      <div className="lst-x">
                        <span className="num t-sm">{formatBytes(r.bytes)}</span>
                        {r.idle_days !== null ? (
                          <span className="t-xs ink-3">
                            {t('picker.idleDays', { count: r.idle_days })}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

      <section className="band band-bleed band-tight">
        <div className="wrap">
          <div
            style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <span className="num t-md wide accent-ink">{formatBytes(chosenBytes)}</span>
            <span className="t-sm ink-2">
              {t('picker.chosen', { count: selectedPaths.size })}
            </span>
            <div
              style={{ marginInlineStart: 'auto', display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}
            >
              {/* 🔴 A label wrapping a real radio, which is what `.seg-opt` is
                  styled for: the selected paint is `.seg-opt:has(input:checked)`,
                  so the previous `<button role="radio" aria-checked>` matched NO
                  rule - the control that chooses between the Recycle Bin and
                  permanent deletion showed no selection at all. Native radios in
                  one group also bring arrow-key traversal with them. */}
              <div className="seg" role="radiogroup" aria-label={t('picker.howToDelete')}>
                <label className="seg-opt">
                  <input
                    type="radio"
                    name="pick-mode"
                    value="recycle"
                    checked={!permanent}
                    onChange={() => { setPermanent(false); }}
                  />
                  <span>{t('picker.recycleBin')}</span>
                </label>
                <label className="seg-opt">
                  <input
                    type="radio"
                    name="pick-mode"
                    value="permanent"
                    checked={permanent}
                    onChange={() => { setPermanent(true); }}
                  />
                  <span>{t('picker.permanent')}</span>
                </label>
              </div>
              {/* 🔴 Disabled, and declared. The removal needs the engine's
                  `--select-file`, which is a file the Rust side has to write, and
                  no such command exists in this build. It was accepting presses
                  and doing nothing at all, which is the worst reading of the two:
                  a person could tick rows, press it, and believe a deletion had
                  been queued. */}
              <button className="btn btn-sm btn-primary" type="button" disabled>
                <span className="btn-label">{t('picker.remove')}</span>
              </button>
            </div>
          </div>
          {/* 🔴 Beside the control, not after the deletion. */}
          <p className="t-sm ink-3 selbar-note">{t('picker.consequence')}</p>
          {/* The stated gap that goes with the disabled button above. Named here
              rather than hidden, per §10a's `pending-wave` exemption. */}
          <p className="t-xs ink-3">{t('pending.body')}</p>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
