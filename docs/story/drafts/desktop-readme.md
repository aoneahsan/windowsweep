# desktop-readme — the desktop app's own page

Content-map row **14** · surfaces a new **Desktop app** section in `README.md` and a new docs page
`desktop.md` · awareness **evaluating the app** · structure **what it adds over the CLI, what it sends, the
SmartScreen note** · tone bands **P, R** · length **~900 words total** (raised from ~600 on 2026-09-07) ·
CTA **download** · schema **none**.

**Revision round, 2026-09-07.** Three developmental findings are applied, seven contradictions are closed,
and one line-editor note is fixed. An owner decision landed between the two rounds and rewrote this
surface's central beat, so the round-1 thesis is not patched here. It is replaced.

**Line edit, 2026-09-07.** Five slots touched at sentence level - S-010, S-011, S-012, S-013 and S-016 - and
the self-check's numbers brought into line with them. No fact, heading or slot moved. Word-neutral at 913.

Slot-shaped, for two reasons. The README section has to be inserted into a file whose heading set is
otherwise fixed, and `desktop.md` has to land in two trees at once.

## What changed under this draft, and where its facts come from

The switches are gone. The owner removed the analytics opt-out - *"do not give user option to turn off any
of those analytics or anything… just mention we use that to improve the product, with no option to opt
out"* - and the click dummy was amended the same day, so the dummy's words are the specification for
everything below about collection. `consent.html` is now a notice with a single **Continue**. Home's ledger
states the four destinations as facts with an `on` badge, and the `Never sent` list survived on purpose,
because band R delivers reassurance as a specific refusal rather than as an adjective. Nothing here
re-litigates that.

Everything about behaviour was read from the code rather than from a screen's summary of it: `sync.ts` for
what a synced row carries, `analytics.ts` and `config.ts` for what this build can send, `engine.rs` for the
flags and the run folder, `tauri.conf.json` and the built MSI's own Property table for what the two
installers do. Where the app's `en.json` and the dummy disagree, the dummy wins and the divergence is
reported. Where either disagrees with the code, the code wins.

**The download CTA is real, with one ordering condition.** Round 1 carried a `NEEDS DECISION` because there
was nothing to download; that is answered, and the section ships with the download line. The condition is
the one the recommended option already named: **this section and this page land in the same change that
publishes `desktop-v1.1.0`.** The tag comes first. Measured today, `git tag --list` returns `v1.0.0`,
`v1.0.1` and `v1.1.0`, while `gh release list` returns their three releases and no drafts - so the desktop
tag does not exist yet. The workflow behind it does. `desktop-release.yml` fires on a `desktop-v*` tag, the
updater public key in `tauri.conf.json` is a real minisign key rather than the old placeholder, and its last
two steps refuse to leave behind a release missing any of the six artefacts: both installers, both `.sig`
files, `latest.json` and `SHA256SUMS.txt`. Applying the copy before the tag would put a live link in front
of a reader with nothing behind it, which is the only thing the round-1 question was ever protecting
against.

| Artefact | Slot range | Count |
|---|---|---|
| §A `README.md` → the Desktop app section | S-001 – S-008 | 8 |
| §B `desktop.md` (docs site + `windowsweep/docs/`) | S-009 – S-021 | 13 |
| **Total** | | **21** |

**Changed this round: 16** - S-001, S-003, S-004, S-005, S-007, S-009, S-010, S-011, S-012, S-013, S-014,
S-015, S-016, S-017, S-019 (withdrawn), S-021. **Kept as drafted: 5** - S-002, S-006, S-008, S-018, S-020.
Slot numbers are not reused or renumbered, so S-019 stays in the inventory as withdrawn rather than
vanishing and taking its reason with it.

---

## §A `README.md` — the Desktop app section

### S-001 · `README.md`, the Table of Contents · the entry
```
- [🖥️ Desktop app](#desktop-app)
```
**Was:** (new.)

**Change:** added, between the `[🎛️ Advanced Features]` and `[🚑 Recovery & Troubleshooting]` entries -
lines 60 and 61 today. They are named by their text rather than by number because the `readme` surface's own
edits move them. That is the insertion point for the section itself as well: after Advanced Features, before
Recovery. The CLI narrative runs from Why to Examples without a second product interrupting it, and a reader
who has finished the capability list is the reader who wants to know whether there is a window.

