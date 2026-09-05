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

## 2026-09-05 - GATE 4 granted, and two answers that were blocking copy

**GATE 4: approved.** All 38 proposed changes are written into the click dummy (RW-093), and the app then
followed the dummy for the three screens it has built.

### The pricing claim - "say only what sign-in does"

Home and Account stated that there is no paid tier, no plan and nothing to buy. Asked to choose, the owner
picked the option that **drops the claim without adding a plan**:

- Account: *"Reclaiming space is never gated. Signing in moves your settings and a summary of each run
  between your own machines, and that is all it does."*
- Home: *"Signing in is optional. It syncs your settings and a summary of each run, and nothing else."*

Both sentences are true today and neither can be falsified by a later release, which is exactly what the
fleet rule is protecting against - it forbids the *claim*, not the state of affairs. No plan set is scoped
for this product, and none is implied by this wording.

### Code signing - unsigned, and the note stays

The installer ships without a paid code-signing certificate, so both SmartScreen explanations ship as
written. The follow-on question - what a release publishes that a reader can actually check - is answered
by naming the two artefacts exactly rather than saying "a signature":

> every release publishes a SHA-256 checksum for each installer, and a minisign signature the app's own
> updater checks. Neither is a code-signing certificate - they prove the file is the one that was built, not
> who built it.

That distinction matters because the previous wording read as though it contradicted the sentence above it:
"not signed" followed by "publishes a signature" invites the reader to conclude one of the two is wrong.

### One thing done beyond the 38, and recorded rather than smuggled

Two internal identifiers were renamed with their labels: `data-ws-action="clean"` became `"reclaim"` and
`"preview"` became `"dryRun"`, and the `cleanBtn` text key became `reclaimBtn`. The writer's report asked for
this on S-031 and the reasoning generalises - **an identifier that still says the retired word is how the
retired word comes back**, in the next component someone writes by copying its neighbour. A static check
verified both directions afterwards: every `data-ws-text` and `data-ws-action` a page declares has a writer
or handler, and no writer targets a key no page declares.

The same banned phrase was also fixed in one gallery specimen (`g-tables.js`, "the filter is just narrow"),
which the drafts did not cover because their scope was the eleven screens. Same string, same reason, noted
here rather than left to look like part of the approved set.

## 2026-09-05 - the front-door surfaces drafted, and eight factual defects found

`readme` (96 slots), `tagline` (one recommendation plus two alternates), `site-front` (46 slots) and
`desktop-readme` (21, all new) are drafted and awaiting GATE 4. What the pass turned up matters more than the
prose.

### Corrected immediately, without waiting for GATE 4

A factual correction of a false statement is allowed without the story gate (`CLAUDE.md`), and one of these
was the sort of sentence this whole system exists to catch.

🔴 **The README called section 23 a read-only audit.** *"26 numbered sections … plus four read-only audits
(global packages, orphaned app data, idle programs, startup items)."* Section 23 is `Tier='recycle'`,
`Batch='interactive'`: it asks a person to pick, row by row, and what they pick goes to the Recycle Bin.
**Three** sections report and delete nothing (22, 24, 25). This is the one sentence in the file that could
have made a reader trust a deletion they were not expecting. The README already contradicted itself further
down, and `llms.txt` had it right — so the machine-readable surface and the human one disagreed, with the
machine correct.

**A number nobody could source.** *"the next `yarn install` re-downloads twelve gigabytes"* appears nowhere
in the tree, and the Bible's rule is absolute: never promise a number. It now reads "downloads the lot
again", which is true on any machine.

**445, not 400.** The self-test prints `long path (445 chars) removed`. The README claimed 400.

**Which sections the deep flag covers.** Two sections are permanent; `--i-understand-deep` gates four. The
old wording let a reader infer the two sets were the same.

### The two that were promises with nothing behind them

🔴 **The SmartScreen copy approved earlier today names a SHA-256 checksum the release workflow did not
produce.** `desktop-release.yml` built the installers and, given the signing secret, emitted `.sig` files and
`latest.json` — there was no checksum step anywhere in it. **The fix is the step, not a softer sentence**: the
workflow now hashes every installer and attaches `SHA256SUMS.txt` to the release.

🔴 **And the other half of the same sentence had nothing behind it either.** `tauri.conf.json` still carries
`REPLACE_WITH_UPDATER_PUBLIC_KEY`, so the minisign signature the copy promises does not exist yet. The release
workflow now refuses to run while that placeholder is in place, rather than publishing a release whose own
copy describes an artefact it does not contain.

