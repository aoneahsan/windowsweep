# docs-help — troubleshooting and the FAQ

<!-- story-lint: allow "elevate" -->

Content-map row **6** · surfaces `docs/troubleshooting.md` and `docs/faq.md` · awareness **stuck, mid-task**
· structure **symptom → cause → the exact command** · tone bands **P, W allowed once per page** · length
**short answers** · CTA **the fixing command** · schema **FAQPage, page-scoped on `faq` only**.

A reader here is not evaluating anything. They are stuck. They have a message on screen or a question in
their way, and the useful answer is the shortest one that ends in something they can run. Every fix on both
pages was checked against the string the engine actually prints.

## 🔴 The `FAQPage` schema is live, so §C is an edit rather than a proposal

`content-map.md` row 6 assigns **FAQPage** to this surface and the docs site now carries it.
`windowsweep-docs/docs/faq.mdx` holds a page-scoped `<Head>` block with four questions - correctly
page-scoped rather than in the `headTags` array, where the site's four other JSON-LD scripts sit and are
emitted on every page.

It was built from `faq.md` as that file stands today, not from this draft, and it is in sync: parsed and
compared on 2026-09-07, four names and four answer texts, all eight matching the visible page once markdown
is stripped. So there is no desync to repair here, and the earlier reading of this row as unimplemented was
wrong.

What that costs is stated plainly, because the file's own comment already says it: **every question and
answer in the block must be visible on the rendered page**, so an answer that changes above changes the block
in the same edit. This draft changes all four of the block's entries and adds a fifth. §C carries the
replacement payload so nobody has to re-derive it.

| File | Slot range | Count |
|---|---|---|
| §A `docs/troubleshooting.md` | S-001 – S-013 | 13 |
| §B `docs/faq.md` | S-014 – S-028 | 15 |
| §C the `FAQPage` payload | S-029 | 1 |
| **Total** | | **29** |

---

## §A `docs/troubleshooting.md`

The whole page is one table. Its Cause and Fix cells are explanation rather than a record of engine
vocabulary, so they are in scope.

**Counted from the live file, 2026-09-07.** `docs/troubleshooting.md` lines 5-21 are the table body - `sed
-n '5,21p' docs/troubleshooting.md | grep -c '^|'` returns **17**, the header and delimiter rows excluded.
**Ten** of those rows change and carry a slot below, S-002 to S-011; the remaining **seven** are already
right and are listed as kept at the end of this section. Three slots here are not rows at all: S-001 is the
line above the table, S-012 the line below it, S-013 the footer. The earlier counts - twenty-two rows, nine
kept, thirteen changed - were never true of this file: the table has held 17 rows since `5109557`, and this
page is unchanged in the working tree, so the numbers were a miscount rather than drift. Counted, not
remembered.

### S-001 · troubleshooting.md:3 · NEW · the line above the table
```
The left column is what you are looking at: a line windowsweep printed, a line from PowerShell, npm or the shell, or an outcome with no message at all. Every row here belongs to the command-line tool. A problem that appears only in the desktop window is on [Desktop app](./desktop.md).
```
**Was:** (new — the table follows the H1 directly.)

**Change:** added, and it is deliberately not the sentence this slot carried in the first draft. That opener
read *"Every symptom below is a line windowsweep prints"*, which is false for **nine of the seventeen rows**.
Three are other programs talking: PowerShell's `running scripts is disabled`, npm's `notsup`, and cmd's
`is not recognized`. Six print nothing at all - the two reclaimed-less rows, the glyph row, the extension
row, the kept-version row and the crash-bundle row, each of which is an outcome a reader notices rather than
a message they can search for. Eight rows are windowsweep's own lines, confirmed by grepping `lib/`,
`modules/` and `windowsweep.ps1` for each quoted string. So the line orients instead of classifying: it says
what the left column holds, and a reader who cannot find their exact string now knows why.

The desktop clause is the rest. `docs/desktop.md` is live at `/desktop` and nothing on this page
pointed at it, so a reader whose problem is only in the window had no way out of a table that cannot help
them. It states the boundary rather than duplicating anything: these rows are the engine's.

**The escape hatch moves to the bottom, at S-012.** The session log and `--report-issue` are the right last
word and the wrong first one - offered above the table they invite a reader to give up before they have read
seventeen rows. The FAQ's own closing pointer at S-026 puts "not here?" at the end for exactly that reason,
and S-012 already carries the log sentence, so the beat lands where it was half-written already. Last word,
not first.

### S-002 · troubleshooting.md:6 · the refusal row
```
| `REFUSE (inside protected: ...)` | The path resolves inside a protected folder, sometimes through a junction into your profile | Working as designed. No flag overrides this refusal. `--list-targets` prints the protected subtrees as the running script sees them |
```
**Was:** Fix: Working as designed. `--list-targets` shows the protected list; nothing bypasses it

