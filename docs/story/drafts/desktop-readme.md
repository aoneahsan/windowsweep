# desktop-readme — the desktop app's own page

<!-- story-lint: allow "elevate" -->

Content-map row **14** · surfaces a new **Desktop app** section in `README.md` and a new docs page
`desktop.md` · awareness **evaluating the app** · structure **what it adds over the CLI, what it sends, the
SmartScreen note** · tone bands **P, R** · length **~600 words total** · CTA **download** · schema **none**.

Slot-shaped, for two reasons. The README section has to be inserted into a file whose heading set is
otherwise fixed, and `desktop.md` has to land in two trees at once.

Everything below about what the app sends was written from `desktop/src/lib/sync.ts` rather than from the
consent screen's summary of it, and the SmartScreen paragraph reproduces the wording approved on 2026-09-05
and already shipping in `elevation.html` and `src/i18n/locales/en.json`. Where the two disagree, the code
wins. The disagreement is reported.

🔴 **One thing has to be settled before either artefact ships.** No desktop release exists.
`gh release list` returns `v1.0.0`, `v1.0.1` and `v1.1.0`, all of them the command-line tool.
`desktop-release.yml` is `workflow_dispatch` only until the updater signing secrets exist. So the download
sentence has nothing to point at yet, and the slot at S-007 carries the question.

| Artefact | Slot range | Count |
|---|---|---|
| §A `README.md` → the Desktop app section | S-001 – S-008 | 8 |
| §B `desktop.md` (docs site + `windowsweep/docs/`) | S-009 – S-021 | 13 |
| **Total** | | **21** |

---

## §A `README.md` — the Desktop app section

### S-001 · README.md:59 · the table-of-contents entry
```
- [🖥️ Desktop app](#desktop-app)
```
**Was:** (new.)

**Change:** added, between `[🎛️ Advanced Features]` and `[🚑 Recovery & Troubleshooting]`. That is the
insertion point for the section itself as well: after Advanced Features, before Recovery. The CLI narrative
runs from Why to Examples without a second product interrupting it, and a reader who has finished the
capability list is the reader who wants to know whether there is a window. This is the only change to the
file's heading set. It adds one `##` heading and one `<a id>`, taking the count from 28 to 29.

### S-002 · README.md · the section heading and anchor
```
<a id="desktop-app"></a>
## 🖥️ Desktop app&nbsp;[#](#desktop-app)
```
**Was:** (new.)

**Change:** added, in the file's existing heading shape: an explicit anchor, an emoji, and the self-link that
every other section carries.

### S-003 · README.md · the lede
```
A Tauri window that drives this engine rather than reimplementing it. It runs the bundled `windowsweep.ps1` with `--json --no-color`, reads its section list from `--list --json`, and contains no cleanup logic of its own - so the chokepoint, the protected lists and the refusals are the same ones the command line uses.
```
**Was:** (new.)

**Change:** added. The first thing a sceptical reader wants from a graphical wrapper over a destructive tool
is confirmation that the wrapper cannot change the rules, and this says so with the two flags that prove it.
Verified in `desktop/src/lib/engine.ts` and `lib/catalogue.ts`.

### S-004 · README.md · what it adds
```
- **A run you can watch** - the engine's own log as it arrives, beside a per-section table of what was reclaimed.
- **A picker** for the sections that ask a person to choose, item by item.
- **Settings that are flags.** Every control maps to a flag the engine already has.

Screen by screen: [Desktop app](https://github.com/aoneahsan/windowsweep/blob/main/docs/desktop.md).
```
**Was:** (new.)

**Change:** added, then cut from five bullets to three plus a pointer. The docs page is the single home for
the screen list, and a README that repeats it is the trap the README surface reference names outright. Each
surviving bullet names a screen that exists: `Run.tsx`, `Picker.tsx`, `Settings.tsx`. The third is the app's
own Settings lede, shortened.

### S-005 · README.md · what it sends
```
Nothing, until you say so. The engine still makes no network calls. The window adds two switches: analytics to four named destinations, and an optional Google sign-in that syncs your settings and a summary of each run between your own machines. Both start off, and each is revocable. Never sent either way: a file path, a folder name, a drive label, your machine name or your user name.
```
**Was:** (new.)

