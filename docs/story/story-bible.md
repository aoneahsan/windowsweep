# Story Bible - windowsweep

Status: **APPROVED at GATE 1, 2026-09-05** · Slug: `windowsweep` · Language: en-GB · Last updated: 2026-11-07
(section 7 gains three rows and D45's legal exception, the keeper record of release-1.4.4; the owner's section 19
continuity correction and the 2026-09-07 corrections to commitments 2 and 3 remain)

Built from repository evidence on 2026-09-05 and **approved as drafted** by the owner the same day: asked to
approve the Bible, the palette and the registry entry, he chose *"Approved as drafted"*. The premise in
section 1 and the 60/25/15 palette are therefore settled and are not re-litigated without a decision-log
entry.

🔴 **One thing remains open and is not a blocker:** the voice fingerprint is still `calibrated: false`,
because it was derived from copy already in the repository rather than from samples the owner chose. Writing
proceeds against it; if he later pastes one to three samples, the fingerprint is rewritten and GATE 1 re-runs
for that file alone.

---

## 1. Project nature and one-line premise

windowsweep is a **destructive command-line utility** that reclaims disk space on a Windows machine, plus a
documentation site and a desktop application that drives the same engine.

> **The premise:** it deletes things, so it tells you what it will touch before it touches anything, and it
> refuses to touch the rest no matter what you type.

That is the whole product in one line. Every other tool in this family is about *doing* something for the
reader; this one is about *not* doing several things, on purpose, and being able to prove it.

## 2. Audience and awareness level

Developers and power users on Windows 10 and 11 - people who have a `node_modules` problem, several browser
profiles, a Docker disk image and an Android emulator, and who have watched a general-purpose "cleaner" wipe
a cache they needed.

**Awareness level: problem-aware, solution-sceptical.** They know their disk is full and they know why. They
do not need convincing that caches accumulate. What they need is a reason to trust a program that deletes
files, having probably been burned by one. So the copy never sells the problem; it spends its budget on the
guarantees.

## 3. Core promise

**You will know what goes before it goes, and protected paths are refused outright.**

Three supporting commitments, in the order the reader cares about them:

1. **Personal folders stay protected; section 19 scans Downloads and folders you add, and only removes files you select.**
2. **A dry-run that writes nothing of yours** - two files of its own, and nothing else - so the rehearsal and
   the performance are the same command minus one word.
3. **The engine sends nothing anywhere** - no telemetry, no update check of its own - and a test fails the
   build if network code appears in it. Cleanup never touches the network; only sections 30-32, when you run
   them, ask Windows Update or winget what is available, and download only the rows
   you pick.

> 🔴 **Both of those were corrected on 2026-09-07, and neither was a wording preference.** Commitment 2 said
> *"genuinely writes nothing"*, which is false: a dry-run is not one of the quiet modes
> (`windowsweep.ps1:285` lists only `help`, `version`, `list`), so it initialises a log, and
> `Initialize-Report` runs unconditionally. Measured rather than reasoned - a `--only 0 --dry-run --yes` run
> took the logs directory from 154 files to 155 and the reports directory from 11 to 12. It writes exactly
> two files, both its own, and none of yours. Commitment 3 said *"no network calls at all"* of the whole
> product; that remains exactly true of the **engine**, whose self-test check [9] fails the build on an HTTP
> or socket call, and stopped being true of the **desktop window** when the owner removed the analytics
> opt-out and the update gate shipped. The window is where the collection is stated; the engine is where the
> promise still holds without qualification. Scoping the sentence keeps the strong claim where it is earned
> instead of losing it to a product-wide phrasing that a reader can falsify in one command.

> **2026-11-03 correction to commitment 1:** section 19 searches Downloads by default and accepted folders
> added with `--personal-roots`. Its large or old files are listed for individual selection; `--yes` cannot
> select them. Selected files always go to the Recycle Bin, even when `--permanent` is set.
> `Remove-PathSafe` and `Send-ToRecycleBin` both check the declared root and protection rules;
> section 19 also rechecks the file immediately before removal. The owner approved the replacement sentence
> above for 1.4.0. This describes 1.4.0 source, not the currently published 1.3.2 release.

