# WH013 - the desktop sign-in fixed, and `desktop-v1.3.2` released and installed

| | |
|---|---|
| Date | 2026-09-28 |
| Task id | WH013 (session 19: D53 - the owner's row 31 failed on 1.3.1; "release new version now") |
| Duration | one session; one custom agent at a time (`aoneahsan-ccca-test-engineer`: the 1.3.2 proofs, GATE 4 round 18, the proof-C re-run, the updater proof), each dispatch after a CPU, RAM and swap check (D21) |
| Status | **complete for this session** - the fix released and installed; row 31 is the owner's to run on 1.3.2 |
| Project | windowsweep (`D:\work\windowsweep-root\` - the product repo, the docs site, the marketing site, the root repo) |
| Developer | Ahsan Mahmood (owner) |

## Executive summary

The owner signed in on the installed 1.3.1 (row 31) and got *"the sign-in reply did not match the request that
started it"*, as on 1.3.0. The cause was proved read-only before any edit: `desktop/src/lib/auth.ts` made a state and
handed it to the Rust loopback listener but sent it nowhere, so every reply was refused - in every release since the
move from Firebase (`62a3c5b`, 2026-09-05). `auth.flow_state` held his three attempts, each with a code issued and
never exchanged. Supabase Auth v2.197.0's own source showed the way: it accepts any loopback redirect and keeps
`redirect_to`'s query when it adds `code`, so the state now rides inside the redirect address (DONE-021).

The same release closed TASK-020 (D52) and two gaps found while planning it:
- the Clarity mask sat on `#root`, which React Aria's portals escape, so it moved to `<body>`;
- the Sentry DSN's `ingest.us` host was never in the CSP, and every crash report had been refused - proved on the
  installed 1.3.1.

The proofs found two more: Amplitude's remote-config fetch (turned off in code rather than admitted, because it can
switch autocapture on) and an empty run folder per engine call (DONE-022). A planning discovery changes the GATE 4
method for good: **`tauri dev` applies no CSP**, so a round cannot judge one.

Round 18 came back CLEAN on `c530312`. CLI 1.3.2 was published (version only - the engine is 1.3.1's, file for file,
because the desktop and `VERSION` must keep one number). `desktop-v1.3.2` went out as Latest, and the in-app updater
moved this machine to 1.3.2. The site and the docs followed, and two shipped claims the proofs had falsified were
corrected.

## Starting point

`desktop-v1.3.1` Latest and installed; TASK-020 decided (D52) and unbuilt; row 31 failing on the owner's machine; the
continuation prompt of WH012.

## Work completed

1. **The diagnosis, read-only** - `auth.ts:85-87` against `oauth.rs:101`; `git show 5f2bc84` (the Firebase flow put the
   state on Google's address); `auth.flow_state` read over the Management API; a probe of four `redirect_to` forms and a
   planted foreign host (the referrer column reflects validation); GoTrue v2.197.0's `IsRedirectURLValid`,
   `prepPKCERedirectURL` and `redirectErrors`; Tauri 2.11.5's `get_app_url` and `protocol/tauri.rs` (no CSP in dev).
2. **The fix and TASK-020** - `6d232e5` (with the cascade to 1.3.2) and `c530312` (the proofs' findings):
   `oauth-redirect.ts` + its test, `oauth.rs` (`classify`, the wait that ignores strays, the blocking pool), the CSP,
   the `<body>` mask, `remoteConfig.fetchRemoteConfig: false`, `rundir.rs` + `engine.rs` + `lib.rs` (DONE-022),
   `desktop.md`'s two corrected sentences, the CHANGELOG bullet with its reason. Every new test watched failing on a
   plant (the 1.3.1 redirect; two listener plants; a `remove_dir_all` prune).
3. **The proofs** - `../gate4-evidence/signin-1.3.2/` (the sign-in leg, 22 checks), `../gate4-evidence/task020/` (the
   1.3.1 baseline refusing Clarity and every Sentry envelope; the mask with both portals; the CSP on a
   production-protocol debug build, then again on `c530312` with 0 violations).
4. **GATE 4 round 18** - CLEAN on `c530312` (`c061810`): the full sweep, the sign-in leg, the mask, the leak scan five of
   five, and TASK-022 on the owner's own app data (271 empty day-old folders removed, 102 non-empty byte-identical).
5. **The releases** - `../release-kit-1.3.2/` (preflight 71 checks, twice): CLI 1.3.2 through the full npm gate from a
   clean worktree of `c530312`; `v1.3.2` `--latest=false`; `desktop-v1.3.2` tagged, built (run 36418772799), filled,
   published `--latest`.
6. **The install** - the updater proof (`../gate4-evidence/updater-1.3.2/`): one press, HKCU 1.3.2 at +6.7 s; the first
   boot with the desktop's first replay, masked; 0 violations, 0 personal data.
7. **The site and the docs** - web `197cbeb`, `b38ed14` (both halves of the release gate, the home note, `desktop132` and
   `cli132`, the `desktop130` correction, amendment 29), render-checked, deployed, live-checked; docs `4aafc01`
   (`llms.txt`, `TOOL_VERSION`, the mirrors, `static/favicon.ico`), Pages green, live equal to the artifact.
8. **The records** - this file, the tracker, `PROJECT-CONTEXT.md` (D53; the D28 line corrected), `runs-and-releases.md`,
   `DONE-TASKS.md` (DONE-020 to 022), `PENDING-TASKS.md` (TASK-023), `MANUAL-TASKS.md` row 31, the guide pair, the story
   decision log and content-map question 7, and the root files.

## Current status

- **Heads:** product at this record's commit on `main`, web `b38ed14`, docs `4aafc01`, root on `project-root`. All pushed
  (the product and docs pushes printed `Bypassed rule violations for refs/heads/main`), apart from the owner's untracked
  `assets/logo/windowsweep-mark.png`, which an agent never commits.
- **Releases:** `desktop-v1.3.2` is Latest and installed here; npm `windowsweep@1.3.2`.
- **Nothing left running:** no agent, dev server, preview server or browser from this session.

## Next steps, in the order they unblock

1. **Row 31**, the owner's: sign in on the installed 1.3.2, then one dry-run. Then the read-back - his `user_settings` and
   `runs` rows, read-only, counts and verdicts only, into `../site-evidence/row31/`. If it fails, read that attempt's
   `auth.flow_state` row first.
2. **TASK-023**, low: how a development build reports its analytics.
3. **RW-055** on or after 2026-10-02: the portfolio records `desktop-v1.3.2` and corrects its sign-in line.
4. **The second machine** (`../remaining-work.md` section 11).

## Technical notes

- 🔴 **Supabase never forwards a client's `state`.** A native app that checks one must carry it inside `redirect_to`;
  GoTrue keeps that query on both the success and the error redirect.
- 🔴 **`tauri dev` applies no CSP.** Every CSP claim needs a production-protocol build (`yarn tauri build --debug
  --no-bundle`) or the installed app, watch-only.
- 🔴 **React Aria portals render into `<body>`.** A mask, a theme scope or a style boundary on `#root` misses every
  dialog, popover and tooltip.
- **The npm tarball carries the working copy's line endings.** The published 1.3.1 held four LF-only lines in
  `runner.ps1`; a fresh checkout is CRLF per `.gitattributes`. The regression diff must normalise before it calls a
  file changed.
- **`SHA256SUMS.txt` is written with CRLF by the Windows runner.** `sha256sum -c` reads each name with a trailing CR.
  PowerShell's `Get-FileHash`, the documented path, is unaffected. Worth an LF write in the workflow next time.
- **A Bash-quoted `node -e` turns `\t` into a TAB.** It mangled `%SystemRoot%\System32\tar.exe` in a record; the
  control-character sweep caught it.

## Session metrics

Commits: product `6d232e5`, `c530312`, `c061810` and this record's; web `197cbeb`, `b38ed14`; docs `4aafc01`; root - the
kit and evidence commit. Regenerate with `git log --oneline --since=2026-09-28` in each repository. Totals:
- 2 releases (CLI 1.3.2, `desktop-v1.3.2`) and 1 site deploy;
- GATE 4 round 18, 1 updater proof, and 4 proof runs;
- owner decision D53;
- 3 tasks closed (DONE-020 to 022) and 1 filed (TASK-023).

## Continuation prompt

```text
Continue windowsweep at D:\work\windowsweep-root. Start in windowsweep/ (its CLAUDE.md is the entry point). One custom
aoneahsan-ccca-* agent at a time (D21) - check CPU, RAM and swap before every dispatch, give it an EXCLUSIVE SCOPE,
keep hot files main-only; agents never commit, push, deploy or publish.

Read first, by section: windowsweep/docs/work-history/2026-09-28-WH013-desktop-signin-fixed-and-v132-released.md (this
record), the tracker's resumeInstructions (windowsweep/docs/features/windowsweep-completion/00-tracker.json),
../remaining-work-summary.md, and windowsweep/PENDING-TASKS.md (TASK-023). D1-D53 are in
windowsweep/docs/PROJECT-CONTEXT.md - apply them, never re-ask.

Verify the state before acting: the three repos clean and in sync (product remote `o`, web and docs `origin`); CI
green at each head; releases/latest/download/latest.json = 1.3.2; npm windowsweep = 1.3.2; the installed app 1.3.2
(HKCU, Get-ItemProperty); the site and docs answer 200.

Then, in order:
(1) When I say row 31 is done, read my synced rows back over the Management API (read-only; counts and verdicts only)
    and confirm they hold no path, drive label, host, user name or machine name. If my sign-in failed, read that
    attempt's auth.flow_state row (the referrer must carry ?state=) and my on-screen text before anything else.
(2) TASK-023: recommend how a development build reports its analytics, and ask me before changing the GATE 4 method.
(3) On or after 2026-10-02: RW-055, the portfolio refresh, in both locations - it records desktop-v1.3.2 and corrects
    its "the first release you can sign in to" line.
Record everything in the tracker and the records, then write WH014.

Never: a real cleanup run (dry-runs only), my own Chrome, a production DB change without my yes, git stash,
--force/--admin, an AI attribution line, committing assets/logo/windowsweep-mark.png or my notebook edits.
```

## Document history

| Date | Change |
|---|---|
| 2026-09-28 | Written at the end of session 19, after the releases, the install, the follow-ups and the records |
