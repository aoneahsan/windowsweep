/** The approved full-window refusal for a configured white-label client build. */

import { useState } from 'react';
import { Button } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';

import { whiteLabelKey } from '../lib/config';
import { openExternal } from '../lib/links';
import { logger } from '../lib/logger';
import { ThemePanel } from './ThemePanel';
import { Titlebar } from './Shell';

const verificationPage = new URL('https://windowsweep.aoneahsan.com/verify-license');
verificationPage.searchParams.set('key', whiteLabelKey);

/** Keep the window controls and appearance panel, without mounting the app router. */
export function LicenceInactive() {
  const { t } = useTranslation();
  const [themeOpen, setThemeOpen] = useState(false);

  const openVerification = (): void => {
    void openExternal(verificationPage.href).catch(() => {
      logger.warn('licence verification page failed to open');
    });
  };

  return (
    <div className="app">
      <Titlebar onOpenTheme={() => setThemeOpen(true)} />
      <div className="shell shell-bare">
        <main className="content">
          <section className="band band-app licence-stage" aria-labelledby="licence-heading">
            <div className="wrap wrap-narrow licence-panel">
              <h1 id="licence-heading" className="t-xl wide">
                {t('whiteLabel.inactiveHeading')}
              </h1>
              <p className="lede">
                <Trans
                  i18nKey="whiteLabel.inactiveBody"
                  values={{ key: whiteLabelKey }}
                  components={{ 1: <code className="mono" /> }}
                />
              </p>
              <Button className="btn btn-primary" onPress={openVerification}>
                {t('whiteLabel.verify')}
              </Button>
            </div>
          </section>
        </main>
      </div>
      <ThemePanel open={themeOpen} onClose={() => setThemeOpen(false)} />
    </div>
  );
}
