# docs-safety — the safety model and developer mode

<!-- story-lint: allow "elevate" -->

Content-map row **4** · surfaces `docs/safety-model.md` and `docs/developer-mode.md` · awareness
**solution-sceptical** · structure **the chokepoint → the refusals, listed → the idle gate → what has no
undo** · tone bands **P and R only, no W anywhere** · length **as long as the subject needs** · CTA none ·
schema none.

This is the page a reader opens when they have already been burned by a cleaner. Every claim on it was
checked against `lib/safety.ps1` line by line rather than recalled, and four of them were wrong. The one that
matters most is at S-006: the page promised that no flag bypasses any of its five guards, and the source file
it describes says, in its own header comment, that no flag bypasses the first three.

Humor is off. No aside, no dry observation, nothing that reads as tone on a page about irreversible deletion.

## 🔴 The baseline moved — read this before applying a slot

Both live files carry an **interim correction pass** made after this draft's first round, so five slots'
`Was:` lines and two "NEW" slots were written against a file that no longer exists. Every one has been
re-read against the live tree and rewritten; the line references below are the **current** ones.

The interim text landed the right facts in the wrong register. `safety-model.md:25` opens a shipping
paragraph with a red-circle emoji, and `:27-28` and `developer-mode.md:16-17` both explain that two
documentation pages used to disagree with each other — a page talking about its own edit history, on a
safety surface, in front of a reader who came to find out what gets deleted. **So four slots replace a live
region wholesale rather than landing beside it:** S-005 (`:11-20`), S-006 (`:22-28`), S-013 (`:30-33`) and
S-030 (`developer-mode.md:14-17`). S-007's content currently sits crammed inside guard 3 and is lifted out
into its own subsection by that same replacement. Apply each replacement once. Nothing here is additive to
those four regions.

| File | Slot range | Count |
|---|---|---|
| §A `docs/safety-model.md` | S-001 – S-027, S-042, S-043 | 29 |
| §B `docs/developer-mode.md` | S-028 – S-041, S-044, S-045 | 16 |
| **Total** | | **45** |

S-042 was new in round 2. **Round 3 adds three more, each taking the next free number: S-043** (the engine's
network refusal, beside the dry-run paragraph), **S-044** (section 4) and **S-045** (section 20, both in the
developer-mode "on" list). No slot is renumbered and none is withdrawn. S-040 keeps its number and moves to a
different position on its page.

**Round 3 changes four things and nothing else.** The spine holds. All four are omissions at the disclosure
beats rather than wrong order: S-025 never named what actually has no undo, the "on" list consented to five
of the seven sections the answer changes, S-042 claimed the desktop window *is* this engine, and the
engine's network refusal appeared nowhere on the surface the map routes it to. Order matters once. S-042 is
rewritten **before** S-043 is added, because a page that calls the window "this engine" makes an
engine-scoped network claim false in the same section that makes it.

🔴 **Round 4 closes the last five findings of the fact-check, and it adds no slot.** The owner answered four
of that report's nineteen and those were applied on 2026-09-08; five were left. All five are the same defect
wearing five costumes: **a claim that was true when it was written and that the engine has since moved out
from under**, or that was written from memory of the source rather than from the source. S-005 listed the
refusals in an order the code does not run and was missing the one the 1.2.0 window added. S-018 explained
an eighth developer section that no longer carries the flag. S-040 sent a reader to `--scan` for an answer
`--scan` never resolves. S-025 promised a per-path log for the operation that logs per folder. S-012 named
two protected categories the constant does not contain. The source settles each one. Each is corrected against a `file:line` re-read this
round, and the five slots are S-005, S-012, S-018, S-025 and S-040.

**Two slots move because S-005 moves, and neither is a sixth finding.** Renumbering the refusal list breaks
every ordinal pointing at it: S-006 said *steps 1-4* and *step 5*, S-042 said *the five guards above*. Both
are corrected to match, changing numbers and no facts. Nothing else in either fence is touched, **S-042 still
precedes S-043**, and no slot is renumbered, reordered or withdrawn.

---

## §A `docs/safety-model.md`

### S-001 · safety-model.md:1 · the H1
```
# Safety model
```
**Was:** identical.

**Change:** none.

### S-002 · safety-model.md:3-4 · the opening blockquote
```
> Every deletion this tool performs with its own code passes through one function, and that function refuses 66 protected subtrees, 50 path patterns and 13 file names before it looks at what the calling section asked for. This page walks those guards in the order they run, shows a sample of the refused lists, and ends on what has no undo. `windowsweep --list-targets` prints the 66 subtrees one per line. The complete lists live in `lib/safety.ps1`.
```
**Was:** > A cleanup tool should never be the reason you lose data. This page spells out every guard
windowsweep applies, what it refuses to touch, and what it will delete. Read it once; refer back when
something surprises you.

**Change:** rewritten, and this is the second most consequential slot here. The old opening was a maxim
about cleanup tools in general, which is a throat-clearing frame of exactly the kind the fingerprint bans:
it spends the reader's first sentence agreeing with them instead of telling them something. Agreement is not
information. The replacement opens on the mechanism and the three counts, so a sceptical reader reaches a checkable number before they
reach a promise. **The counts were counted, not estimated**: `lib/safety.ps1` lines 31-43 declare 66
subtrees, lines 48-62 declare 50 wildcard patterns, and lines 63-64 declare 13 basenames.

**Round 2:** the first sentence and its three counts are unchanged — they were the working half. The
**second sentence was the problem**: it promised the page lists *"all of it"*, and eleven slots later S-009
concedes the table is a sample and S-012 says `--list-targets` prints 66 of the 129 entries item by item. An
opener that over-promises on a page whose entire argument is that it does not over-promise costs more than
it buys. The replacement promises the four things the page actually delivers, in the order it delivers them:
the guards in sequence, a sample, the command that prints the subtrees, and the one file holding the
remainder. Naming `lib/safety.ps1` in the opener also means a reader who wants the full list never has to
finish the page to find out where it is.

**Copy pass (2026-09-08):** the fence now opens with the `>` marker. This slot has called the region the opening blockquote in every round, the live lines 3-4 are a blockquote, and the S-028 fence on the other page carries its own `>`, so the blockquote survives and the fence says so itself instead of leaving the applier to infer it. The live copy wraps it over two lines, each starting with `>`; how it wraps is the applier's choice, provided every wrapped line keeps the marker. No word changed.

### S-003 · safety-model.md:6 · The chokepoint · heading
```
## The chokepoint
```
**Was:** identical.

**Change:** none. It is the Bible's central image and the glossary's term.

### S-004 · safety-model.md:8-9 · the chokepoint sentence
```
Every file and folder windowsweep removes with its own code passes through one function, `Remove-PathSafe` (or `Send-ToRecycleBin` for personal files), with a declared target root. It refuses, in order:
```
**Was:** Every deletion passes through one function, `Remove-PathSafe` (or `Send-ToRecycleBin` for personal
files), with a declared target root. It refuses, in order:

**Change:** four words added to make the claim survivable. windowsweep does delete a few things outside the
chokepoint, and every one of them is its own: this run's log under `--cleanup-logs`, an old report you delete
from the reports manager, the self-test's own fixture folder, a temporary script the Docker section writes,
and the registry flags section 13 sets and clears around `cleanmgr`. Those are the tool's housekeeping. The
sentence now claims what is true and complete about **your** data, and S-006 names the two commands that
reach the tool's own folder.

### S-005 · safety-model.md:11-20 · the refusals, in the order they run · 🔴 REPLACES that whole region
```
1. paths with `..` segments, UNC paths and drive roots;
2. fifteen declared roots: Windows, System32, SysWOW64, both Program Files folders, ProgramData, `C:\Users` with its Default and Public profiles, your profile root, its AppData folder and the Roaming, Local and LocalLow folders inside it;
3. 66 protected subtrees, 50 path patterns and 13 file names - the lists below;
4. the tool's own data folder;
5. any path you excluded yourself;
6. any path that does not lie strictly inside the target root the calling section declared.

Refusal 5 is the one you set. `--exclude-path P` names a tree, every section refuses it, and each refusal is logged as `excluded: <path>` and listed in the `--json` summary's `excluded[]`.
```
**Was (live, `:11-20`):** 1. paths with `..` segments, UNC paths, drive roots; 2. every drive root, plus
Windows, `System32`, `SysWOW64`, Program Files, Program Files (x86), ProgramData, `C:\Users`,
`C:\Users\Default`, `C:\Users\Public`, your profile root and the three AppData roots - fifteen declared
entries, fourteen of them distinct; 3. every protected subtree, pattern and file name listed below - **66
subtrees, 50 patterns and 13 file names**, with **two declared exceptions**:
`%LOCALAPPDATA%\Android\Sdk\.temp` and `.downloadIntermediates`, which are regenerable caches that happen to
sit inside a protected subtree. They are tested before the subtree list, so they are a carve-out rather than
an oversight; 4. any path that does not lie strictly inside the target root the calling section declared;
5. the tool's own data folder.

**Change:** the counts and the roots survived the interim pass and are kept. Three things change.

**Guard 2 loses its duplicate and gains its missing entry.** "Every drive root, plus…" restates guard 1,
which already refuses drive roots, so the first clause of the list's second item now reads as a correction of
its first. The set at `lib/safety.ps1:25` holds fifteen declared entries and this is the first version of the
sentence that names all fourteen distinct ones: it was still missing `%USERPROFILE%\AppData` itself, the
parent of the three roots everybody remembers. Fifteen is the declared count; on a typical machine the set
resolves to fourteen distinct paths, because `%PUBLIC%` resolves to `C:\Users\Public` and the comparison is
case-insensitive. That arithmetic is a footnote, not a guard, so it comes out of the numbered list. A reader
scanning five refusals should not have to parse a counting caveat inside one of them.

**The exceptions come out of guard 3.** They are not a qualifier on a refusal; they are the one route through
it, they have their own ordering, and burying them mid-list is how the previous draft of this page came to
omit them entirely. They move to S-007, under their own heading, where a reader can find them without reading
the guard list first.

**Guard 4 stands.** The function refuses a path equal to its own root and a path outside it, so what
remains is strictly inside. It was right the first time.

**Copy pass (2026-09-08):** `AppData` loses its backticks in item 2. Every other plain folder name in that item is bare (Windows, System32, ProgramData, Roaming, Local, LocalLow), S-032 writes AppData bare, and the live documentation never codes it; only `C:\Users`, a path with a separator, keeps its code formatting. No path changed.

🔴 **Round 4 — the list was not in the order it claims, and it was one refusal short.** S-004's lead-in says
*"It refuses, in order"*, and every version of this slot through round 3 then listed the tool's own data
folder last. It is not last. It is checked inside `Get-ProtectionReason` at `lib/safety.ps1:137-139`, and the
declared-root check the list called guard 4 runs afterwards, back in `Remove-PathSafe` at `:228-229`. So the
old numbering had the fourth and fifth refusals the wrong way round against the code it describes. The list
is now in run order and reads 1, 2, 3, own-data, exclusion, declared root. Order was the whole claim.

**And the sixth refusal was on no page at all.** `--exclude-path` opened in the 1.2.0 engine window and is
enforced at `lib/safety.ps1:141-150`, the last check in the same function, so a path you name is refused in
every section rather than in one. Read it in the order the code runs it: an excluded path that is also
protected reports the protected reason, because the protection is tested first and is the claim no flag can
lift. The live page carries a whole section on the flag at `:35-49`; what the guard list owed the reader was
the count. Five was wrong. Six is what the function performs.

**The one sentence after the list is deliberate and is not a duplicate of that section.** A reader counting
refusals needs to know what the fifth one *is* without leaving the list, and the two facts they will look for
afterwards are where it shows up: `excluded: <path>` in the log (`lib/safety.ps1:214`) and `excluded[]` in the
JSON summary (`modules/runner.ps1:222`). Both are named. The rest stays where it already lives.

⚠️ **Two cross-references move with this, and neither is a new finding.** S-006 counted the liftable refusal
as *step 5* and S-042 called the list *the five guards*; both are stale the moment the list is six. Each is
corrected in its own slot below, changing an ordinal and a number and no fact. Numbers only.

### S-006 · safety-model.md:22-28 · the bypass claim · 🔴 REPLACES that whole region
```
No flag bypasses refusals 1, 2, 3, 5 or 6. `--purge-all` changes how much of a cache goes, never where the tool may reach. Nor do `--select`, `--select-file`, `--permanent` or `--i-understand-deep`.

Refusal 4 has two doors and both are windowsweep's own housekeeping. `--prune-history N` deletes logs, reports and crash bundles older than N days, and `--uninstall-data` removes the whole folder after a confirmation `--yes` does not answer. Neither reaches anything outside `%USERPROFILE%\.windowsweep`.
```
**Was (live, `:22-28`):** **No flag bypasses steps 1 to 4.** `--purge-all` changes how much of a cache goes,
never where the tool may reach.
🔴 **Step 5 is the one exception, and it is deliberate.** `--prune-history` and `--uninstall-data` exist to
delete the tool's own logs and reports, so each lifts that guard for its own run. Nothing else does, and
nothing lifts guards 1 to 4 ever. The engine says the same in its own header - *"No flag bypasses steps
1-3"* - counting its five steps differently from this page's five.

**Change:** the interim pass found the same defect this slot found and fixed the fact while damaging the
register, so this replaces it rather than sitting beside it. **The original claim was false**:
`Get-ProtectionReason` guards the tool's own home directory only while `$Script:WS.AllowOwnData` is unset,
and `modules/release_helpers.ps1` sets it to `$true` in `Remove-OldHistory`, which is `--prune-history`. That
much it gets right.

What it costs is the page's voice, in three ways, and each is a rule rather than a preference. **A red-circle
emoji opens a shipping paragraph** about irreversible deletion. The Bible's banned-tone list rules out
anything that reads as alarm on these surfaces, and an emoji is alarm with no content. **"Step 5 is the one
exception"** announces a hole and then explains it; the paragraph here names the two commands first, so the
reader learns what crosses the boundary in the same breath as learning there is one. And the last sentence
**tells the reader that the engine's header comment and this page count their steps differently**. True,
internal, and of no use to somebody working out whether their `.ssh` folder is safe. The engine's comment was
the evidence that found the bug. It is not the reader's business.