**Corrected this round.** Round 1 said the file's heading set goes "from 28 to 29". It is **24 to 25**:
`grep -c '^## ' README.md` returns 24, and `grep -c '<a id=' README.md` returns 24 as well. The 28 is the
count of every heading level (`grep -c '^#\+ ' README.md`), which is what the `readme` draft's own parity
line measures. Two drafts counting different things is how a parity check ends up arguing with itself, so
the command is written down beside the number.

### S-002 · `README.md` · the section heading and anchor
```
<a id="desktop-app"></a>
## 🖥️ Desktop app&nbsp;[#](#desktop-app)
```
**Was:** (new.)

**Change:** added, in the file's existing heading shape: an explicit anchor, an emoji, and the self-link
every other section carries. Unchanged this round.

### S-003 · `README.md` · the lede
```
A Tauri window that drives this engine rather than reimplementing it: it runs the bundled `windowsweep.ps1` with `--json --no-color` and carries no cleanup logic of its own. The chokepoint, the protected lists and every refusal are the command line's.
```
**Was (round 1):** three sentences ending *"…and contains no cleanup logic of its own - so the chokepoint,
the protected lists and the refusals are the same ones the command line uses."*

**Change:** rewritten for two reasons. The line editor's note - that sentence ran **41 words against the
fingerprint's 34-word ceiling** - and the single-home rule, since S-010 is the full version of the same fact
and this is the pointer to it. Now 28 words and 12. Verified in `desktop/src-tauri/src/engine.rs:221-222`, where
`--json` and `--no-color` are prepended to every invocation, and in `desktop/src/lib/catalogue.ts`, which
refuses to hard-code a section list.

### S-004 · `README.md` · what it adds
```
- **A run you can watch.**
- **A picker** for the four sections that ask a person to choose.
- **Settings, most of them flags.**

Screen by screen: [Desktop app](https://github.com/aoneahsan/windowsweep/blob/main/docs/desktop.md).
```
**Was (round 1):** the same three bullets carrying their own explanations - the log as it arrives beside a
per-section table, choosing item by item, every control mapping to a flag.

**Change:** cut to the three labels and the pointer, from 54 words to 26. Two of the three explanations they
carried are on the page in S-011, near enough word for word, and the picker's "item by item" went out of
both. A README that repeats the page is the trap the README surface reference names outright. The vague
plural also became a number: four rows in `lib/constants.ps1` carry
`Batch = 'interactive'` - sections 17, 18, 19 and 23 - so "four" is checkable where "the sections" was not.
Each label names a screen that exists: `Run.tsx`, `Picker.tsx`, `Settings.tsx`.

### S-005 · `README.md` · what it sends
```
The engine still makes no network calls at all. The window sends usage and crash reports to improve the product for everyone, and there is no switch. Never sent: a file path, a folder name, a drive label, your user name, your machine name, or the contents of anything. Sign-in is separate and optional.
```
**Was (round 1):** *"Nothing, until you say so."* Analytics was one switch and sign-in the other - four
named destinations behind the first, an optional Google account behind the second - both starting off and
both revocable.

**Change:** rewritten. Every clause of the round-1 version described a product that no longer exists. There
are no switches. Nothing starts off, and nothing is revocable. What replaces it is the shape the notice
itself now uses: the collection stated as a fact, then the refusal that makes it checkable. The never-sent
list is `consent.neverSent` and the dummy's own panel, word for word. The four destination names live once,
on the page, and this beat no longer carries a fourth link to it - S-004 and S-006 already point there, and
a README section that links the same page four times reads like it does not trust the reader to click.

### S-006 · `README.md` · the SmartScreen line
```
The installer is not signed with a paid code-signing certificate, so SmartScreen warns on first run. Every release publishes a SHA-256 checksum and a minisign signature the app's own updater checks; neither is a code-signing certificate. What to do about the dialog: [Desktop app](https://github.com/aoneahsan/windowsweep/blob/main/docs/desktop.md).
```
**Was:** (new.)

