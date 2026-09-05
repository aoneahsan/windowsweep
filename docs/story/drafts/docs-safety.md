# docs-safety — the safety model and developer mode

<!-- story-lint: allow "elevate" -->

Content-map row **4** · surfaces `docs/safety-model.md` and `docs/developer-mode.md` · awareness
**solution-sceptical** · structure **the chokepoint → the refusals, listed → the idle gate → what has no
undo** · tone bands **P and R only, no W anywhere** · length **as long as the subject needs** · CTA none ·
schema none.

This is the page a reader opens when they have already been burned by a cleaner. Every claim on it was
checked against `lib/safety.ps1` line by line rather than recalled, and four of them were wrong. The one that
matters most is at S-006: the page promises that no flag bypasses any of its five guards, and the source file
it describes says, in its own header comment, that no flag bypasses the first three.

Humor is off. No aside, no dry observation, nothing that reads as tone on a page about irreversible deletion.

| File | Slot range | Count |
|---|---|---|
| §A `docs/safety-model.md` | S-001 – S-027 | 27 |
| §B `docs/developer-mode.md` | S-028 – S-041 | 14 |
| **Total** | | **41** |

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
Every deletion this tool performs passes through one function, and that function refuses 66 protected subtrees, 50 path patterns and 13 file names before it looks at what the calling section asked for. This page lists all of it: the guards in the order they run, what is refused, what is deleted, and what has no undo.
```
**Was:** > A cleanup tool should never be the reason you lose data. This page spells out every guard
windowsweep applies, what it refuses to touch, and what it will delete. Read it once; refer back when
something surprises you.

**Change:** rewritten, and this is the second most consequential slot here. The old opening was a maxim
about cleanup tools in general, which is a throat-clearing frame of exactly the kind the fingerprint bans:
it spends the reader's first sentence agreeing with them instead of telling them something. The replacement
opens on the mechanism and the three counts, so a sceptical reader reaches a checkable number before they
reach a promise. **The counts were counted, not estimated**: `lib/safety.ps1` lines 31-43 declare 66
subtrees, lines 48-62 declare 50 wildcard patterns, and lines 63-64 declare 13 basenames. "Read it once;
refer back" goes with the maxim; it told the reader how to use a page they had not started.

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
sentence now claims what is true and complete about **your** data, and S-007 names the two commands that
reach the tool's own folder.

### S-005 · safety-model.md:11-15 · the five guards
```
1. paths with `..` segments, UNC paths and drive roots;
2. fifteen declared roots: Windows, System32, SysWOW64, both Program Files folders, ProgramData, `C:\Users` with its Default and Public profiles, your profile root, and the AppData Roaming, Local and LocalLow folders;
3. 66 protected subtrees, 50 path patterns and 13 file names - the lists below;
4. any path that does not lie strictly inside the target root the calling section declared;
5. the tool's own data folder.
```
**Was:** 1. paths with `..` segments, UNC paths, drive roots; 2. Windows, `System32`, Program Files,
ProgramData, `C:\Users`, your profile root and the AppData roots; 3. every protected subtree, pattern and
file name listed below; 4. any path that does not lie strictly inside the target root the calling section
declared; 5. the tool's own data folder.

**Change:** steps 2 and 3 get numbers and the two entries step 2 omitted. `SysWOW64` and
`Program Files (x86)` are both in the exact set at `lib/safety.ps1` line 25 and neither appeared here, which
on a 64-bit machine leaves out half the program directories. The `C:\Users\Default` and `C:\Users\Public`
entries were also absent. Fifteen is the declared count; on a typical machine the set holds fourteen distinct
paths, because `%PUBLIC%` resolves to `C:\Users\Public` and the set is case-insensitive. Step 3 stops saying
"every ... listed below" and says how many, because a reader counting the table below would otherwise have to
guess whether it was complete. Step 4 is unchanged and is exactly right: the function refuses a path equal to
its own root and a path outside it, so what remains is strictly inside.

### S-006 · safety-model.md:17 · the bypass claim
```
No flag bypasses steps 1-4. `--purge-all` changes how much of a cache goes, never where the tool may reach, and neither does `--select`, `--select-file`, `--permanent` or `--i-understand-deep`.

