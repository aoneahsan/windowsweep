# docs-help — troubleshooting and the FAQ

<!-- story-lint: allow "elevate" -->

Content-map row **6** · surfaces `docs/troubleshooting.md` and `docs/faq.md` · awareness **stuck, mid-task**
· structure **symptom → cause → the exact command** · tone bands **P, W allowed once per page** · length
**short answers** · CTA **the fixing command** · schema **FAQPage (docs site)**.

A reader here is not evaluating anything. They are stuck. They have a message on screen or a question in
their way, and the useful answer is the shortest one that ends in something they can run. Every fix on both
pages was checked against the string the engine actually prints.

## 🔴 The schema row 6 declares does not exist

`content-map.md` row 6 assigns **FAQPage** to this surface. There is no `FAQPage` block anywhere in the docs
site. `windowsweep-docs/docusaurus.config.ts` carries four JSON-LD scripts - `WebSite`,
`SoftwareSourceCode`, `SoftwareApplication` and `Organization` - and every one of them sits in `headTags`,
which Docusaurus emits on **every page**. So a `FAQPage` block added there would claim that the installation
page and the CLI reference are also FAQs, which is worse than having none.

Making it real needs a page-scoped head tag, and that is a change to the docs site rather than to a draft.
§C below carries the `mainEntity` payload, written from the answers this draft ships, so whoever implements
the mechanism does not have to re-derive the text. Its correctness rests on one rule: **every question and
answer in the block must be visible on the rendered page**, which is why it is generated from §B rather than
composed separately.

| File | Slot range | Count |
|---|---|---|
| §A `docs/troubleshooting.md` | S-001 – S-013 | 13 |
| §B `docs/faq.md` | S-014 – S-028 | 15 |
| §C the `FAQPage` payload (blocked) | S-029 | 1 |
| **Total** | | **29** |

---

## §A `docs/troubleshooting.md`

The whole page is one table. Its Cause and Fix cells are explanation rather than a record of engine
vocabulary, so they are in scope. Nine of the twenty-two rows are already exactly right and are recorded as
kept without a slot of their own; the thirteen below are the ones that change or that carry a fact worth
stating.

### S-001 · troubleshooting.md:3 · NEW · the line above the table
```
Every symptom below is a line windowsweep prints. If yours is not here, the session log under `%USERPROFILE%\.windowsweep\logs\` records every skip and every refusal with its reason, and `windowsweep --report-issue` opens a pre-filled GitHub issue after you confirm.
```
**Was:** (new — the table follows the H1 directly.)

**Change:** added. A troubleshooting page that opens on a table gives a reader nothing when their symptom is
absent, and this one already has the answer at the bottom of the file in a sentence about the log. Moving
that fact above the table and adding the reporting command beside it makes the page work for the reader it
currently fails. `--report-issue` is the right CTA here because it is the only channel and it is opt-in:
`Start-Process` hands the URL to the browser after a confirmation.

### S-002 · troubleshooting.md:6 · the refusal row
```
| `REFUSE (inside protected: ...)` | The path resolves inside a protected folder, sometimes through a junction into your profile | Working as designed, and there is no flag for it. `--list-targets` prints the protected subtrees as the running script sees them |
```
**Was:** Fix: Working as designed. `--list-targets` shows the protected list; nothing bypasses it

**Change:** the Fix cell. "Nothing bypasses it" is right about the protected lists and slightly wider than
what `lib/safety.ps1` guarantees, since `--prune-history` does lift the guard on the tool's own data folder.
`docs-safety` S-006 states that boundary in full. Here the honest short form is that there is no flag for
**this** refusal, which is what the reader is looking at. "Shows the protected list" becomes "prints the
protected subtrees", because that is the part the command prints item by item.

### S-003 · troubleshooting.md:7 · the running-browser row
```
| `Chrome caches - skipped: chrome is running` | The browser or app is open and holds its cache files | Close it and run `windowsweep --only 7 --yes`. The section number is in the message, and the run's next-steps list repeats the whole command |
```
**Was:** Symptom: `skipped: chrome is running`; Fix: Close it and run `windowsweep --only 7 --yes` (the
section number is in the message)