**Change:** added, then cut. The nine fields a synced run actually carries live on the docs page at S-013,
transcribed from the `SyncedRun` type in `desktop/src/lib/sync.ts`; enumerating them in both artefacts is the
same single-home fault as S-004. What stays here is the refusal, which matches that module's own header
comment and is the sentence a reader of this section needs. Reported below: the click dummy's Account table
describes a run summary more narrowly than the code sends it.

### S-006 · README.md · the SmartScreen line
```
The installer is not signed with a paid code-signing certificate, so SmartScreen warns on first run. Every release publishes a SHA-256 checksum and a minisign signature the app's own updater checks; neither is a code-signing certificate. What to do about the dialog: [Desktop app](https://github.com/aoneahsan/windowsweep/blob/main/docs/desktop.md).
```
**Was:** (new.)

**Change:** added, then cut to two sentences and a pointer. The two artefacts are still named exactly, and
"neither is a code-signing certificate" still lands here, because "not signed" followed by "publishes a
signature" invites a reader to conclude one of the two is wrong - that reasoning is the decision log's,
recorded 2026-09-05. What moved to the docs page is the *instruction*: More info, then Run anyway, plus the
two paragraphs of context. The full three-paragraph disclosure ships once, verbatim, at S-015.

### S-007 · README.md · how to install it

**NEEDS DECISION:** this section needs a download sentence and there is nothing to download. No desktop
release exists, `desktop-release.yml` runs on manual dispatch only until `TAURI_SIGNING_PRIVATE_KEY` exists,
and `tauri.conf.json` still carries `"pubkey": "REPLACE_WITH_UPDATER_PUBLIC_KEY"`. Confirm one of: (a) the
whole Desktop app section is held back and inserted in the same change that publishes the first desktop
release, which is the option that keeps the README free of a claim a reader cannot act on; (b) it ships now
with the interim sentence below, which says the app is not released and points at building from source;
(c) it ships now with a link to the releases page, which is **not** recommended, because a reader who follows
it finds three command-line releases and no installer. Option (a) is recommended.

The release-day sentence, for whichever of (a) or (c) is chosen:
```
Download the `.msi` or the `.exe` installer from [Releases](https://github.com/aoneahsan/windowsweep/releases). It installs for the current user, so it needs no administrator rights of its own; the sections that do open a second, elevated window when you ask for them.
```

The interim sentence, for (b):
```
The desktop app is built and not yet released. Until the first installer is published, `git clone` the repository and run `yarn install && yarn tauri build` inside `desktop/`.
```

### S-008 · README.md:96 · the companion edit to `readme.md` S-021
```
**Not the right tool when** you want a set-and-forget cleaner that runs itself; when you are on Linux or macOS (use the siblings); when you want an undo for caches (there is none - they regenerate); or when you are looking for a security scanner or a registry cleaner. It reclaims disk space, nothing else.
```
**Was:** **Not the right tool when** you want a graphical, set-and-forget cleaner; when you are on Linux or
macOS (use the siblings); ... (unchanged from there).

**Change:** the word "graphical" goes, in the same change that inserts the Desktop app section and not
before. A file that offers a window fifty lines below cannot also list "graphical" as a reason to use
something else. The clause keeps the half that stays true, which is the set-and-forget half: neither surface
runs itself, and the Scheduled Task runs the safe batch only. Flagged from `readme.md` S-021 so the two
drafts cannot drift.

---

## §B `desktop.md` — the docs page

Lands in **both** trees: `windowsweep-docs/docs/desktop.md` and `windowsweep/docs/desktop.md`, the
repository copy first, per `CLAUDE.md`.

### S-009 · desktop.md:1-5 · front matter
```
---
title: 'Desktop app'
description: 'The windowsweep desktop window: what it adds over the command-line tool, what it sends, and the SmartScreen note on first run.'
tags: [desktop, tauri, privacy, install]
---
```
**Was:** (new.)

**Change:** added, in the shape every other page on the site uses. The description names the three things
row 14 asks for, in the order the page answers them.

