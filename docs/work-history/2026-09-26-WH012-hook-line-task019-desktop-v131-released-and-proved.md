# WH012 - the hook line, TASK-019, and `desktop-v1.3.1` released and proved

| | |
|---|---|
| Date | 2026-09-26 |
| Task id | WH012 (session 18: WH011's continuation prompt, items 1-4) |
| Duration | one session across two compactions; one custom agent at a time (`aoneahsan-ccca-test-engineer` for GATE 4 rounds 16 and 17, then the updater proof) - the owner allowed up to four, a ceiling, and every dispatch followed a CPU, RAM and swap check |
| Status | **complete for this session** - items 1-3 done, D51 done; item 4 (row 31's read-back) waits for the owner's word; TASK-020's fix was chosen at the end (D52: widen the CSP) and ships in the next desktop release |
| Project | windowsweep (`D:\work\windowsweep-root\` - the product repo, the docs site, the marketing site, and the root's own repository) |
| Developer | Ahsan Mahmood (owner) |

## Executive summary

The three `.husky/pre-commit` files took the fleet's Windows command-line fix, and TASK-019 moved the desktop's three
build-time generators out of a scripts folder into Vite plugins. On the owner's word (**D50**) the desktop app was
cascaded to 1.3.1 and released as **`desktop-v1.3.1`** after two GATE 4 rounds. Round 16 found six older divergences,
fixed in the app, and in the dummy's seed for one. Round 17 came back CLEAN. The installed app on this machine
**updated itself from 1.3.0 to 1.3.1**, in an isolated WebView2 profile this time. Its first boot carried the app's
own version to analytics, where 1.3.0 had carried 1.2.0. The site and the docs followed under O3'.

The live check after the site deploy found a note on the home hero that had named 1.1.0's installer for three
releases. It is now fixed dummy first and held by the site's release gate. A CSP line blocking Tag Manager's image
pixel was fixed the same hour.

The updater proof produced two findings for the records:
- Round 12's two-wire IPC guard **sees nothing on an installed build**. It holds under `tauri dev`, where every round
  runs.
- The desktop window's CSP **blocks Clarity**, so session replay has never run in a desktop release, although Settings
  › Privacy lists it. This is **TASK-020**; the owner chose its fix (D52, below).

The stray `runs$RUNID` folder was listed and deleted (**D51**). Asked at the end, the owner chose TASK-020's fix
(**D52**): widen the CSP, with the replay proved masked, in the next desktop release. Fifty-two owner decisions are
recorded (D1-D52).

## Starting point

The state at the WH011 pause (2026-09-26, just after midnight):
- `desktop-v1.3.0` Latest and installed here; CLI 1.3.1 on npm; site parity round 7 CLEAN.
- The three hooks still ran lint-staged `--no-stash` alone.
- TASK-019 was the only open task.
- The installed engine was 1.3.0, whose logs and reports still named one person with an email address (D45 says
  the team).

Verified before acting: all four repositories clean and equal to their remotes, CI green at every head, `latest.json`
1.3.0, npm 1.3.1, both sites 200.

## Work completed, step by step

### 1. The fleet hook line (P4.hook-line-2026-09-26)

The last line of each hook changed:
- `desktop/.husky/pre-commit` → `cd desktop && yarn lint-staged --no-stash --relative --max-arg-length 8000`
- the web and docs hooks → the same line without the `cd`

Why: Windows caps a command line at 8,191 characters, and lint-staged 17.5.1 splits a file list only when
`--max-arg-length` is set.

The records that state the line changed in the same commits: `docs/PACKAGES.md` and the guide pairs. The notebook's
baseline names the full line too (`e0c30473`). Each hook was watched running on a real commit:
- product `d593b43`
- web `8dbc577`
- docs `f044ca7`, whose hook has no Markdown pattern and reports no matching file

### 2. TASK-019 (P6.task-019, DONE-019, `70a54e9`)

Three plugins in `desktop/vite/` replace `desktop/scripts/*.mjs`:

| Plugin | What it does |
|---|---|
| `prepaint.ts` | writes `public/prepaint.js` once the config resolves |
| `tauri-config.ts` | the schema walk and the glob rule at build start; it stops as BLIND unless a planted field is reported |
| `engine-bundle.ts` | mirrors the engine on every dev start and build, writing only what differs, then checks the copy |

Every caller moved in the same change: the `package.json` scripts, both desktop workflows (CI now fails a stale
committed `prepaint.js`), ESLint, `docs/PACKAGES.md`, the guides and `PROJECT-CONTEXT.md`.

Parity was measured before the old files went:
- the 41-file bundle identical to `sync-cli.mjs`'s, every SHA-256;
- `prepaint.js` differing only in its header line;
- the same two config plants refused with identical messages.

Eight plants were each watched. An unsigned local `tauri build` produced an MSI whose File table matched the published
1.3.0 MSI's. **The tag run proved the release half:** the plugins ran inside `beforeBuildCommand`.

### 3. `desktop-v1.3.1` (D50; P6.release-1.3.1)

- **The cascade (`2c5d98e`).** `desktop/package.json`, `tauri.conf.json`, `Cargo.toml` and `Cargo.lock` moved to
  `VERSION` 1.3.1 (O2'). The app now reports the version in its manifest (`__APP_VERSION__`) in place of a literal
  fallback of `1.2.0`, so 1.3.0 had labelled every analytics event and crash report 1.2.0.
- **The kit, `../release-kit-1.3.1/`**, built on 1.3.0's:
  - a preflight that reads the preconditions at the blessed commit, never the working tree;
  - the tag message and the release body, brought up to round 16's fixes before the tag;
  - the fill, site, docs and updater-proof drivers.
- **GATE 4 round 16 (on `2c5d98e`): NOT CLEAN.** It was the first full sweep of every screen and Settings tab since
  round 7, and found six divergences, every one older than the cascade:
  - D-68: the status bar's version was not in the mono face;
  - D-69: the Privacy tab carried the Consent notice's words;
  - D-70: Run's hero band was `band-tight`;
  - D-71: Home's schedule note sat under the switch;
  - D-72: the DUMMY flagged section 22 `dev`;
  - D-73: a URL axis was dropped by the boot pass.

  All six were fixed in `5dde309`: the app brought to the dummy, which owns words and layout, and the dummy's seed
  corrected for D-72.
- **GATE 4 round 17 (on `5dde309`): CLEAN**, recorded in `9a17266`. Its two observations were settled there:
  - Home's 2 px slider margin is declared `prototype`;
  - the app-only no-keys sentence joined the dummy (`settings.html?nokeys=1`), checked in the automation browser.
- **Tag and publish.** The preflight passed against `BLESSED=5dde309`, and the tag went on `5dde309`.
  `desktop-release` run 36236930943 printed the Supabase line and the plugins' lines. The draft had six assets. The fill
  driver refused nothing: `latest.json` read 1.3.1, the MSI's 42 files matched 1.3.0's name for name, and both
  installer hashes were recomputed locally. Published `--latest` at 10:59:33Z.
- **The site (O3').**
  - The driver ran dummy first (amendment 27); gates green; `bba91b6` + `8f07f0d`.
  - Render-checked at 1440 and 390, stamped, deployed.
  - The origin byte-equal to the build.
  - The hydrated release words equal to the dummy's, while the same instrument failed on the pre-deploy origin.
- **The docs.** `llms.txt` names `desktop-v1.3.1` (`a04713d`); the build was render-checked, Pages deployed, and the
  live site equals the Pages artifact.
- **The updater proof**, by round 17's agent (`../gate4-evidence/updater-1.3.1/`):
  - It ran on an isolated `WEBVIEW2_USER_DATA_FOLDER`.
  - Its no-press rehearse found the two-wire guard blind on the installed build. The main session chose to run
    `update` and `beacons` with a watch-only IPC recorder, as the 1.2.0 and 1.3.0 proofs ran unguarded.
  - `update` PASS: *"Version 1.3.1 is ready"*, one press, NSIS relaunched the app on the isolated profile, HKCU 1.3.1
    at +6.5 s, the installed engine VERSION 1.3.1 in 41 files with the team line, every engine vector `--list --json`.
  - `beacons` PASS: `app_version 1.3.1` in GA4 and Amplitude, 0 undisclosed hosts, 0 personal data, and Clarity's
    script and pixel refused.
  - The owner's profile read 1,354 files before and after every mode.

### Found while checking the live site - fixed and deployed

- **The home hero's installer note** had read *windowsweep_1.1.0_x64-setup.exe · 2,520,200 bytes · released
  2026-09-07* since `desktop-v1.2.0`. No kit moved it, and parity stayed clean because the dummy and the app agreed on
  stale facts. It was fixed dummy first (amendment 28), and `vite/release-strings.ts` (e) now holds it to the release
  baked in `download.ts`. That was watched failing on two plants (`a57a354`, `175d8cc`).
- **The site's CSP** refused gtag's sampled `/td` image pixel on `www.googletagmanager.com`: one console error in
  eight live loads. `img-src` now carries `https://*.googletagmanager.com`, as Google's documented policy sets it
  (`e01bf4f`). There were 24 clean live loads after.

### D51, and the records

- **D51:** the stray `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs$RUNID` folder. Its three files were listed with
  their SHA-256 (`../gate4-evidence/stray-runs-RUNID/listing.txt`), then it was deleted. `EBWebView` and `runs\` read
  the same after.
- **Records brought to the release:**
  - the tracker, `PENDING-TASKS.md` (TASK-020), DONE-019's tag-run proof;
  - `docs/runs-and-releases.md`, GATE4-REPORT's §updater, content-map question 7;
  - the guide pair's invariants 2, 3, 5 and 10, `PROJECT-CONTEXT.md`, MANUAL-TASKS row 31;
  - the root planning files - the inventory split verbatim under its 500-line ceiling;
  - `docs/DONE-TASKS.md`, over its ceiling since DONE-018 - DONE-001 to DONE-012 moved verbatim to
    `docs/DONE-TASKS-001-012.md`, both splits proved lossless with a planted drop named;
  - the kit's run record and the memory note.
- **The portfolio refresh (RW-055) is deferred to 2026-10-02 by its own rule:** no refresh within 3 days of the last.

## Files created or modified (by area; every commit is in the repositories' logs)

- **product:** `desktop/.husky/pre-commit`, `desktop/vite/*.ts` (three new), `desktop/vite.config.ts`,
  `vitest.config.ts`, `eslint.config.js`, `package.json`, the manifests, `src/lib/config.ts`, `theme.ts`, `store.ts`,
  the Settings, Shell, Run and Home components, the catalogues, `design/windowsweep-click-dummy/seed.js` and
  `page-settings.js`, `design/AMENDMENTS-3.md`, `design/gate4/` (rounds 16 and 17, the index), both workflows, and the
  records listed above.
- **web:** `.husky/pre-commit`, the release strings (dummy and app), `home.json`, `vite/release-strings.ts`,
  `firebase.json`, `design/AMENDMENTS-2.md`, the guide pair, `public/sitemap.xml` and `public/feed.xml`.
- **docs:** `.husky/pre-commit`, `static/llms.txt`.
- **root:**
  - `release-kit-1.3.1/`
  - `gate4-evidence/`: `round16/`, `round17/`, `task019/`, `nokeys-amendment/`, `stray-runs-RUNID/`, `updater-1.3.1/`
  - `site-evidence/deploy-checks/`
  - the planning files, `README.md`, the root guide pair
  - the new `what-this-project-consists-of-cli.md`

## Reference documents

- `../release-kit-1.3.1/README.md`: the release order, the run and three notes for the next kit.
- `desktop/design/gate4/rounds/round-16.md` and `round-17.md`, and `GATE4-REPORT.md` §updater.
- `docs/runs-and-releases.md` (2026-09-26), `PENDING-TASKS.md` (TASK-020), and the tracker's `knownRisks` (the guard
  finding).

## Current status (2026-09-26, at the end of the session)

- **Heads:** product at this record's commit on `main`, web `e01bf4f`, docs `a04713d`, root on `project-root`. All
  pushed and clean, apart from the owner's untracked `assets/logo/windowsweep-mark.png` in the product repo, which an
  agent never commits.
- **Releases:** `desktop-v1.3.1` is Latest and installed here; npm `windowsweep@1.3.1`.
- **Sites:** the site and the docs are live and verified.
- **Nothing left running:** no agent, dev server, preview server or browser from this session.

## Next steps, in the order they unblock

1. **Row 31's follow-up**, only when the owner says it is done:
   - read his `user_settings` and `runs` rows over the Management API (the FilesHub vault's token, Supabase id 15);
   - read-only SELECTs, counts and verdicts only, into `../site-evidence/row31/`;
   - confirm no path, drive label, host, user name or machine name.
2. **TASK-020, D52:** widen the desktop CSP for Clarity and Tag Manager's pixel, and prove the replay masked on the
   wire under `tauri dev`, isolated. Then ask the owner when to cut the next desktop release, from a kit built on
   `../release-kit-1.3.1/`.
3. **RW-055**, the portfolio refresh, on or after 2026-10-02: it records `desktop-v1.3.1`.
4. **The second machine:** row 20, RW-064/065/066, the P1 rows, then CLI 1.4.0.

## Technical notes

- 🔴 **The two-wire guard guards `tauri dev` only.** On an installed build WebView2 answers `http://ipc.localhost`
  before the DevTools Fetch domain sees it. A proof there presses only its one named control and records the IPC with
  the Network domain (the tracker's `knownRisks`, invariant 5).
- **This shell layer collapses `\\` inside heredocs.** A driver whose anchors hold backslashes is written with the
  Write tool and fed on stdin. Two edits refused on it and wrote nothing, because every driver refuses before writing.
- **Hosting `cleanUrls: true` answers 301 for `/x/index.html`.** Compare the origin through the clean URL. Docusaurus
  with `trailingSlash: false` writes `desktop.html`, not `desktop/index.html`.
- **The site's installer buttons, feed dates and hero link are drawn after hydration.** Check words on the hydrated
  page (`innerText` and `href`s), never the prerendered HTML.
- **Two traps from the proof itself:**
  - the updater relaunches through the installer's `/R`, not `plugin:process|restart`;
  - amplitude-ts sends `app_version`, not `version_name`.

## Session metrics

19 commits this session: product 6 (this record's included), web 6, docs 2, root 3 (the last one closes the session),
notebook 2 (the baseline line and its merge). Regenerate with `git log --oneline --since=2026-09-26T12:00` in each
repository (earlier the same day belong to the sessions before this one: product `0f52955` and `56249d4`, web
`09547e2`, root `51cbdc9` and `2917de4`). Totals:
- 1 release (`desktop-v1.3.1`) and 3 site deploys;
- GATE 4 rounds 16 and 17, and 1 updater proof;
- owner decisions D50, D51 and D52;
- 1 new task (TASK-020).

## Continuation prompt

```text
Continue windowsweep at D:\work\windowsweep-root. Start in windowsweep/ (its CLAUDE.md is the entry point). You may
run up to 4 custom aoneahsan-ccca-* subagents - a ceiling, not a target: check CPU, RAM and swap before every
dispatch, give each a pairwise-disjoint EXCLUSIVE SCOPE, keep hot files main-only; agents never commit, push, deploy
or publish.

Read first, by section: windowsweep/docs/work-history/2026-09-26-WH012-hook-line-task019-desktop-v131-released-and-proved.md
(this record), the tracker's resumeInstructions (windowsweep/docs/features/windowsweep-completion/00-tracker.json),
../remaining-work-summary.md, and windowsweep/PENDING-TASKS.md (TASK-020). D1-D52 are in
windowsweep/docs/PROJECT-CONTEXT.md - apply them, never re-ask.

Verify the state before acting: the three repos clean and in sync (product remote `o`, web and docs `origin`); CI
green at each head; releases/latest/download/latest.json = 1.3.1; npm windowsweep = 1.3.1; the installed app 1.3.1
(HKCU, Get-ItemProperty); the site and docs answer 200.

Then, in order:
(1) When I say row 31 is done, read my synced rows back over the Management API (read-only; counts and verdicts only)
    and confirm they hold no path, drive label, host, user name or machine name.
(2) TASK-020 - D52: widen the desktop CSP for Clarity (and Tag Manager's image pixel) and prove on the wire, under
    tauri dev on an isolated profile, that a replay starts with every text node masked; then ask me whether to cut
    the next desktop release, and if yes run it from a
    new kit built on ../release-kit-1.3.1/ (its README's three notes; preflight first; O2'; a GATE 4 round under
    tauri dev until CLEAN; publish --latest; the updater proof with the watch-only recorder; the site and the docs
    under O3'; a render-checked build before every hosting deploy).
(3) On or after 2026-10-02: RW-055, the portfolio refresh, in both locations.
Record everything in the tracker and the records, then write WH013.

Never: a real cleanup run (dry-runs only), my own Chrome, a production DB change without my yes, git stash,
--force/--admin, an AI attribution line, committing assets/logo/windowsweep-mark.png or my notebook edits.
```

## Document history

| Date | Change |
|---|---|
| 2026-09-26 | Written at the end of session 18, after the release, its proofs and the records landed |
