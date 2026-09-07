/**
 * Consent - the first-run NOTICE, and a SAFETY SURFACE.
 *
 * 🔴 It was a four-switch decision until 2026-09-07, when the owner decided there
 * is no opt-out: *"do not give user option to turn off any of those analytics or
 * anything, it's a free production, just mention we use that to improve the
 * product, with no option to opt out"*, and then *"keep it simple 1 line we
 * collect to improve the product for everyone, sweet and simple"*. So this screen
 * states what is collected and continues. It does not ask, and there is nothing on
 * it that can be turned off.
 *
 * 🔴 Humor is off entirely here. Nothing dry, nothing clever, no aside. A person
 * is being told what leaves their machine, and a joke in that moment reads as
 * someone hurrying them past it.
 *
 * 🔴 The disclosure STAYS, and it is the point. A notice with nothing checkable
 * in it is an announcement; the itemised refusal - never a file path, never your
 * user name - is what makes the one line credible. That is the Bible's band R:
 * reassurance as a specific refusal, never as an adjective.
 *
 * Translated from `consent.html` as amended on 2026-09-07. Every string is the
 * dummy's.
 */

import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

import { Shell } from '../components/Shell';
import { COLLECTED_KEYS, markNoticeSeen } from '../lib/consent';
import { controlState, stateOf } from '../lib/control-state';

export function Consent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onContinue = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    markNoticeSeen();
    void navigate({ to: '/' });
  }, [submitting, navigate]);

  return (
    <Shell rail={false}>
      <section className="band band-app">
        <div className="wrap wrap-narrow">
          <p className="caps ink-3">{t('consent.eyebrow')}</p>
          <h1 className="t-xl wide">{t('consent.title')}</h1>
          {/* 🔴 `Trans`, not two keys glued together: the bold sits in the middle
              of the sentence, and a sentence assembled from translated fragments
              is a sentence no other language can reorder. The markup lives in the
              catalogue value, where a translator can move it. */}
          <p className="lede">
            <Trans i18nKey="consent.lede" components={{ 1: <strong /> }} />
          </p>
        </div>
      </section>

      <section className="band band-app band-tight">
        <div className="wrap wrap-narrow">
          <div className="panel pad">
            <p>
              <strong>{t('consent.neverSentLabel')}</strong> {t('consent.neverSent')}
            </p>
          </div>

          <details className="disclose" style={{ marginTop: 'var(--sp-4)' }}>
            <summary>
              <span className="disclose-line">{t('consent.detailsSummary')}</span>
              <span className="disclose-more">{t('consent.detailsMore')}</span>
            </summary>
            <div className="disclose-body">
              {/* Three whole sentences in one paragraph, read from the same three
                  keys the destination ledger uses - not fragments of a sentence,
                  and one source rather than two copies that can drift. */}
              <p>{COLLECTED_KEYS.map((key) => t(key)).join(' ')}</p>
              <p>{t('consent.noSwitch')}</p>
            </div>
          </details>
        </div>
      </section>

      <section className="band band-bleed band-tight">
        <div
          className="wrap wrap-narrow"
          style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <p className="t-sm">{t('consent.summary')}</p>
          <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={onContinue}
              disabled={submitting}
              {...controlState(stateOf(submitting))}
            >
              <span className="btn-label">{t('consent.continue')}</span>
            </button>
          </div>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </Shell>
  );
}
