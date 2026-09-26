# Done tasks - windowsweep

Closed agent follow-ups, moved here from the root `PENDING-TASKS.md` with the date and the commit that closed
them. Open work lives there; owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-26 (latest: DONE-001 to DONE-012 moved verbatim to `DONE-TASKS-001-012.md` at this file's 500-line ceiling, and DONE-019 gained its tag-run proof. Earlier the same day: DONE-019 - TASK-019, the build-time generators became Vite plugins. Earlier 2026-09-25: DONE-018 - TASK-017, the triage stamps moved to the server. Earlier: DONE-017 - TASK-018, History's zero-count total, closed without new words. Earlier: DONE-016 - TASK-013, the desktop sync, verified live. Earlier 2026-09-17: DONE-013, DONE-014 and DONE-015 - the design-record split, the Report export, and three of the four History and Report gaps)

**DONE-001 to DONE-012** moved verbatim to [`DONE-TASKS-001-012.md`](DONE-TASKS-001-012.md) on 2026-09-26, when
this file passed its 500-line ceiling (573 lines). Their IDs, order and words are unchanged; a new entry is still
appended here.

### DONE-013 - the desktop design records are over the 500-line ceiling

**Closed 2026-09-17**, commit `cbdc32e`. `design/gate4/GATE4-REPORT.md` went 2,610 -> 114 lines as an index over eleven verbatim round bodies in `design/gate4/rounds/`; `design/README.md` went 1,039 -> 348 over `design/AMENDMENTS.md` (477, closed at the ceiling) and `design/AMENDMENTS-2.md` (the live one). No line was lost: 2,859 non-blank lines in, 0 lost, 120 index lines added - proved by comparing sorted streams, re-run independently in the main session, and watched going red on a deleted line before it was trusted. `windowsweep-click-dummy/wire.js` stays at 753 lines under RW-122 and is declared rather than hidden.

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

### DONE-014 - the Report screen's Export... is declared, not built

**Closed 2026-09-17**, commit the W2 batch-2 commit of that day. Built as a dedicated Rust command (`src-tauri/src/export.rs`, 289 lines) running the engine's own `--export both latest` against the run's own folder with a fixed argument vector, so `ALLOWED_FLAGS` was not widened; the written paths are derived from the report stem and checked to exist before being returned. 🔴 **No capability was added, deliberately** - `opener:allow-reveal-item-in-dir` takes no scope at all in the plugin's source, so granting it would have been an unscoped reveal of any path from the webview. The plain Rust function is called instead and the webview supplies only a run id. The success words are the dummy's own sentence, verbatim.