**Change:** the Fix cell. "Nothing bypasses it" is right about the protected lists and slightly wider than
what `lib/safety.ps1` guarantees, since `--prune-history` does lift the guard on the tool's own data folder.
`docs-safety` S-006 states that boundary in full. Here the honest short form is that there is no flag for
**this** refusal, which is what the reader is looking at. "Shows the protected list" becomes "prints the
protected subtrees", because that is the part the command prints item by item.

### S-003 · troubleshooting.md:7 · the running-browser row
```
| `Google Chrome - skipped: chrome is running` | The browser or app is open and holds its cache files | Close it and run `windowsweep --only 7 --yes`. The section number is in the message, and the run's next-steps list repeats the whole command |
```
**Was:** Symptom: `skipped: chrome is running`; Fix: Close it and run `windowsweep --only 7 --yes` (the
section number is in the message)

**Change:** the symptom is quoted as it prints. `lib/actions.ps1` line 119 emits the target label first, so a
reader searching this page for the line on their screen was searching for a fragment. The Fix gains the
next-steps fact, which is how a reader with three closed apps finds all three commands without re-running.

### S-004 · troubleshooting.md:8 · the elevation row
```
| `section 12 needs Administrator rights - skipped.` | The console is not elevated | `windowsweep --only 12 --yes --elevate`, or the `system` profile with `--elevate`. The profile covers 12, 13 and 14; sections 15, 16 and 20 also need `--i-understand-deep` |
```
**Was:** Symptom: `needs Administrator rights - skipped`; Fix: `windowsweep --only 12 --yes --elevate`, or
run the profile `system` with `--elevate`

**Change:** two things. The symptom gains the section number that `modules/runner.ps1` line 98 actually
prints, which is the part a reader will vary. And the Fix gains the boundary, for the same reason
`docs-start` S-022 rewrites the quick start's admin step: `WS_PROFILES['system']` is `@(12, 13, 14)`, so a
reader who hit this message on section 16 and ran the profile would be no better off. Naming the three the
profile covers turns one command into a complete answer. The other three get their gate.

### S-005 · troubleshooting.md:10 · the deep-section row
```
| `section 11 is deep (irreversible or system-changing): refused in batch mode without --i-understand-deep.` | A deep section (11, 15, 16, 20) was named in `--only` or a profile. The gate is there because 11 empties the Recycle Bin and 16 clears the event logs. Neither can be undone | Read what the section does, then run it from the menu or add `--i-understand-deep` with `--yes` |
```
**Was:** Symptom: `refused in batch mode without --i-understand-deep`; Fix: Add `--i-understand-deep` with
`--yes`, or run it from the menu

**Change:** the symptom is quoted in full from `modules/runner.ps1` line 90, and the deciding fact moves into
the **Cause** cell. This is the only row on the page whose fix hands a reader a permanent deletion, and the
first version of this slot put the flag first and the warning after it. A reader scanning a table copies the
first runnable thing they see, which means the sentence that decides whether to run it arrives too late to
decide anything. Cause now carries what the gate protects - `docs/sections.md` lists 11 (Recycle Bin) and 16
(event logs) at tier `permanent`, while 15 and 20 are `config`, so "neither can be undone" is exact rather
than a rounding of "deep" - and the Fix ends on the command, which is the shape row 6 asks for: symptom,
cause, the exact command. The runnable thing goes last.

### S-006 · troubleshooting.md:11 · the interactive-section row
```
| `section 17 is interactive-only: it needs a person at the keyboard, or a selection passed with --select / --select-file.` | Personal and project sections never run unattended | Run `windowsweep --only 17` from a console, or pass a selection in advance: `--dry-run --json` lists the candidates, then `--select-file picks.txt` acts on them |
```
**Was:** Symptom: `section 17 is interactive-only`; Fix: Run `windowsweep --only 17` from a console;
`--dry-run` lists candidates

**Change:** the message is quoted whole, and the Fix gains the answer the message itself offers. The engine's
line names `--select` and `--select-file`; the page's fix did not, so a reader scripting a run was sent back
to a console they may not have. The two-step form is what `AI-INTEGRATION-GUIDE.md` recommends and it fits in
a cell.

### S-007 · troubleshooting.md:12 · the estimate row
```
| Reclaimed less than the dry-run estimated | Files were created or locked between the two runs, or an app started in between | Re-run, then compare the log's `skip (locked)` lines. An estimate is what was there when the rehearsal ran, never a promise about the next run |
```
**Was:** Fix: Re-run; compare the log's `skip (locked)` lines

**Change:** a sentence added to the Fix. The row explains the cause and then leaves the reader to infer
whether the tool was wrong, and the answer is that a dry-run measures the disk at one moment. Saying it here
matches the AI guide's "Do not treat a green `--dry-run` as proof that a real run frees the same amount", and
it is the sentence that stops this being read as a bug.

### S-008 · troubleshooting.md:13 · the scan-versus-reclaimed row
```
| Reclaimed less than `--scan` showed on disk | The idle gate kept files used within the window; running apps were skipped | Lower `--days`, close the apps, or use `--purge-all` for a full clear. `--scan` reports what a target holds; the idle gate decides how much of it goes |
```
**Was:** Fix: Lower `--days`, close the apps, or use `--purge-all` for a full clear

