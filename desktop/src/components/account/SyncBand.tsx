/**
 * The Sync band - `account.html`'s `[data-ws-sync]` rows and, while signed in, the run
 * summaries the account holds (`[data-ws-cloud-runs]`, `CloudRuns.tsx`).
 *
 * 🔴 THE ROWS SAY WHAT IS TRUE, IN THE DUMMY'S WORDS (TASK-013). With sync running
 * they read its signed-in states - "Synced 2 minutes ago", "3 of 8 runs uploaded -
 * date, bytes, section count" - from the product's own numbers; with no keys in the
 * build, or nobody signed in, they read "Local only", which is then the whole truth.
 * A sync that fails says so in the same words rather than new ones: the settings row
 * stays "Local only" until a first round-trip succeeds, its time stops moving once
 * one fails, and the run count counts only what the account confirmed.
 *
 * "3 of 8" is this window's own History - the runs made here - and how many of them
 * the account holds. Runs made before signing in are not sent afterwards: the dummy's
 * sign-in acknowledgement is "Your settings will sync from now on".
 *
 * 🔴 The dummy's "What happens when two machines disagree" disclosure is STILL
 * withheld. Its first promise - you are told which change won, with an Undo that puts
 * the other back - has no words in the dummy yet (NEEDS DECISION, TASK-013), and a
 * disclosure promising an Undo that nothing offers would be the old defect again.
 */

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { AuthUser } from '../../lib/auth';
import { configuredFeatures } from '../../lib/config';
import { formatRelative } from '../../lib/format';
import { cleanupRuns } from '../../lib/history-rows';
import { useSyncStatus } from '../../lib/sync-state';
import { useStore } from '../../state/store';
import { CloudRuns } from './CloudRuns';

/** "Synced 2 minutes ago" ages on its own; this is how often it is re-read. */
const TICK_MS = 30_000;

interface SyncRow {
  key: 'settings' | 'runs' | 'paths';
  line: string;
  /** Whether the row is syncing (`badge-ok`) or local (`badge-neutral`). */
  on: boolean;
}

export function SyncBand({ user }: { user: AuthUser | null }) {
  const { t } = useTranslation();
  const active = useSyncStatus((s) => s.active);
  const syncedAt = useSyncStatus((s) => s.settingsSyncedAt);
  const uploaded = useSyncStatus((s) => s.uploaded);
  const history = useStore((s) => s.history);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const live = configuredFeatures().sync && user !== null && active;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!live) return;
    const tick = window.setInterval(() => { setNow(Date.now()); }, TICK_MS);
    return () => { window.clearInterval(tick); };
  }, [live]);

  const localOnly = t('account.sync.localOnly');
  let settings: SyncRow = { key: 'settings', line: localOnly, on: false };
  if (live && syncedAt !== null) {
    /* Never "in 5 seconds": a sync that landed after the last tick reads as now. */
    const when = formatRelative(new Date(Math.min(syncedAt, now)), new Date(now));
    settings = { key: 'settings', line: t('account.sync.syncedAgo', { when }), on: true };
  }
  const runs = cleanupRuns(history);
  const stored = new Set(uploaded);
  const rows: SyncRow[] = [
    settings,
    {
      key: 'runs',
      line: live
        ? t('account.sync.runsUploaded', {
            uploaded: runs.filter((r) => stored.has(r.runId)).length,
            total: runs.length,
          })
        : localOnly,
      on: live,
    },
    { key: 'paths', line: t('account.sync.never'), on: false },
  ];

  return (
    <section className="band band-well band-tight">
      <div className="wrap">
        {/* tabIndex -1: where focus goes when the list's last row is removed. */}
        <h2 className="t-md wide" ref={headingRef} tabIndex={-1}>
          {t('account.syncTitle')}
        </h2>
        <div className="lst panel" style={{ marginTop: 'var(--sp-3)' }}>
          {rows.map((row) => (
            <div className="lst-i" key={row.key}>
              <div style={{ flex: 1 }}>
                <div className="t-base">{t(`account.sync.${row.key}`)}</div>
                <div className="t-sm ink-3">{row.line}</div>
              </div>
              <div className="lst-x">
                <span className={row.on ? 'badge badge-ok' : 'badge badge-neutral'}>
                  {t(row.on ? 'account.sync.badgeSyncing' : 'account.sync.badgeLocal')}
                </span>
              </div>
            </div>
          ))}
        </div>
        {live && user ? <CloudRuns user={user} onEmptied={() => headingRef.current?.focus()} /> : null}
      </div>
    </section>
  );
}