**Change:** unchanged this round. Both artefacts are still named exactly. The clause "neither is a
code-signing certificate" still lands here too, because "not signed" followed by "publishes a signature"
invites a reader to conclude one of the two is wrong. The round-1 report that no step produced a checksum is
**closed**: `desktop-release.yml` now hashes every installer into `SHA256SUMS.txt`, uploads it, then fails
if the release is missing any of the six promised artefacts.

### S-007 · `README.md` · how to install it
```
Download the `.msi` or the `.exe` installer from [Releases](https://github.com/aoneahsan/windowsweep/releases). What each one installs, and what Windows says the first time: [Desktop app](https://github.com/aoneahsan/windowsweep/blob/main/docs/desktop.md).
```
**Was (round 1):** a `NEEDS DECISION` with three options, plus two candidate sentences - one for release
day, one interim - and neither chosen.

**Change:** the decision is resolved and this is the release-day sentence, shortened to the CTA and a
pointer. The round-1 candidate also claimed the installer "installs for the current user, so it needs no
administrator rights of its own", which is **false for the `.msi`**. Both instances are corrected. The
evidence lives with the fix, at S-014. Install detail belongs on the page; the README's job here is the
download.

### S-008 · `README.md` · the companion edit to `readme.md` S-021
```
**Not the right tool when** you want a set-and-forget cleaner that runs itself; when you are on Linux or macOS (use the siblings); when you want an undo for caches (there is none - they regenerate); or when you are looking for a security scanner or a registry cleaner. It reclaims disk space, nothing else.
```
**Was:** `**Not the right tool when** you want a graphical, set-and-forget cleaner; when you are on Linux or
macOS (use the siblings); …` (unchanged from there) - the paragraph beginning *"Not the right tool when"*,
line 97 today.

**Change:** unchanged this round. Only the line reference was off by one, and it is now given as text. The
word "graphical" goes, in the same change that inserts the Desktop app section and not before. A file that
offers a window fifty lines below cannot also list "graphical" as a reason to use something else. The clause
keeps the half that stays true, which is the set-and-forget half. Neither surface runs itself, and the
Scheduled Task runs the safe batch only. Flagged from `readme.md` S-021 so the two drafts cannot drift.

---

## §B `desktop.md` — the docs page

Lands in **both** trees: `windowsweep-docs/docs/desktop.md` and `windowsweep/docs/desktop.md`, the
repository copy first, per `CLAUDE.md`.

### S-009 · `desktop.md:1-5` · front matter
```
---
title: 'Desktop app'
description: 'The windowsweep desktop window: what it adds over the command-line tool, what it collects, and the SmartScreen note on first run.'
tags: [desktop, tauri, privacy, install]
---
```
**Was (round 1):** the same block, with the description reading *"…what it sends…"*.

**Change:** one word. "Collects" is what the product now does without asking, and "sends" reads as
conditional next to a page whose whole point is that nothing here is conditional. The description still
names the three things row 14 asks for, in the order the page answers them.

### S-010 · `desktop.md` · the H1 and the answer-first paragraph
```
# Desktop app

The desktop app is a window over the same engine. It runs the bundled `windowsweep.ps1` with `--json --no-color` and reads its section list from `--list --json`. It reimplements no cleanup logic: the chokepoint, the protected lists and every refusal are the ones the command line enforces. The two differ in what leaves the machine, and that has three answers.
```
**Was (round 1):** the same opening, ending *"Nothing leaves the machine unless you turn it on."*

**Change:** the thesis is replaced, which is finding 1. The old closing sentence was voice-fingerprint
sentence 9 and the consent screen's heading. It is now false twice over: there is no "unless you turn it
on", and the startup update check was always a third call the sentence quietly disowned. The open loop it
carried was a promise the page could not keep, so it is replaced by one it can - a distinction, closed at
S-013 with exactly three answers.

**Why the new thesis cannot be falsified by a later release.** It asserts a *split*, not a state. The engine
half is guarded by self-test check [9], which fails the build on a network call. The window half is the
owner's standing decision, and a later release that added a switch would only make the page cautious rather
than wrong. The third half - two calls that run regardless - is structural: the updater is a boot step and
the WebView2 fetch belongs to the installer. Neither is a setting. Nothing in it depends on which keys
happen to be in a build, which is exactly the mistake the round-1 sentence made.

