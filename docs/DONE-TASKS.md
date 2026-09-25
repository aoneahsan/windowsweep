# Done tasks - windowsweep

Closed agent follow-ups, moved here from the root `PENDING-TASKS.md` with the date and the commit that closed
them. Open work lives there; owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-25 (DONE-017 - TASK-018, History's zero-count total, closed without new words. Earlier: DONE-016 - TASK-013, the desktop sync, verified live. Earlier 2026-09-17: DONE-013, DONE-014 and DONE-015 - the design-record split, the Report export, and three of the four History and Report gaps)

### DONE-001 - Download and set up the desktop toolchain and dependency trees

**Closed 2026-09-05.** The owner lifted the gate in writing - asked whether to lift TASK-001 he answered
**"Lift it fully"**, superseding his 2026-09-03 directive *"for now do not download on this net please"* for
this machine.

What it covered: rustup (stable, `x86_64-pc-windows-msvc`) and Visual Studio 2022 Build Tools with the C++
workload; `yarn install` in `desktop/` and in `D:\work\windowsweep-docs`; `firebase-tools`; committing both
`yarn.lock` files and `Cargo.lock`; the local desktop gates; run-to-verify; the updater keypair; and the first
`desktop-v<version>` release.

Two notes for anyone reading this later:

- 🔴 **`winget install --id Rustlang.Rustup --scope user` exits 0 having installed nothing** - the scope
  filter matches no installer and the message is only `No applicable installer found`. It reads exactly like
  success. rustup went in through its own `rustup-init.exe -y`, which is per-user and needs no UAC.
- The **Build Tools half needs a UAC click and is therefore not an agent action** - it is
  `docs/MANUAL-TASKS.md` row 22. Until it lands, nothing Rust-side links on this machine and the Tauri half is
  CI-verified only.

Plan: `C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` section 18, Block O.

### DONE-002 - `.gitattributes` covers `*.js` but not `*.mjs`, `*.ts`, `*.tsx`, `*.css` or `*.mts`

`.gitattributes` pins `*.js` to LF and `*.ps1`/`*.cmd`/`*.psd1` to CRLF, and leaves everything else to
`* text=auto`. With `core.autocrlf` true on this machine that means the desktop app's TypeScript, its CSS and
the `.mjs` build scripts get CRLF in the working tree while their `.js` neighbours get LF. Staging
`desktop/scripts/sync-cli.mjs` on 2026-09-07 printed the warning that made this visible.

**Why it is not urgent:** nothing breaks. Vite, `tsc` and node all read either ending, and the repository
content is normalised either way.

**Why it is worth doing:** a file whose ending flips produces a whole-file diff the next time anything
touches it, which buries the real change. The desktop tree is about to see a lot of edits.

**What to do:** add `*.mjs`, `*.mts`, `*.ts`, `*.tsx`, `*.css`, `*.json5` and `*.toml` to the LF group,
then run `git add --renormalize .` in **one** commit that does nothing else, so the churn is isolated and
reviewable. Confirm afterwards with a raw byte count (`tr -dc '\r' < file | wc -c`), **never** with
`grep -c $'\r$'` - that has reported every file as CRLF here, including pure-LF ones.

**Do not** do it in the same commit as feature work, and do not renormalise while another writer has
uncommitted changes in `desktop/`.

A number is never reused: the next task is TASK-003.

**Closed 2026-09-07**, commit `674c8dd`. The eight missing types were added to the LF group -
`*.mjs`, `*.cjs`, `*.ts`, `*.mts`, `*.tsx`, `*.css`, `*.html`, `*.toml` - and
`git add --renormalize .` moved **no content**: the only file in the resulting commit was
`.gitattributes` itself. That is the evidence the repository bytes were already normalised and this
was a working-tree fix, not a rewrite. `git check-attr eol` now answers `lf` for a `.ts`, a `.mjs`
and a `.toml`, and the raw CR-byte count is 0 for each.

It also surfaced a separate divergence that is **not** closed by it and is filed as TASK-003: 36 of
the 37 files pinned to `eol=crlf` are LF in this working tree, invisibly to `git status`.

---

### DONE-003 - 36 of 37 files pinned to CRLF are LF in this working tree

`.gitattributes` pins `*.ps1`, `*.psd1` and `*.cmd` to `eol=crlf`, and `git check-attr eol` confirms it.
But measured by raw carriage-return byte count on 2026-09-07, **36 of those 37 files have zero CR bytes** -
only `windowsweep.cmd` is actually CRLF. Git does not report them as modified, because `eol=crlf` stores LF
in the repository and a working-tree LF file normalises to the same LF on the way in. The divergence is
therefore invisible to `git status`, to every gate, and to review.

**Why it is not urgent:** nothing breaks. PowerShell 5.1 reads LF without complaint - the self-test ran
151/151 and a real run freed 3.6 GiB from exactly these files.

**Why it is worth doing:** a fresh `git clone` on another machine *does* get CRLF, so this working tree and
that one differ byte-for-byte in every engine script. Any comparison between machines - a hash, a `cmp`, a
diff of an extracted tarball against a checkout - disagrees for a reason that has nothing to do with the
change being examined. The second-machine handoff is exactly that comparison.

**What to do:** with a genuinely clean tree, refresh the working tree from the index so the attributes are
applied - `git rm --cached -r . -q` then `git reset --hard`. Untracked files (`node_modules`, `target/`,
`temp/`, built installers) are not touched by this. Then re-measure with `tr -dc '\r' < file | wc -c`,
**never** with `grep -c $'\r$'`, which reports every file here as CRLF including pure-LF ones. Confirm the
engine still passes: `node bin\windowsweep.js --self-test --no-color`.

🔴 **Do not run it while any sub-agent holds an uncommitted tracked file.** `git reset --hard` discards
uncommitted tracked work, and a story writer or editor mid-dispatch is holding a draft under
`docs/story/drafts/`. Check `git status --short` is empty *and* that no agent is running.
🔴 **Guard the measurement against a missing path.** `tr -dc '\r' < nosuchfile | wc -c` prints `0`, which
reads identically to a correct LF result - a vacuous pass. Test `-f` first.

Two more patterns are missing from the same group and produced the same warning while this was being
written: `*.rs` (added in `8f0008e` after git warned that `engine.rs` would flip) and **`.env.example`**,
which matches no extension rule at all. Add `.env*` when working this task.

A number is never reused: the next task is TASK-008.

**Closed 2026-09-08**, commit `a730bf0` (the `.env*` pin) plus the working-tree refresh, which moved
no repository content and so produced no commit of its own. `.env*` was added to the `eol=lf` group first, because `.env.example` matched no extension rule
at all - `git check-attr eol` now answers `lf` for both `.env.example` files. Then, on a genuinely clean
tree with no sub-agent running, `git rm --cached -r . -q && git reset --hard` re-applied every attribute.

**Measured, guarded against the vacuous-pass this task warned about** (every path tested with `-f` first,
and by raw carriage-return byte count, never `grep -c $'\r$'`):

| file | pinned to | CR bytes before | CR bytes after |
|---|---|---|---|
| `lib/constants.ps1` | crlf | 0 | **93** |
| `windowsweep.ps1` | crlf | 0 | **316** |
| `windowsweep.cmd` | crlf | 6 | 6 (already correct) |
| `README.md` | lf | 0 | 0 |
| `package.json` | lf | - | 0 |
| `desktop/src-tauri/src/engine.rs` | lf | - | 0 |

So the CRLF files gained their carriage returns and the LF files did not, which is the whole point: this
working tree and a fresh `git clone` on the second machine now agree byte for byte, and any cross-machine
hash, `cmp` or extracted-tarball diff disagrees only for reasons that have to do with the change being
examined. `git status --short` is empty afterwards - the repository content never moved, only the working
tree - and the engine still passes `node bin\windowsweep.js --self-test --no-color` at **151/151, exit 0**.

---

### DONE-008 - a docs page can end below its own footer, and nothing notices

🔴 **This happened twice in one session, to two different pages, both times by me.** Every page under
`docs/` ends with a `Last Updated:` line. Appending a new section with `content + new_section` puts the new
text **after** that footer, so the page's last words become the new section and the footer sits in the
middle of it. Neither time did any gate see it: the markdown is valid, the build is green, the mirror is
byte-identical to a source that is itself wrong.

It was caught both times by a person reading the page - the humor-emotion reviewer on `safety-model.md`, and
the line editor on `reports-and-logs.md`. That is the whole problem: the only instrument that catches it is
someone reading to the bottom.

It matters more than a layout nit on a surface whose closing image is load-bearing. `safety-model.md` is
designed to end on *"Inspect before you trust"*, and its own opening sentence promises the page *"ends on
what has no undo"* - a promise the appended section silently broke.

**What to do:** add a gate. For every file under `docs/`, assert that the LAST non-blank line matches
`^Last Updated: \d{4}-\d{2}-\d{2}$`. Watch it fail on a plant - append a heading below a footer, see it go
red, remove it. Wire it into the same place the other doc gates run.

**Do not** fix it by removing the footers, and do not rely on remembering: the failure mode is that the
person appending is concentrating on the new text, which is exactly when a convention at the other end of
the file is invisible.

A number is never reused: the next task is TASK-009.

**Closed 2026-09-08, in the same session that filed it.** The gate is an inline PowerShell step in
`.github/workflows/ci.yml` rather than a script file, because the house rule bans standalone scripts. It
walks `docs/*.md`, skips the five records that legitimately have no footer, and fails if any page's last
non-blank line does not match `^Last Updated: \d{4}-\d{2}-\d{2}`.

**Watched failing on a plant, and the plant was the real defect**: a section appended below `faq.md`'s
footer. Red - *"faq.md ends on: This is the exact defect the gate exists to catch"* - then green once
removed.

Running it against the tree first found a third case the reviewers had not: `docs/desktop.md` had **no**
footer at all. It arrived from the story pipeline with its own front matter and never gained one, so it was
not the append defect but the same inconsistency from the other end. It has one now.

### DONE-005 - the consent notice promised analytics events that did not exist

**Closed 2026-09-12, on evidence rather than by a new change.** Both halves the task asked for had already
landed by the time this audit read the tree:

- **The events exist and are emitted.** `desktop/src/lib/events.ts` declares `screen.view` and
  `control.press` in the typed registry, `App.tsx` emits `screen.view` on every route change and
  `PrimaryButton.tsx` emits `control.press`, fanned out inside `track()` and never at a call site - commit
  `6f4706f` (2026-09-08). GA4's `send_page_view` stays `false` and Amplitude's `autocapture` stays `false`,
  so the sentence "Which screens you opened and which buttons you pressed" describes exactly what is sent.
- **The unverifiable claim was reworded, dummy first.** The Amplitude line no longer says "kept longer":
  the dummy's Home ledger (`desktop/design/windowsweep-click-dummy/wire.js`, amended 2026-09-08 with the
  reason in its comment) and `en.json`'s `consent.provider.amplitude.what` both read "The same events, in a
  second analytics tool." - a checkable claim about this product rather than a vendor-retention statement no
  file here could source.

