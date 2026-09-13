/**
 * Home zone 6 - these need a person. `index.html:164-172`, `wire.js:316-352`.
 *
 * One card per interactive section, always all four of them, because "nothing
 * offered yet" is information too - the dummy renders the section even when its
 * count is zero (`db.js:116-125`). The sections come from the catalogue's own
 * `batch === 'interactive'`, never from a list kept here.
 *
 * The figures come from the candidates the engine offered, which `finishRun`
 * records from every run. `--yes` never answers these sections, which is what the
 * band is telling a reader.
 *
 * 🔴 "CHOOSE ITEMS" REACHES WHAT IT CHOOSES FROM (D-23, GATE 4 round 7). The dummy's
 * button opens a Picker that is already full (`wire.js:344-348`), because its rows
 * are seeded. Here the engine is the only source, so a section nothing has asked
 * yet is asked first: a DRY-RUN of that one section, which runs its finder, lists
 * what it would offer and deletes nothing - every deletion helper short-circuits
 * under `--dry-run` (IRON rule 3). The button holds its pending state for the run,
 * as Scan does beside it, and the Picker opens on the answer - on THAT section, as
 * the dummy's `picker.html?section=N` does. A section the engine did not run -
 * skipped because developer mode is off, or failed - opens the Run screen instead,
 * where the engine's own log says why. The ask itself lives in
 * `state/use-ask-section.ts`, shared with the Picker's own "Dry-run".
 *
 * 🔴 "NEVER ASKED" AND "ASKED, NOTHING HERE" ARE DIFFERENT FACTS. The first reads
 * `nothing offered yet`; the second is a measured `0 B`, the dummy's own rendering
 * of an empty section. Printing `0 B` before anything had asked would claim the
 * engine looked - the same rule the drive rails keep between `not measured` and
 * `+0 B`.
 */

import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import { controlState, stateOf } from '../lib/control-state';
import { useStore } from '../state/store';
import { useAskSection } from '../state/use-ask-section';
import type { Section } from '../lib/catalogue';
import type { Candidate } from '../lib/cli';

function Card({
  section,
  rows,
  offered,
  asking,
  disabled,
  onChoose,
}: {
  section: Section;
  rows: Candidate[];
  /** The engine has been asked and its answer still stands - see `lib/offers.ts`. */
  offered: boolean;
  /** This card's own dry-run is in flight. */
  asking: boolean;
  disabled: boolean;
  onChoose: () => void;
}) {
  const { t } = useTranslation();
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
        {offered ? formatBytes(bytes) : t('home.needsUnmeasured')}
      </p>
      <p className="t-xs ink-3">{t('home.needsWaiting', { count: rows.length })}</p>
      <span className={`tier tier-${section.tier}`}>
        <span className="t-xs ink-3">{section.tier}</span>
      </span>
      <button
        className="btn btn-sm"
        type="button"
        onClick={onChoose}
        disabled={disabled}
        {...controlState(stateOf(asking))}
      >
        <span className="btn-label">{t('home.needsChoose')}</span>
      </button>
    </div>
  );
}

export function NeedsAPerson({
  sections,
  candidates,
  offeredSections,
}: {
  sections: Section[];
  candidates: Candidate[];
  offeredSections: number[];
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const phase = useStore((s) => s.phase);
  const { asking, ask } = useAskSection();

  const choose = useCallback(
    (id: number) => {
      if (offeredSections.includes(id)) {
        void navigate({ to: '/picker', search: { section: id } });
        return;
      }
      void ask(id).then((searched) => {
        if (searched === null) return;
        if (searched) void navigate({ to: '/picker', search: { section: id } });
        else void navigate({ to: '/run' });
      });
    },
    [offeredSections, navigate, ask],
  );

  return (
    <section className="band band-well band-tight">
      <div className="wrap rise">
        <div className="zone-label">
          <span className="caps" style={{ color: 'var(--c-warn-ink)' }}>{t('home.needsTitle')}</span>
          <span className="t-xs ink-3" style={{ flex: 'none' }}>{t('home.needsHint')}</span>
        </div>
        <div className="g12">
          {sections.map((section) => {
            const offered = offeredSections.includes(section.id);
            return (
              <Card
                section={section}
                rows={candidates.filter((c) => c.section === section.id)}
                offered={offered}
                asking={asking === section.id}
                /* An asked section only navigates, so a run elsewhere does not
                   block it; one still to be asked needs the engine to itself. */
                disabled={asking !== null || (!offered && phase === 'running')}
                onChoose={() => { choose(section.id); }}
                key={section.id}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