### The dummy said "Nothing else" about something with nine fields

🔴 `account.html` read *"Run summaries | Date, bytes freed, section count. **Nothing else.**"* `stripRun` in
`desktop/src/lib/sync.ts` sends nine fields, three of which the app's own History screen displays as its Mode
and Took columns — so the table was contradicted by the screen beside it. **"Nothing else" is what made it a
defect rather than a summary.** `pushSettings` also writes a `lastSeenAt` timestamp disclosed nowhere.

Both are now named in the dummy, and the app's catalogue follows it — in that order (§10a).

### Two owner decisions still open

**The docs site's `SoftwareApplication` schema carried `offers: { price: '0', priceCurrency: 'USD' }`** — a
machine-readable pricing claim on the one surface answer engines parse structurally, and the fleet rule names
JSON-LD explicitly. The 2026-09-05 decision was "no pricing claim, anywhere"; this is the artefact that
decision did not name. Applied the literal reading and **removed the block**, recorded here so it is not
re-litigated. `isAccessibleForFree` is the same claim in another field and is equally out.

**The desktop README section is held back**, not shipped. It needs a download sentence and there is nothing
to download: no desktop release exists, `desktop-release.yml` is manual-dispatch only, and the updater key is
a placeholder. It is inserted in the same change that publishes the first release, rather than telling a
reader to fetch something that is not there.

### Two things for the owner, in his own reading

1. **The tagline lives in FIVE places, not three, and they already disagree** — the docs site carries a
   different sentence. Adopting any candidate is also a decision to end that divergence.
2. **Row 14's length cap is wrong, and the draft says so rather than cutting to fit.** `desktop-readme`
   measures 887 words against a ~600 cap, after two rounds of cuts. The floor: 114 words are reproduced
   verbatim from GATE-4-approved SmartScreen copy, 137 are the what-it-sends disclosure that is the surface's
   whole reason for existing, and 111 are one of the three things the row itself mandates. The honest floor is
   near 800. That is a content-map change, so it is a request rather than an edit.

### Also corrected

`og:locale` was `en_US` on an en-GB product.

## 2026-09-05 - the decision sweep, applied because a global rule landed the same day

Another session added a clause to `~/.claude/rules/storytelling-content.md` while this one was running:

> 🔴 **AN APPROVED ARTEFACT HOLDS ITS CLAIM UNTIL SOMETHING FALSIFIES IT — AND NOTHING RE-READS IT.**
> When a decision lands, grep the approved surfaces for the claim it just changed, rather than waiting for a
> writer to stumble over it.

Two decisions landed today, so both sweeps were run rather than assumed.

**The pricing sweep** — `no paid tier`, `nothing to pay`, `nothing to buy`, `no plan`, `free forever`,
`free tier`, `priceCurrency`, `isAccessibleForFree` — across the README, `docs/`, the app source, the click
dummy, `lib/`, `package.json` and both of the docs site's content directories. **Zero hits**, and the sweep
was proved non-blind against a planted control line first, because a pattern that finds nothing and a pattern
that cannot find anything look identical in a terminal.

**The signing sweep** found seven surfaces making a claim, and one of them was still wrong. `index.html` said
the installer *"is not signed **yet**"*. "Yet" is a small forward-looking promise, and the decision taken
today is that no certificate is budgeted — so the sentence quietly contradicted the decision that had just
been recorded above it. It now states the fact and points at the Administrator-rights screen instead of
duplicating its explanation.

The three that remain are each accounted for: `elevation.html` and its `en.json` mirror name a SHA-256
checksum and a minisign signature, and the release workflow now produces both and refuses to run while the
updater key is a placeholder; `index.html` states a fact and promises no artefact, so there is nothing to back.

🔴 **The lesson generalises past storytelling.** The two defects this sweep and the front-door pass caught
were both in copy approved *hours* earlier — a checksum with no step, and "Nothing else" about a nine-field
payload. **GATE 4 approves a snapshot; nothing re-reads it.** The grep is the cheap part.

## 2026-09-05 - the documentation pass, and seventeen factual corrections

Six surfaces drafted (`docs-start`, `docs-safety`, `docs-reference`, `docs-help`, `docs-about`, `ai-guide`);
215 slots, 150 changed or new. They await GATE 4. **The factual findings did not wait**, and there were
seventeen of them.

### The safety page overclaimed against its own source

