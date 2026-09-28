# Done tasks - windowsweep

Closed agent follow-ups, moved here from the root `PENDING-TASKS.md` with the date and the commit that closed
them. Open work lives there; owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-28 (latest: DONE-023 - TASK-023, a development build reports no analytics (D54), with no release needed. Earlier the same day: DONE-020 (TASK-020, the window's CSP), DONE-021 (the desktop sign-in) and DONE-022 (empty run folders), all closed with desktop-v1.3.2. Earlier 2026-09-26: DONE-001 to DONE-012 moved verbatim to `DONE-TASKS-001-012.md` at this file's 500-line ceiling, and DONE-019 gained its tag-run proof. Earlier the same day: DONE-019 - TASK-019, the build-time generators became Vite plugins. Earlier 2026-09-25: DONE-018 - TASK-017, the triage stamps moved to the server. Earlier: DONE-017 - TASK-018, History's zero-count total, closed without new words. Earlier: DONE-016 - TASK-013, the desktop sync, verified live. Earlier 2026-09-17: DONE-013, DONE-014 and DONE-015 - the design-record split, the Report export, and three of the four History and Report gaps)

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

### DONE-020 - the desktop window's CSP blocks Clarity, so session replay has never run in a desktop release

**Closed 2026-09-28** with `desktop-v1.3.2` (D53), in `6d232e5` and `c530312`. The window's CSP now admits the
disclosed services' documented hosts, mirroring the live site's proven set: `script-src` `https://*.clarity.ms`;
`img-src` the GA4, Tag Manager and Clarity hosts and `c.bing.com`; `connect-src` the regional GA4 hosts, Tag Manager,
`c.bing.com` and `https://*.ingest.us.sentry.io` - the desktop DSN's own host, which `*.ingest.sentry.io` never
matched, so **every crash report was refused too** (proved on the installed 1.3.1: `connect-src` blocked each envelope,
0 delivered). Two gaps closed with it: `data-clarity-mask` moved from `#root` to `<body>`, because React Aria portals
every dialog, popover and tooltip outside `#root`; and Amplitude's remote-config fetch (six refusals a boot in every
release) is turned off in code, not admitted, because that dashboard config can switch autocapture on. Proved, all in
`../gate4-evidence/`: `task020/` (the replay under `tauri dev` with both portals open - 0 readable text nodes, two plants
failing; the CSP on a production-protocol debug build - `tauri dev` applies none - 0 violations, Clarity collect 204,
Sentry 200), round 18, and `updater-1.3.2/` (the installed 1.3.2's first boot: Clarity's script 200 and collect 204 ×3
with 0 readable text nodes, GA4 and Amplitude `app_version 1.3.2`, Sentry 200, 0 violations, 0 personal data). One edge
is left, recorded rather than admitted: when the window unloads while a GA4 hit is in flight, `gtag` re-sends it to
`www.google.com`, which neither this policy nor the site's allows - at most one lost event on close.

**Found while working on:** the `desktop-v1.3.1` release (D50, tracker `P6.release-1.3.1`) - its first-boot beacons
(`../gate4-evidence/updater-1.3.1/beacons.log`, 2026-09-26). **Priority: high** - a disclosure the window does not keep.
**The owner chose (a) - D52, 2026-09-26: "Widen the CSP (Recommended)".** It ships in the next desktop release;
when to cut that release is asked separately.

**The defect.** `desktop/src-tauri/tauri.conf.json`'s CSP has `script-src 'self' https://www.googletagmanager.com
https://www.clarity.ms` and `img-src 'self' data: blob:`. Clarity's loader (`www.clarity.ms/tag/...`) answers 200, but
the script it loads (`scripts.clarity.ms/0.8.70/clarity.js`) and its pixel (`c.clarity.ms/c.gif`) are refused, so
Clarity never starts - while Settings › Privacy (and the first-run notice) list *Session replay: This window, with all
text masked* as on. The 1.3.0 beacons (2026-09-25) saw the same two requests and did not read their outcome, so every
release since the telemetry ids landed (`desktop-v1.2.0`) is affected. The same `img-src` would also refuse Tag
Manager's sampled `/td` image pixel, which the site's policy refused until web `e01bf4f`.

**What to do - (a), chosen by D52.** (a) Widen the CSP to Clarity's documented hosts (`script-src
https://*.clarity.ms`; `img-src https://*.clarity.ms https://*.googletagmanager.com`), then prove on the wire that a
replay starts and that every text node reaches it masked - the tab's own promise; or (b) remove Clarity from the
desktop build and its row from Settings › Privacy and the first-run notice - dummy first, the words through the story
pipeline. Either way the disclosures describe what the window does, and the change ships in the next desktop release
with its GATE 4 round (the Privacy tab in scope) and the watch-only beacons.

**Why it was not fixed there.** The CSP is compiled into the binary, so either fix is a new desktop release; and (a)
starts a session recording that no desktop user has yet been subject to, while (b) changes an owner decision
(2026-09-07: Clarity with text masked, no opt-out) - both are the owner's to choose.

### DONE-021 - the desktop app's Google sign-in never completed: its state travelled nowhere

**Found while working on:** row 31 - the owner's first real desktop sign-in, on the installed 1.3.1 (2026-09-26 and
again 2026-09-28): *"the sign-in reply did not match the request that started it"*. **Closed 2026-09-28** with
`desktop-v1.3.2` (D53), in `6d232e5`.

