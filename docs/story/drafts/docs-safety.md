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
| §A `docs/safety-model.md` | S-001 – S-027, S-042 | 28 |
| §B `docs/developer-mode.md` | S-028 – S-041 | 14 |
| **Total** | | **42** |

S-042 is new this round and takes the next free number; no slot is renumbered and none is withdrawn. S-040
keeps its number and moves to a different position on its page.

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
Every deletion this tool performs passes through one function, and that function refuses 66 protected subtrees, 50 path patterns and 13 file names before it looks at what the calling section asked for. This page walks those guards in the order they run, shows a sample of the refused lists, and ends on what has no undo. `windowsweep --list-targets` prints the 66 subtrees one per line. The complete lists live in `lib/safety.ps1`.
```
**Was:** > A cleanup tool should never be the reason you lose data. This page spells out every guard
windowsweep applies, what it refuses to touch, and what it will delete. Read it once; refer back when
something surprises you.

**Change:** rewritten, and this is the second most consequential slot here. The old opening was a maxim
about cleanup tools in general, which is a throat-clearing frame of exactly the kind the fingerprint bans:
it spends the reader's first sentence agreeing with them instead of telling them something. The replacement
opens on the mechanism and the three counts, so a sceptical reader reaches a checkable number before they
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

### S-003 · safety-model.md:6 · The chokepoint · heading
```
## The chokepoint
```
**Was:** identical.

**Change:** none. It is the Bible's central image and the glossary's term.

### S-004 · safety-model.md:8-9 · the chokepoint sentence
```
Every deletion of anything on your machine passes through one function, `Remove-PathSafe` (or `Send-ToRecycleBin` for personal files), with a declared target root. It refuses, in order:
```
**Was:** Every deletion passes through one function, `Remove-PathSafe` (or `Send-ToRecycleBin` for personal
files), with a declared target root. It refuses, in order:

**Change:** four words added to make the claim survivable. windowsweep does delete a few things outside the
chokepoint, and every one of them is its own: this run's log under `--cleanup-logs`, an old report you delete
from the reports manager, the self-test's own fixture folder, a temporary script the Docker section writes,
and the registry flags section 13 sets and clears around `cleanmgr`. Those are the tool's housekeeping. The
sentence now claims what is true and complete about **your** data, and S-006 names the two commands that
reach the tool's own folder.

### S-005 · safety-model.md:11-20 · the five guards · 🔴 REPLACES that whole region
```
1. paths with `..` segments, UNC paths and drive roots;
2. fifteen declared roots: Windows, System32, SysWOW64, both Program Files folders, ProgramData, `C:\Users` with its Default and Public profiles, your profile root, its `AppData` folder and the Roaming, Local and LocalLow folders inside it;
3. 66 protected subtrees, 50 path patterns and 13 file names - the lists below;
4. any path that does not lie strictly inside the target root the calling section declared;
5. the tool's own data folder.
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

### S-006 · safety-model.md:22-28 · the bypass claim · 🔴 REPLACES that whole region
```
No flag bypasses steps 1-4. `--purge-all` changes how much of a cache goes, never where the tool may reach, and neither does `--select`, `--select-file`, `--permanent` or `--i-understand-deep`.

Step 5 has two doors and both are windowsweep's own housekeeping. `--prune-history N` deletes logs, reports and crash bundles older than N days, and `--uninstall-data` removes the whole folder after a confirmation `--yes` does not answer. Neither reaches anything outside `%USERPROFILE%\.windowsweep`.
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

### S-007 · safety-model.md:29 · the declared exceptions · lifted out of guard 3 by S-005
```
### The two exceptions

Two paths sit inside a protected subtree and are deliberately reachable: `%LOCALAPPDATA%\Android\Sdk\.temp` and `%LOCALAPPDATA%\Android\Sdk\.downloadIntermediates`. The Android SDK folder is protected as a whole, and those two are the SDK manager's download scratch. They are checked before the subtree rule, so they are the only way anything under a protected subtree is ever removed. There are no others, and adding one is a change to `lib/safety.ps1` rather than a flag.
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
whether a flag could add a third, has nowhere to look. `lib/safety.ps1:45` declares the array and `:112`
tests it before the subtree loop at `:113`. So an exception genuinely wins.

