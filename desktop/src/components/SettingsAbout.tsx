/**
 * Settings -> About: what is installed, and the developer's other tools.
 *
 * Translated from `page-settings.js` -> `about()`. Both halves were missing
 * entirely and undeclared, which is what D-9 filed: the Version block and the
 * house-promotion panel.
 *
 * 🔴 A PROJECT NEVER ADVERTISES ITSELF, and it is TWO layers or it is not done -
 * the vendoring drop in `lib/ecosystem.ts` and the display resolver called here.
 * Each is proved by removing the other; `promoAudit()` is that proof and its
 * fourth case is the control that makes the other three mean anything.
 *
 * 🔴 There is no advertising network here and there never will be one: this
 * product's own privacy copy promises none, so adding one would make it a lie.
 * The sentence below says so, and it is the dummy's, verbatim.
 *
 * 🔴 The "up to date" badge is shown ONLY when the boot check actually said there
 * was no newer build. The dummy prints it statically because a prototype knows the
 * answer in advance; this window learns it at launch, and after "Later" or a
 * skipped check it does not know. The dummy carries no other word for that state,
 * so none is invented - the badge is absent rather than wrong, which is the same
 * choice `Splash.tsx` makes for a download that fails.
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { appVersion } from '../lib/engine';
import { buildVersion, REPO_URL, SUPPORT_URL } from '../lib/config';
import { promotedProducts } from '../lib/ecosystem';
import { openExternal } from '../lib/links';
import { APPS_URL, CURRENT_SURFACE, PLATFORMS } from '../config/platforms';
import { controlState, stateOf } from '../lib/control-state';

/** The two external links the About tab offers. */
/** `source`, `support`, or the id of a promoted product: whichever control is handing its address over. */
type Link = string;

export function SettingsAbout() {
  const { t } = useTranslation();
  const engineVersion = useStore((s) => s.engineVersion);
  const updateOutcome = useStore((s) => s.updateOutcome);

  /* 🔴 Read live from the Rust side, never printed from a constant: a hardcoded
     version is a number that goes stale the first time one of them moves. The
     build's own version stands in only for a development build outside a Tauri
     window, where there is no command to ask. */
  const [version, setVersion] = useState(buildVersion);
  useEffect(() => {
    let cancelled = false;
    void appVersion()
      .then((v) => {
        if (!cancelled) setVersion(v);
      })
      .catch(() => {
        /* no Tauri window - the fallback already reads correctly */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [opening, setOpening] = useState<Link | null>(null);
  const [opened, setOpened] = useState<Link | null>(null);

  const openLink = (which: Link, href: string) => {
    setOpening(which);
    void openExternal(href)
      .then(() => {
        setOpened(which);
      })
      .catch(() => {
        /* 🔴 Caught rather than dropped: `void promise.finally()` still leaves an
           unhandled rejection, and outside a Tauri window there is no opener at
           all. The control returns to idle and claims nothing, because the dummy
           carries no sentence for a browser that would not open - reported. */
      })
      .finally(() => {
        setOpening(null);
      });
  };

  /* The tick says "handed to your browser" and then gets out of the way. */
  useEffect(() => {
    if (opened === null) return;
    const to = window.setTimeout(() => {
      setOpened(null);
    }, 900);
    return () => {
      window.clearTimeout(to);
    };
  }, [opened]);

  return (
    <div className="set-grp">
      <div className="set-row">
        <div className="set-txt">
          <h3>{t('settings.versionTitle')}</h3>
          <p>{t('settings.versionWhat')}</p>
        </div>
        <div className="set-ctl">
          {updateOutcome === 'none' ? (
            <span className="badge badge-neutral">{t('settings.versionUpToDate')}</span>
          ) : null}
        </div>
      </div>

      <div>
        <p className="t-sm">
          {t('settings.versionLine', { app: version, engine: engineVersion || buildVersion })}
        </p>
        <p className="t-sm ink-3">{t('settings.versionNote')}</p>
      </div>

      <div className="panel pad">
        <p className="t-sm">{t('settings.about')}</p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--sp-2)',
            flexWrap: 'wrap',
            marginTop: 'var(--sp-3)',
          }}
        >
          {/* 🔴 Handing a URL to the system browser takes a moment and the app
              window does not change, so without a state on the control the press
              is invisible. */}
          <button
            className="btn btn-sm"
            type="button"
            onClick={() => {
              openLink('source', REPO_URL);
            }}
            disabled={opening !== null}
            {...controlState(stateOf(opening === 'source', opened === 'source'))}
          >
            <span className="btn-label">{t('settings.source')}</span>
          </button>
          <button
            className="btn btn-sm"
            type="button"
            onClick={() => {
              openLink('support', SUPPORT_URL);
            }}
            disabled={opening !== null}
            {...controlState(stateOf(opening === 'support', opened === 'support'))}
          >
            <span className="btn-label">{t('settings.support')}</span>
          </button>
        </div>
      </div>

      {/* "Get windowsweep": every released place (src/config/platforms.ts); this app's own row names itself. */}
      <div style={{ marginTop: 'var(--sp-4)' }}>
        <h3 className="t-md wide">{t('settings.getTitle')}</h3>
        <p className="t-sm ink-3">{t('settings.getNote')}</p>
      </div>
      <div className="promo">
        {PLATFORMS.map((platform) =>
          platform.id === CURRENT_SURFACE ? (
            <div className="card" key={platform.id}>
              <span className="card-bd">
                <span className="wide">{t(`settings.getName.${platform.id}`)}</span>
                <span className="t-sm ink-3">{t('settings.getHere')}</span>
              </span>
            </div>
          ) : (
            <button
              className="card"
              type="button"
              key={platform.id}
              onClick={() => {
                openLink(`get-${platform.id}`, platform.href);
              }}
              disabled={opening !== null}
              {...controlState(
                stateOf(opening === `get-${platform.id}`, opened === `get-${platform.id}`)
              )}
            >
              <span className="card-bd">
                <span className="wide">{t(`settings.getName.${platform.id}`)}</span>
                <span className="t-sm ink-3">{t(`settings.getLine.${platform.id}`)}</span>
              </span>
            </button>
          )
        )}
      </div>
      <button
        className="btn btn-sm"
        type="button"
        style={{ marginTop: 'var(--sp-2)' }}
        onClick={() => {
          openLink('get-all', APPS_URL);
        }}
        disabled={opening !== null}
        {...controlState(stateOf(opening === 'get-all', opened === 'get-all'))}
      >
        <span className="btn-label">{t('settings.getAll')}</span>
      </button>

      <div style={{ marginTop: 'var(--sp-4)' }}>
        <h3 className="t-md wide">{t('settings.promoTitle')}</h3>
        <p className="t-sm ink-3">{t('settings.promoNote')}</p>
      </div>
      {/* LAYER 2 - the display resolver drops this project's id again, so a roster
          re-vendored without layer 1 still cannot promote this app to its own
          users. Each card hands its product's page to the system browser exactly as
          Source and Support do (the dummy's `button.card`, D102); nothing counts the
          press. */}
      <div className="promo">
        {promotedProducts().map((product) => (
          <button
            className="card"
            type="button"
            tabIndex={0}
            key={product.id}
            onClick={() => {
              openLink(product.id, product.url);
            }}
            disabled={opening !== null}
            {...controlState(stateOf(opening === product.id, opened === product.id))}
          >
            <span className="card-bd">
              <span className="wide">{product.name}</span>
              <span className="t-sm ink-3">{product.tagline}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
