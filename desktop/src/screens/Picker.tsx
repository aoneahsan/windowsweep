/**
 * Picker - the interactive sections, where a person chooses row by row.
 *
 * Translated from `picker.html` + `page-picker.js`, one section at a time as the
 * dummy draws it: the section's own header, the section chips and the path filter,
 * the table, the note, the file disclosure and the selection bar. The interactive
 * sections never auto-confirm: `--yes` does not answer them, by design in the
 * engine. This screen is how a person answers them in advance, and the answer
 * travels to the engine as a `--select-file` of the rows' own paths.
 *
 * 🔴 TWO MODES FROM 1.5.0 (D109, D110). Sections 17-27 take something away; 30-32
 * (tier `update`) bring software in - the INSTALL mode: install columns, no Recycle
 * Bin choice, a download in words, a verb built from the rows and a confirmation on
 * every press. 🔴 THE TWO SELECTIONS NEVER MERGE: the bar acts on the rows of the mode
 * in view, Clear clears only those, and rows chosen in the other mode stay chosen and
 * are named in one line, because they run separately.
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
 * follows is the one prompt `-ScriptedOk` answers. An install's lines are the rows'
 * own `wu:` (30, and 31's driver installs - told apart only by `kind`), `oem:` and `winget:`
 * paths.
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
import { useBarRoom } from '../state/use-bar-room';
import { usePickerRemoval } from '../state/use-picker-removal';
import { DEV_GATED_SECTIONS, isInstallSection } from '../lib/catalogue';
import { programKind, reclaimOf } from '../lib/candidate-extras';
import { keptPhrase, tallyInstall, verbPhrase } from '../lib/install-mode';
import type { Candidate } from '../lib/cli';
import { PickerHeader } from '../components/PickerHeader';
import { PickerFilters } from '../components/PickerFilters';
import { PickerTable, type PickerBody } from '../components/PickerTable';
import { PickerSelbar, type DeleteMode } from '../components/PickerSelbar';
import { PickerConfirm, type UninstallLines } from '../components/PickerConfirm';
import { PickerInstallConfirm } from '../components/PickerInstallConfirm';
import { PickerDriverReport } from '../components/PickerDriverReport';
import { PickerDataScanner, type DataReason, type DataSort } from '../components/PickerDataScanner';
import { verbText } from '../components/picker-words';

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
/** `picker.ranNote` sets its first word bold, as the dummy does. */
const RAN_MARKUP = { 1: <strong /> };

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
  reason: DataReason;
  sort: DataSort;
}

/** The query a Picker URL carries, with the defaults left out. */
function toSearch(next: PickerQuery): {
  section: number;
  q?: string;
  mode?: DeleteMode;
  reason?: DataReason;
  sort?: DataSort;
} {
  return {
    section: next.section,
    ...(next.q === '' ? {} : { q: next.q }),
    ...(next.mode === 'permanent' ? { mode: next.mode } : {}),
    ...(next.reason === 'all' ? {} : { reason: next.reason }),
    ...(next.sort === 'size' ? {} : { sort: next.sort }),
  };
}

/** Which uninstall lines the confirmation shows, or null when no section 26 row is chosen. */
function uninstallLinesOf(rows: readonly Candidate[]): UninstallLines | null {
  const programs = rows.filter((c) => c.section === 26);
  if (programs.length === 0) return null;
  const has = (kind: string) => programs.some((c) => programKind(c) === kind);
  return {
    desktop: has('desktop'),
    store: has('store'),
    broken: has('broken'),
    others: rows.length > programs.length,
  };
}

