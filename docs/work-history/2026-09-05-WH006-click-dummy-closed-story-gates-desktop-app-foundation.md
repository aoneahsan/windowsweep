# WH006 - the click dummy closed, both story gates cleared, and the desktop app's foundation built

| | |
|---|---|
| Date | 2026-09-05 |
| Task | RW-073 to RW-075 (the click dummy) · RW-043, RW-045 (docs-site residue) · RW-090, RW-091 (story init and content map) · RW-092 part 1 and GATE 4 (the three desktop surfaces) · RW-093 (the approved words into the dummy) · RW-076 · RW-077, RW-078, RW-080 in full · RW-079 agent half · RW-081 part one |
| Duration | one long session, continued from WH005 |
| Status | complete for the items named. Now blocked on the owner for rows 22 (Build Tools, which gates GATE 4 proper and the release) and 23 (creating the Firebase project), and on rows 11/12, 15, 16, 20 and the P1 runs |
| Project | windowsweep, `D:\work\windows-cleanup-root\windows-cleanup` |
| Developer | Ahsan Mahmood (aoneahsan) |
| Model | Opus 5, executing the saved plan at `C:\Users\PC\.claude\plans\please-audit-the-whole-streamed-nest.md` and then the tracker |

## Executive summary

The project moved from **55.45% to 78.07%** of the whole-project scope. Four things happened: the click dummy
was finished and verified and turned up four real defects; the storytelling system cleared both of its
approval gates and produced the eleven desktop screens as a numbered slot inventory; and the desktop
application stopped being a design and became a codebase whose CI is green end to end; and the owner granted
GATE 4 on the desktop copy, so the approved words are in the dummy and the app follows it.

The single most valuable finding of the day was one character. A premature `*/` in `shared.css` had closed a
comment five lines early, which made the CSS parser discard the entire `.band-bleed` ink reset while
recovering. In light mode that left 87 text nodes measuring **1.09:1** against their background - invisible
text on the home screen, in all three colour treatments, with every gate green. The rule itself was correct
and listed fifteen components; only the comment was wrong.

## Starting point

`main` at `9f39f0f` with the GATE 2 record committed, docs at `8e5a87e`, notebook at `d5652fd1`. The tracker's
resume instruction named `P7.RW-092`, surface `desktop-safety`. `desktop/` held only `design/`.

## Work completed

### 1. The click dummy (RW-073 to RW-075) - four defects, each invisible to the existing gates

- **The house-promotion self-exclusion was decorative.** The rule wants two layers, each proved by removing
  the other. Both filters matched nothing, because the vendored roster never contained `windowsweep` in the
  first place - so removing either changed nothing and the test passed in both directions while proving
  nothing. `page-settings.js` now carries a `ROSTER_SOURCE` that *does* include the product, a vendoring drop,
  a resolver filter, and `window.wsPromoAudit()` returning four cases whose fourth is the control that must
  show self-promotion.
- **A hidden selection bar was fully keyboard-reachable.** `.selbar[hidden]` was translated off-screen but
  still focusable; all three of its buttons could be tabbed into. Fixed with `visibility: hidden` on a
  delayed transition so the animation survives.
- **The horizontal scroller was dead in five places**, defeated by an inline `overflow: visible` on the same
  element - `overflow-x: auto` and `overflow-y: visible` cannot coexist, and the shorthand won.
- **The bleed-band ink reset, above.**

Gates, each watched failing on its own plant: 8,034 contrast measurements across three treatments in light and
dark with zero failures; zero focusable-while-hidden controls; no HTML text under 12px.

🔴 **Three of the plants were wrong, not the gates** - an inline `display:flex` that the global
`[hidden]{display:none !important}` correctly overrode, an SVG plant appended to a decorative icon with no
text box, and `#8a8a8a`, which is genuinely readable at 4.5:1 against the treemap's dark frame. Each was
initially reported as `*** GATE BLIND ***`. **A plant has to reproduce the condition against the surface it
actually lands on**, or it tests the plant rather than the gate.

### 2. Docs-site residue (RW-043, RW-045)

The Open Graph card had never worked: `themeConfig.image` pointed at an SVG, which no social platform renders.
Exported to a real 1200x630 PNG beside the SVG master. The local `yarn install` ran for the first time and
**proved the inherited lockfile genuinely valid** - it did not change by a line.

