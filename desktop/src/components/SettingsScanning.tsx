/** Folder scopes stay local and are passed to each engine run. */
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { FolderRoots } from './FolderRoots';

const GROUPS = [
  {
    kind: 'personalRoots',
    title: 'settings.scanPersonalTitle',
    description: 'settings.scanPersonalDesc',
    downloads: true,
  },
  {
    kind: 'browserProfileRoots',
    title: 'settings.scanBrowserTitle',
    description: 'settings.scanBrowserDesc',
    downloads: false,
  },
  {
    kind: 'tempRoots',
    title: 'settings.scanTempTitle',
    description: 'settings.scanTempDesc',
    downloads: false,
  },
] as const;

export function SettingsScanning() {
  const { t } = useTranslation();
  const personalRoots = useStore((s) => s.personalRoots);
  const browserProfileRoots = useStore((s) => s.browserProfileRoots);
  const tempRoots = useStore((s) => s.tempRoots);
  const setRootList = useStore((s) => s.setRootList);
  const roots = { personalRoots, browserProfileRoots, tempRoots };

  return (
    <div className="set-grp">
      {GROUPS.map((group) => (
        <div className="panel pad" key={group.kind}>
          <h2 className="t-md wide">{t(group.title)}</h2>
          <p className="t-sm ink-3">{t(group.description)}</p>
          <div style={{ marginTop: 'var(--sp-4)' }}>
            <FolderRoots
              roots={roots[group.kind]}
              onChange={(next) => {
                setRootList(group.kind, next);
              }}
              label={t(group.title)}
              showDownloads={group.downloads}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