Step 5 has two doors and both are windowsweep's own housekeeping. `--prune-history N` deletes logs, reports and crash bundles older than N days, and `--uninstall-data` removes the whole folder after a confirmation `--yes` does not answer. Neither reaches anything outside `%USERPROFILE%\.windowsweep`.
```
**Was:** No flag bypasses steps 1-5. `--purge-all` changes how much of a cache goes, never where the tool may
reach.

**Change:** rewritten, and **the old sentence was false**. `Get-ProtectionReason` guards the tool's own home
directory only while `$Script:WS.AllowOwnData` is unset, and `modules/release_helpers.ps1` sets it to `$true`
in `Remove-OldHistory`, which is `--prune-history`. The source file's own header comment has it right:
`lib/safety.ps1` line 9 reads *"No flag bypasses steps 1-3"*, which in this page's numbering is steps 1 to 4.
So the engine's comment and the documentation disagreed, and the documentation was the one overclaiming.

The fix is not a softer sentence. It is the true boundary plus the two commands that cross it, because a
reader who discovers `--prune-history` after being told nothing bypasses step 5 has been given a reason to
distrust every other claim on the page. The added flag list in the first paragraph is there because those
four are the flags a sceptical reader will reach for when testing the claim, and each one was checked:
`--purge-all` changes a target's mode from prune to clear, `--select` and `--select-file` supply a selection
the chokepoint still filters, `--permanent` swaps the Recycle Bin for a delete inside the same guards, and
`--i-understand-deep` unlocks four sections without touching any path rule.

### S-007 · safety-model.md:18 · NEW · the declared exceptions
```
### The two exceptions

Two paths sit inside a protected subtree and are deliberately reachable: `%LOCALAPPDATA%\Android\Sdk\.temp` and `%LOCALAPPDATA%\Android\Sdk\.downloadIntermediates`. The Android SDK folder is protected as a whole, and those two are the SDK manager's download scratch. They are checked before the subtree rule, so they are the only way anything under a protected subtree is ever removed. There are no others, and adding one is a change to `lib/safety.ps1` rather than a flag.
```
**Was:** (new — the page does not mention the exception list at all.)

**Change:** added. This is the largest omission the pass found on this page. `lib/safety.ps1` line 45
declares an `$exceptions` array and line 112 tests it **before** the subtree loop at line 113, so an
exception genuinely wins over a protection. A page that lists what is refused and never mentions that two
paths are carved out of that list is incomplete in the direction that matters: it undersells nothing and
overstates a guarantee. Three things make the guarantee inspectable rather than believed: naming both paths;
placing the check in the order; pointing at the one file that holds the list.

### S-008 · safety-model.md:19 · Never touched · heading
```
## Never touched
```
**Was:** identical.

**Change:** none.

### S-009 · safety-model.md:20 · NEW · the line above the table
```
The table is a sample of the 66 subtrees, 50 patterns and 13 file names, chosen for what a reader wants to check first. `windowsweep --list-targets` prints the full subtree list as the running script sees it.
```
**Was:** (new — the table follows the heading directly.)

**Change:** added. Without this line the table reads as the whole list, and it is not: it shows perhaps
thirty of a hundred and twenty-nine entries. Calling it a sample and naming the command that prints the rest
turns an incomplete table into an honest one. The count agrees with S-002 and S-005. Stating one number three
times in one page is deliberate, because it is the number a reader will use to decide whether the table in
front of them is the whole list. It is not.

### S-010 · safety-model.md:24 · Never touched · the credentials row
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

### S-011 · safety-model.md:29 · Never touched · the Windows row
```
| Windows | Prefetch (clearing it slows boot), `Windows\Installer`, WinSxS (only DISM touches it), `System32\config`, `Windows\servicing`, `Windows\Boot`, `Windows\Fonts`, `System Volume Information`, `Recovery`, `EFI`, `NTUSER.DAT`, `UsrClass.dat`, hiberfil/pagefile/swapfile (only `powercfg` touches hiberfil), Recycle Bin contents (only `Clear-RecycleBin`) |
```
**Was:** Prefetch (clearing it slows boot), `Windows\Installer`, WinSxS (only DISM touches it),
`System Volume Information`, `NTUSER.DAT`, `UsrClass.dat`, hiberfil/pagefile/swapfile (only `powercfg`
touches hiberfil), Recycle Bin contents (only `Clear-RecycleBin`)

**Change:** six entries added from `lib/safety.ps1` lines 40-42. The registry hive folder, the servicing
store, the boot folder, the font folder, the recovery partition folder and the EFI folder are all protected
subtrees, and none of them was in the cell. On a page whose argument is that the protected list is worth
reading, the boot and recovery entries are the ones a reader is most relieved to find.

### S-012 · safety-model.md:31-32 · the `--list-targets` sentence
```
`windowsweep --list-targets` prints every path each section can reach on your machine, then the 66 protected subtrees one per line, then four summary lines covering the declared roots, the browser and editor patterns, the store-app patterns and the protected file names.
```
**Was:** `windowsweep --list-targets` prints every path the tool can reach and the protected list as the
running script sees it.

**Change:** rewritten for accuracy. "The protected list" is four different lists, and the command prints only
one of them item by item: `Show-TargetList` in `lib/scan.ps1` iterates `WS_PROTECT.Subtrees` and then emits
four fixed summary lines for the roots, the browser and editor state, the store-app folders and the file
names. A reader told they will see "the protected list" and shown 66 lines plus four sentences has been
mildly misled about which parts they can audit and which they must read the source for. The corrected
sentence tells them exactly which is which.

### S-013 · safety-model.md:33 · NEW · the second guard on layout targets
```
### The second guard, for browsers and editors

