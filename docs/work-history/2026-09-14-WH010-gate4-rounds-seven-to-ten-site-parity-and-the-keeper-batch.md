# WH010 - GATE 4 rounds 7 to 10, the site's first two parity rounds, and the keeper batch

| | |
|---|---|
| Date | 2026-09-13 and 2026-09-14 |
| Task id | WH010 (sessions 14-15, the v3 plan's W0-W6) |
| Duration | two long sessions on Opus 5 (1M context) |
| Status | in progress - W0, W1, W2, W5 and W6 are closed; W3 is closed on the site except its parity round 3; W4 (the desktop release) is held by one open defect |
| Project | windowsweep (`D:\work\windowsweep-root\` - the product repo, the docs site, the marketing site) |
| Developer | Ahsan Mahmood (owner); the sessions on Opus 5 |

## Executive summary

The v3 plan handed an Opus session seven waves and twenty recorded decisions. Six of the seven are done. The
docs site is on HTTPS with its own certificate; account deletion exists end to end and is proved from the
catalogues; the marketing site is prerendered per route, carries three new build gates, and was watched
sending real telemetry on the wire after two genuine defects in that path were found and fixed; every one of
the nineteen story surfaces is written, applied and recorded, which closed P7; and the desktop app went
through **four** GATE 4 rounds, each one fixing what the last found.

The one thing not done is the one the plan called the finish line: **`desktop-v1.2.0` is still a draft**, and
correctly so. Rounds 8, 9 and 10 each found a real defect on the surface the previous round had opened, and
round 10 left D-61 open - Home's ladder and the Run screen still promise the measured total as what a run
would free, where the same run's rehearsal says 1.9 GB. The rule that settles it is decided and written down;
applying it, and one more round, is the first thing the next session does.

## Starting point

- Product `be1907b`, docs `432e343`, web `b4c45a0` - the 2026-09-12 audit commits. The tracker's
  `resumeInstructions` pointed at the v3 plan; twenty owner decisions were in force (D1-D12 in the tracker,
  D13-D20 in the plan).
- Open at the start: the docs site served HTTP only (GitHub's own `*.github.io` certificate); account deletion
  was decided but unbuilt; the marketing site answered every route with the home page's title and canonical,
  returned 200 on unknown paths, and had no analytics keys, no CI and no parity evidence; five story surfaces
  were unwritten or unapplied and the keeper had never recorded a run; `desktop-v1.1.0` was Latest.

## Work completed, wave by wave

### W0 - the docs certificate, the site's keys (`0a64320`, `844d3ae`)

The docs domain was removed and re-added through the Pages API (D18), the certificate was issued within
minutes, `https_enforced` was set, and the navbar gained the `Website` item. `curl -sI` returns 200 with a
`windowsweep-docs.aoneahsan.com` CN. The site's four analytics ids were read from the GitHub repository
variables into a committed `.env` (D9 - the web repo is private).

### W1 - account deletion, proved from the catalogues (`844d3ae`)

`delete_my_account()` is a `SECURITY DEFINER` function with an empty `search_path` that refuses when
`auth.uid()` is null. Its privileges were read back from `pg_proc.proacl` - `authenticated` only, after the
per-function `revoke ... from public, anon, authenticated, service_role`. The cascades were proved by seeding a
throwaway alias and watching all five tables go to zero. Both Account screens carry a typed confirmation,
drawn in each dummy first; `/privacy`'s sentence is now true; `ADMIN-SURFACE.md` §3 closed.

### W2 - the site rebuilt around real files (`377a6f2`, `07aa763`, `85752cc`, `604b39b`, `784b883`)

Every public route is prerendered by a Vite plugin under `vite/` (never a `scripts/` folder), with its own
title, canonical, JSON-LD and a crawlable body; `dist/404.html` is real and the rewrites are narrowed to the
identity and admin routes. Three **new build gates** were added and each was watched failing on a plant that
was verified applied first:

- `vite/catalogue-keys.ts` - an unresolved `t()` key, a missing registry row, or a void element written as a
  container fails the build at its start.
- `vite/release-strings.ts` - the changelog's newest entry, `brand.version`, `footer.licence`, the self-test
  count, and the baked desktop release checked against GitHub's own `latest.json` and each asset's HEAD.
- The prerender's `/contact` and `/signin` assertions - the static file must carry the branch the build's
  sign-in state actually renders.

`784b883` closed a defect the parity rounds found twice: `/account` and the three `/admin` routes were answered
by the rewrite with `index.html`, so they carried the **home page's** title and canonical. Every built route is
prerendered now, each with an honest `noindex` and a self-canonical.

### W3 (site half) - telemetry proved on the wire, and two real defects on the way there

Capturing the first load from the deployed origin found two defects that every gate had been green over:
Clarity's tag was loaded with no queue stub, so every call before it initialised was lost; and every event
fired before a destination registered was dropped rather than queued. Both were fixed on both surfaces
(`07aa763` on the site, `7e78de7` on the desktop). The re-run then showed 212 requests, all four destinations
landing, and **0 of 258 captured phrases** carrying a path, user name, machine name or email.

### W2/W6 (story) - every surface written, applied and recorded (`edc29aa`, `e762f3a`, `809bdd6`, `1bb9fd2`, `ee831e5`)

site-home, site-privacy, site-front-site, site-front (to the docs `intro.md` and `llms.txt`) and site-app - the
last unwritten surface - went through the panel and GATE 4, and each was applied. The keeper batch then
recorded **all nineteen** surfaces with their commits, corrected the content map's row 12, row 19 schema and
question row 7, added the "switch" glossary row, and stamped `run-state.json` `recorded` with 2 open and 27
resolved decisions. **P7 closed.**

### W2/W4 (desktop) - four GATE 4 rounds (`7e78de7`, `8361a48`, `7ae4546`, and the round reports)

| Round | What it found | Where it went |
|---|---|---|
| 7 (`67d2821`) | D-23..D-38: the Picker unreachable, the removal path unconfirmed, two stylesheets and the i18n catalogue over 500 lines, two analytics defects | all fixed in `7e78de7` |
| 8 (`172ce1d`) | D-41/D-42 - History and Report had never been judged **with data**; D-47..D-49 on the removal path round 7 had opened; **D-48 decided**: a Permanent removal confirms first | all fixed in `8361a48` |
| 9 (`f9f67f5`) | D-55..D-59; **D-60 decided**: the Reclaim button states a bound ("up to") or the engine's own rehearsal estimate, never the measured total | all fixed in `7ae4546` |
| 10 (`ed9e3c2`) | D-55 closed, D-60 verified through eight argument states, nothing reopened - and **D-61**: the ladder foot and the Run screen's at-rest rows make the same promise D-60 just closed. D-62 (a 53 px overflow at 760) filed, not blocking | **open** |

Every round proved its own instruments with plants before trusting a number. Ten rounds of evidence -
1,081 PNGs - are in `D:\work\windowsweep-root\gate4-evidence\`.

### W3 (site half) - the first two parity rounds

Round 1 judged 84 pairs and came back with 22 findings, four of them in the chrome every page inherits; all 22
were fixed (`2241118`). Round 2 re-judged everything: **6,504 of 6,504 words matched**, 2,394 of 2,394 focus
stops ringed, 0 contrast / overflow / small-text / touch-target failures, 68 of 84 pairs pixel-identical, every
plant red - and three blockers its sharper instruments could now see (S-16 the footer under the glow at 4.25:1,
S-18 the nav sheet, D-03 the dummy's `|| 0.7` radius preview), plus S-17 as a decision.

### W5 - the records write-back (`c0e89c8`, `1bb9fd2`)

`package.json`'s `homepage`, both public repos' GitHub homepage and description, the README's `Website` link,
the docs navbar, the master links JSON and the palette registry's `domain` all name
`https://windowsweep.aoneahsan.com`. MANUAL-TASKS row 24 closed as never needed; the web repo's GATE 1 row
closed.

## Files created or modified

Twenty-one commits on the product repo, eleven on the marketing site, three on the docs site - listed above
with what each carries. The files worth naming for the next session:

- `windowsweep/docs/story/decision-log.md` - D-48, D-60, **D-61** (2026-09-14) and D-62.
- `windowsweep/desktop/src/components/SafeRunLadder.tsx`, `RunScreen.tsx` and the desktop dummy's
  `home.html` / `run.html` - where D-61 lands.
- `windowsweep-web/vite/{catalogue-keys,release-strings,prerender,prerender-pages,prerender-content}.ts` - the
  site's build gates and the prerender.
- `D:\work\windowsweep-root\release-kit\` (outside git) - `README.md` (the 11-step order),
  `release-body-1.2.0.md`, `updater-proof.mjs`, `docs-release-1.2.0.mjs`, `site-release-1.2.0.mjs`.
- `D:\work\windowsweep-root\remaining-work.md` - RW-101, RW-103, RW-109 and RW-117 carry 2026-09-14 evidence;
  ten closed specs moved into §5.

## Current status

| Wave | State |
|---|---|
| W0 docs HTTPS, site keys | closed |
| W1 account deletion | closed |
| W2 site, desktop, story | closed |
| W3 site telemetry + verification | closed except parity **round 3** |
| W4 desktop-v1.2.0 | **held** - D-61 open, so no round has been clean |
| W5 records write-back | closed |
| W6 keeper batch | closed - P7 closed |
| W7 close-out | this record and the tracker; the rest listed below |

## Next steps, in the order they unblock

1. **Apply D-61 and D-62** (the decision is in `docs/story/decision-log.md`, 2026-09-14). Dummy first: the
   ladder's per-section rows and total, and the Run screen's at-rest rows, carry the rehearsal's own numbers
   after a rehearsal and are worded "up to" before one; a figure describing what **is there** keeps its
   measured number. The dummy gains the gated state its seed cannot show.
2. **GATE 4 round 11**, limited to Home's ladder, the Run screen at rest, and the 760 px target table.
3. **The moment a round is clean, cut `desktop-v1.2.0`** exactly as `D:\work\windowsweep-root\release-kit\README.md`
   lists it - delete the stale draft and its tag, re-tag the blessed commit, publish `--latest`, prove the
   updater on this machine's installed 1.1.0, capture the first-boot beacons, then run `docs-release-1.2.0.mjs`
   and `site-release-1.2.0.mjs` and deploy the site. The site's release gate **fails the build** from the
   moment 1.2.0 becomes Latest until `src/content/download.ts` moves - that is the forcing function.
4. **Land the site's round-2 batch** (S-16, S-17, S-18, D-03), deploy, and run **parity round 3**.
5. **W7 close-out**: recompute `remaining-work-summary.md` from its table; refresh
   `what-this-project-consists-of.md` §7/§11/§13/§15; both `PROJECT-CONTEXT.md` files; the three CLAUDE/AGENTS
   pairs (**the web pair has drifted - re-mirror from `CLAUDE.md`**); the portfolio file and the master JSON;
   the memory note; and WH011. Clean up the test run folders under
   `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\` (only 2026-09-13/14 stamps).

**Still the owner's:** row 15 (Google sign-in - `external.google` is still `false`, which blocks RW-116 and,
for the desktop half, TASK-013 first), rows 5 and 13, a glance at the four analytics dashboards, rows 26 and
28, and the Search Console / Bing properties. The second-machine rows (P1, RW-064/065/066, RW-121) wait for
that keyboard.

## Technical notes

- **A guard that refuses a CORS preflight silently pushes Tauri onto postMessage IPC, where the guard is
  blind.** The IPC guard belongs at the transport (CDP `Fetch` on `http://ipc.localhost/*`), and the engine's
  own parser is last-mode-wins - both were load-bearing in rounds 8-10.
- **A warning count that greps for "warn" misses `[PLUGIN_TIMINGS]`.** The release gate's 6 s network check was
  being charged to plugin hooks; it moved to config load, and the build is silent again.
- **`actions/setup-node` v5 enables package-manager caching by itself** when the root `package.json` declares
  `packageManager`, running `yarn cache dir` under yarn 1.22 before corepack - two red CI runs until
  `package-manager-cache: false` (`50bca67`).
- **Back up a file before planting a defect in it.** One plant went in without one and had to be recovered by
  proving the file equalled HEAD; every plant afterwards was backed up first.
- **A 0-byte agent transcript is not a stall signal** - round 8's agent had one while actively writing
  evidence.
- A 5.37 GB runaway log (a stuck Python REPL traceback loop) had cut C: to 4.99 GB free; deleting it and
  killing the orphaned helper brought C: back to 10.36 GB.

## Session metrics

Twenty-one commits on the product repo, eleven on the site, three on the docs site; four desktop GATE 4 rounds
and two site rounds; 1,081 desktop evidence PNGs and the site's own set; three new build gates, each watched
failing on a verified plant; nineteen story surfaces recorded; two analytics defects found on the wire and
fixed on both surfaces.

## Continuation prompt

> Read `D:\work\windowsweep-root\windowsweep\CLAUDE.md`, then
> `D:\work\windowsweep-root\completion-plan-v3-2026-09-12.md` (the method), then
> `docs/features/windowsweep-completion/00-tracker.json` - its `resumeInstructions` is current as of
> 2026-09-14 - and then this record,
> `docs/work-history/2026-09-14-WH010-gate4-rounds-seven-to-ten-site-parity-and-the-keeper-batch.md`.
> Twenty owner decisions are in force (D1-D12 in the tracker, D13-D20 in the v3 plan): apply them, never
> re-ask, and do not re-derive the backend, the layout, the tagline, the release sequence, the analytics
> decision, the site's scope, the account-deletion decision or the Android exclusion.
>
> Four things are left, in this order. **(1)** Apply D-61 and D-62 from `docs/story/decision-log.md`
> (2026-09-14), dummy first - every figure that describes what a run would free carries the rehearsal's own
> numbers after a rehearsal and is worded "up to" before one; a figure describing what is there keeps its
> measured number. **(2)** Run GATE 4 round 11, limited to Home's ladder, the Run screen at rest and the 760 px
> target table; prove each instrument with a plant you verified applied. **(3)** The moment a round comes back
> CLEAN, cut `desktop-v1.2.0` exactly as `D:\work\windowsweep-root\release-kit\README.md` lists its eleven
> steps - the notes, the updater proof on this machine's installed 1.1.0, the first-boot beacons, the docs and
> site updates, the deploy. The site's release gate fails its build until `download.ts` moves; that is the
> forcing function, not a nuisance. **(4)** Land the marketing site's round-2 fix batch (S-16, S-17, S-18,
> D-03), deploy, run parity round 3, then close W7: `remaining-work-summary.md` recomputed from its table,
> `what-this-project-consists-of.md` §7/§11/§13/§15, both `PROJECT-CONTEXT.md` files, the three CLAUDE/AGENTS
> pairs (the web pair has drifted - re-mirror from `CLAUDE.md`), the portfolio file and master JSON, the memory
> note, and WH011.
>
> At the start of the session poll `external.google` on `nlmetjyytgwaxcliusuo`, the docs HTTPS, the site's
> `.env` and `releases/latest/download/latest.json`, and run whatever each unblocks. Use only
> `aoneahsan-ccca-*` agents, at most three at once, each with an explicit `EXCLUSIVE SCOPE`, pairwise disjoint,
> never on a hot file; agents never commit, push or deploy. Run every gate a task names, watch each new gate
> fail once on a plant you verified applied, flip the tracker rows in the same commit as the work, append a
> `runHistory` row, one commit per repo, push, quote the `Bypassed rule violations` line, and put no
> attribution trailer on any commit. Never re-run a tag that produced a published release, never
> `git stash`, and never touch the owner's own Chrome.

## Document history

| Date | Change |
|---|---|
| 2026-09-14 | Written at the end of session 15, covering sessions 14 and 15 (the v3 plan's W0-W6). |
