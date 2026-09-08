# site-home - the marketing site's home bands

Content-map row **16** · surface `windowsweep-web/design/windowsweep-web-click-dummy/` · awareness
**unaware to problem-aware, arriving cold** · tone band **P dominant, R strong, W once** · length **a
landing page, 12-15 bands** · CTA **`npx windowsweep --scan` and the desktop download** · schema
**SoftwareApplication, no `offers`, no `isAccessibleForFree`**.

**The beat order this draft actually follows**. It is stated here as the built page runs it, band by band,
because a structure line copied from the row would describe a page that was never built. Read it downward:

> the promise, the gamble and **both** install paths (band 1) -> the proof (2) -> the rehearsal (3) -> the
> guarantees as refusals (4) and the gate underneath them (5) -> what comes back, and the catalogue (6, 7)
> -> the one question (8) -> the second path, shown (9) -> what leaves your machine (10) -> the neighbours
> (11, 12) -> the questions (13) -> contact (14) -> **one** path again (15).

Row 16's structure line reads *"hero promise -> the gamble they already lost -> the guarantees as refusals
-> proof -> the two install paths"*. Three departures, all the design's and all approved: the proof comes
**before** the guarantees rather than after, both install paths are handed over in the **hero** rather than
held to the end, and the close carries **one**. The row is the keeper's to amend; this draft only records
what it is writing against, so the two are not silently different.

This is the front door. Most people who read it have never heard of the product, so the page has to do the
whole job in one scroll: say what it is, name the bargain every cleanup tool asks for, refuse the parts of
that bargain this one refuses, show one real receipt, and hand over two ways to start.

The design was approved at GATE 1 on 2026-09-08 with a sentence this draft writes against:

> **Trust is the CONTENT here, not the aesthetic.** The page argues by disclosure - refusal lists, exact
> counts, one real receipt with its own measurement discrepancy admitted out loud.

A cleaner that buries its refusals in a footer is asking to be believed. This one shows them. The words
below either carry that or they undo it, which is why the refusal band (S-007, S-008) is written as the
emotional centre of the surface rather than as a compliance appendix.

## What this draft covers, and what it does not

Row 16 names **the home bands and `/download`**. `/download` does not exist yet - `design/README.md` §10
lists it under "What is NOT built yet" (A4+), so it has no element to target and no `Was:` line is
possible. The map's own amendment scopes this first pass correctly: *"Row 16 is written first, because the
click dummy's home page is handed to the owner for its own design approval with placeholder-shaped
structure in the bands this surface will fill."* When `/download` exists, its slots are an addition to this
file, not a rewrite of it. **The SmartScreen copy that page will need is already settled** and is reused
verbatim at S-002 below.

**Three things inside the pending blocks are deliberately not re-authored.** Another row owns each:

| Inside a pending block | Owner | Why not here |
|---|---|---|
| The three `<div class="term">` transcripts in S-006 | row 10 `cli-strings` | They are rendered console output. Re-authoring them here would put two surfaces in charge of one string, which is the drift row 15 was created to stop |
| The tier table's six rows (band 6) and the 26 section chips (band 7) | not a pending block | Data, and already correct against `lib/constants.ps1` |
| The receipt's chart, legend and ledger (band 2) | not a pending block | Recorded measurements, sourced in `design/README.md` §2 |

---

## Conventions in this file

- One numbered slot per block, `S-001` upward, no gaps. Each names its band and element.
- **`Was:` reproduces the block's current visible text**, verbatim, with the dummy's source line-wrapping
  collapsed to single spaces. Every quoted sentence is otherwise byte-exact and findable with a
  fixed-string search. Verify one with:

  ```bash
  sed -e 's/<[^>]*>/ /g' index.html | tr -s ' \t\n' ' ' | grep -c -F "the sentence from Was:"
  ```

- The fenced block below `Was:` holds the **shipping HTML** for that block's interior. Substitute the
  interior; leave the wrapper element, its classes, its inline styles and its `data-wsw-copy` attribute
  alone.
- Where a slot changes nothing, `Was:` reads **identical** and the fence is the verbatim current text. Those
  slots are numbered anyway so the applier can see they were read rather than missed.
- 🔴 **Line numbers are NOT part of the contract.** This dummy has a second agent writing to it right now;
  during this draft the marker was renamed `data-ws-copy` -> **`data-wsw-copy`** and the header and footer
  moved out of `index.html` into `shell.js`, shifting every line. Apply by fixed-string search.
- **Snapshot the quotes were taken against:** `index.html` md5 `cfcc9cf700df392acca6532965957eff` (863
  lines, 28 marked blocks) · `shell.js` md5 `98a9a254ddf74c785694e54c76fa22d2`. Every pending block's *text*
  was diffed against the earlier 931-line snapshot and is unchanged; only structure moved.
- **en-GB** throughout. `Favorites`, `Saved Games`, `Local Storage` and `Preferences` keep their US spelling
  because they are Windows and Chromium folder names, not prose.

## Where the slots live

| File | Slots | Marked `pending` today |
|---|---|---|
| `index.html` | S-001 - S-028 | 28 |
| `shell.js` (the shared footer, extracted mid-draft) | S-029 - S-030 | 1 |
| **Applied total** | **30** | **29** |
| `index.html` band 15, **conditional, not applied** | S-031 | n/a - the element does not exist |

**Thirty slots apply; S-031 is a thirty-first that does not.** It is written and held against a dummy
change this draft may not make, it is numbered after the footer rather than inside band 15 so the applied
sequence stays gapless, and its words are excluded from every figure in the self-check. The hand-back's
block count is unchanged at 30.

🔴 **One block lost its marker in the refactor, and a grep-driven applier would miss it.** `design/README.md`
§11 states **30 blocks** and gives `grep -c` as the way to list them. That grep now returns 28, because two
footer blocks moved into `shell.js` and the brand tagline arrived there as a plain
`el('p', 't-sm ink-2', '...')` with no `data-wsw-copy` attribute (`shell.js:142`). `ANALYTICS_NOTICE` kept
its marker (`shell.js:161`); the tagline did not. **The count is still 30 in substance** - that is what this
inventory maps - but the hand-back mechanism under-reports by one. Reported, not fixed: `shell.js` is
outside this draft's scope.

## Slots that change, and slots that do not

**Twenty-two change. Eight are kept verbatim** - S-013, S-017, S-021, S-023, S-025, S-026, S-027, S-028 -
because the placeholder already says the true thing in this voice, and rewriting a good sentence to prove a
pass happened is how an approved line gets quietly worse.

## The two counts this draft declines to assert

**Decided in round 2, and the decision is the finding rather than a number.** No self-test count and no
audit count appears anywhere on this surface.

**The self-test count** was in three slots - S-001's hero chip, S-019's zero-network fact, S-024's
"how do I check it" answer. It is now in none. The reason is not that any of the candidates was wrong; it
is that **every one of them is release-coupled by construction**. The site brands **1.1.0** in three places
outside every pending block, the shipped 1.1.0 binary prints **151**, and the source at `HEAD` runs
**155** on the way to an unreleased 1.2.0. A tally on the front door is therefore a number that goes stale
on a schedule nobody is watching, on the page whose entire design argument is that its numbers can be
checked. S-019 loses nothing by it: *check [9] greps the source for HTTP and socket calls and fails the
build if it finds one* is the whole guarantee, and being one of N never made it truer. S-024 keeps what was
always the evidence - a real junction, a 445-character path, and a fixture tree hashed before and after.

**The audit count** is the same decision reached from the opposite direction: the sources disagree
(`README.md:105` says three read-only audits, the tier table at `docs/safety-model.md:74` puts five
sections in the report-only tier), and no slot here asserted one. None now will. Both counts are recorded
under **Counts, and why neither is asserted** at the end of this file, with the evidence, so the next
writer does not rediscover the question.

## Two facts this draft corrects

1. 🔴 **"The first two write nothing at all" is false** (S-005). A dry-run is not one of the quiet modes -
   `windowsweep.ps1:285` lists only `help`, `version` and `list` - so it initialises a log and
   `Initialize-Report` runs unconditionally. It writes **two files, both its own, and none of yours**. This
   is Bible §3 commitment 2 as corrected on 2026-09-07, reaching this surface for the first time.
2. 🔴 **`--i-understand-deep` reaches four sections, not two** (S-012). The placeholder implied the flag
   gates only 11 and 16. It gates four. `README.md`'s own IMPORTANT block names the hibernation file and
   disk-image compaction alongside them.

---

# Band 1 - Hero

## S-001 · band 1 · `.hero-grid > div[data-wsw-copy]` - eyebrow, headline, two ledes, the fact chips

**Was:** `Windows 10 and 11 · PowerShell 5.1 · nothing to install` / `It names every&nbsp;path before it
touches&nbsp;one.` / `windowsweep reclaims the disk space that quietly disappears on a Windows machine —
package and build caches, browser and app caches, Windows temp and update leftovers, stale node_modules,
half-finished downloads. It asks whether you are a developer, keeps what you used recently, and refuses
your files outright.` / `Start with --scan. It deletes nothing.` / `26 numbered sections` `151 self-test
checks` `0 network calls from the CLI` `0 dependencies`