Fifty-nine words, answer-first, the longest sentence in it 20. The line edit took one word out of the last
sentence: "Where the two differ is" became "The two differ in", which says the same thing without the cleft.

### S-011 · `desktop.md` · what it adds
```
## What it adds over the command line

Nothing to the deletion behaviour. Everything to what you can see while it happens.

The catalogue becomes a table you can filter. A run shows the engine's own log as it arrives, beside a table of what each section reclaimed. The four sections that ask a person to choose get a picker. Most controls in Settings map to a flag the engine already has, so anything you set there you can also type.
```
**Was (round 1):** the same block at 112 words, with a clause on ticking rows one at a time and a sentence
on History, reports and the report JSON.

**Change:** trimmed from 112 words to 80, headings included in both. History and the report file have
their own screens and their own reference page, and the two cut clauses were the least load-bearing words
in the surface. The heading is the question a
reader arrives with. Putting "nothing to the deletion behaviour" first is the order this product uses
everywhere. **Line edit:** "a per-section table of what was reclaimed" is now "a table of what each section
reclaimed". Active voice, same eight words.

### S-012 · `desktop.md` · what it does not do
```
## What it does not do

It never raises its own privileges. Six sections need Windows to ask your permission first. Ask for one, and a second, elevated window runs only those sections and writes its own report, while this one waits unelevated. It does not remove the deep-section gate.
```
**Was (round 1):** the same three claims, with the middle sentence running to 40 words and a fourth
sentence, *"It does not answer a picker for you."*

**Change:** the middle sentence was the line editor's second 40-word finding. The writer brought it to 36 and kept it whole,
on the argument that it carries the whole elevation mechanism; the line edit then split it at its own
semicolon into 9 and 27. The first half is the fingerprint's sentence 5 word for word, and the second still
carries the mechanism; a full stop moves no fact and sends nobody off the page. A comma also went in before
"and a second, elevated window", so "Ask for one and a second" can no longer be read as one request for two
things. Six is checkable - `grep -c 'Admin = \$true'
lib/constants.ps1` returns 6, and the app's own heading counts the rows rather than hard-coding the number.
The picker refusal went because S-011 already says the picker is where a person chooses.

### S-013 · `desktop.md` · what leaves the machine
```
## What leaves the machine

Three answers, because three different things are running.

**The engine sends nothing, ever.** No network calls at all, and a self-test check fails the build if one appears.

**The window sends usage and crash reports, to improve the product for everyone.** There is no switch. The first-run screen is a notice with one **Continue**. Four destinations - product analytics, behaviour analytics, session replay with every piece of text masked, and crash reports with file paths stripped out. In 1.1.0 no destination is configured in the build, so nothing has left the machine yet. That is a fact about this release, not a promise: it stops being true the day a key is added.

**Two requests run without asking, and neither carries anything this app knows about you.** On every start the app fetches `latest.json` from this repository's releases; on a machine with no WebView2, the installer downloads it from Microsoft.

**Never sent:** a file path, a folder name, a drive label, your user name, your machine name, or the contents of anything. A run summary is a count and a number of bytes.

### Sign-in and sync

Optional, Google, and it opens your normal browser rather than a window inside the app, so you can see the address bar. What it uploads, in full:

| Your settings | Each run summary |
|---|---|
| your preferences, and when you last changed them | date and duration |
| the developer answer | mode, dry-run, elevated |
| your email address and display name | the section numbers it ran |
| a last-seen timestamp | bytes reclaimed, bytes estimated, and an id |

In 1.1.0 this is dormant: Google is not enabled on the backend project, so the Account screen reports sign-in as unconfigured.
```
**Was (round 1):** *"Two things can. Both are off until you switch them on."* Then analytics as four
separate revocable switches, sign-in as the second switch, and a four-row table with no id and no timestamp
in it.

**Change:** rewritten, and this is findings 1 and 2 together. The three answers are the page's payoff and
they close S-010's loop in order. They are written as **this build's fact rather than as a capability**,
which is finding 2: the destinations exist, there is no way to turn them off, and no key is configured, so
nothing has actually left. The last clause is dated on purpose - *"it stops being true the day a key is
added"* - so that a release which fills `VITE_GA4_MEASUREMENT_ID` falsifies nothing on this page.

