# WH011 - the v5 run: /terms, sign-in live, desktop-v1.3.0 and CLI 1.3.1, the team voice, parity CLEAN, and the pause

| | |
|---|---|
| Date | 2026-09-24 to 2026-09-26 (paused just after midnight) |
| Task id | WH011 (session 17: the v5 audit, then plan v5's waves W0-W5) |
| Duration | one long session across several compactions, with custom agents (D35: three at once, then D43: four) |
| Status | **paused at a safe point** - every release out, the site CLEAN, the records written; open: the fleet hook line, TASK-019, the next desktop release (the owner's call), owner rows, the second machine |
| Project | windowsweep (`D:\work\windowsweep-root\` - the product repo, the docs site, the marketing site) |
| Developer | Ahsan Mahmood (owner) |

## Executive summary

The owner's audit prompt of 2026-09-24 found the 2026-09-17 execution unrecorded and every record behind; he asked
for a Terms page first (for the Google consent screen), then the audit, plan v5, and its execution with up to four
custom agents. All of it landed. `/terms` went live first. Google sign-in went live on the site and was verified as a
person. The desktop app gained cloud sync (TASK-013), was cascaded to 1.3.0 and released as **`desktop-v1.3.0`**
(Latest, sign-in live) after three GATE 4 rounds, and the installed 1.2.0 on this machine **updated itself** to it.
**CLI 1.3.1** shipped the team's maker lines. The owner's new fleet rule - products speak as **the windowsweep team**,
never one person - ran through the story pipeline onto every surface. D37's package baseline landed on all three
repositories. Site parity round 6 found one defect (S-29) and **round 7 came back CLEAN**. Two owner decisions late in
the run (D47, D48) closed the last open questions; TASK-017's migration went to production and was proved both ways,
and RW-134 exercised the desktop's account deletion live. Forty-eight owner decisions are recorded (D1-D48).

## Starting point

- 2026-09-24: CLI 1.3.0 on npm, `desktop-v1.2.0` Latest and installed here; the site live without sign-in (Google
  off, `external.google: false` until the owner enabled it that morning, D25); site parity round 5 had run on
  2026-09-17 and was never recorded; the records described the pre-2026-09-17 state.
- Method on arrival: plan v4 (executed); written this session: `../completion-plan-v5-2026-09-24.md`.

## Work completed, wave by wave

### Terms first, the auth URLs, the audit (2026-09-24)
- `/terms` through the story pipeline (row 20, a legal safety surface; D31-D34), dummy first, deployed (web `b78fa7f`,
  `74644c8`). Supabase auth `site_url` and allow-list set and read back (D28).
- The audit records and plan v5 (the four root planning files, the guides, both project contexts, the tracker).

### W1-W2 - the site (2026-09-24/25)
- S-25 (the error page's own head) and sitemap `lastmod` from git (RW-130) (web `57d93a9`); sign-in live with TASK-007
  and a fail-closed probe (`d72b40c`, `7e227e1`); RW-116 verified as a person - contact, account, deletion, admin
  (`53263e1`, web `2a39221`); Google's own page refused the automated browser, so that path is web row 4.

### W4 - the desktop (2026-09-25)
- TASK-013 sync built dummy first (`d0977c1`, `1edd900`, `0eb2b68`) and verified live in its own browser profile
  (DONE-016); `SUPABASE_ENABLED` and the two variables set after it (O6'); the cascade to 1.3.0 (`d3475bc`).
- GATE 4 round 13 CLEAN; the team-voice change (D44-D46: `8f3a03f`, `bd1b7cd`, docs `4b18660`, web `8ed047c`);
  round 14 found D-66 and D-67 (older Settings items) -> D47 ("Keep it, add to dummy") -> fixed dummy first (`5934008`)
  -> round 15 CLEAN.
- **`desktop-v1.3.0`** tagged on `5934008` (the blessed commit), built with the Supabase pair exported after the live
  `external.google` probe, published `--latest`; the updater proof moved the installed app 1.2.0 -> 1.3.0 (HKCU after
  3 s) and the signed-out first boot reached only the telemetry hosts (`d20cd44` records it).
- **CLI 1.3.1** (`c04216f`, merged `25ee559`): the full publish gate, byte-identical from the registry, GitHub release
  `--latest=false`. The site (`3248b4e`, `040beb4`; a feed sort that reversed same-day releases fixed) and the docs
  (`037a061`) followed, O3' kept.

### D37 - the package baseline (2026-09-25)
- Web `67cc407`; desktop `cb07b74` (merged `e2fe23b`), a behaviour-neutral prettier pass `1d6e458` (every built JS and
  CSS asset byte-identical), CI unit tests `cdb5286`; docs `ce19db0`. Husky lives in `desktop/package.json`, never the
  root (the published package). Every hook runs `lint-staged --no-stash`; `deps:update` rejects typescript.

### W3 - parity (2026-09-25)
- Round 6 (web `rounds/round-06.md`): complete, NOT CLEAN on **S-29** - TanStack Router marks every active link
  `aria-current="page"` after `activeProps`. Fixed in `src/components/ui/SiteLink.tsx` (web `486d650`):

```tsx
const linkProps = useLinkProps({ to: to as never, /* hash, className, onClick */
  ...(markCurrent ? { activeOptions: { exact: true, includeHash: false } } : {}) });
return markCurrent ? <a {...linkProps}>{children}</a>
  : <a {...linkProps} aria-current={undefined} data-status={undefined}>{children}</a>;
```

  with a `no-restricted-imports` rule refusing a raw `Link` (watched failing on a plant). **Round 7 CLEAN** (web
  `0cbfb60`): S-29 closed on all 102 page-states; S-32 declared.

### The last decisions and checks (2026-09-25/26)
- **TASK-017 (D48)**: the site sends `status` alone (`486d650`), then `20260925154905_stamp_contact_request_handled.sql`
  (a BEFORE UPDATE trigger stamping `now()` / `auth.uid()`, EXECUTE closed per function, the grant narrowed to
  `status`) applied with `supabase db push --linked`; `site-evidence/task017/` saw the old schema before and passed
  10/10 after; the live triage and Undo on top (DONE-018, `cf0e577`).
- **RW-134**: the desktop frontend's Delete account, one real press, every table 1 -> 0 (`c05c4bd`).
- **TASK-018** closed without new words (DONE-017, `9e0a488`); **TASK-019** filed (the `desktop/scripts/*.mjs`
  generators, against the house no-scripts rule).

## Files created or modified (by area; every commit is in the three repos' logs)

- Product: `desktop/src/**` (sync, sign-in, Settings' About panel, History's empty state), `desktop/design/**` (the dummy,
  `AMENDMENTS-2.md` closed at 493 lines, `AMENDMENTS-3.md` opened), `desktop/supabase/migrations|rollbacks/**`,
  `lib/`, `modules/`, `windowsweep.ps1` (1.3.1), `.github/workflows/desktop-*.yml`, `docs/**` (PROJECT-CONTEXT D25-D48,
  runs-and-releases, project-history, DONE-TASKS, MANUAL-TASKS, story/**), the tracker, both guides.
- Web: `src/**` (sign-in, S-25, S-29, TASK-017), `design/**` (the dummy, amendments 21-26, rounds 5-7), `vite/**`,
  `docs/**`, both guides. Docs: `docs/**` mirrors, `docusaurus.config.ts`, `static/llms.txt`, the baseline files.
- Outside git: the four root planning files, `release-kit-1.3.0/`, `gate4-evidence/`, `site-evidence/`; the notebook
  (portfolio, master links, the fleet baseline and storytelling notes); the memory note.

## Reference documents

`../../../completion-plan-v5-2026-09-24.md` (the method) · `../features/windowsweep-completion/00-tracker.json` (status)
· `../PROJECT-CONTEXT.md` (D1-D48) · `../runs-and-releases.md` · `../../PENDING-TASKS.md` · `../MANUAL-TASKS.md` ·
`../../../remaining-work-summary.md` (94% / 99%) · `../../../release-kit-1.3.0/README.md` (the release template).

## Current status (2026-09-26, at the pause)

Heads: product `windowsweep` at the pause commit on `main`, web `0cbfb60`, docs `ce19db0`; all pushed, clean (only the
owner's untracked `assets/logo/windowsweep-mark.png` in the product repo, never committed by an agent). Latest release
`desktop-v1.3.0`; npm `windowsweep@1.3.1`; the site and the docs live and verified. No agent, dev server, browser or
background command of this session is running (checked: no listener on 5972-5976, 9336-9342, 9588-9598).

## Next steps, in the order they unblock

1. **The fleet hook line.** Another session moved the baseline to `yarn lint-staged --no-stash --relative
   --max-arg-length 8000` (notebook `00a0d3e5`, 2026-09-25) after a 91-file commit hit Windows' 8,191-character
   command-line cap. The three `.husky/pre-commit` files here still read `--no-stash` alone; each takes the two flags
   and is watched running on a real commit.
2. **TASK-019** (`PENDING-TASKS.md`): move the three `desktop/scripts/*.mjs` generators into `desktop/vite/` plugins
   or plain `package.json` commands, every caller in the same change (both desktop workflows, `docs/PACKAGES.md`),
   each generator watched failing on a plant.
3. **Ask the owner** whether to cut the next desktop release now (it would carry D37's desktop half, TASK-018 and
   TASK-019): the cascade to `VERSION` 1.3.1 (O2'), a new kit from `release-kit-1.3.0/`, GATE 4 round 16 with the
   two-wire guard (History's empty states in scope), the updater proof 1.3.0 -> 1.3.1, then the site and docs (O3').
4. **Row 31 follow-up** once the owner has signed in: read his `user_settings` and `runs` rows over the Management API
   and confirm no path is in them.
5. The second machine (row 20, RW-064/065/066, P1, then CLI 1.4.0).

## Technical notes

- Every trap met is in the memory note and the rules: the two-wire IPC guard; an isolated `WEBVIEW2_USER_DATA_FOLDER`;
  the updater proof stops every `windowsweep-desktop` process; tag the desktop before merging a CLI cascade; Git Bash's
  grep strips CRs; a tailed diffstat hides the first files; the router's automatic `aria-current`; `ncu -u` overrides
  tilde pins; a verification driver inheriting another driver's audit rows.
- New fleet rules of 2026-09-25 that bind the next session: a hosting deploy needs a render-checked build and the live
  URL seen (`deploy-verification.md`, a PreToolUse gate); every agent dispatch checks CPU, RAM and swap first
  (`aoneahsan-cccs-resource-aware-dispatch`); D21 (one writer) is the standing default - D35/D43 were for this run.

## Session metrics

62 commits from 2026-09-24 to the pause - product 36 (this record's included), web 19, docs 7; regenerate with
`git log --oneline --since=2026-09-24T00:00 | wc -l` in each repository · 2 releases (`desktop-v1.3.0`, CLI 1.3.1) ·
1 production migration · GATE 4 desktop rounds 13-15, site parity rounds 5 (recorded), 6 and 7 · 1 updater proof ·
2 live verifications as a person (RW-116, TASK-013) plus TASK-017 and RW-134 · owner decisions D25-D48.

## Continuation prompt

```text
Continue windowsweep at D:\work\windowsweep-root. Start in windowsweep/ (its CLAUDE.md is the entry point). You may
run up to 4 custom aoneahsan-ccca-* subagents - a ceiling, not a target: check CPU, RAM and swap before every
dispatch, give each a pairwise-disjoint EXCLUSIVE SCOPE, keep hot files main-only; agents never commit, push, deploy
or publish.

Read first, by section: windowsweep/docs/work-history/2026-09-26-WH011-v5-run-releases-sign-in-team-voice-parity-clean-pause.md
(this record), the tracker's resumeInstructions (windowsweep/docs/features/windowsweep-completion/00-tracker.json),
../remaining-work-summary.md, and windowsweep/PENDING-TASKS.md. D1-D48 are in windowsweep/docs/PROJECT-CONTEXT.md -
apply them, never re-ask.

Verify the state before acting: the three repos clean and in sync (product remote `o`, web and docs `origin`); CI
green at each head; releases/latest/download/latest.json = 1.3.0; npm windowsweep = 1.3.1; the site and docs answer 200.

Then, in order:
(1) The fleet hook line: windowsweep/desktop/.husky/pre-commit, windowsweep-web/.husky/pre-commit and
    windowsweep-docs/.husky/pre-commit move to `yarn lint-staged --no-stash --relative --max-arg-length 8000` (the
    baseline since notebook 00a0d3e5), each watched running on a real commit.
(2) TASK-019: the desktop/scripts/*.mjs generators leave the scripts folder (Vite plugins or plain package.json
    commands), every caller moved in one change, each watched failing on a plant, gates green.
(3) Ask me whether to cut the next desktop release now. If yes, run it from a new kit built on ../release-kit-1.3.0/
    (preflight first; O2' - the tag on a commit where desktop/package.json, tauri.conf.json and VERSION agree; GATE 4
    round 16 with round 12's two-wire guard until CLEAN; publish --latest; the updater proof 1.3.0 -> 1.3.1 and the
    beacons; the site's download page and the docs with no site deploy in between; a render-checked build before
    every hosting deploy).
(4) When I say row 31 is done, read my synced rows back over the Management API and confirm they hold no path.
Record everything in the tracker and the records, then write WH012.

Never: a real cleanup run (dry-runs only), my own Chrome, a production DB change without my yes, git stash,
--force/--admin, an AI attribution line, committing assets/logo/windowsweep-mark.png or my notebook edits.
```

## Document history

| Date | Change |
|---|---|
| 2026-09-26 | Written at the pause, after round 7 came back CLEAN and the close-out records landed |