```html
<p class="eyebrow eyebrow-a">Windows 10 and 11 · PowerShell 5.1 · nothing to install</p>
<h1 class="display">It names every&nbsp;path before it touches&nbsp;one.</h1>
<p class="lede stack" style="margin-top: var(--sp-6)">
  windowsweep reclaims the disk space that quietly disappears on a Windows machine: package and
  build caches, browser and app caches, Windows temp and update leftovers, stale
  <span class="mono">node_modules</span>, half-finished downloads. It keeps the caches you used
  recently, and it refuses your documents, credentials and browser profiles outright. No flag
  lifts that.
</p>
<p class="lede" style="margin-top: var(--sp-4)">
  The usual bargain with a cleanup tool is that you approve a deletion you have not seen. Start
  with <span class="mono">--scan</span>. It deletes nothing.
</p>

<div class="hero-facts">
  <span><b>26</b> numbered sections</span>
  <span><b>0</b> network calls from the CLI</span>
  <span><b>0</b> dependencies</span>
</div>
```

**Why.** The headline is kept: it is the product's own central sentence and the one the `<title>` and the
`og:title` already carry, so changing it here would put four surfaces out of step for a preference. The
lede gains the beat the row's structure asks for and the placeholder had nowhere - **the gamble** - and it
is framed as the shape of the transaction rather than as something the reader did wrong, because the Bible
bans shame about the mess and this reader may never have been burned at all. `--scan` moves to the end of
the second lede so the paragraph closes on its shortest sentence, which is the fingerprint's rhythm rule.
The em dash becomes a colon. The fingerprint allows one per 150 words and this band is 92, so spending it
here would leave none for the places that earn it.

**The chip row drops to three, and a fourth was not invented to fill the gap.** `154 self-test checks`
comes out under the round-2 decision above. The obvious replacements were each read and each refused.
**66 protected subtrees**, or any of band 5's display counts, carries the identical defect - a tally that
moves with a release nobody re-reads, which is the whole reason the self-test count is leaving. **The
receipt's 3,924,712,402** is one machine's result and the Bible forbids a gigabyte figure stated as a
promise; in a hero chip it would read as exactly that. And **a third `0`** would turn a row of facts into a
device. So the row is three. What is left cannot go stale: 26 is frozen by the section contract, and both
zeros are properties the engine's own self-test enforces rather than counts of anything.
`.hero-facts` is `display: flex; flex-wrap: wrap`, so three reflow with no layout change and nothing in
the dummy needs touching for it. Nothing to design around.

---

## S-002 · band 1 · `p.t-xs.ink-3` under the download button - the installer caption

**Was:** `windowsweep_1.1.0_x64-setup.exe · 2.37 MB · released 2026-09-07. There is no code-signing
certificate, so SmartScreen will warn on first run. Two things are verifiable instead: a SHA-256 checksum
and a minisign signature, both published beside the installer.`

```html
<span class="mono">windowsweep_1.1.0_x64-setup.exe</span> · 2,483,662 bytes · released
2026-09-07. The installer is not signed with a paid code-signing certificate, so SmartScreen
warns on first run. Every release publishes a SHA-256 checksum and a minisign signature the
app's own updater checks; neither is a code-signing certificate.
```

**Why.** Two sentences of GATE-4-approved copy, reused **verbatim** rather than paraphrased a third time.
They are slot **S-006** of `desktop-readme.md`, which is the same fact at caption length and is already
shipping in `README.md:367`. Slot **S-015** of that draft is the fuller treatment and it cannot go in a
`t-xs` caption under a button - it is three paragraphs, 117 words, with its own `###` heading and the
*"More info -> Run anyway"* instruction. **S-015 is what `/download` should carry when that page exists**,
and this caption is the same claim in the register this element has room for; no third phrasing was
invented. Two corrections ride along. **"There is no code-signing certificate"** loses the word *paid* and
so reads as a claim about the file rather than about what was bought - the exact confusion S-015's second
paragraph exists to prevent, and the decision log records it. And **2.37 MB is the mebibyte figure wearing
a decimal label**: the installer is 2,483,662 bytes, which is 2.37 MiB but 2.48 MB, and the receipt band
four hundred pixels below prints a 13-digit byte count. Bytes are the honest unit. They are already this
page's vocabulary, on a page whose whole argument is that its numbers can be checked by anyone who cares
to.

---

# Band 2 - The receipt

## S-003 · band 2 · `.rc-head` - eyebrow, the total, the lede

**Was:** `One machine, one run · 7 September 2026` / `3,924,712,402` `bytes removed` / `This is not a
promise and not an average. It is what one authorised run did on one Windows machine, on one day, with
nothing refused. Your machine will be a different number, and --scan is how you find out what it is.`

```html
<p class="eyebrow eyebrow-a">One machine, one run · 7 September 2026</p>
<div class="rc-total">
  <span class="mega">3,924,712,402</span>
  <span class="rc-unit">bytes removed</span>
</div>
<p class="lede">
  One authorised run, on one Windows machine, on one day. That is the whole claim. It is not an
  average and it is not a promise, because your disk decides the number and
  <span class="mono">--scan</span> is how you read it.
</p>
```

**Why.** Reordered so the paragraph opens on what the number **is** and only then says what it is not. The
placeholder opened on two denials, which makes a reader look for the thing being denied before they have
been told what they are looking at. "That is the whole claim" is the five-word sentence this band needs for
rhythm, sitting between a ten-word and a twenty-four-word neighbour. The Bible's §10 rule is never to
promise a number, and here it is delivered as a refusal rather than as a disclaimer. Band R doing an
asterisk's job.

🔴 **And the clause "with nothing refused" is gone, because on this page the word already had a different
job.** One screen above, the hero says windowsweep *"refuses your documents, credentials and browser
profiles outright. No flag lifts that."* Band 3's transcript then prints a `refused` line. That is twice
before the receipt. Arriving at it, a cold reader meets *"with nothing refused"* as **no holds
barred** - a run with the restraints switched off - which is the opposite of what the page has spent its
first two bands establishing, and it is the reading a person gets before band 4 ever defines the term.
Three jobs, one word, none of them taught yet. The datum itself is not lost and is not this slot's to
carry: the evidence ledger beside the chart keeps
it under its own label, where a term of art is read as a term of art. 🔴 **What that ledger figure counts
is deliberately not stated here.** The fact-checker owns it. Whether `refused: 0` means no protected path
was encountered during the run, or none was reached, or something narrower again, is a question about the
run record rather than about this sentence - and a lede is the wrong place to guess at it.

---

## S-004 · band 2 · `p.rc-caveat` - the two numbers that disagree

**Was:** `The two numbers on this page do not agree, and that is expected. windowsweep counted
3,924,712,402 bytes removed. Windows reported free space on C: rising from 5.84 GB to 9.85 GB — a gain of
4.01 GB. The tool counts what it deleted; Windows counts what is free, at a slightly later moment, on a
volume other programs are also using. Anyone printing one round number is hiding this gap rather than not
having it.`

```html
<b>The two numbers on this page do not agree, and that is expected.</b>
windowsweep counted 3,924,712,402 bytes removed, which is 3.92 GB. Windows reported free space
on <span class="mono">C:</span> rising from 5.84 GB to 9.85 GB, a gain of 4.01 GB. The tool
counts what it deleted. Windows counts what is free, a moment later, on a volume other programs
are also writing to. Printing one round number would hide that gap rather than close it.
```

**Why.** This is the strongest sentence on the page and it very nearly did not work, because the reader
could not see the gap. 3,924,712,402 against "5.84 to 9.85" is two units and a subtraction away from
being legible, so **3.92 GB** is stated - a division, not a new measurement, and the same figure
`design/README.md` §2 already carries. No new number. The long semicolon clause splits into two, which is
where the contrast actually lands: *"The tool counts what it deleted. Windows counts what is free."* The
closing sentence loses "Anyone printing". That was a claim about competitors. This project cannot verify
one and the map's §4 already refuses to make one, so what stands instead is a claim about arithmetic. It
holds alone.

---

# Band 3 - The honesty sequence

## S-005 · band 3 · `.band-head`

**Was:** `How a run goes` / `Nothing goes until you have seen its path.` / `Three commands, in order. The
first two write nothing at all.`

```html
<p class="eyebrow">How a run goes</p>
<h2 class="h-band">Nothing goes until you have seen its path.</h2>
<p class="lede">Three commands, in order. The first two write nothing of yours.</p>
```

**Why.** Four words changed and one of them was false. **"Write nothing at all" is not true of a
dry-run**: it is not one of the quiet modes, so it initialises a log and `Initialize-Report` runs
unconditionally - a `--only 0 --dry-run --yes` run took the logs directory from 154 files to 155 and
reports from 11 to 12. The Bible's §3 commitment 2 was corrected to *"a dry-run that writes nothing of
yours - two files of its own, and nothing else"* on 2026-09-07 for exactly this reason, and this is the
first surface the correction reaches. It is also a claim a reader can falsify in one command, on the band
whose heading is about honesty.

---

## S-006 · band 3 · `ol.rail` - three numbered steps

**Was:** `Scan. Read-only.` / `Every declared target is measured and nothing is touched. You get sizes, per
section, before you have agreed to anything.` / `Dry-run. Still writes nothing.` / `Every deletion helper
short-circuits and every destructive external command is intercepted. You see the exact paths a real run
would remove, and the estimate it would reclaim. The self-test hashes a fixture tree before and after a
dry-run to prove nothing changed.` / `Run. Now it deletes.` / `Caches go permanently, because they
regenerate. Personal files you selected go to the Recycle Bin, where Windows keeps the undo. Two sections
have no undo of any kind and sit behind their own flag.`

