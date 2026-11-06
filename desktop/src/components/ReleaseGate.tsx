/** The approved shared release notice and full-window gate. */

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { buildVersion, REPO_URL } from '../lib/config';
import { openExternal } from '../lib/links';
import { errorText, logger } from '../lib/logger';
import { watchReleaseRecord } from '../lib/release-feed';
import {
  compareSemver,
  decideRelease,
  parseStoredNotice,
  type ReleaseDecision,
  type ReleaseRecord,
  type StoredReleaseNotice,
} from '../lib/release-state';
import { readStored, removeStored, writeStored } from '../lib/storage';
import { checkForUpdate, restartApp } from '../lib/updater';
import { useNotices } from '../state/notices';

const NOTICE_KEY = 'windowsweep:release-notice';
const RUN_ID = crypto.randomUUID();
const RELEASE_URL = `${REPO_URL}/releases`;
const SUPPORT_URL = `${REPO_URL}/issues`;

type InstallStatus = 'idle' | 'checking' | 'downloading' | 'installing' | 'offline' | 'failed';

function savedNotice(): StoredReleaseNotice | null {
  return parseStoredNotice(readStored<unknown>(NOTICE_KEY, null));
}

/** The dummy's URL states are available only in a development build for parity. */
function previewDecision(): ReleaseDecision | null {
  if (!import.meta.env.DEV) return null;
  const query = new URLSearchParams(window.location.search);
  const mode = query.get('release');
  if (
    mode !== 'notice' &&
    mode !== 'urgent' &&
    mode !== 'next' &&
    mode !== 'failed' &&
    mode !== 'offline'
  ) {
    return null;
  }
  const release: ReleaseRecord = {
    version: '1.4.1',
    severity: mode === 'urgent' ? 'urgent' : 'normal',
    reason: query.get('reason') || 'This release fixes an update issue.',
    minNativeVersion: null,
  };
  return mode === 'notice'
    ? { kind: 'notice', release, dismissed: false }
    : { kind: 'block', release, fromEarlierStart: mode === 'next' };
}

const PREVIEW = previewDecision();

function initialDecision(): ReleaseDecision {
  return (
    PREVIEW ??
    decideRelease({ running: buildVersion, record: null, stored: savedNotice(), runId: RUN_ID })
  );
}