### 3. The storytelling system (RW-090, RW-091, RW-092 part 1)

GATE 1 and GATE 2 were both approved. The voice is the eleventh entry in the global registry, with a
uniqueness note explaining why it is not `labflow`, `netcage` or `clearhire`: its dominant band is not calm
competence but the narrower register of the moment *before an irreversible act*, and its second band -
reassurance delivered as a specific refusal - appears nowhere else in the registry.

The three desktop surfaces were drafted as **numbered slot inventories**: 375 slots, each with its file and a
selector precise enough to find the string once, the shipping text fenced alone. **331 were kept as already on
voice.** That is the expected outcome when the Bible was derived from the same artefact, and worth stating,
because a review that rewrote most of an approved dummy would be evidence of a problem rather than of rigour.

Of the 38 changes, most are banned diction reaching the surface (`clean` and `sweep` as verbs, `preview` used
where the flag is called `--dry-run`, `just`, and two first-person plurals on permission screens). Three are
substantive: an empty state comparing the reader's disk to other people's, five invented run-mode names on the
History screen, and four wrong section keys on the Report screen - a data defect on the one screen whose own
disclosure claims it cannot disagree with the file on disk.

🔴 **The lint hook is blind to copy inside a code fence**, so on a slot-shaped surface it measures the
writer's commentary and none of the product's words. The shipping strings were swept with a separate script
instead; that, the fact-checker and a human reader are the real gate here.

### 4. The desktop app (RW-077, RW-078, RW-080)

`desktop/` now holds a Vite 8 + React 19 + TypeScript `~6.0.3` web layer and a Tauri 2 shell.

- **The engine bridge reimplements nothing.** `src/lib/cli.ts` parses the `--json` document, the
  `##windowsweep` progress lines and `candidates[]`/`targets[]`; `src/lib/catalogue.ts` reads `--list --json`,
  so **no section list is hard-coded anywhere** and a new section appears with no app change.
- 🔴 **A correction found by checking rather than assuming.** The first version built `--select` as
  `<section>:<index>` groups. The engine's `--select` is nothing of the sort - it takes 1-based indexes
  against *one* prompt and is consumed as a **queue**, one value per interactive section in whatever order
  they run. A front end using it would have to predict both the ordering and the numbering. The app uses
  `--select-file`, which is matched by path, case-insensitively, and reports a line that matches nothing.
- **The ten axes live in ONE file.** `src/lib/axes.json` is read by `theme.ts` at runtime and by
  `scripts/gen-prepaint.mjs` at build time, which writes `public/prepaint.js` - the synchronous head script
  that applies every axis before the body is parsed. `yarn check:prepaint` fails the build if they drift, and
  was watched failing on a planted default change.
- **i18n from day one, with a gate.** Every string goes through `t()`; `eslint.config.js` carries
  `no-restricted-syntax` AST selectors at `error` - no new dependency for one rule - and they were watched
  failing on two different plants: a literal JSX string and a literal `aria-label`.
- **One consent-gated `track()`.** The fan-out is inside the report function; a provider is *constructed*
  only when both its consent flag and its key are present; Amplitude's ready flag is on the init **promise**;
  the gtag shim pushes `arguments`, not a spread array; Sentry's `beforeSend` strips file paths.
- **Five Rust commands behind an argument allowlist** with its own unit test. There is no shell plugin and no
  filesystem plugin in the capability set: the executable is fixed and every argument the webview sends is
  checked, so a front end cannot aim the process anywhere else. `--elevate` is passed to the **engine**, which
  is what makes the Elevation screen's claim that the app never elevates itself true.
- **Screens:** Home, Run, Sections and Consent are built. Seven are declared as `pending-wave` placeholders
  naming their dummy page, rather than hidden.
- **CI:** `desktop-ci.yml` (windows-latest: install, prepaint check, typecheck, lint, build, a source-map
  sweep, `cargo fmt --check`, `clippy -D warnings`, `cargo test`, `tauri build --no-bundle`) and
  `desktop-release.yml`, manual-dispatch only until the updater signing secrets exist.

### 5. GATE 4, and the words into the dummy (RW-093)