> **2026-11-13 correction to commitment 3 (D110):** 1.5.0 adds sections 30-32, which update Windows, drivers
> and apps for the rows a person picks. Asked how that fits this promise, the owner chose "Opt-in sections,
> reworded". The old sentence, *"makes no network calls at all"*, would be false the first time someone installs
> an update, so it now says what stays true: the engine's own code holds no network call (check [9] still fails
> the build on one), cleanup never reaches the network, and the three update sections hand the download to
> Windows Update or winget. "Sends nothing anywhere" is the strong claim, and it is
> still earned.

## 4. Emotional palette

**60 precision-before-an-irreversible-act · 25 refusal-as-reassurance · 15 workshop dryness**

| Band | What it sounds like | One sentence in it |
|---|---|---|
| **Precision before an irreversible act** (60) | The register of a checklist read aloud before something that cannot be undone. Exact nouns, exact numbers, present tense, no adjectives doing work a number could do. | "This was a dry-run. Run the same command without `--dry-run` to reclaim the space." |
| **Refusal as reassurance** (25) | Comfort delivered by naming what the tool will *not* do. The reassurance is always a specific refusal, never an adjective like "safe". | "Caches that rebuild themselves next time you need them." |
| **Workshop dryness** (15) | The dry aside of someone who has done this a hundred times. Never at the reader's expense, never at the expense of the data. | "It cannot promise a number. Your disk decides that; `--scan` measures it." |

**Banned tones:** urgency and scarcity ("act now", "before it's too late"); triumphalism about deletion
("blast", "nuke", "obliterate", "crush"); shame about the mess ("your machine is a disaster"); any joke
positioned near an irreversible action; superlatives ("best", "#1", "most powerful"); exclamation marks.

🔴 **Humor is off entirely on the safety surfaces** - the elevation explainer, the consent dialog, the
permanent-deletion sections (11 the Recycle Bin, 16 event logs), and any error that has already cost the
reader something.

## 5. Voice fingerprint

`voice-fingerprint.md` - 12 sentences, do and don't lists, and the punctuation budget.

## 6. Story spine and recurring motifs

**The spine:** *a machine fills up invisibly → a general cleaner is a gamble you have already lost once →
this one names every path first, refuses protected paths, and rehearses before it acts → you select any
eligible personal files yourself, then reclaim the space from what you chose.*

Recurring motifs, each already present in the product:

- **The chokepoint.** `Remove-PathSafe` and `Send-ToRecycleBin` check each file against a declared root and
  the shared protection rules. It is the product's central image: the same refusals on either removal path.
- **The rehearsal.** `--dry-run` is the same command minus a word. The rehearsal and the performance differ
  by one flag, which is why the rehearsal is trustworthy.
- **The list read aloud.** Naming the path before touching it - in `--scan`, in `--list-targets`, in the
  treemap that draws every target as a tile.
- **What is kept.** The idle gate keeps what you used recently; the tool is defined as much by the caches it
  leaves behind as the ones it removes.
- **The sweep.** The product's one visual metaphor - a pane wiped clean along a diagonal. Used sparingly and
  never as a verb in copy ("sweep away" is banned; it is triumphalist).

## 7. Glossary and naming

Spelling: **en-GB** (`behaviour`, `recognise`, `artefact`). The product name is **`windowsweep`**, always
lower-case, even at the start of a sentence, and never "WindowSweep" or "Window Sweep".