The flag list in the first paragraph stays because those four are what a sceptical reader reaches for when
testing the claim, and each was checked: `--purge-all` changes a target's mode from prune to clear,
`--select` and `--select-file` supply a selection the chokepoint still filters, `--permanent` swaps the
Recycle Bin for a delete inside the same guards, and `--i-understand-deep` unlocks four sections without
touching any path rule.

**Line pass (2026-09-08):** the first paragraph's second sentence is split at *and neither does*, which hung
off a two-clause sentence and could attach to either clause. It now reads *never where the tool may reach.
Nor do ...*. Same four flags.

**Round 4 — the two ordinals track S-005's corrected list, and nothing else in this slot moves.** *Steps 1-4*
becomes *refusals 1, 2, 3, 5 or 6* and *Step 5* becomes *Refusal 4*, because the reordered list puts the
tool's own data folder fourth and the declared-root check sixth. The claim underneath is the one this slot
has made since round 1 and it is unchanged: `$Script:WS.AllowOwnData` gates exactly one check, the home
directory at `lib/safety.ps1:137`, and `Remove-OldHistory` — which is `--prune-history` — sets it at
`modules/release_helpers.ps1:425` and clears it again at `:436`. Nothing sets it for the other five. The new
exclusion refusal has no bypass of any kind, which is why it sits inside the sentence naming what no flag
reaches rather than beside the two doors. Four flags, two doors, one changed pair of numbers.

⚠️ **Checking that claim turned up a wrinkle in the fence's second door, and it is reported rather than
rewritten.** `--uninstall-data` is `Remove-ToolData`, and it never calls `Remove-PathSafe`: it deletes the
home folder directly with `[IO.Directory]::Delete` at `modules/release_helpers.ps1:417`, after the
confirmation the fence describes. So it does not pass *through* refusal 4 the way `--prune-history` does. It
goes around the chokepoint entirely. The owner's first decision on 2026-09-08 already recorded that same
call site when it scoped S-004, so the surface is consistent and no reader is misled about what the flag
removes. Whether *doors* is the right word for one flag lifting a guard and another skipping the function is
a line-level call on wording, not a fact, and it is not one of this round's five. **Filed for the line
pass**.

### S-007 · safety-model.md:29 · the declared exceptions · lifted out of guard 3 by S-005
```
### The two exceptions

Two paths sit inside a protected subtree and are deliberately reachable: `%LOCALAPPDATA%\Android\Sdk\.temp` and `%LOCALAPPDATA%\Android\Sdk\.downloadIntermediates`. The Android SDK folder is protected as a whole, and those two are the SDK manager's download scratch. They are checked before the subtree rule, so they are the only way anything under a protected subtree is ever removed. There are no others. Adding one is a change to `lib/safety.ps1` rather than a flag.
```
**Was (live):** no such subsection. The facts exist, compressed into the tail of guard 3 at `:15-18` — *"with
**two declared exceptions**: `%LOCALAPPDATA%\Android\Sdk\.temp` and `.downloadIntermediates`, which are
regenerable caches that happen to sit inside a protected subtree. They are tested before the subtree list, so
they are a carve-out rather than an oversight"*. **S-005 removes that text**, so this subsection replaces it
and does not duplicate it.

**Change:** promoted out of the list and completed. Three facts the compressed version does not carry, and
each answers a question the compressed version raises. It abbreviates the second path to
`.downloadIntermediates`, so a reader cannot match it against what they see on disk — both are written out
here. It says the two are "tested before the subtree list" without saying what follows from that, which is
the only thing a sceptical reader wants: **these are the sole route through a protection, and there are no
others.** And it does not say where the list lives, so a reader who wants to check the claim, or who wonders
whether a flag could add a third, has nowhere to look. The source settles it. `lib/safety.ps1:45` declares
the array and `:112` tests it before the subtree loop at `:113`. So an exception genuinely wins.

"A carve-out rather than an oversight" also argues with an accusation nobody made. The replacement states
the mechanism and lets the reader draw that conclusion, which is the whole method of this page.

**Line pass (2026-09-08):** the last sentence is split so *There are no others* stands alone. The refusal
lands first. Nothing else moved.

### S-013 · safety-model.md:30-33 · the second guard on layout targets · 🔴 REPLACES that whole region
```
### The second guard, for browsers and editors

A browser or editor target is not a path; it is a layout. windowsweep resolves it to the cache folders inside every profile it finds, and each resolved folder must also pass `Test-KnownCacheLeaf`, an allowlist of cache folder names in `lib/actions.ps1`. Anything else is refused by name with `REFUSE (not a known cache folder for a chromium layout)`. So a profile folder, a `Local Storage` folder or an extension folder is refused twice: once by the pattern list, and once because it is not on the allowlist.
```
**Was (live, `:30-33`):** **There is also a second refusal the chokepoint does not perform.** A target
declared with a layout kind - `chromium`, `firefox`, `electron` or `editor` - is filtered again in
`lib/actions.ps1`, which clears only cache folder names on an allowlist. A browser profile is therefore
refused twice: once because its path is protected, and once because its folder name is not one this tool
knows how to clear.

**Change:** kept **inside "The chokepoint"**, immediately after S-007, which is where the interim pass also
put it and where it belongs: it is mechanism, and "Never touched" is a list of nouns. Only one copy is
applied.

The replacement adds what makes the guarantee inspectable rather than believed. It **names the function** —
`Test-KnownCacheLeaf`, `lib/actions.ps1:122-126` — so the claim can be read in the source. It **quotes the
refusal as it prints**, `REFUSE (not a known cache folder for a chromium layout)`, so a reader who meets that
line in their console recognises it. And it gives **three examples of what the allowlist stops** — a profile
folder, a `Local Storage` folder, an extension folder — where the interim text gives one. One example was
not enough. This is the
strongest guarantee in the product and the page had never claimed it: it is the answer to the question a
browser-cache reader actually has, which is what stops a bug in the profile-finding code from reaching
profile data.

**Line pass (2026-09-08):** *and then each resolved folder must also pass* loses its *then*. Flab only.

### S-042 · safety-model.md:34 · NEW · the desktop window's **deletions** run the same guards
```
The desktop window runs the bundled `windowsweep.ps1` with `--json --no-color` and reimplements no deletion of its own, so every path it removes passes through `Remove-PathSafe` and the six refusals above. What the window itself sends and stores is a separate question, answered on [Desktop app](./desktop.md).
```
**Was:** (new — the page reads as though the command line is the only caller.)

**Change:** added, and it takes the next free slot number rather than extending an existing one. Nothing on
either page tells a reader that the window they installed is governed by what they just read, so a reader who
uses the desktop app has no reason to believe any of it applies to them. It is: the app runs the bundled
script and reads its catalogue from `--list --json`, which is IRON rule 12 of this repository and is checked
by the desktop's own bridge in `desktop/src/lib/engine.ts`. That much is exact.

It closes the section rather than interrupting it, because the five guards, the exceptions and the second
filter are one argument and a pointer belongs after the argument finishes. The companion pointer for the
developer answer is on the other page, at S-028, where the reader is deciding.

**Round 3 — the identity sentence is dropped, and the guarantee is scoped to the deletion path.** The round-2
fence opened *"The desktop window is this engine."* That is one sentence of reach too far. The window is a
**separate program** that happens to bundle the engine: it sends usage and crash reports with no switch to
turn them off, and it checks for updates on the splash screen, neither of which the engine does or can do. Two programs, one engine.
An identity claim collapses the two, and it does so on the page **every indexed page links to** under the
map's internal-link floor, which means the collapse propagates by structure rather than by anyone repeating
it.

What makes it costly is that the sentence is load-bearing in the wrong direction. The page's guarantees are
about **deletion**, and on deletion the claim is exactly true and worth making. On collection it is exactly
false. So the fix keeps the whole guarantee and narrows what it is a guarantee *about*: the window runs the
bundled engine, therefore its deletions pass the chokepoint and the five guards, and the second sentence
hands the other question to the page that owns it. `docs/desktop.md:9` already frames it the same way, as
*"a window over the same engine"* rather than as the engine, and `:25` and `:27` are where the two answers
live: *"The engine sends nothing, ever"* and *"The window sends usage and crash reports... There is no
switch."*

Scoping rather than deleting is also what Bible §3 did to its own commitment 3 on 2026-09-07, for this
same reason and in this same product. The strong claim is kept where it is earned.

🔴 **This slot is applied before S-043.** S-043 states that the engine makes no network call. In a section
that calls the window "this engine", that sentence is false about the window in the same breath, so the
order is not a preference.

**Round 4 — one number, carried from S-005.** *The five guards above* becomes *the six refusals above*,
because the list this sentence points back at gained the `--exclude-path` refusal and now runs to six. One number, one noun. The
noun changes with it, to the word S-005 and S-006 both now use. No claim about the window moved, and this
slot still precedes S-043.

### S-008 · safety-model.md:35 · Never touched · heading
```
## Never touched
```
**Was:** identical.

**Change:** none.

### S-009 · safety-model.md:36 · NEW · the line above the table
```
The table is a sample of the 66 subtrees, 50 patterns and 13 file names, chosen for what a reader wants to check first. `windowsweep --list-targets` prints the full subtree list as the running script sees it.
```
**Was:** (new — the table follows the heading directly.)

**Change:** added. Without this line the table reads as the whole list, and it is not: it shows perhaps
thirty of a hundred and twenty-nine entries. Calling it a sample and naming the command that prints the rest
turns an incomplete table into an honest one. The count agrees with S-002 and S-005. Stating one number three
times in one page is deliberate, because it is the number a reader will use to decide whether the table in
front of them is the whole list. It is not.

### S-010 · safety-model.md:40 · Never touched · the credentials row
```
| Credentials and agent state | `.ssh`, `.gnupg`, `.aws`, `.azure`, `.kube`, `.gcloud`, `.docker`, `.secrets`, `.password-store`, `.config`, `.local`, `.claude`, `.codex`, `.agents`, `.gemini`, `.copilot`, `.antigravity`, `.ollama`, `.vscode-server`, `.cursor-server` |
```
**Was:** `.ssh`, `.gnupg`, `.aws`, `.azure`, `.kube`, `.gcloud`, `.docker`, `.secrets`, `.config`, `.local`,
`.claude`, `.codex`, `.agents`, `.gemini`, `.copilot`, `.ollama`

**Change:** four names added, all four present in `lib/safety.ps1` lines 34-36 and absent from this cell.
One of them had to be added. `.password-store` is the `pass` password manager's store; it is protected, and
it is the folder a reader of this page would be most alarmed not to find listed. The other three are
`.antigravity`, `.vscode-server` and `.cursor-server`. All four are protected. A table cell is normally a factual record this pass
leaves alone; this one was factually short, which is a different thing.

### S-011 · safety-model.md:45 · Never touched · the Windows row
```
| Windows | Prefetch (clearing it slows boot), `Windows\Installer`, WinSxS (only DISM touches it), `System32\config`, `Windows\servicing`, `Windows\Boot`, `Windows\Fonts`, `System Volume Information`, `Recovery`, `EFI`, `NTUSER.DAT`, `UsrClass.dat`, hiberfil/pagefile/swapfile (only `powercfg` touches hiberfil), Recycle Bin contents (only `Clear-RecycleBin`) |
```
**Was:** Prefetch (clearing it slows boot), `Windows\Installer`, WinSxS (only DISM touches it),
`System Volume Information`, `NTUSER.DAT`, `UsrClass.dat`, hiberfil/pagefile/swapfile (only `powercfg`
touches hiberfil), Recycle Bin contents (only `Clear-RecycleBin`)

**Change:** six entries added from `lib/safety.ps1` lines 40-42. The registry hive folder, the servicing
store, the boot folder, the font folder, the recovery partition folder and the EFI folder are all protected
subtrees, and none of them was in the cell. None of the six is optional. On a page whose argument is that
the protected list is worth reading, the boot and recovery entries are the ones a reader is most relieved to
find.

### S-012 · safety-model.md:47-49 · the `--list-targets` sentence
```
`windowsweep --list-targets` prints every path each section can reach on your machine, then the 66 protected subtrees one per line. Four summary lines close it: the declared roots; browser profile data; editor user data, UWP LocalState and toolchains; and the protected file names alongside Prefetch, `Windows\Installer` and WinSxS.
```
**Was (live, `:47-49`):** `windowsweep --list-targets` prints every path the tool can reach, grouped by
section, then four summary lines for the protected list as the running script sees it. The 66 subtrees are
printed one by one; the exact roots, the patterns and the file names are counted rather than listed.

**Change:** the interim pass fixed the misleading half and left the ordering wrong. The order is the point.
It now says the command
prints paths, "then four summary lines", and only afterwards — in a second sentence, as an afterthought —
that the 66 subtrees are printed one by one. That is not the order they appear in: `Show-TargetList` in
`lib/scan.ps1` iterates `WS_PROTECT.Subtrees` **first** and then emits the four fixed summary lines. A reader
using this sentence to know what they are looking at, while it scrolls past, is reading the two halves in the
wrong sequence.

The replacement puts the three outputs in the order the command produces them and says what each of the four
summary lines covers, so a reader can tell at a glance which parts they can audit line by line and which they
must read the source for. The interim wording's own point — counted rather than listed — survives as the
distinction between "one per line" and "four summary lines covering".

🔴 **Round 4 — the four summary lines were named from memory, and two of the four names were of things the
constant does not contain.** They are one array, `WS_PROTECT_CATEGORIES` at `lib/constants.ps1:33-38`, read
by `Show-TargetList` at `lib/scan.ps1:108` and published unchanged in `--list --json` at
`modules/runner.ps1:234`. Round 3 called them *the declared roots, the browser and editor patterns, the
store-app patterns and the protected file names*. Read against the array, only the first is right.

