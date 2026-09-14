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
 * 🔴 "HELD BACK RIGHT NOW" IS BUILT, and the `pending.heldBack` declaration that
 * stood here is gone. It said the figure had "no measured source", and the premise
 * was right while the conclusion was not: `lib/scan.ps1:60-65` does size each
 * target ON DISK, and the scan prints its own caveat saying so - "These are sizes
 * on disk, not what a run would delete: the idle gate keeps recently used files".
 * No single field reports what the gate kept. The DIFFERENCE between two fields
 * does: the safe-batch scan subset minus a dry-run's `estimated_bytes`, which is
 * what that run would actually delete with the gate applied. So the figure appears
 * once "Dry-run first" has rehearsed the safe run, and reads "not measured" until
 * then - and again once developer mode, the idle window or the exclusions move,
 * because a gap measured under other arguments is not this one (D-60,
 * `lib/rehearsal.ts`). `lib/reclaim.ts` -> `heldBackBySection` records the four guards
 * that keep the subtraction like-for-like.
 *
 * 🔴 THE DUMMY'S COUNT SUB-LINE IS BUILT - "N caches used in the last M days". It was
 * declined while the figure above it was a whole-batch subtraction with no set
 * behind it. Both now read the same developer sections (`lib/reclaim.ts`): the
 * figure is what the idle gate keeps there, the count is how many of those caches
 * were written inside the window - a fact from the scan's own timestamps, and one
 * that holds back at least that much. `recentDeveloperCaches` records what it
 * cannot see.
 *
 * 🔴 THE CAPTION UNDER THE STATE LINE FOLLOWS THE SWITCH (D-25, GATE 4 round 7 -
 * the dummy was amended first, `index.html` `[data-ws-text="devNote"]`). It was
 * one fixed sentence, so with developer mode OFF the page read "Off - every cache
 * is offered in full" directly above "Caches you have used recently are left
 * alone": false at that setting, and false in the direction that understates
 * deletion. Off now carries the dummy's own sentence for it, from its Settings row.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import { MAX_IDLE_DAYS, MIN_IDLE_DAYS } from '../state/store';
import { useHeldBackBytes, useRecentDeveloperCaches } from '../state/derived';

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
  /* Read here rather than threaded through Home, which is already at the file
     ceiling. The same hook feeds the Settings row, so the two cannot differ. */
  const heldBack = useHeldBackBytes();
  const recent = useRecentDeveloperCaches();

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
          <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-1)' }}>
            {developer ? t('home.developerNote') : t('home.developerNoteOff')}
          </p>
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
        {/* The dummy's two columns (`index.html`, the held-back well): the reading
            at its own width, the idle window taking the rest. Both used to grow here,
            which moved the slider half a column right - hidden while the reading's
            count line was long, and plain once `index.html?empty=1` drew the state
            before a scan (D-53, GATE 4 round 8). */}
        <div>
          <p className="caps ink-3">{t('home.heldBackTitle')}</p>
          {/* `index.html:130` - the dummy's `.num.t-lg.wide` slot. 🔴 `not
              measured` is this app's own honest state and the word Home's hero and
              the ladder already use for it: the two measurements this figure needs
              are a scan and a DRY-RUN, and a person who has only scanned has half
              of the pair. A zero here would say the gate is holding nothing back,
              which is a claim nothing has checked. */}
          <p className="num t-lg wide">
            {heldBack === null ? t('home.notMeasured') : formatBytes(heldBack)}
          </p>
          {/* `index.html`'s `devHeldN` line. Absent before a scan: there is no count
              to state until something has read the timestamps. */}
          {recent === null ? null : (
            <p className="t-xs ink-3">{t('home.heldBackCount', { count: recent, days: idleDays })}</p>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '11rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)' }}>
            <label className="caps ink-3" htmlFor="idle-window">{t('home.idleWindow')}</label>
            {/* The value the slider is at. The dummy prints this number inside the
                count sentence beside it, which this app declines (see the header),
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
