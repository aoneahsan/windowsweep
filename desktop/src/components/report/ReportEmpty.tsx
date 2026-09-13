/**
 * The Report screen with no run to show - never a blank page.
 *
 * Two cases. Nothing has run in this window yet: the heading and its sentence, which
 * were the app's words before the dummy had any and are now drawn there too
 * (`report.html?empty=1`). Or the run a link names has left the history (the list
 * keeps the newest 200 records): the way back to History, and one sentence saying so.
 */

import { useTranslation } from 'react-i18next';

import { ReportCrumbs } from './ReportHeader';

export function ReportEmpty({ notFound }: { notFound: boolean }) {
  const { t } = useTranslation();
  return (
    <section className="band band-app">
      <div className="wrap wrap-narrow">
        {notFound ? <ReportCrumbs /> : null}
        <h1 className="t-lg wide">{t(notFound ? 'report.notFound' : 'report.emptyTitle')}</h1>
        {notFound ? null : <p className="lede">{t('report.emptyBody')}</p>}
      </div>
    </section>
  );
}
