/**
 * Developer mode, and the idle window it reads.
 *
 * Translated from `index.html:118-141`. It sits inside the drives column rather
 * than in a band of its own, because it is what decides how much of the ladder
 * beside it there is.
 *
 * 🔴 THE IDLE WINDOW IS BUILT, AND IT IS REAL. The engine documents
 * `-d, --days N` ("Idle threshold for caches (default 100). A file goes only when
 * its newest timestamp is at least N days old"), the Rust side already allows it
 * as a value flag, and `safeBatchArgs` passes it on every run - so moving this
 * slider changes what the next run deletes, and the Run screen's status bar shows
 * the changed command line. `lib/actions.ps1:210` is the engine saying the same
 * thing from the other side: with developer mode on, "only files idle $Days+ days
 * go".
 *
 * 🔴 "HELD BACK RIGHT NOW" IS DECLARED, NOT BUILT - `pending.heldBack`
 * (pending-wave). `lib/scan.ps1:60-65` sizes each target with
 * `Get-DirectoryBytes`, which is its size ON DISK; the scan then prints its own
 * caveat, "These are sizes on disk, not what a run would delete: the idle gate
 * keeps recently used files". Nothing in the `--json` summary reports what the
 * gate kept, so the dummy's `0 B` and its "N caches" count have no measured
 * source here. The dummy's own figures are seeded (`seed.js`).
 */

import { useTranslation } from 'react-i18next';

import { MAX_IDLE_DAYS, MIN_IDLE_DAYS } from '../state/store';

export function DeveloperMode({
  developer,
  onDeveloper,
  idleDays,
  onIdleDays,
}: {
  developer: boolean;
  onDeveloper: (on: boolean) => void;
  idleDays: number;
  onIdleDays: (days: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="panel pad">
      <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
        <button
          className="switch"
          type="button"
          role="switch"
          aria-checked={developer}
          aria-label={t('home.developerTitle')}
          onClick={() => { onDeveloper(!developer); }}
        />
        <div>
          <p className="t-sm">{developer ? t('home.developerOn', { days: idleDays }) : t('home.developerOff')}</p>
          <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-1)' }}>{t('home.developerNote')}</p>
        </div>
      </div>

      {/* The dummy's well: the held-back figure on the left, the idle window on
          the right (`index.html:128-140`). */}
      <div
        className="well pad-s"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--sp-5)',
          alignItems: 'center',
          marginTop: 'var(--sp-4)',
        }}
      >
        <div style={{ flex: '1 1 14rem' }}>
          <p className="caps ink-3">{t('home.heldBackTitle')}</p>
          {/* The stated gap that stands where the figure and its count would be. */}
          <p className="t-xs ink-3">{t('pending.heldBack')}</p>
        </div>

        <div style={{ flex: '1 1 11rem', minWidth: '11rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)' }}>
            <label className="caps ink-3" htmlFor="idle-window">{t('home.idleWindow')}</label>
            {/* The value the slider is at. The dummy prints this number inside the
                held-back sentence beside it; that sentence is declared away here,
                so the control carries its own reading rather than moving in
                silence. */}
            <span className="num t-sm wide">{t('home.idleWindowDays', { count: idleDays })}</span>
          </div>
          <input
            id="idle-window"
            className="field"
            type="range"
            min={MIN_IDLE_DAYS}
            max={MAX_IDLE_DAYS}
            step={1}
            value={idleDays}
            onChange={(e) => { onIdleDays(Number(e.target.value)); }}
          />
          <p className="t-sm ink-3">{t('home.idleWindowHint')}</p>
        </div>
      </div>
    </div>
  );
}
