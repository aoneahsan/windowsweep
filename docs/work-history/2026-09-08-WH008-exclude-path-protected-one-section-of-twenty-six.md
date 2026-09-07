# WH008 - `--exclude-path` was protecting one section out of twenty-six

| | |
|---|---|
| **Date** | 2026-09-08 (opened late 2026-09-07 local) |
| **Task** | The v2 completion plan's Wave 0, the 1.2.0 engine window, and six parallel agents |
| **Status** | In progress - the engine window is open, the story panels are mid-flight, the site dummy passed GATE 1 |
| **Project** | windowsweep (`aoneahsan/windowsweep`), its docs site, and the new `aoneahsan/windowsweep-web` |
| **Developer** | Ahsan Mahmood, with Claude Opus 5 |
| **Commits** | `a730bf0` `eb15bec` `1904b21` `00a15d4` `3c9a28a` `cd06c25` `6f4706f` `1cafce1` `56878f3` (product) · `78f4285` (docs) · `cb11936` `895bc01` `b52a0fa` (site) · `7c7f5673` `a36340b0` `2259b0d9` `7a18c3c1` (notebook) |

## Executive summary

The session's finding is a safety flag that worked exactly where anyone would have
tested it. **`--exclude-path` was parsed globally, documented as section 17's, and read by exactly one
consumer** at `modules/projects.ps1:102`. So a person who excluded a folder was protected in section 17 and
silently unprotected in the other twenty-five. Nothing failed, nothing warned, and the one place a developer
would naturally try it is the one place it held. It is now enforced inside `Get-ProtectionReason`, which is
the guard every chokepoint already calls.

Three of the owner's manual rows closed **without him touching anything**, because what they asked for
already existed somewhere nobody had looked: the GA4 measurement id was sitting in the Firebase project's own
registered web app, readable with one CLI call.

Six custom agents ran in parallel under the owner's six-at-once exception. Between them they found a leaking
Sentry scrub, a flag that does not exist, two line numbers that would have patched nothing, three published
products missing from the fleet roster, and a defect I had introduced an hour earlier.

## What changed in the engine (1.2.0, unreleased - the version has not moved)

Three additive contract changes and two string fixes, in `1904b21` and `00a15d4`.

**`--exclude-path`, everywhere.** The check sits at the tail of `Get-ProtectionReason`, deliberately last, so
a path that is both protected and excluded reports the **protected** reason - the stronger statement, and the
one no flag can lift. When nothing is excluded the loop runs zero times, which is what makes it safe on a
function called once per file during a prune. `Initialize-Exclusions` is called from `Initialize-Settings`
and **not** from `Initialize-Safety`, because the config file is merged after the safety tables are built;
building the table earlier would silently drop every config-file exclusion while the flag ones kept working.

**`targets[].newest_write_utc`** in `--scan --json`, and **`protected`** in `--list --json`. The timestamp
costs no extra walk: under `--json` the size pass is already `Get-DirectoryStats`, which returns the newest
stamp out of the same enumeration. A human `--scan` keeps the faster robocopy path.

**Two string defects.** Section 22 declared `Dev = $true` with no behavioural branch. Checking that against
the docs found the mirror-image gap: sections 4, 17 and 20 **are** developer-gated and said so nowhere.
And `--help` said `--permanent` covers "Sections 18/19" when `Send-ToRecycleBin` is also called from section
23 - so someone passing that flag on the understanding it applied to two sections would have had section
23's orphaned application data deleted outright instead of recycled.

## 🔴 Two process failures, both mine, both worth keeping

**A Python edit script that asserts out mid-file never saves its earlier edits.** The `save()` call comes
after the failing assertion, so already-applied changes are discarded while the file keeps whatever was
written before them. It happened **twice in one session on two different files**, and the first time it left
a tree holding a partial change that read as complete: `Add-ExcludedRefusal` existed in `lib/safety.ps1` and
nothing could ever call it, because the function that would have produced its input never landed. The
self-test caught that one. The fix is to save incrementally, or to re-read the file off disk and assert each
piece is present - which the third script did, and which is why its report says "verified on disk".

**Appending to a file whose last line is its footer puts the text after the footer.** I added the exclusions
section to `docs/safety-model.md` and it landed below `Last Updated`, so the page stopped closing on
"Inspect before you trust" - the closing image that surface's own opening promise depends on. It also opened
"Since 1.2.0", naming an unreleased version on a page the docs site mirrors. Found by the humor-emotion
reviewer, not by any gate. Checked before fixing: it had not yet reached the live site.

## What the six agents found