"A carve-out rather than an oversight" also argues with an accusation nobody made. The replacement states
the mechanism and lets the reader draw that conclusion, which is the whole method of this page.

### S-013 · safety-model.md:30-33 · the second guard on layout targets · 🔴 REPLACES that whole region
```
### The second guard, for browsers and editors

A browser or editor target is not a path; it is a layout. windowsweep resolves it to the cache folders inside every profile it finds, and then each resolved folder must also pass `Test-KnownCacheLeaf`, an allowlist of cache folder names in `lib/actions.ps1`. Anything else is refused by name with `REFUSE (not a known cache folder for a chromium layout)`. So a profile folder, a `Local Storage` folder or an extension folder is refused twice: once by the pattern list, and once because it is not on the allowlist.
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
folder, a `Local Storage` folder, an extension folder — where the interim text gives one. This is the
strongest guarantee in the product and the page had never claimed it: it is the answer to the question a
browser-cache reader actually has, which is what stops a bug in the profile-finding code from reaching
profile data.

### S-042 · safety-model.md:34 · NEW · the desktop window runs the same guards
```
The desktop window is this engine. It runs the bundled `windowsweep.ps1` with `--json --no-color` and reimplements no deletion of its own, so every path it removes passes through `Remove-PathSafe` and the five guards above - see [Desktop app](./desktop.md).
```
**Was:** (new — the page reads as though the command line is the only caller.)

**Change:** added, and it takes the next free slot number rather than extending an existing one. Nothing on
either page tells a reader that the window they installed is governed by what they just read, so a reader who
uses the desktop app has no reason to believe any of it applies to them. It does, completely: the app runs the
bundled script and reads its catalogue from `--list --json`, which is IRON rule 12 of this repository and is
checked by the desktop's own bridge in `desktop/src/lib/engine.ts`.

It closes the section rather than interrupting it, because the five guards, the exceptions and the second
filter are one argument and a pointer belongs after the argument finishes. The companion pointer for the
developer answer is on the other page, at S-028, where the reader is deciding.

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
`.antigravity`, `.vscode-server` and `.cursor-server`. A table cell is normally a factual record this pass
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
`windowsweep --list-targets` prints every path each section can reach on your machine, then the 66 protected subtrees one per line. Four summary lines close it: the declared roots, the browser and editor patterns, the store-app patterns and the protected file names.
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
| **Rebuilds** - caches and temp files the tool or Windows recreates on next use | 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 17 | No undo. Nothing is copied first; a cache comes back because the tool that made it makes it again |
| **Slow to rebuild** - Android emulator images, recreated in Android Studio | 4 | No undo, and rebuilding one is a download rather than a moment - the per-AVD idle gate exists for that reason |
| **Recycle Bin** - personal files you selected | 18, 19, 23 | The Recycle Bin, until you empty it. `--permanent` deletes instead of recycling, and that has no undo |
| **Permanent** | 11 (empty the Recycle Bin), 16 (event logs) | No undo |
| **Configuration** - a setting changes, nothing is deleted | 15 (hibernation), 20 (disk-image compaction) | Nothing is removed. `powercfg /hibernate on` puts hibernation back; compaction rewrites a disk image without dropping anything from it |
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
different and worse.

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
or nothing is removed. Nothing is lost from the old cells — the rebuild cost, the AVD download, the
`powercfg` command and the fact that compaction drops nothing all survive, on the other side of the
sentence, as the reason rather than as the answer.

The Recycle Bin cell is the one place the distinction is live, so it states both halves: recycled until you
empty it, and `--permanent` deleting instead, with no undo. That is the sentence Bible §10 asks for, in the
only row where a reader could get it wrong.

### S-016 · safety-model.md:64-67 · the idle gate
```
A cache file goes only when its newest timestamp (last write, last access, creation) is at least `--days` old (default 100). Windows disables last-access updates on most volumes, so the tool reads the newest of the three and errs toward "recently used". A background indexer that touches one file inside a tool version makes the whole version look fresh; the consequence is that the tool keeps more, never less.
```
**Was:** identical.

**Change:** none. `Get-NewestTimestampUtc` in `lib/fs.ps1` takes the maximum of the three times, which can
only make a file look newer, and the paragraph says so and then says what that costs. The last clause is the
band-R sentence of the whole page.

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

The saved developer answer changes seven sections, in two ways. Sections 1, 2, 3 and 5 prune by the idle gate when the answer is yes and clear their caches completely when it is no. Sections 4, 17 and 20 are skipped entirely when the answer is no. An eighth, section 22, carries the flag in the catalogue and exports it in `--list --json`, but behaves the same either way. Nothing in either mode changes what the tool may reach; it changes whether a cache is pruned or cleared, and whether a section runs at all. See [Developer mode](./developer-mode.md).
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

### S-019 · safety-model.md:82-85 · the batch policy table
```
| safe | 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21 (+12, 13 when elevated); 22, 24, 25 carry the same policy and are read-only, but `--all` does not include them | run with `--yes` |
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
**A scripted selection is a person's choice, and it is the one thing that does lift the interactive refusal.** `--select 1,3` and `--select-file paths.txt` name exactly which items go, in advance, so a script or a GUI can drive these sections unattended - and because the naming is explicit, the selection also answers the section's final confirmation. It is a narrow, deliberate door: the refusal exists to stop *unchosen* deletion, not scripted deletion. `--yes` on its own still selects nothing and still answers nothing, and neither flag reaches anything the deletion chokepoint would otherwise refuse.
```
**Was:** identical.

**Change:** none. This paragraph already does the hardest thing on the page, which is to explain a door in a
refusal without weakening the refusal. The distinction it draws - unchosen deletion versus scripted deletion
- is the reason the door is defensible, and the last clause closes it off from the chokepoint.

### S-022 · safety-model.md:100-102 · running programs
```
A browser, editor or app that is open keeps its cache files locked and half-written. Its targets are skipped with a line naming the process, in the form `Chrome caches - skipped: chrome is running (close it and run this section again)`, and the run's next-steps list repeats the exact command. Files any program holds open are skipped one at a time and counted, never treated as errors.
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
`--dry-run` short-circuits every deletion helper and every destructive external command (`docker`, `cleanmgr`, `Dism`, `powercfg`, `wevtutil`, `diskpart`, service stop/start, registry writes), printing what would happen and tallying an estimate. The self-test hashes a fixture tree before and after a dry-run to prove nothing changed. It writes nothing of yours - two files of its own, and nothing else: a session log and one JSON report. `--no-report` skips the report and `--cleanup-logs` deletes the log at exit.
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