/** A normal release is announced now; its saved notice blocks at the next launch. */
export function ReleaseGate() {
  const { t } = useTranslation();
  const [decision, setDecision] = useState<ReleaseDecision>(initialDecision);
  const [status, setStatus] = useState<InstallStatus>(() => {
    if (!import.meta.env.DEV) return 'idle';
    const mode = new URLSearchParams(window.location.search).get('release');
    return mode === 'offline' || mode === 'failed' ? mode : 'idle';
  });
  const [progress, setProgress] = useState<number | null>(null);
  const updateRef = useRef<HTMLButtonElement>(null);
  const storedRef = useRef<StoredReleaseNotice | null>(savedNotice());

  useEffect(() => {
    if (PREVIEW) return;
    return watchReleaseRecord((record: ReleaseRecord | null) => {
      const next = decideRelease({
        running: buildVersion,
        record,
        stored: storedRef.current,
        runId: RUN_ID,
      });
      if (next.kind === 'notice') {
        if (
          storedRef.current?.version !== next.release.version ||
          storedRef.current.runId !== RUN_ID
        ) {
          const saved: StoredReleaseNotice = {
            version: next.release.version,
            reason: next.release.reason,
            runId: RUN_ID,
            storedAt: new Date().toISOString(),
            dismissed: false,
          };
          storedRef.current = saved;
          writeStored(NOTICE_KEY, saved);
        }
      } else if (next.kind === 'none' && storedRef.current) {
        storedRef.current = null;
        removeStored(NOTICE_KEY);
      }
      setDecision(next);
    });
  }, []);

  const blocked = decision.kind === 'block';
  useEffect(() => {
    if (!blocked) return;
    const appRoot = document.getElementById('root');
    const makeInert = () => {
      appRoot?.querySelectorAll<HTMLElement>('.app').forEach((app) => {
        app.inert = true;
      });
    };
    makeInert();
    const observer = new MutationObserver(makeInert);
    if (appRoot) observer.observe(appRoot, { childList: true, subtree: true });
    updateRef.current?.focus();
    return () => {
      observer.disconnect();
      appRoot?.querySelectorAll<HTMLElement>('.app').forEach((app) => {
        app.inert = false;
      });
    };
  }, [blocked]);

  /* The legal bar gives way to either surface, so the gate says when one is up (`state/notices.ts`). */
  const shown = decision.kind === 'block' || (decision.kind === 'notice' && !decision.dismissed);
  useEffect(() => {
    useNotices.getState().setRelease(shown);
    return () => {
      useNotices.getState().setRelease(false);
    };
  }, [shown]);

  if (!shown) return null;

  const release = decision.release;
  const onUpdate = async (): Promise<void> => {
    setStatus('checking');
    setProgress(null);
    try {
      const outcome = await checkForUpdate();
      if (outcome.kind !== 'available') {
        setStatus(outcome.kind === 'skipped' && !navigator.onLine ? 'offline' : 'failed');
        return;
      }
      const updaterOrder = compareSemver(outcome.handle.version, release.version);
      if (updaterOrder === null || updaterOrder < 0) {
        setStatus('failed');
        return;
      }
      setStatus('downloading');
      await outcome.handle.downloadAndInstall((percent) => setProgress(percent));
      setStatus('installing');
      await restartApp();
    } catch (error) {
      logger.warn('release update failed', { error: errorText(error) });
      setStatus(navigator.onLine ? 'failed' : 'offline');
    }
  };

  const onLater = (): void => {
    if (decision.kind !== 'notice') return;
    const stored = storedRef.current;
    if (!stored) return;
    const dismissed = { ...stored, dismissed: true };
    storedRef.current = dismissed;
    writeStored(NOTICE_KEY, dismissed);
    setDecision({ ...decision, dismissed: true });
  };

  const external = (href: string): void => {
    void openExternal(href).catch((error: unknown) => {
      logger.warn('release fallback link failed', { error: errorText(error) });
    });
  };

  const busy = status === 'checking' || status === 'downloading' || status === 'installing';
  const hasFailed = status === 'failed';
  const titleKey = blocked ? 'release.block.title' : 'release.notice.title';
  return (
    <section
      className={blocked ? 'ws-release-block' : 'ws-release-notice'}
      data-ws-release=""
      role={blocked ? 'alertdialog' : 'status'}
      aria-modal={blocked ? true : undefined}
      aria-labelledby={blocked ? 'ws-release-title' : undefined}
    >
      <div className="panel pad ws-release-box">
        <p className="caps ink-3">{t('release.eyebrow')}</p>
        <h2 className="t-lg wide" id="ws-release-title">
          {t(titleKey, { version: release.version })}
        </h2>
        <p className="t-sm">
          {t(
            blocked
              ? decision.fromEarlierStart
                ? 'release.block.nextStart'
                : 'release.block.now'
              : 'release.notice.body'
          )}
        </p>
        {blocked ? (
          <>
            <p className="ws-release-reason">{release.reason}</p>
            <p className="mono t-sm ink-3">
              {t('release.versions', { running: buildVersion, required: release.version })}
            </p>
            <p className="t-sm ink-3">{t('release.settingsUntouched')}</p>
          </>
        ) : null}
        <p className="t-sm" role="status">
          {status === 'checking' ? t('release.checking') : null}
          {status === 'downloading'
            ? progress === null
              ? t('release.downloadingUnknown', { version: release.version })
              : t('release.downloading', {
                  version: release.version,
                  percent: Math.round(progress),
                })
            : null}
          {status === 'installing' ? t('release.installing') : null}
          {status === 'offline' ? t('release.offline') : null}
          {hasFailed ? t('release.failed') : null}
        </p>
        <div className="ws-release-actions">
          <button
            ref={updateRef}
            className="btn btn-primary"
            type="button"
            disabled={busy}
            onClick={() => void onUpdate()}
          >
            {t(
              hasFailed || status === 'offline'
                ? 'release.retry'
                : blocked
                  ? 'release.update'
                  : 'release.updateNow'
            )}
          </button>
          {!blocked ? (
            <button className="btn" type="button" onClick={onLater}>
              {t('release.later')}
            </button>
          ) : null}
        </div>
        {hasFailed ? (
          <div className="ws-release-fallback t-sm ink-3">
            <p>{t('release.fallback')}</p>
            <button className="lnk" type="button" onClick={() => external(RELEASE_URL)}>
              {t('release.releasePage')}
            </button>
            <p>{t('release.supportHint')}</p>
            <button className="lnk" type="button" onClick={() => external(SUPPORT_URL)}>
              {t('release.support')}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
