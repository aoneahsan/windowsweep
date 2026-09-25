/**
 * Picker - the interactive sections, where a person chooses row by row.
 *
 * Translated from `picker.html` + `page-picker.js`, one section at a time as the
 * dummy draws it: the section's own header, the section chips and the path filter,
 * the table, the note, the file disclosure and the selection bar. Sections 17, 18,
 * 19 and 23 never auto-confirm: `--yes` does not answer them, by design in the
 * engine. This screen is how a person answers them in advance, and the answer
 * travels to the engine as a `--select-file` of full paths.
 *
 * 🔴 EVERY PIECE OF THE VIEW LIVES IN THE URL - `section`, the filter `q` and the
 * deletion `mode` - so Back, a refresh and Home's "Choose items"
 * (`/picker?section=N`, the dummy's `picker.html?section=N`) all land on the same
 * screen. `mode` especially: it decides whether what a person picked goes to the
 * Recycle Bin or goes for good, and a refresh must not silently reset it. Defaults
 * are omitted from the query rather than written into it.
 *
 * 🔴 "REMOVE THESE" IS WIRED. The chosen paths are written into the run's own folder
 * by `write_select_file` (`src-tauri/src/runs.rs`, which owns the encoding: no BOM,
 * CRLF, and a refusal for any path carrying a line break, a NUL or a leading `#`),
 * and the run is `--only <the sections those rows belong to> --select-file <that
 * file>`. NO `--yes` ON THIS PATH, and that is the point of the screen: matching the
 * select file is what marks the choice as scripted, and the confirmation that
 * follows is the one prompt `-ScriptedOk` answers.
 *
 * 🔴 A SECTION NOTHING HAS ASKED ABOUT IS A STATE OF ITS OWN (`picker.html?empty=1`).
 * The engine is the only source of these rows and offers a section's list only when
 * a run has asked, so the section in view says "Nothing has been offered yet." and
 * carries the ask - a dry-run of that one section - rather than claiming it found
 * nothing (`components/PickerTable.tsx` lists the four empty bodies).
 *
 * 🔴 WHAT THE ENGINE WOULD SKIP IS NEITHER SHOWN NOR SENT. With developer mode off the
 * engine skips section 17 outright, so rows it offered earlier stay out of the view,
 * the counts and "Remove these" until developer mode is back on - ticking a row the
 * run will not act on is a promise the window cannot keep.
 */

import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { useRunPreferences } from '../state/derived';
import { useAskSection } from '../state/use-ask-section';
import { formatBytes } from '../lib/format';
import { DEV_GATED_SECTIONS } from '../lib/catalogue';
import { newRunId, run, selectionArgs, writeSelectFile } from '../lib/engine';
import { PickerTable, type PickerBody } from '../components/PickerTable';
import { PickerSelbar, type DeleteMode } from '../components/PickerSelbar';
import { PickerConfirm } from '../components/PickerConfirm';

/* 🔴 Loaded when the Picker is, never on first paint. The field is the only user of
   React Aria's drag-and-drop and tooltip layers, and bundling them into the entry
   chunk pushed it past the project's own 900 kB warning line (958.9 kB, from
   806.5 kB) - a build that warns is a build this project does not ship. */
const SelectionFileField = lazy(() =>
  import('../components/SelectionFileField').then((m) => ({ default: m.SelectionFileField }))
);

/** The markup `picker.note` carries: the lead sentence bold, the three flags as code. */
const NOTE_MARKUP = {
  1: <strong />,
  3: <code className="mono" />,
  5: <code className="mono" />,
  7: <code className="mono" />,
};
const COUNT_MARKUP = { 1: <span className="num" />, 3: <span className="num" /> };

/**
 * The one interactive section whose rows go outright whichever mode is chosen:
 * section 17 is tier `rebuilds`, and `modules/projects.ps1:157` removes its
 * artefacts through `Remove-PathSafe`, never `Send-ToRecycleBin`. Keyed by id,
 * which IRON rule 4 freezes. The bar says so while one of its rows is chosen (D-49).
 */
const OUTRIGHT_SECTION = 17;

interface PickerQuery {
  section: number;
  q: string;
  mode: DeleteMode;
}

/** The query a Picker URL carries, with the defaults left out. */
function toSearch(next: PickerQuery): { section: number; q?: string; mode?: DeleteMode } {
  return {
    section: next.section,
    ...(next.q === '' ? {} : { q: next.q }),
    ...(next.mode === 'permanent' ? { mode: next.mode } : {}),
  };
}