### S-025 · safety-model.md:116-120 · no undo
```
## No undo

Deletion is one-way for the rebuild tiers. There is no copy, no staging folder and no restore command: a cache is gone the moment it is removed, and it comes back only because the tool that made it makes it again. The session log records every path removed with its size, and the JSON report records every section's outcome. Personal files go to the Recycle Bin by default precisely because they have no regenerating source.
```
**Was:** Deletion is one-way for the rebuild tiers. The session log records every path removed with its size,
and the JSON report records every section's outcome. Personal files go to the Recycle Bin by default
precisely because they have no regenerating source.

**Change:** one sentence, in second place. "One-way" is correct and abstract, and this is the section
where the page has to be concrete, because it is the only place a reader learns that the record of a deletion
is not a way to undo it. Naming the three things that do not exist is the band-R form of the same fact, and
it sits directly before the two sentences about the log so that nobody reads the log as a safety net.
S-015's `Recoverable?` column now says the same thing six H2s earlier, which is where a reader meets the
question first.

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
`desktop-readme` surface, which owns the elevated run.

The seven-section count is S-018's, reconciled in the same round: eight sections carry `Dev = $true`,
section 22 behaves identically either way, and seven change behaviour. This page's list of four plus three
is that seven, so the two pages no longer disagree.

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

### S-031 · developer-mode.md:18-19 · developer mode on · Docker
```
- Docker removes dangling layers, build cache idle for the window, and images no container uses that are older than the window. Volumes are never touched.
```
**Was:** identical.

