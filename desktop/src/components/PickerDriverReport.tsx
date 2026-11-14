/**
 * Section 31's two report blocks - `picker.html` `[data-ws-driver-report]` (1.5.0, A4-10, D111).
 *
 * Listed for reading: no row here is ever offered, and the closing line says Device Manager shows
 * the same devices and drivers. The list items are the engine's own words and dates.
 *
 * 🔴 Drawn only from a report the engine published (`DriverReport` in `lib/cli.ts`). The 1.5.0
 * engine prints these lists to its log and not yet to `--json`, so against it the blocks stay away
 * rather than drawing two empty panels that would read as "no problems, no old drivers".
 */

import { useTranslation } from 'react-i18next';

import { formatDay } from '../lib/format';
import type { DriverReport } from '../lib/cli';

const LIST: React.CSSProperties = {
  margin: 'var(--sp-3) 0 0',
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--sp-3)',
};
const PANEL: React.CSSProperties = { flex: '1 1 18rem' };

function Block({ title, items }: { title: string; items: { name: string; detail: string }[] }) {
  const { t } = useTranslation();
  return (
    <div className="panel pad" style={PANEL}>
      <p className="caps ink-3">{t('picker.report.eyebrow')}</p>
      <h2 className="t-md wide">{title}</h2>
      <ul style={LIST}>
        {items.map((item, i) => (
          <li key={`${item.name}-${String(i)}`}>
            <div className="t-sm">{item.name}</div>
            <div className="t-xs ink-3">{item.detail}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PickerDriverReport({ report }: { report: DriverReport }) {
  const { t } = useTranslation();
  return (
    <div style={{ marginTop: 'var(--sp-4)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <Block
          title={t('picker.report.problems')}
          items={report.problems.map((d) => ({
            name: d.name,
            detail: t('picker.report.problemDetail', { code: d.code, problem: d.problem }),
          }))}
        />
        <Block
          title={t('picker.report.oldest')}
          items={report.oldest.map((d) => ({
            name: d.device,
            detail: t('picker.report.oldestDetail', {
              version: d.version,
              date: formatDay(d.date),
            }),
          }))}
        />
      </div>
      <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>
        {t('picker.report.note')}
      </p>
    </div>
  );
}
