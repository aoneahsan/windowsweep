# readme — the repository README

<!-- story-lint: allow "elevate" -->

Content-map row **1** · surface `README.md` · awareness **problem-aware, solution-sceptical** · structure
**problem → the gamble they already lost → the guarantees → proof → install** (PAS at the opener, then plain
reference prose) · tone **P dominant, R strong, W once** · length **the existing structure and anchor set are
fixed; no section grows**.

This is a slot inventory rather than a page, the same shape the three desktop drafts used. Nothing is
reorganised. Every string where
voice actually lives is listed once, numbered, with its line and its section heading; the text that ships sits
inside a fence of its own, and the **Was** and **Change** lines sit outside it. Where a string is already on
voice it is kept and said so.

Two rules from the Bible govern the whole file. **The README leads with what the product refuses, not with
what it deletes** — so the refusal moves into the opening paragraph, ahead of the cache list it currently
opens on. And **the Limitations section is part of the pitch rather than an appendix**, which is why S-076
adds a framing line above those bullets instead of leaving them to read as a disclaimer.

## Scope

| Covered | Slots |
|---|---|
| §A header block, badges, callout, opening paragraph, at-a-glance | S-001 – S-013 |
| §B Why windowsweep | S-014 – S-021 |
| §C Features | S-022 – S-031 |
| §D Platform Support · Requirements | S-032 – S-038 |
| §E Installation · Quick Start | S-039 – S-047 |
| §F Usage prose | S-048 – S-058 |
| §G Configuration · Examples · Advanced Features | S-059 – S-070 |
| §H Recovery & Troubleshooting · Limitations | S-071 – S-084 |
| §I FAQ · Documentation · Support | S-085 – S-096 |
| **Total** | **96** |

**Not covered, and why.** The reference tables are factual records of the engine's own vocabulary and are
governed by IRON rule 4 rather than by voice: the section catalogue (lines 202–229), the mode and option
tables (286–315), the environment table (269–275), the badge URLs, the repository tree (442–450), the
changelog paragraph, the licence note, the author block, the links table and the keyword line. The
Contributing pointer is governance boilerplate, listed out of scope in `content-map.md` §2. The **Desktop
app** section is a separate surface and lives in `desktop-readme.md`, which also carries the one companion
edit this file needs when that section lands (S-021).

---

## §A Header, callout, opening

### S-001 · README.md:3 · header block · logo `alt`
```
windowsweep logo
```
**Was:** windowsweep logo

**Change:** none.

### S-002 · README.md:7 · header block · the tagline line
```
Developer-aware Windows cleanup CLI: dry-run first, personal folders refused, zero install via npx.
```
**Was:** Safe-by-default Windows cleanup CLI - developer-aware, dry-run first, zero install via npx.

**Change:** rewritten, and the reasoning lives in `tagline.md` rather than here — this line is one of five
places that string appears and it changes with the other four or not at all. In short: the Bible's band R
delivers reassurance as a specific refusal, never as the adjective "safe", and "personal folders refused" is
the same claim made checkable. 99 characters, ASCII only.

### S-003 · README.md:16 · header block · the links line
```
Docs · AI Guide · npm · GitHub · Changelog · Contributing · Support
```
**Was:** the same seven labels.

**Change:** none. Every target is a GitHub blob URL rather than the documentation domain, which has never
resolved, and that is the correct choice until it does.

### S-004 · README.md:20-22 · the IMPORTANT callout, first two sentences
```
**This tool deletes files.** Most of what it removes are caches that rebuild themselves; personal files it lists go to the Recycle Bin; sections 11 and 16 - emptying the Recycle Bin, clearing the event logs - are permanent, and they are two of the four sections `--i-understand-deep` gates.
```
**Was:** **This tool deletes files.** Most of what it removes are caches that rebuild themselves; personal
files it lists go to the Recycle Bin; two sections (emptying the Recycle Bin, clearing event logs) are
permanent and gated behind a separate flag.

**Change:** the flag is named and the arithmetic is corrected. "A separate flag" is the one thing on this
line a reader cannot look up. And `--i-understand-deep` gates **four** sections, 11, 15, 16 and 20, of
which two carry the `permanent` tier. The old wording let a reader infer that the gate and the permanence
were the same set. Checkable against `WS_SECTIONS` in `lib/constants.ps1`: `Batch = 'deep'` on 11, 15, 16,
20; `Tier = 'permanent'` on 11 and 16.

### S-005 · README.md:23-25 · the IMPORTANT callout, the two commands
```
Start with `npx windowsweep --scan`, which deletes nothing, then `npx windowsweep --dry-run --all --yes`, which shows exactly what a real run would remove.
**Windows only** - npm refuses to install it elsewhere.
```
**Was:** identical.

**Change:** none. Two commands in the order a sceptic runs them, each labelled with what it does rather than
with what it is called. The platform refusal closes on the mechanism that enforces it (`"os": ["win32"]` in
`package.json`; the Node launcher exits 2 on any other platform).

### S-006 · README.md:27-28 · the opening paragraph, sentence 1
```
`windowsweep` refuses your documents, your credentials and your browser state outright. No flag changes that.
```
**Was:** (new sentence — the paragraph previously opened on the cache list at S-007.)

**Change:** added, and this is the change the Bible's per-surface rule asks for. The old paragraph opened on
what the tool removes and reached restraint in its fourth sentence, which is the wrong order for a reader who
has already been burned by a cleaner. Twelve words, then four. The refusal is checkable: 66 protected
subtrees, 50 wildcard patterns and 13 protected file names are built in `Initialize-Safety`
(`lib/safety.ps1`), and steps 1 to 3 of `Remove-PathSafe` carry the comment "No flag bypasses steps 1-3".