**Found while working on:** GATE 4 round 8's D-42 (History and Report with data), 2026-09-13. **Priority:
medium.** The approved dummy draws *Export...*; the window draws it disabled with a `pending-wave` note, because
building it needs two things the webview may not do today: pass `--export F [ID]` (not in
`desktop/src-tauri/src/args.rs`'s allowlist, and it prints no JSON summary, which `run_clean` expects) and reveal
the result (`opener:allow-reveal-item-in-dir` is not granted). **Do:** a dedicated Rust command that runs the
engine's `--export md|html|both latest` against THIS run's folder (the window passes each run its own
`--reports-dir`), returns the written paths, and reveals them in Explorer; the allowlist test extended; the
capability granted narrowly; the dummy's Export... is the specification. **Why not there:** a Rust and
capability change on a release-gated build; the declaration keeps GATE 4 honest meanwhile.

### DONE-015 - four gaps the History and Report work found

**Closed 2026-09-17**, commit the W2 batch-2 commit of that day - three built, one declared. (2) The history filter, not a separate cap: the dummy has never drawn a scan row and all three readers already filtered one out, so `finishRun` returns before `addHistory` for a scan and rows an earlier build wrote are dropped as the store loads. (3) The read paths take a non-creating resolver, extracted with its family into `src-tauri/src/rundir.rs` when it pushed `engine.rs` to 511 lines. (4) The nine shell screens are behind `React.lazy`: the entry chunk went 854,889 -> 363,778 bytes, a 57.4% cut, re-measured independently. (1) **Stays open as a declared limitation, not a task**: runs made by the weekly Scheduled Task or from a terminal never appear in History, the lede already says "in this window" truthfully, and the other reading means paging a folder another process is writing. Recorded in `GATE4-REPORT.md` under "A-1 (b) Known limitations, which are NOT exemptions".

**Found while working on:** D-41/D-42, 2026-09-13 (A-DESK-HR). **Priority: low to medium, each.** (1) Runs made
by the weekly Scheduled Task, or from a terminal, never appear in History: they report to
`%USERPROFILE%\.windowsweep\reports`, which the window does not read (the History lede now says "in this window",
truthfully). (2) `state/store.ts` keeps scans in its 200-record history, so scans push real runs out early; keep
only runs, or cap them separately. (3) `list_run_files` and `read_run_report` recreate a missing run folder
(`run_dir` calls `create_dir_all`): a read must not create. (4) `App.tsx` loads every screen eagerly, so the entry
chunk is 850 kB; split the screens by route.

### DONE-016 - the desktop app's cloud sync is written and never called

**Closed 2026-09-25**, verified live - the code landed dummy first in `d0977c1`, `1edd900` and `0eb2b68`. A dev
build with the Supabase keys, driven in its own browser profile with an injected NON-admin session (the real
system-browser sign-in cannot run there), passed all seven checks: sign-in and the settings round trip; the
account's run list, newest first, with Remove answering 204 on an owner-filtered delete; History's other-machine
rows ("summary only", "another machine", no report link); the conflict notice with Undo on Account and Home's
line; the three failure lines, each where the dummy draws it; and the two-user RLS probe - another user's rows
answered 200 `[]` to select, delete and update, and an insert in their name 403 `42501`. The two-wire guard
refused every IPC call before the first press, so no engine command ran. Every row was then read back over the
Management API with no path in it, and both identities were torn down to 0 rows (`../site-evidence/task013-live/`,
outside git). `SUPABASE_ENABLED` and the two repository variables follow (O6'); `desktop-v1.3.0` ships it.

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

### DONE-017 - History's header reads "freed in the last 0 runs" on an empty filter

**Closed 2026-09-25**, commit `9e0a488`, and without new words: the total block hides while the view holds no
real run - dummy first (`page-history.js`, `data-ws-hist-sum`), then `HistoryHeader.tsx` (`runs > 0`) - and the
empty row's approved words speak. So it no longer waited on the owner's GATE 4 (`desktop/design/AMENDMENTS-3.md`).
Gates green; the next desktop release's GATE 4 round checks it with History's empty states in scope.

**Found while working on:** TASK-013's live verification (2026-09-25), the Dry-runs filter on an account with no
dry-runs. **Priority: low** - the figure is true, the phrase is clumsy.

**The defect.** `desktop/src/components/history/HistoryHeader.tsx:27` renders `history.freedLast` with
`count={runs}`, and the catalogue has only `_one` and `_other`, so a count of 0 takes `_other`: *"0 B / freed in
the last 0 runs"*.

**What to do.** Dummy first (`desktop/design/windowsweep-click-dummy/`, the History header in its empty state),
then a `history.freedLast_zero` key - i18next uses a `_zero` form for a count of 0 in every language when one
exists - worded through the story pipeline: `desktop-cockpit` is a rows 11-13 surface, whose GATE 4 is the
owner's own.

**Why it was not fixed there.** It needs new approved words, and the verification run wrote no repository file.

### DONE-018 - an admin's browser writes `handled_at` and `handled_by` on a contact request

**Closed 2026-09-25** (owner decision D48). The site stopped sending the stamps first (windowsweep-web `486d650`,
deployed), then migration `20260925154905_stamp_contact_request_handled.sql` went in with `supabase db push
--linked`, then `site-evidence/task017/` proved it: the checks saw the old schema before the push and passed 10
of 10 after it, and the live `/admin` triage stamped `handled_by` = the admin and `handled_at` = its audit row's
`at` to the microsecond, with Undo clearing both. The identities were torn down to 0; the audit rows stay by design.
The UI driver's one FAIL (`/admin/audit` expected exactly two rows) was the checks driver's own five rows on the
same request - read back from the catalog, the UI's two are the newest and correct (`logs/admin-audit-verify.txt`).

**Found while working on:** RW-116, the site verified as a person (2026-09-25), flow 3 as `t1+admin`.
**Priority: low** - only a platform admin can write these fields, and the audit trail is sound; but the inbox's
record of *when* and *by whom* is whatever the admin's client sent. **APPROVED by the owner on 2026-09-25 (D48,
"Yes, apply it (Recommended)")**: the migration `20260925154905_stamp_contact_request_handled.sql` and its rollback
are written; the site change deploys first, after site parity round 6, then the migration, then flow 3 again.

**The defect.** `20260908065528_site_privileges_and_triggers.sql:109` grants
`update (status, handled_at, handled_by)` on `public.contact_requests` to `authenticated`, and the site sends
both handled fields itself. Measured: the stored `handled_at` was `2026-09-25T09:48:18.983Z` while the audit row
for the same write reads `09:48:18.738Z` - the browser's clock, 245 ms apart - and nothing stops an admin
sending any time, or another admin's id as `handled_by`. The audit trigger's `actor` and `at` are server-side,
so `admin_audit` itself is right.

**What to do.** A forward migration from the schema's home (`desktop/src/db/schema/site.ts`, `drizzle-kit
generate --custom`): a `BEFORE UPDATE` trigger on `contact_requests` that sets `handled_at = now()` and
`handled_by = auth.uid()` when `status` becomes `handled`, and nulls both when it goes back to `new`; then the
grant narrowed to `update (status)`, with its rollback beside it in `supabase/rollbacks/`. Regenerate
`windowsweep-web/src/db/types.ts`, drop the two fields from the site's triage write, and re-run RW-116 flow 3's
Mark handled / Undo pair, reading `handled_at` against the audit row's `at` (equal to the millisecond, since
both come from one transaction's `now()`).

**Why it was not fixed there.** RW-116 was verification, run by an agent that writes no repository file; the
fix is a production schema change, which needs the owner's approval first.

### DONE-019 - three build-time generators live in `desktop/scripts/*.mjs`, which the house rules forbid

**Closed 2026-09-26** in the commit that carries this entry, `chore(desktop): TASK-019 - the build-time generators
become Vite plugins`. The three generators are Vite plugins in `desktop/vite/` beside `catalogue-keys.ts`:
`prepaint.ts` writes `public/prepaint.js` once the config resolves (the site's own shape), `tauri-config.ts` runs the
schema walk and the glob rule when a build starts and stops as BLIND unless a planted field is reported, and
`engine-bundle.ts` mirrors the engine on every dev start and build, then checks the copy. `desktop/scripts/` is gone
with its four `package.json` scripts, and every caller moved in the same change: `dev`, `build`, `gates`, both
desktop workflows (CI's three steps now run inside `yarn build`, plus `git diff --exit-code -- public/prepaint.js`;
the release workflow's "Bundle the engine" step is gone, because `beforeBuildCommand` runs the build before cargo),
ESLint (which now lints `vite/`), `docs/PACKAGES.md`, the guide pair and `PROJECT-CONTEXT.md`. Parity was measured
before the old files went - the bundle byte-identical to `sync-cli.mjs`'s (41 files, every SHA-256), `prepaint.js`
different only in the header line naming its generator, the same two config plants refused with identical messages -
and eight plants were each watched (the tracker's `P6.task-019`). An unsigned local `tauri build` then produced an
MSI whose File table matches the published `desktop-v1.3.0` MSI's name for name (41 engine files and the app).
Evidence: `../gate4-evidence/task019/`. The tag build of `desktop-v1.3.1` (D50) runs the release half on GitHub.
**Proved on that tag run, 2026-09-26:** `desktop-release` run 36236930943 printed, inside tauri-action's
`beforeBuildCommand`, `[prepaint] public/prepaint.js matches axes.json (10 axes)`, `[tauri-config] tauri.conf.json
validates against @tauri-apps/cli 2.11.5` and `[engine-bundle] the 1.3.1 engine: 41 files in
src-tauri/resources/windowsweep/ (41 written, 0 removed)`; the published MSI's File table lists 42 rows, name for name
the 1.3.0 MSI's, and the installed 1.3.1 holds VERSION 1.3.1 in 41 engine files.

**Found while working on:** D37's desktop half (2026-09-25), measuring `desktop/` for the package baseline.
**Priority: medium** - nothing is broken, but the folder breaks the fleet's zero-tolerance rule against script
files (`~/.claude/rules/00-house-rules.md`, "NO SCRIPTS") and has since 2026-09-05 (`5f2bc84`, `4c031d7`).

**The defect.** `desktop/scripts/sync-cli.mjs` copies the engine into the bundle (`yarn sync:cli`, which
`desktop-release.yml`'s "Bundle the engine" step and every local build call); `gen-prepaint.mjs` writes
`public/prepaint.js` from `axes.json` (`yarn gen:prepaint`, `yarn check:prepaint`, and the `dev` and `build`
scripts); `check-tauri-config.mjs` is the config schema check in `build`. No exception is recorded for any of them.

**What to do.** The web repo's answer to the same class: build-time generators are Vite plugins under `vite/`
(`windowsweep-web` IRON rule 9; the desktop already has `desktop/vite/catalogue-keys.ts`). Move the prepaint
generator and the config check into `desktop/vite/`, and make the engine sync reachable by the workflow and the
local build without a script file (a Vite plugin at build start, or a plain `package.json` command). Every caller
moves in the same change: the `package.json` scripts, both desktop workflows and `docs/PACKAGES.md`. Watch each
generator fail on a plant before trusting it, as `catalogue-keys.ts` was.

**Why it was not fixed there.** It changes the release workflow's "Bundle the engine" step, which only a tag
exercises, and D37 was scoped to packages. It belongs with the next desktop release, whose workflow run proves it.