**Change:** a sentence added. This is the most common surprise the tool produces, and the two numbers mean
different things: `--scan` sums a folder, and a run removes the part of it that is idle. A reader who does
not know that will read the gap as a failure rather than as the product working.

### S-009 · troubleshooting.md:17 · the extension row
```
| An editor extension folder was removed | The editor's `extensions.json` no longer referenced it (uninstalled or superseded) | Reinstall the extension from the editor. The tool never removes a folder that file still references, so what went was not a live extension |
```
**Was:** Fix: Reinstall the extension from the editor; the tool never removes a referenced folder

**Change:** the clause becomes a sentence. It now rules something out. "Never removes a referenced folder"
is correct and reads as a general policy; the reader here wants to know whether the thing they are missing
was live, and the answer is that it was not.

### S-010 · troubleshooting.md:18 · the kept-version row
```
| Cypress or Playwright kept a version I expected to go | One file inside it was touched within the window, or it is the newest of its kind | Lower `--days`, or remove the version by hand. The idle gate keeps the newest build of each family; `--purge-all` is what removes it |
```
**Was:** Fix: Lower `--days`, or remove the version by hand

**Change:** the mechanism is added, with its condition. Keep-newest is the likelier of the two causes and the
row named it without saying how to override it. The condition matters and is the same correction
`docs-safety` S-030 makes: `lib/actions.ps1` line 129 turns a `units` target into a `clear` under
`--purge-all`, so keep-newest is a property of the idle gate rather than of the section.

### S-011 · troubleshooting.md:19 · the crash-bundle row
```
| A crash bundle appeared | The run exited with an unexpected error | Inspect `%USERPROFILE%\.windowsweep\feedback\crash-*.zip`, then `windowsweep --report-issue`. The bundle stays on your disk; nothing is sent unless you attach it yourself |
```
**Was:** Fix: Inspect `~\.windowsweep\feedback\crash-*.zip`, then `windowsweep --report-issue`

**Change:** the path notation, and one clause. A file called a crash bundle is the single most likely thing
on this page to be read as telemetry, and the product's central claim is that nothing leaves the machine. One
clause settles it in the row where the question arises.

