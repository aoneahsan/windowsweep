# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-13 (TASK-004, 006, 007, 009, 010, 011 and 012 closed to `docs/DONE-TASKS.md` by the v3 run; TASK-013 to TASK-016 filed the same day; the next id is TASK-017)

### TASK-013 - the desktop app's cloud sync is written and never called

**Found while working on:** the v3 run's desktop round-7 fixes (2026-09-13), reading `desktop/src/lib` for the
sign-out scope. **Priority: high, and it blocks one thing** - setting the `SUPABASE_ENABLED` repository
variable (row 15 / RW-116). Until then no build carries the Supabase keys (`desktop-release.yml` injects them
only when that variable is `true`), so nothing a user runs today is wrong.

**The defect.** `desktop/src/lib/sync.ts` exports `fetchSettings`, `pushSettings`, `reconcileSettings`,
`fetchRuns`, `pushRun` and `deleteRun`, and not one of them has a caller anywhere in `desktop/src` (grep each
name outside `lib/sync.ts` -> 0 files). Yet `configuredFeatures()` reports `sync: supabaseReady`, and the Home
screen says *"Signing in is optional. It syncs your settings and a summary of each run, and nothing else."*
(`home.privacySignIn`). The first Supabase-enabled build would sign a person in and sync nothing, under a
sentence saying it does.

**What to do.** Wire the module the schema was written for (`desktop/src/db/schema/sync.ts`): on sign-in,
`fetchSettings` then `reconcileSettings` against the local store, and `pushSettings` on every later settings
change; `pushRun(stripRun(...))` after each finished run; the Account screen's run list from `fetchRuns`
(keyset, `RUNS_PAGE_SIZE` 20); `deleteRun` behind its control. Every read paginated, every write owner-filtered
(`~/.claude/rules/data-fetch-budget.md`), and `stripRun` is the only path a run takes to the network - no path,
drive label or machine name leaves the machine. Dummy first for any visible change (IRON rule 12). Verify as
`aoneahsan.apps.t1+1` once row 15 lands: settings round-trip across a sign-out and sign-in, one run row per
finished run, `deleteRun` leaves 0 rows, and the rows hold no path (read them over the Management API).

**Why it was not fixed there.** It is a feature, not a two-line fix; it needs the live sign-in to verify, which
row 15 gates; and it was outside that dispatch's scope.

### TASK-014 - the desktop design records are over the 500-line ceiling

**Found while working on:** the desktop round-7 fixes and RW-122 (2026-09-13). **Priority: low.**
`desktop/design/README.md` is 714 lines (568 before the round-7 amendments) and
`desktop/design/gate4/GATE4-REPORT.md` 1,860, both over the house 500-line rule. **Do:** move the design
README's dated amendment sections into a sibling `desktop/design/AMENDMENTS.md` with a pointer, and split the
GATE 4 report by round (one file per round under `design/gate4/`, the report itself an index plus the
current verdict), exactly as the site repo did (`windowsweep-web/design/AMENDMENTS.md`, its TASK-004), with a
no-line-lost proof that fails on a genuinely removed line. **Not in scope, and why:** the click dummy's own
scripts and stylesheets (`app.js` 752, `shared.css` 964, `components.css` 653, `wire.js` 618, `tokens.css`
540) are the design record, which RW-122 recorded as untouched, and they never ship. **Why it was not fixed
there:** round 8 prepends to the report next, and splitting it under a running round would put two writers
on one file.

### TASK-015 - the Report screen's Export... is declared, not built

**Found while working on:** GATE 4 round 8's D-42 (History and Report with data), 2026-09-13. **Priority:
medium.** The approved dummy draws *Export...*; the window draws it disabled with a `pending-wave` note, because
building it needs two things the webview may not do today: pass `--export F [ID]` (not in
`desktop/src-tauri/src/args.rs`'s allowlist, and it prints no JSON summary, which `run_clean` expects) and reveal
the result (`opener:allow-reveal-item-in-dir` is not granted). **Do:** a dedicated Rust command that runs the
engine's `--export md|html|both latest` against THIS run's folder (the window passes each run its own
`--reports-dir`), returns the written paths, and reveals them in Explorer; the allowlist test extended; the
capability granted narrowly; the dummy's Export... is the specification. **Why not there:** a Rust and
capability change on a release-gated build; the declaration keeps GATE 4 honest meanwhile.

### TASK-016 - four gaps the History and Report work found

**Found while working on:** D-41/D-42, 2026-09-13 (A-DESK-HR). **Priority: low to medium, each.** (1) Runs made
by the weekly Scheduled Task, or from a terminal, never appear in History: they report to
`%USERPROFILE%\.windowsweep\reports`, which the window does not read (the History lede now says "in this window",
truthfully). (2) `state/store.ts` keeps scans in its 200-record history, so scans push real runs out early; keep
only runs, or cap them separately. (3) `list_run_files` and `read_run_report` recreate a missing run folder
(`run_dir` calls `create_dir_all`): a read must not create. (4) `App.tsx` loads every screen eagerly, so the entry
chunk is 850 kB; split the screens by route.