**Change:** the symptom is quoted as it prints. `lib/actions.ps1` line 119 emits the target label first, so a
reader searching this page for the line on their screen was searching for a fragment. The Fix gains the
next-steps fact, which is how a reader with three closed apps finds all three commands without re-running.

### S-004 · troubleshooting.md:8 · the elevation row
```
| `section 12 needs Administrator rights - skipped.` | The console is not elevated | `windowsweep --only 12 --yes --elevate`, or the `system` profile with `--elevate`. That covers 12, 13 and 14; sections 15, 16 and 20 also need `--i-understand-deep` |
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
| `section 11 is deep (irreversible or system-changing): refused in batch mode without --i-understand-deep.` | A deep section (11, 15, 16, 20) was named in `--only` or a profile | Add `--i-understand-deep` with `--yes`, or run it from the menu. Read what the section does first: 11 and 16 cannot be undone |
```
**Was:** Symptom: `refused in batch mode without --i-understand-deep`; Fix: Add `--i-understand-deep` with
`--yes`, or run it from the menu

**Change:** the symptom is quoted in full from `modules/runner.ps1` line 90, and the Fix gains a sentence.
This is the only row on the page whose fix hands a reader a permanent deletion, and a troubleshooting table
that answers "how do I make the refusal go away" without saying what the refusal was for is answering the
wrong question. Two of the four deep sections have no undo of any kind, which is one clause and is the whole
point of the gate.

### S-006 · troubleshooting.md:11 · the interactive-section row
```
| `section 17 is interactive-only: it needs a person at the keyboard, or a selection passed with --select / --select-file.` | Personal and project sections never run unattended | Run `windowsweep --only 17` from a console, or supply the choice in advance: `--dry-run --json` lists the candidates, then `--select-file picks.txt` acts on them |
```
**Was:** Symptom: `section 17 is interactive-only`; Fix: Run `windowsweep --only 17` from a console;
`--dry-run` lists candidates

**Change:** the message is quoted whole, and the Fix gains the answer the message itself offers. The engine's
line names `--select` and `--select-file`; the page's fix did not, so a reader scripting a run was sent back
to a console they may not have. The two-step form is what `AI-INTEGRATION-GUIDE.md` recommends and it fits in
a cell.

### S-007 · troubleshooting.md:12 · the estimate row
```
| Reclaimed less than the dry-run estimated | Files were created or locked between the two runs, or an app started in between | Re-run, and compare the log's `skip (locked)` lines. An estimate is what was there when the rehearsal ran, never a promise about the next run |
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
| An editor extension folder was removed | The editor's `extensions.json` no longer referenced it (uninstalled or superseded) | Reinstall the extension from the editor. The tool never removes a folder that file still references, so a live extension is not what went |
```
**Was:** Fix: Reinstall the extension from the editor; the tool never removes a referenced folder

**Change:** the clause becomes a sentence. It now rules something out. "Never removes a referenced folder"
is correct and reads as a general policy; the reader here wants to know whether the thing they are missing
was live, and the answer is that it was not.

