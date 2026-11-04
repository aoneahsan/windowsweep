import { useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { track } from '../lib/analytics';
import '../tours/walkthrough.css';

const SLIDES = [
  { id: 'scan', route: '/', screen: 'nav.home' },
  { id: 'sections', route: '/sections', screen: 'nav.sections' },
  { id: 'choose', route: '/picker', screen: 'nav.picker' },
  { id: 'protected', route: '/', screen: 'nav.home' },
  { id: 'rehearse', route: '/', screen: 'nav.home' },
  { id: 'result', route: '/run', screen: 'nav.run' },
  { id: 'report', route: '/history', screen: 'nav.history' },
] as const;

export function Walkthrough() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search: { step?: unknown } = useSearch({ strict: false });
  const parsed = Number(search.step);
  const number = Number.isInteger(parsed) && parsed >= 1 && parsed <= SLIDES.length ? parsed : 1;
  const slide = SLIDES[number - 1]!;
  const touchStartRef = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      if (next < 1 || next > SLIDES.length) return;
      void navigate({ to: '/walkthrough', search: next === 1 ? {} : { step: next } });
    },
    [navigate]
  );

  useEffect(() => {
    track('walkthrough_step_viewed', { step: number });
  }, [number]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input,select,textarea')) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(number + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(number - 1);
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [go, number]);

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">{t('tour.walkthrough.open')}</p>
          <h1 className="t-xl wide">{t('tour.walkthrough.open')}</h1>
        </div>
      </section>
      <section className="band band-app">
        <div
          className="wrap ws-walkthrough"
          onTouchStart={(event) => {
            touchStartRef.current = event.changedTouches[0]?.screenX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartRef.current === null) return;
            const delta =
              (event.changedTouches[0]?.screenX ?? touchStartRef.current) - touchStartRef.current;
            if (Math.abs(delta) > 45) go(number + (delta < 0 ? 1 : -1));
            touchStartRef.current = null;
          }}
        >
          <div className="ws-walk-copy">
            <p className="caps accent-ink">
              {t('tour.progress', { current: number, total: SLIDES.length })}
            </p>
            <h2 className="t-xl wide">{t(slide.screen)}</h2>
            <p className="lede">{t(`tour.walkthrough.${slide.id}`)}</p>
            <div className="ws-walk-dots" aria-label={t('tour.jump')}>
              {SLIDES.map((entry, index) => (
                <button
                  key={entry.id}
                  type="button"
                  className="ws-walk-dot"
                  aria-label={`${t('tour.jumpItem', { step: index + 1 })}: ${t(entry.screen)}`}
                  aria-current={index + 1 === number ? 'step' : undefined}
                  onClick={() => go(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="ws-tour-actions">
              <button
                className="btn"
                type="button"
                disabled={number === 1}
                onClick={() => go(number - 1)}
              >
                {t('tour.back')}
              </button>
              <Link
                className="btn"
                to={slide.route}
                onClick={() => track('walkthrough_cta_clicked', { step: number })}
              >
                {t(slide.screen)}
              </Link>
              {number === SLIDES.length ? (
                <Link
                  className="btn btn-primary"
                  to="/"
                  onClick={() => track('walkthrough_cta_clicked', { step: number })}
                >
                  {t('tour.walkthrough.finish')}
                </Link>
              ) : (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    track('walkthrough_cta_clicked', { step: number });
                    go(number + 1);
                  }}
                >
                  {t('tour.walkthrough.next')}
                </button>
              )}
            </div>
          </div>
          <figure className="ws-walk-figure">
            <img
              src={`/walkthrough/${slide.id}-1440.png`}
              alt={`${t(slide.screen)}: ${t(`tour.walkthrough.${slide.id}`)}`}
              width={1440}
              height={900}
            />
            <figcaption className="t-xs ink-3">
              {t('tour.walkthrough.fixture', { screen: t(slide.screen) })}
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
