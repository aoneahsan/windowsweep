/**
 * Home's one line about sync - `index.html`'s `[data-ws-settings-replaced]` (SY-07, D40).
 *
 * While the Account screen's replacement notice stands, Home says so after the sub-line
 * and before Scan, Dry-run first and Reclaim, in reading and tab order: a replacement can
 * land at boot, before anyone opens Account, and the synced developer switch decides
 * what a run started here keeps. It reads the SAME state the notice does
 * (`useSyncStatus` -> `replaced`), so the two begin and end together - and are withheld
 * together when D41 or D42 withholds the notice.
 *
 * 🔴 BOOT-SAFE: `lib/sync-state.ts` imports zustand alone, so Home reading it loads no
 * part of the Supabase client. In a build without the keys `replaced` is never set.
 *
 * The live region is always in the DOM, so a replacement landing while Home is open is
 * announced. Its one control is the link; the Undo itself is on Account.
 */

import { Link } from '@tanstack/react-router';
import { Trans } from 'react-i18next';

import { useSyncStatus } from '../../lib/sync-state';

export function SettingsReplacedLine() {
  const standing = useSyncStatus((s) => s.replaced !== null);
  return (
    <div role="status">
      {standing ? (
        <div className="note note-info" style={{ marginTop: 'var(--sp-4)' }}>
          <span aria-hidden="true">i</span>
          <span className="t-sm">
            <Trans
              i18nKey="home.settingsReplaced"
              components={{ 1: <Link to="/account" className="lnk" /> }}
            />
          </span>
        </div>
      ) : null}
    </div>
  );
}