### S-010 · troubleshooting.md:18 · the kept-version row
```
| Cypress or Playwright kept a version I expected to go | One file inside it was touched within the window, or it is the newest of its kind | Lower `--days`, or remove the version by hand. The newest build of each family is kept whenever the idle gate is running - `--purge-all` is what removes it |
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
Every skipped or refused path is in the session log at `%USERPROFILE%\.windowsweep\logs\` with its reason. The log is a record of what happened, not a way to undo it.
```
**Was:** Every skipped or refused path is in the session log at `~\.windowsweep\logs\` with its reason.

**Change:** the path notation, and the second sentence that `docs-safety` S-025 and `docs-reference` S-066
also carry. A reader who arrives at a troubleshooting page because something is missing will read "every path
is in the log" as a lead, and the honest answer belongs in the same place as the offer.

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

Twelve questions today, one of which is missing. `content-map.md` assigns question 2 of the question map -
how to delete `node_modules` from old projects - to surfaces 5 and 6, and this page does not answer it.
S-016 adds it.

### S-014 · faq.md:3-6 · will it delete my files
```
**Will it delete my code, documents or photos?**
No. Documents, Pictures, Desktop, Music, Videos and cloud-sync folders are protected subtrees the chokepoint refuses outright, and no flag changes that. The only project-adjacent target is section 17, which lists build artefacts (`node_modules`, `dist`, ...) in idle projects and removes nothing you did not select.
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
No. Self-test check [9] greps every source file for seven call shapes - `Invoke-WebRequest`, `Invoke-RestMethod`, `Net.WebClient`, `HttpClient`, `Sockets.TcpClient`, `curl.exe` and `wget` - and fails the run if it finds one. `--report-issue` opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself.
```
**Was:** No. The source contains no HTTP or socket call; the self-test greps for them. `--report-issue`
opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself.

**Change:** the mechanism is named. "The self-test greps for them" asks the reader to take the grep on trust;
listing the seven needles lets them run the same search themselves in one command. They are the literal
strings in `modules/release_helpers.ps1` line 224, reassembled there from fragments so the check does not
match its own source.

### S-016 · faq.md:11 · NEW · deleting node_modules
```
**How do I delete `node_modules` from old projects?**
Section 17. It lists build artefacts in projects you have not touched for 100 days and removes only the ones you select. It never scans a whole drive - it looks in your project roots, which it auto-detects or which you name with `--scan-roots "P1;P2"`. Run `windowsweep --only 17` from a console, or `--only 17 --dry-run --json` to see the list without a prompt.
```
**Was:** (new.)

**Change:** added, because the content map assigns this question to this surface and the page did not carry
it. The first two sentences reproduce the map's answer-first text near enough verbatim. The third is the
refusal that makes the answer trustworthy, and it is the fear the question carries. The fourth is the CTA row
6 asks for, in two forms, because a reader who searched this question may be on a machine without an
interactive console.

### S-017 · faq.md:12-14 · why is there no undo
```
**Why is there no undo?**
Caches regenerate; an undo copy would consume the disk you are trying to free. Personal files - sections 18, 19 and 23 - go to the Recycle Bin instead, which is Windows' undo. Every deletion is recorded in the session log, which is a record rather than a restore.
```
**Was:** Caches regenerate; an undo copy would consume the disk you are trying to free. Personal files
(sections 18 and 19) go to the Recycle Bin instead, which is Windows' undo. Every deletion is recorded in the
session log.

**Change:** **section 23 was missing**, which is the same defect `docs-safety` S-015 corrects in the tier
table and the same one the README carried this morning about section 23 being an audit. Its catalogue tier is
`recycle` and what a reader picks goes to the Recycle Bin, so an answer listing every section that does that
had to name it. The log clause also gains four words, matching S-012 above.

### S-018 · faq.md:16-19 · why keep 100 days
```
**Why does it keep files used in the last 100 days?**
Because a developer's caches are what make the next install or build fast. The idle gate keeps recent work; `--days`, `--purge-all` and answering the developer question with no are the knobs when you want more. See [Developer mode](./developer-mode.md).
```
**Was:** ... `--days`, `--purge-all` and developer mode off are the knobs when you want more.

**Change:** "developer mode off" becomes "answering the developer question with no", which is what the reader
does rather than a state they must find. The glossary calls it the developer answer for this reason.

### S-019 · faq.md:21-22 · why is Chrome skipped
```
**Why is Chrome skipped?**
An open browser keeps its cache files locked and half-written. Close it and run `windowsweep --only 7 --yes`.
```
**Was:** identical.

**Change:** none. Two sentences: a cause and a command. It is the model the rest of this page follows.

### S-020 · faq.md:24-26 · why never Prefetch
```
**Why never Prefetch?**
Windows uses Prefetch to start programs faster and repopulates it if cleared, so clearing it makes the machine slower for a while and frees little. It is a protected subtree, so no flag reaches it.
```
**Was:** Windows uses Prefetch to start programs faster and repopulates it if cleared, so clearing it makes
the machine slower for a while and frees almost nothing.

**Change:** two edits. "Almost nothing" becomes "little", because the first is a quantity claim with no
measurement behind it and the second is a plain judgement. And the second sentence is added: `$SR\Prefetch`
is in the subtree list at `lib/safety.ps1` line 40, so the answer to "why never" is a refusal rather than a
preference, which is the stronger and the truer answer.

### S-021 · faq.md:28-30 · will freeing space make it faster
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

### S-022 · faq.md:32-35 · is a weekly task safe
```
**What does the weekly Scheduled Task actually run?**
`--install-task` registers `--all --yes --quiet --no-color --notify`, weekly on Sundays at 03:00, as your user: the safe batch only, no admin sections, no personal files, no deep sections. It catches up if the PC was off, and it stops itself after three hours. Review the first run's report before scheduling. Install globally first (`npm install -g windowsweep`); from `npx` the installer refuses, because the task would point at a cache npm evicts.
```
**Was:** **Is a weekly Scheduled Task safe?** / `--install-task` schedules `--all --yes`: the safe batch only,
under your account, no admin sections, no personal files, no deep sections. Review the first run's report
before scheduling. Install globally first (`npm install -g windowsweep`); from `npx` the installer refuses
because that cache is evicted.

**Change:** the question and the answer both. "Is it safe?" invites the adjective the voice replaces. The
question a reader actually has is what the task will do at three in the morning. The answer now names the
whole action line from `modules/release_helpers.ps1` line 347. It includes `--notify`, so the task tells the
reader it ran. No page mentioned it. Two settings come from line 354: `-StartWhenAvailable` is the catch-up;
the three-hour `ExecutionTimeLimit` is the stop. The npx clause gains its mechanism, matching `docs-start`
S-003.

### S-023 · faq.md:37-39 · why PowerShell
```
**Why PowerShell rather than an .exe?**
Every Windows machine has PowerShell 5.1, so there is no runtime to install and no binary to trust. The engine is 5,393 lines of readable script across `windowsweep.ps1`, `lib/` and `modules/`, and `--self-test` runs 151 checks of it on your machine.
```
**Was:** Every Windows machine has PowerShell 5.1, so there is no runtime to install and no binary to trust.
The source is readable in an afternoon and the self-test runs on your machine.

**Change:** "readable in an afternoon" becomes the line count. It is the fingerprint's own listed tell -
an adjective standing in for a number - and it is the one claim on the page a reader could disprove by
opening the folder. 5,393 lines is the sum of `windowsweep.ps1`, `lib/*.ps1` and `modules/*.ps1` on this
tree, and the number invites the reader to judge for themselves rather than being told the answer. The 151 is
the self-test's own count, printed at the end of every run.

### S-024 · faq.md:41-44 · Windows Server
```
**Does it run on Windows Server?**
The engine uses nothing newer than Windows 10 1809 / Server 2019. CI runs the self-test and a dry-run of the safe batch on GitHub's `windows-latest` Server image, on every push to `main` and on every pull request. Real cleanups have been verified on Windows 10 so far; a Windows 11 run is on the verification list.
```
**Was:** ... CI runs the self-test and a dry-run of the safe batch on Windows Server (GitHub's
`windows-latest`) on every push. ...

**Change:** "on every push" is not what the workflow says. `.github/workflows/ci.yml` triggers on
`push: branches: [main]` and on `pull_request`, so a push to any other branch runs nothing. The corrected
form is longer by five words and is the difference between a verifiable claim and one a reader could check
and find wrong. The last sentence is unchanged and is the most valuable one in the answer, because it says
what has **not** been verified.

### S-025 · faq.md:46-47 · where are the logs
```
**Where are the logs?**
`%USERPROFILE%\.windowsweep\logs\`. Reports are beside them; `windowsweep --reports` browses them, and `--stats` prints the run history and the total reclaimed.
```
**Was:** `%USERPROFILE%\.windowsweep\logs\`. Reports are beside them; `windowsweep --reports` browses them.

**Change:** `--stats` is added. A reader asking where the logs are is usually asking what the tool has done
so far, and `--stats` answers that in one command rather than by reading files. It is in the mode table on
the CLI reference and appears nowhere a stuck reader would look.

### S-026 · faq.md:48 · NEW · the closing pointer
```
Not here? [Troubleshooting](./troubleshooting.md) is symptom by symptom, and the [safety model](./safety-model.md) covers every guard in full.
```
**Was:** (new — the page ends on the logs answer.)

**Change:** added. Both links discharge the internal-link floor, which asks every indexed page to reach the
safety model and one reference page, and neither was present on this page. Two words then two links, which is
as short as the row's "short answers" allows a navigational line to be.

### S-027 · faq.md:49 · the footer
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

### S-029 · `windowsweep-docs` · a page-scoped head tag on `faq.md` · BLOCKED
```
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Will it delete my code, documents or photos?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Documents, Pictures, Desktop, Music, Videos and cloud-sync folders are protected subtrees the chokepoint refuses outright, and no flag changes that. The only project-adjacent target is section 17, which lists build artefacts in idle projects and removes nothing you did not select." } },
    { "@type": "Question", "name": "Does it phone home?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Self-test check 9 greps every source file for seven call shapes and fails the run if it finds one. --report-issue opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself." } },
    { "@type": "Question", "name": "How do I delete node_modules from old projects?",
      "acceptedAnswer": { "@type": "Answer", "text": "Section 17. It lists build artefacts in projects you have not touched for 100 days and removes only the ones you select. It never scans a whole drive - it looks in your project roots, which it auto-detects or which you name with --scan-roots." } },
    { "@type": "Question", "name": "Why is there no undo?",
      "acceptedAnswer": { "@type": "Answer", "text": "Caches regenerate; an undo copy would consume the disk you are trying to free. Personal files - sections 18, 19 and 23 - go to the Recycle Bin instead, which is Windows' undo. Every deletion is recorded in the session log, which is a record rather than a restore." } },
    { "@type": "Question", "name": "What does the weekly Scheduled Task actually run?",
      "acceptedAnswer": { "@type": "Answer", "text": "--install-task registers --all --yes --quiet --no-color --notify, weekly on Sundays at 03:00, as your user: the safe batch only, no admin sections, no personal files, no deep sections. It catches up if the PC was off, and it stops itself after three hours." } }
  ]
}
```
**Was:** (nothing — there is no FAQPage block on the site.)

**Change:** written, and **not deliverable from this draft**. Two things block it. The mechanism is missing:
every JSON-LD block on the site is a global `headTags` entry, so this needs a page-scoped head tag, which is
a docs-site code change outside this draft's scope. And the site is unreachable in any case -
`windowsweep-docs.aoneahsan.com` returns 000, as `site-front.md` records.

Five questions rather than twelve, on purpose. Google's own guidance is that every question and answer in a
`FAQPage` block must be visible on the page, and a block repeating all twelve doubles the page's weight for
no gain. These five are the ones the question map assigns to this surface or names as the audience's real
queries. Each `text` value is the rendered answer with its markdown removed, which is the rule that keeps the
block honest: if an answer changes above, this block changes in the same edit or it becomes a claim the page
does not make.

---

## SELF-CHECK

**Palette.** P throughout. That is what a stuck reader needs, and every changed cell ends either in
something runnable or in the one fact that decides whether to run it. R appears where a fix could be read as a workaround: S-002
(no flag for this refusal), S-005 (two of the four have no undo), S-011 (nothing is sent), S-014 (no flag
changes that), S-020 (a protected subtree, not a preference). W is unspent on both pages, deliberately. S-028
records why.

**Rhythm.** Shortest shipping sentence: *"Section 17."* (two words, S-016) and *"Mostly no."* at two (S-021).
Longest: the Scheduled Task answer's first sentence at 38 words. Table cells run short by construction, which
suits the row.

**Length.** Row 6 asks for short answers. `troubleshooting.md` measures 545 words today and lands near 700,
almost all of it inside cells; `faq.md` measures 429 and lands near 560 with one new question and one new
pointer. The longest single answer is S-022, at 92 words. That is the ceiling. It belongs to the only answer on
either page describing something that runs at three in the morning with nobody watching, which is the one
place on this surface where completeness beats brevity.

**Unsure spots.** One, and it is structural rather than textual: S-029's payload cannot ship until the docs
site gains a page-scoped head tag, so row 6's declared schema stays unmet after this draft.

**Banned-phrase sweep.** Run with a script over the fenced shipping strings only, 1,441 words of them,
against the shared list plus this project's own bans. Three hits, all the same word and all deliberate:
**`safe`** in "the safe batch" at S-022 and S-024, which is the engine's frozen term `WS_SAFE_BATCH`. Four
were removed rather than kept: the adjective in the old question "Is a weekly Scheduled Task safe?" at
S-022; "almost nothing" at S-020; "readable in an afternoon" at S-023; "helps a lot" at S-021. Nothing
matched `clean` or `sweep` as a verb, `just`, `simply`, `easily`, `preview`, a superlative or a
first-person plural.