**Change:** none. Three commands and a refusal, and the refusal is the sentence a Docker user reads first.

### S-032 · developer-mode.md:20 · developer mode on · section 17
```
- Section 17 scans your project roots for build artefacts in projects nobody touched for the window. It never scans a whole drive, and it never enters `.git`, AppData or a toolchain folder. What it finds is a list you pick from, item by item, and `--yes` does not answer that prompt. Section 17 is in the Rebuilds tier, so what you pick is deleted rather than recycled: a `node_modules` folder is rebuilt by its package manager, never restored from a copy.
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

### S-033 · developer-mode.md:21-22 · developer mode on · toolchains
```
- Toolchains stay protected in every mode: nvm, Volta, corepack, global npm/pnpm/bun/deno packages, cargo and go binaries, the Android SDK.
```
**Was:** identical.

**Change:** none. "In every mode" is the load-bearing phrase and it is already there.

### S-034 · developer-mode.md:26-28 · developer mode off
```
- Sections 1, 2, 3 **clear** their caches completely - there is no work to keep warm.
- Section 5 runs `docker system prune -a -f` (volumes still untouched).
- Sections 4, 17 and 20 are skipped with a note, because each of them removes something a developer chose to keep: an emulator image, a project's build output, a virtual disk.
```
**Was:** the third bullet read "Sections 4, 17 and 20 are skipped with a note."

**Change:** the reason is added to the third bullet. A reader who answered "no" and then finds three sections
missing has been told what happened and not why, and the why is the reassuring half: the tool declines to
touch three kinds of thing rather than deciding it may. The three examples are what each section actually
holds.

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
Sections 4, 17 and 20 are skipped when the developer answer is no. A run that suddenly reclaims less than the last one is worth checking against `windowsweep --scan`, which reports the answer currently in force.
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

### S-036 · developer-mode.md:39-40 · the non-interactive default
```
A non-interactive run with no saved answer (a Scheduled Task on a fresh machine, `--json`) defaults to developer mode **on**, the conservative choice, and says so.
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

### S-037 · developer-mode.md:44-47 · why 100 days
```
Windows keeps last-access times off on most volumes, so the tool takes the newest of last-write, last-access and creation time as the "last touched" estimate. That can only make a file look fresher than it is, never older, so a mistake keeps a cache entry instead of removing one. The 100-day default matches the sibling tools for Linux and macOS; an entry a project needed in the last three months is the kind a developer misses.
```
**Was:** identical.

**Change:** none. The middle sentence states the direction of the error, which is the only thing a sceptical
reader wants from a heuristic. The sibling claim was checked: `linux-cleanup` and `macleanup` both default to
a 100-day idle window in their own documentation.

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
beside the flag it explains. The two costs are the ones the commands below actually incur, and both were
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
S-018 now carries two counts attached to two different things. R carries the refusals and lands eleven times,
always as a specific thing the tool declines: S-002 (three counts, and a page that says what it does not
print), S-006 (four flags that change nothing about reach), S-007 (two exceptions and no others), S-011,
S-013 (refused twice), S-015 (no undo, in four of six rows), S-025 (no copy, no staging folder, no restore
command), S-031 (volumes), S-032 (never a whole drive, and `--yes` does not answer), S-033 (every mode),
S-038 (neither reaches anything the chokepoint refuses). S-042 is P: it names the file, the flags and the
function. No sentence carries tone. Nothing on either page reads as an aside, and nothing near an
irreversible action does anything other than say what happens. **Two red-circle emoji and two
pages-used-to-disagree sentences are removed** from live shipping copy by S-006, S-013 and S-030.