🔴 The three `<div class="term">` transcripts inside this block are **row 10 `cli-strings`** and are left
byte-for-byte alone, because a console line that appears on this page and in a terminal must be one string
owned by one row rather than two surfaces agreeing by luck. Only the prose changes.

```html
<!-- step 1 -->
<h3>Scan. Read-only.</h3>
<p class="ink-2">Every declared target is measured and nothing is touched. You get sizes, section
  by section, before you have agreed to anything.</p>

<!-- step 2 -->
<h3>Dry-run. Still writes nothing of yours.</h3>
<p class="ink-2">Every deletion helper short-circuits and every destructive external command is
  intercepted. You see the exact paths a real run would remove, and the estimate it would
  reclaim. It writes two files of its own, a log and a report, and none of yours. The self-test
  hashes a fixture tree before and after a dry-run to prove the tree did not change.</p>

<!-- step 3 -->
<h3>Run. Now it deletes.</h3>
<p class="ink-2">Caches go permanently, because they rebuild. Personal files you selected go to
  the Recycle Bin, where Windows keeps the undo. Two sections have no undo of any kind, and they
  sit behind their own flag.</p>
```

**Why.** Step 2 carries the same correction as S-005 and then does the thing the correction makes
possible: it **names the two files**. "Writes nothing of yours" invites the question *then what does it
write*, and answering it in the next clause is worth more than the absolute claim it replaces, because the
absolute claim was checkable and wrong. The self-test sentence changes "prove nothing changed" to "prove
the tree did not change", which is what the hash actually proves - the fixture tree, not the machine.
"Regenerate" becomes "rebuild": the glossary lists **rebuild** in the use column and the whole page says
rebuild everywhere else. One synonym begins a drift.

---

# Band 4 - The refusal list

## S-007 · band 4 · `.band-head`

**Was:** `The safety model` / `A list of things it will not do.` / `Not adjectives. The refusals are
enumerated, counted, and printed on demand by --list-targets. No flag bypasses any of them.`

```html
<p class="eyebrow">The safety model</p>
<h2 class="h-band">A list of things it will not do.</h2>
<p class="lede">Not adjectives. Every refusal below is counted, enumerated, and printed on demand
  by <span class="mono">--list-targets</span>. No flag lifts one of them.</p>
```

**Why.** "Not adjectives." stays exactly as it is. It is a two-word fragment opening the page's most
important band, and the clearest statement of the difference between this product and the word *safe*. "The
refusals" becomes "Every refusal below". It points at the eight items the reader is about to read rather
than at an abstraction. "Bypasses" becomes **lifts**, the verb the chokepoint band and S-011 use.
One idea, one word, three bands.

---

## S-008 · band 4 · `ul.refuse` - eight refusals

**Was:** eight `<li>` blocks headed `Your files` / `Your credentials and agent state` / `Toolchains and
installed software` / `Browser profiles` / `Editor state` / `Windows itself` / `Anything reached through a
link` / `Anything outside the section's own declared root`, opening `Documents, Pictures, Music, Videos,
Desktop, Contacts, Favorites, Links, Saved Games, Searches, 3D Objects — and OneDrive, Dropbox, Google
Drive and iCloud Drive with them.`

```html
<li>
  <h3>Your files</h3>
  <p>Documents, Pictures, Music, Videos, Desktop, Contacts, Favorites, Links, Saved Games,
    Searches and 3D Objects, with OneDrive, Dropbox, Google Drive and iCloud Drive beside
    them. Refused unconditionally. There is no flag, no profile and no configuration file that
    reaches any of them.</p>
</li>
<li>
  <h3>Your credentials and agent state</h3>
  <p class="mono">.ssh .gnupg .aws .azure .kube .gcloud .docker .secrets .config .local .claude
    .codex .agents .gemini .copilot .ollama</p>
</li>
<li>
  <h3>Toolchains and installed software</h3>
  <p>npm globals, nvm, Volta, fnm, corepack, the pnpm global store, bun, deno, cargo and go
    binaries, <span class="mono">.rustup</span>, <span class="mono">Programs</span>,
    WindowsApps, the Android SDK, JetBrains Toolbox. The caches these tools keep are fair game.
    The tools are not.</p>
</li>
<li>
  <h3>Browser profiles</h3>
  <p>Cookies, logins, history, bookmarks, extensions, Local Storage, IndexedDB, Sync Data,
    Preferences. A profile is refused twice over: once because its path is protected, and again
    because its folder name is not on the allowlist of cache folders this tool knows how to
    clear.</p>
</li>
<li>
  <h3>Editor state</h3>
  <p class="mono">settings.json · keybindings.json · snippets · globalStorage · local History</p>
</li>
<li>
  <h3>Windows itself</h3>
  <p>Prefetch, because clearing it slows the next boot. <span class="mono">Windows\Installer</span>,
    WinSxS, System Volume Information, the registry hives, and the page and swap files.</p>
</li>
<li>
  <h3>Anything reached through a link</h3>
  <p>The walker reads the reparse-point attribute before it descends, so a junction or symlink is
    removed as a link and its target is never entered. The self-test proves that with a real
    junction and a 445-character path, on your machine, before you trust it.</p>
</li>
<li>
  <h3>Anything outside the section's own declared root</h3>
  <p>Every deletion asserts that the path lies strictly inside the target root its calling section
    declared. A section cannot reach into another section's territory, or out of the tool's,
    by accident.</p>
</li>
</ul>
```

**Why.** The list was already right; what it lacked was band R landing anywhere. Three additions do that,
each a **specific refusal** rather than an adjective, which is the Bible's definition of the band. *"There
is no flag, no profile and no configuration file that reaches any of them"* answers the question a
sceptical reader is actually holding - *what if I turn something on* - at the top of the list rather than
in the chokepoint band two screens later. *"The caches these tools keep are fair game. The tools are not."*
is the whole product in nine words. It belongs beside the toolchain list, which otherwise reads as
inventory. That is band R. The junction item now ends on **"on your machine, before you trust it"**, moving the proof from
something the project did to something the reader can do. The Prefetch parenthesis becomes its own clause,
because a reason in brackets reads as an afterthought and that reason is the interesting half.

---

# Band 5 - The chokepoint

## S-009 · band 5 · `.band-head`

**Was:** `One function` / `Every deletion goes through the same gate.` / `There is no second path to a
delete. Five ordered refusals, and a flag can change how much of a cache goes — never where the tool may
reach.`

```html
<p class="eyebrow">One function</p>
<h2 class="h-band">Every deletion goes through the same gate.</h2>
<p class="lede" style="margin-inline: auto">There is no second route to a delete. Five ordered
  refusals, and a flag can change how much of a cache goes. Never where the tool may reach.</p>
```

**Why.** The em dash becomes a full stop, which is what the fingerprint asks for and what the sentence
wanted anyway: **"Never where the tool may reach."** is a five-word refusal, and as a trailing clause it
was carrying the band's whole point in a subordinate position. "Path" becomes "route" because *path* is a
glossary term on this page meaning a filesystem path, and the sentence is about control flow.

---

## S-010 · band 5 · `ol.choke-list` - the five ordered refusals

**Was:** `Traversal. Paths with .. segments, UNC paths and drive roots are refused outright.` / `Roots.
Fifteen declared entries — every drive root, Windows, System32, SysWOW64, both Program Files, ProgramData,
C:\Users, your profile root and the three AppData roots.` / `Protected lists. Sixty-six subtrees, fifty
patterns and thirteen file names, with two declared exceptions tested first so they are a carve-out rather
than an oversight.` / `Containment. The path must lie strictly inside the target root the calling section
declared.` / `The tool's own data. Lifted only by --prune-history and --uninstall-data, which exist to
delete windowsweep's own logs.`

```html
<li><span><b>Traversal.</b> Paths with <span class="mono">..</span> segments, UNC paths and drive roots are refused outright.</span></li>
<li><span><b>Roots.</b> Fifteen declared entries: every drive root, Windows, System32, SysWOW64, both Program Files, ProgramData, <span class="mono">C:\Users</span>, your profile root and the three AppData roots.</span></li>
<li><span><b>Protected lists.</b> Sixty-six subtrees, fifty patterns and thirteen file names, with two declared exceptions tested first, so they are a carve-out rather than an oversight.</span></li>
<li><span><b>Containment.</b> The path must lie strictly inside the target root the calling section declared.</span></li>
<li><span><b>The tool's own data.</b> The one step a flag can lift, by <span class="mono">--prune-history</span> or <span class="mono">--uninstall-data</span>, which exist to delete windowsweep's own logs.</span></li>
```

**Why.** Step 5 is rewritten and the rest is left alone. "Lifted only by" states the exception without
first saying that an exception exists, so a reader scanning five parallel refusals meets the one that
behaves differently without being told it does - and then S-011 says *"steps 1 to 4 have no override"*,
which now has an antecedent. Naming it **the one step a flag can lift** is the honest ordering: the
carve-out is announced, then bounded, and both flags only reach the tool's own logs. Step 2 loses its dash.
The list already ran at one em dash per item, against a budget of one per 150 words.

---

## S-011 · band 5 · `p.t-sm.ink-3` centred - the override note

**Was:** `Steps 1 to 4 have no override. --purge-all changes how much of a cache goes, never where the tool
may reach.`

```html
Steps 1 to 4 have no override, and no flag adds one.
<span class="mono">--purge-all</span> changes how much of a cache goes, never where the tool may
reach.
```

