/** Section 19 controls over the engine's file candidates. */
import { useTranslation } from 'react-i18next';

import { FolderRoots } from './FolderRoots';
import { formatBytes } from '../lib/format';
import type { Candidate, PersonalRootVerdict } from '../lib/cli';

export type DataReason = 'all' | 'large' | 'old';
export type DataSort = 'size' | 'age';

export function PickerDataScanner({
  roots,
  onRoots,
  reason,
  onReason,
  sort,
  onSort,
  rows,
  verdicts,
  asked,
  asking,
  askDisabled,
  onAsk,
  largeFileMb,
  idleDays,
}: {
  roots: readonly string[];
  onRoots: (next: string[]) => void;
  reason: DataReason;
  onReason: (next: DataReason) => void;
  sort: DataSort;
  onSort: (next: DataSort) => void;
  rows: readonly Candidate[];
  verdicts: readonly PersonalRootVerdict[];
  asked: boolean;
  asking: boolean;
  askDisabled: boolean;
  onAsk: () => void;
  largeFileMb: number;
  idleDays: number;
}) {
  const { t } = useTranslation();
  const reviewable = rows.filter((row) => row.selectable !== false);
  const measured = reviewable.reduce((total, row) => total + row.bytes, 0);

  return (
    <div className="panel pad" style={{ marginBottom: 'var(--sp-4)' }}>
      <div className="filters" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <p className="caps ink-3">{t('picker.dataEyebrow')}</p>
          <h2 className="t-lg wide">{t('picker.dataTitle')}</h2>
          <p className="t-sm ink-3">{t('picker.dataIntro')}</p>
          <p className="t-sm ink-3">
            {t('picker.dataThresholds', { large: largeFileMb, days: idleDays })}
          </p>
        </div>
        <button className="btn btn-primary" type="button" disabled={askDisabled} onClick={onAsk}>
          {asking ? t('picker.dataScanning') : t('picker.dataScan')}
        </button>
      </div>
      <div style={{ marginTop: 'var(--sp-5)' }}>
        <p className="caps ink-3">{t('picker.dataFolders')}</p>
        <FolderRoots
          roots={roots}
          onChange={onRoots}
          label={t('picker.dataFolders')}
          showDownloads
        />
        {verdicts
          .filter((verdict) => !verdict.accepted)
          .map((verdict) => (
            <p className="t-xs" role="status" key={verdict.path}>
              {t('picker.rootRefused', { path: verdict.path, reason: verdict.reason })}
            </p>
          ))}
      </div>
      <div className="filters" style={{ marginTop: 'var(--sp-4)', flexWrap: 'wrap' }}>
        <span className="caps ink-3">{t('picker.dataShow')}</span>
        {(['all', 'large', 'old'] as const).map((value) => (
          <button
            className="fchip"
            type="button"
            key={value}
            aria-pressed={reason === value}
            onClick={() => {
              onReason(value);
            }}
          >
            {t(`picker.reasonFilter.${value}`)}
          </button>
        ))}
        <label className="t-sm" style={{ marginInlineStart: 'auto' }}>
          {t('picker.dataSort')}
          <select
            className="field"
            value={sort}
            aria-label={t('picker.dataSort')}
            onChange={(event) => {
              onSort(event.currentTarget.value === 'age' ? 'age' : 'size');
            }}
          >
            <option value="size">{t('picker.sortSize')}</option>
            <option value="age">{t('picker.sortAge')}</option>
          </select>
        </label>
      </div>
      <p className="num t-sm accent-ink" role="status" style={{ marginTop: 'var(--sp-3)' }}>
        {asked
          ? t('picker.dataSummary', {
              count: reviewable.length,
              amount: formatBytes(measured),
              refused: rows.length - reviewable.length,
            })
          : t('picker.dataUnmeasured')}
      </p>
      <div className="note note-info" style={{ marginTop: 'var(--sp-4)' }}>
        <span aria-hidden="true">i</span>
        <span>{t('picker.dataOldCaution')}</span>
      </div>
    </div>
  );
}