Sources, field by field. Four destinations and their one-line descriptions: `consent.DESTINATIONS` and the
dummy's own ledger in `wire.js:399-402`, whose comment records why they stopped being switches. "No
destination is configured in the build": `desktop/.env.example` ships all four telemetry variables empty, there is no
`.env` beside it, and `analytics.ts` constructs a provider only when its key is present - *"a BUILD fact,
not a user choice"*, in its own header. Four keys, all empty. The startup fetch: `Splash.tsx:105` calls
`checkForUpdate()` on every boot. The endpoint in `tauri.conf.json` is one static `latest.json` URL, so the
request carries no identifier and nothing you typed. The WebView2 download: `bundle.windows.webviewInstallMode`
is `downloadBootstrapper`.

**The table is now actually full**, which was contradiction 1. The right column is the nine fields of
`SyncedRun` in `sync.ts`, **including `runId`**. The app's approved Account copy has named "and an id" since
the dummy's table was corrected, and a column headed "in full" with a field missing is the same defect class
as the "Nothing else" that once covered nine fields. The left column is what `pushSettings` writes: `prefs`,
`developer`, `email`, `display_name` and `last_seen_at`. Three, not two. The review named the id and the
timestamp; **`display_name` was missing as well**. The dummy names it outright - *"Display name - Shown in
this window"* - so that omission was mine rather than the dummy's.

The dormancy sentence is written from `.env.example`'s recorded reason and `configuredFeatures()` in
`config.ts`. Both Supabase variables are deliberately empty because `GET /auth/v1/settings` reports
`external.google: false`, and a screen that reports a feature as unconfigured is better than a button that
fails on press. 🔴 It is **not** taken from `account.notConfiguredNote`, which still blames an absent OAuth
client id and is stale against the Supabase switch.

**Line edit.** Three touches. None of them a fact. "There is no switch" now stands as its own four-word
sentence. "nothing has left it yet" reads "nothing has left the machine yet", because "it" sat nearest to
"the build", which is not what leaves. And the two start-up requests, which were 12 words and 12 words after
a 12-word lead, share one sentence with a semicolon, which is how the fingerprint joins two related facts.
The one word this cost is the one S-010 gave back.

### S-014 · `desktop.md` · install it
```
## Install it

Download the `.msi` or the `.exe` installer from [Releases](https://github.com/aoneahsan/windowsweep/releases). The `.exe` installs for the current user and asks for no administrator rights; the `.msi` installs for every user, so Windows asks once. The engine ships inside the app: no separate PowerShell setup, and no Node.
```
**Was (round 1):** *"…it installs for the current user, so installing needs no administrator rights."* - and
the download sentence deferred to the open question at S-007.

**Change:** the download line is now the first sentence of the beat, which is finding 3. And 🔴 **the round-1
install claim was false for one of the two installers.** `installMode: "currentUser"` sits under
`bundle.windows.nsis` and governs the `.exe` only. The MSI has no `wix` block, so it takes the default
scope, and the shipped MSI's own Property table reads **`ALLUSERS = 1`** - read out of
`windowsweep_1.1.0_x64_en-US.msi` through `WindowsInstaller.Installer`, not inferred from the config. The
MSI needs admin rights. Saying "no administrator rights" over the top of that is exactly the kind of claim
this product cannot afford to get wrong, and it was the one sentence in the surface a reader could have
disproved in thirty seconds. The engine claim is from `bundle.resources`, which maps `resources/windowsweep`
into the bundle; the built MSI's File table carried all 38 engine files, and the bundle now holds 39 - `sync-cli.mjs` began copying `package.json` on 2026-09-07, after that MSI was built.

### S-015 · `desktop.md` · the SmartScreen note
```
### Windows may warn you the first time you install this

The installer is not signed with a paid code-signing certificate, so Microsoft SmartScreen shows *"Windows protected your PC"* on first run. That is a statement about the certificate, not about the file.

Choose **More info** and then **Run anyway**. You can verify what you downloaded first: every release publishes a SHA-256 checksum for each installer, and a minisign signature the app's own updater checks. Neither is a code-signing certificate - they prove the file is the one that was built, not who built it. The source is public.

This note is here rather than hidden because meeting that dialog unexplained is worse than reading about it in advance.
```
**Was (round 1):** the same three paragraphs, under the heading *"Windows may warn you the first time"*.