**The defect.** `desktop/src/lib/auth.ts` made a `state` and gave it to the Rust loopback listener, but sent it nowhere:
the redirect was `http://127.0.0.1:<port>` alone. Supabase keeps its own `state` with Google and forwards none, so every
reply reached the listener without one and `oauth.rs` refused it - in every release since the move from Firebase
(`62a3c5b`, 2026-09-05), whose flow had carried the state on Google's own address. `auth.flow_state` held the owner's
three attempts (1.3.0 twice, 1.3.1 once): each PKCE, each with a code issued and none exchanged - Google and Supabase
had both succeeded. No earlier check could see it: the signed-in rounds injected sessions, and Google refuses an
automated browser after the email step.

**The fix.** The state rides inside the redirect address (`desktop/src/lib/oauth-redirect.ts`,
`http://127.0.0.1:<port>?state=<uuid>`): Supabase Auth v2.197.0 accepts any loopback redirect and keeps `redirect_to`'s
query when it adds `code` or `error` (read from its source; a probe's `flow_state.referrer` stored intact, a planted
foreign host fell back to the site URL). `oauth.rs` gained a pure `classify()`: a request without this sign-in's state
is answered 404 and the wait goes on, so a stray request (a favicon, a stale tab) can neither pass the check nor end the
sign-in; the wait moved to the blocking pool; "Signed in." shows only beside a code. Tests watched failing on the 1.3.1
form and on two listener plants. Proved live under `tauri dev` twice (`../gate4-evidence/signin-1.3.2/`, round 18): the
app's own redirect stored as the referrer, strays 404, a forged matching reply reaching the PKCE exchange, a refusal
named. **The last proof is the owner's:** row 31 on the installed 1.3.2.

### DONE-022 - every launch left one or two empty run folders

**Found while working on:** the 1.3.2 proofs (`../gate4-evidence/task020/`), 2026-09-28. **Closed 2026-09-28** with
`desktop-v1.3.2`, in `c530312`.

**The defect.** `run_clean` creates a run folder for every engine call, and the catalogue load at every boot
(`--list --json`) writes nothing into it: 273 of 375 run folders on the build machine were empty. **The fix.** A
non-elevated call that left its folder empty removes it (`remove_dir`, which refuses anything holding a file; an
elevated run is exempt, because its parent exits before the elevated window writes into that folder), and empty folders
a day old are swept once at startup, off the startup path. The `rundir.rs` test was watched failing on a `remove_dir_all`
plant. Proved on the owner's own app data in round 18: the 271 empty day-old folders went, all 102 non-empty ones stayed
byte-identical, and no catalogue load left a folder.

### DONE-023 - a development build sends its analytics too, and Clarity records one local path there

**Found while working on:** the 1.3.2 proofs (D53, tracker `P6.release-1.3.2`) - proof B under `tauri dev`
(`../gate4-evidence/task020/`, 2026-09-28). **Priority: low** - development builds only; no installed build is
affected. **Closed 2026-09-28** (session 20) with option (a), the owner's choice (D54), in the product commit that
carries this entry.

**The defect.** `startAnalytics` starts every destination whose key is present, with no development gate
(`desktop/src/lib/analytics.ts`), and the local `desktop/.env` carries the keys - so every `yarn tauri dev` session,
every GATE 4 round included, reports to the production GA4, Amplitude, Clarity and Sentry projects. Under Vite's dev
server the page carries `<style data-vite-dev-id="D:/.../app.css">`, and Clarity records that attribute: a local
path, the developer's, in a replay. A production build has no such attribute, and every text node stays masked in
both.

**What to do.** Decide how a development build reports: (a) skip `startAnalytics` when `import.meta.env.DEV`, and
move the GATE 4 steps that watch analytics (a round's isolation check reads Amplitude's storage keys) onto a
production-protocol build; or (b) keep development reporting and strip the Vite attributes before Clarity starts.
(a) is the fleet's usual shape. Either way a round's evidence must say which build it watched.

**Why it was not fixed there.** Proof B, the replay-mask proof for TASK-020, ran under `tauri dev` precisely because
analytics run there (the window's CSP does not apply in development). Changing that mid-release would have moved the
GATE 4 method for round 18; the data concerned is the developer's own, on the developer's machine.

**The fix.** `startAnalytics` returns before any destination starts when `import.meta.env.DEV` is true, and drops
its replay queue, so `yarn dev` and every `tauri dev` session report nothing. A production build replaces the flag
with `false` and drops the branch. **Proved** in `../gate4-evidence/task023/`:
- The production bundle is byte-identical before and after: 38 files, one digest. The comparison was first seen failing
  twice, on a doctored hash and on a real one-character code change, and it matched again once that change was
  restored. So the installed 1.3.2 already runs this code, and no release is needed.
- Under the Vite dev server, one page load made 8 analytics attempts before the fix: gtag.js, Clarity's tag, one
  Sentry envelope and five Amplitude batches. The driver paused and failed each one, so none reached a dashboard.
  After the fix the same load made 0, and `#root` rendered both times.
- `yarn gates` passed.

Round 18's axis-parity driver already leaves `AMP_*` keys out, so no round driver breaks. From now on a round watches
analytics only on a production-protocol build or the installed first boot (`../release-kit-1.3.2/README.md` binds the
next kit).