export function Picker() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const catalogue = useStore((s) => s.catalogue);
  const candidates = useStore((s) => s.candidates);
  const offeredSections = useStore((s) => s.offeredSections);
  const selectedPaths = useStore((s) => s.selectedPaths);
  const toggleCandidate = useStore((s) => s.toggleCandidate);
  const setSelection = useStore((s) => s.setSelection);
  const phase = useStore((s) => s.phase);
  /* 🔴 The same four preferences every other run path carries. The engine
     re-derives each section's candidate list on this run and matches the select
     file against it, so a threshold that differs from the one the rows were
     offered under changes what is on offer - and a picked row that matches
     nothing is silently not deleted. */
  const prefs = useRunPreferences();
  const excludedPaths = useStore((s) => s.excludedPaths);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const { asking, ask } = useAskSection();

  const search: { section?: unknown; q?: unknown; mode?: unknown } = useSearch({ strict: false });
  /* The chips are the catalogue's own interactive sections, never a list kept here. */
  const sections = useMemo(
    () => (catalogue?.sections ?? []).filter((s) => s.batch === 'interactive'),
    [catalogue]
  );
  const current = sections.find((s) => s.id === Number(search.section)) ?? sections[0] ?? null;
  const q = typeof search.q === 'string' ? search.q : '';
  const mode: DeleteMode = search.mode === 'permanent' ? 'permanent' : 'recycle';

  const [busy, setBusy] = useState(false);
  /** The Permanent confirmation is open (D-48). Only its "Remove permanently" runs. */
  const [confirming, setConfirming] = useState(false);
  /** The engine's own refusal, rendered as data beside the button that was pressed. */
  const [failed, setFailed] = useState<string | null>(null);

  const available = useMemo(
    () => candidates.filter((c) => prefs.developer || !DEV_GATED_SECTIONS.has(c.section)),
    [candidates, prefs.developer]
  );
  const chosen = useMemo(
    () => available.filter((c) => selectedPaths.has(c.path)),
    [available, selectedPaths]
  );
  const sectionRows = useMemo(
    () => (current === null ? [] : available.filter((c) => c.section === current.id)),
    [available, current]
  );
  const needle = q.trim().toLowerCase();
  const visibleRows =
    needle === ''
      ? sectionRows
      : sectionRows.filter((c) => `${c.path} ${c.project ?? ''}`.toLowerCase().includes(needle));

  const go = useCallback(
    (next: Partial<PickerQuery>, replace: boolean) => {
      if (current === null) return;
      void navigate({
        to: '/picker',
        search: toSearch({ section: current.id, q, mode, ...next }),
        replace,
      });
    },
    [current, q, mode, navigate]
  );

  /** A file's matches are ADDED to the selection - it never unticks a person's choice. */
  const onMatch = useCallback(
    (paths: string[]) => {
      setSelection([...new Set([...selectedPaths, ...paths])]);
    },
    [selectedPaths, setSelection]
  );

  /**
   * Write the selection file, then run only the sections those rows came from.
   *
   * 🔴 The sections are DERIVED from the chosen rows, never from the whole
   * interactive set: running a section nobody picked a row in would put that
   * section's own prompt in front of an unattended engine, which `--select-file`
   * answers with nothing and `--yes` is not allowed to answer at all.
   */
  const onRemove = useCallback(() => {
    const paths = chosen.map((c) => c.path);
    if (paths.length === 0) return;
    const runSections = [...new Set(chosen.map((c) => c.section))].sort((a, b) => a - b);
    const permanent = mode === 'permanent';

    setBusy(true);
    setFailed(null);
    const id = newRunId();
    /* Whether the run itself began - the one fact that decides which failure below
       this is. */
    let started = false;
    writeSelectFile(id, paths)
      .then((selectFilePath) => {
        started = true;
        startRun(id);
        void navigate({ to: '/run' });
        return run(
          selectionArgs({
            selectFilePath,
            sections: runSections,
            ...prefs,
            permanent,
            excludedPaths,
          }),
          id,
          {
            onLog: appendLog,
            onProgress: (section, event, status, freedBytes) => {
              applyProgress({
                section,
                event,
                ...(status ? { status } : {}),
                ...(freedBytes !== undefined ? { freedBytes } : {}),
              });
            },
          }
        );
      })
      .then((r) => {
        finishRun(r.summary, r.exitCode > 1 && !r.cancelled);
      })
      .catch((e: unknown) => {
        /* 🔴 Two different failures land here and they are shown differently. The
           selection file is written BEFORE the run starts, so a refusal from
           `write_select_file` - a path with a line break in it, say - means nothing
           ran at all, and there is no Run screen to carry the message. It is shown
           beside the button instead. Once the run has started, the reason belongs
           in the log with the engine's own lines.

           🔴 AND A REFUSAL BEFORE ANYTHING STARTED IS NOT A RUN (D-59, GATE 4
           round 9). It used to call `finishRun(null, true)` here too, so Run read
           STOPPED over the previous rehearsal's rows and Home's scan button
           reverted - a run recorded that never began. Now it touches no run state
           at all: the reason is at the control, and nothing else moved. */
        const reason = e instanceof Error ? e.message : String(e);
        if (!started) {
          setFailed(reason);
          return;
        }
        appendLog(reason);
        finishRun(null, true);
      })
      .finally(() => {
        setBusy(false);
      });
  }, [chosen, mode, prefs, excludedPaths, navigate, startRun, appendLog, applyProgress, finishRun]);

  /* The catalogue arrives at boot; until it does there is no section to draw, and a
     failure to load it is already on screen from the shell. */
  if (current === null) return <div style={{ height: 'var(--sp-16)' }} />;

  const skipped = DEV_GATED_SECTIONS.has(current.id) && !prefs.developer;
  const asked = offeredSections.includes(current.id) || sectionRows.length > 0;
  const body: PickerBody = skipped
    ? 'skipped'
    : !asked
      ? 'not-asked'
      : visibleRows.length > 0
        ? 'rows'
        : needle === ''
          ? 'nothing'
          : 'no-match';
  const here = chosen.filter((c) => c.section === current.id);
  const chosenSections = [...new Set(chosen.map((c) => c.section))].sort((a, b) => a - b);

  const onAsk = () => {
    const id = current.id;
    void ask(id).then((searched) => {
      /* Skipped or failed: the Run screen's log carries the engine's reason. */
      if (searched === false) void navigate({ to: '/run' });
    });
  };

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--sp-4)',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <p className="caps ink-3">{t('picker.eyebrow', { id: current.id })}</p>
              <h1 className="t-xl wide">
                {t(`picker.section.${String(current.id)}.title`, { defaultValue: current.title })}
              </h1>
              <p className="t-sm ink-3">
                {t(`picker.section.${String(current.id)}.lede`, { defaultValue: '' })}
              </p>
            </div>
            {/* The header speaks for the section in view; the bar below, for the
                whole selection. */}
            <div style={{ marginInlineStart: 'auto', textAlign: 'end' }}>
              <p className="num t-xl wide accent-ink">
                {formatBytes(here.reduce((sum, c) => sum + c.bytes, 0))}
              </p>
              <p className="t-sm ink-3">
                <Trans
                  i18nKey="picker.chosenOf"
                  values={{ chosen: here.length, total: sectionRows.length }}
                  components={COUNT_MARKUP}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="band band-well band-tight"
        style={{ position: 'sticky', top: 0, zIndex: 4 }}
      >
        <div className="wrap">
          <div className="filters">
            <span className="caps ink-3" style={{ marginInlineEnd: 'var(--sp-2)' }}>
              {t('picker.sectionFilter')}
            </span>
            {sections.map((s) => (
              <button
                className="fchip"
                type="button"
                key={s.id}
                aria-pressed={s.id === current.id}
                onClick={() => {
                  go({ section: s.id }, false);
                }}
              >
                {t('picker.chipLabel', {
                  id: s.id,
                  name: t(`picker.section.${String(s.id)}.chip`, { defaultValue: s.key }),
                })}
              </button>
            ))}
            <input
              className="field"
              type="search"
              placeholder={t('picker.searchPlaceholder')}
              value={q}
              style={{ maxWidth: '16rem', marginInlineStart: 'auto' }}
              /* 🔴 `replace`, or every keystroke becomes a history entry and Back
                 walks the filter backwards one character at a time. */
              onChange={(e) => {
                go({ q: e.target.value }, true);
              }}
            />
          </div>
        </div>
      </section>

      <section className="band band-app band-tight">
        <div className="wrap">
          <div className="panel" style={{ overflow: 'visible' }}>
            <div className="xscroll">
              <PickerTable
                body={body}
                rows={visibleRows}
                selectedPaths={selectedPaths}
                onToggle={toggleCandidate}
                asking={asking === current.id}
                askDisabled={asking !== null || phase === 'running'}
                onAsk={onAsk}
              />
            </div>
          </div>

          <div className="note note-info" style={{ marginTop: 'var(--sp-4)' }}>
            <span aria-hidden="true">i</span>
            <span>
              <Trans i18nKey="picker.note" components={NOTE_MARKUP} />
            </span>
          </div>

          <details className="disclose" style={{ marginTop: 'var(--sp-4)' }}>
            <summary>
              <span className="disclose-line">{t('picker.fileSummary')}</span>
              <span className="disclose-more">{t('consent.detailsMore')}</span>
            </summary>
            <div className="disclose-body">
              <p>{t('picker.fileBody')}</p>
              <p className="mono t-xs">{t('picker.fileCommand', { id: current.id })}</p>
              {/* Keyed by section: a file's verdict is about the section it was read
                  against, so choosing another section starts the field afresh. */}
              <Suspense fallback={null}>
                <SelectionFileField key={current.id} candidates={sectionRows} onMatch={onMatch} />
              </Suspense>
            </div>
          </details>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />

      <PickerSelbar
        count={chosen.length}
        bytes={chosen.reduce((sum, c) => sum + c.bytes, 0)}
        sections={chosenSections}
        mode={mode}
        onMode={(next) => {
          go({ mode: next }, true);
        }}
        busy={busy}
        failed={failed}
        onClear={() => {
          setSelection([]);
          setFailed(null);
        }}
        /* 🔴 D-48 (GATE 4 round 8, decided): Permanent asks first. Recycle Bin keeps
           its single press - it is recoverable. */
        onRemove={() => {
          if (mode === 'permanent') setConfirming(true);
          else onRemove();
        }}
        outright={chosenSections.includes(OUTRIGHT_SECTION)}
      />
      <PickerConfirm
        isOpen={confirming}
        count={chosen.length}
        onCancel={() => {
          setConfirming(false);
        }}
        onConfirm={() => {
          setConfirming(false);
          onRemove();
        }}
      />
    </>
  );
}