**Change:** the heading now matches the approved summary line in `elevation.html` word for word. Nothing in
the three paragraphs moved: they remain **verbatim** from the copy approved at GATE 4 on 2026-09-05, with
the en dash written as a hyphen. This is a safety surface and humour is off. The words were settled, so the
page repeats them rather than paraphrasing. Both artefacts now exist. The checksum step and the asset
assertion are in `desktop-release.yml`, and the pubkey in `tauri.conf.json` is a real minisign key.

### S-016 · `desktop.md` · updates
```
## Updates

The check runs on the splash screen. An update is offered rather than applied: **Later**, or **Install and restart**. If the check cannot reach the network, you get a note saying so, with **Try again**, and the app carries on without it.
```
**Was (round 1):** *"The app checks for a newer build on startup and asks before installing one. If the
check cannot reach the network it is skipped without a word."*

**Change:** both sentences rewritten, and the evidence behind the first one re-sourced. Round 1 cited
`plugins.updater.dialog` being `true`. **That key does not exist and the plugin never accepted it; it was
removed from the config on 2026-09-07.** The claim that the app asks first is still true on better
evidence - the Splash screen's own two buttons, `splash.update.later` and `splash.update.now`, which
`Splash.tsx` renders while `handleRef` holds an update nobody has answered. And "skipped without a word" was
simply wrong. The note carries a button: the screen shows *"The update check could not reach the network.
Skipped - nothing else in windowsweep needs it."* beside `Try again`. Describing what a reader will actually
see cost the surface its only W-band clause, which is no loss on a **P, R** row. **Line edit:** the first sentence is split in two and
"happens" is "runs"; the offline sentence names "the check" rather than "it", since after the split "it"
would have sat beside "an update". Word-neutral.

### S-017 · `desktop.md` · where things are written
```
## Where it writes

Each run gets its own folder under `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\`, holding that run's report and log. An elevated run writes a second report beside the first, because two windows each write their own.
```
**Was (round 1):** *"Runs, logs and reports land under `%LOCALAPPDATA%\windowsweep-desktop\runs\`, one JSON
per run."*

**Change:** 🔴 **the folder was named wrongly and is corrected.** `run_dir` in `engine.rs:183` joins
`app_local_data_dir()` with `runs` and the run id. On Windows that base is `%LOCALAPPDATA%` plus the bundle
identifier, `com.aoneahsan.windowsweep`, out of `tauri.conf.json`. There is no `windowsweep-desktop` folder
anywhere. The nesting is also one level deeper than round 1 said - a folder per run, not a file per run,
which is what lets an elevated second window write beside the first with both `--reports-dir` and
`--logs-dir` pointed at the same place. Naming the path is what lets a sceptical reader check the claim in a
file browser instead of believing it.

### S-018 · `desktop.md` · the page's outbound links
```
See also: [Safety model](./safety-model.md) · [Admin sections and elevation](./admin-and-elevation.md) · [Sections 0-25](./sections.md)
```
**Was:** (new.)

**Change:** unchanged this round. The internal-link floor asks every indexed page for a link to the safety
model and one reference page; this gives it two reference pages, and no page here is more than two clicks
from `--scan`.

### S-019 · **withdrawn**
```
(withdrawn - no shipping text)
```
**Was (round 1):** an admonition at the top of the page reading *"The desktop app is not released yet. This
page describes the build in `desktop/`, written down before anyone can install it rather than after."*

**Change:** withdrawn, which is finding 3's other half. The page now ships in the same change that publishes
`desktop-v1.1.0`, so a banner calling the app unreleased would be false on the day it lands. The slot number
is kept rather than reused, so the reason survives with it.

### S-020 · `sidebars.ts` · the sidebar entry
```
'desktop',
```
**Was:** (new.)

