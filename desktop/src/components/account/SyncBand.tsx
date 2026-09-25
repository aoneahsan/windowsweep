/**
 * The Sync band - `account.html`'s `[data-ws-sync]` rows, while signed in the run
 * summaries the account holds (`[data-ws-cloud-runs]`, `CloudRuns.tsx`), and the "What
 * happens when two machines disagree" disclosure under them.
 *
 * 🔴 THE ROWS SAY WHAT IS TRUE, IN THE DUMMY'S WORDS (TASK-013). With sync running
 * they read its signed-in states - "Synced 2 minutes ago", "3 of 8 runs uploaded -
 * date, bytes, section count" - from the product's own numbers; with no keys in the
 * build, or nobody signed in, they read "Local only", which is then the whole truth.
 *
 * 🔴 AND A ROW'S SECOND LINE SAYS WHAT WENT WRONG, OR WHAT WAS REPLACED (2026-09-25,
 * the dummy amended first). The Settings row keeps "Local only" or its last "Synced ..."
 * time and names the step that failed (SY-02a); the Run summaries row counts what waits
 * to be tried again (SY-02b). When the account's newer settings replaced this machine's,
 * the Settings row says so with an Undo beside it (SY-03, D40) - and that outranks a
 * failure line, because it carries the only control. One second line per row.
 *
 * "3 of 8" is this window's own History - the runs made here - and how many of them
 * the account holds. Runs made before signing in are not sent afterwards: the dummy's
 * sign-in acknowledgement is "Your settings will sync from now on".
 *
 * 🔴 The disclosure SHIPS now. It was withheld while its first promise - you are told
 * which change won, with an Undo that puts the other back - had nothing behind it; the
 * notice is that, and S-165 was amended to name where it is kept (D40).
 */

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { AuthUser } from '../../lib/auth';
import { configuredFeatures } from '../../lib/config';
import { formatRelative } from '../../lib/format';
import { cleanupRuns } from '../../lib/history-rows';
import { undoReplacement } from '../../lib/sync-session';
import { useSyncStatus } from '../../lib/sync-state';
import { useStore } from '../../state/store';
import { CloudRuns } from './CloudRuns';

/** "Synced 2 minutes ago" ages on its own; this is how often it is re-read. */
const TICK_MS = 30_000;

/**
 * One row of the band. `second` is its second line - its live region is always in the
 * DOM, so a line landing while this screen is open is announced - and `action` sits
 * beside that line, outside the region.
 */
function SyncRow({
  title,
  line,
  on,
  second,
  secondId,
  action,
}: {
  title: string;
  line: string;
  on: boolean;
  second: string | null;
  secondId?: string;
  action?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="lst-i">
      <div style={{ flex: 1 }}>
        <div className="t-base">{title}</div>
        <div className="t-sm ink-3">{line}</div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            ...(second ? { marginTop: 'var(--sp-2)' } : {}),
          }}
        >
          <div className="t-sm" role="status" id={secondId}>
            {second}
          </div>
          {second ? action : null}
        </div>
      </div>
      <div className="lst-x">
        <span className={on ? 'badge badge-ok' : 'badge badge-neutral'}>
          {t(on ? 'account.sync.badgeSyncing' : 'account.sync.badgeLocal')}
        </span>
      </div>
    </div>
  );
}

export function SyncBand({ user }: { user: AuthUser | null }) {
  const { t } = useTranslation();
  const active = useSyncStatus((s) => s.active);
  const syncedAt = useSyncStatus((s) => s.settingsSyncedAt);
  const failed = useSyncStatus((s) => s.settingsFailed);
  const uploaded = useSyncStatus((s) => s.uploaded);
  const pending = useSyncStatus((s) => s.pending);
  const replaced = useSyncStatus((s) => s.replaced !== null);
  const history = useStore((s) => s.history);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const noticeId = useId();
  const live = configuredFeatures().sync && user !== null && active;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!live) return;
    const tick = window.setInterval(() => {
      setNow(Date.now());
    }, TICK_MS);
    return () => {
      window.clearInterval(tick);
    };
  }, [live]);

  const localOnly = t('account.sync.localOnly');
  let settingsLine = localOnly;
  if (live && syncedAt !== null) {
    /* Never "in 5 seconds": a sync that landed after the last tick reads as now. */
    const when = formatRelative(new Date(Math.min(syncedAt, now)), new Date(now));
    settingsLine = t('account.sync.syncedAgo', { when });
  }
  let settingsSecond: string | null = null;
  if (live && replaced) settingsSecond = t('account.sync.conflict.notice');
  else if (live && failed === 'read') settingsSecond = t('account.sync.failed.settingsRead');
  else if (live && failed === 'write') settingsSecond = t('account.sync.failed.settingsWrite');

  const runs = cleanupRuns(history);
  const stored = new Set(uploaded);

  /* 🔴 Undo is the next settings change (D40): it ends the notice, so this control
     leaves as it is pressed - and focus goes to the band's heading, never the top. */
  function onUndo() {
    undoReplacement();
    headingRef.current?.focus();
  }

  return (
    <section className="band band-well band-tight">
      <div className="wrap">
        {/* tabIndex -1: where focus goes when the Undo or the list's last row leaves. */}
        <h2 className="t-md wide" ref={headingRef} tabIndex={-1}>
          {t('account.syncTitle')}
        </h2>
        <div className="lst panel" style={{ marginTop: 'var(--sp-3)' }}>
          <SyncRow
            title={t('account.sync.settings')}
            line={settingsLine}
            on={live && syncedAt !== null}
            second={settingsSecond}
            secondId={noticeId}
            action={
              live && replaced ? (
                <button
                  className="btn btn-sm"
                  type="button"
                  aria-describedby={noticeId}
                  onClick={onUndo}
                >
                  <span className="btn-label">{t('account.sync.conflict.undo')}</span>
                </button>
              ) : null
            }
          />
          <SyncRow
            title={t('account.sync.runs')}
            line={
              live
                ? t('account.sync.runsUploaded', {
                    uploaded: runs.filter((r) => stored.has(r.runId)).length,
                    total: runs.length,
                  })
                : localOnly
            }
            on={live}
            second={
              live && pending > 0 ? t('account.sync.failed.upload', { count: pending }) : null
            }
          />
          <SyncRow
            title={t('account.sync.paths')}
            line={t('account.sync.never')}
            on={false}
            second={null}
          />
        </div>
        {live && user ? (
          <CloudRuns user={user} onEmptied={() => headingRef.current?.focus()} />
        ) : null}
        <details className="disclose" style={{ marginTop: 'var(--sp-4)' }}>
          <summary>
            <span className="disclose-line">{t('account.disagree.summary')}</span>
            <span className="disclose-more">{t('consent.detailsMore')}</span>
          </summary>
          <div className="disclose-body">
            <p>
              <Trans i18nKey="account.disagree.settings" components={{ 1: <strong /> }} />
            </p>
            <p>{t('account.disagree.runs')}</p>
          </div>
        </details>
      </div>
    </section>
  );
}
