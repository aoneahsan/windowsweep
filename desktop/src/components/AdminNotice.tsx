/**
 * Home zone 12 - the sections Windows has to ask about. `index.html:238-263`.
 *
 * 🔴 The count is COUNTED. The dummy's sentence reads "Six sections need Windows
 * to ask your permission first."; six is a quantity the product can count from the
 * catalogue it read at startup, so it comes from the product inside the dummy's
 * own sentence - §10's one carve-out. If the engine ever grows a seventh, this
 * line follows it with no app change.
 *
 * 🔴 The badges carry the DUMMY'S six labels, verbatim, and not the engine's
 * section key. An earlier pass showed `wu`, `cleanmgr`, `dism`, `hiberfil`,
 * `eventlogs`, `vhdx` and declared the substitution, on the reasoning that a
 * second set of names would drift out of step with `--list --json`. That reasoning
 * does not hold here and the rule is the other way round: the dummy owns the
 * words, its copy ships verbatim, and section numbers are FROZEN by IRON rule 4 -
 * so a map keyed by section id cannot silently drift the way a parallel name list
 * would. The catalogue's own `title` is not an alternative: those run to
 * "Windows Update + system temp (SoftwareDistribution, Delivery Optimization,
 * Windows\Temp, CBS logs)", which is right for a table row and impossible in a
 * chip.
 *
 * A future admin section with no label falls back to its catalogue title, so it
 * appears in plain sight rather than vanishing - the failure mode to avoid is a
 * silent omission, not an ugly one.
 */

import { useTranslation } from 'react-i18next';

import type { Section } from '../lib/catalogue';

export function AdminNotice({ sections }: { sections: Section[] }) {
  const { t } = useTranslation();
  if (sections.length === 0) return null;

  return (
    <details className="disclose">
      <summary>
        <span className="disclose-line">{t('home.adminSummary', { count: sections.length })}</span>
        <span className="disclose-more">{t('consent.detailsMore')}</span>
      </summary>
      <div className="disclose-body">
        <p>{t('home.adminBody')}</p>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          {sections.map((section) => (
            <span className="badge badge-outline" key={section.id}>
              {t(`sections.label.${String(section.id)}`, section.title)}
            </span>
          ))}
        </div>
        <p>{t('home.adminSigning')}</p>
      </div>
    </details>
  );
}