**Why.** Six words added, because "no override" describes today and *"no flag adds one"* describes the
design. A reader who has been burned by a cleaner is not asking whether a switch exists; they are asking
whether one could. This is the same refusal S-008 opens with, restated where the mechanism is on screen -
the Bible's chokepoint motif, one door and no side entrances.

---

# Band 6 - What it deletes, by tier

## S-012 · band 6 · `.band-head`

**Was:** `What comes back` / `Six tiers, and two of them are permanent.` / `Most of what windowsweep
removes rebuilds itself the next time you need it. Two sections do not, and they are the two behind
--i-understand-deep.`

```html
<p class="eyebrow">What comes back</p>
<h2 class="h-band">Six tiers, and two of them are permanent.</h2>
<p class="lede">Most of what windowsweep removes rebuilds itself the next time you need it. Two
  sections do not: emptying the Recycle Bin, and clearing the event logs. Both sit behind
  <span class="mono">--i-understand-deep</span>, along with the hibernation file and disk-image
  compaction.</p>
```

**Why.** The placeholder said the flag gates *"the two"*. That reads as exhaustive. `README.md`'s own
IMPORTANT block puts four things behind `--i-understand-deep`: sections 11 and 16,
which are permanent, plus the hibernation file and disk-image compaction, which are reversible. Naming the
two permanent sections in prose also stops the reader having to find rows 11 and 16 in the table below to
learn what "permanent" means - and it is the sentence the fingerprint already models at specimen 11.

---

# Band 7 - The 26 sections

## S-013 · band 7 · `.band-head`

**Was:** identical - kept verbatim.

```html
<p class="eyebrow">The catalogue</p>
<h2 class="h-band">Twenty-six numbered sections, 0 to 25.</h2>
<p class="lede">The numbers are a public contract. A section can be retired as a no-op that says
  so; it is never renumbered, so a script pinned to <span class="mono">--only 7</span> keeps
  meaning what it meant.</p>
```

**Why.** Kept. It is already the fingerprint's specimen 12 in prose - *"a section number is a promise"* -
with a short declarative, a semicolon joining two related facts, and a closing clause that names the
consequence for a reader who automates. Nothing here reads as placeholder.

---

# Band 8 - Developer mode

## S-014 · band 8 · `.devsplit > div[data-wsw-copy]` - eyebrow, heading, lede

**Was:** `Developer mode` / `One question, on the first run.` / `A cleaner that clears every cache it finds
trades one problem for another: the next yarn install downloads the lot again and your afternoon is gone.
So windowsweep asks once, remembers the answer, and changes what sections 1 to 5 do with it.`

```html
<p class="eyebrow eyebrow-a">Developer mode</p>
<h2 class="h-band">One question, on the first run.</h2>
<p class="lede" style="margin-top: var(--sp-4)">
  A cleaner that clears every cache it finds trades one problem for another: the next
  <span class="mono">yarn install</span> downloads all of it again. So windowsweep asks once,
  remembers the answer, and changes what sections 1 to 5 do with it.
</p>
```

**Why.** One clause cut. *"And your afternoon is gone"* is a good line and it is band W, which row 16
budgets at **once** for the whole surface - and this band sits directly above the two panels that describe
what gets deleted, which is the wrong neighbourhood for an aside under the Bible's rule against humour
near a destructive action. The W is spent at S-022 instead, thirteen hundred words away from any command.
What survives is the gamble, stated flat. That is the band's job.

---

## S-015 · band 8 · `.devout div[data-value="yes"] .panel` - the developer-mode answer

**Was:** `Caches you used recently are kept.` / `The idle gate applies: a cache file goes only when its
newest timestamp is at least 100 days old, and the newest version of every versioned tool — Cypress,
Playwright, Gradle distributions, Squirrel builds — is never removed.` / `Windows disables last-access
updates on most volumes, so the tool reads the newest of three timestamps and errs toward "recently used".
The consequence is that it keeps more, never less.`

```html
<h3 class="h-sub">Caches you used recently are kept.</h3>
<p class="t-sm ink-2">The idle gate applies. A cache file goes only when its newest timestamp is
  at least 100 days old, and the newest version of every versioned tool is never removed -
  Cypress, Playwright, Gradle distributions, Squirrel builds.</p>
<p class="t-sm ink-2">Windows disables last-access updates on most volumes, so the tool reads the
  newest of three timestamps and errs toward "recently used". It keeps more than it strictly
  needs to. Never less.</p>
```

**Why.** The first sentence had two em-dash pairs inside one 38-word sentence, over the fingerprint's
34-word ceiling and over its dash budget twice. Two problems, one split. Breaking on "The idle gate
applies." and moving the four-tool list to the end costs nothing, and it gives the paragraph a four-word
opener. The second paragraph
ends on **"Never less."** as its own sentence, because "the consequence is that it keeps more, never less"
buries the reassurance inside a summary clause, and a summary sentence restating its own paragraph is on
the fingerprint's list of tells.

---

## S-016 · band 8 · `.devout div[data-value="no"] .panel` - the non-developer answer

**Was:** `Those caches are cleared completely.` / `If you do not build software on this machine, a
four-gigabyte Gradle cache is not worth keeping and the idle gate has nothing to protect.` / `Nothing about
this answer changes what the tool may reach. The refusal lists are identical either way — it changes only
whether a cache is pruned by the idle gate or emptied.`

```html
<h3 class="h-sub">Those caches are cleared completely.</h3>
<p class="t-sm ink-2">If you do not build software on this machine, a four-gigabyte Gradle cache
  is not worth keeping and the idle gate has nothing to protect.</p>
<p class="t-sm ink-2">Nothing about this answer changes what the tool may <em>reach</em>. The
  refusal lists are identical either way. It decides only whether a cache is pruned on the idle
  gate or emptied.</p>
```

**Why.** The em dash splits into a full stop, so the guarantee - *"the refusal lists are identical either
way"* - stands as its own sentence instead of trailing into a qualifier. That is why the panel exists. A
reader picking "no" needs to know they have not just widened the blast radius. "It changes only" becomes
"It decides only", because the subject is the answer and an answer decides.

---

# Band 9 - The desktop app

## S-017 · band 9 · `.band-head`

**Was:** identical - kept verbatim.

```html
<p class="eyebrow">If you would rather not type</p>
<h2 class="h-band">The same engine, in a window.</h2>
<p class="lede">The desktop app runs the same PowerShell script with
  <span class="mono">--json --no-color</span> and reimplements no cleanup logic at all. What it
  adds is a picture of what is about to happen.</p>
```

**Why.** Kept. "Reimplements no cleanup logic at all" is the claim that makes the whole band safe to read
- the window cannot have a different safety model, because it has no model of its own - and it is a
refusal rather than a feature, which is band R doing the work in a band otherwise full of screenshots.
The eyebrow is the second install path's entire pitch in six words.

---

# Band 10 - What leaves your machine

🔴 **This band is a safety surface.** Humour is off in all three slots. Row 17 `site-privacy` is marked so
explicitly and this band is the same disclosure at home-page length: the reader is being **told**, not
asked, and no sentence may soften the absence of an opt-out into a promise it is not.

## S-018 · band 10 · `.band-head`

**Was:** `What leaves your machine` / `Two answers, because there are two programs.` / `They are different,
so they are printed next to each other at the same size.`

```html
<p class="eyebrow">What leaves your machine</p>
<h2 class="h-band">Two answers, for three programs.</h2>
<p class="lede">The window runs the same engine, and it is still a different program; this website
  is a third. What leaves your machine depends on which of the three you are using. The site
  gives the window's answer, not the engine's.</p>
```

**Why.** One sentence stands between *"The same engine, in a window"* and the two panels, and the
placeholder spent it on the furniture: *"they are printed side by side at the same size"*. Which the
layout already demonstrates. Narrating it left the reader to work out the one thing they actually need at
that point in the scroll - **that "the same engine" does not mean "the same answer"**. A reader who has just been told the window reimplements no cleanup logic will carry that
identity straight into a band about network traffic unless something stops them. The new lede stops them in
three sentences: the window runs the engine and is still a separate program, this website is a third, and
the site answers with the window.

🔴 **And the heading's arithmetic was wrong.** *"Two answers, because there are two programs"* counts two.
The right-hand panel names two things by itself, and the content map's row 17 note names **three different
programs**. The honest binary here is of **answers**, so the heading now counts answers and states the real
program total: *"Two answers, for three programs."* It takes the shape of "One question, on the first run."
two bands up, which is already this page's H2 rhythm.

🔴 **Ordering, not softening.** Neither half moved. Neither acquired a qualifier. The left panel still says
the command line sends nothing and check [9] fails the build over it; the right panel still says there is
no opt-out switch and that this is a notice rather than a consent request. What changed is that the reader
now knows **which panel this website belongs to before they read either**, instead of reconciling it at the
bottom of the right-hand panel in the smallest text on the page. Putting the site on the window's side of
the line is the disclosure doing its job earlier, not doing less of it - and the engine's clean record is
not used to colour the window, nor the window's telemetry to colour the engine, because the lede sorts the
three and then stops talking.

---

## S-019 · band 10 · left `.panel.pad` - the command line

**Was:** `The command line sends nothing.` / `No telemetry.` / `No update check.` / `No network calls of
any kind. A self-test check greps the source for HTTP and socket calls, and it is one of the 151.` /
`Crash bundles stay on disk. Session logs and reports stay on disk. The only time it opens a browser is
when you ask it to report an issue.`