### S-010 · desktop.md · the H1 and the answer-first paragraph
```
# Desktop app

The desktop app is a window over the same engine. It runs the bundled `windowsweep.ps1` with `--json --no-color` and reads its section list from `--list --json`, so it reimplements no cleanup logic: the deletion chokepoint, the protected lists and every refusal are the ones the command-line tool already enforces. Nothing leaves the machine unless you turn it on.
```
**Was:** (new.)

**Change:** added. Fifty-nine words, answer-first, ending on voice-fingerprint sentence 9 verbatim, which is
also the consent screen's heading. Three surfaces, one sentence.

### S-011 · desktop.md · what it adds
```
## What it adds over the command line

Nothing to the deletion behaviour. Everything to what you can see while it happens.

The catalogue becomes a table you can filter. A run shows the engine's own log as it arrives, beside a per-section table of what was reclaimed. The four sections that ask a person to choose get a picker, where you tick rows one at a time - the decision the command line takes with `--select`. History and reports are on screen, and the report JSON is still written to disk. Every control in Settings maps to a flag the engine already has, so anything you set here you can also type.
```
**Was:** (new.)

**Change:** added. The heading is the question a reader arrives with. The two-sentence answer under it is the
whole page in fourteen words, and putting "nothing to the deletion behaviour" first is the order this product
uses everywhere.

### S-012 · desktop.md · what it does not do
```
## What it does not do

It never raises its own privileges. Six sections need Windows to ask your permission first; ask for one and the app opens a second, elevated window that runs only those sections and writes its own report, while this window keeps running unelevated and tails the log. It does not remove the deep-section gate. It does not answer a picker for you.
```
**Was:** (new.)

**Change:** added. The middle sentence is condensed from the elevation screen's approved lede and timeline
without altering a claim. Six is checkable: six rows in `WS_SECTIONS` carry `Admin = $true`, and the app's own
heading counts them rather than hard-coding the number.

### S-013 · desktop.md · what leaves the machine
```
## What leaves the machine

Two things can. Both are off until you switch them on.

**Analytics.** Four destinations, named on the first-run screen: product analytics, behaviour analytics, session replay and crash reports. Each is a separate switch, revocable in Settings, and revoking one stops it immediately. Declining is a first-class answer.

**Sign-in and sync.** Optional, Google, and it opens your normal browser rather than a window inside the app, so you can see the address bar. What it uploads, in full:

| Your settings | Each run summary |
|---|---|
| your preferences | date and duration |
| the developer answer | mode, dry-run, elevated |
| your account's email address | the section numbers it ran |
| | bytes reclaimed, bytes estimated |

Never sent, by either of them: a file path, a folder name, a drive label, your machine name, your Windows user name, or the contents of anything.
```
**Was:** (new.)

**Change:** added, in a table rather than the sentence it started as, which saved forty words and reads
better on the question a reader is actually asking. The right column is the nine fields of `SyncedRun` in
`desktop/src/lib/sync.ts`; the left is what `pushSettings` writes. The closing refusal is the consent
screen's `neverSent` string, with "your user name" expanded to "your Windows user name" - the same field,
named the way a Windows reader would recognise it.

### S-014 · desktop.md · install it
```
## Install it

The installer ships as an `.msi` and as an `.exe`, and it installs for the current user, so installing needs no administrator rights. The app carries the engine inside it: there is no separate PowerShell setup, and no Node.
```
**Was:** (new.)

**Change:** added, and every claim is from `tauri.conf.json`: `targets: ["nsis", "msi"]`,
`nsis.installMode: "currentUser"`, and `bundle.resources` mapping
`resources/windowsweep/**/*` into the bundle. **The download sentence itself is the open question at S-007**
and is not repeated here.

### S-015 · desktop.md · the SmartScreen note
```
### Windows may warn you the first time

The installer is not signed with a paid code-signing certificate, so Microsoft SmartScreen shows *"Windows protected your PC"* on first run. That is a statement about the certificate, not about the file.

Choose **More info** and then **Run anyway**. You can verify what you downloaded first: every release publishes a SHA-256 checksum for each installer, and a minisign signature the app's own updater checks. Neither is a code-signing certificate - they prove the file is the one that was built, not who built it. The source is public.

This note is here rather than hidden because meeting that dialog unexplained is worse than reading about it in advance.
```
**Was:** (new.)