The owner granted GATE 4 on the three desktop surfaces and answered the two
blocking questions. **No pricing claim anywhere** — Home and Account now say only
what signing in does. **The installer ships unsigned**, the SmartScreen note
stays, and the copy names the two verifiable artefacts exactly: a SHA-256
checksum and the minisign signature the app's own updater checks, with the
statement that neither is a code-signing certificate.

All 38 approved slots went into the click dummy, then the app followed the dummy.
Two internal identifiers were renamed with their labels (`clean`→`reclaim`,
`preview`→`dryRun`, `cleanBtn`→`reclaimBtn`) — **an identifier still carrying the
retired word is how the retired word comes back**, in the next component someone
writes by copying its neighbour. Verified in both directions: every
`data-ws-text` and `data-ws-action` a page declares has a writer or handler (43
and 29), and no writer targets a key no page declares.

### 6. The remaining seven screens (RW-077 complete)

Splash, Picker, History, Report, Settings, Account and Elevation. The
`Placeholder` scaffolding is deleted because it has no callers left. Three of them
deliberately differ from the dummy, each for a stated reason: **Report derives
every section key from the catalogue** rather than listing them (the dummy had
named four sections by keys the engine does not use, on the one screen whose own
disclosure claims it cannot disagree with the file on disk); **History shows the
engine's own vocabulary**; and **Settings' Privacy tab reloads the window** when a
destination is switched off, because a third-party script already loaded cannot be
unloaded and a reload is the only way "revoking stops it immediately" is true.

### 7. Four CI cycles, three real defects, and the check that made them local

`desktop-ci` went green end to end on `4c031d7` — `cargo fmt`, `clippy -D
warnings`, `cargo test` and `tauri build --no-bundle`. Getting there cost four
cycles at roughly ten minutes each:

1. `protocol-asset` enabled with no matching `tauri.conf.json` allowlist entry.
   Nothing here loads a file through `asset://`, so the **feature** went, not the
   config gained an entry.
2. `bundle.resources` ended in `**`. In the Rust glob crate a trailing `**`
   matches full path *components*, so tauri-build found four directories and no
   files: `didn't match any files`. Now `**/*`.
3. A `_resourcesNote` comment key, added in good faith. The config schema refuses
   unknown fields outright.

🔴 **All three were only findable in CI**, because the validation happens inside
`tauri-build`, which needs the MSVC linker this machine does not have.
`scripts/check-tauri-config.mjs` now validates against
`node_modules/@tauri-apps/cli/config.schema.json` — the exact installed version —
in `prebuild` and in CI. **Its own first three findings were all its own bugs**:
it merged `required` across `anyOf` branches, and treated a free-form map as
"nothing declared, therefore everything unknown". Fixed, `--self-check` plants an
unknown field to prove it still catches one, and union-`required` is now left
*unchecked* rather than checked wrongly — stated in the comment rather than
hidden.

### 8. A dev stand-in, a gate that leaked, and 264 combinations

Outside a Tauri window there is no `invoke`, so every screen showed its
engine-error state and could not be compared with the dummy at all — putting a
design gate behind a 5 GB owner-only install. `src/lib/dev-engine.ts` answers the
engine's contract in a development build: the real captured catalogue, plausible
sizes, always a dry-run, every log line saying it is not the real engine.

🔴 **Its gate took two attempts.** The first gated the call sites on
`import.meta.env.DEV` and imported the module statically. Measured against
`dist/`: the identifiers were gone and two of its string literals were still
there — branches eliminated, module still in the graph. The import is now dynamic
behind the same constant, re-measured, with a control string that must be found.
**Gating a body is not gating a module.**

The pass itself: the automation Chrome, headed, own profile and port. 11 screens ×
4 widths × 3 treatments × light and dark = **264 combinations, 10,684 text
nodes**, and zero failures on all six checks. Widths 760/1024/1440/1920 — **390 is
deliberately absent**, because `minWidth` is 760 and a failure there is
unactionable. Both gates watched failing on two different plants.

🔴 **And the audit nearly missed the defect it found.** Vite's error overlay is a
custom element in a shadow root, so the text walk never saw it — the first run
reported eleven broken screens as clean, and only the overlay's own 9.6px "Hide
Error" leaking into the tiny-text list gave it away. The defect: `Shell.tsx`
resolved `getCurrentWindow()` during render, which throws outside a Tauri window,
so every screen using the shell was broken with typecheck, lint and build all
green. After the audit was corrected, 1,504 text nodes became **10,684** — the
measure of how much of each screen the overlay had been hiding.

