/** Explicit folder scopes shared by the scanner and Settings. */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usableRoots } from '../lib/roots';

export function FolderRoots({
  roots,
  onChange,
  label,
  showDownloads = false,
}: {
  roots: readonly string[];
  onChange: (next: string[]) => void;
  label: string;
  showDownloads?: boolean;
}) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const add = async () => {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const selected = await open({ directory: true, multiple: false });
      if (typeof selected !== 'string') return;
      const next = usableRoots([...roots, selected]);
      if (!next.some((path) => path.toLowerCase() === selected.toLowerCase())) {
        setError(t('settings.rootInvalid'));
        return;
      }
      setError(null);
      onChange(next);
    } catch {
      setError(t('settings.rootChooserFailed'));
    }
  };

  return (
    <div>
      <div className="filters" style={{ flexWrap: 'wrap' }} aria-label={label}>
        {showDownloads ? (
          <span className="badge badge-outline">{t('picker.downloadsDefault')}</span>
        ) : null}
        {roots.map((root) => (
          <button
            className="btn btn-sm"
            type="button"
            key={root}
            aria-label={t('settings.stopScanning', { path: root })}
            onClick={() => {
              onChange(roots.filter((path) => path !== root));
            }}
          >
            <span className="mono">{root}</span> ×
          </button>
        ))}
        <button
          className="btn btn-sm"
          type="button"
          onClick={() => {
            void add();
          }}
        >
          {t('settings.addFolder')}
        </button>
      </div>
      {error ? (
        <p className="t-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