**Rhythm.** Measured over the 42 fences, not estimated: 91 prose sentences, median 19 words, mean 18.5.
Shortest in a table cell: *"No undo"* (two, S-015's Permanent cell) and *"Nothing is removed"* (three, its
Report cell). Shortest in running prose: *"It refuses, in order:"* and *"Volumes are never touched."* (four
each). S-002 now descends 33 → 23 → 10 → 7 and ends on its shortest sentence, which is the fingerprint's
paragraph shape. **Two sentences exceed the fingerprint's 34-word ceiling and both are deliberate: S-021 at
39 and S-022 at 35.** Neither is this round's work — S-021 is on the editor's keep list and S-022 was
accepted in round 1 — so they are reported rather than rewritten. Two that *were* over it have been split:
S-012 ran 41 words and is now 25 + 21, S-040 ran 37 after its section list was corrected and is now 14 + 24.
The round's longest is 34. It appears twice: in S-042, and in the sentence S-025 adds.

**Length.** Row 4's cap is "as long as the subject needs", so there is no numeric ceiling to breach and
nothing is over cap. The live files measure **1,324 words** (`safety-model.md`) and **483**
(`developer-mode.md`), both `wc -w` over the whole file including its tables and fences. Both are already
larger than round 1 recorded, because the interim correction pass landed between the two rounds; both grow
again here. Every added word is a count, a correction, a named refusal or a pointer to the page carrying the
rest. **No post-apply total is claimed**, because 14 slots are marked identical and their fence words are
already counted in the live figures — asserting a landing size would double-count them.

**Shipping word count: 2,182 words** — §A 1,591 · §B 591, across 42 fences. Method, so it can be reproduced
rather than re-asserted: whitespace tokenizer (`wc -w`) over the **fenced blocks only**, which on this
slot-shaped surface is the entire shipping copy, across both files' slots. **Excluded:** all commentary,
every `Was:` line, the header preamble, the slot-range table and this self-check. That scope is fixed. Markdown syntax inside a
fence (`|`, `**`, backticks, `>`) counts as part of the token it is attached to, as `wc -w` sees it. Round 1
recorded 1,902 on a method it described the same way; that figure is quoted, not re-measured, because this
file replaced the one it was taken from. The increase is S-015's rebuilt table, S-032's two sentences,
S-038's cost paragraph, S-042, and S-028's pointer.

**Unsure spots.** One, and it is recorded in the shipping text rather than guessed: the long-path fixture's
445 characters is this machine's value, not the release's, and S-023 says so in the shipping text rather than
presenting it as a constant. The README currently states 445 flatly, which is a companion edit this draft
does not own.

**NEEDS DECISION: none.** The one this surface carried — whether Bible §3.2's *"a dry-run that genuinely
writes nothing"* or S-024/S-026 was wrong — was answered on 2026-09-07 by measurement, not by preference:
S-024 was right, §3.2 now reads *"A dry-run that writes nothing of yours - two files of its own, and nothing
else"*, and the correction is recorded in `decision-log.md`. S-024 and S-026 use that phrasing. The
seven-versus-eight question the line pass raised was resolved here from the source rather than escalated —
`Dev = $true` on eight sections, behaviour changing on seven — so it is not a decision either. Nothing on
this surface is waiting on the owner.

**Banned-phrase sweep.** Run against the shared list at
`aoneahsan-cccs-story-craft/assets/banned-phrases.txt` and the fingerprint's own "never" list, over the
fenced shipping strings only, 2,088 words of them. One hit, deliberate and unchanged from round 1:
**`safe`** as the first cell of the batch-policy table in S-019. That is the literal value of the catalogue's
`Batch` field in `lib/constants.ps1` and the name of the row, not the adjective band R replaces. No hit for
`clean`, `sweep`, `safely`, `preview`, `just` or `simply`, none for the shared list's inflated adjectives,
and none for any first-person plural. They are not re-typed here. Quoting two of them into this
paragraph is what failed the hook on this file's first write, which is a small demonstration of the point
below: the list lives in one file and a draft should point at it rather than copy it.

🔴 **The story lint hook cannot confirm the sweep above.** `posttooluse-story-lint.sh:61` strips fenced
blocks before it counts anything, so on a slot-shaped surface it has read the commentary and none of the
shipping copy. Every FAIL it reported on this file was a sentence no reader will ever see, and every
shipping string was invisible to it. Its silence is not evidence. The sweep was run by hand over the fences,
and the fact-checker and the human reader are the real gate here.
