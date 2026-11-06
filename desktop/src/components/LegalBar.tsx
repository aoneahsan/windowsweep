/**
 * The legal bar itself (N-001), translated from the approved dummy's `legal-bar.js` and the
 * `.ws-legal` block of its `shared.css`, in N-001's words. `LegalNotice` decides when it shows and
 * loads this module only then, as the dummy loads `legal-bar.js`.
 *
 * 🔴 ONE QUIET BAR, NEVER A DIALOG (`legal-notice.md`). `role="status"`, no scrim, no heading and no
 * focus taken: the window stays usable under it, and a keyboard user meets it last in the tab
 * order, as the dummy appends it to the body.
 *
 * 🔴 TEN SECONDS. Hover or focus holds the count and leaving restarts it in full (WCAG 2.2.1); Okay
 * and Escape close it at once. Escape is the bar's only when no drawn modal or open drawer owns it.
 * Focus that was inside the bar is handed back to the rail.
 *
 * 🔴 The policy links open the website in the system browser through `openExternal`, the app's one
 * external-link path: a navigation inside this webview would replace the application.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { openExternal } from '../lib/links';
import { errorText, logger } from '../lib/logger';

/** How long the bar stays while nothing holds it - the law's ten seconds. */
const NOTICE_MS = 10_000;
const PRIVACY_URL = 'https://windowsweep.aoneahsan.com/privacy';
const TERMS_URL = 'https://windowsweep.aoneahsan.com/terms';

/**
 * One of the sentence's two links. `Trans` hands it the policy's name as its children; the
 * accessible name adds where it opens, in the words the Plans pay line already ships.
 */
function PolicyLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children?: ReactNode;
}) {
  return (
    <a
      className="lnk"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        void openExternal(href).catch((error: unknown) => {
          logger.warn('legal bar: a policy link did not open', { error: errorText(error) });
        });
      }}
    >
      {children}
    </a>
  );
}

/** On screen: a rail folded away under 900 px is still laid out, translated off the window's edge. */
function onScreen(element: HTMLElement | null): element is HTMLElement {
  if (!element) return false;
  const box = element.getBoundingClientRect();
  return box.width > 0 && box.height > 0 && box.right > 0 && box.left < window.innerWidth;
}

/**
 * Hand a keyboard user back to where they are (`legal-bar.js`): the rail's current item, or Menu
 * when the rail is folded away, or the rail's first item on a page the rail does not mark.
 */
function handBackFocus(): void {
  const target = [
    document.querySelector<HTMLElement>('.rail-item[aria-current="page"]'),
    document.querySelector<HTMLElement>('.drawer-btn'),
    document.querySelector<HTMLElement>('.rail .rail-item'),
  ].find(onScreen);
  target?.focus();
}

/** Escape belongs to an open overlay first: a drawn modal, or the drawer (`legal-bar.js`). */
function overlayOwnsEscape(): boolean {
  if (document.documentElement.getAttribute('data-drawer') === 'open') return true;
  return Array.from(document.querySelectorAll('[aria-modal="true"]')).some(
    (overlay) => overlay.getClientRects().length > 0
  );
}

export function LegalBar({
  away,
  onShown,
  onClose,
}: {
  /** The page no longer carries the bar - a task page, or a release surface took the corner. */
  away: boolean;
  /** Called once it is drawn: it is marked seen then, never on dismiss. */
  onShown: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const barRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const held = hovered || focused;

  useEffect(() => {
    onShown();
  }, [onShown]);

  const close = useCallback(() => {
    if (barRef.current?.contains(document.activeElement)) handBackFocus();
    onClose();
  }, [onClose]);

  /* Re-armed in full whenever the hold ends - the restart the amendment asks for, not a pause. */
  useEffect(() => {
    if (held) return;
    const timer = window.setTimeout(close, NOTICE_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [held, close]);

  /* Before the frame paints, so the bar is never seen on a task page or beside a release. */
  useLayoutEffect(() => {
    if (away) close();
  }, [away, close]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || overlayOwnsEscape()) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [close]);

  return (
    <div
      ref={barRef}
      className="ws-legal"
      data-ws-legal=""
      role="status"
      aria-live="polite"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="ws-legal-copy">
        <p className="ws-legal-sentence">
          <Trans
            i18nKey="legal.sentence"
            components={{
              1: <PolicyLink href={PRIVACY_URL} label={t('plans.choose.privacyNewTab')} />,
              3: <PolicyLink href={TERMS_URL} label={t('plans.choose.termsNewTab')} />,
            }}
          />
        </p>
        <p className="t-sm ink-3">{t('legal.analytics')}</p>
      </div>
      <button className="btn" type="button" onClick={close}>
        {t('legal.okay')}
      </button>
    </div>
  );
}