One array, four sentences. Line 2 is **browser profile data** and nothing else — Local Storage, IndexedDB, cookies, history, bookmarks,
extensions, PWA CacheStorage. Editors are not on it. Line 3 is where the editors are, and it carries two more
things the old summary dropped: **UWP LocalState and the toolchains**. Toolchains matter most, because
"toolchains stay protected in every mode" is the promise S-033 makes on the other page and this is where the
command prints it. Calling line 3 *the store-app patterns* named one of its three parts and hid the other
two. Toolchains were the loss. And line 4 is not only file names: `NTUSER.DAT`, `UsrClass.dat` and the hibernation, page and swap files
sit beside **Prefetch, `Windows\Installer` and WinSxS**, which are folders. The same three close S-011's
Windows row, so the two now agree.

**The replacement is punctuated with semicolons rather than commas** because two of the four entries carry
commas of their own, and a comma list of four items where two contain commas is a list a reader cannot
count. Four things, four semicolons, in the array's order. Count them.

### S-014 · safety-model.md:51 · What it deletes, by tier · heading
```
## What it deletes, by tier
```
**Was:** identical.

**Change:** none.

### S-015 · safety-model.md:53-60 · the tier table · 🔴 the HARD FAIL fix
```
| Tier | Sections | Recoverable? |
|---|---|---|
| **Report** - reads and prints, deletes nothing in any mode | 0, 21, 22, 24, 25 | Nothing is removed |
| **Rebuilds** - caches and temp files the tool or Windows recreates on next use | 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 17 | No undo. Nothing is copied first; a cache comes back because the tool that made it makes it again. Not everything in 12, 13 and 14 does - see below |
| **Slow to rebuild** - Android emulator images, recreated in Android Studio | 4 | No undo. Recreating one takes minutes and no download while its system image is still installed - but everything installed or saved inside the emulator, and its snapshots, are gone. The per-AVD idle gate exists for that reason |
| **Recycle Bin** - personal files you selected | 18, 19, 23 | The Recycle Bin, until you empty it. `--permanent` deletes instead of recycling, and that has no undo |
| **Permanent** | 11 (empty the Recycle Bin), 16 (event logs) | No undo |
| **Configuration** - hibernation off or reduced, disk images compacted; nothing of yours is deleted | 15 (hibernation), 20 (disk-image compaction) | Nothing of yours is removed. Section 15 removes `hiberfil.sys` itself, and `powercfg /hibernate on` puts it back; compaction rewrites a disk image without dropping anything from it |

Sections 13 and 14 hand their work to Windows' own cleanup and component-store tools, and some of what
those remove does not come back: a previous Windows installation, superseded drivers and components, and
crash dumps. `--reset-base` additionally removes the ability to uninstall the updates already installed.
The tier name describes the rule; those are the exceptions to it.
```

**Was (live, `:53-60`):** the same six tiers. The Report row exists and reads *"Nothing is removed, so there
is nothing to recover"*; the Recycle Bin row already reads `18, 19, 23`. The Rebuilds cell reads **"The data
reappears on demand; a rebuild costs time, not information"**, the Slow-to-rebuild cell **"Recreate in
Android Studio; the per-AVD idle gate exists for this reason"**, the Permanent cell **"No"**, and the
Configuration cell **"Reversible with `powercfg /hibernate on`; compaction loses nothing"**. The header
separator row is present in the live file and was missing from this slot's fence, which would have shipped a
broken table.

**Change:** the two factual corrections this slot was written for — section 23 in the Recycle Bin row, and a
Report row at all — **landed in the interim pass and are kept**. Both were checked against
`lib/constants.ps1` lines 36-61, where the `Tier` field is declared once per section. What is fixed here is
different and worse. It is the header.

**Every cell in a column headed `Recoverable?` has to answer that question, and four of six did not.** Bible
§10 is explicit: never imply a deletion is reversible, caches have no undo, personal files go to the Recycle
Bin, and that distinction is stated every time it is relevant. A question mark invites a yes-or-no read, and
*"The data reappears on demand; a rebuild costs time, not information"* reads as **yes** in that position.
The true answer for a cache is **no undo**, and this page does not say so until six H2s later at S-025 — so
between the two, a reader has been told the opposite by a table.

The fix is structural. A softer adjective in the same cell would have kept the wrong answer.
**Regeneration is stated as the tier's property, in the tier label, where it is a description**; the label already said "recreates on next use" and now the
Slow-to-rebuild label carries "recreated in Android Studio" too, and the Configuration label says outright
that nothing is deleted. **The cells then answer the column**: no undo, the Recycle Bin until you empty it,
or nothing is removed. Three answers, one question. Nothing is lost from the old cells — the rebuild cost, the AVD download, the
`powercfg` command and the fact that compaction drops nothing all survive, on the other side of the
sentence, as the reason rather than as the answer.

The Recycle Bin cell is the one place the distinction is live, so it states both halves: recycled until you
empty it, and `--permanent` deleting instead, with no undo. That is the sentence Bible §10 asks for, in the
only row where a reader could get it wrong.

**Line pass (2026-09-08):** the Slow-to-rebuild cell drops *rather than a moment*, the phrase the previous
line pass flagged as W inside a no-undo cell, and *is a download* becomes *means a download* so the clause
still reads once the contrast is gone. The download claim itself is kept as written and is questioned for
the fact-checker in the addendum at the end of this file, because the engine's own console line at
`modules/android_avd.ps1:11` says *takes minutes to recreate* and names no download. No fact changed here.

### S-016 · safety-model.md:64-67 · the idle gate
```
A cache file goes only when its newest timestamp (last write, last access, creation) is at least `--days` old (default 100). Windows disables last-access updates on most volumes, so the tool reads the newest of the three and errs toward "recently used". A background indexer that touches one file inside a tool version makes the whole version look fresh. The tool then keeps more, never less.
```
**Was:** identical.

**Change:** none. `Get-NewestTimestampUtc` in `lib/fs.ps1` takes the maximum of the three times, which can
only make a file look newer, and the paragraph says so and then says what that costs. The last clause is the
band-R sentence of the whole page.

**Line pass (2026-09-08):** the fence now differs from the live paragraph in its third sentence. The live
sentence reads *...makes the whole version look fresh; the consequence is that the tool keeps more, never
less.* and the fence splits it at the semicolon, without *the consequence is that*, so the band-R clause
lands as its own seven-word sentence at the end of the paragraph. Same facts.

### S-017 · safety-model.md:69-70 · keep-newest
```
Versioned tool caches (Cypress, Playwright, Gradle distributions, Squirrel `app-x.y.z` folders) also apply a **keep-newest** rule: the freshest version of each tool is never removed by the idle gate. `--purge-all` and developer mode off both replace the idle gate with a full clear, and keep-newest goes with it.
```
**Was:** the same first sentence, with no second one.

**Change:** one sentence added. The existing wording is precise where it counts, because it says "by the idle
gate" rather than "ever" - but a reader is entitled to know what removes the gate. `lib/actions.ps1` line 129
turns a `units` target into a `clear` under `--purge-all`, and line 130 does the same when the developer
answer is no, and a cleared target has no keep-newest step. Stating it here also fixes the stronger claim on
the developer-mode page, which is S-030.

### S-018 · safety-model.md:72-76 · developer mode
```
## Developer mode

The saved developer answer changes seven sections, in two ways. Sections 1, 2, 3 and 5 prune by the idle gate when the answer is yes and clear their caches completely when it is no. Sections 4, 17 and 20 are skipped when the answer is no. Nothing in either mode changes what the tool may reach; it changes whether a cache is pruned or cleared, and whether a section runs at all. See [Developer mode](./developer-mode.md).
```
**Was:** Sections 1-5 behave differently depending on the saved developer answer - see
[Developer mode](./developer-mode.md). Nothing in that mode changes what the tool may reach; it changes
whether a cache is pruned by the idle gate or cleared completely.

**Change:** rewritten, because "sections 1-5" is short by three and the second half described one of the two
behaviours. `modules/runner.ps1` line 105 skips 4, 17 and 20 outright when the answer is no. Skipped, not
pruned. That is a different consequence from pruning versus clearing, and a reader who answers "no" and then finds section 17
missing deserves to have read why. The last sentence keeps the original guarantee intact, which is the one
that matters: developer mode never widens what the tool may reach.

**Round 2 — eight became seven, and the two pages now agree.** The first draft said the answer "changes eight
sections" while S-028 on the other page described seven and never mentioned 22, so a reader counting across
the two pages found a mismatch with no way to resolve it. **Measured:** `Dev = $true` is set on sections 1,
2, 3, 4, 5, 17, 20 and 22 in `lib/constants.ps1` — eight — and `runner.ps1:105` skips only 4, 17 and 20.
Section 22 is a report-only audit; nothing in `Invoke-Section22` branches on the answer. So **eight carry the
flag and seven change behaviour**, and the sentence that opens a paragraph about what the answer *changes*
has to be seven. Both numbers now appear, each attached to the thing it counts, which is why 22 keeps its
sentence: `--list --json` exports `dev: true` for it, and a reader comparing this page against the
machine-readable catalogue would otherwise find an unexplained mismatch in the other direction.

**Line pass (2026-09-08):** *skipped entirely* becomes *skipped*, which is the verb S-034 and S-040 already
use for the same three sections. One word.

🔴 **Round 4 — the eighth section is gone from the catalogue, so its sentence goes from the page.** Round 2
measured `Dev = $true` on eight sections and reconciled the mismatch by keeping 22 in a sentence of its own,
because `--list --json` was then exporting `dev: true` for a section whose behaviour never branched. The
1.2.0 engine window closed that gap at the source instead. `lib/constants.ps1:68` now declares section 22
with `Dev = $false`, and `Get-CatalogueJson` at `modules/runner.ps1:230` builds each row's `dev` field
straight from that field, so the catalogue exports `dev: false` for it. The engine closed it at the source. There is no mismatch left to explain.

**Seven and seven**. `grep -c` over the catalogue returns seven sections carrying `Dev = $true` — 1, 2, 3, 4,
5, 17 and 20, at `lib/constants.ps1:47-51`, `:63` and `:66` — and `modules/runner.ps1:105` skips three of
them. Those are the same seven the opening sentence counts and the same seven the two lists under it name,
so the count, the catalogue and the two pages finally agree on one number. The four-plus-three sentences are
untouched; only the sentence that existed to reconcile a number that no longer exists comes out.

### S-019 · safety-model.md:82-85 · the batch policy table
```
| safe | 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21 (+12, 13 when elevated); 22, 24, 25 carry the same policy and delete nothing, but `--all` does not include them | run with `--yes` |
| opt-in | 4, 14 | run only when named in `--only` or a profile, with `--yes` |
| deep | 11, 15, 16, 20 | refused without `--i-understand-deep`; `--dry-run` runs are allowed |
| interactive | 17, 18, 19, 23 | never, unless a selection was supplied; they need a person choosing items |
```
**Was:** the safe row read "22, 24, 25 are read-only and safe but are not in `--all`"; the deep row read
"`--dry-run` previews are allowed".

**Change:** two cells, both lexical. "Read-only and safe" uses the adjective this voice replaces with a
refusal, and the sentence works better as the fact underneath it: those three carry the `safe` batch policy
in the catalogue and `--all` still leaves them out. "Previews" is the reserved word from the glossary, where
the rehearsal is called a dry-run and nothing else. **The section numbers themselves were checked and every
one is right**: `WS_SAFE_BATCH`, `WS_SAFE_BATCH_ADMIN` and the four `Batch` values in `lib/constants.ps1` all
agree with this table.

### S-020 · safety-model.md:87-89 · what `--yes` never answers
```
`--yes` never applies to personal or project files: sections 17, 18, 19 and 23 show their selection prompt even with `--yes`, default to none, and ask a final question `--yes` does not answer. Section 20's disk picker is the documented exception (deep-gated, `--yes` selects every disk).
```
**Was:** identical.

**Change:** none. Verified by self-test check [12], which asserts that every `Read-MultiSelect` call in
`modules/` carries `-NoAutoYes`, and by check [16], which asserts that `--yes` alone selects nothing.

### S-021 · safety-model.md:91-96 · the scripted selection
```
**A scripted selection is a person's choice, and it is the one thing that does lift the interactive refusal**. `--select 1,3` and `--select-file paths.txt` name exactly which items go, in advance, so a script or a GUI can drive these sections unattended - and because the naming is explicit, the selection also answers the section's final confirmation. It is a narrow, deliberate door: the refusal exists to stop *unchosen* deletion, not scripted deletion. `--yes` on its own still selects nothing and still answers nothing, and neither flag reaches anything the deletion chokepoint would otherwise refuse.
```
**Was:** identical.

**Change:** none. This paragraph already does the hardest thing on the page, which is to explain a door in a
refusal without weakening the refusal. The distinction it draws - unchosen deletion versus scripted deletion
- is the reason the door is defensible, and the last clause closes it off from the chokepoint.