### S-007 · README.md:27-29 · the opening paragraph, sentence 2
```
What it does remove is the disk space that quietly disappears on a Windows machine: package-manager and build caches, browser and app caches, Windows temp and update leftovers, stale `node_modules`, half-finished downloads.
```
**Was:** `windowsweep` reclaims the disk space that quietly disappears on a Windows machine:
package-manager and build caches, browser and app caches, Windows temp and update leftovers, stale
`node_modules`, half-finished downloads.

**Change:** the opening clause becomes the hinge from S-006 instead of the paragraph's first words. The list
itself is unchanged and correct against the catalogue.

### S-008 · README.md:29-31 · the opening paragraph, sentence 3
```
It names every path before it touches one, keeps the caches you used in the last 100 days, never follows a junction, and makes no network calls at all.
```
**Was:** It is a PowerShell tool with a thin Node launcher, so `npx windowsweep` runs it with nothing to
install. What sets it apart is restraint: it asks whether you are a developer and keeps the caches you used
in the last 100 days, it names every path before touching it, it never follows a junction, and it makes no
network calls.

**Change:** rewritten and shortened. "What sets it apart is restraint" is a sentence that tells the reader
what to conclude; the four facts after it do that work on their own, so the frame goes and the facts stay.
The developer question moves to S-009 where the mechanism it belongs to is described. Four clauses, no
adjectives.

### S-009 · README.md:29-30 · the opening paragraph, sentence 4
```
One question on the first run decides whether toolchain caches are offered at all. It is a PowerShell engine behind a thin Node launcher, so `npx windowsweep` runs it with nothing to install.
```
**Was:** (split out of the sentence at S-008.)

**Change:** the developer question and the runtime story become their own sentences. "PowerShell tool"
becomes "PowerShell engine", which is the word the rest of the project uses — the consent screen says "the
cleanup engine makes zero network calls", and one noun for one thing is worth more than variety here.

### S-010 · README.md:32-33 · the opening paragraph, closing sentence
```
It is the Windows member of a family with [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) and [macleanup](https://github.com/aoneahsan/macleanup).
```
**Was:** identical.

**Change:** none. Both links resolve to real repositories, and the sentence ends the paragraph on a plain
fact rather than a summary of the four above it.

### S-011 · README.md:42 · at-a-glance · Install size
```
~109 kB packed · ~366 kB unpacked · 44 files · no dependencies
```
**Was:** identical.

**Change:** none. Verified this session: `npm pack --dry-run` reports package size 109.0 kB, unpacked size
365.7 kB, total files 44, against a `files` allowlist with no `dependencies` block in `package.json`. This is
the kind of row the version cascade already keeps current.

### S-012 · README.md:43 · at-a-glance · Undo
```
Recycle Bin for personal files; none for caches (they regenerate)
```
**Was:** identical.

**Change:** none. The safety constraint that a deletion is never implied to be reversible is met in seven
words, and the semicolon is this voice's own punctuation.

### S-013 · README.md:44 · at-a-glance · Status
```
Stable · 1.1.0, released 2026-09-04
```
**Was:** Stable · actively maintained

**Change:** "actively maintained" is an adjective standing in for a date, which the fingerprint's tells list
names explicitly. The date is checkable — `gh release list` shows `v1.1.0` published 2026-09-04, after
`v1.0.0` and `v1.0.1` the day before — and it says the same thing without asking to be believed. This row is
already inside the version cascade (IRON rule 7), so keeping it current costs nothing new.

---

## §B Why windowsweep

### S-014 · README.md:76-79 · Why windowsweep · paragraph 1
```
A Windows machine that is also a development machine fills up in places Disk Cleanup has never heard of: the Yarn and npm caches, Gradle, Cypress and Playwright browsers, Android emulator images, Docker's virtual disk, `node_modules` for a project you finished in spring, editor caches, two hundred profiles' worth of Chrome cache. Clearing them by hand means keeping a private list of paths and remembering which ones bite back.
```
**Was:** identical.

**Change:** none. This is the Problem beat and it is already written at the reader's level: named tools, a
specific season, and a closing clause that carries the whole objection in three words. "Bite back" is the
file's one deliberate W moment and it sits nowhere near a destructive command.

### S-015 · README.md:81-82 · Why windowsweep · paragraph 2, the gamble
```
A cleaner that empties every cache it finds trades one problem for another: the next `yarn install` downloads the lot again, and the afternoon is gone. `windowsweep` takes the narrower path.
```
**Was:** A cleaner that wipes every cache it finds trades one problem for another: the next `yarn install`
re-downloads twelve gigabytes and your afternoon is gone. `windowsweep` takes the narrower path.

**Change:** two fixes. "Twelve gigabytes" is a figure with no source anywhere in this repository, and the
Bible's rule is absolute: numbers are exact and sourced, and the tool never estimates in prose. It is
replaced by "the lot", which is true on any machine. "Wipes" also goes — the banned-tone list rules out
triumphalism about deletion, and describing a rival's behaviour is not an exemption from the register.

### S-016 · README.md:87 · Why windowsweep · comparison table, Default action
```
prune files idle 100+ days; keep the newest version of every tool
```
**Was:** identical.

**Change:** none, recorded so a transcriber does not soften it. The cell states a rule with a number in it,
which is what makes the row next to it ("wipe the whole cache") a comparison rather than a boast.