**Change:** unchanged this round, and required rather than optional. `sidebars.ts` carries the comment "A
page that is not in this sidebar is effectively unreachable, so categories are updated in the SAME change
that adds a page." The entry goes after `'sections'` and before the Reference category, which puts the app
beside the catalogue it displays. Outside this draft's write scope, so it is specified rather than made.

### S-021 · `windowsweep/docs/README.md` and `windowsweep-docs/docs/intro.md` · the index rows
```
| Use the window rather than the console | [Desktop app](./desktop.md) |
```
```
| [Desktop app](./desktop.md) | What the window adds over the command line, what it collects, and the SmartScreen note on first run |
```
**Was (round 1):** one row, `| Desktop app | you want the window rather than the console |`.

**Change:** corrected. Both index files carry **two** tables with **opposite column orders**. The "If you
want to…" table puts the task first and the link second (`| Install it in under a minute |
[Installation](./installation.md) |`), while the category tables put the link first
(`| [Sections 0-25](./sections.md) | Every section: … |`). The round-1 row matched neither, so applying it
verbatim would have produced a row reading backwards in one table and unlinked in both. Two rows, one per
table, in each of the two files.

---

## Found while writing, reported rather than fixed

Round 1's first three findings are closed and are not re-reported: the checksum step exists, the pubkey is
real, the Account copy now discloses the last-seen timestamp. What follows is new.

**🔴 The dummy's Sync list still narrows a run summary to three fields.** `page-account.js` renders
*"Run summaries - 3 of 8 runs uploaded – date, bytes, section count"* two panels away from the corrected
table that now names nine fields plus an id. Same class, second place. It is the defect already fixed in
`account.html`, surviving somewhere nobody looked - which is the "sweep the class, not the instances" lesson
the decision log recorded on 2026-09-05, arriving again. One phrase would close it, in the dummy first.

**The splash disclosure and its own visible note disagree about the offline case.** `splash.html`'s details
block and `splash.detailsNothing` in `en.json` both say the check "is skipped silently", while the screen
right below shows a warning note and a `Try again` button. This page describes the button, so nothing here
is wrong. The two stale sentences belong to `desktop-moment`.

**The consent notice's details call windowsweep free.** Its closing line reads:

*"There is no switch for this and no setting to find. windowsweep is free, and this is how it gets better
for the next person who runs it."*

That second clause is the class of claim the 2026-09-05 pricing decision removed from Home and Account, and
"free" is a banned store word besides. It traces to the owner's own wording, so it is his call rather than a
defect to fix quietly - but it should be settled while `desktop-safety` is already re-opened by the same
decision, not found later on a store page. **This draft makes no pricing claim.**

**Two of the app's own string groups are stale against the dummy.** Every `consent.*` key still describes
four switches, an all-on button, an all-off button and revocation in Settings; `account.notConfiguredNote`
still blames an absent OAuth client id rather than a provider that is not enabled. Both are known and both
belong to the `desktop-safety` pass. They are named here only so this draft is never read as their source.

---

## Self-check

**Palette.** Band **P** carries the mechanism: S-003 and S-010 name the two flags, S-013 names every field
and every destination, S-014 names the two install scopes, S-016 names the two buttons, S-017 names the
folder. Band **R** carries the refusals, and there are six of them - "carries no cleanup logic of its own"
(S-003), the never-sent list (S-005 and S-013), "The engine sends nothing, ever" (S-013), "neither carries
anything about you" (S-013), "It never raises its own privileges" (S-012), and "It does not remove the
deep-section gate" (S-012). One band is deliberately absent. Band **W**'s one clause was S-016's "without a
word", and that sentence was factually wrong; on a **P, R** row losing it is the correct outcome rather than
a gap. The SmartScreen slot is a safety surface and carries no humour at all, which is the rule that
governed the approved original.

**Rhythm.** Shortest shipping sentence: "Settings that are flags." at four words, S-004, tied with "The
source is public." from the approved SmartScreen copy and, since the line edit, "There is no switch." (S-013).
Then three at five - "Nothing to the deletion
behaviour." (S-011), "The engine sends nothing, ever." (S-013), "Sign-in is separate and optional." (S-005).
Longest authored: 28 words, S-003's first sentence, inside the fingerprint's 34-word ceiling. S-012's
elevation sentence stood at 36 after the writer's pass and was kept whole on purpose; the line edit split it
at its own semicolon into 9 and 27, so nothing this surface writes is now over 28. Both 40-word sentences
are gone. S-003 is 28 and 12. One longer sentence sits in the count and is **not** this surface's: S-008's 48-word
"Not the right tool when…" paragraph is already in `README.md`, and this edit removes a word from it rather
than writing it.

**Length. 913 words**, against row 14's **~900** - measured, not estimated, and 13 over. The two halves:
**§A `README.md` 192** (S-001 to S-007), **§B `desktop.md` 721** (S-009 to S-018). The line edit is
word-neutral: S-010 gave one word and S-013 took one, so both halves stand.

The method, because a word count with no method behind it is not comparable to anything. Extract the fenced
slot bodies, drop the YAML front matter, resolve `[text](url)` to its text, remove emphasis marks, backticks
and table pipes, keep table cell text, then `wc -w` - so `--no-color` and `windowsweep.ps1` each count as
one word. Four slots are outside the count. **S-019** is withdrawn, **S-020** and **S-021** are structural
plumbing in other files, and **S-008** is a paragraph already in `README.md` that this surface edits by
removing one word.

Run against round 1 out of git, the same method returns **918** - not the 887 its self-check reported, which
was an estimate with no command beside it. So this round is **five words shorter while carrying more
facts**, and the two rounds miss the cap by 18 and 13 respectively. One caveat on that comparison: round-1
§A included both of S-007's mutually exclusive candidate sentences at 67 words, only one of which could ever
have shipped, so 918 slightly flatters this round.

Where the words went, slot by slot, and the deltas close to exactly -5. Up: **S-013 +134** for the three
answers, the build-fact pair and the two missing table fields; **S-016 +15** for the offline note the app
actually shows; **S-014 +6** for the corrected install scopes. Down: **S-007 -45** as the decision resolved
into one sentence and a pointer, **S-011 -32** and **S-004 -28** and **S-003 -13** to the single-home rule,
**S-019 -24** withdrawn, **S-005 -14** with the switches, **S-012 -12** with the picker refusal. Nothing was
cut to fit. Every cut was a duplication of something the page says better.

**Unsure.** No `NEEDS DECISION`. The round-1 question at S-007 is answered. Its ordering condition - that
this section lands in the same change as the `desktop-v1.1.0` tag - is recorded above rather than re-asked,
because it follows from the answer. The findings reported above are defects in other surfaces' artefacts,
not questions about this one, so none of them pauses this surface.

**Allow markers.** None. How that was checked is worth writing down. Round 1 carried a
`story-lint: allow` marker for the word `elevat` + `e`, and it is dropped, because the banned list matches
that word on boundaries only: the surface uses "elevated", "elevates", "unelevated" and "elevation", never
the bare verb. 🔴 **The marker is deliberately not reproduced in full anywhere above.** The hook reads its
pattern out of the raw file before it strips anything, HTML comments and code spans included, so a draft
that merely *quotes* a marker in order to say it dropped it still arms it. Written out here for the record,
the sentence would have re-enabled the very phrase it claims to have removed - and the self-check would have
read "None" while the hook held one.

**Lint caveat.** The story lint hook strips every fenced block before it counts anything
(`posttooluse-story-lint.sh:61`), so on a slot-shaped surface like this one **none of the shipping copy is
checked**. It measures this commentary. A green verdict here says nothing about the
913 words a reader will see. Those were checked by hand against the banned list, the punctuation budget and
the fingerprint's diction lists. The facts in them were read out of the code and the dummy rather than out
of a screen's summary.

**Line-edit measurement.** The hook was run directly against this file after the edit, with the JSON a real
Write would hand it, and it exited 0; that verdict covers the commentary only. The fenced copy was scored by
the rubric's own method, headings and table rows zeroed: the README section runs burstiness 0.56 with
sentences from 4 to 28 words, and the page runs 0.47 with sentences from 4 to 27. Two of the page's 150-word
windows, the disclosure and the install stretch, hold no sentence of 25 words or more; their longest are 24
and 23. The only ways to reach 25 there were to extend the dummy's verbatim never-sent list or to join the
download line to its explanation. Neither was done. It is recorded here instead.
