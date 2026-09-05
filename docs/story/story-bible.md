# Story Bible - windowsweep

Status: **DRAFT, awaiting GATE 1** · Slug: `windowsweep` · Language: en-GB · Last updated: 2026-09-05

Built from repository evidence on 2026-09-05. Sections marked *(inferred - confirm at GATE 1)* were derived
from what the project already says about itself, not from the owner's answers; his answers outrank them.

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

**You will know what goes before it goes, and the things you cannot afford to lose are refused outright.**

Three supporting commitments, in the order the reader cares about them:

1. **Nothing personal, ever.** Documents, Desktop, Pictures, credentials, cloud-sync folders and browser
   state are refused by a single function that no flag can override.
2. **A dry-run that genuinely writes nothing**, so the rehearsal and the performance are the same command
   minus one word.
3. **No network calls at all** - not telemetry, not an update check - and a test that fails the build if any
   appear.

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
this one names every path first, refuses the irreplaceable, and rehearses before it acts → you get the space
back and nothing you wanted is gone.*

Recurring motifs, each already present in the product:

- **The chokepoint.** Every deletion passes through one function with a declared root. It is the product's
  central image: one door, one guard, no side entrances.
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
| section | a numbered unit of work (0-25), a frozen public contract | module, task, job |
| target | one declared path a section can reach | location, item |
| the chokepoint | `Remove-PathSafe` / `Send-ToRecycleBin` | the safety layer, the guard rail |
| dry-run | the rehearsal, always hyphenated | simulation, preview, test mode |
| the idle gate | the rule that keeps recently used caches | the age filter |
| protected | refused by the chokepoint, unconditionally | blacklisted, blocked |
| reclaim | what the tool does to space | free up, clean, purge (except the literal `--purge-all` flag) |
| developer mode | the answer to the first-run question | dev mode, pro mode |

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

- **Never imply a deletion is reversible.** Caches have no undo; personal files go to the Recycle Bin and
  that distinction is stated every time it is relevant.
- **Never promise a number.** How much comes back depends on the reader's disk.
- **Never claim a security property the tool does not have.** It is not a privacy tool, not a registry
  cleaner, not an anti-malware product. It reclaims disk space.
- **Never write copy that pressures a destructive action.** No countdowns, no "recommended" badge on a
  permanent section, no pre-ticked deep options.
- **Elevation and consent copy carries no humor** and states exactly what the second window will do.
- The desktop app's privacy copy promises no advertising network. 🔴 That promise binds: it means no ad
  network may be added later without changing the copy first.

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