### S-017 · README.md:88 · Why windowsweep · comparison table, Personal folders
```
hard refusal, no flag bypasses it
```
**Was:** identical.

**Change:** none. Five words, band R. The claim is asserted by self-test check [6], whose output line reads
"105 declared targets, none inside a protected path", and that check fails the build rather than a review.

### S-018 · README.md:92 · Why windowsweep · comparison table, Network calls
```
none
```
**Was:** none

**Change:** none. One word beside "Microsoft telemetry" and "varies" does more than a sentence would.

### S-019 · README.md:94 · Why windowsweep · the number line
```
Nothing here can promise a number. How much comes back depends on your disk; `--scan` measures it.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 6, near enough verbatim, and the single most load-bearing line
in the section: it is what buys the rest of the page its credibility with a reader who has read this claim
elsewhere as a figure.

### S-020 · README.md:96-98 · Why windowsweep · not the right tool
```
**Not the right tool when** you want a graphical, set-and-forget cleaner; when you are on Linux or macOS (use the siblings); when you want an undo for caches (there is none - they regenerate); or when you are looking for a security scanner or a registry cleaner. It reclaims disk space, nothing else.
```
**Was:** identical.

**Change:** none. Four refusals and a five-word closer. Bible section 10 asks that no security property be
claimed, and this is where that is discharged.

### S-021 · README.md:96 · Why windowsweep · not the right tool, first clause

**Companion edit, not a change here.** The first clause, "you want a graphical, set-and-forget cleaner",
stops being true on the day the desktop app has a release, because the graphical half of it will exist. The
replacement clause is specified in `desktop-readme.md` and lands in the same change that inserts the Desktop
app section, not before. Recorded here so the two cannot drift: as written today the clause is correct, since
no desktop installer has been published.

---

## §C Features

### S-022 · README.md:103-104 · Features · Developer mode
```
**Developer mode** - one question on the first run. Yes keeps package, build and test-runner caches used in the last 100 days and the newest version of every versioned tool; no clears them completely.
```
**Was:** identical.

**Change:** none. The glossary's own term, then the answer's consequence in each direction. No adjective
anywhere.

### S-023 · README.md:105-107 · Features · the sections
```
**26 numbered sections** - from package-manager caches to Windows Update leftovers, plus three read-only audits (global packages, idle programs, startup items) that never delete anything. Numbers are a public contract.
```
**Was:** **26 numbered sections** - from package-manager caches to Windows Update leftovers, plus four
read-only audits (global packages, orphaned app data, idle programs, startup items), each naming its paths
before it acts. Numbers are a public contract.

**Change:** a factual correction, and the most consequential one in this draft. There are **three**
read-only audits, not four: sections 22, 24 and 25 carry `Tier = 'report'` and `Batch = 'safe'` in
`WS_SECTIONS`, and the `audit` profile is `@(0, 21, 22, 24, 25)`. **Section 23 is not an audit** — it is
`Tier = 'recycle'`, `Batch = 'interactive'`, and it sends orphaned application data to the Recycle Bin after
a person picks it row by row. Calling it read-only in the Features list is the one sentence in this file that
could make a reader trust a deletion they were not expecting. The README already contradicts itself on it at
line 233 ("The three *audit only* sections"), and `llms.txt` gets it right, so the machine-readable surface
and the human one currently disagree. The trailing clause also changes: "each naming its paths before it
acts" was attached to the audits, which is where it makes least sense, since a read-only audit does not act.

### S-024 · README.md:108-111 · Features · the chokepoint
```
**One deletion chokepoint** - refuses drive roots, Windows, Program Files, your profile root, personal folders, credentials, toolchains and browser or editor state; asserts every deletion sits inside its declared target; never follows a junction or symlink; handles paths beyond 260 characters; skips files another program has open. Self-test check [6] walks all 105 declared targets and fails if one resolves inside a protected path.
```
**Was:** **One deletion chokepoint** - refuses drive roots, Windows, Program Files, your profile root,
personal folders, credentials, toolchains and browser or editor state; asserts every deletion sits inside its
declared target; never follows a junction or symlink; handles paths beyond 260 characters; skips files
another program has open.

**Change:** one sentence added. The bullet lists five guarantees and offers no way to check any of them; the
new sentence names the check that does, with the number it prints. Measured this session on Windows 10
19045: `+ 105 declared targets, none inside a protected path`. It makes the product's central motif, one door
and one guard, verifiable in a line.

### S-025 · README.md:112-113 · Features · the dry-run
```
**A dry-run that writes nothing** - `--dry-run` short-circuits every deletion and every destructive command and reports an exact estimate. `--scan` and `--list-targets` are read-only.
```
**Was:** identical.

**Change:** none. The rehearsal motif, stated as a mechanism rather than as a promise, and self-test check
[7c] hashes the fixture tree before and after to hold it.

### S-026 · README.md:114-115 · Features · personal files
```
**Personal files go to the Recycle Bin** - partial downloads and large stale files are listed, you pick, and Windows keeps the undo.
```
**Was:** identical.

**Change:** none. "You pick" is fingerprint diction and the last clause puts the undo where it actually
lives, which is not in this tool.

### S-027 · README.md:116-117 · Features · batch policy
```
**Batch policy** - `--all` runs the safe batch only; deep sections need `--i-understand-deep`; personal sections never run unattended.
```
**Was:** identical.

**Change:** none. Checkable against `WS_SAFE_BATCH = @(0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21)` and self-test
check [12], which asserts every `Read-MultiSelect` call in `modules/` carries `-NoAutoYes`.

### S-028 · README.md:118-119 · Features · admin awareness
```
**Admin awareness** - sections that need Administrator rights skip with the exact command when the console is not elevated; `--elevate` relaunches through a UAC prompt.
```
**Was:** identical.

**Change:** none. "Skip with the exact command" is the behaviour a reader meets, described as what they will
see rather than as a capability.

### S-029 · README.md:120 · Features · the running-app guard
```
**Running-app guard** - an open browser, editor or app keeps its caches; the tool tells you which to close.
```
**Was:** identical.

**Change:** none. Band R: the reassurance is a thing the tool declines to do.

### S-030 · README.md:121-122 · Features · session reports
```
**Session reports** - schema-versioned JSON, exportable to Markdown or a self-contained HTML page, plus `--json` for scripts.
```
**Was:** identical.

**Change:** none.

### S-031 · README.md:123-125 · Features · self-test and offline
```
**Self-test** - 151 checks prove the guards on your machine with a real junction, a 445-character path and a dry-run fixture before you trust it.
**Offline by design** - zero network calls, no telemetry, no update check; check [9] greps the source for HTTP and socket calls and fails the run if it finds any. Crash bundles stay on disk.
```
**Was:** **Self-test** - 151 checks prove the guards on your machine with a real junction, a 400-character
path and a dry-run fixture before you trust it. / **Offline by design** - zero network calls, no telemetry,
no update check. Crash bundles stay on disk.

**Change:** two edits. The path fixture is **445** characters, not 400 — the self-test prints
`+ long path (445 chars) removed`, and a rounded number in a file whose whole argument is that its numbers
are exact is the wrong kind of approximation. And the offline bullet gains the mechanism: three negations in
a row invite the question "says who", and check [9] answers it. 151 is correct and was re-run this session:
`+ all 151 checks passed`, exit 0.

---

## §D Platform Support and Requirements

### S-032 · README.md:132 · Platform Support · Windows 11
```
Same engine and PowerShell hosts; a real run on Windows 11 is on the verification list ([roadmap](https://github.com/aoneahsan/windowsweep/blob/main/remaining-work-summary.md))
```
**Was:** identical.

**Change:** none, and worth defending: a supported row that admits no real run has happened yet is the
single most on-voice cell in the file. Restored hedging of exactly the kind the fingerprint calls correct.

### S-033 · README.md:133 · Platform Support · Windows 10
```
The primary development target; every real run so far
```
**Was:** identical.

**Change:** none.

### S-034 · README.md:134 · Platform Support · Windows Server
```
Uses nothing newer than 1809; CI runs the self-test and a dry-run on Windows Server (`windows-latest`) on every push, but no real cleanup has been run on Server
```
**Was:** identical.

**Change:** none. The ⚠️ marker, the evidence and the gap, in one cell.

### S-035 · README.md:135-136 · Platform Support · Linux and macOS
```
`os: ["win32"]` makes npm refuse to install; use [linux-cleanup](https://github.com/aoneahsan/linux-cleanup)
Use [macleanup](https://github.com/aoneahsan/macleanup)
```
**Was:** the same pair.

**Change:** none.

### S-036 · README.md:143 · Requirements · PowerShell
```
Ships with Windows 10 and 11; the engine is written for it. PowerShell 7 also works (`--pwsh`)
```
**Was:** identical.

**Change:** none.

### S-037 · README.md:145 · Requirements · Administrator rights
```
Only sections 12-16 and 20 (Windows Update cache, Disk Cleanup engine, DISM, hibernation, event logs, disk-image compaction)
```
**Was:** identical.

**Change:** none. Six sections named six ways, agreeing with the elevation screen's "Six sections need
Windows to ask your permission" and with the six `Admin = $true` rows in `WS_SECTIONS`. Three surfaces, one
count.

### S-038 · README.md:148 · Requirements · the closing line
```
`windowsweep --self-test` reports which optional tools are missing on your machine.
```
**Was:** identical.

**Change:** none. Ends the section on a command rather than a summary, which is this voice's habit.

---

## §E Installation and Quick Start

### S-039 · README.md:153 · Installation · lead-in 1
```
No install needed:
```
**Was:** No install needed:

**Change:** none. Three words.

### S-040 · README.md:159 · Installation · lead-in 2
```
To keep it on your `PATH`:
```
**Was:** To keep it on your `PATH`:

**Change:** none.

### S-041 · README.md:165 · Installation · lead-in 3
```
Or clone the repository and run it without Node:
```
**Was:** identical.

**Change:** none.

### S-042 · README.md:173-176 · Installation · the launcher paragraph
```
Both launchers start PowerShell with `-ExecutionPolicy Bypass`, so the machine's script policy never blocks a run. Logs and reports land in `%USERPROFILE%\.windowsweep\` on every path - outside the npm cache, so history survives `npx` evictions.
```
**Was:** identical.

**Change:** none. Two mechanisms and the reason for the second one, which is the sort of detail only someone
who has lost a history to an `npx` eviction would write down.

### S-043 · README.md:176 · Installation · the docs pointer
```
Full detail: [Installation](https://github.com/aoneahsan/windowsweep/blob/main/docs/installation.md).
```
**Was:** identical.

**Change:** none.

### S-044 · README.md:181 · Quick Start · lead-in
```
Prove the guards, look, rehearse, then reclaim:
```
**Was:** Prove the guards, look, rehearse, then clean:

**Change:** "clean" is the glossary's banned verb and the replacement is its named substitute. The four
verbs now match the four commands in the fence beneath them one for one, which they did not before —
"reclaim" is what the fourth command does.

### S-045 · README.md:184-187 · Quick Start · the four commands
```
npx windowsweep --self-test
npx windowsweep --scan
npx windowsweep --dry-run --all --yes
npx windowsweep
```
**Was:** identical.

**Change:** none. The rehearsal motif in four lines: prove, measure, rehearse, perform, and the third and
fourth differ by one flag.

### S-046 · README.md:190-191 · Quick Start · the walkthrough sentence
```
The last command is the guided walkthrough: it asks the developer question, shows a pre-scan, then visits each section with `a` run / `s` skip / `q` quit and a running total.
```
**Was:** identical.

**Change:** none. The three keys are the ones the walkthrough actually binds.

### S-047 · README.md:190 · Quick Start · the missing sentence

**Change:** none, and recorded so nobody adds one. There is no closing reassurance after S-046 and there
should not be. The section ends on the keys a reader will press.

---

## §F Usage prose

### S-048 · README.md:198-200 · Usage · the tier sentence
```
**Tier** says what happens to the data: *report* deletes nothing, *rebuilds* comes back on its own, *slow* comes back but costs minutes, *Recycle Bin* is recoverable until you empty it (`--list` shows this tier as `recycle`), *permanent* is not, *config* changes a setting.
```
**Was:** identical.

**Change:** none. Six tiers are defined by consequence rather than by name; the `--list` key is given where
it differs from the label; *permanent* gets two words. This sentence is the reason the table under it
does not need a legend.

### S-049 · README.md:231-232 · Usage · the batch sentence, part 1
```
*Safe* sections run in `--all`; *opt-in* ones run when named in `--only` or a profile; *deep* ones also need `--i-understand-deep`; *interactive* ones never run unattended unless you pass a selection.
```
**Was:** identical.

**Change:** none. Four batch kinds, four rules, semicolons doing the joining.

### S-050 · README.md:232-235 · Usage · the batch sentence, part 2
```
The three *audit only* sections are read-only and safe, but stay out of `--all` so a cleanup run is a cleanup run - `--profile audit` is where they live.
```
**Was:** identical.

**Change:** none. It is already right, and it is the sentence that proves S-023 was wrong: the count here is
three. "A cleanup run is a cleanup run" is the file's second W moment and its last.

### S-051 · README.md:235 · Usage · the sections pointer
```
Every section is documented in [Sections 0-25](https://github.com/aoneahsan/windowsweep/blob/main/docs/sections.md).
```
**Was:** identical.

**Change:** none.

### S-052 · README.md:237 · Usage · sub-heading
```
### Reclaim interactively
```
**Was:** ### Clean interactively

**Change:** the glossary's banned verb in a heading. Checked before changing it: `grep -rn` across both
repositories for `clean-interactively`, `clean-unattended` and `system-level-cleanup` returns nothing, so no
anchor, sidebar, docs page or table of contents links to it — the file's own table of contents lists only
the `##` headings. The anchor contract is therefore untouched.

### S-053 · README.md:244 · Usage · sub-heading
```
### Reclaim unattended
```
**Was:** ### Clean unattended

**Change:** same reason as S-052, same evidence.

### S-054 · README.md:196 · Usage · sub-heading
```
### The sections
```
**Was:** ### The sections

**Change:** none.

### S-055 · README.md:254 · Usage · sub-heading
```
### System-level cleanup
```
**Was:** ### System-level cleanup

**Change:** none. "Cleanup" is a noun here and is the project's own category word — it is in the npm
keywords, in `docs/`, and in the approved consent screen's "the cleanup engine makes zero network calls".
The glossary bans `clean` and `sweep` as **verbs**, which this is not.

### S-056 · README.md:252 · Usage · the `--yes` sentence
```
`--yes` applies to regenerable caches only. No flag combination batch-deletes personal files.
```
**Was:** identical.

**Change:** none. A rule, then its absolute form, seven words apiece. Self-test check [12] holds the second
one.

### S-057 · README.md:260-261 · Usage · the system profile sentence
```
Relaunches through a UAC prompt and runs the Windows Update, Disk Cleanup and DISM sections. Add the hibernation file with `--only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate`.
```
**Was:** identical.

**Change:** none. The three sections named match `WS_PROFILES['system'] = @(12, 13, 14)`.

### S-058 · README.md:257 · Usage · the system command
```
windowsweep --profile system --yes --elevate
```
**Was:** identical.

**Change:** none.

---

## §G Configuration, Examples, Advanced Features

### S-059 · README.md:266-267 · Configuration · the opening
```
There is no configuration you must do. Defaults live in `%USERPROFILE%\.windowsweep\config.json` (`developer`, `days`, `tempDays`, `largeFileMb`, `scanRoots`, `excludePaths`); flags always win.
```
**Was:** identical.

**Change:** none. Six words, then the file, then the precedence rule in three. The shortest-sentence-first
shape the fingerprint asks for, already here.

### S-060 · README.md:277 · Configuration · the pointer
```
Full reference: [CLI reference](https://github.com/aoneahsan/windowsweep/blob/main/docs/cli-reference.md).
```
**Was:** identical.

**Change:** none.

### S-061 · README.md:317-318 · Command Line · the closing pointer
```
Every flag, exit code and environment variable: [CLI reference](https://github.com/aoneahsan/windowsweep/blob/main/docs/cli-reference.md).
```
**Was:** identical.

**Change:** none. Exit codes 0, 1, 2, 3 and 130 are documented there and match `lib/constants.ps1`.

### S-062 · README.md:325 · Examples · goal 1
```
See what is reclaimable, without deleting anything
```
**Was:** See what is reclaimable, risk-free

**Change:** "risk-free" is an adjective making a promise; the clause after it is the same claim as an
observable fact. `--scan` is read-only, which self-test check [7c] holds for the dry-run path and which the
scan module has no deletion call at all to violate.

### S-063 · README.md:326 · Examples · goal 2
```
Rehearse tonight's cleanup
```
**Was:** Rehearse tonight's cleanup

**Change:** none. The rehearsal motif and a time of day, in three words, and the only cell in the table that
puts the reader somewhere rather than telling them what a flag does, which is why it survives a pass that
rewrote the two cells on either side of it.

### S-064 · README.md:327-328 · Examples · goals 3 and 4
```
Reclaim the most space as a developer
Reclaim everything a non-developer can
```
**Was:** the same pair.

**Change:** none. Both already use the glossary verb.

### S-065 · README.md:329 · Examples · goal 5
```
Find `node_modules` in projects idle 6 months
```
**Was:** Find `node_modules` in projects idle 6 months

**Change:** none. It names the flag's effect rather than the flag, which is what a goal column is for.

### S-066 · README.md:330 · Examples · goal 6
```
Reclaim the browser caches after closing the browsers
```
**Was:** Free the browser caches after closing the browsers

**Change:** "free" is a banned store word and "free up" is the glossary's banned form of `reclaim`. The
second half of the line stays, because the order of operations is the point: the running-app guard will skip
an open browser.

### S-067 · README.md:331-333 · Examples · goals 7 to 9
```
Run the admin sections
Weekly unattended run
Machine-readable output for a script
```
**Was:** the same three.

**Change:** none.

### S-068 · README.md:340-342 · Advanced Features · keep-newest
```
**Keep-newest rule** - Cypress, Playwright, Gradle distributions and Squirrel app installs keep their newest version whatever the idle gate says.
```
**Was:** identical.

**Change:** none. A rule that overrides another rule, named with the four things it applies to. Self-test
check [14] holds it: `Remove-SupersededVersions keeps app-1.10.0 and removes 1.9.0 and 1.0.0`.

### S-069 · README.md:343-346 · Advanced Features · editor hygiene and compaction
```
**Editor hygiene** - workspace storage whose folder is gone and extension folders the editor's own `extensions.json` no longer references.
**Disk-image compaction** - hands back the space a Docker Desktop or WSL `.vhdx` never returns on its own.
```
**Was:** the same pair.

**Change:** none. "Never returns on its own" is band W at its driest and it is nowhere near a button.

### S-070 · README.md:348-350 · Advanced Features · reports and crash bundles
```
**Report export** - schema-versioned JSON to Markdown or a self-contained HTML page, no extra tools.
**Crash bundles** - captured locally on an unexpected exit, never transmitted.
```
**Was:** the same pair.

**Change:** none. "Never transmitted" is the offline promise restated where a reader would most doubt it,
and it costs two words.

---

## §H Recovery & Troubleshooting, Limitations

### S-071 · README.md:357 · Troubleshooting · execution policy
```
`windowsweep.ps1` started directly under the `Restricted` policy → Use `npx windowsweep`, `windowsweep.cmd`, or `powershell -ExecutionPolicy Bypass -File windowsweep.ps1`
```
**Was:** the same cause and fix.

**Change:** none. The error is quoted verbatim, then the cause, then three fixes.

### S-072 · README.md:358 · Troubleshooting · REFUSE
```
The path resolves inside a protected folder → Working as designed; `--list-targets` shows the list
```
**Was:** identical.

**Change:** none. "Working as designed" is the right answer and refuses to apologise for it.

### S-073 · README.md:359-361 · Troubleshooting · three console symptoms
```
The browser or app is open → Close it and run the section again
The console is not elevated → Add `--elevate`, or run the `system` profile
stdin is redirected → Use `--all --yes` or `--dry-run`
```
**Was:** the same three pairs.

**Change:** none.

### S-074 · README.md:362 · Troubleshooting · reclaimed less than scanned
```
The idle gate kept recently used files; open apps were skipped → Lower `--days`, close the apps, or `--purge-all`
```
**Was:** identical.

**Change:** none. This is the row that stops the idle gate reading as a bug, and it is the only place
`--purge-all` is offered as an answer rather than described as a flag.

### S-075 · README.md:363 · Troubleshooting · an extension folder went
```
The editor's `extensions.json` no longer referenced it → Reinstall from the editor; referenced folders are never touched
```
**Was:** identical.

**Change:** none. The fix, then the refusal that bounds it.

### S-076 · README.md:369 · Limitations · a framing line
```
These are the limits, not the small print. Each one is a thing this tool cannot do, stated here so it is not discovered later.
```
**Was:** (new — the section currently opens straight onto its first bullet.)

**Change:** added, and this is the Bible's per-surface rule discharged. The Limitations section is part of
the pitch rather than an appendix, and for a solution-sceptical reader the seven bullets under it are the
most persuasive block on the page — but only if they are framed as a claim rather than as a disclaimer a
reader is meant to skim. Eight words, then twenty-one.

### S-077 · README.md:370-371 · Limitations · no undo
```
**No undo for caches.** They regenerate on next use; that is the whole design. Personal files use the Recycle Bin instead.
```
**Was:** identical.

**Change:** none. The safety constraint stated as a limitation, with the distinction between the two kinds
of deletion in the same bullet.

### S-078 · README.md:372 · Limitations · Windows only
```
**Windows only.** Linux and macOS are blocked at install and at launch.
```
**Was:** identical.

**Change:** none. Both enforcement points named: `"os": ["win32"]` and the launcher's platform check.

### S-079 · README.md:373 · Limitations · no number
```
**It cannot promise a number.** `--scan` measures your disk; the README will not guess.
```
**Was:** identical.

**Change:** none. The Bible's hardest rule, written as a limitation the file imposes on itself.

### S-080 · README.md:374-376 · Limitations · the idle gate
```
**The idle gate is conservative.** Windows keeps last-access times off on most volumes, so the tool reads the newest of write, access and creation time - a file can only look fresher than it is, never older. Some old caches survive the default window; `--days` and `--purge-all` exist for that.
```
**Was:** identical.

**Change:** none. Restored hedging done properly, in the words "on most volumes", plus a direction-of-error
statement that tells a reader which way the mistake goes. The longest bullet in the section and it earns it.

### S-081 · README.md:377 · Limitations · admin sections
```
**Admin sections need an elevated console** and a UAC click; a Scheduled Task runs the safe batch only.
```
**Was:** identical.

**Change:** none.

### S-082 · README.md:378 · Limitations · Disk Cleanup
```
**Disk Cleanup (section 13) cannot preview sizes.** Its dry-run names the handlers it would run and nothing more.
```
**Was:** **Disk Cleanup (section 13) cannot preview** how much it will free; its dry-run lists the handlers
only.

**Change:** "free" goes, because it is a banned store word and the glossary's verb for space is `reclaim`,
which would be wrong here since the subject is Microsoft's tool rather than this one. "Cannot preview sizes"
is the engine's own wording: `modules/system_admin.ps1:99` prints `would run cleanmgr.exe /sagerun:77 with
those handlers (cleanmgr cannot preview sizes)`. So "preview" survives on this one line, describing a
third-party tool's missing capability rather than naming this product's dry-run, and the glossary's objection
at `desktop-safety.md` S-054 does not reach it. The second clause is also more precise: the dry-run prints
the handlers present on that machine, with a count, before it names them.

### S-083 · README.md:379-380 · Limitations · no test suite
```
**No automated test suite beyond `--self-test`.** Correctness rests on the self-test's fixtures, dry-runs and real runs on Windows 10 and 11.
```
**Was:** identical.

**Change:** none, and it is the bravest line in the file.

### S-084 · README.md:365 · Troubleshooting · the pointer
```
More: [Troubleshooting](https://github.com/aoneahsan/windowsweep/blob/main/docs/troubleshooting.md).
```
**Was:** identical.

**Change:** none.

---

## §I FAQ, Documentation, Support

### S-085 · README.md:385-387 · FAQ · will it delete my code
```
**Will it delete my code or documents?**
Not from a protected folder, and not without asking. Documents, Desktop, Pictures and cloud-sync folders are hard refusals. Section 17 lists build artefacts in idle projects and removes only what you select.
```
**Was:** identical.

**Change:** none. The direct answer arrives in the first nine words, which is what an answer engine quotes
and what a worried reader needs. Question map row 4, near enough verbatim.

### S-086 · README.md:389-391 · FAQ · does it phone home
```
**Does it phone home?**
No. Zero network calls, no telemetry, no update check. The self-test greps the source for HTTP and socket calls; `--report-issue` opens your browser at a pre-filled page you submit yourself.
```
**Was:** identical.

**Change:** none. A one-word answer, then the enforcement, then the single exception described honestly — it
is the reader's browser that makes the request, and the sentence says so.

### S-087 · README.md:393-395 · FAQ · why keep 100 days
```
**Why keep files used in the last 100 days?**
Because a developer's caches are what make the next install fast. `--days 30` or `--purge-all` when you want more, `--not-developer` when the machine has no development on it.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 10's reasoning, and the answer to a question that reads as a
complaint.

### S-088 · README.md:397-398 · FAQ · why is Chrome skipped
```
**Why is Chrome skipped?**
An open browser keeps its cache files locked and half-written. Close it and run `windowsweep --only 7 --yes`.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 7, and it ends on the exact command, which is where this voice
ends an answer.

### S-089 · README.md:400-402 · FAQ · why PowerShell
```
**Why PowerShell rather than an .exe?**
Every Windows machine has PowerShell 5.1: no runtime to install, no binary to trust, and the source is readable in an afternoon.
```
**Was:** identical.

**Change:** none. "No binary to trust" is the argument a solution-sceptical reader was already making, and
"readable in an afternoon" is a claim about 44 files and roughly 366 kB unpacked, which is checkable.

### S-090 · README.md:404 · FAQ · the pointer
```
More: [FAQ](https://github.com/aoneahsan/windowsweep/blob/main/docs/faq.md).
```
**Was:** identical.

**Change:** none.

### S-091 · README.md:411-413 · Documentation · read it when, rows 1 to 3
```
you want the full map
running your first cleanup
you want every guarantee spelled out before deleting anything
```
**Was:** the same three.

**Change:** none. Each cell is a moment rather than a topic, which is what makes the column worth having.

### S-092 · README.md:414-418 · Documentation · read it when, rows 4 to 8
```
you want to know what the first question changes
you want to know precisely what one section touches
you need an exact flag, exit code or variable
before running the system profile or touching the hibernation file
parsing the JSON or finding a log
```
**Was:** the same five.

**Change:** none. Row 7 is the only one written as a "before", and it is the one about the hibernation file.

### S-093 · README.md:419-421 · Documentation · read it when, rows 9 to 11
```
an agent or a script runs it for you
something failed
you want to know what is verified and what is still open: the desktop app, the story pass and the verification runs
```
**Was:** the same three.

**Change:** none. Two words for the troubleshooting row and twenty for the roadmap row, side by side.

### S-094 · README.md:455-456 · Support · issues and bug reports
```
Questions and bugs: [open an issue](https://github.com/aoneahsan/windowsweep/issues). For a bug, run `windowsweep --debug-bundle` first and attach the zip after reviewing it - it contains paths from your machine.
```
**Was:** identical.

**Change:** none. The warning about the zip's contents is the whole reason this sentence is on voice: it
tells the reader to read a file before sending it, which is the same instinct as naming a path before
deleting it.

### S-095 · README.md:457-458 · Support · security
```
Security reports go privately to [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com); see [SECURITY.md](https://github.com/aoneahsan/windowsweep/blob/main/SECURITY.md).
```
**Was:** identical.

**Change:** none.

### S-096 · README.md:460-461 · Support · the support link
```
If this tool saved you time, you can support its maintenance at [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep).
```
**Was:** identical.

**Change:** none. Conditional, no pressure, one link, and the link is the only permitted one.

---

## Found while writing, reported rather than fixed

None of these is a wording change and none may be made from this draft.

**Two factual defects in reference tables.** Section 5's row at line 209 says "dangling layers" where
`WS_SECTIONS` says "dangling images" — Docker's own noun, and the thing `docker image prune` removes. And
line 123's "400-character path" is fixed at S-031 in the Features bullet, but the same rounding appears
nowhere else, so that one is closed.

**The at-a-glance and Features counts drift with the engine.** Three numbers in this file are true today and
will move when section 26 lands: 26 sections, 151 checks, 105 declared targets. IRON rule 7's cascade
already names the at-a-glance row; 105 is new with S-024 and needs adding to that list, or it will be the
number that goes stale first.

**Five places carry the tagline, not three.** `package.json`, `WS_TAGLINE` in `lib/constants.ps1`, the
docs site's `docusaurus.config.ts`, **this file at line 7**, and the bundled engine copy at
`desktop/src-tauri/resources/windowsweep/lib/constants.ps1`. The last of those is regenerated by
`yarn sync:cli`, so it follows automatically — but only if that command is run. Detail in `tagline.md`.

**The Desktop app section is not inserted here.** It is specified in `desktop-readme.md`, together with the
table-of-contents entry, the anchor and the companion edit to S-021. Inserting it is a change to the heading
set, which this draft is not permitted to make.

---

## Self-check

**Palette.** Band **P** dominates as row 1 requires and carries every rewritten line that states a mechanism
or a count: S-004, S-006, S-011, S-013, S-023, S-024, S-031, S-044, S-062. Band **R** carries the refusals at
S-006, S-017, S-020, S-026, S-029, S-070, S-077 and S-085. The opening sentence at S-006 moved into first
position precisely so the file's first claim is a refusal. That was the point. Band **W** appears **twice** and no more:
"which ones bite back" (S-014) and "a cleanup run is a cleanup run" (S-050), both far from any destructive
command. The dry aside at S-069 ("never returns on its own") is a third candidate and is left as it stands,
which puts W at roughly 3 of the file's 96 slots. That is under the 15 per cent budget rather than at it,
which is the right side to err on for a file about deleting things.

**Rhythm.** Shortest shipping sentence: "No flag changes that." at four words, S-006. Also four: "There is no
configuration you must do." is six, and "No." at S-086 is one word standing as a complete answer. Longest:
S-080's middle sentence at thirty-eight words, which explains the direction of the idle gate's error and
earns the length. The added lines follow the fingerprint's shape deliberately. S-006 is twelve words then
four. S-076 is eight then twenty-one.

**Length.** No section grows beyond a line. Measured against the current file: the opening paragraph goes
from **106 words to 98** (S-006 to S-010 replace four sentences with five shorter ones); Features goes from
**331 to 349** (+18, all of it the two mechanism clauses at S-024 and S-031 and the correction at S-023,
which is itself two words shorter than what it replaces); Why windowsweep goes from **214 to 209**;
Limitations goes from **190 to 213** (+23, the framing line at S-076). Every other covered section is
unchanged or one word shorter. Total change across the file: **+29 words**, against a row-1 cap of "the
existing structure, fixed anchors", which is met. 28 `##` headings in, 28 out. Every `<a id>` is untouched,
and the two `###` renames were proved unlinked by grep before they were made.

**Unsure.** No `NEEDS DECISION` in this draft: every fact in it was read out of the tree or printed by the
tool this session. Three judgement calls are worth naming rather than hiding. **S-013** replaces "actively
maintained" with a release date, which adds a row to the version cascade's maintenance burden. A reviewer may
reasonably prefer the adjective for that reason. The counter-argument sits in the slot. **S-076** adds
prose to a section that had none, which is the largest single addition here; it is made because the Bible
names it as a rule for this surface, and it is one sentence rather than a paragraph. **S-052 and S-053**
change two `###` headings; the anchor evidence is in S-052 and the change is refused if any linked reference
is found later. One phrase is allowed on purpose. "Elevate" is on the
shared list as an inflation verb and is, in this product, the literal name of the `--elevate` flag and the
Windows term for what it does.
