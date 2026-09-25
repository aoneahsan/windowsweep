/**
 * *Where this file lives, and what else reads it* - `report.html:83-101`.
 *
 * 🔴 THE PATH IS THIS RUN'S OWN, not a pattern. The dummy printed
 * `%USERPROFILE%\.windowsweep\reports\run-<stamp>.json`, which is wrong twice for
 * this window: the engine names the file `report-<stamp>.json` (`lib/log.ps1` ->
 * `Save-Report`), and the window passes `--reports-dir` so every run writes into its
 * own folder under the app's local data, not the command line's. The dummy now draws
 * the window's layout, and this prints the real path (`lib/report-file.ts` ->
 * `reportPathOf`). It stays on screen: it names this machine's folders, so nothing
 * here is ever sent anywhere.
 */

import { Trans, useTranslation } from 'react-i18next';

export function ReportWhere({ path }: { path: string }) {
  const { t } = useTranslation();
  return (
    <section className="band band-well band-tight">
      <div className="wrap">
        <details className="disclose">
          <summary>
            <span className="disclose-line">{t('report.whereSummary')}</span>
            <span className="disclose-more">{t('consent.detailsMore')}</span>
          </summary>
          <div className="disclose-body">
            <p>
              <Trans
                i18nKey="report.whereBody"
                values={{ path }}
                components={{ 1: <code className="mono rep-path" /> }}
              />
            </p>
            <p>
              <Trans
                i18nKey="report.whereExport"
                components={{ 1: <code className="mono" />, 3: <code className="mono" /> }}
              />
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
