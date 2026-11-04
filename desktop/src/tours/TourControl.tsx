import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useRouterState, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Icon } from '../components/Icon';
import { track } from '../lib/analytics';
import { supabase } from '../lib/auth';
import { readStored, writeStored } from '../lib/storage';
import { useStore } from '../state/store';
import { isTourRoute, visibleSteps, type TourRoute } from './registry';
import './tour.css';

const HINT_KEY = 'windowsweep:tour-hinted';
const EMPTY_HINTS: Record<string, boolean> = {};
const PAGE_TITLE: Record<TourRoute, string> = {
  '/': 'nav.home',
  '/sections': 'nav.sections',
  '/picker': 'nav.picker',
  '/run': 'nav.run',
  '/history': 'nav.history',
  '/report': 'nav.report',
  '/account': 'nav.account',
  '/settings': 'nav.settings',
  '/plans': 'nav.plans',
};

function stepKey(id: string): string {
  const parts = id.split('-');
  const page = parts.shift() ?? '';
  const subject = parts
    .map((part, index) => (index ? part[0]?.toUpperCase() + part.slice(1) : part))
    .join('');
  return `tour.${page}.${subject}`;
}

function tourId(path: string): string {
  return path === '/' ? 'home' : path.slice(1);
}

export function TourControl() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const search: { tour?: unknown } = useSearch({ strict: false });
  const phase = useStore((s) => s.phase);
  const userId = useStore((s) => s.user?.uid ?? null);
  const [hint, setHint] = useState(false);
  const [remoteState, setRemoteState] = useState<{
    userId: string;
    hints: Record<string, boolean>;
  } | null>(null);
  const sentRef = useRef(new Set<string>());
  const [hoverHint, setHoverHint] = useState(false);
  const [steps, setSteps] = useState<ReturnType<typeof visibleSteps>>([]);
  const [availableCount, setAvailableCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const driverRef = useRef<import('driver.js').Driver | null>(null);
  const startedRef = useRef(false);
  const route = isTourRoute(path) ? path : null;
  const blocked = route === '/run' && phase !== 'idle';
  const requested = Number(search.tour);
  const open = route !== null && !blocked && Number.isInteger(requested) && requested > 0;
  const index = open ? Math.min(requested, steps.length) - 1 : -1;
  const active = index >= 0 ? steps[index] : null;
  const source = route ? tourId(route) : '';
  const remoteHints = remoteState?.userId === userId ? remoteState.hints : EMPTY_HINTS;
  const remoteReady = !userId || remoteState?.userId === userId;

  useEffect(() => {
    let active = true;
    if (!userId) return;
    const client = supabase();
    if (!client) return;
    const refresh = () => {
      void client
        .from('profiles')
        .select('tour_hinted')
        .eq('user_id', userId)
        .single()
        .then(({ data }) => {
          if (!active) return;
          const saved: unknown = data?.tour_hinted;
          const remote =
            saved && typeof saved === 'object' && !Array.isArray(saved)
              ? (saved as Record<string, boolean>)
              : {};
          setRemoteState({ userId, hints: remote });
          const local = readStored<Record<string, true>>(HINT_KEY, {});
          for (const [key, shown] of Object.entries(local)) {
            const token = `${userId}:${key}`;
            if (
              !shown ||
              remote[key] ||
              sentRef.current.has(token) ||
              key.length > 80 ||
              !/^\/[a-z0-9/_-]*$/.test(key)
            )
              continue;
            sentRef.current.add(token);
            void client.rpc('mark_tour_hint', { p_key: key }).then(({ error }) => {
              if (error) sentRef.current.delete(token);
            });
          }
        });
    };
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('online', refresh);
    return () => {
      active = false;
      window.removeEventListener('focus', refresh);
      window.removeEventListener('online', refresh);
    };
  }, [userId]);

  useEffect(() => {
    if (!route || blocked) return;
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setAvailableCount(visibleSteps(route).length));
    };
    const observer = new MutationObserver(refresh);
    const content = document.querySelector('.app .content');
    if (content) observer.observe(content, { childList: true, subtree: true, attributes: true });
    refresh();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [blocked, route]);

  const go = useCallback(
    (step: number | null) => {
      if (route === null) return;
      void navigate({
        to: route,
        search: (previous: Record<string, unknown>) => {
          const { tour: _tour, ...rest } = previous;
          return step === null ? rest : { ...rest, tour: step };
        },
        replace: true,
      });
    },
    [navigate, route]
  );

  const close = useCallback(
    (completed: boolean) => {
      if (route && active)
        track(completed ? 'tour_completed' : 'tour_skipped', { route: source, step: index + 1 });
      go(null);
      driverRef.current?.destroy();
      driverRef.current = null;
      requestAnimationFrame(() => buttonRef.current?.focus());
    },
    [active, go, index, route, source]
  );

  useEffect(() => {
    if (!route || blocked || open || !remoteReady) return;
    let timer = 0;
    const saved = readStored<Record<string, true>>(HINT_KEY, {});
    const key = `/desktop${route === '/' ? '' : route}`;
    if (saved[key] || remoteHints[key]) return;
    const began = performance.now();
    const reveal = () => {
      const available = visibleSteps(route);
      if (!available.length && performance.now() - began < 2000) {
        timer = window.setTimeout(reveal, 80);
        return;
      }
      if (!available.length) return;
      writeStored(HINT_KEY, { ...saved, [key]: true as const });
      if (userId) {
        sentRef.current.add(`${userId}:${key}`);
        void supabase()
          ?.rpc('mark_tour_hint', { p_key: key })
          .then(({ error }) => {
            if (error) sentRef.current.delete(`${userId}:${key}`);
          });
      }
      setHint(true);
      track('tour_hint_shown', { route: source });
    };
    timer = window.setTimeout(reveal, 1200);
    return () => window.clearTimeout(timer);
  }, [blocked, open, remoteHints, remoteReady, route, source, userId]);

  useEffect(() => {
    if (blocked && requested > 0) go(null);
  }, [blocked, go, requested]);

  useEffect(() => {
    if (open && steps.length && !startedRef.current) {
      startedRef.current = true;
      track('tour_started', { route: source });
    }
    if (!open) startedRef.current = false;
  }, [open, source, steps.length]);

  useEffect(() => {
    if (!hint || hoverHint) return;
    const timeout = window.setTimeout(() => setHint(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [hint, hoverHint]);

  useEffect(() => {
    if (!open) return;
    const regions = document.querySelectorAll<HTMLElement>('.app > .shell, .app > .statusbar');
    const previous = Array.from(regions, (region) => region.inert);
    regions.forEach((region) => {
      region.inert = true;
    });
    return () =>
      regions.forEach((region, index) => {
        region.inert = previous[index] ?? false;
      });
  }, [open]);

  useEffect(() => {
    if (!open || !route) return;
    let timer = 0;
    const began = performance.now();
    const collect = () => {
      const available = visibleSteps(route);
      if (available.length === 0 && performance.now() - began < 2000) {
        timer = window.setTimeout(collect, 80);
        return;
      }
      setSteps(available);
      if (!available.length) go(null);
    };
    timer = window.setTimeout(collect, 0);
    return () => window.clearTimeout(timer);
  }, [go, open, route]);

  useEffect(() => {
    if (!active || !open) return;
    let cancelled = false;
    const reduce =
      document.documentElement.dataset.motion === 'reduced' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    active.target.scrollIntoView({ block: 'center', behavior: reduce ? 'instant' : 'smooth' });
    void import('driver.js').then(({ driver }) => {
      if (cancelled) return;
      driverRef.current?.destroy();
      const instance = driver({
        allowKeyboardControl: false,
        allowClose: false,
        overlayClickBehavior: 'none',
        disableActiveInteraction: true,
        stagePadding: 8,
        stageRadius: 8,
      });
      driverRef.current = instance;
      instance.highlight({ element: active.target });
      let last = '';
      const follow = () => {
        if (cancelled) return;
        const rect = active.target.getBoundingClientRect();
        const box = `${rect.x},${rect.y},${rect.width},${rect.height}`;
        if (box !== last) {
          last = box;
          instance.refresh();
        }
        requestAnimationFrame(follow);
      };
      requestAnimationFrame(follow);
      requestAnimationFrame(() => cardRef.current?.querySelector('button')?.focus());
    });
    track('tour_step_viewed', { route: source, step: index + 1 });
    return () => {
      cancelled = true;
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, [active, index, open, source]);

  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(false);
      }
      if (event.key === 'ArrowRight' && index < steps.length - 1) {
        event.preventDefault();
        go(index + 2);
      }
      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        go(index);
      }
      if (event.key !== 'Tab' || !cardRef.current) return;
      const focusables = Array.from(cardRef.current.querySelectorAll<HTMLElement>('button,select'));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === cardRef.current) &&
        last
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last && first) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', keydown, true);
    return () => window.removeEventListener('keydown', keydown, true);
  }, [close, go, index, open, steps.length]);

  if (!route || blocked) return null;
  return (
    <>
      {availableCount > 0 ? (
        <button
          ref={buttonRef}
          className="btn btn-ghost btn-sm ws-tour-trigger"
          type="button"
          onClick={() => {
            const available = visibleSteps(route);
            if (!available.length) return;
            setSteps(available);
            setHint(false);
            go(1);
          }}
          aria-label={t('tour.open')}
        >
          <Icon name="tour" size={15} />
          <span>{t('tour.open')}</span>
        </button>
      ) : null}
      {hint && !open ? (
        <div
          className="ws-tour-hint"
          role="status"
          onMouseEnter={() => setHoverHint(true)}
          onMouseLeave={() => setHoverHint(false)}
          onFocus={() => setHoverHint(true)}
          onBlur={() => setHoverHint(false)}
        >
          <span>{t('tour.hint', { count: visibleSteps(route).length })}</span>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setHint(false);
              setSteps(visibleSteps(route));
              go(1);
            }}
          >
            {t('tour.hintAction')}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-label={t('tour.close')}
            onClick={() => setHint(false)}
          >
            <Icon name="close" size={13} />
          </button>
        </div>
      ) : null}
      {open && active
        ? createPortal(
            <>
              <div
                className="ws-tour-shade"
                aria-hidden="true"
                onPointerDown={() => close(false)}
              />
              <div
                ref={cardRef}
                className="ws-tour-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ws-tour-title"
                tabIndex={-1}
              >
                <div className="ws-tour-card-head">
                  <span className="caps accent-ink" role="status">
                    {t('tour.progress', { current: index + 1, total: steps.length })}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    type="button"
                    onClick={() => close(false)}
                  >
                    {t('tour.close')}
                  </button>
                </div>
                <h2 id="ws-tour-title" className="t-md wide">
                  {t(PAGE_TITLE[route])}
                </h2>
                <p className="t-base">{t(stepKey(active.id))}</p>
                <label className="t-xs ink-3">
                  {t('tour.jump')}
                  <select
                    className="field"
                    value={index}
                    onChange={(event) => go(Number(event.target.value) + 1)}
                  >
                    {steps.map((step, position) => (
                      <option key={step.id} value={position}>
                        {t('tour.jumpItem', { step: position + 1 })}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="ws-tour-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    type="button"
                    onClick={() => close(false)}
                  >
                    {t('tour.skip')}
                  </button>
                  <button
                    className="btn btn-sm"
                    type="button"
                    disabled={index === 0}
                    onClick={() => go(index)}
                  >
                    {t('tour.back')}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    type="button"
                    onClick={() => (index === steps.length - 1 ? close(true) : go(index + 2))}
                  >
                    {t(index === steps.length - 1 ? 'tour.finish' : 'tour.next')}
                  </button>
                </div>
              </div>
            </>,
            document.body
          )
        : null}
    </>
  );
}
