/**
 * Admin's band for the install sections that run elevated - `elevation.html` band 5,
 * `page-elevation.js` `PICKED` / `pickedCard` (1.5.0, AMENDMENTS-4 A4-13, D110).
 *
 * Sections 30 and 31 list what is available without asking; installing the rows a person picks
 * runs in the engine's elevated window, the way the steps above it describe. 🔴 The cards carry NO
 * switch: their rows are picked on the Choose screen (27's rule, AMENDMENTS-3, 2026-11-03), so each
 * card is a way there, drawn as Home's "Choose items". Section 32 needs no elevated window, and the
 * line under the cards says so. The keys, titles and admin badge are the catalogue's own.
 */

import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { sectionById, type Catalogue } from '../lib/catalogue';
import { ELEVATED_INSTALL_SECTIONS } from '../lib/candidate-extras';

export function ElevationPicked({ catalogue }: { catalogue: Catalogue | null }) {
  const { t } = useTranslation();
  /* The two lines per card, as literal keys so the catalogue gate proves each one. */
  const words: Record<number, { line: string; go: string }> = {
    30: { line: t('elevation.picked.30'), go: t('elevation.picked.30.go') },
    31: { line: t('elevation.picked.31'), go: t('elevation.picked.31.go') },
  };
  const cards = [...ELEVATED_INSTALL_SECTIONS]
    .map((id) => (catalogue ? sectionById(catalogue, id) : undefined))
    .filter((s) => s !== undefined)
    .filter((s) => words[s.id] !== undefined);
  if (cards.length === 0) return null;

  return (
    <section className="band band-app band-tight">
      <div className="wrap">
        <h2 className="t-md wide">{t('elevation.picked.title')}</h2>
        <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-2)', maxWidth: '44rem' }}>
          {t('elevation.picked.lede')}
        </p>
        <div className="cards" style={{ marginTop: 'var(--sp-4)' }}>
          {cards.map((s) => (
            <div className="card" key={s.id}>
              <div className="card-bd">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    flexWrap: 'wrap',
                  }}
                >
                  <span className="num t-sm ink-3">{s.id}</span>
                  <span className="t-base" style={{ fontWeight: 600 }}>
                    {s.key}
                  </span>
                  <span className="badge badge-danger">{t('sections.admin')}</span>
                </div>
                <p className="t-sm ink-3">{s.title}</p>
                <p className="t-sm" style={{ marginTop: 'var(--sp-3)' }}>
                  {words[s.id]?.line}
                </p>
                <Link
                  to="/picker"
                  search={{ section: s.id }}
                  className="btn btn-sm"
                  style={{ marginTop: 'var(--sp-3)' }}
                >
                  {words[s.id]?.go}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)', maxWidth: '44rem' }}>
          {t('elevation.picked.note32')}
        </p>
      </div>
    </section>
  );
}
