# readme — the repository README

<!-- story-lint: allow "elevate" -->

Content-map row **1** · surface `README.md` · awareness **problem-aware, solution-sceptical** · structure
**problem → the gamble they already lost → the guarantees → proof → install** (PAS at the opener, then plain
reference prose) · tone **P dominant, R strong, W twice** (row amended 2026-09-08) · length **the existing
structure and anchor set are fixed; no section grows**.

This is a slot inventory rather than a page, the same shape the three desktop drafts used. Nothing is
reorganised. Every string where
voice actually lives is listed once, numbered, with its line and its section heading; the text that ships sits
inside a fence of its own, and the **Was** and **Change** lines sit outside it. Where a string is already on
voice it is kept and said so.

Two rules from the Bible govern the whole file. **The README leads with what the product refuses, not with
what it deletes** — so the refusal moves into the opening paragraph, ahead of the cache list it currently
opens on. And **the Limitations section is part of the pitch rather than an appendix**, which is why S-020
now closes on a pointer into it.

## Re-based against the file on disk, 2026-09-08

🔴 **Every slot below was re-diffed against `README.md` as it stands today**, not against the file the first
draft was written on. The target moved. The Desktop app section landed with its anchor and its
table-of-contents row, the IMPORTANT callout was rewritten, and several of this draft's proposed edits were
applied. Line references below are the current ones; **every `Was:` is quoted from today's file.**

**Five fences would have regressed the file and were reversed to disk.** Each is marked `Change: none` with
the reason, so the applier can see it was considered rather than forgotten.

| Slot | What the old fence would have done | Kept instead |
|---|---|---|
| S-004 | named two of the four gated sections, leaving a gap the callout never closes | disk names all four in one sentence, and adds "no undo of any kind" |
| S-020 | re-introduced "graphical" 257 lines above the section describing the graphical app | disk's "a set-and-forget cleaner that runs itself" |
| S-023 | dropped disk's explicit not-an-audit disclosure, on the exact point this draft calls its most consequential correction | disk's full three-audits-plus-section-23 sentence |
| S-032 | linked `remaining-work-summary.md`, which lives at the workspace root **outside git** — a `git clone` does not carry it, so the link 404s for every reader | disk's link to `00-tracker.json` |
| S-093 | described the project-status row as the desktop app, the story pass and the verification runs | disk's "every phase and sub-task with its state and evidence" |

**Convention.** A `Was:` reproduces today's words exactly. Only soft-wrapping differs: `README.md` hard-wraps
its prose near 110 columns and this file does not.

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
governed by IRON rule 4 rather than by voice: the section catalogue (lines 204–231), the mode and option
tables (288–317), the environment table (271–277), the badge URLs, the repository tree (462–470), the
changelog paragraph, the licence note, the author block, the links table and the keyword line. The table of
contents (48–73) is navigation derived from the `##` set, on the same footing as the sitemap page's labels in
`content-map.md` §2. The Contributing pointer is governance boilerplate, listed out of scope there too.

🔴 **The Desktop app section (354–369) is content-map row 14's surface, not this one.** It was approved at
GATE 4 on 2026-09-07 and has since been applied to disk, together with its anchor, its table-of-contents row
at line 61 and the companion edit to S-021. This draft neither re-authors it nor proposes inserting it; it
only scopes three CLI-side network claims so they stop contradicting it (S-031, S-070, S-086).

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

🔴 **This slot lands with 1.2.0 or not at all.** Disk still carries the old line, correctly — the five places
move together in one version cascade.

### S-003 · README.md:16 · header block · the links line
```
Docs · AI Guide · npm · GitHub · Changelog · Contributing · Support
```
**Was:** the same seven labels.

**Change:** none. Every target is a GitHub blob URL rather than the documentation domain, which has never
resolved, and that is the correct choice until it does.

### S-004 · README.md:21-24 · the IMPORTANT callout, the deletion sentences
```
**This tool deletes files.** Most of what it removes are caches that rebuild themselves; personal files it lists go to the Recycle Bin; and two sections - emptying the Recycle Bin, clearing event logs - are permanent, with no undo of any kind. Those two sit behind `--i-understand-deep`, along with the hibernation file and disk-image compaction.
```
**Was:** identical.

**Change:** none, and reversed from the first draft. That draft proposed "sections 11 and 16 ... are
permanent, and they are two of the four sections `--i-understand-deep` gates", which names the flag and the
arithmetic but leaves the other two sections unnamed — a reader is told a set of four exists and is shown
half of it. The line now on disk closes that gap in the same breath: it names the flag, names all four
things it gates, and separates the two that are permanent from the two that are not. It also carries "with
no undo of any kind", which the proposed version had dropped. Checkable against `WS_SECTIONS` in
`lib/constants.ps1`: `Batch = 'deep'` on 11, 15, 16, 20; `Tier = 'permanent'` on 11 and 16.

### S-005 · README.md:24-26 · the IMPORTANT callout, the two commands
```
Start with `npx windowsweep --scan`, which deletes nothing, then `npx windowsweep --dry-run --all --yes`, which shows exactly what a real run would remove.
**Windows only** - npm refuses to install it elsewhere.
```
**Was:** identical.

**Change:** none. Two commands in the order a sceptic runs them, each labelled with what it does rather than
with what it is called. The platform refusal closes on the mechanism that enforces it (`"os": ["win32"]` in
`package.json`; the Node launcher exits 2 on any other platform).

### S-006 · README.md:28 · the opening paragraph, sentence 1
```
`windowsweep` refuses your documents, your credentials and your browser state outright. No flag changes that.
```
**Was:** (new sentence — the paragraph still opens on the cache list at S-007.)

**Change:** added, and this is the change the Bible's per-surface rule asks for. The paragraph opens on what
the tool removes and reaches restraint in its fourth sentence, which is the wrong order for a reader who has
already been burned by a cleaner. Eleven words, then four. The refusal is checkable: 66 protected subtrees,
50 wildcard patterns and 13 protected file names are built in `Initialize-Safety` (`lib/safety.ps1`), and
steps 1 to 3 of `Remove-PathSafe` carry the comment "No flag bypasses steps 1-3".

### S-007 · README.md:28-29 · the opening paragraph, sentence 2
```
What it reclaims is the disk space that quietly disappears on a Windows machine: package-manager and build caches, browser and app caches, Windows temp and update leftovers, stale `node_modules`, half-finished downloads.
```
**Was:** `windowsweep` reclaims the disk space that quietly disappears on a Windows machine: package-manager
and build caches, browser and app caches, Windows temp and update leftovers, stale `node_modules`,
half-finished downloads.

**Change:** the opening clause becomes the hinge from S-006 instead of the paragraph's first words. The list
itself is unchanged and correct against the catalogue.