A browser or editor target is not a path; it is a layout. windowsweep resolves it to the cache folders inside every profile it finds, and then each resolved folder must also pass `Test-KnownCacheLeaf`, an allowlist of cache folder names in `lib/actions.ps1`. Anything else is refused by name with `REFUSE (not a known cache folder for a chromium layout)`. So a profile folder, a `Local Storage` folder or an extension folder is refused twice: once by the pattern list, and once because it is not on the allowlist.
```
**Was:** (new — the page does not mention this guard.)

**Change:** added. `lib/actions.ps1` lines 122-126 apply a second filter to every `chromium`, `firefox`,
`electron` and `editor` target after resolution, and refuse anything that is not an allowlisted cache leaf.
This is the strongest guarantee in the product that this page never claimed, and it is the answer to the
question a browser-cache reader actually has, which is what stops a bug in the profile-finding code from
reaching profile data. Two independent refusals are worth more than one, and the page was selling one.

### S-014 · safety-model.md:34 · What it deletes, by tier · heading
```
## What it deletes, by tier
```
**Was:** identical.

**Change:** none.

### S-015 · safety-model.md:36-42 · the tier table
```
| Tier | Sections | Recoverable? |
| **Report** - reads and prints, deletes nothing in any mode | 0, 21, 22, 24, 25 | Nothing is removed |
| **Rebuilds** - caches and temp files the tool or Windows recreates on next use | 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 17 | The data reappears on demand; a rebuild costs time, not information |
| **Slow to rebuild** - Android emulator images | 4 | Recreate in Android Studio; the per-AVD idle gate exists for this reason |
| **Recycle Bin** - personal files you selected | 18, 19, 23 | Yes, until you empty the bin (`--permanent` bypasses it) |
| **Permanent** | 11 (empty the Recycle Bin), 16 (event logs) | No |
| **Configuration** | 15 (hibernation), 20 (disk-image compaction) | Reversible with `powercfg /hibernate on`; compaction loses nothing |
```
**Was:** the same table without the Report row, and with the Recycle Bin row reading `18, 19`.

**Change:** two corrections, one of them the same defect the README carried this morning. **Section 23 was
missing from the Recycle Bin row.** Its catalogue entry is `Tier = 'recycle'`, it offers orphaned application
data row by row, and what a reader picks goes to the Recycle Bin. Leaving it out of the only table on the
site that says what happens to deleted data means a reader could meet section 23 believing every recycling
section had been listed for them. Second, the **Report row did not exist**, so five of the 26 sections
appeared in no row at all and the table looked like it covered everything. Both were checked against
`lib/constants.ps1` lines 36-61, where the `Tier` field is declared once per section.

### S-016 · safety-model.md:44-49 · the idle gate
```
A cache file goes only when its newest timestamp (last write, last access, creation) is at least `--days` old (default 100). Windows disables last-access updates on most volumes, so the tool reads the newest of the three and errs toward "recently used". A background indexer that touches one file inside a tool version makes the whole version look fresh; the consequence is that the tool keeps more, never less.
```
**Was:** identical.

**Change:** none. `Get-NewestTimestampUtc` in `lib/fs.ps1` takes the maximum of the three times, which can
only make a file look newer, and the paragraph says so and then says what that costs. The last clause is the
band-R sentence of the whole page.

### S-017 · safety-model.md:51-52 · keep-newest
```
Versioned tool caches (Cypress, Playwright, Gradle distributions, Squirrel `app-x.y.z` folders) also apply a **keep-newest** rule: the freshest version of each tool is never removed by the idle gate. `--purge-all` and developer mode off both replace the idle gate with a full clear, and keep-newest goes with it.
```
**Was:** the same first sentence, with no second one.

**Change:** one sentence added. The existing wording is precise where it counts, because it says "by the idle
gate" rather than "ever" - but a reader is entitled to know what removes the gate. `lib/actions.ps1` line 129
turns a `units` target into a `clear` under `--purge-all`, and line 130 does the same when the developer
answer is no, and a cleared target has no keep-newest step. Stating it here also fixes the stronger claim on
the developer-mode page, which is S-030.

### S-018 · safety-model.md:54-58 · developer mode
```
## Developer mode

