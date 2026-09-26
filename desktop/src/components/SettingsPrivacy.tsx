/**
 * Settings -> Privacy. Translated from `page-settings.js` -> `privacy()`, in its words and its rows.
 *
 * 🔴 The panel STATES; it does not offer. It carried four switches until 2026-09-07, when the owner removed the
 * opt-out: every row now ends in an `on` badge and the note says there is no switch. A control a person can press
 * that changes nothing is worse than no control - it is a promise the product does not keep.
 *
 * 🔴 THE DUMMY'S ROWS, NOT THE CONSENT NOTICE'S LIST (D-69, GATE 4 round 16). From 2026-09-07 this tab reused the
 * Consent screen's keys - the vendor badges, the longer lines, "Never sent:" and a closing paragraph - which the dummy
 * never drew here: it draws a note and five `row()`s, each an `h3` and one short line. The Consent screen keeps its own
 * words (`consent.*`); this tab has its own (`settings.privacy.*`), each transcribed from the dummy.
 *
 * The "Never sent" row stays and is the point of the tab - a notice with nothing checkable in it is an announcement.
 */

import { useTranslation } from 'react-i18next';

import { configuredFeatures, noDestinationConfigured } from '../lib/config';
import { SettingRow } from './SettingRow';

export function SettingsPrivacy() {
  const { t } = useTranslation();
  const on = <span className="badge badge-outline">{t('consent.badgeOn')}</span>;

  return (
    <div className="set-grp">
      <div className="note note-info">
        <span aria-hidden="true">i</span>
        <span>{t('settings.privacy.note')}</span>
      </div>
      <SettingRow
        title={t('settings.privacy.productAnalytics')}
        description={t('settings.privacy.productAnalyticsDesc')}
        control={on}
      />
      <SettingRow
        title={t('settings.privacy.behaviourAnalytics')}
        description={t('settings.privacy.behaviourAnalyticsDesc')}
        control={on}
      />
      <SettingRow
        title={t('settings.privacy.sessionReplay')}
        description={t('settings.privacy.sessionReplayDesc')}
        control={on}
      />
      <SettingRow
        title={t('settings.privacy.crashReports')}
        description={t('settings.privacy.crashReportsDesc')}
        control={on}
      />
      <SettingRow
        title={t('settings.privacy.neverSent')}
        description={t('settings.privacy.neverSentDesc')}
        control={<span className="badge badge-ok">{t('settings.refused')}</span>}
      />
      {/* A BUILD fact, not a setting, and only when EVERY destination is unconfigured: a build with one key set
          still sends to that one, so the sentence would be false. The dummy draws no sentence for a partially
          configured build, so none is invented here. Release builds carry all four keys and never show it. */}
      {noDestinationConfigured(configuredFeatures().telemetry) ? (
        <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-2)' }}>
          {t('settings.noKeys')}
        </p>
      ) : null}
    </div>
  );
}