```html
<h3 class="h-sub">The command line sends nothing.</h3>
<ul class="factlist">
  <li class="f-no">…<span>No telemetry.</span></li>
  <li class="f-no">…<span>No update check.</span></li>
  <li class="f-no">…<span>No network calls of any kind. Self-test check [9] greps the source for
    HTTP and socket calls and fails the build if it finds one.</span></li>
</ul>
<p class="t-sm ink-3">Crash bundles stay on disk. Session logs and reports stay on disk. The only
  time it opens a browser is when you ask it to report an issue.</p>
```

*(The three `<svg>` icons inside the `<li>` elements are unchanged; `…` marks where each one stays.)*

**Why.** The third fact gains the half that makes it a guarantee rather than a habit. A grep is a
description. A check that **fails the build** is an enforcement, and it is the reason the Bible's §3
commitment 3 still holds for the engine after the desktop window stopped qualifying. Naming it **check
[9]** matches how the safety model and the decision log refer to it, so a reader who goes looking finds
the same label. One label, three documents.

🔴 **And the tail "and it is one of the 151" is gone rather than updated.** Its job was to make the check
sound corroborated by a large number, which is the one thing a build gate does not need: the enforcement is
the guarantee, and check [9] would fail the build if it were the only check in the file. The tally never
made it true. What the tail did do was pin the sentence to a release, so a page branded 1.1.0 would have
printed the count of a version that has not shipped. Round 2's decision above covers all three
occurrences.

---

## S-020 · band 10 · right `.panel.pad` - the window and the website

**Was:** `The desktop window and this website do send analytics.` / `Usage events go to Google Analytics
4, Amplitude and Microsoft Clarity. Errors go to Sentry.` / `Clarity records session replays — your
interactions with the interface, not the contents of your disk.` / `There is no opt-out switch. This is a
notice, not a consent request.` / `No file path, file name or scan result is ever part of an analytics
event. If you want a cleanup that transmits nothing at all, that is the command line, and it is the same
engine.`

```html
<h3 class="h-sub">The desktop window and this website do send analytics.</h3>
<ul class="factlist">
  <li class="f-yes">…<span>Usage events go to Google Analytics 4, Amplitude and Microsoft
    Clarity. Errors go to Sentry.</span></li>
  <li class="f-yes">…<span>Clarity records session replays: your interactions with the interface,
    not the contents of your disk.</span></li>
  <li class="f-yes">…<span>There is no opt-out switch. This is a notice, not a consent
    request.</span></li>
</ul>
<p class="t-sm ink-3">Never a file path, never your user name, never the contents of anything. If
  you want a cleanup that transmits nothing at all, that is the command line, and it is the same
  engine.</p>
```

*(The three `<svg>` icons are unchanged; `…` marks where each one stays.)*

**Why.** The two sentences that carry the whole disclosure - **"There is no opt-out switch. This is a
notice, not a consent request."** - are reproduced without a syllable changed, because they were already
exact and any softening of them is the failure this band exists to prevent. One line is replaced. *"No
file path, file name or scan result is ever part of an analytics event"* becomes **"Never a file path,
never your user name, never the contents of anything."** - which is the voice fingerprint's specimen 9,
the sentence that replaced the false one on 2026-09-07, and the string the product actually ships in
`consent.neverSent` and on the desktop app's Home ledger. Three surfaces, one sentence. It also drops
*scan result*, which the placeholder claimed and which is not on the shipped never-sent list, and it adds
*your user name*, which is. The em dash before "your interactions" becomes a colon.

---

# Band 11 - The family

## S-021 · band 11 · `.band-head`

**Was:** identical - kept verbatim.

```html
<p class="eyebrow">Three tools, one idea</p>
<h2 class="h-band">The other two machines you own.</h2>
```

**Why.** Kept. Seven words that assume the reader has a Linux box or a Mac somewhere, which for this
audience is a safe assumption and a warmer one than "also available for". This block carries no lede in
the dummy and does not need one; the strip below it says the rest.

---

# Band 12 - Also by the same developer

## S-022 · band 12 · `.band-head` — 🔴 **the surface's single W line**

**Was:** `Also by the same developer` / `Other things built here.` / `Not advertising. These are the
developer's own projects, and there is no ad network on this site — the privacy notice above promises none,
and adding one would make it a lie.`

```html
<p class="eyebrow">Also by the same developer</p>
<h2 class="h-band">Other things built here.</h2>
<p class="lede">Not advertising. These are the developer's own projects, and there is no ad
  network on this site. The privacy notice above promises none, so adding one would mean editing
  that promise first. Which is the only kind of promise worth writing down.</p>
```

**Why, and why here.** Row 16 allows **one** W line and this is it: *"Which is the only kind of promise
worth writing down."* It is the dry aside of someone who has watched policy pages get quietly amended -
never at the reader's expense and never at the data's - and it lands in the band furthest from any
destructive command on the page, which is what the Bible requires of humour. It also does real work. The
placeholder's *"adding one would make it a lie"* is true but abstract; naming the **mechanism** - the copy
has to be edited first, so the promise is load-bearing rather than decorative - is the same argument the
receipt band makes about numbers, and it is the standing rule in the Bible's §10 that the app's privacy
copy binds. The em dash splits into a full stop, and the sentence fragment beginning "Which" is deliberate.

---

# Band 13 - Docs and FAQ

## S-023 · band 13 · `.band-head`

**Was:** identical - kept verbatim.

```html
<p class="eyebrow">Before you run it</p>
<h2 class="h-band">The questions this tool actually gets.</h2>
```

**Why.** Kept. "Actually gets" claims the list is real rather than invented for the page, which is true -
the content map's §3 records that these come from the product's own FAQ and troubleshooting pages, with an
honesty note that no search-volume data exists for this project yet.

---

## S-024 · band 13 · `.faq` - six disclosure entries

**Was:** six `<details>` headed `Will it delete my files?` / `What can I never get back?` / `Do I need
Administrator rights?` / `How do I check it before trusting it?` / `Can I run it on a schedule?` / `What
about Windows Server, Linux and macOS?`, with `windowsweep --self-test runs 151 checks on your machine —
with a real junction, a 445-character path and a dry-run fixture whose tree is hashed before and after to
prove nothing changed.`

```html
<details>
  <summary>Will it delete my files?</summary>
  <div class="ans">
    <p>Not by accident, and not by any flag. Your profile folders, cloud-sync folders,
      credentials and browser profiles are on the protected list, and no flag lifts steps 1 to 4
      of the deletion gate.</p>
    <p>Three sections do touch personal files, and all three are interactive: partial downloads,
      large stale files and orphaned application data. Each shows you a list, defaults to nothing
      selected, and asks a final question that <span class="mono">--yes</span> does not answer.
      What you pick goes to the Recycle Bin.</p>
  </div>
</details>
<details>
  <summary>What can I never get back?</summary>
  <div class="ans">
    <p>Two sections: emptying the Recycle Bin (11) and clearing the event logs (16). Both are
      behind <span class="mono">--i-understand-deep</span> and neither runs in the safe batch.</p>
    <p>Caches removed from the rebuild tiers are gone permanently too, but they come back the next
      time the tool that owns them runs. That costs time, not information.</p>
  </div>
</details>
<details>
  <summary>Do I need Administrator rights?</summary>
  <div class="ans">
    <p>Six sections need Windows to ask your permission first: 12 to 16, and 20. Without
      elevation they skip, and print the exact command to run instead;
      <span class="mono">--elevate</span> relaunches through a UAC prompt. Everything else works
      from an ordinary console.</p>
  </div>
</details>
<details>
  <summary>How do I check it before trusting it?</summary>
  <div class="ans">
    <p><span class="mono">windowsweep --self-test</span> runs its checks on your machine, with a
      real junction, a 445-character path and a dry-run fixture whose tree is hashed before and
      after to prove the tree did not change.</p>
    <p><span class="mono">windowsweep --list-targets</span> prints every path the tool can reach,
      grouped by section, plus the protected list as the running script sees it. Read it before
      you run anything. That is what it is for.</p>
  </div>
</details>
<details>
  <summary>Can I run it on a schedule?</summary>
  <div class="ans">
    <p>Yes, for the safe batch: <span class="mono">--all --yes</span> from a Scheduled Task. The
      interactive sections never run unattended unless you name the exact items in advance with
      <span class="mono">--select</span> or <span class="mono">--select-file</span>. A scripted
      selection is a person's choice, made earlier.</p>
  </div>
</details>
<details>
  <summary>What about Windows Server, Linux and macOS?</summary>
  <div class="ans">
    <p>Server 2019 and later should work. The engine uses nothing newer than Windows 10 1809, and
      CI runs the self-test and a dry-run on Windows Server on every push. But no real cleanup has
      ever been run on Server, and that is stated rather than glossed.</p>
    <p>Linux and macOS have their own tools; npm refuses to install this one there.</p>
  </div>
</details>
```