Nothing was ever collected under a wrong sentence: no telemetry key reached a build before this closed, and
`desktop-v1.2.0` is the first build that carries the keys. The wire proof that the two events actually land
belongs to RW-101 / RW-115, not to this entry.

### DONE-004 - the elevated run has three gaps, all found by the 2026-09-07 fact-check

**Closed 2026-09-13 by A-DESK (v3 run W2), dummy first in every case.** All three gaps are closed in code;
the flow itself is NOT exercised live, because an agent session never starts an admin run.
- **It ran all six** -> each admin card carries its own switch; section 15 carries three options (Leave it /
  Reduced / Turn it off), because with no `--hiberfil` value the engine prints a hint and does nothing.
- **Three of six were refused on every run** -> `--i-understand-deep` is passed only after an explicit
  confirmation that appears when 15, 16 or 20 is chosen and names what each one does; until then the run
  button is blocked with the reason beside it. Rendered command lines read: default
  `--only 12,13,14 --elevate --yes`; with 16 ticked the run is blocked with "Confirm you understand the deep
  sections above."; after confirming, `--i-understand-deep` is added; with 15 set to "Turn it off",
  `--only 12,13,14,15,16 ... --i-understand-deep --hiberfil off`.
- **Nothing tailed the elevated child's log** -> `desktop/src/lib/run-tail.ts` reads the child's own log and
  report out of the shared run folder into Run's log pane; `readReport` and `listRunFiles` finally have a
  caller. The dummy's "tails the log" wording is now true.
