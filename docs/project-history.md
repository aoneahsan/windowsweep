# Project history - windowsweep

The dated session records behind `docs/PROJECT-CONTEXT.md`, which stays the always-read file and points here.
Every block below moved from it verbatim on 2026-09-25 under RW-132, in its original order; nothing was
reworded. Sessions 13 and 16 kept their decisions there, so only their audit narratives are here.

## Session records

### Session 13 (2026-09-12) - the audit, what it verified

**What the audit verified rather than assumed:** the engine equals `v1.2.0` (empty diff); the self-test is
156 and the analyzer clean today; `desktop-v1.1.0` is installed here (HKCU); the docs HTTPS failure is
GitHub's own `*.github.io` certificate with no CAA record on the apex; the site's static HTML carries the home
title and canonical on every route and answers 200 on unknown paths; D-9, D-13 and D-22 are done in code while
their tracker row still read pending; TASK-005's events exist with callers; the 1.2.0 cascade left the README's
version rows at 1.1.0 (corrected in the repo; stale in the published tarball until 1.3.0); `lib/safety.ps1`
and `modules/self_test_extra.ps1` exceed the 500-line ceiling (RW-121).

### Session 16 (2026-09-17) - the v4 audit, what no record said

**What the audit found that no record said.** Desktop GATE 4 round 11 and site parity round 3 both ran on
2026-09-14 *after* the last commit and neither was recorded - the only trace was an uncommitted edit to the
tracker saying each was "running". Round 11 saved no driver stdout, so its verdict is lost and it is re-run
as round 12; round 3 saved everything and yields a verdict from its own files. An unintended **real run**
happened that day (recorded under "Verified runs"). Four pending tasks filed on 2026-09-13/14 were in no
planning file. And the root `README.md` still called the docs site HTTP-only, five days after HTTPS was
enforced. Everything else the records claimed re-verified true.

### Session 10 decisions (2026-09-07) - the completion run

Asked to confirm and finish every remaining item, the owner settled eight questions. Fable 5.1 planned the
work at `C:\Users\PC\.claude\plans\we-have-remaining-work-md-in-purrfect-wind.md` (copy:
`../completion-plan-2026-09-07.md`, beside the repositories) and Opus 5 executes it without re-planning.
His answers, and what each one changed:

- **"Workspace root, all three"** - `remaining-work.md`, `remaining-work-summary.md` and
  `what-this-project-consists-of.md` move to `D:\work\windows-cleanup-root\` (renamed `windowsweep-root` on 2026-09-12). 🔴 **That is outside git**, so
  another machine needs the whole folder copied, not a clone. The README's two public roadmap links now point
  at the tracker JSON, which stays in the repository.
- **"Pre-approve after a lean review"** - GATE 4 is granted **in advance** for all eleven remaining
  storytelling surfaces (readme, tagline, site-front, desktop-readme, docs-start, docs-safety, docs-reference,
  docs-help, docs-about, ai-guide, cli-strings), conditional on the finalizer's fact-consistency PASS and zero
  unanswered `NEEDS DECISION`. Each surface gets `/story-review --lean` then the finalizer; `--lean` is his
  named override for this run. A new `NEEDS DECISION` pauses **that surface only**.
- **The tagline** - `Developer-aware Windows cleanup CLI: dry-run first, personal folders refused, zero
  install via npx.` (99 characters, ASCII). It lands in all five places inside the 1.2.0 cascade and ends the
  divergence where the docs site carried a different sentence.
- **"Two desktop releases"** - `desktop-v1.1.0` first with sync and telemetry dormant; then the console
  strings and the tagline as CLI **1.2.0**, whose GitHub Release is created with `--latest=false`; then
  `desktop-v1.2.0`, and the in-app updater verified 1.1.0 -> 1.2.0 on this machine. 🔴 Every future CLI
  release is `--latest=false`, because the updater endpoint reads `releases/latest`.
- **Owner rows in flight** - he does DNS + Pages HTTPS (rows 11/12), the telemetry keys (rows 16, 18) and the
  Supabase account + project (row 23) then the Google OAuth client (row 15). About the candidate-path probe he
  said: *"complete all that you can on this system, and then i will clone this project completed from this
  system to another system and ask you to do all that on that system and you can cover whatever you get from
  that system, as i do not have much more than that"* - so row 20 and the P1 verification runs move to a
  **second-machine handoff** rather than blocking this run.
- **"Yes, the unelevated safe batch"** - one real `--all --yes` developer-mode run through the desktop app is
  authorised for run-to-verify: the same scope as the 2026-09-03 real run, no interactive section, no admin
  section, never elevated, dry-run first.
- **The three open story decisions, all as recommended** - keep *"independent software engineer"* on the about
  page; raise content-map row 14 (`desktop-readme`) from ~600 to ~900 words so the what-it-sends disclosure
  survives; implement a **page-scoped** `FAQPage` JSON-LD on the FAQ page only.
- **"Yes, windowsweep\ is final"** - the inner folder is `windowsweep\`, superseding the session-7 sentence
  that the inner folder names do not change. Every record now names it.

**Three decisions the planner took, flagged for his veto rather than hidden:**

1. 🔴 **Installer file names stay Tauri's canonical ones** (`windowsweep_<version>_x64-setup.exe`,
   `windowsweep_<version>_x64_en-US.msi`) rather than the build-stamped pattern the publishing rule asks of an
   APK. `latest.json` and each `.sig` are keyed to the bundler's names and the updater downloads by that URL;
   the version already makes each name unique, and the build date plus the SHA-256 are carried in the release
   body and `SHA256SUMS.txt`. A declared deviation, not an oversight.
2. **GATE 4 parity is measured at 1440 and 760, not 390** - `tauri.conf.json` sets `minWidth: 760`, so the
   product cannot be narrower and a failure at 390 is unactionable.
3. **The updater UI needs no new words.** `splash.html` in the click dummy already specifies the whole update
   gate - the hidden band, "Later" / "Install and restart", the "Checking for a newer build" step and the
   offline note - so implementing it in the app is a GATE 4 parity fix using approved copy, not a new surface.

**What the planning session verified rather than assumed**, because two of these change what a later session
should believe:

- 🔴 **Nothing in the app calls the updater.** `tauri-plugin-updater` is registered in `lib.rs` and
  `updater:default` is granted, but no module under `desktop/src` imports `@tauri-apps/plugin-updater`. The
  only traces are two copy strings promising the check. So the Splash screen's update gate was specified,
  approved and never built.
- 🔴 **`plugins.updater.dialog` in `tauri.conf.json` is a dead key.** `tauri-plugin-updater` 2.11.0's `Config`
  accepts only `endpoints`, `pubkey`, `windows` and three `dangerous_*` flags. It was silently ignored.

### Session 10 - eight defects found on the way, and how each was proved

Every one of these was invisible to typecheck, lint, build and CI. They are recorded because the next
session should not have to find them again.

🔴 **1. The installer FLATTENED the engine tree, so the installed app could not run the engine at all.**
The bundled copy had all 38 files in one directory and no `bin/`, `lib/` or `modules/`, so
`windowsweep.ps1` could not dot-source `lib/constants.ps1`. Found by installing the app and running the
engine - **no static gate can see this**, and the MSI check of 2026-09-06 counted 39 files without looking at
their paths. Root cause read from the bundler's own source rather than guessed
(`tauri-utils-2.9.3/src/resources.rs:196-211`): a resource key containing `*` takes the `Glob` branch, which
does `dest.join(path.file_name())` and drops every directory component **by design**; a key naming a
**directory** takes the `Walk` branch, which does `dest.join(strip_prefix(pattern))` and preserves the tree.
So `{"resources/windowsweep/**/*": "windowsweep/"}` became `{"resources/windowsweep": "windowsweep"}`.
⚠️ **This is the third form of the same glob confusion.** A trailing `**` matched only directories and
yielded no files; `**/*` matched files and flattened them; the directory form is the answer.
**Proved twice:** the MSI's own Directory table now lists `bin`, `lib` and `modules` under the resource
folder, and a clean install runs `--version`, reads a 26-section catalogue and passes the self-test.

🔴 **2. The bundle omitted `package.json`, and the self-test scored 150/151 from the installed copy while
the repository copy scored 151/151.** `sync-cli.mjs` derives what to copy from the `files` array - but **npm
puts `package.json` in every tarball regardless of `files`**, so it never appears in that array and a
files-driven copy silently omits the one file npm always ships. The script's own comment promised the bundle
was "exactly what the published npm tarball contains". Two things depended on it: the version-parity check
read `package.json=''` and failed, and `bin/windowsweep.js:42` fell back to the literal in
`lib/constants.ps1`, so the bundled launcher took a code path **no npm user ever takes** and reported the
right number for the wrong reason. Fixed in the script, not the engine. Now 39 files and 151/151 from the
bundle, with the version gate watched failing on a planted `9.9.9`.

🔴 **3. `desktop/.env.example` was IGNORED and had never been committed.** Root `.gitignore` line 12 is
`.env.*`, which matches `.env.example` - so the one file in that family whose entire purpose is to be
committed was the one being hidden, while the frontend rule requires it to stay in sync. Fixed with
`!.env.example` **after** the pattern it undoes, because the last matching pattern wins. Proved with
controls: `.env.example` visible, `.env` and `.env.local` and `.env.production` still ignored.

🔴 **4. A carriage return in the updater password broke signing, and the error blamed the password.**
`openssl rand -base64` under Git Bash emits CRLF and `tr -d '\n'` removes only the LF, so the stored password
was 44 base64 characters plus `\r`. The keypair was generated with that value; the build then produced both
installers and failed at the last step with *"incorrect updater private key password: Wrong password for that
key"* - a true message pointing at the wrong culprit. **Write such a value with node's own CSPRNG straight to
the file**, never through a shell pipeline, and verify the byte count and the absence of `\r` before using
it. Both keys were regenerated and the pair was proved by signing a probe file **before** the five-minute
rebuild, rather than discovering it again at the end.

🔴 **5. The cargo cache holds absolute paths from the folder's OLD name, on both profiles.** Symptom:
`failed to read plugin permissions: ... (os error 3)` naming `windows-cleanup-root\windows-cleanup\...`, a
path that no longer exists - which reads like a broken Tauri install. Trigger: any edit to
`tauri.conf.json` invalidates `build.rs`, which then dereferences the stale `DEP_TAURI_*` metadata. It stayed
invisible while the fingerprint was fresh. Fix: `cargo clean -p` the eleven affected packages, per profile.
The dev profile was cleaned first (3.3 GB) and the **release** profile hit the same wall on the next config
edit (a further 0.35 GB). **CI never sees this** - a fresh runner has no cache - so it will recur on this
machine and nowhere else.

🔴 **6. The NSIS uninstaller removes only what its own manifest recorded.** After the broken build was
replaced, the uninstaller took the correct tree and left the 35 stale flat files behind. Harmless here
because no broken release was ever published - the defect was caught before the first release - but it means
an upgrade never cleans a file the previous installer did not record. **A clean-machine test is the only
honest one**: the install was removed, the leftovers deleted and the fixed build installed fresh before any
verification was believed.

⚠️ **7. `supabase db query --linked` answers 403 on CLI 2.107.0** while
`POST https://api.supabase.com/v1/projects/{ref}/database/query` answers the identical SQL with the same
token. A session reading that 403 as "the token lacks platform access" would wrongly declare the platform
gate failed; it passes. There is also no `psql` on this machine, so catalogue verification goes through that
endpoint - which runs as `postgres` and therefore holds `rolbypassrls`. **Two questions, two instruments:**
the catalogues say what the schema *is*, and only a real user's JWT says whether a policy *holds*.

⚠️ **8. A FilesHub-registered Supabase project arrives with two objects in `public` that no migration
created** - the `fileshub-project-status-check` keepalive table and a `SECURITY DEFINER` event-trigger
function `rls_auto_enable()`. Both trip Supabase's advisors on a project whose own schema is clean, and
**neither is a hole**: the function returns `event_trigger`, so an RPC call gets
`400 0A000 cannot display a value of type event_trigger` and never enters the body, and PostgREST does not
advertise it at all. Probed rather than reasoned about. Recorded so nobody "hardens" the keepalive into
breakage or reports the advisor warnings as findings.

**And one observation for the owner rather than a defect:** the word *FilesHub* appears as a bare product
name in nine tracked files of this **public** repository, pre-existing since 2026-09-03. The host, the
tokens and every credential are absent - swept and confirmed - so nothing is leaked. The fleet rule that
forbids naming that tooling is scoped to client and work projects, and pre-existing mentions are the owner's
call, so this is reported and not rewritten.

### Session 10, later - analytics has no opt-out, and the app could not run at all

**Owner decision 2026-09-07, verbatim:** *"do not give user option to turn off any of those analytics or
anything, it's a free production, just mention we use that to improve the product, with no option to opt out,
they can just not use the product if they so not like it"*, then *"keep it simple 1 line we collect to improve
the product for everyone, sweet and simple"*.

This **supersedes** the 2026-09-03 decision that put every provider behind a first-run consent dialog with all
four off until accepted. Two boundaries he confirmed when asked:

- 🔴 **The command-line tool stays offline.** Zero network calls is a published claim in the README, the docs
  pages, `llms.txt` and the FAQ, and self-test check [9] fails the build if any network call appears. The
  decision covers the desktop window and the marketing site only.
- **Microsoft Clarity, which records session replays rather than events, runs on both surfaces**, and the
  marketing site carries a plain notice saying so.

One concern was raised and he confirmed the decision, so it stands: consent-free analytics is defensible for a
desktop app under a privacy notice, but for **web** surfaces in the UK and EU analytics storage needs consent
rather than notice, and session replay is the sharpest case. The exposure is on the marketing site, not on the
desktop app.

**What changed, in the order the design law requires.** The click dummy first, then the app:

| Surface | Was | Is |
|---|---|---|
| `consent.html` | four switches, `Turn all on` / `Turn all off`, and two answers - `Continue with everything off` and `Save and continue` | a **notice**: one heading stating collection, the engine's zero-network fact, a `Never sent` panel, a disclosure of what the window sends, and one `Continue` |
| `page-consent.js` | wrote a per-provider map | writes `{ seen, seenAt, collected }` - a *seen it* flag, not consent, and not revocable |
| Home's privacy ledger | four live switches | the four destinations as stated facts with an `on` badge, plus the `Never sent` paragraph |

🔴 **The `Never sent` list was deliberately kept.** A notice with nothing checkable in it is an announcement;
the Bible's band R delivers reassurance as a **specific refusal**, and "never a file path, never your user
name, never the contents of anything" is that refusal. Removing it would have made the screen shorter and
worse.

⚠️ **A switch that changes nothing is worse than no switch**, which is why the ledger states rather than
offers. And every string promising that a destination can be revoked or turned off in Settings is now false -
that class is swept, not just the instances anyone happened to name.

⚠️ **`desktop-safety` (Consent, Elevation) is a GATE-4-recorded surface**, so this change re-opens it and the
keeper owes it a pass.

### The two defects that meant the app had never actually worked

🔴 **Every `run_clean` call was refused, and so was every catalogue load.** Found by running the installed
build: Home rendered **0 of its 14 specified zones** and said *"The engine did not answer."* The dummy's Home
has 286 visible text nodes; the app had 19.

1. **`RunRequest` had no `#[serde(rename_all = "camelCase")]`** while `engine.ts` sends `runId`. Tauri's
   `#[command]` macro converts a bare snake_case **parameter** to camelCase for you - which is exactly why
   `read_run_report(run_id, file_name)` worked and hid the pattern - but it does not reach inside a struct.
   Serde deserialised by the struct's own field names, so it wanted `run_id`, got `runId`, and refused.
2. **`--list` was absent from `ALLOWED_FLAGS`.** `catalogue.ts` calls `--list --json` at boot precisely so no
   section list is ever hard-coded, and the allowlist did not carry it.

🔴 **They were stacked: fixing either alone leaves the app dead.** And nothing could have caught either -
`cargo test` exercised the argument validator rather than the deserialiser, and typecheck, lint and build have
**no view across the IPC boundary at all**. Two tests now cover it, each watched failing against the unfixed
code and passing with the fix: one deserialises the webview's exact wire payload and asserts snake_case is
**rejected** (so the pair moves together and cannot pass for the wrong reason), and one asserts the read-only
flags the app needs at boot while still refusing an undocumented one.

⚠️ **A third defect of the same family:** shipped copy on the Elevation screen named
`%LOCALAPPDATA%\windowsweep-desktop\runs\`, and the shell writes to
`%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\` because `app_local_data_dir()` resolves to the bundle
identifier. **The dummy and the app said the same wrong thing, so parity was a MATCH** - no parity check could
ever have found it. Corrected in the dummy first, then the app.

### And on the documentation site: 50 of 51 pages disowned themselves

`headTags` carried a hardcoded canonical pointing at the site root, and everything in that array is emitted on
**every** page. So `/faq`, `/cli-reference` and 47 others each declared the home page as their canonical
version - a site-wide duplicate-content signal, sitting *after* the correct per-page tag, so a last-wins
parser took the wrong one. **The same shape as the FAQPage defect fixed hours earlier: a page-specific tag
living in a global array.**

### Session 8 (2026-09-05, later the same day) - what was built and what it turned up

No new owner decisions were taken; this records what the session established, because two of the findings
change how a later session should read the tree.

**The desktop app has a foundation, and the promotion is one-directional and DONE.** `tokens.css`,
`shared.css` and `components.css` were copied from the click dummy into `desktop/src/styles/` on 2026-09-05.
🔴 **From that moment the app's copies are authoritative.** The dummy keeps its own as the design record; the
two are never synced, in either direction. The only edit made during promotion was the `@font-face` URL,
which moved from the dummy's relative `vendor/fonts/` to the app's served `/fonts/`.

**A correction found by reading the engine rather than assuming it.** The first version of the app's
selection path built `--select` as `<section>:<index>` groups. The engine's `--select` is nothing of the
sort: `lib/ui.ps1` -> `Read-MultiSelect` takes **1-based indexes against one prompt** and consumes the flag
as a **queue**, one value per interactive section in whatever order they happen to run. A front end using it
would have to predict both the ordering and the numbering the engine will produce. The app therefore writes
a **`--select-file`** of full paths, which the engine matches case-insensitively against whatever each prompt
actually offers and which reports a line that matches nothing. Recorded here because the wrong version looked
entirely plausible.

**The ten appearance axes now live in one file, `desktop/src/lib/axes.json`.** `theme.ts` reads it at runtime;
`scripts/gen-prepaint.mjs` reads it at build time and writes `public/prepaint.js`, the synchronous head script
that applies every axis before the body is parsed. 🔴 A generator rather than two hand-written copies, because
the pre-paint pass cannot be a module script (deferred, so it would flash) and the alternative to generating
is retyping the table where it can drift. `yarn check:prepaint` fails the build on drift and was watched
failing on a planted default change.

🔴 **Rust compiles here as of 2026-09-06, and the reason recorded for why it could not was wrong about the
mechanism.** Visual Studio 2022 Build Tools was installed to `D:\BuildTools` (MSVC 14.44.35207, Windows SDK
10.0.26100.0) once the owner lifted the UAC constraint. The old note blamed a GNU coreutils `link.exe`
preceding MSVC's on PATH and expected installing Build Tools to put MSVC's ahead of it. **It was right that
the toolchain was absent and wrong about PATH**: the coreutils `link.exe` is still first on PATH and
everything links regardless, because rustc resolves the MSVC linker by absolute path through the VS Setup COM
API. PATH order never mattered. The whole `desktop-ci` chain now runs locally - `cargo fmt --check`,
`clippy -D warnings`, `cargo test` (1 passed) and `tauri build --no-bundle` (3m57s, a 5.2 MB binary).

**The storytelling pass reached GATE 4 for three surfaces and stopped there.** 375 numbered slots across the
eleven desktop screens; 331 kept as already on voice. 🔴 **Seven `NEEDS DECISION` items went to the owner,
and two of them concern copy already in the tree**: Home and Account state that there is no paid tier and
nothing to buy, which `~/.claude/rules/00-house-rules.md` forbids writing anywhere on the grounds that the
claim outlives the decision it describes. Until that is answered, those two sentences are the only thing in
the product carrying a known rule violation.

### Session 9 (2026-09-05) - the backend is Supabase, not Firebase

**Owner directive, verbatim:** *"we will use supabase for backend, not firebase, add this as rule, moving
forward use supabase as backend for all new projects unless i ask otherwise"*. Recorded fleet-wide in
`~/.claude/rules/services-integrations.md`; asked whether it reached this project, he chose **"Switch it to
Supabase now"**.

It cost code and no data: the Firebase project had never been created, so nothing was deployed and nothing had
to migrate. What changed: `src/lib/auth.ts` (Identity Toolkit REST -> Supabase Auth PKCE), `src/lib/sync.ts`
(Firestore REST -> PostgREST), `desktop/firebase/` deleted, and the Firestore rules replaced by a Drizzle
schema plus two migrations. **The Rust loopback listener was reused unchanged** - Supabase's PKCE flow needs
exactly the same redirect, so only the exchange differed.

🔴 **AND THE SWITCH IS BLOCKED ON A CONSTRAINT NOBODY COULD HAVE PREDICTED FROM THE CODE.** Measured against
the FilesHub registry on 2026-09-05: **all 7 registered Supabase accounts hold 2 projects each** - the
free-tier limit, **14 of 14 slots used**, every one a real named project (growthify, netcage, shortlists x2,
trizlink, labflow, aoneahsan-portfolio, habitforge, clearhire, custos, linkedin-automation, lifewell,
trialith, callvault). So there is nowhere to put a windowsweep project, and creating **an account to hold one
is owner-only too**. `docs/MANUAL-TASKS.md` row 23 is now two steps rather than one.

**Row 15 changed shape with the backend.** Supabase owns the OAuth redirect, so Google sign-in needs a **Web**
client whose redirect URI is `https://<ref>.supabase.co/auth/v1/callback`, not the **Desktop** client the
Firebase flow wanted. The old row would have sent him to create the wrong credential type.

Everything that does not depend on the missing project was built and gated: `drizzle-kit generate` needs no
database connection, which is exactly why the schema could be authored before G1 passes. The equivalence gate
reports **"No schema changes, nothing to migrate"**, so the schema and the migrations agree.

### Session 7 decisions (2026-09-05, the audit) - scope, the WIP commit, the layout, storytelling

Asked to audit the whole project and rewrite its records, the owner settled four questions. His answers,
verbatim, and what each one changed:

- **"Yes, include it"** - asked whether "100% feature-complete and production-ready" includes the desktop app,
  given that the 2026-09-03 decision had excluded it from the CLI percentage. So the headline number now
  covers the whole project (CLI, docs site, records, desktop app, storytelling); the narrower 2026-09-03 scope
  is still reported beside it, because that is the number the earlier records were written against.
- **"Commit as its own design commit"** - the previous desktop session left twenty-one files uncommitted
  (the eight A4 screens, their `page-*.js`, the contents index and the NAV wiring). They were committed as
  `2721b75` after a static check resolved 456 local links and every NAV href, and pushed before the audit
  commit, so the work could not be lost. This is the owner's explicit authorisation for a second commit in one
  prompt.
- **"Keep this layout as is"** - the two repositories now sit under `D:\work\windows-cleanup-root\` and the
  inner folder names stay. `MANUAL-TASKS` row 4 (rename to `windowsweep`) is closed as superseded.
  🔴 **The second half of that sentence was itself superseded on 2026-09-07** - asked again once the folder
  had been renamed on disk, he confirmed **`windowsweep\` is final**. The enclosing root layout is unchanged;
  only the inner product folder's name moved, from `windows-cleanup` to `windowsweep`.
- **"Retrofit everything"** - asked how the fleet storytelling rule applies to a project that shipped its
  README, thirteen docs pages and a click dummy without a Story Bible, he chose the full retrofit. Phase P7:
  `/story-init` and the Bible (GATE 1), the content map (GATE 2), then every product-voice surface through the
  pipeline - the README, the docs pages, `llms.txt`, the CLI console strings and the desktop copy, whose words
  are amended in the click dummy before the app is written.

He also directed the session split: **"make sure fable 5.1 save the whole implementation plan fully and
properly for opus 5, and once done stop"** - Fable wrote the handoff at
`C:\Users\PC\.claude\plans\please-audit-the-whole-streamed-nest.md` and stopped; Opus 5 executed it without
re-planning.

### Session 6 decisions (2026-09-05) - the dummy approved, both gates pre-authorised, downloads lifted

- **Click dummy GATE 1 approved.** Owner, verbatim: *"approved, looks great, get all remaining work fully
  done now"*. Direction 02 "Reclaim" is the desktop app's design language: the Reclaim Map treemap as the
  signature element, Archivo's width axis carrying hierarchy, the ten-axis pre-paint theme control, three
  treatments (lime 128 registered, sky 231, plum 320) in light and dark, and progressive disclosure so the
  default view stays short.
- **GATES 2 and 3 are approved IN ADVANCE.** Asked where to stop - at the gallery, at the finished dummy, or
  straight through - he chose **"Straight through to the app"**. This is the record that satisfies the
  click-dummy rule *"nothing is created under `desktop/` beyond `design/` until gate 3 is recorded"*; nothing
  else authorises it, and no later reader should infer the agent self-approved. He reviews the design once,
  translated into the app. **GATE 4 (parity) still closes only after the app exists.**
- **TASK-001 lifted in full.** Asked whether to lift the download gate, he chose **"Lift it fully"**: rustup
  plus Visual Studio 2022 Build Tools with the C++ workload (his UAC click, `MANUAL-TASKS` row 22), the
  `yarn install` trees for `desktop/` and `windowsweep-docs`, and `firebase-tools`. This supersedes the
  2026-09-03 directive *"for now do not download on this net please"* for this machine. `PENDING-TASKS.md`
  TASK-001 is closed to `docs/DONE-TASKS.md`.
- **What the lift does not change:** the CLI still makes zero network calls and its self-test still asserts
  it; no real (non `--dry-run`) cleanup and no admin section is ever run from an agent session; the Google
  OAuth desktop client (row 15) and the four telemetry keys (row 16) remain Cloud-Console clicks, so sign-in
  and analytics ship compiled and dormant until he provides them.

### Session 4 decisions (2026-09-04) - unverified target paths, and what follows 1.1.0

- **Unverified target paths: verified only.** A path becomes a target only once it has been seen on a real
  machine holding regenerable data, exactly as `remaining-work.md` requires. Anything unverifiable becomes a
  documented "candidate targets awaiting verification" table in `docs/sections.md`, plus one
  `docs/MANUAL-TASKS.md` row (20) carrying a paste-ready read-only probe the owner runs where those apps
  exist. The rows land in a follow-up release once he pastes the output. Consequences of that choice, all
  recorded rather than quietly absorbed: RW-064 and RW-065 shipped only their verified halves and stay
  `in_progress`; **section 26 was not created at all**, so the number is still free.
- 🔴 **`C:\Intel` was inspected and REJECTED, not deferred.** It exists on the build machine but holds
  `Thunderbolt`, `Logs` and a hidden `GfxCPLBatchFiles` - driver support content, not installer extraction
  leftovers. It will not become a target. This is exactly the failure the verification rule exists to catch:
  the path was in the specification, it exists, and clearing it would have been wrong.
- **After 1.1.0, continue straight into P6-A** on Opus - the design argument, the click dummy, the `desktop/`
  code and its CI workflows - with no review round in between.

### Session 5 decision (2026-09-04, later the same day) - the desktop UI direction

**Direction 01 of the desktop click dummy was REJECTED**, the same day it was delivered. His words, verbatim:

> *"about the desktop app the UI UX is very basic and not attractive at all, please plan and create a great
> UI UX for the desktop app, use click-dummy custom skill, create a new version, this one is rejected, i do
> not likeit at all"*

The page is archived byte-identical at
`desktop/design/windowsweep-click-dummy/_rejected/01-instrument-panel-2026-09-04/` with a five-point
post-mortem. The durable lesson, recorded because it will apply to the next design phase too:

- 🔴 **The design read is the decision that matters, and it was wrong.** windowsweep-desktop was read as a
  dashboard / trust-first surface and given VARIANCE 3-5 / MOTION 2-4 / DENSITY 7-8. It is a **premium
  consumer utility opened for two minutes a month**, where being impressive *is* the product. The correct
  dials are 7 / 6 / 3 on the moment screens, with cockpit density confined to the catalogue and the picker.
- 🔴 **The external design-craft set is mandatory before a design phase and was not copied.**
  `-design-process` and `-cloned-skills-library` were both skipped, and their omission is a *recorded* cause
  of this exact rejection elsewhere in the fleet. They now live in `.claude/skills/` (`EXTERNAL-SKILLS.md`).

**Direction 02, "Reclaim", now stands** and is at GATE 1: three screens x three treatments x light/dark,
a D3 treemap as the signature element, Archivo's width axis as the hierarchy device, a ten-axis pre-paint
theme control, and **zero network dependencies** - it opens by double-click, offline. Argument:
`desktop/design/README.md`. The registered hue (128, lime) was re-checked and kept; the hue was never the
problem. `info` is deliberately not declared as a semantic colour, and the accent/success separation is
22 degrees carried by chroma and a glyph, with the honest floor written into `tokens.css`.

### Session 3 decisions (2026-09-03) - the desktop app, downloads and telemetry

Recorded verbatim; they govern phase P6 and every session until the owner changes them.

- **Desktop account model.** *"implement auth, just so we can have user emails info, provide ability to store
  run results and settig etc and revert setting state when logged in, so actual features, but keep runs free,
  so they get best value"* -> the desktop app gets **optional Google sign-in for sync**: the account stores the
  user's email, settings and run history and restores settings on sign-in. **Runs are never gated, there is no
  paid tier and no plan set for this app** - an explicit owner exemption from the fleet plan-set rule, revisited
  only when he says so.
- **Toolchain downloads.** *"add that as pending task, i will ask you to download all that you need, and when i
  does, then please download and setup that part, for now do not download on this net please"* -> no toolchain
  or dependency-tree download happens on this machine until he gives the go-ahead: `PENDING-TASKS.md` TASK-001
  and `docs/MANUAL-TASKS.md` row 14. CI does every install and build that needs a dependency tree meanwhile.
- **Desktop telemetry.** Full fleet observability (GA4, Amplitude, Clarity and Sentry) in the desktop app,
  behind a first-run consent dialog with every provider off until accepted. **The CLI keeps its zero-network
  promise unchanged**; the desktop README, the docs site and the README disclose what the app sends.
- **Model workflow.** Fable 5.1 plans and reviews; Opus 5 executes the saved plan without re-planning. The
  Session 1 plan is `C:/Users/PC/.claude/plans/please-plan-and-get-agile-fairy.md`.

Derived from those decisions by the agent, under the standing rules:

- The desktop app lives in `desktop/` of this repository (the macleanup pattern), releases as `desktop-vX.Y.Z`
  with a `latest.json` updater manifest, carries the permanent identifier `com.aoneahsan.windowsweep`, and its
  version equals the CLI version it bundles.
- The admin surface for user emails is the Firebase console for this phase; a web admin panel is a later,
  separate phase. This is a recorded deviation from the fleet platform-admin rule.
- Registered palette: **primary hue 128 (lime)**, light accent `#4d7c0f`, dark accent `#a3e635` with dark
  on-accent text. The registry had no free 25-degree arc; 128 is 24 degrees from taxease (104) and wakalat
  (152), the widest gap available. Success moves to hue 158 so brand and success stay distinguishable. The logo
  mark keeps its sky-blue gradient. Free treatments: `sky` (231) and `plum` (320).
- Registered ports: 5972 (docs site start), 5973 (docs site serve), 5974 (desktop Vite dev URL).

Last Updated: 2026-09-25 (RW-132: created from `docs/PROJECT-CONTEXT.md`, every line moved verbatim)