The saved developer answer changes eight sections, in two ways. Sections 1, 2, 3 and 5 prune by the idle gate when the answer is yes and clear their caches completely when it is no. Sections 4, 17 and 20 are skipped entirely when the answer is no. Section 22 carries the flag in the catalogue and behaves the same either way. Nothing in either mode changes what the tool may reach; it changes whether a cache is pruned or cleared, and whether a section runs at all. See [Developer mode](./developer-mode.md).
```
**Was:** Sections 1-5 behave differently depending on the saved developer answer - see
[Developer mode](./developer-mode.md). Nothing in that mode changes what the tool may reach; it changes
whether a cache is pruned by the idle gate or cleared completely.

**Change:** rewritten, because "sections 1-5" is short by three and the second half described one of the two
behaviours. `Dev = $true` is set on sections **1, 2, 3, 4, 5, 17, 20 and 22** in `lib/constants.ps1`, and
`modules/runner.ps1` line 105 skips 4, 17 and 20 outright when the answer is no. That is a different
consequence from pruning versus clearing, and a reader who answers "no" and then finds section 17 missing
deserves to have read why. Section 22 is named because `--list --json` exports `dev: true` for it, so a
reader comparing the page against the machine-readable catalogue would otherwise find an unexplained
mismatch. The last sentence keeps the original guarantee intact, which is the one that matters: developer
mode never widens what the tool may reach.

### S-019 · safety-model.md:60-67 · the batch policy table
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

### S-020 · safety-model.md:69-71 · what `--yes` never answers
```
`--yes` never applies to personal or project files: sections 17, 18, 19 and 23 show their selection prompt even with `--yes`, default to none, and ask a final question `--yes` does not answer. Section 20's disk picker is the documented exception (deep-gated, `--yes` selects every disk).
```
**Was:** identical.

**Change:** none. Verified by self-test check [12], which asserts that every `Read-MultiSelect` call in
`modules/` carries `-NoAutoYes`, and by check [16], which asserts that `--yes` alone selects nothing.

### S-021 · safety-model.md:73-78 · the scripted selection
```
**A scripted selection is a person's choice, and it is the one thing that does lift the interactive refusal.** `--select 1,3` and `--select-file paths.txt` name exactly which items go, in advance, so a script or a GUI can drive these sections unattended - and because the naming is explicit, the selection also answers the section's final confirmation. It is a narrow, deliberate door: the refusal exists to stop *unchosen* deletion, not scripted deletion. `--yes` on its own still selects nothing and still answers nothing, and neither flag reaches anything the deletion chokepoint would otherwise refuse.
```
**Was:** identical.

**Change:** none. This paragraph already does the hardest thing on the page, which is to explain a door in a
refusal without weakening the refusal. The distinction it draws - unchosen deletion versus scripted deletion
- is the reason the door is defensible, and the last clause closes it off from the chokepoint.

### S-022 · safety-model.md:80-84 · running programs
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

### S-023 · safety-model.md:86-90 · links and long paths
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

### S-024 · safety-model.md:92-96 · dry-run
```
`--dry-run` short-circuits every deletion helper and every destructive external command (`docker`, `cleanmgr`, `Dism`, `powercfg`, `wevtutil`, `diskpart`, service stop/start, registry writes), printing what would happen and tallying an estimate. The self-test hashes a fixture tree before and after a dry-run to prove nothing changed. The run still writes its own session log and one JSON report; `--no-report` skips the report and `--cleanup-logs` deletes the log at exit.
```
**Was:** the same first two sentences, with no third.

**Change:** one sentence added, and it is the same correction `docs-start` S-017 makes to the quick start.
"Writes nothing" is the claim a reader will test, and the honest form of it is that nothing they own changes
while two files of the tool's own appear. `AI-INTEGRATION-GUIDE.md` already says this in one clause. The page
that makes the guarantee should say it too. It costs three facts.

### S-025 · safety-model.md:98-102 · no undo
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

### S-026 · safety-model.md:104-111 · inspect before you trust
```
## Inspect before you trust