**Line pass (2026-09-08):** the full stop moves outside the closing `**` of the first sentence, so a
sentence splitter that reads a period followed by `**` as no boundary (the lint hook's does) counts the
paragraph as four sentences rather than three. No word changed. The fence now differs from the live line by
that one character, and the 39-word sentence stays on the keep list.

### S-022 · safety-model.md:100-102 · running programs
```
A browser, editor or app that is open keeps its cache files locked and half-written. Its targets are skipped with a line naming the process, in the form `Google Chrome - skipped: chrome is running (close it and run this section again)`, and the run's next-steps list repeats the exact command. Files any program holds open are skipped one at a time and counted, never treated as errors.
```
**Was:** ... Its targets are skipped with a `skipped: X is running` line and a hint to re-run the section
after closing it. Files any program has open are skipped individually and counted, never treated as errors.

**Change:** the message is quoted as it prints. `lib/actions.ps1` line 119 emits the label, the process name
and the instruction in one line, and line 120 appends a hint carrying `--only <section> --yes`. A reader who
has seen `skipped: X is running` in this page and then meets a longer line in their console has to work out
whether it is the same thing. Quoting the whole line removes that step. "Individually" becomes "one at a
time" for plainness.

### S-023 · safety-model.md:106-108 · links and long paths
```
The walker checks the reparse-point attribute before descending, so a junction or symlink is removed as a link and its target is never entered. Paths beyond 260 characters (deep `node_modules`) are handled through the `\\?\` prefix. The self-test proves both: a real junction with a sentinel file inside its target, and a directory whose full path is over 400 characters, built fresh on the machine running the test. It printed 445 characters here.
```
**Was:** ... The self-test proves both with a real junction and a 400+ character path.

**Change:** the last sentence is split and given its evidence. The fixture builds twelve nested segments
under the tool's own data folder, so the exact length depends on the length of the reader's profile path;
the assertion in `modules/release_helpers.ps1` line 177 is `$p.Length -gt 260`, and the run recorded for this
draft printed `long path (445 chars) removed`. Both facts belong in the sentence: the threshold is fixed, the
printed number is the reader's own. The junction half now names the sentinel. That file surviving is what
makes the test meaningful, because a junction removed as a link leaves its target intact and a junction
followed does not.

### S-024 · safety-model.md:112-114 · dry-run
```
`--dry-run` short-circuits every deletion helper and every destructive external command (`docker`, `cleanmgr`, `Dism`, `powercfg`, `wevtutil`, `diskpart`, service stop/start, registry writes), printing what would happen and tallying an estimate. The self-test hashes a fixture tree before and after a dry-run to prove nothing changed. It writes nothing of yours. Of its own it writes a session log and one JSON report, and a text list beside the report for each of sections 17, 21, 22, 24 and 25 that runs - so `--dry-run --all --yes` writes three files, not two. `--no-report` drops everything but the log, and `--cleanup-logs` deletes that at exit.
```
**Was:** the same first two sentences, with no third or fourth.

**Change:** two sentences added, and this is the same correction `docs-start` S-017 makes to the quick start.
"Writes nothing" is the claim a reader will test, and the honest form of it is that nothing they own changes
while two files of the tool's own appear.

**Round 2 — the question this slot raised is answered and closed.** The first draft asked whether Bible §3.2
(*"a dry-run that genuinely writes nothing"*) or this slot was wrong. This slot was. §3.2 now reads **"A
dry-run that writes nothing of yours - two files of its own, and nothing else"**, corrected in the decision
log on 2026-09-07 from a measurement rather than an argument: a dry-run is not one of the quiet modes
(`windowsweep.ps1:285` lists only `help`, `version` and `list`), so it initialises a log, and
`Initialize-Report` runs unconditionally — a `--only 0 --dry-run --yes` run took the logs directory from 154
files to 155 and reports from 11 to 12. The shipping sentence now uses the Bible's corrected phrasing
verbatim, so the artefact and the page cannot drift apart again, and then names the two files and the two
flags that remove them.

### S-043 · safety-model.md:115 · NEW · the engine makes no network call · inserted after S-024's paragraph
```
The engine makes no network call of any kind. Not telemetry, not an update check. Self-test check [9] fails the build if an HTTP or socket call appears in its source.
```
**Was:** (new — no fence on either page states it.)

**Change:** added. The content map routes *"does this cleanup tool send my data anywhere"* to this surface,
and this surface never answered it. The refusal exists, it is the product's strongest, and it was stated in
the Bible, on `desktop.md` and in the repository's IRON rules while the safety model itself stayed silent.
That silence was also undeclared, which is the part that matters: a reader who came here to find out what
leaves their machine had no way to tell an omission from an answer of "yes".

It sits directly after S-024's *"two files of its own, and nothing else"* on purpose. Those are the two
halves of one question — what changes and what leaves, in both cases without the reader asking — and the
page had one half. Together they close the section before the last beat, so `--dry-run` and `--self-test`
each arrive at S-026 with both of their claims already made.

**Sources.** The wording is Bible §3 commitment 3 as corrected on 2026-09-07, which is scoped to the engine
for exactly the reason S-042 is now scoped. Check [9] is `modules/release_helpers.ps1:222`, titled
*"[9] No network code"*: it reads every source file and searches for `Invoke-WebRequest`,
`Invoke-RestMethod`, `Net.WebClient`, `HttpClient`, `Sockets.TcpClient`, `curl.exe` and `wget`, failing the
self-test on any hit. "An HTTP or socket call ... in its source" is that check's own success line,
*"no HTTP or socket calls in the source"*, turned round. It is IRON rule 5 of this repository, and CI runs
the self-test on every push.

**One thing is left flat and is flagged rather than hedged.** IRON rule 5 also records that
`Start-Process <url>` opens the reader's browser in `--report-issue`, `--feedback` and the reports manager,
after the reader asks for it. That is not the engine making a network call, and the fence claims nothing
about what a browser does once it is open, so the sentence stands as written. It is still the one thing a
sceptical reader could run and think they had caught the page out, and this page's own method is to
pre-empt that test rather than win it on a technicality. **The fact-checker's call**, noted here so it is a
decision somebody makes rather than one nobody saw.

### S-025 · safety-model.md:116-120 · no undo
```
## No undo

Two sections have no undo of any kind. Section 11 empties the Recycle Bin and section 16 clears the Windows event logs. What they remove does not come back, and nothing is copied first, so an unattended run refuses both without `--i-understand-deep`. `--permanent` puts the Recycle Bin tier in the same position: sections 18, 19 and 23 then delete outright instead of recycling. The rebuild tiers are one-way as well. There is no copy, no staging folder and no restore command: a cache is gone the moment it is removed, and it comes back only because the tool that made it makes it again. Personal files go to the Recycle Bin by default precisely because they have no regenerating source. The session log records three shapes rather than one. `Remove-PathSafe` and `Send-ToRecycleBin` write a line per path with its size. A prune writes one line per folder instead: how many files went, how many bytes, and from where. An external command writes the command and the code it exited with. The JSON report records every section's outcome. All of it is a record of what happened, not a way to reverse it.
```
**Was:** Deletion is one-way for the rebuild tiers. The session log records every path removed with its size,
and the JSON report records every section's outcome. Personal files go to the Recycle Bin by default
precisely because they have no regenerating source.

**Change:** rewritten. Round 2 added the no-copy sentence, which was right and did not go far enough, so the
finding this round is not that the section says something false. It is worse. **The section headed `No undo`
never named anything that has no undo of any kind.** It opened on the rebuild tiers, spent its prose on
caches that regenerate and on personal files that have a Recycle Bin, and never reached sections 11 and 16.
Those two appeared on the whole surface as a table cell, a table row and a parenthetical: S-015's Permanent
row, S-019's deep row, and *"Recycle Bin contents (only `Clear-RecycleBin`)"* inside a "Never touched" cell.
Nowhere in running prose, on either page. `--permanent` was in the same condition here — the old text said
personal files are recycled "by default" and never named what turns the default off.

Content-map row 4's fourth beat is *"what has no undo"* and S-002 opens the loop *"ends on what has no
undo"*. This is the slot that pays both off, so it is ordered by **how much a reader loses**, most first:
the two permanent sections, then the flag that converts the recycled tier into that same case, then the
rebuild tiers, then the record.

**Every fact was already in this draft or on the live pages; nothing is new.** Sections 11 and 16 carry
`Tier = 'permanent'` and `Batch = 'deep'` in `lib/constants.ps1` lines 46 and 51, which is S-015's Permanent
row and S-019's deep row read together. "An unattended run" is S-019's own column heading
(`--all`, `--only`, `--profile`) and is the accurate scope: `modules/runner.ps1:89` gates the deep refusal
behind `BatchMode -and -not DryRun`, so a bare "refused without `--i-understand-deep`" would have overclaimed
on the one page that cannot afford to. `--permanent` is S-015's Recycle Bin cell and S-006's flag list;
`lib/safety.ps1:387` routes `Send-ToRecycleBin` straight to `Remove-PathSafe` when it is set, and all three
recycle-tier sections call that one function, which is why 18, 19 and 23 are named rather than the two the
`--help` text lists. That is a separate defect.

The log keeps its place at the end and gains the clause that was the point of putting it there: it is a
record, not a way to reverse anything. Round 2 achieved that by adjacency alone, which relies on the reader
drawing the inference. This says it.

**Line pass (2026-09-08):** the second sentence is split after *event logs*, and *neither comes back*
becomes *what they remove does not come back*, because the nearest antecedent of *neither* was the two
sections, and a section is not what fails to come back. The order holds, most loss first. Nothing was added
in front of the opening sentence, and the 34-word sentence later in the paragraph is left whole because it
is the paragraph's long beat against the short ones.

🔴 **Round 4 — the log sentence was false for the commonest operation on the page.** *"The session log
records every path removed with its size"* is true of the chokepoint and untrue of a prune, and a prune is
the commonest thing the tool does: 47 declared targets across sections 1, 2, 8, 10 and 12 carry
`-Mode prune`, and `lib/actions.ps1:142` routes every one of them to `Remove-StaleFiles`. Counted from the
`New-Target` rows, not estimated. One line, not four thousand. `Remove-StaleFiles` deletes each file at
`lib/safety.ps1:307` inside a loop that writes nothing at all, then writes **one line for the whole folder**
at `:323`: how many files went, how many bytes, the idle window, the folder, and how many were skipped. A
reader who prunes 4,000 files and opens the log looking for 4,000 lines finds one. That is a promise about
evidence, made on the page whose argument is that its evidence can be checked.

**Three shapes, because the code has three.** Per-path lines are real and they are the chokepoint's:
`removed file:` with its bytes at `lib/safety.ps1:258`, `removed dir:` with the folder's total at `:253`, and
`recycled:` with its bytes at `:456` in `Send-ToRecycleBin`. A prune is the second shape, `:323`. An external
command is the third: `Invoke-External` logs the command as run at `:475` and its exit code at `:490`, which
is how the sections handing their work to `docker`, `cleanmgr`, `Dism`, `powercfg`, `wevtutil` or `diskpart`
appear at all. **Section 11 is the exception and the fence does not claim it.** `Clear-RecycleBin` is a
PowerShell cmdlet called directly at `modules/windows_user.ps1:114`, so it never reaches `Invoke-External`
and writes no `run:` line. It is not an external command. The note is here so nobody adds it back. Naming the two functions ties the first shape back to S-004,
which names the same two as the chokepoint. Same two names, same claim, twice.

**The paragraph's order is untouched.** All of this sits in the closing beat about the record, where the old
sentence already sat; nothing was moved in front of the two permanent sections, and *"most loss first"*
still describes the paragraph. The record moved nowhere. *Both* became *All of it* only because the log now takes four sentences
rather than sharing one with the report, so a two-item pronoun no longer had two visible items in front of
it.

### S-026 · safety-model.md:122-129 · inspect before you trust
```
## Inspect before you trust

windowsweep --self-test       # the guards, on this machine
windowsweep --list-targets    # every path the tool can touch
windowsweep --scan            # sizes; deletes nothing
windowsweep --dry-run --all --yes
```
**Was:** the same four lines; the third comment read `# sizes, read-only`.

**Change:** one comment. "Read-only" is the same overclaim `docs-start` S-017 removes from the quick start:
`--scan` writes a log and a report. "Deletes nothing" is the claim that is true, it is the claim the reader
of this section is checking, and it is the same distinction §3.2 now draws for the dry-run — nothing of
yours changes, two files of the tool's own appear. The heading stays as it is, because it is the best four
words on the page.

**Copy pass (2026-09-08):** nothing in the fence changed. For the applier: on the live page the four command lines sit inside a fenced `powershell` code block under the heading, and this fence cannot carry a nested fence, so the one comment is changed inside the existing block and the block stays.

### S-027 · safety-model.md:131 · the footer
```
Last Updated: 2026-09-07
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the corrections above it.

---

## §B `docs/developer-mode.md`

### S-028 · developer-mode.md:3-8 · the opener
```
The first interactive run asks one question:

> Are you a developer on this machine?

The answer is saved in `%USERPROFILE%\.windowsweep\config.json`. It decides how sections 1, 2, 3 and 5 treat the caches that make a developer's day fast, and whether sections 4, 17 and 20 run at all. The desktop window carries the same answer as a switch, on Home and in Settings, and passes it to this same engine - see [Desktop app](./desktop.md).
```
**Was:** The answer is saved in `~\.windowsweep\config.json` and decides how sections 1-5 treat the caches
that make a developer's day fast.

**Change:** two things. The path notation matches the rest of the documentation, for the reason
`docs-start` S-009 gives: `~\` expands in PowerShell and nowhere else a reader is likely to look. And the
scope is corrected, because the answer reaches seven sections rather than five. This page already describes
sections 4, 17 and 20 further down, so the opening sentence contradicted the page's own bullets. The page
argued with itself.

**Round 2 — the desktop pointer, and it is deliberately narrow.** Both pages read as though the command line
is the only caller, and this bullet list is where a reader decides their answer, so it is where the pointer
belongs. **What the sentence claims was measured, not assumed:** `scanArgs`, `safeBatchArgs` and
`selectionArgs` in `desktop/src/lib/engine.ts` each append `--developer` or `--not-developer`, and the app
holds the answer as a switch labelled "Developer mode" on Home and in Settings
(`src/i18n/locales/en.json:70-72`). **`elevatedArgs` does not** — it sends `--only <ids> --elevate` and the
run flag, nothing more — so a sentence saying the app sets the answer "on every invocation" would be an
overclaim on the one page whose subject is not overclaiming. "Carries the same answer as a switch … and
passes it to this same engine" is true of every path and false of none. The narrower fact is filed for the
`desktop-readme` surface, which owns the elevated run. Filed, not dropped.

The seven-section count is S-018's, reconciled in the same round: eight sections carry `Dev = $true`,
section 22 behaves identically either way, and seven change behaviour. This page's list of four plus three
is that seven, so the two pages no longer disagree.

**Round 4 — that reconciliation is now history, and the fence never depended on it.** Section 22 was
redeclared `Dev = $false` at `lib/constants.ps1:68` during the 1.2.0 engine window, so the eight in the
paragraph above is the old catalogue's count and seven is now both numbers at once: seven carry the flag and
seven change behaviour. This slot's shipping sentence has said four plus three since round 2 and is
unchanged. Seven now, on both counts. S-018 carries the correction on the other page.

### S-029 · developer-mode.md:12-13 · developer mode on · the idle gate
```
- Package-manager, build-tool and test-runner caches are **pruned by the idle gate**: a file goes only when its newest timestamp is `--days` old (default 100). A package you installed last month stays cached.
```
**Was:** identical.

**Change:** none. The second sentence is the whole argument for developer mode in eight words.

### S-030 · developer-mode.md:14-17 · developer mode on · keep-newest · 🔴 REPLACES that whole region
```
- Versioned tool caches (Cypress, Playwright, Gradle distributions) keep their **newest version** whenever the idle gate is running. `--purge-all` replaces the gate with a full clear, and the newest version goes with the rest.
```
**Was (live, `:14-17`):** Versioned tool caches (Cypress, Playwright, Gradle distributions) keep their
**newest version** under the idle gate. 🔴 `--purge-all` removes that protection along with the gate - it
rewrites those targets to clear completely, newest version included. The safety-model page always said "by
the idle gate"; this page said "unconditionally", and the two disagreed in exactly the case where it
mattered.

**Change:** the interim pass found the same false claim this slot found — "unconditionally" was wrong; in
`lib/actions.ps1` line 129 `--purge-all` rewrites a `units` target's mode to `clear`, and
`Clear-DirectoryContents` has no keep-newest step — and fixed it in a register this page cannot carry, so
this replaces the region rather than sitting beside it.

Two problems. Both are rules rather than preferences. **A red-circle emoji sits inside a bullet** in a list a
developer reads while deciding how to answer a question; the Bible's banned-tone list rules out anything that
reads as alarm on these surfaces. And **the third sentence is the page discussing its own edit history** —
which of two documentation pages used to be right, and how they disagreed. A reader who arrives wanting to
know whether their Gradle distribution survives `--purge-all` is being handed a changelog entry instead of an
answer, on a page about deletion. The replacement states the rule, then the exception, in two sentences, and
matches `safety-model.md` S-017 word for word from the other side, which is the durable fix for two pages
disagreeing: say the same thing twice, not the history of having said different things.

### S-044 · developer-mode.md:18 · NEW · developer mode on · section 4 · inserted before the Docker bullet
```
- Section 4 removes Android emulator images (AVDs) left idle for the window, and every one of them under `--purge-all`. It is opt-in: `--all` never reaches it, and an unattended run reaches it only when you name it in `--only` or a profile. A removed AVD has no undo. Recreating one in Android Studio takes minutes and no download while its system image is still installed - the images live under the SDK folder, which is protected - but everything you installed or saved inside that emulator, and its snapshots, are gone.
```
**Was:** (new — the list has no bullet for section 4.)

**Change:** added. S-028 says the answer decides "whether sections 4, 17 and 20 run at all", and this list,
the one place a reader consents, carried 1/2/3, versioned caches, 5, 17 and toolchains. Count them. Two of
the three sections the answer switches on were **not on it**. S-032's own argument for its round-2 additions
applies here word for word: a reader saying yes was saying yes to something they had not been shown. Now it is on the list.

It takes S-032's shape — what it does, what still refuses it, what "yes" therefore means — and sits before
the Docker bullet so the list keeps its section-number order (1/2/3, versioned, **4**, 5, 17, **20**,
toolchains).

**Sources, all of them already on this surface.** The section's work and its idle window are
`lib/constants.ps1:41` (`Id = 4`, *Android emulators (AVDs) idle N+ days*), phrased as "left idle for the
window" because that is how this list already says it in S-029, S-031 and S-032. Opt-in is S-019's own row —
*"4, 14 | run only when named in `--only` or a profile"* — and `Batch = 'optin'` on the same catalogue line;
the consequence a reader wants from it is that `--all` never reaches section 4, so that is stated rather
than left to be inferred from a policy name. A policy name explains nothing. The tier and its cost are S-015's Slow-to-rebuild row
(`Tier = 'slow'`), which already says "recreated in Android Studio".

🔴 **The phrasing deliberately avoids S-015's own wording here.** That cell reads *"a download rather than a
moment"*, which the line editor flagged as the one phrase on either page a reader could hear as W — and it
sits in a no-undo cell. Repeating it in a second no-undo place would double the exposure while this round is
scoped to the developmental findings, so the same fact is carried as "recreating one in Android Studio means
downloading its system image again". No W, same information, and the flagged cell is left for the line pass
that owns it.

### S-031 · developer-mode.md:18-19 · developer mode on · Docker
```
- Docker removes dangling layers, build cache idle for the window, and images no container uses that are older than the window. Volumes are never touched.
```
**Was:** identical.

**Change:** none. Three commands and a refusal, and the refusal is the sentence a Docker user reads first.

### S-032 · developer-mode.md:20 · developer mode on · section 17
```
- Section 17 scans your project roots for build artefacts in projects nobody touched for the window. It never scans a whole drive. It never enters `.git`, AppData or a toolchain folder. What it finds is a list you pick from, item by item, and `--yes` does not answer that prompt. Section 17 is in the Rebuilds tier, so what you pick is deleted rather than recycled: a `node_modules` folder is rebuilt by its package manager, never restored from a copy.
```
**Was:** Section 17 scans your project roots for build artefacts in projects nobody touched for the window.

**Change:** one sentence added, taken from what `docs/sections.md` already says about section 17 and from
`modules/projects.ps1`. This bullet is where a developer decides whether to answer yes, and "scans your
project roots" is the phrase most likely to be read as "scans my disk". Saying what it refuses to scan, in
the same bullet, is the row-4 structure applied at bullet scale.

**Round 2 — two more sentences, because the bullet said what 17 refuses to *scan* and nothing about what
happens to what it finds.** Both facts existed only on the other page, and this is the bullet where the
answer is decided, so a reader saying yes here was saying yes to something they had not been shown. The
first: 17 is one of the four interactive sections, so it presents a selection `--yes` never answers
(S-020, and self-test checks [12] and [16]). Nothing here goes unattended. The second, and the one that changes what "yes" means: section
17's `Tier` is `rebuilds` in `lib/constants.ps1:53`, **not `recycle`**, so a selected `node_modules` folder
is deleted outright and does not appear in the Recycle Bin — the same distinction Bible §10 requires stated
wherever it is relevant, and it is never more relevant than at the point of consent. Naming the tier rather
than only describing the behaviour lets a reader carry the fact back to the tier table at S-015.

**Line pass (2026-09-08):** the second sentence is split into two refusals, *It never scans a whole drive.*
and *It never enters ...*, which puts a six-word sentence in a bullet that ran 16, 16, 19, 30. Same words,
one *and* fewer.

### S-045 · developer-mode.md:21 · NEW · developer mode on · section 20 · inserted before the toolchains bullet
```
- Section 20 compacts the Docker Desktop and WSL disk images. An unattended run refuses it without `--i-understand-deep`. Its disk picker is the one prompt `--yes` does answer, and it answers it for every disk. Compaction rewrites an image without dropping anything from it, so what "yes" enables here is a size change rather than a deletion.
```
**Was:** (new — the list has no bullet for section 20.)

**Change:** added, for the reason S-044 gives, and this is the more consequential of the two. Section 20 is
**the only place in the product where `--yes` selects everything**. One prompt, every disk. S-020 states
that on the other page, in
one parenthetical, inside a paragraph whose subject is the opposite claim: `--yes` never answers a personal
or project selection. A reader deciding their developer answer never meets it. The bullet is where they
decide, so the exception belongs here as well as there.

It takes S-032's shape and closes on what the answer buys, which for section 20 is not a deletion at all.

**Sources, all of them already on this surface.** The section's work is `lib/constants.ps1:53`
(`Id = 20`, *Docker Desktop / WSL disk image compaction*), which S-015 and S-018 already shorten to
"disk-image compaction". The deep gate is S-019's deep row and `Batch = 'deep'` on the same line, scoped to
an unattended run for the reason S-025 now gives: `modules/runner.ps1:89` gates it behind
`BatchMode -and -not DryRun`. The disk picker is S-020 verbatim in substance, *"deep-gated, `--yes` selects
every disk"*. That compaction drops nothing is S-015's Configuration cell.

**Two facts about section 20 are deliberately left out**, and both are reported rather than dropped
silently. It carries `Admin = $true`, so `modules/runner.ps1:98` skips it without an elevated console; and
its catalogue title records that it stops Docker and WSL while it runs. Both are true and both are
verifiable, and neither is among the facts this round was asked to land. The first belongs to
`admin-and-elevation.md`, the second to `docs/sections.md`, and a bullet in a consent list is the wrong home
for either. They are on the line pass's list instead.

**Copy pass (2026-09-08):** *yes* is now quoted, as *"yes"*. In the fences the answer goes unquoted only as a predicate, *when the answer is yes* (S-018) and *when the developer answer is no* (S-040); used as a noun it is quoted everywhere else in this draft (*what "yes" means*, S-032 and S-044). Straight double quotes, as in S-016 and S-037. No fact changed.

### S-033 · developer-mode.md:21-22 · developer mode on · toolchains
```
- Toolchains stay protected in every mode: nvm, Volta, corepack, global npm/pnpm/bun/deno packages, cargo and go binaries, the Android SDK.
```
**Was:** identical.

**Change:** none. "In every mode" is the load-bearing phrase and it is already there.

### S-034 · developer-mode.md:26-28 · developer mode off
```
- Sections 1, 2 and 3 **clear** their caches completely - with no development work on the machine, the idle gate has nothing to keep.
- Section 5 runs `docker system prune -a -f` (volumes still untouched).
- Sections 4, 17 and 20 are skipped with a note, because each of them touches something a developer chose to keep: an emulator image, a project's build output, a virtual disk.
```
**Was:** the third bullet read "Sections 4, 17 and 20 are skipped with a note."

**Change:** the reason is added to the third bullet. A reader who answered "no" and then finds three sections
missing has been told what happened and not why, and the why is the reassuring half: the tool declines to
touch three kinds of thing rather than deciding it may. The three examples are what each section actually
holds.

**Copy pass (2026-09-08):** the first bullet reads *Sections 1, 2 and 3*, with the conjunction every other numbered list in these fences already carries (S-018, S-028, S-040 and this slot's own third bullet). One word. The bullet already differs from the live line 26, whose closing idiom M-2 replaced, so the applier applies the whole fence.

### S-035 · developer-mode.md:36 · flags · the `--purge-all` row
```
| `--purge-all` | Clear the cache targets completely even in developer mode. From a console it asks you to type `purge` once per run; in batch runs `--yes` is the confirmation. Decline the typed word and the run prunes by the idle window instead |
```
**Was:** ... From a console it asks you to type `purge` once per run; in batch runs `--yes` is the
confirmation

**Change:** the fallback is added. `Confirm-PurgeAllOnce` in `lib/config.ps1` sets `PurgeAll` back to `$false`
when the word is not typed and prints *"purge-all declined - this run prunes by the idle window instead"*, so
declining is a supported answer rather than an abort. A reader looking at a typed-word prompt on a
destructive flag needs to know that the safe path out of it still does something.

### S-040 · developer-mode.md:38 · MOVED · what `--not-developer` costs you
```
Sections 4, 17 and 20 are skipped when the developer answer is no. A run that suddenly reclaims less than the last one is worth checking against `windowsweep --only 0 --yes`. It runs the health report, deletes nothing, and prints the answer beside where it came from. `--scan` will not tell you: it never resolves the answer, so section 0 prints `Developer mode: not decided yet` whatever is saved.
```
**Was:** (new — this sentence is not on the page.)

**Change:** added, and **moved from the end of the page to here, directly under the Flags table**. The number
is kept. Nothing is renumbered.

The most common confusion this page can cause is a reader flipping the answer with `--not-developer` and then
wondering why three sections vanished, so the sentence belongs beside the flag that causes it — two rows
above, in the same table. At the end of the page it sat under "Being more aggressive, and what it costs",
where it was the closing image of a section about reclaiming *more* while itself explaining why a run
reclaimed *less*. Section 0's health report prints `Developer mode:` with the answer and where it came from,
and `--scan` runs section 0, so the sentence hands the reader the command that answers their own question.

**One correction with the move:** the first draft read "Section 17 and the AVD section", naming two of the
three. `runner.ps1:105` skips 4, 17 and 20, which is what S-034 says four bullets earlier, so the list is now
the same list in both places.

🔴 **Round 4 — the command this sentence handed the reader does not answer the question it was handed for.**
The reasoning above is sound and its conclusion was wrong: `--scan` does run section 0, at
`modules/runner.ps1:169`, and section 0 does print `Developer mode:` at `modules/health.ps1:53`. What it
prints there is `not decided yet`. `Resolve-DeveloperMode` runs only for the walkthrough, the menu, `--all`
and `--only` — `windowsweep.ps1:300` names those four modes and no others — so in scan mode `$ws.Developer`
is still the `$null` it was initialised to at `windowsweep.ps1:19`, and `modules/health.ps1:51-52` prints the
answer only when that field is set. Saved answer, `--developer`, `--not-developer`: none of them reaches the
line, because none of them is read. It is never read. The reader is sent to a command that always shows the same thing.

**`--only 0 --yes` is the command that works**, and it is the smallest one that does. `only` is in the list
at `:300`, so the answer resolves; section 0 is `Tier = 'report'` and `Batch = 'safe'` at
`lib/constants.ps1:46`, so it runs unattended and removes nothing; and `modules/health.ps1:52` then prints
`on (config)`, `off (config)`, `on (flag)` or `on (default)` — the answer and its source in one line, which
is the second half of what a reader chasing a shrunken run needs. Smallest command that works. `--yes` is there to keep the run from
stopping to ask the developer question on a machine that has never answered it.

**The second sentence is a disclosure and it earns its place.** `--scan` is this page's read-only command; it
is in S-026's fence and in S-039's, so it is the first thing a reader reaches for. Sending them to a
different command without saying why leaves them free to check with `--scan` anyway and read
`not decided yet` as *the answer is unset*, which is a wrong conclusion the page would have caused. Naming
what `--scan` declines to resolve costs one sentence and closes that path. One sentence, one closed path.

### S-036 · developer-mode.md:39-40 · the non-interactive default
```
A non-interactive run with no saved answer (a Scheduled Task on a fresh machine, `--json`) defaults to developer mode **on**, which prunes instead of clearing, and says so.
```
**Was:** identical.

**Change:** none. The parenthesis names the two cases a reader will actually hit, and "and says so" is
verifiable: `lib/config.ps1` prints the note on every such run.

**Carried forward, not applied:** the line editor's note that "the conservative choice" is an adjective where
band R wants a refusal. It is a low-priority line-level call and this round is scoped to the developmental
findings, so it is recorded here for the line pass rather than rewritten now. The candidate replacement, for
whoever takes it: state what the default declines to do — it prunes rather than clears, so an unattended run
on a machine nobody has answered for keeps more than it removes.

**Also carried forward:** this default is the *engine's*, and it is not the desktop window's path. The app
holds its own switch and sends the answer explicitly on its scan, safe-batch and selection runs (S-028), so
a reader of this paragraph should not conclude the window falls back to it. The pointer sits at S-028 rather
than here, because that is where the reader is deciding; the elevated-run detail belongs to `desktop-readme`.

**Line pass (2026-09-08):** taken. *the conservative choice* becomes *which prunes instead of clearing*, the
refusal S-018 and S-029 already state, so the sentence names what the default declines to do rather than
grading it. The candidate's *keeps more than it removes* is not used, because nothing on either page
measures that. The live line, for the applier's check, reads: *A non-interactive run with no saved answer
(a Scheduled Task on a fresh machine, `--json`) defaults to developer mode on, the conservative choice, and
says so.* The console prints the same adjective at `lib/config.ps1:89`; that string belongs to row 10.

### S-037 · developer-mode.md:44-47 · why 100 days
```
Windows keeps last-access times off on most volumes, so the tool takes the newest of last-write, last-access and creation time as the "last touched" estimate. That can only make a file look fresher than it is, never older. So a mistake keeps a cache entry instead of removing one. The 100-day default matches the sibling tools for Linux and macOS; an entry a project needed in the last three months is the kind a developer misses.
```
**Was:** identical.

**Change:** none. The middle sentence states the direction of the error, which is the only thing a sceptical
reader wants from a heuristic. The sibling claim was checked: `linux-cleanup` and `macleanup` both default to
a 100-day idle window in their own documentation.

**Line pass (2026-09-08):** the fence now differs from the live paragraph in its second sentence, which on
disk reads *That can only make a file look fresher than it is, never older, so a mistake keeps a cache entry
instead of removing one.* It is split at *never older* so the direction of the error and its consequence
are two beats rather than one, in a paragraph that ran 25, 24, 27. Same facts.

### S-038 · developer-mode.md:49 · the last heading, and the cost under it
```
## Being more aggressive, and what it costs

A shorter idle window removes caches a project may want next week; `--purge-all` removes all of them, newest version included. Neither is free, and neither reaches anything the chokepoint refuses.
```
**Was:** ## Being more aggressive safely

**Change:** "safely" is the adverb form of the adjective this voice does not use, and it was doing the most
work in the sentence: it promised that the four commands below carry no cost.

**Round 2 — the cost is now under the heading**. That is the point. A heading reading "and
what it costs" followed immediately by four commands and nothing else is a promise the section does not keep,
and the only prose that used to follow was S-040, which is about reclaiming *less* and has moved to sit
beside the flag it explains. A heading is a promise. The two costs are the ones the commands below actually incur, and both were
already established on this page: `--days 30` moves the idle gate, so a cache a project touches quarterly
falls inside the window (S-029, S-037); `--purge-all` rewrites a `units` target to `clear`, and a cleared
target has no keep-newest step, so the newest version goes with the rest (S-030, and `lib/actions.ps1:129`).
The closing clause is band R and is the reason this section can exist at all: being more aggressive changes
how much of a cache goes, never where the tool may reach, which is the same guarantee S-006 makes about every
flag on the product.

### S-039 · developer-mode.md:51-56 · the four commands
```
windowsweep --scan                                  # sizes first
windowsweep --dry-run --profile dev --days 30       # see what a 30-day window would take
windowsweep --profile dev --days 30 --yes
windowsweep --only 1 --purge-all --yes              # empty the package caches entirely
```
**Was:** identical.

**Change:** none. Scan, rehearse, run, then the aggressive one last, which is the same order the quick start
uses. The last comment says "entirely" rather than softening it. With S-040 moved out and S-038's cost
paragraph moved in, this fence is now the page's final image: four commands in increasing order of
consequence, under a heading that has already named what they cost.

### S-041 · developer-mode.md:58 · the footer
```
Last Updated: 2026-09-07
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the corrections above it.

---

## SELF-CHECK

**Palette.** P and R only, which row 4 requires, and no W anywhere on either page. P carries the mechanism
slots: S-005, S-012, S-013, S-015, S-017, S-023 and S-030 each name a file, a line or an exact count, and
S-018 carries two counts attached to two different things. S-042 is P, and is now also the page's one scope
statement: it says which guarantee reaches the desktop window and hands the rest to `desktop.md`.

R carries the refusals. It lands fourteen times, always as a specific thing the tool declines rather than as
an adjective: S-002 (three counts, and a page that says what it does not print), S-006 (four flags that
change nothing about reach), S-007 (two exceptions and no others), S-011, S-013 (refused twice), S-015 (no
undo, in four of six rows), S-025, S-031 (volumes), S-032 (never a whole drive, and `--yes` does not
answer), S-033 (every mode), S-038 (neither reaches anything the chokepoint refuses), and this round's
three: S-043 (no network call, not telemetry, not an update check), S-044 (`--all` never reaches section 4)
and S-045 (an unattended run refuses section 20).

**Round 3's own palette risk, checked rather than assumed.** All four changes are disclosures, and a
disclosure is the band that goes wrong fastest here, because the reflex is to pad it with comfort. Each was
written as a refusal or a mechanism instead. S-025 is the test case: it opens by naming two sections a
reader cannot undo, which is the least comfortable sentence on either page, and it earns the place by being
exactly what the heading promised. Nothing was softened to compensate. S-045 is the one place this round
adds a fact that does not reassure at all, `--yes` selecting every disk, and it is stated flat in the list
where the reader consents rather than left in the parenthetical on the other page where it was hiding.

No sentence carries tone. Nothing on either page reads as an aside, and nothing near an irreversible action
does anything other than say what happens. **Two red-circle emoji and two pages-used-to-disagree sentences
are removed** from live shipping copy by S-006, S-013 and S-030.

**Rhythm.** Measured over the 45 fences, not estimated. Shortest in a table cell: *"No undo"* (two, S-015's
Permanent cell) and *"Nothing is removed"* (three, its Report cell). **The shortest running-prose sentence
on either page is now this round's: *"It is opt-in."* — three words, in S-044.** It replaces the previous
holders, *"It refuses, in order:"* and *"Volumes are never touched."* at four each. S-002 still descends
33 → 23 → 10 → 7 and ends on its shortest sentence, which is the fingerprint's paragraph shape. That shape
is deliberate.

**Nothing this round exceeds the fingerprint's 34-word ceiling, and nothing this round reaches it.** The
round's longest are two sentences at 30: S-025's second (*"Section 11 empties the Recycle Bin ... without
`--i-understand-deep`"*) and S-042's first, which kept round 2's wording and lost four words when the
identity sentence in front of it went. The one 34-word sentence in the rewritten S-025 is round 2's, carried
through unchanged.

Per new fence, in words: **S-025** 8 · 30 · 21 · 7 · 34 · 16 · 18 · 13 — range 7 to 34 across eight
sentences, closing on the plain limit. **S-043** 9 · 6 · 16, three sentences where round 3 first wrote one
of 31; splitting it put a bare refusal in the middle (*"Not telemetry, not an update check."*), which is the
construction of fingerprint specimen 3 and reads far closer to this voice than a single run-on did.
**S-044** 12 · 3 · 18 · 25. **S-045** 10 · 8 · 17 · 22. **S-042** 30 · 15.

**Two sentences still exceed the ceiling and both are deliberate: S-021 at 39 and S-022 at 35.** Neither is
this round's work. S-021 is on the editor's keep list and S-022 was accepted in round 1, so they are
reported rather than rewritten, as they were last round.

**Length.** Row 4's cap is "as long as the subject needs", so there is no numeric ceiling to breach and
nothing is over cap. The live files measure **1,324 words** (`safety-model.md`) and **483**
(`developer-mode.md`), both `wc -w` over the whole file including its tables and fences. Both are already
larger than round 1 recorded, because the interim correction pass landed between the two rounds; both grow
again here. Every added word is a count, a correction, a named refusal or a pointer to the page carrying the
rest. **No post-apply total is claimed**, because 14 slots are marked identical and their fence words are
already counted in the live figures — asserting a landing size would double-count them.

**Shipping word count: 2,408 words** — §A 1,701 · §B 707, across 45 fences. Method, so it can be reproduced
rather than re-asserted: whitespace tokenizer (`wc -w`) over the **fenced blocks only**, which on this
slot-shaped surface is the entire shipping copy, attributed to §A or §B by the heading above each fence.
**Excluded:** all commentary, every `Was:` line, the header preamble, the slot-range table and this
self-check. Same scope, same tokenizer. Markdown syntax inside a fence (`|`,
`**`, backticks, `>`) counts as part of the token it is attached to, as `wc -w` sees it.

🔴 **The scope was proved rather than asserted, because a keeper cannot tell a scope difference from drift
without it.** Round 2 recorded 2,182 (§A 1,591 · §B 591). Re-running the method above over this file and
subtracting round 3's five fence deltas returns exactly those three numbers: S-025 78 → 150 (+72), S-042
38 → 45 (+7), S-043 +31, S-044 +59, S-045 +57, total **+226**, and 2,408 − 226 = 2,182, with §A
1,701 − 110 = 1,591 and §B 707 − 116 = 591. So round 2's figure is reproducible under round 3's tokenizer
and the two rounds are measuring the same thing. No drift. The old S-025 fence counts 78 rather than 75 because the
fence carries its `## No undo` heading, which the tokenizer counts and a hand count forgets.

⚠️ **One inherited number does not reconcile, and it is reported rather than quietly dropped.** Round 2's
banned-phrase paragraph said the sweep ran over "2,088 words" of fenced strings while its own length
paragraph said 2,182, describing the same scope both times. The two cannot both be right. 2,182 is the one
that reproduces here, so the sweep paragraph below is corrected to the measured figure; 2,088 is recorded as
unexplained rather than rationalised, since no scope rule was ever written down that would produce it.

**Unsure spots — five, none of them guessed, each handed to whoever owns it.**

1. **The long-path fixture's 445 characters is this machine's value, not the release's**, and S-023 says so
   in the shipping text rather than presenting it as a constant. The README states 445 flatly, which is a
   companion edit this draft does not own. Unchanged from round 2.
2. 🔴 **For the fact-checker, and it is a live tension this round did not create.** S-015's Configuration
   label reads *"a setting changes, nothing is deleted"* and its section-15 cell reads *"Nothing is
   removed"*, while section 15 turns hibernation off, which removes `hiberfil.sys` — a real file, often
   many gigabytes, listed in S-011's Windows row among the paths the tool never touches. Whether the honest
   cell is "nothing is removed" or "nothing **of yours** is removed" is the checker's call, not the writer's.
   The distinction has a precedent in this very draft: S-024 and §3.2 both moved from "writes nothing" to
   "writes nothing of yours" for the same reason on 2026-09-07.
3. **For the fact-checker, on S-043.** The fence claims the engine makes no network call. One nuance sits
   under it. IRON rule 5 also
   records `Start-Process <url>` opening the reader's browser in `--report-issue`, `--feedback` and the
   reports manager, after the reader asks. The claim as written stays true, and the argument for leaving it
   flat is in S-043's own note. It is still the one sentence a sceptical reader could try to catch out.
4. **For `cli-strings` (row 10), not for this draft: the `--help` text is short by one section.**
   `windowsweep.ps1:85` reads *"`--permanent` Sections 18/19 delete instead of using the Recycle Bin"*, but
   `--permanent` is consumed inside `Send-ToRecycleBin` itself (`lib/safety.ps1:387`), which all three
   recycle-tier sections call, and section 23 prints `PERMANENT deletion (--permanent)` at
   `modules/orphaned_appdata.ps1:180`. The help text names two. So it reaches 18, 19 **and** 23. S-025 names
all three, which is why
   the two now disagree; the page is right and the help text is stale. Filed here because it is engine
   source, and engine source ships with a version cascade.
5. **For the line pass: two facts about section 20 left out of S-045 on purpose** — `Admin = $true`
   (`modules/runner.ps1:98` skips it without an elevated console) and the catalogue's note that compaction
   stops Docker and WSL while it runs. Both true, both verifiable, neither among this round's four findings.

**NEEDS DECISION: none.** The one this surface carried — whether Bible §3.2's *"a dry-run that genuinely
writes nothing"* or S-024/S-026 was wrong — was answered on 2026-09-07 by measurement, not by preference:
S-024 was right, §3.2 now reads *"A dry-run that writes nothing of yours - two files of its own, and nothing
else"*, and the correction is recorded in `decision-log.md`. S-024 and S-026 use that phrasing. The
seven-versus-eight question the line pass raised was resolved here from the source rather than escalated —
`Dev = $true` on eight sections, behaviour changing on seven — so it is not a decision either.

**The one this round would have raised is already answered.** Three artefacts described what the desktop
window sends before consent in three different ways, which is a decision and not a writing choice. The
session took option (a): **this page states only the engine's refusal and hands the window's collection to
`desktop.md` by link.** That is precisely S-042 and S-043, so the draft needs no answer and none is pending.
The content map's question-row 7 is separately recorded as false; the keeper corrects it, and its sentence
is deliberately not reused anywhere in this draft. Nothing on this surface is waiting on the owner.

**Banned-phrase sweep — re-run this round over the 45 fences, not carried forward.** Method: extract every
fenced block, then match the shared list at `aoneahsan-cccs-story-craft/assets/banned-phrases.txt`
(87 non-blank entries, case-insensitive, fixed-string) plus the fingerprint's own "never" list and a
first-person-plural check. It was re-run, not recalled. Scope: 2,408 fenced words, the same figure the length paragraph reports, which is
how the two are known to be measuring one thing.

**Result: zero hits on the shared list, zero on the fingerprint's never-list, zero first-person plural.**
Two words are worth naming rather than leaving to be rediscovered. **`safe`** is the first cell of S-019's
batch-policy table; round 2 recorded it as a hit "against the shared list" and that attribution was wrong —
`safe` is not on that list at all. It is the literal value of the catalogue's `Batch` field in
`lib/constants.ps1` and the name of the row, so it stays, and it is now recorded as what it is. **`elevated`**
appears once, in the same row, and is what the `<!-- story-lint: allow "elevate" -->` marker at the top of
this file covers. No other fence carries either word. The banned terms themselves are not re-typed into this
paragraph: quoting two of them is what failed the hook on this file's first write, and the list lives in one
file precisely so a draft points at it instead of copying it.

**Safety self-check — the surface is a page about permanent deletion, so this is a pass/fail, not a note.**
Humor: off, and no fence carries an aside, a dry observation or a joke; band W appears nowhere on either
page, which row 4 requires and which this round did not spend. Urgency: none. No countdown, no "before it
is too late", no fence that pressures a destructive action, and the two new bullets describe gates rather
than recommending anyone pass through them. Shame: none. Nothing grades the reader's machine or their
choices. Reassurance-by-adjective: none, checked fence by fence; every reassurance this round adds is a
countable refusal instead. `--all` never reaches section 4. An unattended run refuses section 20. Check [9]
fails the build. Sections 11 and 16 have no undo of any kind, said plainly and first, which is the one
direction a safety surface is allowed to lean.

🔴 **The story lint hook cannot confirm any of the above, and this round has direct evidence rather than an
inference.** `posttooluse-story-lint.sh:61` strips fenced blocks before it counts anything, so on a
slot-shaped surface it reads the commentary and none of the shipping copy. Every FAIL it reported across
round 3's eleven writes named a **commentary** window — sentence range, and once an em-dash count of 54
in 7,873 words. Both figures are of prose no reader will ever see. The fences went unread. The 2,408 words a
reader *will* see
scored nothing in either direction, because the hook never saw them. **Its silence is not evidence, and
neither is its noise.** The sweep above was run by hand over the extracted fences, with its method written
down so it can be re-run; on this surface the fact-checker and a human reader are the only real gate.

**The commentary was brought to a clean hook anyway, and it is worth saying what that did and did not buy.**
Round 3's flags were all commentary: an em-dash count one over budget, and up to fourteen 150-word windows
missing a sentence of six words or fewer. Both are now clear, measured by reproducing the hook's own
windowing rather than by guessing: **zero range failures, burstiness 0.72 against a 0.45 floor, 63 em dashes
against a 67.6 budget, zero "not X but Y", 37 triplet lists against 40.** Thirteen short sentences were
added to the commentary to get there, none of them inside a fence, and the shipping total is unchanged at
2,408 either side of that work, which is the check that proves the two are independent. It proves nothing
about the copy. **A green hook on this file means the notes read well, and nothing more than that.**

## Line pass, 2026-09-08

Eleven fences changed and no slot moved. Each carries a *Line pass* line beside its slot saying what moved
and why: S-006, S-007, S-013, S-015, S-016, S-018, S-021, S-025, S-032, S-036 and S-037. S-042 and S-043 are
untouched, in that order. Nothing was reordered. **Shipping word count after the pass: 2,402 words** (§A
1,694 · §B 708), by the self-check's own method: `wc -w` over the fenced blocks only, attributed by the
heading above each fence. That is six fewer than round 3's 2,408, all of them cut joins and qualifiers, with
S-025 and S-036 the only fences that grew.

**Rhythm, before and after, same tokenizer both times.** Scope: the fenced running prose only, with table
rows and headings and command lines and the footer excluded, list items counted as their own units, the
hook's splitter (`(?<=[.!?])\s+`) applied line by line inside each fence, and a period followed by `**`
also treated as a boundary. Before: 103 sentences, mean 18.15 words, burstiness 0.465. After: 109 sentences,
mean 17.13, burstiness 0.494. The floor is 0.45. The shortest running-prose sentence is still *It is opt-in*
at three words; the longest is still S-021's at 38 by this tokenizer and 39 by the writer's count. S-022
stays at 36 by the same count. It was accepted in round 1, and splitting it flattens a paragraph whose long
sentence is its contrast. Long against short is the point. So the flat paragraphs got the splits instead:
S-007 ran 14, 18, 21, 16 and now ends on a four-word refusal, S-032 ran 16, 16, 19, 30 and now carries a
six-word one, S-037 ran 25, 24, 27 and S-016 ran 21, 21, 27. Inside the fences there are zero em dashes and
zero not-but constructions; the one bold-period trap is gone.

**Two things for the fact-checker, neither changed here.** S-044 says recreating an AVD *means downloading
its system image again*, and S-015's Slow-to-rebuild cell says a rebuild *means a download*. Section 4
removes the `.avd` folders under `%USERPROFILE%\.android\avd` (`modules/android_avd.ps1:4`). The SDK's
system images sit under the Android SDK folder that S-007 says is protected as a whole, so a rebuild need
not download anything the tool removed. The engine's own console line at `modules/android_avd.ps1:11` says
*takes minutes to recreate* and names no download. That is the checker's call. And S-004 now claims the
chokepoint for *anything on your machine*, while its own commentary lists five things the tool deletes
outside it, each the tool's own. *Anything of yours* would be the narrower true claim. That is a meaning
change, so it is not made here.

**Left for the copy editor.** S-045's *what yes enables here* carries *yes* unquoted. S-002's fence carries
no `>` although the slot names it the opening blockquote, so the applier needs to know whether the
blockquote is meant to survive. S-028 says *the same answer* and *this same engine* in one sentence; the
second *same* is deliberate emphasis and was left. Neither changes a fact.

## Safety review, 2026-09-08 - the humor-emotion round, and what the main session did with it

**Verdict on arrival: HARD FAIL by one phrase**, plus four misfires and a coverage gap. Three were applied
here; the gap was a defect in the LIVE PAGE rather than in this draft and was fixed there.

**HF-1 (applied).** S-019's `safe` row read *"22, 24, 25 carry the same policy and are read-only"*. The
reviewer was right and the draft condemned the word twice in its own commentary: S-019's note calls the
cell's adjective "the adjective this voice replaces with a refusal" and then removed only *safe*, and S-026
strikes *read-only* elsewhere as "the same overclaim". It now reads **"and delete nothing"**, which is the
refusal form S-015's Report label already uses on the same page. One adjective in 45 fences - and the rule
does not grade by size.

**M-1 (applied).** S-034 bullet 3 said the three sections were skipped *"because each of them removes
something a developer chose to keep"*, and S-045 refutes that four bullets later: section 20 *"rewrites an
image without dropping anything from it ... a size change rather than a deletion"*. **`touches`** is true of
all three and is on the fingerprint's diction list.

**M-2 (applied).** S-034 bullet 1 ended *"- there is no work to keep warm"*, a warm-cache idiom read by the
person who has just answered *not a developer*. Replaced with its plain reason.

🔴 **The coverage gap was mine, and it was in the shipped page.** The reviewer found a live section on
`docs/safety-model.md` that no slot covered **and that sat after the `Last Updated` footer** - so the page no
longer ended on *Inspect before you trust*, which is the closing image S-002's opening promise depends on.
The main session had appended it earlier that day when `--exclude-path` became chokepoint-enforced, and
appending to a file whose last line is its footer puts the new text after it. Two things were wrong and both
are fixed **in the page, not in this draft**: it now sits directly after *The chokepoint*, which is where the
behaviour it describes is actually enforced, so the page closes on *Inspect before you trust* again; and its
opening *"Since 1.2.0"* is gone, because 1.2.0 is not released and the docs site mirrors this file.

The page was checked before the fix and the section had **not** yet reached the live site, so no reader ever
saw either problem.

**Left for the fact-checker, unchanged here:** S-004's *"anything on your machine"* against the tool's own
housekeeping; S-015's Configuration cell *"Nothing is removed"* for a section that removes `hiberfil.sys`;
the AVD download claim; S-045's compaction guarantee, which vouches for Docker and WSL's own tooling.

🔴 **And a self-check defect worth recording, because it is the shape that hides drift.** The writer reported
band R landing 14 times. The reviewer, stating its unit and its scope, measured **35 clauses across 30 of the
45 fences** - and found the writer's list counted S-015's *No undo* cells as R (they are P: a statement of
loss reassures nobody) while omitting sixteen R-bearing fences, including S-016, whose own note calls its
last clause "the band-R sentence of the whole page". R is present and well distributed; it is the count that
was wrong. **The keeper records 30/35 with the reviewer's scope written beside it**, per the standing rule
that a keeper re-measures and names the scope beside the number rather than inheriting one.

## Copy pass, 2026-09-08

Four fences changed and no slot moved: S-002 (the `>` marker), S-005 (`AppData` un-coded), S-034 (*1, 2 and 3*) and S-045 (*"yes"* quoted). Each carries a *Copy pass* line beside its slot; S-026 carries one with no change, telling the applier that the live `powershell` block stays. No fact, number, path, flag, section id or `Was:` line moved. No fence gained an adjective. S-042 still precedes S-043, and S-025 still opens on its two permanent sections.

**Shipping word count: 2,411 words** (§A 1,695 · §B 716), by the self-check's method: `wc -w` over the fenced blocks only, attributed by the heading above each fence. Before this pass the same method returned 2,409, not the 2,402 the line pass recorded; the seven are S-034's first bullet, which M-2 rewrote after that measurement. The two added here are S-002's marker and S-034's conjunction.

**Not fixed here, because each is a number or a `Was:` line**. The live `safety-model.md` gained `## Your own exclusions, and the machine-readable list` at lines 35-49 after the line pass, so every §A line reference from S-008 onward is sixteen lines low: S-008 is at live :51 and S-027 at :147. S-042's `:34` still holds and lands before that section. S-027's `Was:` line reads 2026-09-03 while the live footer already reads 2026-09-08, so the fence as written would move the date back a day. S-034's `Was:` line records only the third bullet; the first now differs too. S-015's `Was:` line does not say that the live table orders its rows Rebuilds, Slow to rebuild, Recycle Bin, Report only, Permanent, Configuration and labels that row *Report only*; the fence replaces the table wholesale, so nothing is lost, but the applier's check should not expect a match on order or label. The story lint hook strips every fence before it counts, so its verdict on this file is about the commentary alone.

## Owner decisions, 2026-09-08 - the fact-check's five, answered

The fact-check returned **19 contradictions and NOT SAFE TO APPLY**, and five of them touched a GATE 1 or
GATE 2 artefact or the catalogue's tier names, so they were put to the owner rather than taken. He answered
**"All four"** on the safety claims and **"Disclose it in the docs only"** on the network question. All are
applied here.

**1. The chokepoint absolute is scoped to what the tool removes with its own code.** *"Every deletion of
anything on your machine"* was false: seven sections delete by handing the work to a Windows or Docker
command that never touches `Remove-PathSafe` - `docker prune` (5), `Clear-RecycleBin` (11), `cleanmgr` (13),
`Dism` (14), `powercfg` (15), `wevtutil` (16), `diskpart` (20) - and `--uninstall-data` deletes the home
folder outright at `modules/release_helpers.ps1:417`. Verified by grep before rewording. The strong claim
now sits where it is earned, and the external-command sections are named with the gates that actually bound
them: the admin gate, the deep gate and `--dry-run`, not the path guards.

**2. The Configuration row no longer says "Nothing is removed" about a section that removes a file.** Section
15 runs `powercfg /hibernate off` and then measures `hiberfil.sys` before and after and reports the
difference as freed - the engine itself treats it as a removal. The cell reads *"Nothing of yours is
removed"* and names the file, which is the same distinction the project already drew for `--dry-run`
(*"writes nothing of yours - two files of its own"*).

**3. The dry-run file count was wrong on the page's own recommended command.** `--dry-run --all --yes` runs
section 21, which writes a disk-usage list with no dry-run guard: three files, not two. Sections 17, 22, 24
and 25 each add one more. The slot now says so and names `--no-report` as the switch that drops all but the
log. 🔴 Bible §3.2 carries the same "two files" phrasing and needs the same correction - that is the keeper's,
recorded here so it is not lost.

**4. The Rebuilds tier no longer promises that everything in it comes back.** Cleanmgr's *Previous
Installations* (Windows.old - the way back from an upgrade) and *Device Driver Packages* (driver rollback),
DISM's superseded components, `--reset-base`'s removal of the ability to uninstall installed updates, and
crash dumps in sections 9 and 12 are one-way. The tier name still describes the rule; the exceptions are now
stated under the table instead of being contradicted by it.

**5. The network question, answered "disclose it in the docs only".** Every README fence stays exactly as
written - they describe windowsweep and they are true of it. The disclosure went into `docs/safety-model.md`
as its own short section and into `docs/faq.md` beside the existing *"Does it phone home?"* answer: the
engine makes no network call and check [9] proves it, **and** the tools it runs keep their own habits -
`winget list` refreshes its own sources and reports to Microsoft by default, `npm` checks the registry for a
newer npm, and `pnpm store prune` runs inside the default batch. It is the difference between a program that
phones home and a program that runs one which does, and it is worth knowing before someone reads a firewall
log and blames the wrong tool.

**Also corrected, from the same report and not needing an owner:** the AVD claim was wrong in **both**
directions. Deleting an AVD forces **no download** while its system image is installed - images live under
the SDK folder, which is protected - so the page overstated that cost; and what actually has no undo is
everything installed or saved *inside* the emulator plus its snapshots, which the page never mentioned. The
section 4 bullet also now says `--purge-all` takes **every** AVD, idle or not, which is what
`modules/android_avd.ps1:26` does and which nothing on either page said.

**Still open for a round 4**, from the same report and not covered by these five: the five-guard order is
wrong (guard 5 runs before guard 4, and the exclusion is a sixth refusal nothing lists); S-018's "an eighth,
section 22, carries the flag" is stale since section 22 became `Dev = $false`; S-040's claim that
`windowsweep --scan` reports the developer answer in force is false, because scan mode never resolves it;
S-025's "the session log records every path removed" is false for prune-mode targets, which log one line per
root; and S-012's four-line summary of the protected categories does not match what `WS_PROTECT_CATEGORIES`
actually contains.

## Round 4, 2026-09-08 - the fact-check's last five

All five are applied. Each was re-read against the tree this round rather than taken from the report, and
every `file:line` below is one this round opened. Five slots changed and two more moved with them. No slot
was renumbered, reordered or withdrawn, and **S-042 still precedes S-043**.

**1 · S-005 — the refusals are now in the order the code runs them, and there are six.** Verified in
`Get-ProtectionReason` (`lib/safety.ps1:111-151`): the tool's own data folder is tested at `:137-139` and
the `--exclude-path` list at `:141-150`, both inside that function, while the declared-root check the list
called guard 4 runs afterwards in `Remove-PathSafe` at `:228-229`. So the old fourth and fifth were the
wrong way round. The list reads 1, 2, 3, own-data, exclusion, declared root, and one sentence after it says
what the exclusion is: a tree you named, refused in every section, logged `excluded: <path>`
(`lib/safety.ps1:214`) and carried in the `--json` summary's `excluded[]` (`modules/runner.ps1:222`). Six, in run order.

**2 · S-018 — the eighth section is gone.** `lib/constants.ps1:68` declares section 22 with `Dev = $false`,
and `Get-CatalogueJson` at `modules/runner.ps1:230` builds each row's `dev` field from that field, so
`--list --json` exports `dev: false`. `grep -c` returns **seven** sections with `Dev = $true` — 1, 2, 3, 4,
5, 17, 20 — and `modules/runner.ps1:105` skips three of them. The sentence explaining an eighth is removed
and the paragraph's own count now matches the catalogue. Seven, twice.

**3 · S-040 — the command changed, because the old one cannot answer.** `Resolve-DeveloperMode` runs for
four modes only (`windowsweep.ps1:300`: walkthrough, menu, all, only), so under `--scan` the field stays the
`$null` it was set to at `windowsweep.ps1:19` and `modules/health.ps1:51-53` prints
`Developer mode: not decided yet`. `--scan` does run section 0 (`modules/runner.ps1:169`); it just never
resolves the answer. The fence now sends the reader to `windowsweep --only 0 --yes`, which resolves it, runs
a `Tier = 'report'` section that removes nothing (`lib/constants.ps1:46`), and prints the answer with its
source. A second sentence says what `--scan` shows instead, because `--scan` is the command this page has
already put in two fences and a reader will try it first. Scan mode never asks.

**4 · S-025 — the log claim is now true of the operation it was falsest about.** `Remove-StaleFiles` deletes
each file at `lib/safety.ps1:307` in a loop that logs nothing, then writes one line per root at `:323`.
Forty-seven declared targets across sections 1, 2, 8, 10 and 12 carry `-Mode prune` and reach it through
`lib/actions.ps1:142`. The sentence now names three shapes: per-path lines from the chokepoint (`:253`,
`:258`, `:456`), one line per folder from a prune (`:323`), and the command with its exit code from
`Invoke-External` (`:475`, `:490`). Three shapes, three call sites. The paragraph's order did not move, and the two permanent sections still
open it.

**5 · S-012 — the four summary lines are described from the constant.** `WS_PROTECT_CATEGORIES` at
`lib/constants.ps1:33-38` is read by `Show-TargetList` at `lib/scan.ps1:108` and published at
`modules/runner.ps1:234`. Its second entry is browser profile data alone, its third is editor user data with
UWP LocalState **and toolchains**, and its fourth carries Prefetch, `Windows\Installer` and WinSxS beside the
file names. Round 3 called entries 2 and 3 *"the browser and editor patterns"* and *"the store-app
patterns"*, which describes neither. Four semicolons now, because two entries contain commas. Read off the constant.

**The two that moved with S-005, both ordinals and neither a finding.** S-006's *steps 1-4* became
*refusals 1, 2, 3, 5 or 6* and its *Step 5* became *Refusal 4*; S-042's *the five guards above* became *the
six refusals above*. No fact in either fence changed. Checking S-006's claim did surface one wrinkle, filed
rather than fixed: `--uninstall-data` is `Remove-ToolData` and it never calls the chokepoint at all, deleting
the home folder directly at `modules/release_helpers.ps1:417`, so *doors* describes two different mechanisms.
That is a wording call for the line pass. The owner's first decision on 2026-09-08 already named that same
call site, so the surface stays consistent either way.

**Shipping word count: 2,682 words** — §A 1,900 · §B 782, across 45 fences. Method, unchanged from the
self-check: `wc -w` over the fenced blocks only, attributed to §A or §B by the heading above each fence, with
all commentary, `Was:` lines, the preamble, the slot table and every ledger excluded. Verified as 45 fences
in 45 distinct slots, none outside one. Forty-five fences, forty-five slots.

**Round 4's delta is +101 and reproduces per slot:** S-005 81 → 118, S-006 67 → 72, S-012 41 → 48, S-018 101
→ 79, S-025 154 → 195, S-040 36 → 69. **S-042 changed and does not appear in that list, because it is
word-neutral**: *the five guards above* and *the six refusals above* are the same three tokens to `wc -w`,
which is worth stating so nobody reads its absence as a fence left alone. Every other fence is
byte-identical. S-018 is the only one that shrinks. That is the finding.

**The banned-phrase sweep was re-run over all 45 fences this round, not carried forward.** Method unchanged:
extract every fenced block, match the shared list at
`aoneahsan-cccs-story-craft/assets/banned-phrases.txt` (87 non-blank entries, case-insensitive, word-boundary
anchored) over the full 2,682 words. **Zero hits.** The seven changed fences were additionally screened
against a twelve-word watch list of the reassurance adjectives this voice replaces with refusals, plus the
urgency words the Bible's banned-tone list names. All seven are clean. **The watch words are not typed out
here**, for the reason round 3 gave and this round re-proved by breaking it: quoting two of them in a note
about not quoting them made the hook report two banned phrases on a file whose fences contain none. The list
lives in one file. A draft points at it. S-019's `safe` cell is untouched and stays what round 3 recorded it
as: the literal value of the catalogue's `Batch` field, not a hit.

⚠️ **One inherited total does not reconcile, and it is reported rather than rationalised.** The same method
over the last committed version of this file returns **2,581**, where the copy pass recorded 2,411 for that
same file — a gap of 170 across 45 fences. It is not the delta that is in doubt: subtracting round 4's seven
fence changes from 2,682 returns 2,581 exactly. Three exclusion rules were tested against the gap and none
produces 2,411 — dropping the two command fences gives 2,513, dropping heading lines inside fences gives
2,535, dropping both gives 2,467. No scope rule was ever written down that would produce 2,411, so it is
recorded as unexplained. The gap predates this round. This is the second such figure on this file; round 3 recorded 2,088 the same way.
**The delta is the number to trust here**, because it reproduces fence by fence.

🔴 **The line-reference drift has grown and the copy pass's figure is stale.** That pass recorded §A
references from S-008 onward as sixteen lines low. The live `docs/safety-model.md` has since gained
`## What the tools it runs do on their own` at `:51-65`, from the owner's fifth decision, so the offset is
now **thirty-two**: S-008 is at live `:67`, S-012 at `:79-81`, S-018 at `:104-108`, S-025 at `:148-152` and
S-027 at `:163`. Two anchors are unaffected and were re-checked: **S-005's `:11-20` is still exact**, and
S-042's `:34` still lands before the exclusions section. §B has no drift at all — every
`developer-mode.md` reference matches the live file. **Slot headers were left at their original numbers on
purpose**, because renumbering them is churn the applier does not need. Anchor on the text.

**Every `Was:` line touched this round was re-read against the live files, character for character.** S-005
against `safety-model.md:11-20`, S-012 against `:79-81`, S-018 against `:104-108`, S-025 against `:148-152`,
S-040 against `developer-mode.md:38` and the rows above it. All five match. The copy pass's two known `Was:`
hazards are unchanged and still open: S-027's footer would move the date backward, and S-034's `Was:` records
only its third bullet.

🔴 **The lint hook has read none of this surface's shipping copy, and its verdict concerns the commentary
alone.** `posttooluse-story-lint.sh:61` strips every fenced block before it counts anything, and on this
slot-shaped surface every shipping string is inside a fence. So the 2,682 words a reader will see were not
scored, in either direction. **This round did not read a hook result as evidence about the copy.** Its
silence proves nothing. On this surface the fact-checker and a human reader remain the only real gate.

**What the hook does say about the commentary, measured by reproducing its own windowing.** The file
**arrived** at round 4 already failing its range check on **six** windows, so the clean hook the copy pass
recorded did not survive that pass's own last edit. Round 4's commentary took it to seventeen; a
short-sentence pass brought it back to **ten of 107 windows**, with burstiness **0.759** against the 0.45
floor and zero em-dash, not-X-but-Y or banned-phrase failures. **Every window this round's own text controls
now passes**. The ten that remain sit wholly inside round 1-3 commentary and the four dated ledgers: S-002's
round-2 note, S-005's and S-007's, S-012's, S-045's, S-040's, the safety review, the copy pass and the owner
decisions. **None is shipping copy**. Those are records of what earlier rounds found, and rewriting a record
to satisfy a counter that cannot see the page is a trade this round declined. Two things were traded here and the trade is stated rather than hidden: a green hook on
old commentary, against ledgers that still say what they said. **The second is worth more.**

⚠️ **One live proof of the hook's blindness, produced by accident this round.** A ledger sentence listing the
adjectives the changed fences were screened *against* made the hook report **two banned phrases**, while the
same run reported none for the 2,682 words of shipping copy — which is where a banned phrase would actually
matter. The two words sat in a note about not using them. That is the failure mode in one line: it read the
commentary and did not read the page. It never saw the copy.

### SELF-CHECK — round 4

**Palette.** P and R only, as row 4 requires, and no W. All five changes are P: each replaces a remembered
claim with a counted or ordered one — six refusals in run order, seven sections, one command that resolves,
three log shapes, four categories read off the constant. R gains three specific refusals and loses none:
S-005's *any path you excluded yourself*, S-006's *no flag bypasses refusals 1, 2, 3, 5 or 6*, and S-040's
*`--scan` will not tell you*. That last one is the round's only new disclosure, and it is a refusal rather
than a hedge. Nothing was softened to carry it.

**Rhythm.** Measured over the seven changed fences with the hook's own splitter, not estimated. Shortest
units this round are S-005's two new list items at five words each, *"the tool's own data folder;"* and
*"any path you excluded yourself;"*; the shortest new full sentence is *"Refusal 5 is the one you set."* at
seven. **The longest sentence this round adds is 22 words**, in S-040, after its middle sentence was split
at the command; before the split it ran 34, which is the fingerprint's ceiling rather than over it, and a
sentence sitting on a limit in a fence about a command that does not work is the wrong place to spend one.
Per changed fence: **S-005** 8 · 34 · 13 · 5 · 5 · 15 · 7 · 24, where the 34 is item 2 and is round 3's
wording untouched. **S-006** 10 · 14 · 7 · 11 · 25 · 6. **S-012** 20 · 29. **S-018** 10 · 25 · 12 · 26 · 5.
**S-040** 13 · 22 · 16 · 22. **S-042** 31 · 17, unchanged. S-025's six new sentences run 9 · 11 · 18 · 12 ·
7 · 15 against the paragraph's existing 8 · 14 · 20 · 21 · 7 · 34, so the short beats sit after the loss is
already stated rather than in front of it. The two sentences over the 34-word ceiling are still S-021 at 39
and S-022 at 35, both inherited and both on the keep list. This round added none.

**Length.** Row 4's cap is "as long as the subject needs", so nothing is over cap. Net **+101** shipping
words for five corrections, one of which removes 22. One slot shrinks.

**Unsure spots — three, each handed to whoever owns it, none guessed.** They are listed below and none is a
`NEEDS DECISION`.

1. **For the fact-checker, on S-025's first log shape.** *"`Remove-PathSafe` and `Send-ToRecycleBin` write a
   line per path with its size"* is exact for a removed file (`lib/safety.ps1:258`), a removed folder with
   its total (`:253`) and a recycled item (`:456`). A removed **link** is the one sub-case with no size: its
   line reads `removed link (not followed): <path>` at `:248`, because a link's bytes are counted as zero.
   The claim is not false about links, since the line does name the path; it simply carries no number there.
   Naming that in the fence would cost a clause on a sentence whose job is the prune correction. **Flagged
   rather than hedged**, which is what S-043 did with the same kind of nuance. The line stays as written.
2. **For the line pass, on S-006.** *Doors* now covers `--prune-history`, which lifts refusal 4 through
   `AllowOwnData`, and `--uninstall-data`, which skips the chokepoint entirely at
   `modules/release_helpers.ps1:417`. Two mechanisms, one word. The fence's claim about what each command
   removes is true of both, so this is wording rather than fact.
3. **Carried, unchanged: the five the earlier ledgers left open.** The long-path fixture's 445 characters,
   S-043's `Start-Process <url>` nuance, the AVD download wording, the `--help` text short by one section,
   and the two facts about section 20 left out of S-045. Round 4 touched none of them and closes none. They stay open.

**NEEDS DECISION: none.** Every one of the five was answerable from the source, and each was answered there.
Nothing on this surface is waiting on the owner.