| Agent | Finding |
|---|---|
| A-TAURI | **`--large-mb` does not exist**; the flag is `--large-file-mb`, default 100. Allowlisting the misspelling compiles, passes every gate, and throws from the engine the first time a person moves the size control. Also: `engine.rs` was already over the 500-line ceiling before anything was added, and a custom Tauri command needs no ACL entry **only while the app has no `src-tauri/permissions/` directory** |
| A-WEB | **The Sentry path scrub was still leaking** - the backslash rule was right and only one separator ever matched, so `C:/Users/PC/...` scrubbed to `C:<home>/AppData/...` with drive letter and folder names intact. Found by running the function, not reading it. Also: **D-22's filed value was wrong** - the dummy does not render `0 B` at idle; a shared `refresh()` paints over the static markup, so the GATE 4 report had read the source rather than the page, which is the D-21 class in the document that named D-21 |
| A-DOCS | The AI guide told automated callers that `--yes` auto-confirms **DISM** (`12-14` rather than `12-13`). Arbitrated from `lib/constants.ps1:66`, not from either document. It also **correctly overrode its own dispatch** on the tagline by finding the GATE 4 record that ends the divergence |
| A-DUMMY | The site's home page, 15 bands, three treatments, **9,996 text nodes at zero contrast failures** - and one defect in its own instrument, a gate that asserted on the cause and reported 624 non-failures |
| Story roles | The `readme` draft was stale against disk and **five slots would have regressed it**; `docs-safety` never named what actually has no undo; and `report-bodies` found `cli-strings` citing `reports.ps1:104` and `:75`, which are a CSS rule and `$rows = ''` |

**The roster turned out to be a source-of-truth problem.** Re-vendoring the dummy from the canonical fleet
file *dropped* linux-cleanup, macleanup and strata-storage - because the fleet roster never had them. All
three are real and published (npm 1.4.0, 4.6.3, 3.0.0), verified before anything was written. They were added
to the fleet roster rather than hand-written back into this project, so every product inherits them.

## Gates

`node bin\windowsweep.js --self-test --no-color` **154/154, exit 0** (up from 151; each new check watched
failing on its own plant, and the plants verified applied first) · PSScriptAnalyzer **1.25.0, 0 findings** ·
`npm run version:check` **1.1.0** · tarball allowlist clean · desktop `yarn typecheck` 0, `yarn lint` 0
watched red on a planted literal JSX string, `yarn build` 0 warnings with 0 source maps, `yarn check:prepaint`
in sync · `cargo fmt`, `clippy -D warnings`, `cargo test` **15 passed** · CI green on both PowerShell hosts.

**The 18a plant is the one worth keeping.** Stop `Get-DirectoryStats` descending into subdirectories and
`newest_write_utc` reports `2021-03-04` instead of `2023-11-12` - the **older** stamp, not an error, which
still reads as a working timestamp. That is why the fixture puts its newer file one level down.

## Current status

The CLI engine is ahead of its published release, deliberately. `desktop-v1.1.0` is out with four new Rust
commands landed since. The docs site is live over HTTP. The marketing site's repository exists, its dummy
passed GATE 1, and it is building the gallery and twelve pages. Three story surfaces are through their
sequential edits and in specialist review; `report-bodies` and `site-home` are drafted or drafting.

**Blocked on the owner alone:** Google OAuth on the shared Supabase project (`external.google` still
`false`) and GitHub's HTTPS certificate for the docs domain (`https://` probes 000, blocked on GitHub rather
than on him).

## Next steps

1. Finish the story panels and **apply** each approved surface to its real files.
2. The CLI **1.2.0 cascade**: `cli-strings` and `report-bodies` applied, the tagline in all five places, the
   version cascade, the publish gate, the tag, and a Release with `--latest=false`.
3. **Wave 4b** - the three engine-backed pending waves in the app, then `desktop-v1.2.0` and the updater
   proved 1.1.0 -> 1.2.0 on this machine.
4. The site: Supabase tables from the desktop repo, the app, the admin surface, SEO, deploy.
5. The keeper's batched recording, which must **re-record `desktop-safety`**.

## Continuation prompt

Read `D:\work\windows-cleanup-root\windowsweep\CLAUDE.md`, then
`D:\work\windows-cleanup-root\completion-plan-v2-2026-09-07.md`, then
`docs/features/windowsweep-completion/00-tracker.json`. This record is
`docs/work-history/2026-09-08-WH008-exclude-path-protected-one-section-of-twenty-six.md`.

🔴 **The "engine unchanged since 1.1.0" invariant ended on purpose in `1904b21`.** A non-empty
`git diff 3c4d54e..HEAD -- lib modules windowsweep.ps1 bin` is expected: read every hunk and classify it as
one of the three additive contract changes or the two string fixes, and nothing else. Do not read it as drift
and do not "fix" it.

Twelve owner decisions are in the tracker's `userDecisions` - apply them, never re-ask them. At the start of
every session poll the docs HTTPS probe, the Pages API's `https_enforced`, and
`auth/v1/settings` -> `external.google`, and run whatever each unblocks. Resume at the first `pending`
sub-task. Use only `aoneahsan-ccca-*` agents, each with an `EXCLUSIVE SCOPE`, never more than six at once.
Run every gate named per task, watch each new gate fail once on a plant you verified applied, flip the
tracker in the same commit as the work, append a `runHistory` row, one commit per repo, push, and quote the
bypass line where it prints.

## Document history

| Date | Change |
|---|---|
| 2026-09-08 | Created at the session boundary, covering Wave 0, the 1.2.0 engine window and the six-agent wave |