**Why.** Every answer already opened with its answer, which is the one thing an FAQ has to do for a
snippet, so the edits are small and specific. The admin entry now opens on **"Six sections need Windows to
ask your permission first"** - the fingerprint's specimen 5, verbatim - instead of "Only for sections 12 to
16 and 20", which makes a reader count. "Skip with the exact command" becomes "skip, and print the exact
command", because *skip with* reads as though the command is a condition of skipping. The self-test answer
loses its tally under the round-2 decision above and keeps every piece of the evidence: *"runs 154 checks"*
becomes *"runs its checks"*, and the junction, the 445-character path and the hashed fixture tree stay
exactly where they were. That was always the offer. A reader asking **how do I check
it before trusting it** wants to know what to type and what it will prove; a total was never either of
those. Its proof clause changes to "the tree did not change", matching S-006. The
`--list-targets` answer gains **"Read it before you run anything. That is what it is for."** - two short
sentences closing the surface's longest block, and the only place on the page that tells a sceptical
reader what to do with their scepticism. Two more em dashes go.

---

# Band 14 - Contact

## S-025 · band 14 · `.band-head`

**Was:** identical - kept verbatim.

```html
<p class="eyebrow">Say something</p>
<h2 class="h-band">Found a bug, or a path it should know about?</h2>
<p class="lede">Sending a message needs an account, so that a reply has somewhere to go and so
  the inbox is not a spam target. It is the same account the desktop app signs into.</p>
```

**Why.** Kept. The heading asks for the one contribution this product can actually use - a cache path it
does not know about - and the lede gives two reasons for the sign-in wall instead of asserting it, which
is the register the rest of the page is in.

---

## S-026 · band 14 · `.blocked > span` - why the form cannot be submitted

**Was:** identical - kept verbatim.

```html
<b>Sign-in is not configured yet.</b> Google sign-in has not been
enabled on this project, so the form cannot be submitted. Until it is, the issue tracker on
GitHub is the working route, and it is linked in the footer.
```

**Why.** Kept. It states the limitation, its cause and the route that does work, in that order, with no
apology - and it names where to find the alternative rather than adding a fourth link to it. This is copy
that becomes obsolete the day sign-in is enabled, which is the honest state to ship in the meantime.

---

# Band 15 - Closing

🔴 **A departure, recorded rather than corrected here.** Row 16's spine ends on *"the two install paths"*
and `design/README.md` §6 names band 15 *"Closing - the two paths again"*. **The built band carries one.**
It holds a `npx windowsweep --scan` terminal and an install-size caption, and there is no download control
in it; both paths are handed over in the hero instead, which is the beat order recorded in this file's
header. Nothing in S-027 or S-028 is wrong because of it - *"The first command deletes nothing"* and
*"Run it, read what it found, and decide afterwards"* are true of the window as well, since the window
runs the same engine and shows its picture before it starts. So both slots stay verbatim.

What the band does **not** do is give the *"if you would rather not type"* reader from band 9 anywhere to
go at the end. That reader was invited six bands earlier and is then closed on a command line. The one
line they need is written below as **S-031**, held conditional, because a line pointing at a download
control that does not exist would be worse than the silence. 🔴 **Growing that control is a dummy change
and a dummy change is not this draft's to make** - it is reported to the main session and to design, with
the copy already written so nothing is blocked on a writer once the decision lands.

## S-027 · band 15 · `h2.display`

**Was:** identical - kept verbatim.

```html
The first command deletes nothing.
```

**Why.** Kept. Five words, the page's whole argument, and the fingerprint's closer rule exactly: end on
the concrete next action or the plain limit, never on a rallying summary. It is also the only closing
headline available that a reader can verify in the next thirty seconds.

---

## S-028 · band 15 · `p.lede`

**Was:** identical - kept verbatim.

```html
Run it, read what it found, and decide afterwards. That order is the whole design.
```

**Why.** Kept. Long sentence, short sentence, and the short one names the thing the page has been
demonstrating for fifteen bands rather than restating what it said. The install-size line below it
(`Windows 10 (1809 and later)…`) is outside this block and is untouched. **If band 15 grows a download
control, S-031 is the line that goes under it** - it is an addition to this block, never a rewrite of it.

---

# The footer - `shell.js`

## S-029 · `shell.js:142` · the brand-column tagline

🔴 **This block currently carries no `data-wsw-copy` attribute** - it lost the marker when the footer moved
out of `index.html`. It is block 30 of the hand-back's thirty and is slotted here so the grep-driven
applier does not miss it.

**Was:** `'Safe-by-default Windows cleanup. It names every path before it touches one.'`

```js
brandCol.appendChild(el('p', 't-sm ink-2',
  'Developer-aware Windows cleanup CLI: dry-run first, personal folders refused, zero install via npx.'));
```

**Why.** This is the **GATE-4-approved tagline**, verbatim, approved by the owner on 2026-09-07 at 99
characters. Two reasons it belongs here rather than a sentence written for the footer. First, the
placeholder repeats the page's own `<h1>` word for word about nine hundred pixels below it, so the footer
currently says nothing the reader has not just read. Second, and the real argument: the `tagline` draft's
whole finding was that this line lived in five places carrying **two different sentences**, and adopting
the approved one was also the decision to end that divergence. Authoring a sixth variant on the product's
canonical homepage would reopen precisely that. "CLI" is accurate on a page that sells both, because band
9 has already said the window runs the same engine.

**Recorded, not asked:** the site becomes a **sixth** place carrying the approved line. Row 2 says five and
names the five; this is an addition to the set, not a contradiction of it.

---

## S-030 · `shell.js:58-61` · `ANALYTICS_NOTICE`, rendered into `.foot-note`

**Was:** `This site and the desktop window send usage events to Google Analytics 4, Amplitude and Microsoft
Clarity, and errors to Sentry. Clarity records session replays. There is no opt-out. The command line sends
nothing.`

```js
var ANALYTICS_NOTICE =
  'This site and the desktop window send usage events to Google Analytics 4, Amplitude and ' +
  'Microsoft Clarity, and errors to Sentry. Clarity records session replays. There is no ' +
  'opt-out. The command line sends nothing.';
```

**Why.** Kept, word for word; only the string's line-breaks move so the concatenation stays under the
column limit. This is a safety surface and the sentence order is doing the work: destinations, then the
replay, then the absence of a switch, then the one program the notice does **not** cover. Every one of
those four is a fact rather than a persuasion, and the last is the refusal that keeps the strong claim
where it is still earned. It also agrees with S-020 line for line, which is the point of a notice
appearing twice on one page.

---

# S-031 · band 15 · CONDITIONAL - do not apply today

🔴 **This slot has no element to target**. Do not apply it. It must not reach the current dummy.
It exists only so that the copy is settled before the decision is, and it is deliberately numbered after
the footer rather than inside band 15, so the sequential inventory of applied slots stays S-001 to S-030
with no gaps and the hand-back's block arithmetic is untouched.

**Condition, stated exactly.** Apply **only if** band 15 grows a download control - a button, a link or a
second terminal offering the desktop installer - in `index.html`'s `#close` section. Otherwise skip it.
If band 15 still ends on the `npx windowsweep --scan` terminal and its install-size caption, this slot is
a no-op and the band is finished at S-028.

**Was:** nothing. The element does not exist.

```html
<p class="t-sm ink-3" style="margin-top: var(--sp-5)">
  If you would rather not type, the desktop app is the same engine in a window, and the deletion
  gate refuses exactly the same paths.
</p>
```

**Why.** One sentence, and it belongs to a reader the page has already spoken to: band 9's eyebrow is
*"If you would rather not type"*, and the close is where that invitation currently runs out. It opens on
those same six words on purpose, so the reader recognises themselves rather than being addressed twice by
two different pages.

**Why it says what it says, and not more.** Every claim in it is already carried by copy on this page.
*"The same engine in a window"* is S-017's heading, kept verbatim. That the gate refuses the same paths
follows from S-017's *"reimplements no cleanup logic at all"* and band 5, and needs no new fact about how
the window behaves - which matters, because the app's own screens are row 11's and this draft has no
business asserting a flow it has not read. 🔴 **The scope is deliberately deletion and nothing wider.** An
earlier phrasing read *"so every refusal on this page holds there too"*. That sentence is false. The
zero-network refusal in S-019 is the engine's, and band 10 exists precisely to say the window does not
inherit it, so a closing line that quietly re-inherited it would undo the disclosure eleven bands after
making it.

**What it does not duplicate.** No SmartScreen caption, no checksum sentence, no file size. Those are
settled at **S-002** and belong under whichever download control ships; if band 15 gains one, S-002's
caption is the companion text and is reused verbatim rather than authored a third time.

**Not counted anywhere in this file's arithmetic.** Its 26 words are outside every band total, outside the
rhythm measurement and outside the palette percentages in the self-check, because none of them ships
today. If it is ever applied, band 15 goes from 20 words to 46 and the surface total rises by 26.

---

# 🔴 Counts, and why neither is asserted

Round 1 raised two `NEEDS DECISION` here, both about a count. **Both were answered in round 2 and both are
closed. This draft carries zero open `NEEDS DECISION`.** The questions are kept below with their answers,
because the next writer will meet the same three sources and should not have to re-derive why the page
stays silent.

**Question 1, closed - the self-test count.** Round 1 asked whether the page should print **151** (what the
shipped 1.1.0 binary prints) or **154** (the figure the round-1 brief supplied as measured), given that the
site brands `1.1.0` in three places outside every pending block: the header chip, the
`SoftwareApplication` JSON-LD `softwareVersion`, and the footer's `MIT licence · windowsweep 1.1.0`. Three
options were offered. Hold the launch behind the 1.2.0 publish, ship 151 and add the site to the version
cascade, or cut the count entirely; the first was recommended.

