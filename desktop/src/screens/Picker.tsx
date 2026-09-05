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
                    <div className="lst-i" key={r.path}>
                      <div className="lst-x">
                        <input
                          type="checkbox"
                          checked={selectedPaths.has(r.path)}
                          aria-label={r.path}
                          onChange={() => { toggleCandidate(r.path); }}
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
              <div className="seg" role="radiogroup" aria-label={t('picker.howToDelete')}>
                <button
                  className="seg-opt"
                  type="button"
                  role="radio"
                  aria-checked={!permanent}
                  onClick={() => { setPermanent(false); }}
                >
                  <span>{t('picker.recycleBin')}</span>
                </button>
                <button
                  className="seg-opt"
                  type="button"
                  role="radio"
                  aria-checked={permanent}
                  onClick={() => { setPermanent(true); }}
                >
                  <span>{t('picker.permanent')}</span>
                </button>
              </div>
              <button
                className="btn btn-sm btn-primary"
                type="button"
                disabled={selectedPaths.size === 0}
              >
                {t('picker.remove')}
              </button>
            </div>
          </div>
          {/* 🔴 Beside the control, not after the deletion. */}
          <p className="t-sm ink-3 selbar-note">{t('picker.consequence')}</p>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