- 🔴 **A fourth defect on the same screen, found while closing this one, FIXED in the main session:** "Measure
  without elevating" passed `--elevate --dry-run`, so it raised a UAC prompt. It now runs the engine's
  read-only `--scan` and reports the chosen sections' total; `elevatedArgs` no longer accepts `dryRun`, so
  the defect is a compile error (planted and watched: TS2353). Recorded in `desktop/design/README.md`.

**The entry as it was filed:**

The Elevation screen works and is not broken, but three things it implies are not true. Found while
fact-checking the `desktop-readme` surface; the copy was corrected so nothing false shipped, and the code
was left for its own task.

**1. Nothing tails the elevated child's log.** `readReport()` at `desktop/src/lib/engine.ts:179` has **no
caller anywhere** in `desktop/src`. The elevated child runs in its own console window (`lib/safety.ps1`
relaunches with `-Verb RunAs -Wait`), so its output never reaches the parent's stderr. The dummy's
`elevation.html` says the unelevated window "tails the log"; the draft's sentence was cut to "waits
unelevated" instead. **To do:** read the child's own report and log from the run folder
(`%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\<id>\`) and stream it into the Run screen's log pane -
`readReport` already exists for exactly this and has been dead code since it was written. Then restore the
dummy's wording, dummy first.

**2. Sections 15, 16 and 20 are refused on every elevated run.** `elevatedArgs()` at `engine.ts:172` builds
`['--only', ids, '--elevate', '--yes']` and never passes `--i-understand-deep`, which IS in the Rust
allowlist (`engine.rs:39`). `modules/runner.ps1:89-92` refuses any `Batch = 'deep'` section without it - 11,
15, 16 and 20. So the screen offers six admin sections and can only run three. The refusals do reach the
report, so the user is told; nothing is silent. 🔴 **This is not a straightforward "add the flag" fix** -
`--i-understand-deep` authorises irreversible, system-changing work, and the app adding it on the user's
behalf is a decision, not a default. Needs a dummy amendment naming the gate, and probably an explicit
per-section confirmation.

**3. It runs all six at once.** `elevation.lede` implies choosing ("ask for one"); the screen passes every
admin id. Either the copy or the screen is wrong, and the dummy decides which.

A number is never reused: the next task is TASK-011.

### DONE-006 - the catalogue's punctuation drifts from the dummy's, tree-wide

**Closed 2026-09-13 by A-DESK - on evidence, with nothing to change.** Every punctuation-bearing four-word
run in `desktop/src/i18n/locales/en.json` compared against the dummy's text: **105 match exactly, 0 differ,
72 have no dummy source** (app-only strings). The comparison was proved not vacuous: an ASCII hyphen planted
in `home.developerOff` reported `DRIFT=2`, and 0 after restoring. No engine file changed and the self-test
still prints `all 156 checks passed`. ⚠️ The dummy disagrees with ITSELF on one string - the gallery
(`g-tables.js:111`) writes "Report only – ..." with an en dash while `page-sections.js:82` uses a hyphen; the
app follows the Sections page. Filed as TASK-012.

**The entry as it was filed:**

The click dummy uses U+2013 and U+2014 where a dash is meant; the app's catalogue strings mostly use ASCII
hyphens. Found while closing D-14/15/16 on 2026-09-07, and **deliberately not swept then**: only the keys
inside those three defects were corrected, because a half-swept punctuation pass is worse than either end -
it leaves no way to tell a deliberate ASCII hyphen from a missed one.

**Why it is not urgent:** nothing breaks and no claim is false. It is a parity difference a GATE 4 pair can
legitimately flag as a mismatch on a screen nobody has changed.

**What to do:** one sweep across every `en.json` value against the dummy's source characters, in a commit
that does nothing else. 🔴 **Never sed it** - the engine's own console strings are ASCII-only by IRON rule 1,
so a global replace that reaches `lib/` or `modules/` breaks the ASCII self-test check. Scope the sweep to
`desktop/src/i18n/locales/` and prove it with the self-test still green.

A number is never reused: the next task is TASK-011.

### DONE-007 - `selbar-note` is styled nowhere, and `Picker.tsx` uses it

**Closed 2026-09-13 by A-DESK.** Every `className` in `desktop/src` compared against the app's **333 CSS
selectors: zero orphans** (the three apparent hits were a variable, a comparison value and a template prefix
whose six classes all exist). The sibling the ticket feared was in the DUMMY: `picker.html:120` read
`class="t-sm ink-3 t-sm ink-3"`, left behind when `6f4706f` removed `selbar-note` - fixed. Two dummy-only
dead classes remain (`t-base`, `t-2xl`), filed with the dash inconsistency as TASK-012.

**The entry as it was filed:**

The class `selbar-note` appears in neither the app's CSS nor the dummy's, and `desktop/src/screens/Picker.tsx`
renders a note with it - so that note has no styling today. Found 2026-09-07 while building the Sections
selection bar, which is why the new `SectionSelbar.tsx` deliberately does **not** use it.

This is the same family as the `logpane` defect: a class name that reads as intentional, resolves to nothing,
and is invisible to every gate because unknown CSS classes are not an error anywhere.

**What to do:** decide whether the note wants the dummy's existing note treatment or its own rule, add it to
the dummy first, then the app. And sweep for siblings - `grep` every `className` string in `desktop/src`
against the selectors that actually exist in the app's CSS. That sweep is the valuable half of this task.

### DONE-009 - the reclaim map has 28 unlabelled tab stops, and `role="img"` is why

**Closed 2026-09-13 by A-DESK, dummy first (`reclaim-map.js`), verified in the running dev build.** On Home
after a scan: **28 tiles, all `tabindex="-1"`, none `role="button"`, and ONE focusable element inside the map
(was 29)**. The map's label reads "Reclaim map: 28 targets across 9 sections, 20.7 GB reclaimable in total...";
the table carries 28 labelled switches ("Include cache 1 in the next run, 2.0 GB"). Planted and watched: tiles
back to `tabIndex={0}` -> `FAIL: 28 focusable tiles, 29 focusable elements inside the map frame (expected 0 and
1)`; restored -> `PASS`. ⚠️ Not measured: the row height of the 28 new table switches on Home - if a row is
shorter than 44 px, neighbouring hit areas overlap by a few pixels (RW-119's capture pass measures it).

**The entry as it was filed:**

**Decided 2026-09-08, under the agent's design authority; not an owner question.**

`reclaim-map.js` sets `role="img"` on the `<svg>` **and** `tabindex="0" role="button"` with an `aria-label`
on every tile. `role="img"` makes the subtree **presentational**, so all 28 accessible names are computed and
then discarded while all 28 tab stops remain. Measured on the rendered page: **28 of the 58 focusable stops
on Home, 48% of the page, are inside the map** and announce roughly nothing. That is the cost of both
approaches with the benefit of neither.

**The decision:** the map becomes **one** stop - `role="img"` kept, with its summary `aria-label`, and
`tabindex="-1"` on the tiles - and **exclusion moves to the table rows**. `ReclaimMapTable` already carries
the same data as a real `<table>` with the `Idle (days)` column, and the app's own source calls it *"the
primary accessible representation, not a consolation prize"*. This keeps the drawn encoding for sighted users
and gives everyone else labelled, ordered controls.

🔴 **Dummy first.** `desktop/design/windowsweep-click-dummy/reclaim-map.js:207-215` is amended with the
reason written into `desktop/design/README.md` beside it, and only then does the app follow - the table needs
a per-row toggle it does not have yet, so this is real work and not an attribute change.

**Found while:** closing GATE 4 parity for wave 4b by reading the rendered DOM.

A number is never reused: the next task is TASK-011.

### DONE-010 - the 17px section switches are a pointer problem, and `.btn-sm` is not

**Closed 2026-09-13 by A-DESK, dummy first (`shared.css`), verified in the running dev build.** On Sections:
19 switches, the visible control still **30.4 x 17**, the hit area **44 x 44 px**; a point 8 px above a switch
and one 5 px to its left both land on it; the closest two switches are 59 px apart centre to centre, so no two
hit areas overlap. Planted and watched: the hit-area rule removed -> `FAIL: hit area auto x auto (need >=44x44),
above=false left=false`; the control measured 30.4 x 17 in both states, which is the proof there is no visual
change.

**The entry as it was filed:**

**Decided 2026-09-08, under the agent's design authority; not an owner question.**

`.btn-sm` computes to **28px** against the fleet's 44px floor. It is **byte-identical to the dummy's own
rule**, and every other control class was checked and matches too - so the app implements the approved spec
exactly and this is not a parity defect.

**The decision on `.btn-sm`: leave it.** 44px is a **touch** floor. This window is desktop-only
(`minWidth: 760`), mouse and keyboard, with no touch input, and changing it in the app alone would *create* a
divergence from the dummy.

**The decision on the switches: raise them.** `.switch` measures **17px**, and there are 19 on the Sections
screen. That is small for a **pointer** target regardless of touch, which is a different argument from the
one that lets `.btn-sm` stand. Raise the **hit area** rather than the visual size, so the control looks as
approved and is easier to hit - dummy first, then the app.

**Found while:** the same GATE 4 parity pass.

🔴 **This line said TASK-008 in all FOUR places it appears, and `DONE-008` has existed in
`docs/DONE-TASKS.md` since 2026-09-08.** Every copy would have handed the next session a number already
spent - which is the exact precedent the rule cites. All four are corrected. A number is never reused: the
next task is **TASK-011**.

### DONE-011 - `is_platform_admin()` still grants EXECUTE to `service_role`

**Closed 2026-09-13 in the main session, the same day it was filed.** Migration
`20260912202759_revoke_is_platform_admin_service_role.sql`, scaffolded by `yarn db:custom` so the prefix and the
journal entry came from drizzle-kit, with a reviewed rollback beside it. `supabase db push --linked --dry-run`
listed exactly that one file; the push applied it. Verified FROM `pg_proc`, not from the file or the push output:
`is_platform_admin  anon=F auth=T svc=F  postgres=X/postgres | authenticated=X/postgres`. The full census of the
seven `public` functions now shows `service_role` executing nothing of ours; the only role-wide grant left is
`rls_auto_enable`, Supabase's own event-trigger function, already recorded as a probed false positive.
⚠️ The CLI's cached login on this machine belongs to a different Supabase account and is refused with 403, so the
push needs the project account's own PAT and the database password in the environment, read from the vault.

**The entry as it was filed:**

- **What:** `pg_proc.proacl` for `public.is_platform_admin()` reads
  `{postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres}`. Its migration
  (`20260908065314_platform_admin_function.sql`) revoked only `from public, anon`, and Supabase's default ACL
  names `service_role` explicitly, so revoking PUBLIC never removed it. `authenticated` MUST keep EXECUTE -
  every admin RLS policy calls this function, and a policy is evaluated as the querying user.
- **Do:** one forward migration through `yarn db:custom`:
  `revoke execute on function public.is_platform_admin() from service_role;` then prove it from `proacl`,
  never from the file. `service_role` holds `rolbypassrls`, so no policy ever evaluates it for that role,
  which is why nothing depends on the grant.
- **Found while:** the v3 run's W1 (the `delete_my_account()` migration), 2026-09-12, by the four-role
  census of every `public` function.
- **Why not fixed there:** that migration's scope was one new function; migrations are forward-only, and a
  privilege change to a policy helper deserves its own reviewable file. **Impact today is nil** - with a
  secret key `auth.uid()` is null, so it returns false. It is a consistency gap with the four-role standard
  the newer migration follows, not a hole.
- **Priority:** low.

### DONE-012 - the desktop click dummy disagrees with itself in two small places

**Closed 2026-09-13 in the main session.** (1) `g-tables.js:111` now writes "Report only - ..." with the
hyphen the Sections page and the app use. (2) Both classes are STYLED rather than removed, each pinned to the
token that equals what it already rendered - `.t-base { font-size: var(--fs-base) }` (it inherited the 16px body
size) and `.t-2xl { font-size: var(--fs-xl) }` (32px, what the UA's `h1 { 2em }` gave it in a file with no reset) -
so nothing moves on screen and both now follow the Text size axis. `.t-2xl` is now defined identically in the dummy
and in the app's `shell.css:1703`, which had pinned it after a screenshot pair caught the app drawing the Splash
wordmark at half size.

**The entry as it was filed:**

- **What:** (1) the gallery (`desktop/design/windowsweep-click-dummy/g-tables.js:111`) writes "Report only –
  ..." with an en dash while the Sections page (`page-sections.js:82`) writes it with a hyphen; the app
  follows the Sections page. (2) `t-base` (five dummy files, including the card code in `page-elevation.js`)
  and `t-2xl` (`splash.html`) are used in the dummy and styled by no rule in its CSS.
- **Do:** make the gallery match the Sections page; either style the two classes or remove them. Dummy-only -
  the app is already consistent (TASK-007 found zero orphan classes across 333 selectors).
- **Found while:** TASK-006 and TASK-007, 2026-09-13 (A-DESK).
- **Why not fixed there:** outside those tasks' stated scope, and neither changes what a user sees.
- **Priority:** low.

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