### S-008 · README.md:30-32 · the opening paragraph, sentence 3
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

⚠️ **"Makes no network calls at all" is correct here and stays unqualified.** The subject of the sentence is
`windowsweep`, the command-line engine, whose self-test check [9] fails the build on an HTTP or socket call.
The claims that needed scoping are the three a reader could carry over to the desktop window — S-031, S-070
and S-086 — and they are scoped there.

### S-009 · README.md:30 · the opening paragraph, sentence 4
```
One question on the first run decides whether your developer caches are pruned on the idle gate or cleared completely. A PowerShell engine sits behind a thin Node launcher, so `npx windowsweep` runs it with nothing to install.
```
**Was:** (split out of the sentence at S-008.)

**Change:** the developer question and the runtime story become their own sentences, and the first of them is
**rewritten from the previous draft**. That draft said the question "decides whether toolchain caches are
offered at all", which contradicts S-022 a few lines of README below it: under S-022 *both* answers reach the
caches — yes prunes them on the idle gate, no clears them completely — so nothing is offered or withheld. The
pre-draft sentence, the Bible's idle-gate motif and the Examples row all agree with S-022, and this is the
paragraph a burned reader reads for exactly this guarantee, so it has to be the true version. It now says
what the answer actually changes. "Developer caches" is the README's own noun from the comparison table's
first row, chosen over "toolchain caches" because `toolchains` already means something else in this file: a
protected class the chokepoint refuses. "PowerShell tool" becomes "PowerShell engine", which is the word the
rest of the project uses — the consent screen says "the cleanup engine makes zero network calls", and one
noun for one thing is worth more than variety here.

### S-010 · README.md:33-34 · the opening paragraph, closing sentence
```
It is the Windows member of a family with [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) and [macleanup](https://github.com/aoneahsan/macleanup).
```
**Was:** identical.

**Change:** none. Both links resolve to real repositories, and the sentence ends the paragraph on a plain
fact rather than a summary of the four above it.

### S-011 · README.md:43 · at-a-glance · Install size
```
~109 kB packed · ~366 kB unpacked · 44 files · no dependencies
```
**Was:** identical.

**Change:** none. Verified: `npm pack --dry-run` reports package size 109.0 kB, unpacked size 365.7 kB, total
files 44, against a `files` allowlist with no `dependencies` block in `package.json`. This is the kind of row
the version cascade already keeps current.

### S-012 · README.md:44 · at-a-glance · Undo
```
Recycle Bin for personal files; none for caches (they regenerate)
```
**Was:** identical.

**Change:** none. The safety constraint that a deletion is never implied to be reversible is met in seven
words, and the semicolon is this voice's own punctuation.

### S-013 · README.md:45 · at-a-glance · Status
```
Stable · 1.1.0, released 2026-09-04
```
**Was:** Stable · actively maintained

**Change:** "actively maintained" is an adjective standing in for a date, which the fingerprint's tells list
names explicitly. The date is checkable — `gh release list` shows `v1.1.0` published 2026-09-04, after
`v1.0.0` and `v1.0.1` the day before — and it says the same thing without asking to be believed. This row is
already inside the version cascade (IRON rule 7), so keeping it current costs nothing new.

⚠️ The **Version** row two lines above already reads `1.1.0`, so this slot states the number twice in one
table. The date is the load-bearing half; an applier who prefers one mention may ship `Stable · released
2026-09-04` instead, and nothing else in this draft depends on it.

---

## §B Why windowsweep

### S-014 · README.md:78-81 · Why windowsweep · paragraph 1
```
A Windows machine that is also a development machine fills up in places Disk Cleanup has never heard of: the Yarn and npm caches, Gradle, Cypress and Playwright browsers, Android emulator images, Docker's virtual disk, `node_modules` for a project you finished in spring, editor caches, two hundred profiles' worth of Chrome cache. Clearing them by hand means keeping a private list of paths and remembering which ones bite back.
```
**Was:** identical.

**Change:** none. This is the Problem beat and it is already written at the reader's level: named tools, a
specific season, and a closing clause that carries the whole objection in three words. "Bite back" is the
first of the file's two W moments and it sits nowhere near a destructive command.

### S-015 · README.md:83-84 · Why windowsweep · paragraph 2, the gamble
```
A cleaner that clears every cache it finds trades one problem for another: the next `yarn install` downloads the lot again, and your afternoon is gone. `windowsweep` takes the narrower path.
```
**Was:** identical.

**Change:** none — **both of the previous draft's fixes are already on disk.** The unsourced "twelve
gigabytes" is gone, replaced by "the lot", which is true on any machine and satisfies the Bible's absolute
rule that numbers are exact and sourced. "Wipes" is gone too: disk chose "clears" where the draft proposed
"empties", and "clears" is the flatter of the two, so disk is kept. Disk also keeps "your afternoon" against
the draft's "the afternoon", which is right — second person is this voice's stance for anything the reader
experiences.

### S-016 · README.md:89 · Why windowsweep · comparison table, Default action
```
prune files idle 100+ days; keep the newest version of every tool
```
**Was:** identical.

**Change:** none, recorded so a transcriber does not soften it. The cell states a rule with a number in it,
which is what makes the row next to it ("wipe the whole cache") a comparison rather than a boast.

### S-017 · README.md:90 · Why windowsweep · comparison table, Personal folders
```
hard refusal, no flag bypasses it
```
**Was:** identical.

**Change:** none. Five words, band R. The claim is asserted by self-test check [6], whose output line reads
"105 declared targets, none inside a protected path", and that check fails the build rather than a review.

### S-018 · README.md:94 · Why windowsweep · comparison table, Network calls
```
none
```
**Was:** none

**Change:** none. One word beside "Microsoft telemetry" and "varies" does more than a sentence would, and it
needs no scoping: the column header is `windowsweep`, so the cell's subject is the command-line tool and
nothing else.

