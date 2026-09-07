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
| 1 | `readme` | problem-aware, solution-sceptical | Problem → the gamble they already lost → the guarantees → proof → install | P dominant, R strong, W once | existing structure, fixed anchors | `npx windowsweep --scan` | SoftwareApplication (docs site only) | planned |
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
| 14 | `desktop-readme` (+ the docs-site desktop page) | evaluating the app | what it adds over the CLI, what it sends, the SmartScreen note | P, R | **~900 words** (raised from ~600, 2026-09-07) | download | none | drafted, awaiting apply |

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