export function Picker() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const catalogue = useStore((s) => s.catalogue);
  const candidates = useStore((s) => s.candidates);
  const offeredSections = useStore((s) => s.offeredSections);
  const driverReport = useStore((s) => s.driverReport);
  const selectedPaths = useStore((s) => s.selectedPaths);
  const setRootList = useStore((s) => s.setRootList);
  const toggleCandidate = useStore((s) => s.toggleCandidate);
  const setSelection = useStore((s) => s.setSelection);
  const phase = useStore((s) => s.phase);
  const summary = useStore((s) => s.summary);
  /* 🔴 The same four preferences every other run path carries. The engine
     re-derives each section's candidate list on this run and matches the select
     file against it, so a threshold that differs from the one the rows were
     offered under changes what is on offer - and a picked row that matches
     nothing is silently not deleted. */
  const prefs = useRunPreferences();
  const excludedPaths = useStore((s) => s.excludedPaths);
  const { asking, ask } = useAskSection();

  const search: {
    section?: unknown;
    q?: unknown;
    mode?: unknown;
    reason?: unknown;
    sort?: unknown;
  } = useSearch({ strict: false });
  /* The chips are the catalogue's own interactive sections, never a list kept here. */
  const sections = useMemo(
    () => (catalogue?.sections ?? []).filter((s) => s.batch === 'interactive'),
    [catalogue]
  );
  const installIds = useMemo(
    () => new Set(sections.filter(isInstallSection).map((s) => s.id)),
    [sections]
  );
  const current = sections.find((s) => s.id === Number(search.section)) ?? sections[0] ?? null;
  const install = current !== null && installIds.has(current.id);
  const q = typeof search.q === 'string' ? search.q : '';
  const mode: DeleteMode = search.mode === 'permanent' ? 'permanent' : 'recycle';
  const reason: DataReason =
    search.reason === 'large' || search.reason === 'old' ? search.reason : 'all';
  const sort: DataSort = search.sort === 'age' ? 'age' : 'size';

  /** Which confirmation is open: the removal one (D-48, A4-06) or the install one (A4-09). */
  const [confirming, setConfirming] = useState<'remove' | 'install' | null>(null);

  const available = useMemo(
    () => candidates.filter((c) => prefs.developer || !DEV_GATED_SECTIONS.has(c.section)),
    [candidates, prefs.developer]
  );
  const chosen = useMemo(
    () => available.filter((c) => c.selectable !== false && selectedPaths.has(c.path)),
    [available, selectedPaths]
  );
  /* The rows the bar acts on - the mode in view - and the ones it only names. */
  const mine = useMemo(
    () => chosen.filter((c) => installIds.has(c.section) === install),
    [chosen, installIds, install]
  );
  const other = useMemo(
    () => chosen.filter((c) => installIds.has(c.section) !== install),
    [chosen, installIds, install]
  );
  const sectionRows = useMemo(
    () => (current === null ? [] : available.filter((c) => c.section === current.id)),
    [available, current]
  );
  const needle = q.trim().toLowerCase();
  const visibleRows = sectionRows
    .filter(
      (c) => reason === 'all' || current?.id !== 19 || c.reason === reason || c.reason === 'both'
    )
    .filter(
      (c) =>
        needle === '' ||
        `${c.path} ${c.label ?? ''} ${c.project ?? ''} ${c.reason ?? ''}`
          .toLowerCase()
          .includes(needle)
    );
  /* Install rows keep the order their tool lists them in: install, run, remove. */
  if (!install) {
    visibleRows.sort((a, b) =>
      current?.id === 19 && sort === 'age'
        ? (b.idle_days ?? -1) - (a.idle_days ?? -1)
        : b.bytes - a.bytes
    );
  }
  const recycleOnly = !install && mine.some((c) => c.section === 19);
  const effectiveMode: DeleteMode = recycleOnly ? 'recycle' : mode;
  const tally = useMemo(() => tallyInstall(install ? mine : []), [install, mine]);
  const verb = verbText(t, verbPhrase(tally));
  const {
    busy,
    failed,
    clearFailed,
    remove: onRemove,
  } = usePickerRemoval({
    chosen: mine,
    permanent: !install && effectiveMode === 'permanent',
    prefs,
    excludedPaths,
  });
  const { ref: barRef, room } = useBarRoom(mine.length > 0);

  const go = useCallback(
    (next: Partial<PickerQuery>, replace: boolean) => {
      if (current === null) return;
      void navigate({
        to: '/picker',
        search: toSearch({ section: current.id, q, mode, reason, sort, ...next }),
        replace,
      });
    },
    [current, q, mode, reason, sort, navigate]
  );

  /** A file's matches are ADDED to the selection - it never unticks a person's choice. */
  const onMatch = useCallback(
    (paths: string[]) => {
      const selectable = new Set(
        available.filter((c) => c.selectable !== false).map((c) => c.path)
      );
      setSelection(
        [...new Set([...selectedPaths, ...paths])].filter((path) => selectable.has(path))
      );
      if (
        mode === 'permanent' &&
        available.some((row) => row.section === 19 && paths.includes(row.path))
      ) {
        go({ mode: 'recycle' }, true);
      }
    },
    [available, selectedPaths, setSelection, mode, go]
  );

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
        : needle === '' && (current.id !== 19 || reason === 'all')
          ? 'nothing'
          : 'no-match';
  /** What a set of rows frees - 🔴 never a download (`reclaimOf`). */
  const freed = (rows: readonly Candidate[]) =>
    rows.reduce((sum, c) => sum + reclaimOf(c, installIds.has(c.section)), 0);
  const here = mine.filter((c) => c.section === current.id);
  const chosenSections = [...new Set(mine.map((c) => c.section))].sort((a, b) => a - b);
  const uninstall = install ? null : uninstallLinesOf(mine);
  /* 26's Ran note sits where the dashes are: a list Windows did not tell an elevated
     window about shows a dash on every row (decided for 1.5.0: no prompt just for Ran). */
  const ranMeasured = sectionRows.some((c) => c.ran !== undefined && c.ran !== '-');

  const onAsk = () => {
    const id = current.id;
    void ask(id).then((searched) => {
      /* Skipped or failed: the Run screen's log carries the engine's reason. */
      if (searched === false) void navigate({ to: '/run' });
    });
  };

  return (
    <>
      <PickerHeader
        section={current}
        bytes={freed(here)}
        chosen={here.length}
        total={sectionRows.filter((row) => row.selectable !== false).length}
        install={install}
        reclaims={!install || sectionRows.some((c) => reclaimOf(c, true) > 0)}
      />

      <PickerFilters
        removing={sections.filter((s) => !installIds.has(s.id))}
        installing={sections.filter((s) => installIds.has(s.id))}
        current={current.id}
        install={install}
        q={q}
        onSection={(id) => {
          go({ section: id }, false);
        }}
        onSearch={(next) => {
          go({ q: next }, true);
        }}
      />

      <section className="band band-app band-tight">
        <div className="wrap">
          {current.id === 19 ? (
            <PickerDataScanner
              roots={prefs.personalRoots}
              onRoots={(next) => {
                setRootList('personalRoots', next);
              }}
              reason={reason}
              onReason={(next) => {
                go({ reason: next }, true);
              }}
              sort={sort}
              onSort={(next) => {
                go({ sort: next }, true);
              }}
              rows={sectionRows}
              verdicts={
                asked && summary?.sections.some((step) => step.section === 19)
                  ? summary.personal_roots
                  : []
              }
              asked={asked}
              asking={asking === current.id}
              askDisabled={asking !== null || phase === 'running'}
              onAsk={onAsk}
              largeFileMb={prefs.largeFileMb}
              idleDays={prefs.idleDays}
            />
          ) : null}
          {current.id === 26 && sectionRows.length > 0 && !ranMeasured ? (
            <div className="note note-info" style={{ marginBottom: 'var(--sp-4)' }}>
              <span aria-hidden="true">i</span>
              <span>
                <Trans i18nKey="picker.ranNote" components={RAN_MARKUP} />
              </span>
            </div>
          ) : null}
          <div className="panel" data-tour="choose-table" style={{ overflow: 'visible' }}>
            <div className="xscroll">
              <PickerTable
                body={body}
                rows={visibleRows}
                selectedPaths={selectedPaths}
                onToggle={(path) => {
                  if (current.id === 19 && !selectedPaths.has(path) && mode === 'permanent') {
                    go({ mode: 'recycle' }, true);
                  }
                  toggleCandidate(path);
                }}
                asking={asking === current.id}
                askDisabled={asking !== null || phase === 'running'}
                onAsk={onAsk}
                section={current.id}
                install={install}
              />
            </div>
          </div>

          {current.id === 31 && driverReport ? <PickerDriverReport report={driverReport} /> : null}

          <div className="note note-info" style={{ marginTop: 'var(--sp-4)' }}>
            <span aria-hidden="true">i</span>
            <span>
              <Trans i18nKey="picker.note" components={NOTE_MARKUP} />
            </span>
          </div>

          {/* Not drawn in install mode, as the dummy draws it: its words - one full path per
              line, a node_modules example - are untrue of a `wu:` or `winget:` line. */}
          {install ? null : (
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
          )}
        </div>
      </section>

      {/* Room for the bar, as tall as the bar while it shows (A4-12). */}
      <div style={{ height: room }} />

      <PickerSelbar
        ref={barRef}
        count={mine.length}
        bytes={freed(mine)}
        sections={chosenSections}
        install={install}
        tally={tally}
        verb={verb}
        mode={effectiveMode}
        onMode={(next) => {
          go({ mode: next }, true);
        }}
        lines={{
          outright: chosenSections.includes(OUTRIGHT_SECTION),
          uninstall: uninstall !== null,
          leftovers: chosenSections.includes(27),
          recycleOnly,
        }}
        kept={keptPhrase(other)}
        busy={busy}
        failed={failed}
        onClear={() => {
          /* Clears what the bar shows: the other mode's rows were never in it. */
          const keep = new Set(other.map((c) => c.path));
          setSelection([...selectedPaths].filter((path) => keep.has(path)));
          clearFailed();
        }}
        /* 🔴 D-48 (GATE 4 round 8, decided): Permanent asks first, and any section 26 row
           asks whichever mode is set - an uninstall is permanent either way (A4-06). An
           install always asks (A4-09). Recycle Bin keeps its single press: it is recoverable. */
        onPress={() => {
          if (install) setConfirming('install');
          else if (effectiveMode === 'permanent' || uninstall !== null) setConfirming('remove');
          else void onRemove();
        }}
      />
      <PickerConfirm
        isOpen={confirming === 'remove'}
        count={mine.length}
        uninstall={uninstall}
        onCancel={() => {
          setConfirming(null);
        }}
        onConfirm={() => {
          setConfirming(null);
          void onRemove();
        }}
      />
      <PickerInstallConfirm
        isOpen={confirming === 'install'}
        tally={tally}
        verb={verb}
        onCancel={() => {
          setConfirming(null);
        }}
        onConfirm={() => {
          setConfirming(null);
          void onRemove();
        }}
      />
    </>
  );
}