🔴 `safety-model.md` said **"No flag bypasses steps 1-5"**. Step 5 is the tool's own data folder, and
`--prune-history` and `--uninstall-data` both lift that guard - deliberately, because deleting the tool's own
logs is what those commands are for. The engine's own header has always said **"No flag bypasses steps 1-3"**.
The page now states the true shape: guards 1 to 4 are absolute, guard 5 has exactly two lifters, and both are
named.

**The page also understated the guard it describes.** Step 2 omitted `SysWOW64`, `Program Files (x86)`,
`C:\Users\Default` and `C:\Users\Public`, all of which are in the exact set. The counts are now stated and
were counted from `lib/safety.ps1` rather than recalled: **66 subtrees, 50 patterns, 13 file names, 2 declared
exceptions, 15 declared exact roots (14 distinct)** plus every drive root. The two exceptions -
`%LOCALAPPDATA%\Android\Sdk\.temp` and `.downloadIntermediates` - were not mentioned anywhere, and a carve-out
inside a protected subtree is exactly the thing a sceptical reader wants named.

**And a second refusal was undocumented.** A target with a layout kind is filtered again in `lib/actions.ps1`
against an allowlist of cache folder names. A browser profile is refused twice; the page sold one.

### The same defect class as this morning's, in five more places

Section 23 sends files to the Recycle Bin, and the tier table, the FAQ's undo answer, and `--permanent`'s row
all omitted it. 🔴 **Sweeping for the class rather than the instance found two more that neither the writer
nor this session had listed**: `--permanent` affects 23 (`orphaned_appdata.ps1:180`), and
`PROJECT-CONTEXT.md` grouped section 17 with the Recycle Bin sections when 17 removes build artefacts through
the chokepoint outright.

### The one that would have broken automation silently

🔴 `AI-INTEGRATION-GUIDE.md` said `--yes` covers **"12-14 when the console is elevated"**.
`WS_SAFE_BATCH_ADMIN = @(12, 13)`. Section 14 is `optin` and is never in `--all`. A caller scheduling a DISM
component cleanup would record it as done, every week, and it would never have run.

### The rest

`quick-start` called `--scan` **"Read-only"** when it writes a log and a report unless `--no-report`; it said
sections **12-16** need elevation and omitted 20, then gave a command covering only 12, 13 and 14.
`developer-mode` said versioned caches keep their newest version **"unconditionally"** - `--purge-all` removes
that protection, and the safety page had always said so, so the two pages disagreed in the one case that
mattered. The FAQ and the README both said CI runs **"on every push"**; it runs on pushes to `main` and on
pull requests. The Scheduled Task's action is five flags, not two - `--notify` is part of it. Section 14 was
described as "Slow, safe" when `safe` is neither its tier nor its batch. And `docs/README.md` carried two
dates the site's mirror had already corrected - **the source was the stale one**, which is the opposite of
the drift a mirror is supposed to have.

All seventeen are corrected in the CLI repo and re-mirrored to the site, front matter preserved, and the
site build passes with `onBrokenLinks: 'throw'`.

### One NEEDS DECISION, and three things reported rather than edited

**NEEDS DECISION, verbatim:** *"is 'independent software engineer' the description you want on this page? It
is the existing wording and it is kept unchanged, because how you describe yourself is yours to decide rather
than a fact this draft can check."* Options: keep it, give the wording from aoneahsan.com, or drop the title
and let the links speak. Keeping it is recommended, and one wording across every surface changes five files.

**Reported, not edited:** `modules/system_admin.ps1:155` says `reduced` keeps Fast Startup at "roughly 40% of
RAM" while line 162 says the whole file is ~40% - an engine string, and changing one would need a version
cascade. Section 22 carries `Dev = $true` with no behavioural branch anywhere, so `--list --json` reports a
flag that changes nothing. And `WINDOWSWEEP_portfolio-info_2026-09-05.md` says *"Monetization is intentionally
absent - MIT, free"* - out of the content map's scope, and the exact claim the pricing decision forbids, in a
file that feeds public surfaces.

### Row 6's declared schema does not exist

There is no `FAQPage` JSON-LD anywhere on the docs site, and the four blocks that do exist are in `headTags`,
so they are emitted on **every** page - adding `FAQPage` there would claim the CLI reference is an FAQ. It
needs a page-scoped head tag, which is a docs-site code change rather than a copy change. The draft carries
the ready payload for five questions, marked BLOCKED.
