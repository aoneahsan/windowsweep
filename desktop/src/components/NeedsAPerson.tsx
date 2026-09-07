/**
 * Home zone 6 - these need a person. `index.html:149-158`, `wire.js:279-315`.
 *
 * One card per interactive section, always all four of them, because "nothing
 * offered yet" is information too - the dummy renders the section even when its
 * count is zero (`db.js:121-123`). The sections come from the catalogue's own
 * `batch === 'interactive'`, never from a list kept here.
 *
 * The figures come from the candidates the last run collected. `--yes` never
 * answers these sections, which is what the band is telling a reader.
 */

import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import type { Section } from '../lib/catalogue';
import type { Candidate } from '../lib/cli';

function Card({ section, rows }: { section: Section; rows: Candidate[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bytes = rows.reduce((sum, c) => sum + c.bytes, 0);

  return (
    <div
      className="c3 well pad-s"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
        <span className="badge badge-warn">{section.id}</span>
        <span className="t-sm">{section.key}</span>
      </div>
      <p className="num t-md wide">
        {rows.length === 0 ? t('home.needsUnmeasured') : formatBytes(bytes)}
      </p>
      <p className="t-xs ink-3">{t('home.needsWaiting', { count: rows.length })}</p>
      <span className={`tier tier-${section.tier}`}>
        <span className="t-xs ink-3">{section.tier}</span>
      </span>
      {/* The picker is where the choosing happens; it reads the same candidates. */}
      <button
        className="btn btn-sm"
        type="button"
        onClick={() => { void navigate({ to: '/picker' }); }}
      >
        <span className="btn-label">{t('home.needsChoose')}</span>
      </button>
    </div>
  );
}

export function NeedsAPerson({
  sections,
  candidates,
}: {
  sections: Section[];
  candidates: Candidate[];
}) {
  const { t } = useTranslation();

  return (
    <section className="band band-well band-tight">
      <div className="wrap rise">
        <div className="zone-label">
          <span className="caps" style={{ color: 'var(--c-warn-ink)' }}>{t('home.needsTitle')}</span>
          <span className="t-xs ink-3" style={{ flex: 'none' }}>{t('home.needsHint')}</span>
        </div>
        <div className="g12">
          {sections.map((section) => (
            <Card
              section={section}
              rows={candidates.filter((c) => c.section === section.id)}
              key={section.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
