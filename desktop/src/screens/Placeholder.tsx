/**
 * A screen the click dummy specifies and the app has not translated yet.
 *
 * 🔴 This exists so the gap is DECLARED rather than hidden. The dummy specifies
 * the finished product; a route that silently 404s, or one that quietly shows an
 * empty panel, reads to a reviewer as a defect in the design rather than as work
 * that has not happened. §10's `pending-wave` exemption is exactly this case, and
 * the rule says the app declares it with a reason.
 *
 * It is removed screen by screen as each is built. When this file has no callers
 * left, delete it - it is scaffolding, not a component.
 */

import { useTranslation } from 'react-i18next';

const DUMMY_PAGE: Record<string, string> = {
  picker: 'picker.html',
  history: 'history.html',
  report: 'report.html',
  account: 'account.html',
  settings: 'settings.html',
  elevation: 'elevation.html',
};

export function Placeholder({ screen }: { screen: string }) {
  const { t } = useTranslation();
  return (
    <section className="band band-app">
      <div className="wrap wrap-narrow">
        <p className="caps ink-3">{t('pending.eyebrow')}</p>
        <h1 className="t-lg wide">{t('pending.title')}</h1>
        <p className="lede">{t('pending.body')}</p>
        <div className="panel pad" style={{ marginTop: 'var(--sp-4)' }}>
          <p className="t-sm ink-3">
            {t('pending.reference')} <code className="mono">{DUMMY_PAGE[screen] ?? screen}</code>
          </p>
        </div>
      </div>
    </section>
  );
}
