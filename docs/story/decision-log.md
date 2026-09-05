# Decision log - windowsweep story system

Append-only. Every gate answer, every resolved `NEEDS DECISION`, every dispute that reached the owner.

## 2026-09-05 - the system was initialised

`docs/story/` created at RW-090 from repository evidence: `package.json`, the README, the CLI's own console
strings, `docs/safety-model.md`, the click dummy's copy and `docs/PROJECT-CONTEXT.md`. No interview was run -
the owner had asked the session to continue without stopping for questions, so every section that would
normally come from him is marked *(inferred - confirm at GATE 1)* and the fingerprint is `calibrated: false`.

**Open at GATE 1:**

1. Does the premise read the product correctly - restraint rather than cleaning?
2. Is the palette right at 60 precision-before-an-irreversible-act / 25 refusal-as-reassurance / 15 workshop
   dryness?
3. `NEEDS DECISION` - one to three writing samples to calibrate the fingerprint.

**Recorded reasoning, so it is not re-litigated:** three existing voices in the registry (labflow, netcage,
clearhire) sit close to "calm competence, states the limit". The differentiator chosen for windowsweep is
that its dominant register is the moment *before an irreversible act*, and its second band is **refusal** -
what the tool will not do even when instructed - rather than agency, evidence or custody. That distinction is
what the uniqueness check rests on, and if the owner rejects it the palette has to move, not the wording.

## 2026-09-05 - GATE 1 APPROVED

Asked to approve the Story Bible, the palette and the registry entry, the owner chose **"Approved as
drafted"**. So:

- The premise stands: this product is about restraint rather than cleaning. It deletes, so it names what it
  will touch before touching anything and refuses the rest no matter what is typed.
- The palette stands at **60 precision-before-an-irreversible-act / 25 refusal-as-reassurance / 15 workshop
  dryness**, including the deliberate choice not to use "calm competence" as the dominant band, which three
  existing voices already hold.
- The registry entry moves from `draft` to `approved`.

**Still open, and not a blocker:** the fingerprint is `calibrated: false`. It was derived from copy already
in the repository, not from samples he picked. Writing proceeds; if he pastes one to three samples later, the
fingerprint is rewritten and GATE 1 re-runs for that file alone.

## 2026-09-05 - sequencing: story before the app

Asked whether the desktop app should wait for the story pass, he chose **"Story first, then the app"**. The
click dummy owns the app's words, so the copy passes the pipeline and is written into the dummy (RW-093)
before any app code is built against it. This costs time to first running app and buys never having to
revise a string in two places.

## 2026-09-05 - GATE 2 APPROVED

Approved as drafted: **"Approved, start writing"**. The fourteen surfaces stand, the out-of-scope list stands,
and the writing order begins with the eleven desktop screens.

The question map was accepted as a **first pass**, explicitly on the understanding that it rests on no Search
Console evidence - the docs domain has never resolved, so no query report for this project exists. It is
revised against real queries once the DNS row (RW-040) lands. No search volume is claimed anywhere in it.

Next surface: `desktop-safety` (Consent and Elevation). Humor is off entirely on both.

## 2026-09-05 - the three desktop surfaces drafted, and what they turned up

The writer produced `desktop-moment` (168 slots), `desktop-safety` (64) and `desktop-cockpit` (143) as
numbered slot inventories rather than as prose: each entry names its file and a selector precise enough to
find the string once, and carries the shipping text in a fence of its own. That shape exists because these
words are transcribed into an artefact that already exists, not published as an article.

**331 of 375 slots were kept unchanged.** The dummy's copy was already close to the Bible, which is the
expected outcome when the Bible was derived from it - and worth stating plainly, because a review that
rewrote most of an approved artefact would be evidence of a problem, not of diligence.

The 38 changes are almost entirely banned diction reaching the surface: `clean` and `sweep` as verbs,
`preview` used as a synonym for the dry-run when the flag is called `--dry-run`, `just`, and - twice, on the
consent and elevation screens - a first-person plural that invents someone standing between the reader and
the program. Three are substantive rather than lexical:

- Home's empty state compared the reader's disk to other people's (*"cleaner than most"*), which the tool
  cannot measure. An unmeasurable comparison undercuts every exact number on the same screen.
- The History screen's Mode column named five run modes that do not exist in the engine (`full sweep`,
  `developer caches`, `browsers and temp`, `caches only`, `packages and editors`). They become the engine's
  own vocabulary, each checked against its row's section count.
- The Report screen named four sections by keys the engine does not use - `runtimes`, `chromium`, `winuser`
  for 3, 7 and 9, and `recycle` for 21, which is a different section entirely. That is a data defect on the
  one screen whose own disclosure claims it cannot disagree with the file on disk.

**Five defects in the dummy were reported rather than fixed**, because the writer's scope was the drafts:
the four wrong section keys above, two stale prototype toasts on buttons whose screens have since shipped,
consent's two buttons not being of equal visual weight (`.btn` against `.btn.btn-primary`, where row 12
requires a first-class decline), Home's consent list and the consent screen's list being built by different
code and having already drifted, and two English-only plural constructions in a product whose i18n mechanism
ships from day one. The equal-weight one is fixed in the app already; the rest are RW-093's work.

**Seven `NEEDS DECISION` items went to the owner verbatim.** Two are sharp: the pricing sentences on Home and
Account state that there is no paid tier and nothing to buy, and a standing fleet rule forbids writing that
anywhere, on the grounds that the claim outlives the decision it describes.