**GATE 4 itself is still owed:** screenshot pairs judged by eye in the app's own
WebView2, which needs owner row 22.

## Files created or modified

`desktop/` gained ~30 files: `package.json`, `yarn.lock`, `.yarnrc.yml`, `.gitignore`, `.env.example`,
`index.html`, three tsconfigs, `vite.config.ts`, `eslint.config.js`, `scripts/gen-prepaint.mjs`,
`scripts/sync-cli.mjs`, `src/lib/{cli,catalogue,engine,theme,format,consent,analytics,auth,sync,links,config}.ts`,
`src/lib/axes.json`, `src/state/store.ts`, `src/i18n/`, `src/styles/{tokens,theme-bridge,shell,app}.css`,
`src/components/{Icon,Shell,ThemePanel}.tsx`, `src/screens/{Home,Run,Sections,Consent,Placeholder}.tsx`,
`src-tauri/{Cargo.toml,build.rs,tauri.conf.json,capabilities/default.json,src/{main,lib,engine,oauth}.rs}`.
Records: `CLAUDE.md`, `AGENTS.md`, `docs/PACKAGES.md`, `remaining-work.md`, `remaining-work-summary.md`, the
tracker, `docs/story/{run-state.json,decision-log.md,drafts/}`, and two workflows.

## Current status

Whole project **78.07%**; CLI-only scope **87.75%**. The engine is untouched: `git diff 3c4d54e..HEAD -- lib
modules windowsweep.ps1 bin` is still empty, so npm 1.1.0 still equals `main`.

## Next steps

1. 🔴 **The owner's seven `NEEDS DECISION` answers and GATE 4.** Two block copy already in the tree.
2. RW-079 - the Firebase project, Firestore rules and vault entries. Needs no copy, so it is next for an agent.
3. RW-093 after GATE 4, then the seven remaining screens.
4. RW-081 (WebView2 run-to-verify, GATE 4 parity pairs) and RW-082 (`desktop-v1.1.0`).

## Technical notes - four traps met today

1. **A bash heredoc ate `\\r\\n` inside a Python string literal**, writing real newlines into a TypeScript file
   and breaking it. Single backslashes survive; a doubled one does not. Anything needing an escape sequence
   goes through the Write tool or `String.fromCharCode`.
2. **`yarn` refuses to treat a nested folder as its own project** unless an empty `yarn.lock` exists there
   first. The error names the fix, which is fortunate, because making `desktop/` a workspace of the CLI would
   have hoisted ~370 dependencies into the package whose entire argument is that it has none.
3. **`baseUrl` is deprecated in TypeScript 6** and errors rather than warning. `paths` works without it.
4. **Type-aware ESLint rules fail the whole run** when loaded against a file outside a tsconfig project -
   `eslint.config.js` itself. The type-checked set is scoped to `src/**` and the config files get
   `disableTypeChecked`.

## Session metrics

One product commit. Gates: typecheck 0, lint 0, build 0 warnings, prepaint check pass, tarball sweep clean,
CLI self-test 151/151, version parity 1.1.0. Five gates watched failing on planted defects.

## Continuation prompt

> Read `D:\work\windows-cleanup-root\windows-cleanup\CLAUDE.md`, then `remaining-work.md` and
> `docs/features/windowsweep-completion/00-tracker.json`. Session 8 built the desktop app's foundation and
> drafted the three desktop story surfaces. **Two things wait on the owner and nothing else does:** GATE 4 on
> `docs/story/drafts/desktop-{moment,safety,cockpit}.md`, and the seven `NEEDS DECISION` answers in those
> files - the pricing sentences at `desktop-moment` S-090 and S-147 are the sharp one, because
> `~/.claude/rules/00-house-rules.md` forbids writing that a product has no paid tier. If those are still
> open, do **RW-079** first: it needs no copy at all. After GATE 4, RW-093 writes the approved words into the
> click dummy, then the seven remaining screens follow the dummy. Run each item's gates, flip its tracker
> sub-task in the same commit, append a `runHistory` row, one commit per repo, push to `o main` and quote the
> bypass line. Do not re-plan.

## Document history

| Date | Change |
|---|---|
| 2026-09-05 | Created at the close of session 8 |