> **Answered: assert no self-test count on this surface.** The third option, and it is better than the
> round-1 write-up allowed for. That write-up scored cutting the count as a loss on two fronts - *"it
> removes one of the four hero facts and weakens S-019 from an enforcement to a description"* - and both
> halves were wrong. S-019 is an enforcement because check [9] **fails the build**, which is a property of
> the check and not of the total beside it; and a hero chip that decays on a release schedule is not a fact
> worth defending a slot for. The engine at `HEAD` now runs **155**, which is the third value this one
> number has taken during a single content run, and it settles the question by itself: the count is not a
> stable claim, it is a moving one. Applied at S-001, S-019 and S-024.

**Question 2, closed - the audit count.** Three sources disagree. `README.md:105` reads *"plus three
read-only audits (global packages, idle programs, startup items)"* and goes on to say orphaned application
data *"is a fourth 1.1.0 section and is **not** an audit"*, which is the likeliest origin of the four the
round-1 brief carried. `docs/safety-model.md:98` also says three (22, 24, 25 - read-only, safe, outside
`--all`), while its tier table at line 74 puts **five** sections in the Report-only tier (0, 21, 22, 24,
25), because 0 and 21 report as well but do run in the safe batch. Three numbers, three questions.

> **Answered: assert no audit count either.** No slot asserted one before and none does now, so this
> closes without an edit. The reason stands on its own merits rather than on the ruling: band 6's tier
> table already shows the reader all five report-only sections in the rows they belong to, and band 7's
> grid marks every one of them, which answers *what does this not delete* better than any single figure
> could. A number here would only have been a fourth place to disagree. Three was already too many.

**The general shape of both answers**, worth stating once because it will come up on rows 17, 18 and 19
too: a count of internal things - checks, audits, guards - is a claim the reader cannot verify without
running the tool, and it changes on a schedule the copy has no way to follow. A **named mechanism** - check
[9], the deletion gate, `--list-targets` - is verifiable, stable across releases, and is what the reader
was actually asking about. The page keeps its numbers where they are contractual (26 sections), measured
once and labelled as one machine's result (the receipt), or structural (0 network calls, 0 dependencies).

# Reported, not fixed - four findings outside this draft's scope

1. 🔴 **After this round, the page's only self-test count is one nobody can slot.** The receipt band's
   evidence ledger reads `<dt>Guards proved on this machine first</dt><dd>151</dd>` (`index.html:168`, and
   verified still there at the snapshot). It is not marked `pending`, so this inventory cannot reach it.
   Round 1 filed this as an inconsistency risk - *one page saying 154 three times and 151 once*. **The
   decision above changes what it is.** With all three slotted occurrences removed, that `<dd>` becomes the
   single surviving tally on a page that has just decided not to make one, sitting in the evidence ledger
   of the band whose entire argument is that its numbers can be checked. It is release-coupled too: 151
   shipped, 155 is at `HEAD`. 🔴 **It should go with them**. The edit is design's, not this draft's.
   The ledger's other three facts - the byte count, the eleven sections, the refusals figure - are
   recorded measurements of one run and are unaffected. This row differs. It counts a property of the
   build rather than anything the run did.
2. 🔴 **The hand-back grep under-reports by one.** `design/README.md` §11 says 30 blocks and gives
   `grep -c 'data-ws-copy="pending"'`. The attribute is now `data-wsw-copy` and the count is 28, because
   the two footer blocks moved to `shell.js` and only one of them kept its marker. See S-029.
3. **The `<meta name="description">` and `og:description` are not marked `pending`** and are not slotted
   here, but they are product-voice prose on an indexed page and belong to a row - most likely **19**
   `site-front`, which the map assigns the site's per-route `<title>` and description text. Flagged so the
   boundary is decided rather than discovered.
4. 🔴 **Band 15 has one install path where two were specified, and closing the gap is a dummy change.**
   `design/README.md` §6 names the band *"Closing - the two paths again"* and row 16's spine ends on *"the
   two install paths"*; the built `#close` section holds a `npx windowsweep --scan` terminal and an
   install-size caption, and nothing that offers the installer. **This is reported, not fixed.** The dummy
   is read-only to this draft and another agent is in it. Whoever owns the decision has three routes: add
   a download control to band 15 and apply **S-031**; amend `design/README.md` §6 to describe the close
   the page actually has; or leave both and accept that the *"if you would rather not type"* reader is
   returned to a command line. The copy for the first is already written. Holding it costs nothing.

---

# SELF-CHECK

**Method, stated because a figure without one cannot be reconciled.** Every number below is measured over
**the shipping strings only** - the text inside the 30 fenced blocks, with HTML tags, `<!-- -->` comments
and JavaScript scaffolding stripped and entities resolved. Block-level closes (`</p> </h2> </h3> </li>
</summary>`) end a sentence; inline `<span> <b> <em>` do not. Three non-prose runs are excluded: the two
`<p class="mono">` path inventories, the four `.hero-facts` chips and the `.rc-total` numeral. So is the
verification `bash` fence, and so are `S-006`'s three terminal transcripts, because row 10 owns them.
The `…` markers standing in for the unchanged `<svg>` icons in S-019 and S-020 are not words and are
dropped. **S-031 is excluded from every figure in this section**, because it does not ship. Commentary and
`Was:` lines are **not** counted. Nor is this self-check. Sentence split is `(?<=[.!?])\s+` with `1.1.0`,
`2,483,662`, `5.84`, `9.85`, `3.92`, `SHA-256` and `Windows 10 1809` protected first.

🔴 **Round 1's figures replaced a first-pass estimate, and that estimate was wrong in both directions.**
Before the method above was fixed, this section carried *1,148 words · 96 sentences · burstiness 0.60 · one
em dash*. Three different tokenizers gave three different answers on the way there, which is why the rule
is to write the method next to the number.

🔴 **Round 2 re-measured rather than adjusted round 1's numbers by hand, and the two instruments were
reconciled before either was believed.** Run against the **pre-edit** file, this round's tokenizer returns
**1,963 words · 186 sentences · σ 7.40 · burstiness 0.70** where round 1 recorded **1,967 · 187 · 7.4 ·
0.70**: four words and one sentence apart, from where each pass split a `<span class="mono">..</span>`
fragment. On the inclusive count used by the length table in section 3 the two agree exactly, at **2,006**
pre-edit. That is close enough to attribute this round's movement to the edits rather than to the
instrument, and it is stated here because a scope difference and a drift are indistinguishable otherwise.
**Two figures round 1 got wrong are corrected in place**, not quietly: its shortest sentence was recorded
as 3 words when the rail's one-word step labels (*"Scan."*, *"Roots."*) are shorter, and it named one
longest sentence where there were two of the same length. Neither changes a verdict. Both are written down
because a self-check that quietly improves its own history is worth less than one that does not.

🔴 **The project's lint hook is structurally blind to this file.** `posttooluse-story-lint.sh:61` runs
`re.sub(r"```.*?```", " ", body, flags=re.S)` before it counts anything, and **every shipping string here
is fenced**. So its report on this draft is evidence about my commentary and nothing about the copy that
ships. Proved with a plant in round 1, not inferred. The figures above are the real ones; the fact-checker
and a human reader are the only gate on this surface. **The round-2 rewrites were swept by hand**, phrase
by phrase, against all 102 lines of `assets/banned-phrases.txt` - result below. The sibling trap is
handled too: every bolded sentence-end in my prose is written `**like this**.` with the period outside the
emphasis, because the hook's splitter does not break on a full stop followed by `**`.

**1. Palette - P dominant, R strong, W exactly once.**

| Band | Slots | Delivered |
|---|---|---|
| **P** precision before an irreversible act | S-001 (hero lede), S-002, S-003, S-004, S-005, S-006, S-009, S-010, S-012, S-013, S-014, S-015, S-016, S-018, S-020, S-024, S-025, S-026, S-027, S-028, S-029, S-030 | **~62%** of shipping words |
| **R** refusal as reassurance | S-001 (*"No flag lifts that"*), S-007, S-008, S-011, S-017, S-019, S-021, S-023 - the whole refusal band plus the override note, each one a **named refusal** rather than an adjective | **~35%** of shipping words |
| **W** workshop dryness | **S-022, one line:** *"Which is the only kind of promise worth writing down."* | **~3%** |

**What round 2 moved inside this table, and what it did not.** S-018 stays **P**: its new lede sorts three
programs into two answers, which is precision about scope rather than reassurance, and the reassurance in
that band is the panels' own. S-019 stays **R** after losing its tally, and is arguably more R for it - a
build gate that fails is a refusal with teeth, where *"one of the 154"* was a statistic. Removing the hero
chip takes three words off the P column and shifts no percentage past its rounding. The W line is
untouched. Still exactly one, still at S-022. 🔴 **S-031, if it is ever applied, is R** and would be the
closing band's only such line; it is not counted above.

**Where the W was spent, and why there.** S-022, band 12, the house-promotions heading - the furthest block
on the page from any destructive command, in the only band that is about neither deletion nor disclosure.
The Bible bans humour near an irreversible action and switches it off entirely on safety surfaces, which
rules out bands 2, 4, 5, 6, 10 and 13. One W line was also **removed** to stay inside the budget: S-014's
*"and your afternoon is gone"*, which sits directly above the two panels describing what gets deleted.

R runs above the Bible's 25 because band 4 is eight consecutive refusals and the row calls R "strong" for
this surface. Reported rather than trimmed: cutting a refusal to hit a ratio on the page whose design read
is *trust is the content* would be the tail wagging the dog.