windowsweep --self-test       # the guards, on this machine
windowsweep --list-targets    # every path the tool can touch
windowsweep --scan            # sizes; deletes nothing
windowsweep --dry-run --all --yes
```
**Was:** the same four lines; the third comment read `# sizes, read-only`.

**Change:** one comment. "Read-only" is the same overclaim `docs-start` S-017 removes from the quick start:
`--scan` writes a log and a report. "Deletes nothing" is the claim that is true, and it is also the claim the
reader of this section is checking. The heading stays as it is, because it is the best four words on the
page.

### S-027 · safety-model.md:113 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the corrections above it.

---

## §B `docs/developer-mode.md`

### S-028 · developer-mode.md:3-8 · the opener
```
The first interactive run asks one question:

> Are you a developer on this machine?

The answer is saved in `%USERPROFILE%\.windowsweep\config.json`. It decides how sections 1, 2, 3 and 5 treat the caches that make a developer's day fast, and whether sections 4, 17 and 20 run at all.
```
**Was:** The answer is saved in `~\.windowsweep\config.json` and decides how sections 1-5 treat the caches
that make a developer's day fast.

**Change:** two things. The path notation matches the rest of the documentation, for the reason
`docs-start` S-009 gives: `~\` expands in PowerShell and nowhere else a reader is likely to look. And the
scope is corrected, because the answer reaches eight sections rather than five. This page already describes
sections 4, 17 and 20 further down, so the opening sentence contradicted the page's own bullets.

### S-029 · developer-mode.md:12-13 · developer mode on · the idle gate
```
- Package-manager, build-tool and test-runner caches are **pruned by the idle gate**: a file goes only when its newest timestamp is `--days` old (default 100). A package you installed last month stays cached.
```
**Was:** identical.

**Change:** none. The second sentence is the whole argument for developer mode in eight words.

### S-030 · developer-mode.md:14 · developer mode on · keep-newest
```
- Versioned tool caches (Cypress, Playwright, Gradle distributions) keep their **newest version** whenever the idle gate is running. `--purge-all` replaces the gate with a full clear, and the newest version goes with the rest.
```
**Was:** Versioned tool caches (Cypress, Playwright, Gradle distributions) keep their **newest version**
unconditionally.

**Change:** "unconditionally" was false, which makes this the fourth wrong claim the pass found. In
`lib/actions.ps1` line 129, `--purge-all` rewrites a `units` target's mode to `clear`, and
`Clear-DirectoryContents` has no keep-newest step: every version goes, newest included. The flag's own row in
the table below says it clears cache targets completely even in developer mode, so this page contained both
halves of the contradiction. The corrected wording matches `safety-model.md` S-017, which says the same thing
from the other side.

### S-031 · developer-mode.md:15-16 · developer mode on · Docker
```
- Docker removes dangling layers, build cache idle for the window, and images no container uses that are older than the window. Volumes are never touched.
```
**Was:** identical.

**Change:** none. Three commands and a refusal, and the refusal is the sentence a Docker user reads first.

### S-032 · developer-mode.md:17 · developer mode on · section 17
```
- Section 17 scans your project roots for build artefacts in projects nobody touched for the window. It never scans a whole drive, and it never enters `.git`, AppData or a toolchain folder.
```
**Was:** Section 17 scans your project roots for build artefacts in projects nobody touched for the window.

**Change:** one sentence added, taken from what `docs/sections.md` already says about section 17 and from
`modules/projects.ps1`. This bullet is where a developer decides whether to answer yes, and "scans your
project roots" is the phrase most likely to be read as "scans my disk". Saying what it refuses to scan, in
the same bullet, is the row-4 structure applied at bullet scale.

### S-033 · developer-mode.md:18-19 · developer mode on · toolchains
```
- Toolchains stay protected in every mode: nvm, Volta, corepack, global npm/pnpm/bun/deno packages, cargo and go binaries, the Android SDK.
```
**Was:** identical.

**Change:** none. "In every mode" is the load-bearing phrase and it is already there.

### S-034 · developer-mode.md:23-25 · developer mode off
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

### S-035 · developer-mode.md:33 · flags · the `--purge-all` row
```
| `--purge-all` | Clear the cache targets completely even in developer mode. From a console it asks you to type `purge` once per run; in batch runs `--yes` is the confirmation. Decline the typed word and the run prunes by the idle window instead |
```
**Was:** ... From a console it asks you to type `purge` once per run; in batch runs `--yes` is the
confirmation

**Change:** the fallback is added. `Confirm-PurgeAllOnce` in `lib/config.ps1` sets `PurgeAll` back to `$false`
when the word is not typed and prints *"purge-all declined - this run prunes by the idle window instead"*, so
declining is a supported answer rather than an abort. A reader looking at a typed-word prompt on a
destructive flag needs to know that the safe path out of it still does something.

### S-036 · developer-mode.md:36-37 · the non-interactive default
```
A non-interactive run with no saved answer (a Scheduled Task on a fresh machine, `--json`) defaults to developer mode **on**, the conservative choice, and says so.
```
**Was:** identical.

**Change:** none. The parenthesis names the two cases a reader will actually hit, and "and says so" is
verifiable: `lib/config.ps1` prints the note on every such run.

### S-037 · developer-mode.md:39-44 · why 100 days
```
Windows keeps last-access times off on most volumes, so the tool takes the newest of last-write, last-access and creation time as the "last touched" estimate. That can only make a file look fresher than it is, never older, so a mistake keeps a cache entry instead of removing one. The 100-day default matches the sibling tools for Linux and macOS; an entry a project needed in the last three months is the kind a developer misses.
```
**Was:** identical.

**Change:** none. The middle sentence states the direction of the error, which is the only thing a sceptical
reader wants from a heuristic. The sibling claim was checked: `linux-cleanup` and `macleanup` both default to
a 100-day idle window in their own documentation.

### S-038 · developer-mode.md:46 · the last heading
```
## Being more aggressive, and what it costs
```
**Was:** ## Being more aggressive safely

**Change:** "safely" is the adverb form of the adjective this voice does not use, and it was doing the most
work in the sentence: it promised that the four commands below carry no cost. They do. A shorter idle window
removes caches a project may want next week, and `--purge-all` removes all of them. The replacement heading
says the section covers both halves, and the commands under it are unchanged.

### S-039 · developer-mode.md:48-53 · the four commands
```
windowsweep --scan                                  # sizes first
windowsweep --dry-run --profile dev --days 30       # see what a 30-day window would take
windowsweep --profile dev --days 30 --yes
windowsweep --only 1 --purge-all --yes              # empty the package caches entirely
```
**Was:** identical.

**Change:** none. Scan, rehearse, run, then the aggressive one last, which is the same order the quick start
uses. The last comment says "entirely" rather than softening it.

### S-040 · developer-mode.md:54 · NEW · the closing line
```
Section 17 and the AVD section are skipped when the developer answer is no, so a run that suddenly reclaims less than the last one is worth checking against `windowsweep --scan`, which reports the answer currently in force.
```
**Was:** (new — the page ends on the fence.)

**Change:** added. The most common confusion this page can cause is a reader flipping the answer with
`--not-developer` and then wondering why three sections vanished. Section 0's health report prints
`Developer mode:` with the answer and where it came from, and `--scan` runs section 0, so the sentence hands
the reader the command that answers their own question.

### S-041 · developer-mode.md:55 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the two corrections above it.

---

## SELF-CHECK

**Palette.** P and R only, which row 4 requires, and no W anywhere on either page. P carries the mechanism
slots: S-005, S-012, S-013, S-015, S-017, S-023 and S-030 each name a file, a line or an exact count. R
carries the refusals and lands nine times, always as a specific thing the tool declines: S-002 (three
counts), S-006 (four flags that change nothing about reach), S-007 (two exceptions and no others), S-011,
S-013 (refused twice), S-025 (no copy, no staging folder, no restore command), S-031 (volumes), S-032
(never a whole drive), S-033 (every mode). No sentence carries tone. Nothing on either page reads as an
aside, and nothing near an irreversible action does anything other than say what happens.

**Rhythm.** Shortest shipping sentence: *"They do."* (two words, S-038 commentary) and, in shipping text,
*"Deletion is one-way for the rebuild tiers."* at seven. Longest: the second sentence of S-013 at 34 words.
Median across changed strings is around 24, which is higher than the fingerprint's 12-16 because this page is
explanatory by row assignment.

**Length.** Row 4's cap is "as long as the subject needs". `safety-model.md` measures 998 words today and
lands near 1,320; `developer-mode.md` measures 370 and lands near 470. Both grew, and every added word is
either a count, a correction or a named refusal.

**Unsure spots.** One. It is recorded rather than guessed: the long-path fixture's 445 characters is this
machine's value, not the release's, and S-023 says so in the shipping text rather than presenting it as a
constant. The README currently states 445 flatly, which is a companion edit this draft does not own.

**Banned-phrase sweep.** Run against the shared list and the project's own bans over the fenced shipping
strings only, 1,902 words of them. One hit, deliberate: **`safe`** as the first cell of the batch-policy
table in S-019. That is the literal value of the catalogue's `Batch` field in `lib/constants.ps1` and the
name of the row, not the adjective band R replaces. No hit for `clean`, `sweep`, `safely`, `preview`, `just`
or `simply`, none for the shared list's inflated adjectives, and none for any first-person plural.