### S-019 · README.md:96 · Why windowsweep · the number line
```
Nothing here can promise a number. How much comes back depends on your disk; `--scan` measures it.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 6, near enough verbatim, and the single most load-bearing line
in the section: it is what buys the rest of the page its credibility with a reader who has read this claim
elsewhere as a figure.

### S-020 · README.md:98 · Why windowsweep · not the right tool
```
**Not the right tool when** you want a set-and-forget cleaner that runs itself; when you are on Linux or macOS (use the siblings); when you want an undo for caches (there is none - they regenerate); or when you are looking for a security scanner or a registry cleaner. The rest of what it cannot do is under [Limitations](#limitations). It reclaims disk space, nothing else.
```
**Was:** **Not the right tool when** you want a set-and-forget cleaner that runs itself; when you are on Linux
or macOS (use the siblings); when you want an undo for caches (there is none - they regenerate); or when you
are looking for a security scanner or a registry cleaner. It reclaims disk space, nothing else.

**Change:** one sentence added, and **disk's first clause is kept exactly.** The previous draft carried "you
want a graphical, set-and-forget cleaner", which was correct when it was written and is not now: the Desktop
app section is 257 lines below, describing the graphical app in detail, so that clause would have told a
reader the product does not exist on the same page that documents it. Disk already carries the companion
edit — see S-021 — and it stands.

The added sentence is the tie the Limitations section needs after S-076's frame was dropped. It is a forward
pointer rather than a frame: a reader who has just met one limit ("there is none - they regenerate") is told
where the rest are collected, and the loop is paid off two sections later. It is not a "not X but Y", so that
one-per-300-words budget is untouched. It sits **before** the closer rather than after it, so "nothing else"
keeps the emphatic last position the fingerprint asks for. Ten words. Bible section 10 asks that no security
property be claimed, and this is still where that is discharged.

### S-021 · README.md:98 · Why windowsweep · not the right tool, first clause

**Landed — nothing to apply.** The first draft recorded a companion edit here: the clause "you want a
graphical, set-and-forget cleaner" would stop being true on the day the desktop app had a release, and the
replacement was specified in `desktop-readme.md` to land with the Desktop app section rather than before it.
Both landed together. Disk now reads "you want a set-and-forget cleaner that runs itself", which keeps the
refusal — this tool does not run itself — and drops the half the desktop app falsified. Recorded rather than
deleted, so the next reader can see the pairing worked.

---

## §C Features

### S-022 · README.md:103-104 · Features · Developer mode
```
**Developer mode** - one question on the first run. Yes keeps package, build and test-runner caches used in the last 100 days and the newest version of every versioned tool; no clears them completely.
```
**Was:** identical.

**Change:** none. The glossary's own term, then the answer's consequence in each direction. No adjective
anywhere. S-009 was rewritten to agree with this bullet rather than the other way round: this one is right.

### S-023 · README.md:105-109 · Features · the sections
```
**26 numbered sections** - from package-manager caches to Windows Update leftovers, plus three read-only audits (global packages, idle programs, startup items) that report and delete nothing. Orphaned application data is a fourth 1.1.0 section and is **not** an audit: it asks you to pick, row by row, and what you pick goes to the Recycle Bin. Every section names its paths before it acts, and the numbers are a public contract.
```
**Was:** identical.

**Change:** none — **the correction landed, and disk went further than this draft proposed.** The first draft
called this its most consequential slot: the bullet used to say there were **four** read-only audits, when
sections 22, 24 and 25 carry `Tier = 'report'` in `WS_SECTIONS` and the `audit` profile is
`@(0, 21, 22, 24, 25)`, while **section 23 is `Tier = 'recycle'`, `Batch = 'interactive'`** and sends
orphaned application data to the Recycle Bin after a person picks it row by row. Calling it read-only was the
one sentence in the file that could make a reader trust a deletion they were not expecting.

Disk fixed the count *and* added the disclosure the draft had only implied — the explicit "is **not** an
audit ... goes to the Recycle Bin". The old fence would have deleted that sentence to save words, on the
exact point this slot exists to make. Disk is kept whole. The file no longer contradicts itself at line 235
("The three *audit only* sections"), and the human surface now agrees with `llms.txt`.

### S-024 · README.md:110-113 · Features · the chokepoint
```
**One deletion chokepoint** - refuses drive roots, Windows, Program Files, your profile root, personal folders, credentials, toolchains and browser or editor state; asserts every deletion sits inside its declared target; never follows a junction or symlink; handles paths beyond 260 characters; skips files another program has open. Self-test check [6] walks all 105 declared targets and fails if one resolves inside a protected path.
```
**Was:** **One deletion chokepoint** - refuses drive roots, Windows, Program Files, your profile root, personal
folders, credentials, toolchains and browser or editor state; asserts every deletion sits inside its declared
target; never follows a junction or symlink; handles paths beyond 260 characters; skips files another program
has open.

**Change:** one sentence added. The bullet lists five guarantees and offers no way to check any of them; the
new sentence names the check that does, with the number it prints: `+ 105 declared targets, none inside a
protected path`. It makes the product's central motif, one door and one guard, verifiable in a line.

### S-025 · README.md:114-115 · Features · the dry-run
```
**A dry-run that writes nothing** - `--dry-run` short-circuits every deletion and every destructive command and reports an exact estimate. `--scan` and `--list-targets` are read-only.
```
**Was:** identical.

**Change:** none. The rehearsal motif, stated as a mechanism rather than as a promise, and self-test check
[7c] hashes the fixture tree before and after to hold it.

### S-026 · README.md:116-117 · Features · personal files
```
**Personal files go to the Recycle Bin** - partial downloads and large stale files are listed, you pick, and Windows keeps the undo.
```
**Was:** identical.

**Change:** none. "You pick" is fingerprint diction and the last clause puts the undo where it actually
lives, which is not in this tool.

### S-027 · README.md:118-119 · Features · batch policy
```
**Batch policy** - `--all` runs the safe batch only; deep sections need `--i-understand-deep`; personal sections never run unattended.
```
**Was:** identical.

**Change:** none. Checkable against `WS_SAFE_BATCH = @(0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21)` and self-test
check [12], which asserts every `Read-MultiSelect` call in `modules/` carries `-NoAutoYes`.

### S-028 · README.md:120-121 · Features · admin awareness
```
**Admin awareness** - sections that need Administrator rights skip with the exact command when the console is not elevated; `--elevate` relaunches through a UAC prompt.
```
**Was:** identical.

**Change:** none. "Skip with the exact command" is the behaviour a reader meets, described as what they will
see rather than as a capability.

### S-029 · README.md:122 · Features · the running-app guard
```
**Running-app guard** - an open browser, editor or app keeps its caches; the tool tells you which to close.
```
**Was:** identical.

**Change:** none. Band R: the reassurance is a thing the tool declines to do.

### S-030 · README.md:123-124 · Features · session reports
```
**Session reports** - schema-versioned JSON, exportable to Markdown or a self-contained HTML page, plus `--json` for scripts.
```
**Was:** identical.

**Change:** none.

### S-031 · README.md:125-127 · Features · self-test and offline
```
**Self-test** - 151 checks prove the guards on your machine with a real junction, a 445-character path and a dry-run fixture before you trust it.
**Offline by design** - the command-line tool makes zero network calls: no telemetry, no update check. Self-test check [9] fails the build on an HTTP or socket call in the source. Crash bundles stay on disk.
```
**Was:** **Self-test** - 151 checks prove the guards on your machine with a real junction, a 445-character
path and a dry-run fixture before you trust it. / **Offline by design** - zero network calls, no telemetry,
no update check. Crash bundles stay on disk.

**Change:** the Self-test bullet is **unchanged** — its `400-character` rounding was corrected to **445** on
disk, which is what the self-test prints (`+ long path (445 chars) removed`), so that half of this slot has
landed. 151 is correct and was re-run: `+ all 151 checks passed`, exit 0.

The Offline bullet changes twice. **It gains a subject**, which is the ordered fix: as written, "zero network
calls, no telemetry, no update check" is unscoped, and 238 lines below it the Desktop app section says the
window sends usage and crash reports with no switch and describes the updater that checks for one. An
unscoped claim a reader can falsify by scrolling costs the page more than the claim buys it. Naming the
command-line tool keeps the strong version of the promise exactly where it is earned — the Bible's §3
commitment 3, corrected 2026-09-07 on this reasoning. **And it gains the mechanism**: three negations in a
row invite the question "says who", and check [9] answers it. Nothing is softened; the claim is placed.

---

## §D Platform Support and Requirements

### S-032 · README.md:134 · Platform Support · Windows 11
```
Same engine and PowerShell hosts; a real run on Windows 11 is on the verification list ([project status](https://github.com/aoneahsan/windowsweep/blob/main/docs/features/windowsweep-completion/00-tracker.json))
```
**Was:** identical.

**Change:** none, and reversed from the first draft, which linked the label "roadmap" to
`remaining-work-summary.md`. 🔴 **That file lives at the workspace root, outside this git repository, by the
owner's decision.** It is not in `git ls-files` and a `git clone` does not carry it, so a blob URL to it
returns 404 for every reader who did not build the machine it was written on — and this cell's whole job is
to make an admission verifiable. A link is a promise. Disk points at `00-tracker.json`, which is tracked,
which is committed, and which carries the same information per phase.

The cell is otherwise worth defending unchanged: a supported row that admits no real run has happened yet is
the single most on-voice cell in the file. Restored hedging of exactly the kind the fingerprint calls correct.

### S-033 · README.md:135 · Platform Support · Windows 10
```
The primary development target; every real run so far
```
**Was:** identical.

**Change:** none.

### S-034 · README.md:136 · Platform Support · Windows Server
```
Uses nothing newer than 1809; CI runs the self-test and a dry-run on Windows Server (`windows-latest`) on every push to `main` and every pull request, but no real cleanup has been run on Server
```
**Was:** identical.

**Change:** none. The ⚠️ marker, the evidence and the gap, in one cell. The first draft's fence read "on every
push" and dropped "to `main` and every pull request"; disk is more precise, so disk is kept.

### S-035 · README.md:137-138 · Platform Support · Linux and macOS
```
`os: ["win32"]` makes npm refuse to install; use [linux-cleanup](https://github.com/aoneahsan/linux-cleanup)
Use [macleanup](https://github.com/aoneahsan/macleanup)
```
**Was:** the same pair.

**Change:** none.

### S-036 · README.md:145 · Requirements · PowerShell
```
Ships with Windows 10 and 11; the engine is written for it. PowerShell 7 also works (`--pwsh`)
```
**Was:** identical.

**Change:** none.

### S-037 · README.md:147 · Requirements · Administrator rights
```
Only sections 12-16 and 20 (Windows Update cache, Disk Cleanup engine, DISM, hibernation, event logs, disk-image compaction)
```
**Was:** identical.

**Change:** none. Six sections named six ways, agreeing with the elevation screen's "Six sections need
Windows to ask your permission" and with the six `Admin = $true` rows in `WS_SECTIONS`. Three surfaces, one
count.

### S-038 · README.md:150 · Requirements · the closing line
```
`windowsweep --self-test` reports which optional tools are missing on your machine.
```
**Was:** identical.

**Change:** none. Ends the section on a command rather than a summary, which is this voice's habit.

---

## §E Installation and Quick Start

### S-039 · README.md:155 · Installation · lead-in 1
```
No install needed:
```
**Was:** No install needed:

**Change:** none. Three words.

### S-040 · README.md:161 · Installation · lead-in 2
```
To keep it on your `PATH`:
```
**Was:** To keep it on your `PATH`:

**Change:** none.

### S-041 · README.md:167 · Installation · lead-in 3
```
Or clone the repository and run it without Node:
```
**Was:** identical.

**Change:** none.

### S-042 · README.md:175-177 · Installation · the launcher paragraph
```
Both launchers start PowerShell with `-ExecutionPolicy Bypass`, so the machine's script policy never blocks a run. Logs and reports land in `%USERPROFILE%\.windowsweep\` on every path - outside the npm cache, so history survives `npx` evictions.
```
**Was:** identical.

**Change:** none. Two mechanisms and the reason for the second one, which is the sort of detail only someone
who has lost a history to an `npx` eviction would write down.

### S-043 · README.md:177 · Installation · the docs pointer
```
Full detail: [Installation](https://github.com/aoneahsan/windowsweep/blob/main/docs/installation.md).
```
**Was:** identical.

**Change:** none.

### S-044 · README.md:183 · Quick Start · lead-in
```
Prove the guards, look, rehearse, then reclaim:
```
**Was:** Prove the guards, look, rehearse, then clean:

**Change:** "clean" is the glossary's banned verb and the replacement is its named substitute. The four verbs
now match the four commands in the fence beneath them one for one, which they did not before — "reclaim" is
what the fourth command does.

### S-045 · README.md:186-189 · Quick Start · the four commands
```
npx windowsweep --self-test
npx windowsweep --scan
npx windowsweep --dry-run --all --yes
npx windowsweep
```
**Was:** identical.

**Change:** none. The rehearsal motif in four lines: prove, measure, rehearse, perform, and the third and
fourth differ by one flag.

### S-046 · README.md:192-193 · Quick Start · the walkthrough sentence
```
The last command is the guided walkthrough: it asks the developer question, shows a pre-scan, then visits each section with `a` run / `s` skip / `q` quit and a running total.
```
**Was:** identical.

**Change:** none. The three keys are the ones the walkthrough actually binds.

### S-047 · README.md:193 · Quick Start · the missing sentence

**Change:** none, and recorded so nobody adds one. There is no closing reassurance after S-046 and there
should not be. The section ends on the keys a reader will press.

---

## §F Usage prose

### S-048 · README.md:200-202 · Usage · the tier sentence
```
**Tier** says what happens to the data: *report* deletes nothing, *rebuilds* comes back on its own, *slow* comes back but costs minutes, *Recycle Bin* is recoverable until you empty it (`--list` shows this tier as `recycle`), *permanent* is not, *config* changes a setting.
```
**Was:** identical.

**Change:** none. Six tiers are defined by consequence rather than by name; the `--list` key is given where it
differs from the label; *permanent* gets two words. This sentence is the reason the table under it does not
need a legend.

### S-049 · README.md:233-234 · Usage · the batch sentence, part 1
```
*Safe* sections run in `--all`; *opt-in* ones run when named in `--only` or a profile; *deep* ones also need `--i-understand-deep`; *interactive* ones never run unattended unless you pass a selection.
```
**Was:** identical.

**Change:** none. Four batch kinds, four rules, semicolons doing the joining.

### S-050 · README.md:234-236 · Usage · the batch sentence, part 2
```
The three *audit only* sections are read-only and safe, but stay out of `--all` so a cleanup run is a cleanup run - `--profile audit` is where they live.
```
**Was:** identical.

**Change:** none. It is already right, and it is the sentence that proved the old Features bullet wrong: the
count here is three, and S-023 now agrees with it on disk. "A cleanup run is a cleanup run" is the file's
second W moment and its last. Content-map row 1 was amended from "W once" to "W twice" on 2026-09-08 for
this line and S-014, both of which were already shipped when the row was written.

### S-051 · README.md:236-237 · Usage · the sections pointer
```
Every section is documented in [Sections 0-25](https://github.com/aoneahsan/windowsweep/blob/main/docs/sections.md).
```
**Was:** identical.

**Change:** none.

### S-052 · README.md:239 · Usage · sub-heading
```
### Reclaim interactively
```
**Was:** ### Clean interactively

**Change:** the glossary's banned verb in a heading. Checked before changing it: `grep -rn` across both
repositories for `clean-interactively`, `clean-unattended` and `system-level-cleanup` returns nothing, so no
anchor, sidebar, docs page or table of contents links to it — the file's own table of contents lists only the
`##` headings. The anchor contract is therefore untouched.

### S-053 · README.md:246 · Usage · sub-heading
```
### Reclaim unattended
```
**Was:** ### Clean unattended

**Change:** same reason as S-052, same evidence.

### S-054 · README.md:198 · Usage · sub-heading
```
### The sections
```
**Was:** ### The sections

**Change:** none.

### S-055 · README.md:256 · Usage · sub-heading
```
### System-level cleanup
```
**Was:** ### System-level cleanup

**Change:** none. "Cleanup" is a noun here and is the project's own category word — it is in the npm keywords,
in `docs/`, and in the approved consent screen's "the cleanup engine makes zero network calls". The glossary
bans `clean` and `sweep` as **verbs**, which this is not.

### S-056 · README.md:254 · Usage · the `--yes` sentence
```
`--yes` applies to regenerable caches only. No flag combination batch-deletes personal files.
```
**Was:** identical.

**Change:** none. A rule, then its absolute form, seven words apiece. Self-test check [12] holds the second
one.

### S-057 · README.md:262-263 · Usage · the system profile sentence
```
Relaunches through a UAC prompt and runs the Windows Update, Disk Cleanup and DISM sections. Add the hibernation file with `--only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate`.
```
**Was:** identical.

**Change:** none. The three sections named match `WS_PROFILES['system'] = @(12, 13, 14)`.

### S-058 · README.md:259 · Usage · the system command
```
windowsweep --profile system --yes --elevate
```
**Was:** identical.

**Change:** none.

---

## §G Configuration, Examples, Advanced Features

### S-059 · README.md:268-269 · Configuration · the opening
```
There is no configuration you must do. Defaults live in `%USERPROFILE%\.windowsweep\config.json` (`developer`, `days`, `tempDays`, `largeFileMb`, `scanRoots`, `excludePaths`); flags always win.
```
**Was:** identical.

**Change:** none. Six words, then the file, then the precedence rule in three. The shortest-sentence-first
shape the fingerprint asks for, already here.

### S-060 · README.md:279 · Configuration · the pointer
```
Full reference: [CLI reference](https://github.com/aoneahsan/windowsweep/blob/main/docs/cli-reference.md).
```
**Was:** identical.

**Change:** none.

### S-061 · README.md:319-320 · Command Line · the closing pointer
```
Every flag, exit code and environment variable: [CLI reference](https://github.com/aoneahsan/windowsweep/blob/main/docs/cli-reference.md).
```
**Was:** identical.

**Change:** none. Exit codes 0, 1, 2, 3 and 130 are documented there and match `lib/constants.ps1`.

### S-062 · README.md:327 · Examples · goal 1
```
See what is reclaimable, without deleting anything
```
**Was:** See what is reclaimable, risk-free

**Change:** "risk-free" is an adjective making a promise; the clause after it is the same claim as an
observable fact. `--scan` is read-only, which self-test check [7c] holds for the dry-run path and which the
scan module has no deletion call at all to violate.

### S-063 · README.md:328 · Examples · goal 2
```
Rehearse tonight's cleanup
```
**Was:** Rehearse tonight's cleanup

**Change:** none. The rehearsal motif and a time of day, in three words, and the only cell in the table that
puts the reader somewhere rather than telling them what a flag does, which is why it survives a pass that
rewrote the two cells on either side of it.

### S-064 · README.md:329-330 · Examples · goals 3 and 4
```
Reclaim the most space as a developer
Reclaim everything a non-developer can
```
**Was:** the same pair.

**Change:** none. Both already use the glossary verb.

### S-065 · README.md:331 · Examples · goal 5
```
Find `node_modules` in projects idle 6 months
```
**Was:** Find `node_modules` in projects idle 6 months

**Change:** none. It names the flag's effect rather than the flag, which is what a goal column is for.

### S-066 · README.md:332 · Examples · goal 6
```
Reclaim the browser caches after closing the browsers
```
**Was:** Free the browser caches after closing the browsers

**Change:** "free" is a banned store word and "free up" is the glossary's banned form of `reclaim`. The second
half of the line stays, because the order of operations is the point: the running-app guard will skip an open
browser.

### S-067 · README.md:333-335 · Examples · goals 7 to 9
```
Run the admin sections
Weekly unattended run
Machine-readable output for a script
```
**Was:** the same three.

**Change:** none.

### S-068 · README.md:342-343 · Advanced Features · keep-newest
```
**Keep-newest rule** - Cypress, Playwright, Gradle distributions and Squirrel app installs keep their newest version whatever the idle gate says.
```
**Was:** identical.

**Change:** none. A rule that overrides another rule, named with the four things it applies to. Self-test
check [14] holds it: `Remove-SupersededVersions keeps app-1.10.0 and removes 1.9.0 and 1.0.0`.

### S-069 · README.md:345-348 · Advanced Features · editor hygiene and compaction
```
**Editor hygiene** - workspace storage whose folder is gone and extension folders the editor's own `extensions.json` no longer references.
**Disk-image compaction** - hands back the space a Docker Desktop or WSL `.vhdx` never returns on its own.
```
**Was:** the same pair.

**Change:** none. "Never returns on its own" reads as plain mechanism rather than as a third W moment — it is
what a `.vhdx` does, stated flatly — and it is nowhere near a button either way.

### S-070 · README.md:350-352 · Advanced Features · reports and crash bundles
```
**Report export** - schema-versioned JSON to Markdown or a self-contained HTML page, no extra tools.
**Crash bundles** - the command line writes one locally on an unexpected exit, never transmitted.
```
**Was:** **Report export** - schema-versioned JSON to Markdown or a self-contained HTML page, no extra tools.
/ **Crash bundles** - captured locally on an unexpected exit, never transmitted.

**Change:** the Crash bundles bullet gains a subject; Report export is untouched.

This one was left to judgement, and the judgement is that it needs scoping more than the other two do,
because the collision is closest. **Thirteen lines below this bullet**, the Desktop app section says the
window "sends usage and crash reports". A reader who meets "crash bundles ... never transmitted" and then
that sentence within one screen has to work out unaided that they name two different artefacts — the zip the
command line writes to `%USERPROFILE%\.windowsweep\` and the desktop window's own crash reporting. Four words
resolve it, and "never transmitted" keeps the emphatic last position, so the band-R refusal is not spent to
buy the accuracy.

---

## §H Recovery & Troubleshooting, Limitations

### S-071 · README.md:376 · Troubleshooting · execution policy
```
`windowsweep.ps1` started directly under the `Restricted` policy → Use `npx windowsweep`, `windowsweep.cmd`, or `powershell -ExecutionPolicy Bypass -File windowsweep.ps1`
```
**Was:** the same cause and fix.

**Change:** none. The error is quoted verbatim, then the cause, then three fixes.

### S-072 · README.md:377 · Troubleshooting · REFUSE
```
The path resolves inside a protected folder → Working as designed; `--list-targets` shows the list
```
**Was:** identical.

**Change:** none. "Working as designed" is the right answer and refuses to apologise for it.

### S-073 · README.md:378-380 · Troubleshooting · three console symptoms
```
The browser or app is open → Close it and run the section again
The console is not elevated → Add `--elevate`, or run the `system` profile
stdin is redirected → Use `--all --yes` or `--dry-run`
```
**Was:** the same three pairs.

**Change:** none.

### S-074 · README.md:381 · Troubleshooting · reclaimed less than scanned
```
The idle gate kept recently used files; open apps were skipped → Lower `--days`, close the apps, or `--purge-all`
```
**Was:** identical.

**Change:** none. This is the row that stops the idle gate reading as a bug, and it is the only place
`--purge-all` is offered as an answer rather than described as a flag.

### S-075 · README.md:382 · Troubleshooting · an extension folder went
```
The editor's `extensions.json` no longer referenced it → Reinstall from the editor; referenced folders are never touched
```
**Was:** identical.

**Change:** none. The fix, then the refusal that bounds it.

### S-076 · README.md:389 · Limitations · the section opener

**Change:** none — **the proposed framing line is withdrawn.** The first draft added *"These are the limits,
not the small print. Each one is a thing this tool cannot do, stated here so it is not discovered later."*
above the bullets, reasoning that the Bible's per-surface rule makes Limitations part of the pitch rather
than an appendix.

It is withdrawn because the fingerprint's own opener rule forbids it: **start on the fact or the refusal,
never on a throat-clearing frame.** This draft already cut "What sets it apart is restraint" at S-008 on
exactly that reasoning, and a frame is not more permissible because the section under it is the one being
defended. It is also a "not X but Y", and that budget is one per 300 words. The seven bullets open with "No
undo for caches ... that is the whole design", which reads as pitch with no help: the strongest thing the
section can do is start on the limit itself.

The Bible's rule is still discharged, at S-020, by a forward pointer into this section — an open loop paid
off later, which retains where a frame does not. The section keeps opening on its first bullet.

### S-077 · README.md:389-390 · Limitations · no undo
```
**No undo for caches.** They regenerate on next use; that is the whole design. Personal files use the Recycle Bin instead.
```
**Was:** identical.

**Change:** none. The safety constraint stated as a limitation, with the distinction between the two kinds of
deletion in the same bullet. It is also the section's opener now that S-076 is withdrawn, and it is a better
one than the frame was.

### S-078 · README.md:391 · Limitations · Windows only
```
**Windows only.** Linux and macOS are blocked at install and at launch.
```
**Was:** identical.

**Change:** none. Both enforcement points named: `"os": ["win32"]` and the launcher's platform check.

### S-079 · README.md:392 · Limitations · no number
```
**It cannot promise a number.** `--scan` measures your disk; the README will not guess.
```
**Was:** identical.

**Change:** none. The Bible's hardest rule, written as a limitation the file imposes on itself.

### S-080 · README.md:393-395 · Limitations · the idle gate
```
**The idle gate is conservative.** Windows keeps last-access times off on most volumes, so the tool reads the newest of write, access and creation time - a file can only look fresher than it is, never older. Some old caches survive the default window; `--days` and `--purge-all` exist for that.
```
**Was:** identical.

**Change:** none. Restored hedging done properly, in the words "on most volumes", plus a direction-of-error
statement that tells a reader which way the mistake goes. The longest bullet in the section and it earns it.

### S-081 · README.md:396 · Limitations · admin sections
```
**Admin sections need an elevated console** and a UAC click; a Scheduled Task runs the safe batch only.
```
**Was:** identical.

**Change:** none.

### S-082 · README.md:397 · Limitations · Disk Cleanup
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

### S-083 · README.md:398-399 · Limitations · no test suite
```
**No automated test suite beyond `--self-test`.** Correctness rests on the self-test's fixtures, dry-runs and real runs on Windows 10 and 11.
```
**Was:** identical.

**Change:** none, and it is the bravest line in the file.

### S-084 · README.md:384 · Troubleshooting · the pointer
```
More: [Troubleshooting](https://github.com/aoneahsan/windowsweep/blob/main/docs/troubleshooting.md).
```
**Was:** identical.

**Change:** none.

---

## §I FAQ, Documentation, Support

### S-085 · README.md:404-406 · FAQ · will it delete my code
```
**Will it delete my code or documents?**
Not from a protected folder, and not without asking. Documents, Desktop, Pictures and cloud-sync folders are hard refusals. Section 17 lists build artefacts in idle projects and removes only what you select.
```
**Was:** identical.

**Change:** none. The direct answer arrives in the first nine words, which is what an answer engine quotes and
what a worried reader needs. Question map row 4, near enough verbatim.

### S-086 · README.md:408-410 · FAQ · does it phone home
```
**Does it phone home?**
Not the command-line tool. Zero network calls, no telemetry, no update check. The self-test greps the source for HTTP and socket calls; `--report-issue` opens your browser at a pre-filled page you submit yourself. The desktop window is a separate program and does send usage and crash reports. What it never sends is listed under [Desktop app](#desktop-app).
```
**Was:** **Does it phone home?** / No. Zero network calls, no telemetry, no update check. The self-test greps
the source for HTTP and socket calls; `--report-issue` opens your browser at a pre-filled page you submit
yourself.

**Change:** the answer gets a subject and a pointer. This is the ordered fix and the largest single reason
for this round.

The bare **"No."** was true of the product when it was written and is not true of the page it sits on. Forty
lines above, the Desktop app section states that the window sends usage and crash reports and that there is
no switch; the same section describes the updater, which falsifies "no update check" if the sentence is read
as covering the whole product. An unqualified denial a reader can disprove by scrolling up does not merely
lose the FAQ — it puts every other guarantee on the page into question, and this file is read by people who
have been lied to by a cleaner before.

The claim is **scoped, not softened**. Of the command-line tool it remains exactly true, with a check that
fails the build; that is the Bible's §3 commitment 3 as corrected on 2026-09-07, which is explicit that the
strong claim is kept where it is earned rather than lost to a product-wide phrasing. The desktop clause is
two sentences: the first names what the window does send, the second points at the section 40 lines up that
lists what it never sends. Nothing is hedged and nothing is buried.

🔴 **Content-map question row 7's answer sentence is deliberately not reused.** It reads "The desktop app can
send analytics and sends nothing until you accept", which predates the owner's removal of the opt-out on
2026-09-07 and is now false. Repeating it here would put a promise of consent on the most-read safety
question in the file. It is already recorded as an open item for the keeper; this slot simply does not use
it.

**Cost, stated:** the file loses "No." — its shortest sentence and the answer with the most force in it. Four
words replace one. That is a real loss of rhythm at the file's sharpest moment, and it is paid because the
alternative is a sentence that is not true.

### S-087 · README.md:412-414 · FAQ · why keep 100 days
```
**Why keep files used in the last 100 days?**
Because a developer's caches are what make the next install fast. `--days 30` or `--purge-all` when you want more, `--not-developer` when the machine has no development on it.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 10's reasoning, and the answer to a question that reads as a
complaint.

### S-088 · README.md:416-417 · FAQ · why is Chrome skipped
```
**Why is Chrome skipped?**
An open browser keeps its cache files locked and half-written. Close it and run `windowsweep --only 7 --yes`.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 7. It ends on the exact command, which is where this voice ends
an answer.

### S-089 · README.md:419-421 · FAQ · why PowerShell
```
**Why PowerShell rather than an .exe?**
Every Windows machine has PowerShell 5.1: no runtime to install, no binary to trust, and the source is readable in an afternoon.
```
**Was:** identical.

**Change:** none. "No binary to trust" is the argument a solution-sceptical reader was already making, and
"readable in an afternoon" is a claim about 44 files and roughly 366 kB unpacked, which is checkable.

### S-090 · README.md:423 · FAQ · the pointer
```
More: [FAQ](https://github.com/aoneahsan/windowsweep/blob/main/docs/faq.md).
```
**Was:** identical.

**Change:** none.

### S-091 · README.md:430-432 · Documentation · read it when, rows 1 to 3
```
you want the full map
running your first cleanup
you want every guarantee spelled out before deleting anything
```
**Was:** the same three.

**Change:** none. Each cell is a moment rather than a topic, which is what makes the column worth having.

### S-092 · README.md:433-437 · Documentation · read it when, rows 4 to 8
```
you want to know what the first question changes
you want to know precisely what one section touches
you need an exact flag, exit code or variable
before running the system profile or touching the hibernation file
parsing the JSON or finding a log
```
**Was:** the same five.

**Change:** none. Row 7 is the only one written as a "before", and it is the one about the hibernation file.

### S-093 · README.md:438-441 · Documentation · read it when, rows 9 to 12
```
an agent or a script runs it for you
you want the window rather than the command line
something failed
you want to know what is verified and what is still open: every phase and sub-task with its state and evidence
```
**Was:** the same four.

**Change:** none, and reversed from the first draft in two ways.

**The table gained a row.** The Desktop app row arrived with that section's apply and now sits between the AI
guide and Troubleshooting, so this slot covers four cells rather than three. Its cell is a moment, like the
rest of the column, and it belongs to content-map row 14 rather than to this draft.

**And the last row is disk's, not the draft's.** The old fence read "the desktop app, the story pass and the
verification runs", which describes what was open on the day it was written — a cell that goes stale on its
own. Disk reads "every phase and sub-task with its state and evidence", which describes the *file* and stays
true however the work moves. The link beside it also points at the tracked `00-tracker.json` rather than at
`remaining-work-summary.md`, for the reason set out at S-032: that file is outside git and the link would 404.

Two words for the troubleshooting row and twenty for the project-status row, side by side.

### S-094 · README.md:475-476 · Support · issues and bug reports
```
Questions and bugs: [open an issue](https://github.com/aoneahsan/windowsweep/issues). For a bug, run `windowsweep --debug-bundle` first and attach the zip after reviewing it - it contains paths from your machine.
```
**Was:** identical.

**Change:** none. The warning about the zip's contents is the whole reason this sentence is on voice: it tells
the reader to read a file before sending it, which is the same instinct as naming a path before deleting it.

### S-095 · README.md:477-478 · Support · security
```
Security reports go privately to [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com); see [SECURITY.md](https://github.com/aoneahsan/windowsweep/blob/main/SECURITY.md).
```
**Was:** identical.

**Change:** none.

### S-096 · README.md:480-481 · Support · the support link
```
If this tool saved you time, you can support its maintenance at [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep).
```
**Was:** identical.

**Change:** none. Conditional, no pressure, one link, and the link is the only permitted one. No price is
stated or implied anywhere in this file, which is the correct discharge of the project's standing pricing
exemption: silence, not an advertisement of free.

---

## Found while writing, reported rather than fixed

None of these is a wording change and none may be made from this draft.

**One factual defect in a reference table.** Section 5's row at line 211 says "dangling layers" where
`WS_SECTIONS` says "dangling images" — Docker's own noun, and the thing `docker image prune` removes.

**Closed since the first draft.** That draft also reported line 123's "400-character path", which is now
**445** on disk and matches what the self-test prints. Nothing further is owed on it.

**The at-a-glance and Features counts drift with the engine.** Three numbers in this file are true today and
will move when section 26 lands: 26 sections, 151 checks, 105 declared targets. IRON rule 7's cascade already
names the at-a-glance row; 105 is new with S-024 and needs adding to that list, or it will be the number that
goes stale first.

**Five places carry the tagline, not three.** `package.json`, `WS_TAGLINE` in `lib/constants.ps1`, the docs
site's `docusaurus.config.ts`, **this file at line 7**, and the bundled engine copy at
`desktop/src-tauri/resources/windowsweep/lib/constants.ps1`. The last of those is regenerated by
`yarn sync:cli`, so it follows automatically — but only if that command is run. Detail in `tagline.md`.

**The Desktop app section landed, and the note about it is retired.** The first draft said the section "is not
inserted here" and pointed at `desktop-readme.md` for its copy, its table-of-contents entry, its anchor and
the companion edit to S-021. All four are on disk: the H2 at line 355, the anchor at 354, the row at 61 and
the amended clause at 98. This draft's only remaining business with it is the three CLI-side network claims it
sits beside, handled at S-031, S-070 and S-086.

**Question-map row 7 is stale and is already the keeper's.** Its answer sentence promises "sends nothing until
you accept", which the owner's removal of the opt-out on 2026-09-07 made false. It is recorded as an open item
against `content-map.md`; S-086 works around it rather than repeating it, and nothing in this draft edits the
map.

---

## Self-check

**Palette.** Band **P** dominates as row 1 requires and carries every rewritten line that states a mechanism
or a count: S-006, S-009, S-013, S-024, S-031, S-044, S-062, S-082, S-086. Band **R** carries the refusals at
S-006, S-017, S-018, S-020, S-026, S-029, S-070, S-077 and S-085. The opening sentence at S-006 moved into
first position precisely so the file's first claim is a refusal. That was the point. Band **W** appears
**twice**, which is what row 1 now asks for after its 2026-09-08 amendment: "which ones bite back" (S-014,
`README.md:81`) and "a cleanup run is a cleanup run" (S-050, `README.md:235`), 154 lines apart and both far
from any destructive command. Both are shipped. Both are kept. S-069's "never returns on its own"
was reconsidered this round and is read as plain mechanism rather than as a third W: it states what a `.vhdx`
does, with no aside in it.

**Rhythm.** Shortest shipping string: "none" at S-018, one word in a table cell. Shortest sentence: "No
install needed:" at S-039, three words, then "No flag changes that." at four (S-006). 🔴 **The previous
holder is gone on purpose** — "No." at S-086 was the file's one-word answer and its sharpest moment, and
scoping it to "Not the command-line tool." costs four words for one. That is recorded as a loss rather than
smoothed over. Longest: S-014's first sentence at fifty-two words of named tools, and the chokepoint bullet
at S-024 at forty-six of named refusals; both are lists and both earn it. The added lines follow the
fingerprint's shape: S-006 is eleven words then four, S-009's first sentence is twenty, S-020's added pointer
is ten, and S-080's middle sentence runs thirty-one. No banned phrase appears; the one allow marker is at the
top of this file.

**Length.** Row 1's cap is not a word count. It reads "the existing structure, fixed anchors", and that part
is met outright. **29 headings in, 29 out — 25 `##` and 4 `###`, counted with `grep -c` on the file this
morning.** The first draft said "28 in, 28 out"; that was 24 `##` + 4 `###` and it was correct when written.
The Desktop app H2 landed since. The true figure is 29. Nothing is added or removed here: S-052 and
S-053 rename two `###` headings and the count is unchanged. Every `<a id>` is untouched, and the two renames
were proved unlinked by grep before they were made.

Word counts were then measured section by section against the current file, fences excluded and links
flattened, because "no section grows" is the useful reading of that cap:

| Section | On disk | With this draft | Delta | What the delta is |
|---|---|---|---|---|
| Opening paragraph | 102 | 127 | **+25** | S-006's added refusal (15) and S-009's corrected sentence (+6) |
| Why windowsweep prose | 171 | 181 | **+10** | S-020's forward pointer into Limitations |
| Features | 309 | 345 | **+36** | S-024's verification sentence (17) and S-031's scope plus mechanism (19) |
| Advanced Features | 90 | 94 | **+4** | S-070's subject |
| Limitations | 152 | 153 | **+1** | S-082's rewrite; S-076 adds nothing now |
| FAQ | 160 | 186 | **+26** | S-086's subject (+3) and the desktop clause (23) |
| Examples | 83 | 85 | **+2** | S-062 |
| Quick Start | 37 | 37 | 0 | S-044 is a word swap |

Total **+104** on 3,057 words of visible body copy, so **3.4 per cent**. Every added word is a named
mechanism, a corrected fact, or a subject a claim needed in order to stay true. **Limitations no longer grows
at all**, which is the clearest single effect of dropping the S-076 frame: the first draft put 26 words there
and now puts one.

🔴 **The lint hook cannot check any of this.** This draft is slot-shaped — every shipping string lives inside
a numbered code fence — and `posttooluse-story-lint.sh:61` strips every fence before it counts anything. So
the hook measures this commentary and reports nothing about the copy a reader will actually see. **A green hook
here proves nothing**. The fact-checker and a human reader are the only real gate here, and the figures above
were measured by hand against `README.md` rather than read off a report.

**Unsure.** No `NEEDS DECISION` in this draft: every fact in it was read out of the tree or measured against
the file on disk this session. Four judgement calls are worth naming rather than hiding.

**S-020's added pointer** is the one addition this round makes that nobody ordered. The developmental round
ordered the S-076 frame dropped and *offered* a forward clause as the retaining alternative; it is taken,
because dropping the frame with nothing in its place leaves the Bible's "Limitations is part of the pitch"
rule with nothing discharging it. Ten words. It sits before the closer rather than after it, so the emphatic
last position survives. Reversible in one edit if the reviewer wanted the plain deletion.

**S-070's scoping** was left explicitly to judgement and is taken, on the grounds that its collision with the
Desktop app section is thirteen lines away — the closest of the three — and that four words fix it without
spending the refusal.

**S-013** replaces "actively maintained" with a release date, which adds a row to the version cascade's
maintenance burden and states `1.1.0` twice in one table. A reviewer may reasonably prefer the adjective, or
the date alone; both alternatives are written into the slot.

**S-052 and S-053** change two `###` headings; the anchor evidence is in S-052 and the change is refused if
any linked reference is found later.

One phrase is allowed on purpose. "Elevate" is on the shared banned list as an inflation verb and is, in this
product, the literal name of the `--elevate` flag and the Windows term for what it does.
