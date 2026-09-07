# Content map - windowsweep

Status: **APPROVED at GATE 2, 2026-09-05** · Bible: approved 2026-09-05 · Last updated: **2026-09-07**
(three rows amended on the owner's answers - see the amendment note at the end)

One row per surface that will be written. **A surface with no row is not written** - that rule is what stops
a writer improvising a store listing in the documentation's register. Every field here traces back to a Bible
section rather than being a second opinion.

The tone bands are the Bible's: **P** precision-before-an-irreversible-act (60), **R** refusal-as-reassurance
(25), **W** workshop dryness (15).

---

## 1. The surfaces

| # | Surface | Awareness | Structure | Tone band | Length | CTA | Schema | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `readme` | problem-aware, solution-sceptical | Problem → the gamble they already lost → the guarantees → proof → install | P dominant, R strong, W twice | existing structure, fixed anchors | `npx windowsweep --scan` | SoftwareApplication (docs site only) | planned |
| 2 | `tagline` | unaware, scanning a list | one sentence, no context assumed | P only | ≤ 110 chars, 🔴 **FIVE** places must agree | none | none | **approved (GATE 4, 2026-09-07)** - lands with 1.2.0 |
| 3 | `docs-start` (intro, installation, quick-start) | problem-aware | What it is → what it refuses → four commands in order | P, R | ~400 words per page | run `--scan` | none | planned |
| 4 | `docs-safety` (safety-model, developer-mode) | solution-sceptical | The chokepoint → the refusals, listed → the idle gate → what has no undo | **P and R only, no W** | as long as the subject needs | none | none | planned |
| 5 | `docs-reference` (sections, cli-reference, profiles, admin-and-elevation, reports-and-logs) | evaluating | reference tables with a prose line per entry saying what it does *not* touch | P, minimal R | reference length | none | none | planned |
| 6 | `docs-help` (troubleshooting, faq) | stuck, mid-task | symptom → cause → the exact command | P, W allowed once per page | short answers | the fixing command | FAQPage, 🔴 **page-scoped on `faq` only** | drafted, awaiting apply |
| 7 | `docs-about` (author) | curious | who built it, the sibling tools, how to support it | W allowed, P underneath | short | the payment link | none | planned |
| 8 | `ai-guide` | a machine, or a person writing automation | contract-first: the safe sequence, then the shapes | P only, no W | reference length | none | none | planned |
| 9 | `site-front` (docs intro + `llms.txt`) | arriving cold from search | answer-first: what it is, what it refuses, one command | P, R | short | `npx windowsweep --scan` | WebSite + SoftwareApplication | planned |
| 10 | `cli-strings` | mid-run, in a terminal | terse imperative; every action names its path or count | P dominant | one line each | the next command | none | planned |
| 11 | `desktop-moment` (Home, Run, Splash, Account) | first-run or mid-run | the number, then what it will touch, then the action | P, R | a screen | Start the safe run | none | **recorded** (GATE 4, 2026-09-05) |
| 12 | `desktop-safety` (Consent, Elevation) | being asked for permission | what is being asked → exactly what happens → how to revoke | **P and R only. 🔴 No humor at all** | a screen | accept or decline, equally weighted | none | **recorded** (GATE 4, 2026-09-05) |
| 13 | `desktop-cockpit` (Sections, Picker, History, Settings, Report) | working | dense tables with a plain line above each | P, W in the empty states | a screen | varies per screen | none | **recorded** (GATE 4, 2026-09-05) |
| 14 | `desktop-readme` (+ the docs-site desktop page) | evaluating the app | what it adds over the CLI, what it sends, the SmartScreen note | P, R | **~900 words** (raised from ~600, 2026-09-07) | download | none | **GATE 4 approved 2026-09-07, awaiting apply** |
| 15 | `report-bodies` (the exported Markdown and HTML a run writes) | reading a record after the fact | headings and labels only; every number keeps the console's own vocabulary | P only | about thirty strings | none | none | **added 2026-09-07**, unwritten |
| 16 | `site-home` (the marketing site's home bands and `/download`) | unaware to problem-aware, arriving cold | hero promise -> the gamble they already lost -> the guarantees as refusals -> proof -> the two install paths | P dominant, R strong, W once | a landing page, 12-15 bands | `npx windowsweep --scan` and the desktop download | SoftwareApplication, 🔴 **no `offers`, no `isAccessibleForFree`** | **added 2026-09-08**, unwritten |
| 17 | `site-privacy` (`/privacy` and the footer notice line) | being told, not asked | the one line -> the four destinations -> the refusals -> the CLI's zero-network fact | **P and R only. 🔴 No humor at all** | one page | none | none | **added 2026-09-08**, unwritten |
| 18 | `site-app` (sign-in, `/contact`, `/account`, `/admin`, empty and error states, 404) | working | plain lines above dense tables; every action names what it does | P, W in the empty states | a screen each | varies per screen | none | **added 2026-09-08**, unwritten |
| 19 | `site-front` for the SITE (its `llms.txt`, per-route `<title>`/description, the JSON-LD text) | a machine, or a search result | answer-first | P only | short | none | WebSite + Organization | **added 2026-09-08**, unwritten |

**Order of writing** (owner decision 2026-09-05, "story first, then the app"): rows **11, 12, 13** first,
because RW-093 writes their approved words into the click dummy before any app code is built against them.
Then **1, 2, 9** (the front door), then **3, 4, 6**, then **5, 8, 7, 10, 14** as sessions allow.

## 2. Out of scope, with reasons

| Not a surface | Why |
|---|---|
| `CHANGELOG.md` | a factual record in Keep a Changelog format; voice would make it worse |
| `WINDOWSWEEP_portfolio-info_*.md` | an owner record, written to a fixed fleet template |
| Social content | lives in the notebook by fleet rule, never in this repository |
| `remaining-work*.md`, `what-this-project-consists-of.md`, the trackers | internal working documents; agents read them, not readers |
| `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | governance boilerplate with conventional shapes |
| Commit messages | a different discipline, covered by the git workflow |

## 3. The question map

Questions the audience actually types, each with an answer-first sentence of 60 words or fewer.

🔴 **Source, stated honestly: these are derived from the product's own FAQ and troubleshooting pages, the
sibling tools' documentation, and the phrasing already in the README's keyword line. There is no Search
Console data for this project yet** - the docs domain has never resolved, so no query report exists. No
search volume is claimed or invented. Once the domain is live and Search Console has data, this table is
revised against real queries (RW-040 unblocks that).

| # | Question | Answer-first sentence | Keywords | Surface | Freshness |
|---|---|---|---|---|---|
| 1 | how to free up disk space on windows without deleting anything important | windowsweep removes only regenerable caches, and refuses your documents, credentials and browser state outright. Start with `npx windowsweep --scan`, which deletes nothing and measures what is reclaimable. | free disk space windows, safe disk cleanup | 9, 1 | stable |
| 2 | how to delete node_modules from old projects on windows | Section 17 lists build artefacts in projects you have not touched for 100 days and removes only the ones you select. It never scans a whole drive - you name the folders. | delete node_modules, stale build artefacts | 5, 6 | stable |
| 3 | how to clear the yarn / npm cache on windows safely | Sections 1 and 3 prune package-manager caches on an idle gate, keeping anything used in the last 100 days and the newest version of every versioned tool, so the next install is still fast. | clear yarn cache, clear npm cache windows | 5, 3 | stable |
| 4 | is it safe to use a windows cleaner / will it delete my files | Every deletion passes through one function with a declared folder, and personal folders are refused unconditionally - no flag overrides it. Personal files you do select go to the Recycle Bin, not to nothing. | safe windows cleaner, cleaner deleted my files | 4, 1 | stable |
| 5 | how to see what a cleanup tool will delete before it deletes it | `--scan` measures every target and deletes nothing; `--dry-run` performs the whole run and writes nothing. The rehearsal is the same command as the performance, minus one word. | dry run cleanup, preview before delete | 3, 4 | stable |
| 6 | windows update cache / SoftwareDistribution taking up space | Section 12 clears the Windows Update cache, Delivery Optimization and the servicing logs. It needs an elevated console, so it skips with the exact command when you are not elevated. | windows update cache, softwaredistribution folder | 5 | stable |
| 7 | does this cleanup tool send my data anywhere | No. The command-line tool makes no network calls at all, and its own test suite fails the build if any appear. The desktop app can send analytics and sends nothing until you accept. | no telemetry cleaner, offline disk cleanup | 9, 4 | **re-check on every desktop release** |
| 8 | how to run a disk cleanup on a schedule on windows | `--install-task` registers a weekly Scheduled Task that runs the safe batch and notifies you. It never runs an interactive section, and it refuses to install from an npx cache, which Windows evicts. | scheduled disk cleanup, weekly cleanup task | 5, 6 | stable |

**Internal-link floor:** every indexed page links to the safety model and to one reference page. The safety
model links to the sections page. No page is more than two clicks from `--scan`.

## 4. What the map deliberately does not plan

No blog, and therefore no `Article` schema anywhere - this product has no dated content and inventing some
to feed a feed would be the tail wagging the dog (recorded as RW-046). No landing page beyond the docs front
door; the npm page and the README carry that load. No comparison page naming competitors: the README's
comparison table stays generic ("a wipe-everything cleaner") because naming a product invites a claim this
project cannot verify.

---

## GATE 2 - approved 2026-09-05

Approved as drafted: the fourteen surfaces, the out-of-scope list, and the writing order that starts with the
eleven desktop screens so their words reach the click dummy before any app code is built against them.

The question map was accepted **as a first pass**, with its honesty note intact: it has no Search Console
evidence because the docs domain has never resolved, and it is revised against real queries once RW-040
lands. Nothing in it claims a search volume.

---

## Amendment - 2026-09-07

GATE 2 approved this map as drafted on 2026-09-05. Three rows changed afterwards on the owner's explicit
answers, so they are recorded here rather than edited silently - an approved artefact that changes without a
note is how the next reader ends up trusting a stale row.

| Row | Was | Is | Why |
|---|---|---|---|
| 2 `tagline` | `≤ 110 chars, three places must agree`, status `planned` | `≤ 110 chars, FIVE places must agree`, status **approved at GATE 4** | The brief's "three places" was wrong: the line also lives in the docs site's `docusaurus.config.ts`, which carried a **different sentence**, and in the engine copy the desktop app bundles. The draft reported that rather than cutting to fit, and the owner approved the recommended line, which is also the decision to end the divergence |
| 6 `docs-help` | schema `FAQPage (docs site)` | schema `FAQPage, page-scoped on faq only` | The declared schema did not exist anywhere on the site, and the four blocks that do exist sit in `headTags`, so they are emitted on **every** page. Adding `FAQPage` there would claim the CLI reference is an FAQ. It needs a page-scoped head tag, which the owner approved as a docs-site code change |
| 14 `desktop-readme` | `~600 words` | `~900 words` | The draft measured 887 words after two rounds of cuts and argued an honest floor near 800: 114 words are GATE-4-approved SmartScreen copy reproduced verbatim, 137 are the what-it-sends disclosure that is the surface's whole reason for existing, and 111 are one of the three things the row itself mandates. Raising the cap was the honest fix; cutting to 600 would have removed the disclosure |

Rows 11, 12 and 13 also moved from `planned` to **recorded** - they passed GATE 4 on 2026-09-05 and their
words are in the click dummy and the app. The row said `planned` for two days after the work was approved,
which is the same drift this note exists to prevent.

**One thing did not change.** Row 10 `cli-strings` is still the last surface written, deliberately: it edits
engine source, so it can only land with a version cascade. It ships with 1.2.0.

## Amendment - 2026-09-07, later: row 15 added

The `cli-strings` draft raised it as a `NEEDS DECISION` and the session answered **yes, map it**.

`modules/reports.ps1` emits about thirty user-visible strings into the exported Markdown and HTML reports.
They had **no row and no recorded exclusion** - so they were neither in scope nor deliberately out of it,
which is the one state this map exists to prevent. §2 lists what is deliberately not a surface, and a
reader's own report was never on that list.

It became urgent rather than tidy because the console and the report had already begun to drift: the
`cli-strings` pass changes the console to `Would reclaim (est.)` while `reports.ps1` keeps the older verb in
two places. Two surfaces describing one number in two vocabularies is exactly what a shared map prevents.

**Tone band P only, and no CTA.** A report is read after the fact, often to check what happened rather than
to decide anything, so there is nothing to persuade and nothing to click. It ships with the same 1.2.0
cascade as `cli-strings`, because it edits the same engine.

## Amendment - 2026-09-08: rows 16 to 19, the marketing site

The site did not exist when GATE 2 closed on 2026-09-05, and it does now: `aoneahsan/windowsweep-web`, a
private repository deploying to `windowsweep.aoneahsan.com`, decided by the owner on 2026-09-07 as a web
**app** rather than a brochure. Four of its surfaces carry the product's voice and therefore need rows.
**GATE 2 for these four rows and GATE 4 for each finished surface are both pre-authorised** under the same
standing condition as the eleven (owner decision D12, 2026-09-07): a lean review panel, the finalizer's
fact-consistency check PASSING, and zero unanswered `NEEDS DECISION`. Either one failing pauses that surface
alone and the run continues.

**Row 17 `site-privacy` is a safety surface** and is marked so deliberately. It is the page that tells a
reader their behaviour is recorded, that a session replay exists, and that **there is no switch** - the
owner's decision of 2026-09-07, which is a statement of fact rather than a persuasion problem. Humor is off,
the humor-emotion reviewer is mandatory, and no sentence may soften the absence of an opt-out into a
promise it is not. It also has to hold two facts side by side without either one contaminating the other:
**the command-line tool makes no network calls at all** and its own self-test fails the build if any appear,
while **the desktop window and this site do send analytics**. Those are three different programs, and the
page says which is which.

**Row 16 is written first**, because the click dummy's home page is handed to the owner for its own design
approval with placeholder-shaped structure in the bands this surface will fill. If GATE 1 is answered before
row 16 finishes, the amended words are a GATE-4 parity change with a line in the design README - not a
re-approval. Then 17, then 19, then 18.

**Not surfaces, and the reasons matter.** `/changelog` renders `CHANGELOG.md` and inherits its existing
exclusion - a factual record in Keep a Changelog format, which voice would make worse. The `/sitemap` page's
labels are navigation. The `/admin` audit rows are data. And the site duplicates **no** documentation page:
the docs site owns those words, so nothing here re-authors them.

🔴 **No pricing claim appears on any of these four surfaces.** The product carries a standing exemption -
no plan set, no paid tier - and the honest consequence is silence about price rather than an advertisement
of free. `SoftwareApplication` on row 16 therefore carries **no `offers` and no `isAccessibleForFree`**:
both would be pricing claims wearing schema clothing, and the second one has already had to be removed from
two other artefacts in this project.

## Amendment - 2026-09-08: row 1's W budget was one short of the file it describes

The `readme` developmental round raised it as a `NEEDS DECISION`, verbatim:

> content-map row 1 says tone band "W once"; the draft ships two W lines, both pre-existing and both kept
> (S-014 "which ones bite back", S-050 "a cleanup run is a cleanup run"), and its self-check measures against
> the Bible's 15 per cent rather than the row's "once". Options: (a) amend row 1 to "W twice" with an
> amendment note, the mechanism the map already uses; recommended, since both lines do work, sit about 150
> lines apart and far from any destructive command, and a 3,000-word file is well inside the Bible's band.
> (b) Cut one; which one is a voice call I am not ordering. An approved row silently exceeded is the drift
> the map's own amendment note exists to prevent.

**Taken: (a), and flagged for the owner's veto rather than hidden.** What decided it is that neither line is
a proposal. Both are **already on disk and already shipped** - `README.md:81` ("remembering which ones bite
back") and `README.md:235` ("so a cleanup run is a cleanup run") - 154 lines apart, and neither sits near a
destructive command. So the choice was never "may the draft add a second W line"; it was "does the row
describe the file it was written about". It did not. Row 1 was written on 2026-09-05 against a README that
already carried both, which makes this a **map-accuracy correction**, and cutting a shipped line to defend a
number that was wrong when it was written would be the tail wagging the dog.

Recorded in `run-state.json` `openDecisions` and in `docs/MANUAL-TASKS.md` the turn it arrived, so the owner
can reverse it in one edit if he reads the budget differently.
