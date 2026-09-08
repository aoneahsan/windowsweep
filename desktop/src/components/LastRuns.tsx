/**
 * Home zones 10 + 11 - the last eight runs, and the schedule. `index.html:210-236`.
 *
 * 🔴 The sparkline is REAL `d3-scale` + `d3-shape`, as `wire.js:330-387` is, with
 * the same rule the treemap follows: **constant RANGE, the domain moves**, so the
 * box never resizes as runs arrive. A chart that grows with its data is layout
 * shift wearing a costume, and it is invisible in any single screenshot.
 *
 * The rows come from this machine's own run history. Nothing wrote that history
 * until now - `addHistory` existed and no caller ever reached it - so this band
 * and the History screen were both permanently empty. The store records a run
 * when it finishes; see `state/store.ts`.
 *
 * 🔴 The schedule is DRAWN now, and the `pending.schedule` declaration is gone.
 * What it said was two things, and both have been answered: `--install-task` is in
 * the argument allowlist (`src-tauri/src/args.rs`), and the window can read whether
 * the task exists (`schedule_status`). The second half is the one that mattered -
 * "a switch showing Off would be asserting something this window does not know" -
 * so the control now reads Windows rather than a stored preference, and it has a
 * third state for the case where it genuinely cannot tell. The switch itself is
 * `components/ScheduleSwitch.tsx`, shared with Settings so the two screens cannot
 * contradict each other about one Scheduled Task.
 */

import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { scaleLinear } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import { useTranslation } from 'react-i18next';

import { formatBytes, formatRelative } from '../lib/format';
import type { HistoryEntry } from '../state/store';
import { ScheduleSwitch } from './ScheduleSwitch';

/* `wire.js:334` - the drawn box, fixed. */
const W = 320;
const H = 54;
const P = 4;

function Sparkline({ runs }: { runs: HistoryEntry[] }) {
  const { t } = useTranslation();

  const paths = useMemo(() => {
    const peak = Math.max(...runs.map((r) => r.freedBytes), 1);
    const x = scaleLinear().domain([0, Math.max(1, runs.length - 1)]).range([P, W - P]);
    // 🔴 constant RANGE, the domain moves.
    const y = scaleLinear().domain([0, peak]).range([H - P, P]);
    const stroke = line<HistoryEntry>()
      .x((_d, i) => x(i))
      .y((d) => y(d.freedBytes))
      .curve(curveMonotoneX);
    const fill = area<HistoryEntry>()
      .x((_d, i) => x(i))
      .y0(H - P)
      .y1((d) => y(d.freedBytes))
      .curve(curveMonotoneX);
    return {
      line: stroke(runs) ?? '',
      area: fill(runs) ?? '',
      dots: runs.map((r, i) => ({ cx: x(i), cy: y(r.freedBytes), last: i === runs.length - 1 })),
    };
  }, [runs]);

  return (
    <svg
      viewBox={`0 0 ${String(W)} ${String(H)}`}
      preserveAspectRatio="none"
      role="img"
      style={{ width: '100%', height: `${String(H)}px` }}
      aria-label={t('home.sparkAria', {
        count: runs.length,
        amounts: runs.map((r) => formatBytes(r.freedBytes)).join(', '),
      })}
    >
      <path d={paths.area} fill="var(--c-accent)" opacity=".16" />
      <path
        d={paths.line}
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {paths.dots.map((dot, i) => (
        <circle
          cx={dot.cx}
          cy={dot.cy}
          r={dot.last ? 3.4 : 2}
          fill="var(--c-accent)"
          key={`${String(dot.cx)}-${String(i)}`}
        />
      ))}
    </svg>
  );
}

export function LastRuns({ history }: { history: HistoryEntry[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* Newest first in the store; the chart reads oldest first, eight at most. */
  const runs = [...history.slice(0, 8)].reverse();
  const last = history[0];

  return (
    <section className="band band-well band-tight">
      <div className="wrap g12 rise">
        <div className="c8">
          <div className="zone-label">
            <span className="caps">{t('home.lastRunsTitle')}</span>
          </div>
          <div
            className="panel pad"
            style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'center', flexWrap: 'wrap' }}
          >
            {last === undefined ? (
              <div>
                <p className="t-md wide">{t('home.lastRunsEmpty')}</p>
                <p className="t-sm ink-3">{t('home.lastRunsEmptyNote')}</p>
              </div>
            ) : (
              <>
                <div>
                  <p className="num t-xl wide accent-ink">{formatBytes(last.freedBytes)}</p>
                  <p className="t-sm ink-3">
                    {t('home.lastWhen', {
                      when: formatRelative(new Date(last.startedAt)),
                      sections: last.sections.length,
                      mode: last.mode,
                    })}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: '14rem' }}>
                  <Sparkline runs={runs} />
                </div>
                {/* `index.html:221`. The Reports screen reads the same last run. */}
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={() => { void navigate({ to: '/report' }); }}
                >
                  <span className="btn-label">{t('home.openReport')}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="c4">
          <div className="zone-label">
            <span className="caps">{t('home.scheduleTitle')}</span>
          </div>
          <div className="well pad">
            {/* `index.html:239-244` - the switch, then its state, then the note. */}
            <ScheduleSwitch />
            <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>{t('home.scheduleNote')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