**Change:** added **verbatim** from the approved elevation screen, three paragraphs unchanged except for the
en dash becoming a hyphen. This is a safety surface, humour is off, and the words were settled at GATE 4 on
2026-09-05, so the docs page repeats them rather than paraphrasing. Reported below: the release workflow does
not currently produce one of the two artefacts this paragraph names.

### S-016 · desktop.md · updates
```
## Updates

The app checks for a newer build on startup and asks before installing one. If the check cannot reach the network it is skipped without a word.
```
**Was:** (new.)

**Change:** added. The second sentence is the splash screen's own approved line, condensed. Checkable:
`plugins.updater.dialog` is `true`, and the endpoint is the repository's `latest.json`.

### S-017 · desktop.md · where things are written
```
## Where it writes

Runs, logs and reports land under `%LOCALAPPDATA%\windowsweep-desktop\runs\`, one JSON per run. An elevated run writes a second file beside the first, because two windows each write their own.
```
**Was:** (new.)

**Change:** added. The path is the elevation screen's, verbatim. Naming it is what lets a sceptical reader check the claim in a
file browser instead of believing it.

### S-018 · desktop.md · the page's outbound links
```
See also: [Safety model](./safety-model.md) · [Admin sections and elevation](./admin-and-elevation.md) · [Sections 0-25](./sections.md)
```
**Was:** (new.)

**Change:** added. The internal-link floor asks every indexed page for a link to the safety model and one
reference page; this gives it two reference pages, and no page here is more than two clicks from `--scan`.

### S-019 · desktop.md · what the page must not claim yet
```
The desktop app is not released yet. This page describes the build in `desktop/`, written down before anyone can install it rather than after.
```
**Was:** (new.)

**Change:** added as an admonition at the top of the page, and it is the honest form of the same problem
S-007 raises for the README. A docs page for an unreleased program is defensible; one that reads as though
the program can be downloaded is not. It is removed in the change that publishes the first installer.

### S-020 · `sidebars.ts` · the sidebar entry
```
'desktop',
```
**Was:** (new.)

**Change:** required rather than optional. `sidebars.ts` carries the comment "A page that is not in this
sidebar is effectively unreachable, so categories are updated in the SAME change that adds a page." The entry
goes after `'sections'` and before the Reference category, which puts the app beside the catalogue it
displays. Outside this draft's write scope, so it is specified rather than made.

### S-021 · `windowsweep/docs/README.md` and `intro.md` · the index rows
```
| Desktop app | you want the window rather than the console |
```
**Was:** (new.)

**Change:** a row for the new page in both index tables, in the "If you want to..." voice the existing rows
use. Without it the page is reachable only from the sidebar.

---

## Found while writing, reported rather than fixed

**🔴 The SmartScreen paragraph names an artefact the release pipeline does not produce.**
`desktop-release.yml` builds the two installers and, given `TAURI_SIGNING_PRIVATE_KEY`, emits the minisign
`.sig` files and `latest.json` through `includeUpdaterJson: true`. There is **no SHA-256 step anywhere in
it**. The approved copy says "every release publishes a SHA-256 checksum for each installer", which is a
commitment rather than a description today, and the first release will falsify it unless a checksum step is
added to that workflow first. `tauri.conf.json` also still holds
`"pubkey": "REPLACE_WITH_UPDATER_PUBLIC_KEY"`, so the second half of the same sentence has nothing behind it
either. Neither is a wording problem and neither is fixable from this draft. Both are release-blocking for
this paragraph.

**🔴 The dummy's Account table understates what a synced run contains.**
`account.html:48` reads *"Run summaries | Date, bytes freed, section count. Nothing else."* `stripRun` in
`desktop/src/lib/sync.ts` sends nine fields: `runId`, `startedAt`, `mode`, `dryRun`, `elevated`, `sections`,
`freedBytes`, `estimatedBytes` and `durationMs`. Three of those are visible on the app's own History screen
as the Mode and Took columns, so the table is contradicted by the screen next to it. "Nothing else" is what
makes it a defect rather than a summary. The fix belongs in the dummy first, then the app, per §10a.