| Term | Use | Never |
|---|---|---|
| section | a numbered unit of work (0-32 since 1.5.0), a frozen public contract | module, task, job |
| target | one declared path a section can reach | location, item |
| the chokepoint | `Remove-PathSafe` / `Send-ToRecycleBin` | the safety layer, the guard rail |
| dry-run | the rehearsal, always hyphenated | simulation, preview, test mode |
| the idle gate | the rule that keeps recently used caches | the age filter |
| protected | refused by the chokepoint, unconditionally | blacklisted, blocked |
| reclaim | what the tool does to space | free up, clean, purge (except the literal `--purge-all` flag) |
| developer mode | the answer to the first-run question | dev mode, pro mode |
| switch | what the analytics does not have: *"There is no switch."* The desktop window and the site send usage events and crash reports, and the first-run screen is a notice, not a request (added 2026-09-13, keeper) | opt-out, opt out, turn off tracking |
| your machine | the disk the product cleans, and the files on it - never the browser's own storage, which `/privacy` discloses. So *"Nothing on your machine was touched"* is true of an error page, and the approved `error.lede` and both deletion bands already use it this way (added 2026-09-25, keeper) | your computer, your device, your system |
| machine | the sync noun: *this machine*, *another machine*. Never a machine name or host name - neither is ever synced. "PC" only inside the account-deletion band (added 2026-09-25, keeper), in the update sections' "never restarts your PC" and in the noun "PC maker" (added 2026-11-13, D110) | device, computer, laptop |
| the windowsweep team | who makes the product (owner decisions D45 and D46, 2026-09-25: a product speaks as its team, never as one person). *The windowsweep team* standing alone - a label, a heading, a schema `name`, a meta `content`, a footer column title; *the windowsweep team* inside a sentence; *the team* only where the same sentence or its heading names windowsweep; *the same team* only on this product's own roster credits, which name a shared maker without claiming the other products (added 2026-09-25, team-voice) | the developer, the author, a person's name (except the legal identities D45 keeps: the Terms operator of D33, the licence and copyright lines and the npm `author` field; noted 2026-11-07, keeper record of release-1.4.4), we |
| Admin (the screen) | the desktop rail item `nav.elevation` and the screen behind it; prose names it *Admin*, as the rail does (`app.js:178`, `shell.json:26`). *Elevation* stays the word for the Windows permission (`--elevate`, the AI guide's *Elevation* heading, the `admin-and-elevation` page) and the surface's internal name in §4, §8, §10 and content-map row 12 (added 2026-11-06, keeper record of d91-strings) | the Elevation screen |
| in one click | the unsubscribe fact, as the approved release email's footer has it: *Unsubscribe in one click from this message* (row 26). The fingerprint's never-list already bans the hyphenated form (added 2026-11-06, keeper record of d91-strings) | one-click |
| the release broadcast | what an update notice or block arrives on, in the release words and the docs: *Release broadcasts and lifecycle events trigger the checks* (1.4.1), *the release broadcast now reconnects* (1.4.4). Row 24's approved admin line `releases.published` says *when the release signal arrives* and stands, so no row bans *signal* for it (added 2026-11-07, keeper record of release-1.4.4) | the update broadcast, the release feed |
| a private signal | the plan's own channel: the private topic `plans:<account id>` that tells the window to read the plan again, *a private signal for that one account* (1.4.4). Its database half is a Supabase broadcast (`plan_change_broadcast`), and that name is code, as `--purge-all` is for *purge* (added 2026-11-07, keeper record of release-1.4.4) | broadcast, in prose |
| organisation | the en-GB word in prose. *organization* is kept only inside another system's own name for its object: Polar's organization, the merchant account Polar approved (D94), and schema.org's `Organization` type, which the site's and the docs site's JSON-LD carry (team-voice, rows 19 and 9). No shipped string uses either spelling yet (added 2026-11-07, keeper record of release-1.4.4) | organization, outside those two names |

**Numbers are always exact and always sourced.** The tool never estimates in prose; `--scan` measures, and
the copy points at it. **Never state a gigabyte figure as a promise.**

## 8. Per-surface rules

| Surface | Register | Length | Rules |
|---|---|---|---|
| README | precision-forward, en-GB | the existing structure is fixed | Leads with what it refuses, not with what it deletes. The limitations section is not an appendix - it is part of the pitch |
| CLI console strings | terse, imperative, **ASCII-only** | one line where possible | 🔴 No typographic quotes, dashes or ellipses - the engine is ASCII-only by IRON rule and the self-test enforces it. Every message that reports an action names the path or the count |
| Docs pages | explanatory, second person | as long as the subject needs | Each page states what the feature does *not* do before the edge cases |
| Desktop UI copy | the same voice, fewer words | a screen's worth | The click dummy owns the words; a change is written there first. Consent and elevation are safety surfaces |
| npm description / tagline | one sentence | ≤ 110 chars | Must survive being read with no context, in a list of search results |
| Store-style listing copy | factual | short | Zero banned words; no user counts, no testimonials, no superlatives |

## 9. SEO / AEO map

`content-map.md` - written at RW-091 and approved at GATE 2. Not started.

## 10. Safety constraints

- **Never imply a deletion is reversible.** Caches have no undo; section 19 always sends selected personal
  files to the Recycle Bin, even when `--permanent` is set. State that distinction wherever relevant.
- **Never promise a number.** How much comes back depends on the reader's disk.
- **Never claim a security property the tool does not have.** It is not a privacy tool, not a registry
  cleaner, not an anti-malware product. It reclaims disk space.
- **Never write copy that pressures a destructive action.** No countdowns, no "recommended" badge on a
  permanent section, no pre-ticked deep options.
- **Elevation and consent copy carries no humor** and states exactly what the second window will do.
- The desktop app's privacy copy promises no advertising network. 🔴 That promise binds: it means no ad
  network may be added later without changing the copy first.
- 🔴 The house promotions are ads, and every line that describes them says so (the owner's rule of 2026-11-09; D101,
  2026-11-10). The no-ad-network promise above stands beside that: the ads are the team's own tools, never a third
  party's.

## 11. Decision log and language

Decisions: `decision-log.md`. Language **en-GB** everywhere except the CLI's ASCII-only console strings,
which are en-GB in spelling but restricted in punctuation. Run state: `run-state.json`.

---

## GATE 1 - what is being asked

1. **Does the premise in section 1 match what you think this is?** It reads the product as being *about*
   restraint rather than about cleaning.
2. **Is the palette right at 60 / 25 / 15?** The dominant band is deliberately not "calm competence", which
   three of your other voices already use - see the uniqueness note below.
3. **NEEDS DECISION: the fingerprint is uncalibrated.** It was derived from copy already in the repository,
   which you have not necessarily blessed as the voice. Paste one to three pieces of writing you want this
   product to sound like and it will be recalibrated before anything is written.

### Uniqueness against the registry (10 existing voices)

The nearest siblings, and why this is not them:

| Sibling | Its voice | Why windowsweep differs |
|---|---|---|
| **labflow** | 70 calm-competence · 20 plain-warmth · 10 dry-wit | labflow explains the reason *inside* the rule for a regulated workflow that must not go wrong. windowsweep's dominant register is narrower and more specific: the moment *before* an irreversible act. Different band, different weight |
| **netcage** | 70 calm competence · 20 control/agency · 10 candour | netcage hands the reader switches - agency over what they permit. windowsweep hands the reader **refusals** - things it will not do even when instructed. Agency versus restraint |
| **clearhire** | 55 evidence · 25 dry warmth · 20 gravity | clearhire names a limit beside a claim it is *selling*. windowsweep names a limit beside an action it is *about to take* |
| **empora** | 55 custodial-plain · 25 wry · 20 precise-about-scope | empora is custodial about data at rest. windowsweep is precise about data at the moment of removal |

No collision on the three-test check: the dominant band differs in name and weight from every entry, the
second band ("refusal as reassurance") appears nowhere else, and the diction lists overlap only on the words
the whole fleet shares. Palette hue **128 (lime)**, already registered and distinct.