**2. Rhythm.**

| Measure | Figure | Target |
|---|---|---|
| Words · sentences | 1,971 · 188 | - |
| Mean length | 10.48 words | median 12-16 (under, and deliberately - see below) |
| Standard deviation | 7.33 | - |
| **Burstiness** (σ ÷ mean) | **0.70** | ≥ 0.45 ✅ |
| **Shortest** | **1 word** - the rail's step labels, *"Scan."* and *"Run."* (S-006), *"Traversal."* and *"Roots."* (S-010). Next up: *"Not adjectives."* (S-007), *"Never less."* (S-015) | ≤ 6 ✅ |
| **Longest** | **33 words**, and there are **two** of them. S-024: *"windowsweep --self-test runs its checks on your machine, with a real junction, a 445-character path and a dry-run fixture whose tree is hashed before and after to prove the tree did not change."* S-015: *"A cache file goes only when its newest timestamp is at least 100 days old, and the newest version of every versioned tool is never removed - Cypress, Playwright, Gradle distributions, Squirrel builds."* | ≤ 34 ✅ |
| Sentences ≤ 6 words · ≥ 25 words | 76 · 9 | both present ✅ |
| Sentences over the 34-word ceiling | **0** | 0 ✅ |
| **Em dashes** | **0** | ≤ 1 per 150 words ✅ - the placeholders carried **11**; all 11 became full stops, colons or commas |
| "not X, but Y" | **0** | ≤ 1 per 300 ✅ |
| Rule-of-three lists | 5 in 1,971 words | ≤ 2 per 500 ✅ |
| Consecutive same-word openers | max 2 | < 3 ✅ |
| Semicolons | 5 | allowed by the fingerprint, used to join related facts |
| Exclamation marks | **0** | 0 ✅ |
| Banned phrases | **1**, allowed with a marker - see below. Swept against `assets/banned-phrases.txt`: **87 phrase entries** across its 102 lines, case-insensitive, on word boundaries, whitespace-flexible for the multi-word entries. Round 1 recorded "152 entries" and that figure was wrong; the file has never held 152 | 0 or allowed ✅ |
| Banned diction (fingerprint) | **0** - no *blast, nuke, wipe out, seamless, robust, powerful, simply, just, easily, one-click, smart, optimise, sweep away* | 0 ✅ |

**Mean length is 10.5 against the fingerprint's 12-16 median, and that is a property of the surface rather
than a miss.** A landing page is 34 headings, 4 fact chips and 8 list items short enough to scan, so its
prose mean sits below a document's. The measures that matter for rhythm both clear: burstiness 0.70 and
zero sentences over the ceiling.

<!-- story-lint: allow "elevate" -->

**The one allowed phrase.** `elevate` is on the banned list as the marketing verb. Here it occurs once, at
S-024, as **`--elevate`** - the tool's actual flag name, inside a `<span class="mono">`, in the sentence
that tells a reader how to relaunch through a UAC prompt. Renaming a shipped flag to satisfy a phrase list
is not available, and paraphrasing around it would leave the reader without the string they have to type.
The banned sense does not appear anywhere on the surface.

🔴 **The round-2 by-hand sweep, and its result.** The lint hook cannot see any of this file's shipping
copy, so the seven strings this round changed or added were swept separately and by hand - the three-chip
row, S-003's lede, S-018's heading and lede, S-019's zero-network line, S-024's self-test answer, and
S-031's conditional close. **Zero hits**. All 87 banned entries, and zero against the fingerprint's own
never-list, all 22 of its entries, which is read from `voice-fingerprint.md` and deliberately not
reproduced here - quoting a gate's own vocabulary inside the corpus that gate reads is how a record starts
failing the check it was written to document. The whole surface re-swept returns the same single `elevate`
allowed above and nothing else. Two near-misses are worth naming, so the next reader knows they were
weighed rather than missed. S-018's *"the site gives the window's answer, not the engine's"* is an
**X, not Y** construction, which the fingerprint budgets at one per 300 words and which appears exactly
once in 1,971. And S-031 was deliberately narrowed off *"every refusal on this page holds there too"* -
not a banned phrase, but a false one.

**3. Length against the row's cap.** Row 16's cap is structural - *"a landing page, 12-15 bands"* - not a
word count. **15 bands**, unchanged; no band added, none removed, none merged. Words per band, shipping
copy only:

| Band | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | foot | **all** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Ships**, round 2 | 148 | 125 | 152 | 307 | 162 | 50 | 41 | 183 | 42 | 198 | 10 | 51 | 386 | 84 | 20 | 52 | **2,011** |
| **Shipped**, round 1 | 152 | 128 | 152 | 310 | 164 | 50 | 41 | 183 | 42 | 181 | 10 | 52 | 387 | 84 | 20 | 50 | **2,006** |
| **Was**, the placeholders | 124 | 129 | 129 | 264 | 154 | 36 | 41 | 199 | 42 | 177 | 10 | 41 | 364 | 84 | 20 | 49 | **1,863** |

Counted per slot, so this total is **2,011** where the rhythm table above says 1,971. The 40-word gap is
the three non-prose runs the rhythm measurement excludes and this one does not: the two `<p class="mono">`
path inventories, the three `.hero-facts` chips and the `.rc-total` numeral. Two rules, both written down.

🔴 **Read the two Ships rows as one measurement each, not as a band-by-band diff.** Round 2 changed four
bands and touched no other: band 1 loses the 3-word chip, band 2 loses *"with nothing refused"*, band 10
gains 26 words of lede and loses 9 across the heading and S-019's tally. That is **+11**. The remaining
differences - band 4 at 307 against 310, band 5 at 162 against 164, bands 12, 13 and the footer by a word
each - are **the instrument, not the copy**: those five bands were not edited this round. Run against the
pre-edit file this tokenizer totals **2,000** where round 1 totalled 2,006, a 0.3 per cent spread over
thirty slots from where each pass counted `<span class="mono">` fragments and the footer's JavaScript
concatenation. The **Was** row is round 1's measurement, carried forward and not re-measured, so the
comparison below is approximate by exactly that margin.

Net **+148 words over the placeholders, about +8%**. Five places take almost all of it: band 4's three
added R sentences, band 10's new bridge, band 13's `--list-targets` closer and admin answer, band 5's
chokepoint and override rewrites, and band 3 naming the two files a dry-run writes. **One band shrank** -
band 8, 199 to 183, where the unbudgeted W line came out. No band is out of scale with its neighbours, and
at 2,011 words the page clears the ~1,000-word floor an indexed home page needs by a wide margin.
S-031's 26 conditional words are in none of these numbers.

**4. The pricing sweep - CLEAN, re-run after the round-2 edits.** Row 16 and `design/README.md` §7 both
forbid a pricing claim in either direction, so the shipping strings were swept for `free`, `paid`, `price`,
`pricing`, `tier`, `subscription`, `offers`, `trial` and `$`, case-insensitive on word boundaries. Same
**three hits as round 1, none of them a pricing claim** - the seven strings this round changed introduced
no new hit, and S-031 introduces none either. Each read in context rather than counted:

| Hit | Where | What it actually says |
|---|---|---|
| `free` ×2 | S-004 | *"Windows reported **free** space on C: rising"* and *"Windows counts what is **free**"* - disk space, the product's subject |
| `paid` ×1 | S-002 | *"not signed with a **paid** code-signing certificate"* - GATE-4-approved wording about a certificate that was not bought |

No sentence says the product is free, and none says there is no paid tier. **The word "free" never
modifies windowsweep.** The schema block is outside every pending block and already carries no `offers` and
no `isAccessibleForFree`; this draft adds neither and touches neither. One thing worth keeping in view: the
word *paid* survives here only because the certificate sentence is approved copy, and removing *paid* would
turn it into a claim about the file rather than about what was purchased.

**5. Unsure spots.** 🔴 **Zero open `NEEDS DECISION`.** Round 1 raised two, on the self-test count and the
audit count; round 2 answered both, and the questions are preserved with their answers rather than deleted.
Four findings are reported outside scope. Four things I am less than certain of and did not guess:

- 🔴 **What `refused: 0` actually counts is not stated on this surface**. That is deliberate. S-003's
  lede no longer carries the clause, and the evidence ledger beside the chart is not a pending block and
  was not touched. **The fact-checker owns this one.** Whether that ledger row means no protected path was
  encountered during the run, or none was reached, or something narrower, changes what a label beside it
  may honestly say - and none of the three readings is available to me from the tracker's run history
  alone. Nothing ships on it either way; the question is only live if someone later wants to explain the
  figure in prose.

- **`released 2026-09-07` at S-002 is carried from the placeholder**, not verified. The installer's name
  and its 2,483,662 bytes are sourced to the tracker; the release *date* I could not confirm from the
  repository, and I did not reach for the network to check. Low risk, and cheap to settle.
- **S-029's reuse of the approved tagline is a call I made, not a rule I found.** The argument is above.
  It is a one-line revert if the owner reads the footer as needing its own sentence.
- **The voice fingerprint is still `calibrated: false`.** Every rhythm figure here is measured against
  twelve specimens derived from the repository rather than from samples the owner chose. That is the
  Bible's own open item, not a new one - but it is what "reads as this voice" means on this surface, and
  it should be said rather than assumed. Unchanged since round 1. Still not a blocker.