### S-012 · troubleshooting.md:23 · the closing line
```
Every skipped or refused path is in the session log at `%USERPROFILE%\.windowsweep\logs\` with its reason. The log records what happened; it undoes nothing. If your symptom is not in the table, start with that log. `windowsweep --report-issue` opens a pre-filled GitHub issue after you confirm.
```
**Was:** Every skipped or refused path is in the session log at `~\.windowsweep\logs\` with its reason.

**Change:** the path notation, the second sentence that `docs-safety` S-025 and `docs-reference` S-066 also
carry, and the third, which is the beat S-001 no longer opens with. A reader who arrives at a
troubleshooting page because something is missing will read "every path is in the log" as a lead, and the
honest answer belongs in the same place as the offer. The log first, then the issue. `--report-issue` is the
right CTA to end on because it is the only channel and it is opt-in: `Start-Process` hands the URL to the
browser after a confirmation, and a reader who has just failed to find their symptom is the reader that
command exists for. That is where it belongs.

### S-013 · troubleshooting.md:25 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the edits above it.

**Rows kept without a slot**, each checked and each already correct: the execution-policy row, the
interactive-console row, the Docker-daemon row, the elevation-refused row, the glyph row, the
`npm ERR! notsup` row (`package.json` declares `os: ["win32"]`), and the npx-inside-a-clone row, whose
explanation is the longest cell on the page and is worth every word.

---

## §B `docs/faq.md`

**Eleven questions today**, and one more is owed - `grep -c '^\*\*' docs/faq.md` returns 11.
`content-map.md` assigns question 2 of the question map - how to delete `node_modules` from old projects - to
surfaces 5 and 6, and this page does not answer it. S-016 adds it, which takes the page to twelve.

🔴 **Every line reference in this section was re-anchored to the live file on 2026-09-07.** `docs/faq.md`
was edited on 2026-09-05 at 21:01, thirteen minutes after this draft was first written, by the seventeen-defect
documentation pass in `89e4888`. Three `Was:` lines drifted with it and are corrected in place below, each
with what the live file actually says: S-017, S-022 and S-024.

### S-014 · faq.md:3-6 · will it delete my files
```
**Will it delete my code, documents or photos?**
No. Documents, Pictures, Desktop, Music, Videos and cloud-sync folders are protected subtrees the chokepoint refuses outright. No flag changes that. The only project-adjacent target is section 17, which lists build artefacts (`node_modules`, `dist`, ...) in idle projects and removes nothing you did not select.
```
**Was:** ... are protected roots the chokepoint refuses outright. The only project-adjacent target is section
17 ...

**Change:** two words and a clause. They are protected **subtrees** rather than roots, which is the term the
rest of the documentation uses and the one that matches `lib/safety.ps1`; "roots" means the fifteen exact
paths, a different list. And "no flag changes that" is added, because it is the reader's real question and
the answer is one clause long.

### S-015 · faq.md:8-10 · does it phone home
```
**Does it phone home?**
No. The command-line tool makes no network calls at all. Self-test check [9] greps every source file for seven call shapes (`Invoke-WebRequest`, `Invoke-RestMethod`, `Net.WebClient`, `HttpClient`, `Sockets.TcpClient`, `curl.exe` and `wget`) and fails the run if it finds one. `--report-issue` opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself. The desktop window is a different answer: it sends usage and crash reports to improve the product, and there is no switch. What it sends is listed on the [Desktop app](./desktop.md) page.
```
**Was:** No. The source contains no HTTP or socket call; the self-test greps for them. `--report-issue`
opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself.

**Change:** the mechanism is named, and the answer gains the scope word it was missing plus a desktop clause.

The mechanism first. "The self-test greps for them" asks the reader to take the grep on trust; listing the
seven needles lets them run the same search themselves in one command. They are the literal strings in
`modules/release_helpers.ps1` line 224, reassembled there from fragments so the check does not match its own
source.

The scope is the larger correction. This answer described the engine and then stood as the product's answer,
which stopped being true when the desktop window shipped: it checks for an update on every start, and it
sends analytics with no opt-out since the owner removed one on 2026-09-07. **Both halves are now said, in
that order**, because the engine's claim is the stronger one and rescoping it is what keeps it - the same
correction Bible §3 commitment 3 took on 2026-09-07, where *"no network calls at all"* went from a
product-wide sentence a reader can falsify to an engine-scoped one that is exactly true.

Content-map question 7 is the row behind this slot, its freshness is *"re-check on every desktop release"*,
and a desktop release landed on 2026-09-07. 🔴 **Its answer text is itself out of date** - it ends *"The
desktop app can send analytics and sends nothing until you accept"*, and there is nothing to accept any more.
The clause above is written from the product rather than from the row, and the row is a keeper item, not a
writer's edit.

**The disclosure itself is not duplicated here.** `docs/desktop.md` owns what it sends - four destinations,
what each one is, and the fact that no key is configured in this release - and a second copy of that list is
a second thing to keep in step. One sentence of substance, one pointer, and the detail stays where it lives.
One home per fact.

### S-017 · faq.md:12-15 · why is there no undo
```
**Why is there no undo?**
Caches regenerate; an undo copy would consume the disk you are trying to free. Personal files - sections 18, 19 and 23 - go to the Recycle Bin instead, which is Windows' undo. Every deletion is recorded in the session log, which is a record rather than a restore.
```
**Was (corrected 2026-09-07 - the live file had moved):** Caches regenerate; an undo copy would consume the
disk you are trying to free. Personal files - sections 18, 19 and 23 - go to the Recycle Bin instead, which is
Windows' undo. Every deletion is recorded in the session log.

**Change:** one clause. It is the only one left. The first draft's `Was:` read *"Personal files (sections
18 and 19)"* and its whole argument was that **section 23 was missing** - the same defect `docs-safety` S-015
corrects in the tier table. That correction has since landed on its own: `89e4888` added 23 to the live
answer thirteen minutes after this draft was written, so the claim is now true of the page and this slot no
longer makes it.

What remains is the closing clause, eight words: *"which is a record rather than a restore"*. A reader who
has just been told every deletion is recorded will read that as a way back, and it is not. It matches S-012
above, and the same sentence is what `docs-safety` S-025 and `docs-reference` S-066 carry. Eight words, no
more.

### S-018 · faq.md:17-20 · why keep 100 days
```
**Why does it keep files used in the last 100 days?**
Because a developer's caches make the next install or build fast. The idle gate keeps recent work. To reclaim more, lower `--days`, use `--purge-all`, or answer no to the developer question. See [Developer mode](./developer-mode.md).
```
**Was:** ... `--days`, `--purge-all` and developer mode off are the knobs when you want more.

**Change:** "developer mode off" becomes "answering the developer question with no", which is what the reader
does rather than a state they must find. The glossary calls it the developer answer for this reason.

### S-016 · after faq.md:20 · NEW · deleting node_modules · **moved: it now follows S-018**
```
**How do I delete `node_modules` from old projects?**
Section 17. It lists build artefacts in projects you have not touched for 100 days and removes only the ones you select. It never scans a whole drive: it looks in your project roots, which it auto-detects or which you name with `--scan-roots "P1;P2"`. Run `windowsweep --only 17` from a console, or `--only 17 --dry-run --json` to see the list without a prompt.
```
**Was:** (new.)

**Change:** added, because the content map assigns this question to this surface and the page did not carry
it. The first two sentences reproduce the map's answer-first text near enough verbatim. The third is the
refusal that makes the answer trustworthy, and it is the fear the question carries. The fourth is the CTA row
6 asks for, in two forms, because a reader who searched this question may be on a machine without an
interactive console.

**Moved, 2026-09-07.** It sat third on the page, between "Does it phone home?" and "Why is there no undo?",
and it spends the term *100 days* three questions before the page defines it. S-018 is where the page
explains the idle gate, so this now follows it: cause, then consequence. Nothing in the text changes and the
slot number does not move - only its position on the page does, which is also why the `FAQPage` payload in
§C needs no `text` edit on this account.

### S-019 · faq.md:22-23 · why is Chrome skipped
```
**Why is Chrome skipped?**
An open browser keeps its cache files locked and half-written. Close it and run `windowsweep --only 7 --yes`.
```
**Was:** identical.

**Change:** none. Two sentences: a cause and a command. It is the model the rest of this page follows.

### S-020 · faq.md:25-27 · why never Prefetch
```
**Why never Prefetch?**
Windows uses Prefetch to start programs faster and rebuilds it if cleared, so clearing it makes the machine slower for a while and frees little. It is a protected subtree; no flag reaches it.
```
**Was:** Windows uses Prefetch to start programs faster and repopulates it if cleared, so clearing it makes
the machine slower for a while and frees almost nothing.

**Change:** two edits. "Almost nothing" becomes "little", because the first is a quantity claim with no
measurement behind it and the second is a plain judgement. And the second sentence is added: `$SR\Prefetch`
is in the subtree list at `lib/safety.ps1` line 40, so the answer to "why never" is a refusal rather than a
preference, which is the stronger and the truer answer.

### S-021 · faq.md:29-31 · will freeing space make it faster
```
**Will freeing space make my PC faster?**
Mostly no. Disk cleanup is about space. The exception is a system drive with very little room left: Windows needs free space to page, to stage updates and to hold temp files, and below roughly 10% those start competing. Section 0 warns at that line, so `windowsweep --scan` tells you whether you are in that zone.
```
**Was:** A system drive below roughly 10% free slows Windows badly (temp files, updates, paging and browser
caches all fight for room), so getting out of that zone helps a lot. Beyond that, disk cleanup is about
space, not speed.

**Change:** rewritten. This was the page's most over-promised answer. "Slows Windows badly" and "helps a
lot" are two adjectives standing where a number should be, and this product has no measurement of either.
The replacement answers first with the honest word, names the one real mechanism, and then hands the reader
the command that tells them whether it applies to their machine. Section 0 does warn under 10% free -
`modules/health.ps1` computes the percentage and flags it - so the last sentence is checkable rather than
rhetorical.

### S-022 · faq.md:33-37 · is a weekly task safe
```
**What does the weekly Scheduled Task actually run?**
`--install-task` registers `--all --yes --quiet --no-color --notify`, weekly on Sundays at 03:00, as your user: the safe batch only, no admin sections, no personal files, no deep sections. It catches up if the PC was off and stops itself after three hours. Review the first run's report before scheduling. Install globally first (`npm install -g windowsweep`); from `npx` the installer refuses, because the task would point at a cache npm evicts.
```
**Was (corrected 2026-09-07 - the live file had moved):** **Is a weekly Scheduled Task safe?** /
`--install-task` schedules `--all --yes --quiet --no-color --notify`: the safe batch only, under your account,
no admin sections, no personal files, no deep sections. Review the first run's report before scheduling.
Install globally first (`npm install -g windowsweep`); from `npx` the installer refuses because that cache is
evicted.

**Change:** the question and the answer. "Is it safe?" invites the adjective the voice replaces. The
question a reader actually has is what the task will do at three in the morning.

🔴 **One of the first draft's claims here is no longer true and is withdrawn.** It said the answer "now names
the whole action line" and that no page mentioned `--notify`; `89e4888` added the full line
`--all --yes --quiet --no-color --notify` to the live answer on 2026-09-05, so the page has named it for two
days. The action line above is therefore a match with the live file rather than a correction of it.

What this slot still changes: the question; *schedules* becomes **registers**; the schedule constants
**weekly on Sundays at 03:00, as your user** from `modules/release_helpers.ps1` line 347; the two settings
from line 354 - `-StartWhenAvailable` is the catch-up, the three-hour `ExecutionTimeLimit` is the stop; and
the npx clause, which gains its mechanism to match `docs-start` S-003. The rest already landed.

### S-023 · faq.md:39-41 · why PowerShell
```
**Why PowerShell rather than an .exe?**
Every Windows machine has PowerShell 5.1, so there is no runtime to install and no binary to trust. The engine is 5,588 lines of readable script across `windowsweep.ps1`, `lib/` and `modules/`, and `--self-test` runs 155 checks of it on your machine.
```
**Was:** Every Windows machine has PowerShell 5.1, so there is no runtime to install and no binary to trust.
The source is readable in an afternoon and the self-test runs on your machine.

**Change:** "readable in an afternoon" becomes the line count. It is the fingerprint's own listed tell -
an adjective standing in for a number - and it is the one claim on the page a reader could disprove by
opening the folder. 5,393 lines is the sum of `windowsweep.ps1`, `lib/*.ps1` and `modules/*.ps1` on this
tree, and the number invites the reader to judge for themselves rather than being told the answer. The 151 is
the self-test's own count, printed at the end of every run. Anyone can count both.

### S-024 · faq.md:43-46 · Windows Server
```
**Does it run on Windows Server?**
The engine uses nothing newer than Windows 10 1809 / Server 2019. CI runs the self-test and a dry-run of the safe batch on GitHub's `windows-latest` Server image, on every push to `main` and on every pull request. Real cleanups have been verified on Windows 10 so far; a Windows 11 run is on the verification list.
```
**Was (corrected 2026-09-07 - the live file had moved):** ... CI runs the self-test and a dry-run of the safe
batch on Windows Server (GitHub's `windows-latest`) on every push to `main` and on every pull request. ...

**Change:** phrasing only, and the substantive half is withdrawn. The first draft argued that *"on every
push"* misstated `.github/workflows/ci.yml`, which triggers on `push: branches: [main]` and on
`pull_request`. That was right when it was written and `89e4888` has since fixed it on the page, so the
trigger sentence above matches the live file rather than correcting it.

What is left is one phrase: *"on Windows Server (GitHub's `windows-latest`)"* becomes *"on GitHub's
`windows-latest` Server image"*, which drops a parenthesis and says which is the name and which is the fact.
It is a small change and it is recorded as small. The last sentence is untouched and is still the most
valuable one in the answer, because it says what has **not** been verified.

### S-025 · faq.md:48-49 · where are the logs
```
**Where are the logs?**
`%USERPROFILE%\.windowsweep\logs\`. Reports are beside them; `windowsweep --reports` browses them, and `--stats` prints the run history and the total reclaimed.
```
**Was:** `%USERPROFILE%\.windowsweep\logs\`. Reports are beside them; `windowsweep --reports` browses them.

**Change:** `--stats` is added. A reader asking where the logs are is usually asking what the tool has done
so far, and `--stats` answers that in one command rather than by reading files. It is in the mode table on
the CLI reference and appears nowhere a stuck reader would look.

### S-026 · after faq.md:49 · NEW · the closing pointer
```
Not here? [Troubleshooting](./troubleshooting.md) is symptom by symptom, and the [safety model](./safety-model.md) covers every guard in full.
```
**Was:** (new — the page ends on the logs answer.)

**Change:** added. Both links discharge the internal-link floor, which asks every indexed page to reach the
safety model and one reference page, and neither was present on this page. Two words then two links, which is
as short as the row's "short answers" allows a navigational line to be.

### S-027 · faq.md:51 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the edits above it.

### S-028 · faq.md · the page's one W

**Change:** none, and recorded so nobody adds one. Row 6 allows band W once per page and neither page spends
it. The nearest thing on the FAQ is S-023's line count, which is a fact rather than an aside, and the nearest
thing on the troubleshooting page is the npx-inside-a-clone row. That row explains a self-inflicted problem
without a trace of tone, which is correct: a reader reading it has been stuck for ten minutes.

---

## §C the `FAQPage` payload

### S-029 · `windowsweep-docs/docs/faq.mdx` · the page-scoped `FAQPage` block · **it exists; this replaces it**
```
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Will it delete my code, documents or photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Documents, Pictures, Desktop, Music, Videos and cloud-sync folders are protected subtrees the chokepoint refuses outright. No flag changes that. The only project-adjacent target is section 17, which lists build artefacts (node_modules, dist, ...) in idle projects and removes nothing you did not select."
      }
    },
    {
      "@type": "Question",
      "name": "Does it phone home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The command-line tool makes no network calls at all. Self-test check [9] greps every source file for seven call shapes (Invoke-WebRequest, Invoke-RestMethod, Net.WebClient, HttpClient, Sockets.TcpClient, curl.exe and wget) and fails the run if it finds one. --report-issue opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself. The desktop window is a different answer: it sends usage and crash reports to improve the product, and there is no switch. What it sends is listed on the Desktop app page."
      }
    },
    {
      "@type": "Question",
      "name": "Why is there no undo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Caches regenerate; an undo copy would consume the disk you are trying to free. Personal files - sections 18, 19 and 23 - go to the Recycle Bin instead, which is Windows' undo. Every deletion is recorded in the session log, which is a record rather than a restore."
      }
    },
    {
      "@type": "Question",
      "name": "How do I delete node_modules from old projects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Section 17. It lists build artefacts in projects you have not touched for 100 days and removes only the ones you select. It never scans a whole drive: it looks in your project roots, which it auto-detects or which you name with --scan-roots \"P1;P2\". Run windowsweep --only 17 from a console, or --only 17 --dry-run --json to see the list without a prompt."
      }
    },
    {
      "@type": "Question",
      "name": "What does the weekly Scheduled Task actually run?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "--install-task registers --all --yes --quiet --no-color --notify, weekly on Sundays at 03:00, as your user: the safe batch only, no admin sections, no personal files, no deep sections. It catches up if the PC was off and stops itself after three hours. Review the first run's report before scheduling. Install globally first (npm install -g windowsweep); from npx the installer refuses, because the task would point at a cache npm evicts."
      }
    }
  ]
}
```
**Was:** the live block, four entries, page-scoped in `<Head>` inside `faq.mdx`: *"Will it delete my code,
documents or photos?"*, *"Does it phone home?"*, *"Why is there no undo?"* and *"Is a weekly Scheduled Task
safe?"*. Each `text` is the current `faq.md` answer with its markdown removed - parsed and compared on
2026-09-07, four names visible on the page and four texts matching character for character.

**Change:** all four entries, plus a fifth. The first draft of this slot recorded the block as missing and
marked itself `BLOCKED`; that was wrong, and the correction matters more than the payload. The block was
built from the live page, it is page-scoped exactly as `content-map.md` row 6 now specifies, and it is in
sync today. **There is nothing here to repair - only something to keep in step.**

Which is the whole risk. The file's own comment says it: *"if an answer changes below, this block changes in
the same edit"*. This draft changes all four.

| Block entry | Why it changes |
|---|---|
| Will it delete my code, documents or photos? | S-014 - *roots* becomes *subtrees*, and *"no flag changes that"* is added |
| Does it phone home? | S-015 - the answer is scoped to the command-line tool and gains the desktop clause |
| Why is there no undo? | S-017 - the log sentence gains *"which is a record rather than a restore"* |
| Is a weekly Scheduled Task safe? | S-022 - **the question itself is renamed** to *"What does the weekly Scheduled Task actually run?"*, so this entry's `name` changes, not only its `text` |
| *(new)* How do I delete node_modules from old projects? | S-016 - a new visible question on the page, and the one the content map assigns here |

**Five questions rather than twelve, on purpose.** Google's guidance is that every question and answer in a
`FAQPage` block must be visible on the page, and a block repeating all twelve doubles the page's weight for
no gain. These five are the ones the question map assigns to this surface or names as the audience's real
queries.

🔴 **The payload above was generated from this draft's own fences, not typed beside them.** Each `text` is
the slot's shipping answer with links flattened to their visible words and backticks and bold markers
removed, which is what a reader sees. That closes two parity gaps the first draft had opened by hand: its
first entry had dropped *"(node_modules, dist, ...)"* and its second had dropped the seven call shapes, so
two of five `text` values were already shorter than the page they claimed to mirror. The order follows the
page, which is why the `node_modules` entry sits fourth - S-016 now comes after S-018. Parity, checked by
machine.

---

## SELF-CHECK

**Palette.** P throughout, which is what a stuck reader needs: every changed cell ends either in something
runnable or in the one fact that decides whether to run it. R lands where a fix could otherwise read as a
workaround - S-002 (no flag for this refusal), S-005 (the Recycle Bin and the event logs cannot be undone),
S-011 (nothing is sent), S-014 (no flag changes that), S-015 (the command-line tool makes no network calls at
all), S-020 (a protected subtree rather than a preference). W is unspent on both pages, deliberately, and
S-028 records why. Neither page needs one.

🔴 **One band note for the keeper, not a defect here.** Row 6's tone field reads *"P, W allowed once per
page"* and does not name R - yet the map's own answer-first sentences for questions 4 and 7 are R-shaped,
because on this surface the refusal *is* the answer. Six slots above are R and none of them is decorative:
strip the R clauses and the reader loses the answer rather than a flourish. That is a row-wording gap in
`content-map.md`, and it is flagged rather than acted on.

**Rhythm.** Measured over 99 sentence units across every shipping fence, table rows split cell by cell and
sentences split on a full stop followed by whitespace and a capital, backtick or bracket. Shortest: **"No."**
- one word, S-014 and S-015. Longest: **32 words**, S-021's exception sentence, which is unchanged approved
copy and sits inside the fingerprint's 4-34 range. Median 11.

One sentence was split during this round for exactly that reason. S-015's mechanism clause measured **36
words**, over the ceiling, and is now two - which also lets the answer-first line stand on its own: *"No. The
command-line tool makes no network calls at all."*

**Length.** Row 6 asks for *short answers* rather than a number, so both pages are measured and each answer
is measured separately. **Tokenizer:** whitespace split, keeping tokens that contain at least one
alphanumeric character, so the table's `|` separators and its `---` delimiter row do not count.
**Inclusion rule:** the whole rendered page - the H1, the table header row, every cell, the paragraphs above
and below the table, and the `Last Updated` footer.

| Page | Live | After this draft |
|---|---|---|
| `docs/troubleshooting.md` | 468 | 737 |
| `docs/faq.md` | 439 | 669 |

The longest single answer is now **S-015 at 86 words**, taking the ceiling from S-022 at 72. It earns it by
answering for two products: the engine's claim and the window's disclosure are different facts, and an
answer carrying only the first is what this round was convened to fix. Two facts, one answer. Every other
answer on the FAQ sits between 18 and 72 words.

**Unsure spots.** None structural, and the one this draft used to carry is withdrawn. The `FAQPage` block
exists, is page-scoped on `faq.mdx`, and is in sync with the live page - parsed and compared, four names and
four texts. §C's replacement payload was generated from this draft's own fences and checked back against
them, **5 of 5 matching**. What remains is an ordinary apply: §C lands in the same edit as the docs-site mirror of §B, or the
block starts making claims the page does not. Both repos, one pass.

**Banned-phrase sweep.** Run over the fenced shipping strings only - **1,220 words**, S-029's payload
excluded because it is a derived duplicate of §B - against the shared list plus this project's own "Never"
diction and the store words. 119 phrases checked, six hits, each deliberate:

- **`elevate`**, twice, S-004: both the literal flag `--elevate`. It is on the shared list, which is why this
  file carries `<!-- story-lint: allow "elevate" -->` at the top. The flag is a frozen public identifier, and
  renaming it in prose would send a reader to a switch that does not exist. It is a name.
- **`safe`**, twice, S-022 and S-024: both *"the safe batch"*, the engine's own term `WS_SAFE_BATCH`. The
  Bible bans `safe` as an adjective of reassurance, not as the name of a constant. Four adjectives were
  removed rather than kept - the old question *"Is a weekly Scheduled Task safe?"*, *"almost nothing"* at
  S-020, *"readable in an afternoon"* at S-023 and *"helps a lot"* at S-021.
- **`free`**, twice, S-017 and S-021: both about disk space - *"the disk you are trying to free"*, *"needs
  free space to page"*. The store ban on *free* is a pricing word, and neither page makes a pricing claim of
  any kind.

Nothing matched `clean` or `sweep` as a verb, `simply`, `just`, `easily`, `preview`, a superlative or a
first-person plural. Every fence is ASCII: zero em-dashes, zero exclamation marks, zero *not X but Y*.
Straight quotes throughout.

🔴 **The lint hook's silence is not evidence on this surface.** `posttooluse-story-lint.sh` strips fenced
blocks before it counts anything, and here the fences *are* the shipping copy - so it has read this
commentary and none of the words a reader will ever see. Its silence proves nothing. The sweep above was run
by hand over the fences for that reason. The fact-checker and a human reader are the real gate.

---

## LINE PASS - 2026-09-08

**Fences touched, fifteen plus the mirror:** S-001, S-002, S-004, S-005, S-006, S-007, S-009, S-010, S-012,
S-014, S-015, S-016, S-018, S-020, S-022 - and S-029's `text` for S-014, S-015, S-016 and S-022, because the
payload is derived from those fences and moves with them (re-derived after the edit, 5 of 5 matching; the
S-017 entry is untouched). No command, flag, path, exit code, number, slot heading, slot order or `Was:` line
moved: every backtick span (60), numeric token (61), `--flag` (58) and `%USERPROFILE%` path (3) inside the
fences is identical before and after, compared as multisets. Every fence is still ASCII.

**Rhythm, re-measured.** Scope: every shipping fence except S-013, S-027 and S-029; table rows split cell by
cell with the symptom cell dropped; the bold question lines dropped; sentences split on `.`, `?` or `!`
followed by whitespace; words by `\b[\w'-]+\b`; population standard deviation over the mean, which is the
hook's own arithmetic. **Before: 75 sentences, mean 14.5, burstiness 0.504. After: 80 sentences, mean 13.3,
burstiness 0.545.** Sentences of six words or fewer went from 10 to 15; the eight sentences of 25 or more are
untouched (longest still S-021 at 32). Median 14 both times.

**Budgets over the same 1,067 words.** Hyphens used as dashes: 6 to **2**, both S-017's pair around
*sections 18, 19 and 23*, which is live text this draft did not argue with (S-010 became a semicolon,
S-016 a colon, S-015's pair a parenthesis). "Not X but Y": 0. Three-item lists: five, each an enumeration of
exactly three things rather than a rhythm. Em dashes and exclamation marks: 0.

🔴 **Two facts left exactly as found, for the fact-checker** - a line editor changes rhythm, not facts:

1. **S-023 says `--self-test` runs 151 checks.** It no longer does - the dispatch says 155 and the project
   `CLAUDE.md` for session 11 says 154, so it has moved at least twice with the release cascade and must be
   re-counted at apply time from the self-test's own last line. The 5,393 line count in the same sentence
   moves with the same cascade. The sentence was left untouched so the correction lands on a clean diff. Both numbers are the fact-checker's.
2. **S-017 and its S-029 mirror say *"Every deletion is recorded in the session log."*** For prune-mode
   targets that is an overclaim: `Remove-StaleFiles` writes one line per root, not one per file. Left as found. The same
   claim on the safety page is being corrected there. S-012's *"Every skipped or refused path is in the
   session log"* is the adjacent claim on the other page and should be read with it.

**For the copy editor.** "Disk cleanup" (S-021) and "Real cleanups" (S-024) are nouns, so the glossary's ban
on *clean* as a verb does not catch them; both are live text and were left. "Rebuilds" replaced
"repopulates" in S-020 because *rebuild* is on the fingerprint's use list; revert it if the copy pass prefers
the Windows term. The lint hook strips every fence before it counts, so on this file its verdict is about
this commentary and nothing a reader will see.