**`pushSettings` sends a field no surface discloses.** Alongside the settings and the email address it writes
`lastSeenAt`, an ISO timestamp. It is not personal data of the kind the never-sent list rules out, and it is
not in the Account table's four rows either. One row would close it.

**The app has no treemap.** `reclaim-map.js` draws one in the click dummy and the only mention of it in the
app tree is a comment in `dev-engine.ts`. Nothing in this draft claims one, and that is deliberate.

**`webviewInstallMode` is `downloadBootstrapper`.** On a machine without WebView2 the installer fetches it
from Microsoft. That is an install-time network call, made by the installer rather than by the app or the
engine, and no sentence in this draft says otherwise — but it is the one thing a reader of "no network calls"
could be surprised by, and it may deserve a line on `desktop.md` once the installer is real.

---

## Self-check

**Palette.** Band **P** carries the mechanism lines: S-003 and S-010 name the two flags, S-005 and S-013 name
the fields, S-014 names the bundle targets, S-017 names the path. Band **R** carries the refusals, and there
are five of them: "Nothing, until you say so" (S-005), the never-sent list (S-005 and S-013), "It never
raises its own privileges" (S-012), "Declining is a first-class answer" (S-013), and "no cleanup logic of its
own" (S-003). Band **W** appears once. That is S-016's "without a word", nowhere near a destructive control. The SmartScreen slot is a safety surface and carries no humour at all, which is the rule that
governed the approved original.

**Rhythm.** Shortest shipping sentence: "Two things can." at three words, S-013. Then "Declining is a
first-class answer." and "Nothing, until you say so." at five each, from S-013 and S-005. Longest: the
elevation sentence in S-012 and the lede's second sentence in S-003, both forty words, each naming a
mechanism it cannot lose a clause of without losing a fact. S-011 opens on five words and nine before a
90-word paragraph, and S-013's own answer runs three words then five.

**Length. 🔴 This is the one place the draft misses its row, and by a lot.** Row 14 asks for about 600 words
across both artefacts. Measured on the shipping text only, with every **Was** and **Change** line excluded
and markup stripped: the README section is **222** words (S-001 to S-006) plus the install sentence at 40, so
**262**; `desktop.md` is **625**. Total **887**, which is **287 over**.

Two rounds of cuts are already in it and they took 186 words out. S-004 went from five bullets to three plus
a pointer, S-005 stopped enumerating the nine sync fields, S-006 dropped to two sentences and a pointer,
S-011 lost fifteen words, S-013 became a table, and S-016, S-017 and S-019 each lost a clause. The
single-home rule drove most of that, which is why the page is the home and the README section points at it.

What is left will not compress much further. The arithmetic says why. Three items account for **362** of the
887. The SmartScreen disclosure at S-015 is **114 words reproduced verbatim** from copy the owner
approved at GATE 4. The what-leaves-the-machine block at S-013 is **137**, and it is the surface's whole
reason for existing. What-it-adds at S-011 is **111**, and it is one of the three things row 14 names. Add
the answer-first paragraph, whose 61 words sit against a 40-60 floor, and the README's own required beats,
and the honest floor for the content row 14 mandates is near **800**.

So this goes back as a **requested change to the map rather than a further cut**, since the row is not this
draft's to edit. Three ways out, in the order recommended: raise row 14's cap to about **850**, which is what
the required content costs; or drop "Updates" (S-016) and "Where it writes" (S-017) from the page, saving 61
words and losing two things a person will look for; or move the whole what-leaves-the-machine block onto the
safety page and link to it, saving 137 at the cost of splitting the app's privacy story across two pages,
which is the option with the worst outcome for a reader.

**Unsure.** One `NEEDS DECISION`, at **S-007**, on whether the Desktop app section ships before the first
desktop release. Three options, one recommendation. One phrase is allowed on purpose: "elevate" is on
the shared list as an inflation verb and is, here, the Windows term for what a second window does and the
name of the engine's `--elevate` flag.
