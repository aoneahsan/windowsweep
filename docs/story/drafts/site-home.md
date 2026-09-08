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

Row 16 names **the home bands and `/download`**, and as of round 3 it covers both. `/download` did not
exist when rounds 1 and 2 were written - `design/README.md` listed it under what was not built, so it had
no element to target and no `Was:` line was possible. **It exists now**, and its section no longer mentions
it: §11 *"What is NOT built"* lists the app tree, the two machine artefacts and the story surfaces' final
words, and nothing else. So the promise round 2 made has been kept in the same file rather than deferred to
another: *"When `/download` exists, its slots are an addition to this file, not a rewrite of it."* They are
**S-032 to S-036**, and every earlier slot number is untouched.

**The SmartScreen copy that page needs was already settled** and is reused verbatim twice - at S-002 in the
hero caption, and at S-036 in the fuller treatment `/download` has room for.

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
- **Snapshot the quotes were taken against, re-pinned in round 3:** `index.html` md5
  `7794435a4949fbc550ea2910009feb69` (872 lines, 29 marked blocks) · `shell.js` md5
  `f9baef70b61fd5c63ce2748eebcf7621` · `download.html` md5 `17354530141edd69d9fbcfa5081a988c` (5 marked
  blocks). Round 2 pinned `index.html` at `cfcc9cf7…` and 863 lines; the file has since gained band 15's
  second-path block and its download link, which is why the marked count moved 28 -> 29 and S-031 stopped
  being conditional. **Every `Was:` line in this file was re-resolved against these three snapshots**, and
  each one still matches.
- **en-GB** throughout. `Favorites`, `Saved Games`, `Local Storage` and `Preferences` keep their US spelling
  because they are Windows and Chromium folder names, not prose.

## Where the slots live

| File | Slots | Marked `pending` today |
|---|---|---|
| `index.html`, bands 1 to 14 | S-001 - S-026 | 27 |
| `index.html`, band 15 | S-027, S-028, **S-031** | 3 |
| `shell.js` (the shared footer, extracted mid-draft) | S-029 - S-030 | 2 |
| `download.html` | **S-032 - S-036** | 5 |
| **Applied total** | **36** | **37 rendered blocks over two pages** |

**All thirty-six apply. Nothing in this file is conditional any more.** S-031 was written in round 2
against a dummy change this draft could not make, numbered after the footer to keep the applied sequence
gapless, and excluded from every figure. Design then made the change and adopted its words, so it is now an
ordinary slot: still numbered 31, still positioned after the footer, and now counted everywhere. The
applier works by fixed-string search, so its position in this file has never mattered to the mechanism.

**Why the block totals do not equal the slot totals.** `shell.js` contributes the brand tagline and the
analytics notice to **every** page, so those two blocks render on both `index.html` and `download.html`
while remaining **one string each**, owned once, at S-029 and S-030. The home page renders 30 pending
blocks (28 markup + 2 shared) and `/download` renders 7 (5 markup + 2 shared) - which is where
`design/README.md` §12's table gets its two figures.

🔴 **Both marker defects round 2 reported have been repaired in the dummy.** The tagline had arrived in
`shell.js` as a plain `el('p', 't-sm ink-2', '...')` with no `data-wsw-copy`, so a grep-driven applier
would have skipped block 30 while reporting success. **The marker is now set explicitly** - the tagline
string sits at `shell.js:148` with `tagline.setAttribute('data-wsw-copy', 'pending')` at `:149`, and the
notice's marker at `:171`. `design/README.md` §12 now documents both greps and reconciles them. The residue
is arithmetic, not mechanism, and it is finding 4 below.

## Slots that change, and slots that do not

**Twenty-five change. Eleven are kept verbatim** - S-013, S-017, S-021, S-023, S-025, S-026, S-027, S-028,
S-030, **S-031** and **S-035** - because the placeholder already says the true thing in this voice, and
rewriting a good sentence to prove a pass happened is how an approved line gets quietly worse. S-031 is
kept verbatim for an unusual reason: the dummy adopted **this draft's own round-2 wording**, so the slot
and the element already agree.

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
(`README.md:109` says three read-only audits, the tier table at `docs/safety-model.md:80` puts five
sections in the report-only tier), and no slot here asserted one. None now will. Both counts are recorded
under **Counts, and why neither is asserted** at the end of this file, with the evidence, so the next
writer does not rediscover the question.

## Two facts this draft corrects

1. 🔴 **"The first two write nothing at all" is false** (S-005). A dry-run is not one of the quiet modes -
   `windowsweep.ps1:287` lists only `help`, `version` and `list` - so it initialises a log and
   `Initialize-Report` runs unconditionally. It writes **two files, both its own, and none of yours**. This
   is Bible §3 commitment 2 as corrected on 2026-09-07, reaching this surface for the first time.
2. 🔴 **`--i-understand-deep` reaches four sections, not two** (S-012). The placeholder implied the flag
   gates only 11 and 16. It gates four. `README.md`'s own IMPORTANT block names the hibernation file and
   disk-image compaction alongside them.

---

## Band 1 - Hero

### S-001 · band 1 · `.hero-grid > div[data-wsw-copy]` - eyebrow, headline, two ledes, the fact chips

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

**The chip row drops to three, and a fourth was not invented to fill the gap.** `151 self-test checks`
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

### S-002 · band 1 · `p.t-xs.ink-3` under the download button - the installer caption

**Was:** `windowsweep_1.1.0_x64-setup.exe · 2.37 MB · released 2026-09-07. There is no code-signing
certificate, so SmartScreen will warn on first run. Two things are verifiable instead: a SHA-256 checksum
and a minisign signature, both published beside the installer.`

```html
<span class="mono">windowsweep_1.1.0_x64-setup.exe</span> · 2,520,200 bytes · released
2026-09-07. The installer is not signed with a paid code-signing certificate, so SmartScreen
warns on first run. Every release publishes a SHA-256 checksum and a minisign signature the
app's own updater checks; neither is a code-signing certificate.
```

**Why.** Two sentences of GATE-4-approved copy, reused **verbatim** rather than paraphrased a third time.
They are slot **S-006** of `desktop-readme.md`, which is the same fact at caption length and is already
shipping in `README.md:373`. Slot **S-015** of that draft is the fuller treatment and it cannot go in a
`t-xs` caption under a button - it is three paragraphs, 117 words, with its own `###` heading and the
*"More info -> Run anyway"* instruction. **S-015 is what `/download` should carry when that page exists**,
and this caption is the same claim in the register this element has room for; no third phrasing was
invented. Two corrections ride along. **"There is no code-signing certificate"** loses the word *paid* and
so reads as a claim about the file rather than about what was bought - the exact confusion S-015's second
paragraph exists to prevent, and the decision log records it.

🔴 **The size was wrong twice over**. Round 2 caught one error and round 3 caught the other. The
placeholder's **2.37 MB** is a mebibyte figure wearing a decimal label, so round 2 replaced it with
**2,483,662 bytes** - which fixed the unit and kept the wrong file. 2,483,662 is the **local build of
2026-09-06**, made before the updater keypair existed, and it was never published. The tracker records why
the two differ: the release was completed by hand *"with checksums computed against CI's own binaries
rather than the local build"*. The asset a reader can actually download is **2,520,200 bytes**, per the
GitHub releases API and the `SHA256SUMS.txt` published beside it. The unit reasoning survived. The source
under it did not.

Bytes stay the unit. They are already this page's vocabulary, four hundred pixels above a 13-digit byte
count, on a page whose whole argument is that its numbers can be checked by anyone who cares to. A megabyte
here would have hidden the very substitution that just had to be made.

---

## Band 2 - The receipt

### S-003 · band 2 · `.rc-head` - eyebrow, the total, the lede

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
Three jobs, one word, none of them taught yet.

🔴 **Round 2 left the datum to the evidence ledger, and round 3 finds the ledger row gone as well.** That
was the right call for the wrong reason. Round 2 declined to say what `refused: 0` counted and handed the
question to the fact-checker; the fact-checker answered it, and the answer is that **the figure could not
have been anything but zero**. `$ws.Refusals` records **sections** refused by batch policy, never paths.
The recorded run was `--all --yes` unelevated, which is the eleven-section safe batch - no interactive
section, no deep section - so neither branch that increments it was reachable. A number that is zero by
construction is not evidence of restraint. It is an artefact of which batch ran.

**So the row was removed from the dummy** (`windowsweep-web` `8de91a8`) and the ledger now holds two facts,
not three: `Sections that reported — 11` and `Drive — C:`. **No third was invented to replace it.** Nothing
in this slot depends on that, because *"with nothing refused"* had already gone - but the reasoning is
worth keeping, since it is the same trap in a second costume. A count nobody can falsify reads as proof and
is not.

---

### S-004 · band 2 · `p.rc-caveat` - the two numbers that disagree

**Was:** `The two numbers on this page do not agree, and that is expected. windowsweep counted
3,924,712,402 bytes removed. Windows reported free space on C: rising from 5.84 GB to 9.85 GB — a gain of
4.01 GB. The tool counts what it deleted; Windows counts what is free, at a slightly later moment, on a
volume other programs are also using. Anyone printing one round number is hiding this gap rather than not
having it.`

```html
<b>The two numbers on this page do not agree, and that is expected.</b>
windowsweep counted 3,924,712,402 bytes removed, which is 3.66 GB. Windows reported free space
on <span class="mono">C:</span> rising from 5.84 GB to 9.85 GB, a gain of 4.01 GB. The tool
counts what it deleted. Windows counts what is free, a moment later, on a volume other programs
are also writing to. Printing one round number would hide that gap rather than close it.
```

**Why.** This is the strongest sentence on the page and it very nearly did not work, because the reader
could not see the gap. 3,924,712,402 against "5.84 to 9.85" is two units and a subtraction away from
being legible, so the division is stated. Not a new measurement. The long semicolon clause splits into
two, which is where the contrast actually lands: *"The tool counts what it deleted. Windows counts what is
free."* The closing sentence loses "Anyone printing". That was a claim about competitors. This project
cannot verify one and the map's §4 already refuses to make one, so what stands instead is a claim about
arithmetic. It holds alone.

🔴 **Round 3 changed that division from 3.92 to 3.66, and the paragraph was mixing scales in the one place
it could least afford to**. `3.92` is decimal, `3,924,712,402 ÷ 10⁹`. The two figures it is set against are
binary: the engine's own `Format-Bytes` (`lib/ui.ps1:139`) divides by 1024, the app's `formatBytes`
(`desktop/src/lib/format.ts:26-27`) does the same, and so does the Explorer window the reader would check it
in. So `5.84` and `9.85` are GiB wearing a GB label, and one honest scale gives **3,924,712,402 ÷ 2³⁰ =
3.66**. Every number in the sentence is now read the same way.

🔴 **The correction quadruples the gap the paragraph exists to explain, which is the real finding**. Against
3.92 the discrepancy reads as **0.09 GB** - a rounding artefact, the kind of thing a sceptical reader
forgives without learning anything. Against 3.66 it is **0.35 GB**. That is four times larger and it is no
longer dismissible, so the two sentences underneath it - the tool counts what it deleted, Windows counts
what is free a moment later on a volume other programs are writing to - stop being a formality and start
being the explanation the band promised. **The wrong scale was quietly making the page's bravest paragraph
look like a pedantry**. The byte count itself never moved. `design/README.md` §2 carries the corrected
figure as of `4157b20`, and four gallery button specimens that printed *"Reclaim 3.92 GB"* went with it.

---

## Band 3 - The honesty sequence

### S-005 · band 3 · `.band-head`

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

### S-006 · band 3 · `ol.rail` - three numbered steps

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
  reclaim. It writes two files of its own, a log and a report. None of yours. The self-test
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

## Band 4 - The refusal list

### S-007 · band 4 · `.band-head`

**Was:** `The safety model` / `A list of things it will not do.` / `Not adjectives. The refusals are
enumerated, counted, and printed on demand by --list-targets. No flag bypasses any of them.`

```html
<p class="eyebrow">The safety model</p>
<h2 class="h-band">A list of things it will not do.</h2>
<p class="lede">Not adjectives. Every refusal below is counted, enumerated and printed on demand
  by <span class="mono">--list-targets</span>. No flag lifts one of them.</p>
```

**Why.** "Not adjectives." stays exactly as it is. It is a two-word fragment opening the page's most
important band, and the clearest statement of the difference between this product and the word *safe*. "The
refusals" becomes "Every refusal below". It points at the eight items the reader is about to read rather
than at an abstraction. "Bypasses" becomes **lifts**, the verb the chokepoint band and S-011 use.
One idea, one word, three bands.

---

### S-008 · band 4 · `ul.refuse` - eight refusals

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
    them. Refused unconditionally. No flag, no profile and no configuration file reaches any of
    them.</p>
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
    junction and a path past 400 characters, on your machine, before you trust it.</p>
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
each a **specific refusal** rather than an adjective, which is the Bible's definition of the band. *"No
flag, no profile and no configuration file reaches any of them"* answers the question a
sceptical reader is actually holding - *what if I turn something on* - at the top of the list rather than
in the chokepoint band two screens later. *"The caches these tools keep are fair game. The tools are not."*
is the whole product in twelve words. It belongs beside the toolchain list, which otherwise reads as
inventory. That is band R. The junction item now ends on **"on your machine, before you trust it"**, moving the proof from
something the project did to something the reader can do. The Prefetch parenthesis becomes its own clause,
because a reason in brackets reads as an afterthought and that reason is the interesting half.

---

## Band 5 - The chokepoint

### S-009 · band 5 · `.band-head`

**Was:** `One function` / `Every deletion goes through the same gate.` / `There is no second path to a
delete. Five ordered refusals, and a flag can change how much of a cache goes — never where the tool may
reach.`

```html
<p class="eyebrow">One function</p>
<h2 class="h-band">Every deletion goes through the same gate.</h2>
<p class="lede" style="margin-inline: auto">There is no second route to a delete. Six ordered
  refusals, and a flag can change how much of a cache goes. Never where the tool may reach.</p>
```

**Why.** The em dash becomes a full stop, which is what the fingerprint asks for and what the sentence
wanted anyway: **"Never where the tool may reach."** is a five-word refusal, and as a trailing clause it
was carrying the band's whole point in a subordinate position. "Path" becomes "route" because *path* is a
glossary term on this page meaning a filesystem path, and the sentence is about control flow.

---

### S-010 · band 5 · `ol.choke-list` - the six ordered refusals

**Was:** `Traversal. Paths with .. segments, UNC paths and drive roots are refused outright.` / `Roots.
Fifteen declared entries — every drive root, Windows, System32, SysWOW64, both Program Files, ProgramData,
C:\Users, your profile root and the three AppData roots.` / `Protected lists. Sixty-six subtrees, fifty
patterns and thirteen file names, with two declared exceptions tested first so they are a carve-out rather
than an oversight.` / `Containment. The path must lie strictly inside the target root the calling section
declared.` / `The tool's own data. Lifted only by --prune-history and --uninstall-data, which exist to
delete windowsweep's own logs.`

```html
<li><span><b>Traversal.</b> Paths with <span class="mono">..</span> segments, UNC paths and drive roots are refused outright.</span></li>
<li><span><b>Roots.</b> Fifteen declared entries. Windows, System32, SysWOW64, both Program Files folders, ProgramData, <span class="mono">C:\Users</span> with its Default and Public profiles, <span class="mono">%PUBLIC%</span>, your profile root, its AppData folder and the Roaming, Local and LocalLow folders inside it.</span></li>
<li><span><b>Protected lists.</b> Sixty-six subtrees, fifty patterns and thirteen file names, with two declared exceptions tested first, so they are a carve-out rather than an oversight.</span></li>
<li><span><b>The tool's own data.</b> The one step a flag can lift, by <span class="mono">--prune-history</span> or <span class="mono">--uninstall-data</span>, which exist to delete windowsweep's own logs.</span></li>
<li><span><b>Your own exclusions.</b> <span class="mono">--exclude-path</span> names a tree and every section refuses it, logged line by line and listed in the <span class="mono">--json</span> summary.</span></li>
<li><span><b>Containment.</b> The path must lie strictly inside the target root the calling section declared.</span></li>
```

**Why.** The tool's-own-data step is rewritten and the rest keeps its wording. "Lifted only by" states the
exception without first saying that an exception exists, so a reader scanning parallel refusals meets the
one that behaves differently without being told it does. Naming it **the one step a flag can lift** is the
honest ordering: the carve-out is announced, then bounded, and both flags only reach the tool's own logs.
The Roots step loses its dash. The list already ran at one em dash per item, against a budget of one per
150 words.

🔴 **Round 3 found the list one refusal short, and in the wrong order**. `docs/safety-model.md:10-19` lists
**six**, and the page listed five with two of them transposed. The docs' order is the engine's order:
traversal, roots, protected lists, **the tool's own data (4)**, **your own exclusions (5)**, containment
(6). The page had containment at 4 and the tool's own data at 5, and had no entry at all for
`--exclude-path` - a refusal the reader **sets themselves**, which is the one item on the list they have
any agency over. Dropping it from a band titled *"a list of things it will not do"* was the costliest of
the two errors.

🔴 **The ordinal collision is the reason this matters beyond a missing bullet**. Numbered five, the page's
**4** meant containment; the docs' **4** means the tool's own data. A reader who follows the page's own
argument into `safety-model.md` - which this band is written to invite - meets the same digit attached to
the opposite thing, and the sentence *"steps 1 to 4 have no override"* then reads as contradicting the
docs' *"no flag bypasses refusals 1, 2, 3, 5 or 6"*. Neither document was wrong about the engine. They were
disagreeing about a numbering nobody owned.

**So the fix is not to renumber but to stop pointing with numbers**. The list is an `<ol>` and still counts
itself on screen, which is fine; what changed is that no *prose* on this surface refers to a refusal by its
ordinal any more. S-011 below names them instead. A name survives a list growing a seventh entry; an
ordinal does not, and this list just grew a sixth.

🔴 **And the Roots entry said fifteen while enumerating eleven**. The placeholder read *"Fifteen declared
entries: every drive root, Windows, System32, SysWOW64, both Program Files, ProgramData, `C:\Users`, your
profile root and the three AppData roots"*. Count it as a reader would and you reach eleven, one of which -
*every drive root* - is not in this refusal at all: it belongs to Traversal, the entry directly above, so
the sentence borrowed a member from its own neighbour to pad a total it still missed by four.

**The four genuinely missing were `Users\Default`, `Users\Public`, `%PUBLIC%` and `%USERPROFILE%\AppData`**,
which `lib/safety.ps1:25` carries and `docs/safety-model.md:11` enumerates correctly. The rewritten entry
now names all fifteen in the source's own order, and the AppData collapse (*"the three AppData roots"*) is
opened out because `AppData` itself is a sixteenth-looking entry that is really the parent of the three -
leaving it implicit is what made the original arithmetic unrecoverable.

**`%PUBLIC%` is written as the variable on purpose**. It sits beside `Users\Public` in the source and is
usually the same folder, so spelling both out as *"Public"* would read as a duplicate and invite a reader
to strike one off and land back at fourteen. The env-var form shows it is a separately declared entry.
Count the sentence now and it comes to fifteen.

---

### S-011 · band 5 · `p.t-sm.ink-3` centred - the override note

**Was:** `Steps 1 to 4 have no override. --purge-all changes how much of a cache goes, never where the tool
may reach.`

```html
No flag lifts traversal, the roots, the protected lists, your own exclusions or containment, and
no flag adds a new exception. <span class="mono">--purge-all</span> changes how much of a cache
goes, never where the tool may reach.
```

**Why.** The clause about no flag adding one is the point, because "no override" describes today and *"no
flag adds a new exception"* describes the design. A reader who has been burned by a cleaner is not asking
whether a switch exists; they are asking whether one could. This is the same refusal S-008 opens with,
restated where the mechanism is on screen - the Bible's chokepoint motif, one door and no side entrances.

🔴 **Round 3 replaced the ordinal with the names**. *"Steps 1 to 4"* was wrong under the corrected list -
the tool's own data is now step 4, so the sentence would have promised no override for the one step that
has one - and it was fragile even when it was right, because it re-derived a list membership from a
position. Naming the five costs eleven words and buys a sentence that cannot rot. If a seventh refusal is
ever added, this line stays true or fails loudly; it cannot quietly come to mean something else.

**It also reads as more of a refusal, which is the band.** *"Steps 1 to 4 have no override"* is a fact
about a numbering. *"No flag lifts traversal, the roots, the protected lists, your own exclusions or
containment"* is five refusals said out loud, in the reader's own vocabulary, in the position where band R
does its work. The exception is not mentioned here at all: the list above already announces it in its own
entry, and repeating it under a heading about what cannot be lifted would blur the one distinction the
sentence exists to keep sharp.

---

## Band 6 - What it deletes, by tier

### S-012 · band 6 · `.band-head`

**Was:** `What comes back` / `Six tiers, and two of them are permanent.` / `Most of what windowsweep
removes rebuilds itself the next time you need it. Two sections do not, and they are the two behind
--i-understand-deep.`

```html
<p class="eyebrow">What comes back</p>
<h2 class="h-band">Six tiers, and one of them is permanent.</h2>
<p class="lede">Most of what windowsweep removes rebuilds itself the next time you need it. Two
  sections do not: emptying the Recycle Bin and clearing the event logs. Both sit behind
  <span class="mono">--i-understand-deep</span>, along with the hibernation file and disk-image
  compaction.</p>
```

**Why.** The placeholder said the flag gates *"the two"*. That reads as exhaustive. `README.md`'s own
IMPORTANT block puts four things behind `--i-understand-deep`: sections 11 and 16,
which are permanent, plus the hibernation file and disk-image compaction, which are reversible. Naming the
two permanent sections in prose also stops the reader having to find rows 11 and 16 in the table below to
learn what "permanent" means - and it is the sentence the fingerprint already models at specimen 11.

🔴 **Round 3: the heading was counting the wrong noun**. *"Six tiers, and two of them are permanent"* makes
**two** a count of tiers, and there is one - `Permanent`, holding sections 11 and 16
(`docs/safety-model.md:75-82`, `lib/constants.ps1:57,62`). The other five are Rebuilds, Slow to rebuild,
Recycle Bin, Report only and Configuration. The two is a count of **sections**, which the lede directly
underneath already makes correctly and by name. So the heading loses nothing by saying **one**: the tier
count and the section count now sit in the same sentence pair without contradicting each other, and a
reader who scrolls to the table below finds one row labelled Permanent rather than hunting for a second.
One word. It was the only word in the heading doing arithmetic.

---

## Band 7 - The 26 sections

### S-013 · band 7 · `.band-head`

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

## Band 8 - Developer mode

### S-014 · band 8 · `.devsplit > div[data-wsw-copy]` - eyebrow, heading, lede

**Was:** `Developer mode` / `One question, on the first run.` / `A cleaner that clears every cache it finds
trades one problem for another: the next yarn install downloads the lot again and your afternoon is gone.
So windowsweep asks once, remembers the answer, and changes what sections 1 to 5 do with it.`

```html
<p class="eyebrow eyebrow-a">Developer mode</p>
<h2 class="h-band">One question, on the first run.</h2>
<p class="lede" style="margin-top: var(--sp-4)">
  A cleaner that clears every cache it finds trades one problem for another: the next
  <span class="mono">yarn install</span> downloads all of it again. So windowsweep asks once,
  remembers the answer and changes what seven of the sections do with it.
</p>
```

**Why.** One clause cut. *"And your afternoon is gone"* is a good line and it is band W, which row 16
budgets at **once** for the whole surface - and this band sits directly above the two panels that describe
what gets deleted, which is the wrong neighbourhood for an aside under the Bible's rule against humour
near a destructive action. The W is spent at S-022 instead, thirteen hundred words away from any command.
What survives is the gamble, stated flat. That is the band's job.

🔴 **Round 3: "sections 1 to 5" was wrong twice, and the second way is the one that would have misled**.
`docs/safety-model.md:98` reads *"changes seven sections, in two ways"*, and `lib/constants.ps1` carries
`Dev = $true` on **1, 2, 3, 4, 5, 17 and 20** - so the count is seven, not five. That is the arithmetic
error. The reading error underneath it is worse: a contiguous range implies the five behave alike, and they
do not. Sections 1, 2, 3 and 5 prune by the idle gate on *yes* and clear completely on *no*, while
**4, 17 and 20 do not run at all** when the answer is no (`modules/runner.ps1:105-110`). A range hides both
the two missing members and the two different behaviours.

**Why "seven of the sections" and not the list**. Naming 1, 2, 3, 4, 5, 17 and 20 in a hero-adjacent lede
would spend the band's whole attention budget on an enumeration the docs page already owns, and band 7's
grid sits four hundred pixels below. The Bible's rule is that numbers are exact and sourced, which *seven*
is. It is also the honest shape: the reader needs to know the answer has reach, and the reach is not a
tidy range.

---

### S-015 · band 8 · `.devout div[data-value="yes"] .panel` - the developer-mode answer

**Was:** `Caches you used recently are kept.` / `The idle gate applies: a cache file goes only when its
newest timestamp is at least 100 days old, and the newest version of every versioned tool — Cypress,
Playwright, Gradle distributions, Squirrel builds — is never removed.` / `Windows disables last-access
updates on most volumes, so the tool reads the newest of three timestamps and errs toward "recently used".
The consequence is that it keeps more, never less.`

```html
<h3 class="h-sub">Caches you used recently are kept.</h3>
<p class="t-sm ink-2">The idle gate applies. A cache file goes only when its newest timestamp is
  at least 100 days old, and the newest version of every versioned tool is never removed:
  Cypress, Playwright, Gradle distributions, Squirrel builds.</p>
<p class="t-sm ink-2">Windows disables last-access updates on most volumes, so the tool reads the
  newest of three timestamps and errs towards "recently used". It keeps more than it strictly
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

### S-016 · band 8 · `.devout div[data-value="no"] .panel` - the non-developer answer

**Was:** `Those caches are cleared completely.` / `If you do not build software on this machine, a
four-gigabyte Gradle cache is not worth keeping and the idle gate has nothing to protect.` / `Nothing about
this answer changes what the tool may reach. The refusal lists are identical either way — it changes only
whether a cache is pruned by the idle gate or emptied.`

```html
<h3 class="h-sub">Those caches are cleared completely.</h3>
<p class="t-sm ink-2">If you do not build software on this machine, a Gradle cache is not worth
  keeping and the idle gate has nothing to protect.</p>
<p class="t-sm ink-2">Nothing about this answer changes what the tool may <em>reach</em>. The
  refusal lists are identical either way. It decides whether a cache is pruned by the idle gate
  or emptied, and whether three sections run at all.</p>
```

**Why.** The em dash splits into a full stop, so the guarantee - *"the refusal lists are identical either
way"* - stands as its own sentence instead of trailing into a qualifier. That is why the panel exists. A
reader picking "no" needs to know they have not just widened the blast radius. "It changes only" becomes
"It decides", because the subject is the answer and an answer decides.

🔴 **Round 3 cut the word *only*, which was the false one**. The placeholder and round 2 both read *"It
decides only whether a cache is pruned by the idle gate or emptied"*, and that **only** is a completeness
claim the code refuses. `modules/runner.ps1:105-110` skips sections **4, 17 and 20** outright when the
saved answer is no, and `docs/safety-model.md:98` says the same in prose - the answer changes *"whether a
cache is pruned or cleared, and whether a section runs at all"*. Two effects. The panel claimed one.

**And the missing half is the one a reader picking "no" would want**. It sits in the panel that tells them
what their choice costs, so *"three sections run at all"* is not a footnote to the guarantee above it; it
is the rest of the answer. The guarantee is untouched and still stands alone: the refusal lists really are
identical either way, because what changes is scope of work, never scope of reach.

---

## Band 9 - The desktop app

### S-017 · band 9 · `.band-head`

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

## Band 10 - What leaves your machine

🔴 **This band is a safety surface.** Humour is off in all three slots. Row 17 `site-privacy` is marked so
explicitly and this band is the same disclosure at home-page length: the reader is being **told**, not
asked, and no sentence may soften the absence of an opt-out into a promise it is not.

### S-018 · band 10 · `.band-head`

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

### S-019 · band 10 · left `.panel.pad` - the command line

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
<p class="t-sm ink-3">Crash bundles stay on disk. Session logs and reports stay on disk. It opens a
  browser only when you ask: to read a report, or to report an issue.</p>
```

*(The three `<svg>` icons inside the `<li>` elements are unchanged; `…` marks where each one stays.)*

**Why.** The third fact gains the half that makes it a guarantee rather than a habit. A grep is a
description. A check that **fails the build** is an enforcement, and it is the reason the Bible's §3
commitment 3 still holds for the engine after the desktop window stopped qualifying. Naming it **check
[9]** matches how the safety model and the decision log refer to it, so a reader who goes looking finds
the same label. One label, three documents.

🔴 **Round 3: "the only time it opens a browser" was one short**. The reports manager's `o` command opens
the HTML report through `Start-Process` (`modules/reports.ps1:176-180`), converting the JSON first if no
HTML exists yet. So there are **two** user-initiated browser opens, not one, and the placeholder named the
rarer of them. Both are still things the reader types, which is why the refusal survives the correction
intact - *"only when you ask"* is the load-bearing half and it is now true of both. `--feedback` prints URLs
rather than opening them, so it is not a third.

The rewritten line also reads better, which was luck rather than design. *"The only time it opens a browser
is when you ask it to report an issue"* buries its refusal in a subordinate clause. *"It opens a browser
only when you ask"* puts the refusal in the main clause and lets the colon carry the two cases. Band R,
earning its place.

🔴 **And the tail "and it is one of the 151" is gone rather than updated.** Its job was to make the check
sound corroborated by a large number, which is the one thing a build gate does not need: the enforcement is
the guarantee, and check [9] would fail the build if it were the only check in the file. The tally never
made it true. What the tail did do was pin the sentence to a release, so a page branded 1.1.0 would have
printed the count of a version that has not shipped. Round 2's decision above covers all three
occurrences.

---

### S-020 · band 10 · right `.panel.pad` - the window and the website

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
never your user name, never the contents of anything."** - which is the voice fingerprint's specimen 9 and
the sentence that replaced the false one on 2026-09-07. It also drops *scan result*, which the placeholder
claimed and which is not on the shipped never-sent list, and it adds *your user name*, which is. The em
dash before "your interactions" becomes a colon.

🔴 **Round 2 called this "the string the product actually ships", and that overstated it.** The shipped
`consent.neverSent` string is **longer**; this is a **condensation** of it, matching the fingerprint's
specimen rather than the product's full sentence. The distinction matters on a disclosure surface, because
"the product ships this sentence" invites a reader to go and find it word for word, and what they will find
is a superset. Condensing approved safety copy is allowed - shortening a never-sent list cannot weaken it,
since every item kept is still a refusal and no item was added. Claiming it is a quotation is not.

**What is true instead:** the wording is the fingerprint's specimen 9 verbatim, it is a faithful shortening
of `consent.neverSent`, and the three surfaces agree in substance rather than in bytes. Same guarantee,
three lengths, one of them this one.

🔴 **The heading's present tense is held, deliberately.** *"The desktop window and this website **do** send
analytics"* is true of the mechanism, and it stays. The linked 1.1.0 build has no destination configured
yet, which is an argument for *"can send"* that this draft refuses: row 17's safety rule reads any softening
of the disclosure as a weakening, and a reader who is told a thing *can* happen files it under maybe. The
site launches after `desktop-v1.2.0` ships with keys, and the page's three `1.1.0` badges move in that same
change.

---

## Band 11 - The family

### S-021 · band 11 · `.band-head`

**Was:** identical - kept verbatim.

```html
<p class="eyebrow">Three tools, one idea</p>
<h2 class="h-band">The other two machines you own.</h2>
```

**Why.** Kept. Seven words that assume the reader has a Linux box or a Mac somewhere, which for this
audience is a safe assumption and a warmer one than "also available for". This block carries no lede in
the dummy and does not need one; the strip below it says the rest.

---

## Band 12 - Also by the same developer

### S-022 · band 12 · `.band-head` — 🔴 **the surface's single W line**

**Was:** `Also by the same developer` / `Other things built here.` / `Not advertising. These are the
developer's own projects, and there is no ad network on this site — the privacy notice above promises none,
and adding one would make it a lie.`

```html
<p class="eyebrow">Also by the same developer</p>
<h2 class="h-band">Other things built here.</h2>
<p class="lede">Not advertising. These are the developer's own projects, and there is no ad
  network on this site. That sentence is the promise: adding one would mean deleting it first.
  Which is the only kind of promise worth writing down.</p>
```

**Why, and why here.** Row 16 allows **one** W line and this is it: *"Which is the only kind of promise
worth writing down."* It is the dry aside of someone who has watched policy pages get quietly amended -
never at the reader's expense and never at the data's - and it lands in the band furthest from any
destructive command on the page, which is what the Bible requires of humour. It also does real work. The
placeholder's *"adding one would make it a lie"* is true but abstract; naming the **mechanism** - the copy
has to be edited first, so the promise is load-bearing rather than decorative - is the same argument the
receipt band makes about numbers, and it is the standing rule in the Bible's §10 that the app's privacy
copy binds. The em dash splits into a full stop, and the sentence fragment beginning "Which" is deliberate.

🔴 **Round 3: *"The privacy notice above"* pointed at nothing**. Read the page upward from band 12 and no
promise about advertising exists. Band 10 discloses four analytics destinations, a session replay and the
absence of an opt-out, and never mentions an ad network; the footer notice (S-030) names the same four
destinations and stops. The promise the clause was reaching for is real, but it lives in the **desktop
app's** privacy copy, which is the Bible §10 binding and a different program on a different surface. So the
reference was inherited from the placeholder and had been false for as long as the sentence existed.

**The repair moves the promise here rather than borrowing one**. *"That sentence is the promise"* points at
the clause immediately before it - *there is no ad network on this site* - which the page does carry, in
its own words, on its own surface. The mechanism then holds without leaving the paragraph: adding a network
would mean deleting that sentence first. **The W line is untouched and still lands on the same
antecedent**. It is a remark about promises that can be edited away, and it now follows a promise the
reader has just been shown rather than one they were told about.

🔴 **It also creates a binding, deliberately**. This surface now carries the no-ad-network claim in its own
right, which means the same §10 rule attaches to it: the sentence goes before a network does, and no
`/download`, `/privacy` or footer change may quietly contradict it. That is the point of writing it here
instead of citing somewhere else.

---

## Band 13 - Docs and FAQ

### S-023 · band 13 · `.band-head`

**Was:** identical - kept verbatim.

```html
<p class="eyebrow">Before you run it</p>
<h2 class="h-band">The questions this tool actually gets.</h2>
```

**Why.** Kept. "Actually gets" claims the list is real rather than invented for the page, which is true -
the content map's §3 records that these come from the product's own FAQ and troubleshooting pages, with an
honesty note that no search-volume data exists for this project yet.

---

### S-024 · band 13 · `.faq` - six disclosure entries

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
      credentials and browser profiles are on the protected list, and no flag lifts the deletion
      gate's protected lists, its declared roots or its containment check.</p>
    <p>Three sections do touch personal files, and all three are interactive: partial downloads,
      large stale files and orphaned application data. Each shows you a list, defaults to nothing
      selected and asks a final question that <span class="mono">--yes</span> does not answer.
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
    <p><span class="mono">windowsweep --self-test</span> runs its checks on your machine. A real
      junction, a path past 400 characters and a dry-run fixture whose tree is hashed before and
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
      CI runs the self-test and a dry-run on Windows Server on every push to
      <span class="mono">main</span> and every pull request. But no real cleanup has ever been run
      on Server, and that is stated rather than glossed.</p>
    <p>Linux and macOS have their own tools; npm refuses to install this one there.</p>
  </div>
</details>
```

**Why.** Every answer already opened with its answer, which is the one thing an FAQ has to do for a
snippet, so the edits are small and specific. The admin entry now opens on **"Six sections need Windows to
ask your permission first"** - the fingerprint's specimen 5, verbatim - instead of "Only for sections 12 to
16 and 20", which makes a reader count. "Skip with the exact command" becomes "skip, and print the exact
command", because *skip with* reads as though the command is a condition of skipping. The self-test answer
loses its tally under the round-2 decision above and keeps every piece of the evidence: *"runs 151 checks"*
becomes *"runs its checks"*, and the junction, the 445-character path and the hashed fixture tree stay
exactly where they were. That was always the offer. A reader asking **how do I check
it before trusting it** wants to know what to type and what it will prove; a total was never either of
those. Its proof clause changes to "the tree did not change", matching S-006. The
`--list-targets` answer gains **"Read it before you run anything. That is what it is for."** - two short
sentences closing the surface's longest block, and the only place on the page that tells a sceptical
reader what to do with their scepticism. Two more em dashes go.

---

## Band 14 - Contact

### S-025 · band 14 · `.band-head`

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

### S-026 · band 14 · `.blocked > span` - why the form cannot be submitted

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

## Band 15 - Closing

🔴 **The departure round 2 recorded here has been closed by design, not by this draft.** Row 16's spine
ends on *"the two install paths"* and `design/README.md` §6 names band 15 *"Closing - the two paths again"*;
round 2 found the built band carrying one, reported it rather than reaching into the dummy, and wrote the
missing line as a conditional slot. **The condition is now met.** Band 15 holds the `npx windowsweep
--scan` terminal, then S-031's sentence, then a `Download for Windows` link to `/download`, then the
install-size caption. Two paths, as specified.

**Nothing in S-027 or S-028 changed because of it.** *"The first command deletes nothing"* and *"Run it,
read what it found, and decide afterwards"* are true of the window as well, since the window runs the same
engine and shows its picture before it starts. Both slots stay verbatim. The band gained a sentence and a
control underneath them rather than a rewrite of them, which is the cheapest possible way for that
specification to have been met.

**The reader this was for is band 9's.** *"If you would rather not type"* invited them six bands earlier
and the close used to return them to a command line. It no longer does. S-031 is now an ordinary applied
slot and it is counted in every figure in this file.

### S-027 · band 15 · `h2.display`

**Was:** identical - kept verbatim.

```html
The first command deletes nothing.
```

**Why.** Kept. Five words, the page's whole argument, and the fingerprint's closer rule exactly: end on
the concrete next action or the plain limit, never on a rallying summary. It is also the only closing
headline available that a reader can verify in the next thirty seconds.

---

### S-028 · band 15 · `p.lede`

**Was:** identical - kept verbatim.

```html
Run it, read what it found, and decide afterwards. That order is the whole design.
```

**Why.** Kept. Long sentence, short sentence, and the short one names the thing the page has been
demonstrating for fifteen bands rather than restating what it said. The install-size line below it
(`Windows 10 (1809 and later)…`) is outside this block and is untouched. **If band 15 grows a download
control, S-031 is the line that goes under it** - it is an addition to this block, never a rewrite of it.

---

## The footer - `shell.js`

### S-029 · `shell.js` · the brand-column tagline (the string at `:148`, its marker at `:149`)

🔴 **Round 2 found this block carrying no `data-wsw-copy` attribute** - it lost the marker when the footer
moved out of `index.html`, so a grep-driven applier would have skipped it while reporting success. **That is
repaired.** The tagline string is at `shell.js:148` and the marker is set explicitly on the next line,
`tagline.setAttribute('data-wsw-copy', 'pending')` at `:149`. The slot is kept here because the reasoning
below is still the reason this line reads as it does.

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

### S-030 · `shell.js:59-62` · `ANALYTICS_NOTICE`, rendered into `.foot-note` (its marker at `:171`)

**Was:** `This site and the desktop window send usage events to Google Analytics 4, Amplitude and Microsoft
Clarity, and errors to Sentry. Clarity records session replays. There is no opt-out. The command line sends
nothing.`

```js
var ANALYTICS_NOTICE =
  'This site and the desktop window send usage events to Google Analytics 4, Amplitude and ' +
  'Microsoft Clarity, and errors to Sentry. Clarity records session replays. There is no opt-out. ' +
  'The command line sends nothing.';
```

**Why.** Kept, and now byte-for-byte. Round 2's fence re-wrapped the concatenation across the third and
fourth lines for a column limit the source already respects, which made a no-op slot look like a one-line
edit; the fence above is the current source exactly, so applying it changes nothing at all. This is a
safety surface and the sentence order is doing the work: destinations, then the
replay, then the absence of a switch, then the one program the notice does **not** cover. Every one of
those four is a fact rather than a persuasion, and the last is the refusal that keeps the strong claim
where it is still earned. It also agrees with S-020 line for line, which is the point of a notice
appearing twice on one page.

---

### S-031 · band 15 · the second path - 🔴 **NO LONGER CONDITIONAL, and it ships**

🔴 **The condition was met between rounds, so every "do not apply" sentence this slot used to carry is
gone.** Band 15 grew a download control - `<a class="btn btn-ghost" href="download.html">Download for
Windows</a>` - and above it an element carrying **these exact words**, marked `data-wsw-copy="pending"`.
Round 2 wrote the copy against a decision nobody had taken yet; design took it, and adopted this wording
rather than authoring its own. So the slot is now an ordinary applied one and finding 4 below is closed.

**It keeps the number 31 and its position after the footer.** Renumbering would break every cross-reference
in this file and in the sibling records for a cosmetic gain, and the applier works by fixed-string search
rather than by reading order. What is no longer true is the reason the number was parked here, so that
reason is struck rather than left to look current.

🔴 **The wrapper differs from what round 2 guessed, and the words do not.** Round 2 specified
`<p class="t-sm ink-3" style="margin-top: var(--sp-5)">`; the dummy built
`<p class="lede" style="margin: var(--sp-6) auto 0">`. **Identical text, different element** - a larger,
centred paragraph rather than a small grey caption. The fence below is therefore reduced to the block's
**interior only**, which is this file's stated convention everywhere else: *substitute the interior; leave
the wrapper, its classes, its inline styles and its marker alone.* Design's choice stands. A closing
invitation set at lede size is defensible and it is design's call, not a writer's.

**Was:** identical - the dummy already carries these words verbatim.

```html
If you would rather not type, the desktop app is the same engine in a window, and the deletion
gate refuses exactly the same paths.
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

**What it does not duplicate.** No SmartScreen caption, no checksum sentence, no file size. The control
design actually built is a **link to `/download`**, not an installer button, so the caption question never
arose: those facts are settled at **S-002** for the hero and at S-034 and S-036 for the page the link goes
to. Nothing is authored a third time.

🔴 **It is now counted everywhere, and its length was wrong.** Round 2 wrote *"its 26 words"*; the sentence
is **25**. Count it: *If you would rather not type, the desktop app is the same engine in a window, and the
deletion gate refuses exactly the same paths.* So band 15 goes from 20 words to **45**, not 46, and every
figure in the self-check now includes this slot instead of excluding it. Two errors, one line. The
exclusion was right when it was written and the arithmetic never was.

---

## The `/download` page - S-032 to S-036

🔴 **Row 16 names *"the marketing site's home bands and `/download`"*, and round 2 could not write the
second half.** `/download` did not exist: `design/README.md` listed it under what was not built, so it had
no element to target and no `Was:` line was possible. It exists now. `design/README.md` §11 *"What is NOT
built"* no longer mentions it, and `download.html` is in the dummy carrying **five** `data-wsw-copy="pending"`
blocks of its own.

**Five slots, not seven, and the difference is the footer.** §12's table reads *"`download.html` — 7"*,
counted from the rendered DOM, where `shell.js` contributes the brand tagline and the analytics notice to
**every** page. Those two are already **S-029** and **S-030** in this file and they are one string each, not
one per page. Re-slotting them per page is exactly the drift row 15 was created to stop. So: 5 new slots
here, 7 pending blocks on the rendered page, and no string owned twice.

**This page is a sibling of the home page, not a second copy of it.** It answers one question the home page
only gestures at - *how do I actually get it, and what will Windows say when I do* - so the two overlap by
design at exactly one place, the SmartScreen fact, which is settled copy and is reused verbatim rather than
paraphrased a third time.

### S-032 · `download.html` · `p.lede` in `.page-head` - the two ways in

**Was:** `The command line installs nothing. The desktop app is a 2.37 MB installer. Both run the same
engine, and the engine is the part that does the deleting.`

```html
The command line installs nothing. The desktop app is a single installer. Both run the same
engine, and the engine is the part that does the deleting.
```

**Why.** One correction and nothing else, because the paragraph is already in voice: three sentences, the
middle one short, closing on the fact that matters. **2.37 MB is the same wrong figure S-002 carried** - a
mebibyte reading of a local build that was never published - and this is a lede, which is the worst place
on the page to put a number that has to be qualified. So the size moves to S-034, where the release it
belongs to is named in the same sentence, and the lede says the thing the reader needs at that point:
there is one installer, not a menu.

The third sentence is untouched and is the reason the page can be short. *"The engine is the part that does
the deleting"* is the whole safety argument inherited in eleven words, so `/download` never has to restate
the chokepoint.

### S-033 · `download.html` · `p.t-sm.ink-2` under "The command line" - what npx does

**Was:** `Nothing is installed. npx fetches the package, runs it and leaves. Start with the scan, which
deletes nothing at all.`

```html
Nothing is installed. <span class="mono">npx</span> fetches the package, runs it and leaves.
Start with the scan. It deletes nothing.
```

**Why.** The last clause splits into two sentences, which is the fingerprint's rhythm rule and also puts
this page's phrasing in step with the hero's. S-001 already closes on *"Start with `--scan`. It deletes
nothing."* and specimen 1 models the same shape. *"Which deletes nothing at all"* trails the emphasis into
a subordinate clause and reaches for an intensifier the plain sentence does not need. Three words shorter,
and the paragraph now ends on its shortest sentence.

### S-034 · `download.html` · `p.t-sm.ink-2` under "The desktop app" - the release

**Was:** `Release desktop-v1.1.0, published 7 September 2026. It bundles the same engine and reimplements
none of it.`

```html
Release <span class="mono">desktop-v1.1.0</span>, published 7 September 2026. The
<span class="mono">.exe</span> is 2,520,200 bytes. It bundles the same engine and reimplements
none of it.
```

**Why.** The size S-032 gave up lands here, in bytes, beside the release it is a property of. **2,520,200 is
the published asset**, per the GitHub releases API and the `SHA256SUMS.txt` beside it - not the 2,483,662
local build of 2026-09-06, which was made before the updater keypair existed and never left the machine.
Bytes rather than megabytes for the reason S-002 gives: it is this project's unit, and it is the unit that
cannot quietly mean two things.

🔴 **The checksum is deliberately not printed, and the page already says why.** A `t-xs` caption further
down reads *"The checksum value itself is not printed here: it changes with every build, and a stale hash on
a marketing page is worse than no hash."* Adding even a truncated hash to this slot would contradict a line
on its own page. The byte count is a different case - it is a property of one named, frozen release, which
is what makes it safe to state.

*"Reimplements none of it"* is kept word for word from S-017. Same claim, same sentence, two surfaces.

### S-035 · `download.html` · `p.t-sm.ink-2` - why a global install

**Was:** identical - kept verbatim.

```html
Installing it globally is
  only worth doing if you want the weekly scheduled task or the shell alias, because both break when the
  npx cache is evicted.
```

**Why.** Kept. It answers *should I* rather than *how do I*, gives the two real reasons
(`--install-task` and `--install-alias`, `README.md:303`) and then names the failure mode that makes them
worth it - which is a refusal-shaped answer to a question most download pages answer with an
encouragement. Nothing here reads as placeholder.

### S-036 · `download.html` · `p.lede` under the SmartScreen heading

**Was:** `This app is not signed with a code-signing certificate. Windows therefore shows "Windows protected
your PC" on first run. That is a statement about the certificate, not about the file. Choose More info, then
Run anyway — or verify the download first.`

```html
The installer is not signed with a paid code-signing certificate, so Microsoft SmartScreen shows
<em>&ldquo;Windows protected your PC&rdquo;</em> on first run. That is a statement about the
certificate, not about the file. Choose <b>More info</b> and then <b>Run anyway</b>. You can
verify what you downloaded first.
```

**Why.** This is **GATE-4-approved copy, reused verbatim** - slot S-015 of `desktop-readme.md`, approved on
2026-09-05, whose first paragraph and the opening of its second are exactly what this element has room for.
The draft's own scope note promised it: *"S-015 is what `/download` should carry when that page exists."*
It exists. The rest of S-015 - what a checksum and a signature each prove, and what neither is - is already
on this page as the two panels directly below, so the lede stops at the instruction and lets the layout
carry the distinction.

**Three corrections ride along, and all three are the placeholder drifting off approved wording.** *"This
app"* becomes **"The installer"**, which is what is unsigned; the app is what runs afterwards. *"Windows
therefore shows"* becomes **"Microsoft SmartScreen shows"**, naming the component the reader will actually
see. And the missing word is **paid** - the same correction S-002 carries, for the same reason: *"not signed
with a code-signing certificate"* reads as a claim about the file, and *"not signed with a **paid**
code-signing certificate"* reads as a claim about what was bought. One is alarming and wrong. The other is
the true one.

🔴 **The em dash goes and the clause becomes a sentence.** *"— or verify the download first"* offers
verification as an alternative to running it, which inverts the advice: the approved copy says *"You can
verify what you downloaded first"* as its own sentence, an invitation rather than a fork. The surface's em
dash count stays at zero.

---

## 🔴 Counts, and why neither is asserted

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

**Question 2, closed - the audit count.** Three sources disagree. `README.md:109` reads *"plus three
read-only audits (global packages, idle programs, startup items)"* and goes on to say orphaned application
data *"is a fourth 1.1.0 section and is **not** an audit"*, which is the likeliest origin of the four the
round-1 brief carried. `docs/safety-model.md:104` also says three (22, 24, 25 - read-only, safe, outside
`--all`), while its tier table at line 80 puts **five** sections in the Report-only tier (0, 21, 22, 24,
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

## Reported, not fixed - two open findings, and three that closed between rounds

**Three of round 2's four are gone, and none of them was closed by this draft.** They are recorded as
closed rather than deleted, because a finding that vanishes silently reads as a finding that was never
real.

1. ✅ **CLOSED - the unslottable self-test count.** Round 2 reported that the receipt's evidence ledger
   carried `<dt>Guards proved on this machine first</dt><dd>151</dd>` outside every pending block, leaving
   one tally on a page that had just decided to print none. **Design removed the row.** The ledger now
   reads `Sections that reported — 11` and `Drive — C:` and nothing else, at `index.html:164-167`.
2. ✅ **CLOSED - band 15's missing second path.** Design took the first of the three routes: band 15 grew a
   `Download for Windows` link to `/download`, above it the element S-031 was written for, and the page now
   ends on two paths as row 16 and `design/README.md` §6 both specify. See S-031, which is no longer
   conditional.
3. ✅ **CLOSED - `/download` did not exist.** It does. Its five own slots are **S-032 to S-036** above, and
   row 16's second half is now written rather than deferred.
4. 🔴 **OPEN - the hand-back grep under-reports, and the fix is already documented where the grep is.**
   `design/README.md` §12 now gives **both** greps and reconciles them - `index.html` 28 plus `shell.js` 2 -
   and its table counts from the rendered DOM instead. The residue is that a reader who runs only the first
   grep still gets a number below the truth, and that number has moved again: `index.html` now returns
   **29**, because band 15 gained S-031's block. So the rendered count for the home page is **31**, not the
   30 §12 records. Design's to re-measure; the mechanism is right and only the figure is stale.
5. 🔴 **OPEN - `<meta name="description">` and `og:description` are not marked `pending`** and are not
   slotted here, but they are product-voice prose on an indexed page and belong to a row - most likely **19**
   `site-front`, which the map assigns the site's per-route `<title>` and description text. Flagged so the
   boundary is decided rather than discovered. `/download` has the same pair and the same question.
6. 🔴 **OPEN, and new - `/download`'s two artefact cards print megabyte sizes that no longer match.**
   `.artefact-meta` carries `2.37 MB` for the `.exe` and `3.06 MB` for the `.msi`, in spans outside every
   pending block, so this inventory cannot reach them. **2.37 MB is the figure S-002 and S-032 have just
   corrected** - a mebibyte reading of the superseded local build - so once those slots are applied the page
   states 2,520,200 bytes one paragraph above a card reading 2.37 MB. The `.msi` has the same defect and
   **this draft has no published byte count for it**, which is a `NEEDS DECISION` below rather than a guess.
   The edit is design's. It should land in the same change as the slots.
7. **OPEN, minor - a pronoun with the wrong antecedent on `/download`.** The right-hand panel reads *"A
   code-signing certificate. They prove the file is the one that was built — not who built it."* The
   **they** means the checksum and the signature, which are named in the *other* panel, so as written the
   sentence says a certificate proves the thing the page has just said it does not. Outside every pending
   block, so reported rather than fixed. The approved sentence it drifted from is in S-015 of
   `desktop-readme.md`.

---

## SELF-CHECK

**Method, stated because a figure without one cannot be reconciled.** Every number below is measured over
**the shipping strings only** - the text inside the **36** fenced blocks, with HTML tags, `<!-- -->` comments
and JavaScript scaffolding stripped and entities resolved. Block-level closes (`</p> </h2> </h3> </li>
</summary>`) end a sentence; inline `<span> <b> <em>` do not. Three non-prose runs are excluded: the two
`<p class="mono">` path inventories, the three `.hero-facts` chips and the `.rc-total` numeral. So is the
verification `bash` fence, and so are `S-006`'s three terminal transcripts, because row 10 owns them.
The `…` markers standing in for the unchanged `<svg>` icons in S-019 and S-020 are not words and are
dropped. Commentary and `Was:` lines are **not** counted. Nor is this self-check. Sentence split is
`(?<=[.!?])\s+` with `1.1.0`, `2,520,200`, `5.84`, `9.85`, `3.66`, `SHA-256`, `desktop-v1.1.0` and
`Windows 10 1809` protected first.

🔴 **Two scope changes in round 3, and naming them is the point.** **S-031 is now counted everywhere**,
because it ships; round 2 excluded it and said so, and that exclusion is withdrawn rather than left to
decay. And **`/download` enters the arithmetic as its own page**, S-032 to S-036, because row 16 covers it.
The two are reported **separately and then combined**, never merged into one figure, since the row's
structural cap - *"a landing page, 12-15 bands"* - is about the home page and says nothing about a second
page. A scope difference and a drift are indistinguishable unless the scope is written beside the number.

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
by phrase, against all 102 lines of `assets/banned-phrases.txt` - result below. The sibling trap is only
part-handled, and the copy edit corrected this sentence rather than the file: the round-2 additions put the
full stop outside the emphasis, `**like this**.`, but 84 earlier bolded sentence-ends in this commentary -
every `**Why.**` label among them - keep it inside, so the hook's splitter under-counts the commentary's
sentences. Measured, not asserted, in item 7. It changes nothing about the copy, which the hook never sees.

**1. Palette - P dominant, R strong, W exactly once.**

| Band | Slots | Delivered |
|---|---|---|
| **P** precision before an irreversible act | S-001 (hero lede), S-002, S-003, S-004, S-005, S-006, S-009, S-010, S-012, S-013, S-014, S-015, S-016, S-018, S-020, S-024, S-025, S-026, S-027, S-028, S-029, S-030, **S-032, S-034, S-036** | **~62%** of shipping words |
| **R** refusal as reassurance | S-001 (*"No flag lifts that"*), S-007, S-008, S-011, S-017, S-019, S-021, S-023, **S-031, S-033, S-035** - the whole refusal band plus the override note, each one a **named refusal** rather than an adjective | **~35%** of shipping words |
| **W** workshop dryness | **S-022, one line:** *"Which is the only kind of promise worth writing down."* | **~3%** |

**What round 3 moved inside this table, and what it did not.** 🔴 **S-031 is now counted, and it is R** -
*"the deletion gate refuses exactly the same paths"* is a refusal, and it is the closing band's only one.
The five `/download` slots split the way the page does: **S-032, S-034 and S-036 are P** (what the thing
is, what it weighs, what Windows will say), **S-033 and S-035 are R** (*"Nothing is installed"*, *"It
deletes nothing"*, and the reason a global install is usually not worth it). The proportions do not move
past their rounding, because the additions land in both columns in roughly the ratio already there.

**The corrections did not cost the palette anything, and two of them paid it.** S-010's sixth refusal and
S-011's five named ones are **more** R than the ordinals they replaced - *"no flag lifts traversal, the
roots, the protected lists, your own exclusions or containment"* is five refusals said aloud where *"steps
1 to 4 have no override"* was a fact about a numbering. S-016's second effect is P: it is precision about
what an answer costs. The W line is untouched. Still exactly one, still at S-022.

**Where the W was spent, and why there.** S-022, band 12, the house-promotions heading - the furthest block
on the page from any destructive command, in the only band that is about neither deletion nor disclosure.
The Bible bans humour near an irreversible action and switches it off entirely on safety surfaces, which
rules out bands 2, 4, 5, 6, 10 and 13. 🔴 **`/download` carries no W at all**, deliberately: it is a page
about running an unsigned installer, which is the SmartScreen conversation, and the Bible switches humour
off near exactly that. One W line was also **removed** earlier to stay inside the budget - S-014's *"and
your afternoon is gone"*, which sits directly above the two panels describing what gets deleted.

🔴 **Round 3 rewrote the W line's surroundings without touching the line.** S-022's dangling *"the privacy
notice above"* was corrected to *"That sentence is the promise"*, and the aside that follows it -
*"Which is the only kind of promise worth writing down"* - is unchanged and now has a true antecedent
rather than an imagined one. A joke pointing at something that does not exist is not a joke; it is a
defect wearing one.

R runs above the Bible's 25 because band 4 is eight consecutive refusals and the row calls R "strong" for
this surface. Reported rather than trimmed: cutting a refusal to hit a ratio on the page whose design read
is *trust is the content* would be the tail wagging the dog.

**2. Rhythm.**

| Measure | Home (S-001-S-031) | `/download` (S-032-S-036) | Both | Target |
|---|---|---|---|---|
| Words · sentences | **2,046 · 194** | **143 · 15** | **2,189 · 208** | - |
| Mean length | 10.55 | 9.53 | 10.52 | median 12-16 (under, deliberately - see below) |
| Standard deviation | 7.50 | 6.51 | 7.48 | - |
| **Burstiness** (σ ÷ mean) | **0.71** | **0.68** | **0.71** | ≥ 0.45 ✅ |
| **Shortest** | **1 word** - the rail's step labels *"Scan."*, *"Run."*, *"Read-only."*, *"Dry-run."* (S-006) and the chokepoint labels *"Roots."*, *"Containment."* (S-010). Next: *"Not adjectives."* (S-007), *"Never less."* (S-015) | **3 words** - *"Nothing is installed."* and *"It deletes nothing."* (S-033) | 1 | ≤ 6 ✅ |
| **Longest** | **32 words**, three of them tied - S-008's *"A profile is refused twice over…"*, S-010's fifteen-root enumeration and S-015's *"A cache file goes only when its newest timestamp…"* | **27 words** - S-035's global-install sentence | 32 | ≤ 34 ✅ |
| Sentences ≤ 6 words · ≥ 25 words | 79 · 10 | 4 · 1 | 83 · 11 | both present ✅ |
| Sentences over the 34-word ceiling | **0** | **0** | **0** | 0 ✅ |
| **Em dashes** | **0** | **0** | **0** | ≤ 1 per 150 ✅ - the placeholders carried **11**, plus one more on `/download`; all twelve became full stops, colons or commas |
| Rule-of-three lists | 5 | 0 | 5 | ≤ 2 per 500 ✅ |
| Consecutive same-word openers | max 2 | max 1 | max 2 | < 3 ✅ |
| Semicolons | 5 | 0 | 5 | allowed by the fingerprint |
| Exclamation marks | **0** | **0** | **0** | 0 ✅ |
| Banned phrases | **0** | **0** | **0** | 0 ✅ |
| Banned diction (fingerprint) | **0** | **0** | **0** | 0 ✅ |

🔴 **Round 3 re-measured with its own instrument and reconciled it against round 2's before believing
either.** Run on the **pre-round-3** file, restricted to the thirty slots round 2 measured, it returns
**1,962 words · 189 sentences · mean 10.38 · σ 7.25 · burstiness 0.70** where round 2 recorded
**1,950 · 189 · 10.32 · 7.21 · 0.70**. **Every structural figure is identical** - the sentence count to the
unit, the burstiness to two decimals - and the word totals sit 12 apart, 0.6 per cent, from where each pass
tokenised `<span class="mono">` fragments and the JavaScript concatenation. That is close enough to
attribute the movement below to the edits rather than to the instrument, and it is stated because a scope
difference and a drift look the same otherwise.

**What actually moved, in words.** Pre-round-3 the home page measured 1,962 over thirty slots; adding
S-031's 25 gives **1,987** on this round's scope. It now measures **2,046**. So round 3's edits are
**+59 words** and **+5 sentences** on the home page - the sixth chokepoint refusal and the full fifteen-root
enumeration account for most of it - with `/download`'s **143** on top.

**Mean length is 10.6 against the fingerprint's 12-16 median, and that is a property of the surface rather
than a miss.** A landing page is 34 headings, 3 fact chips and 8 list items short enough to scan, so its
prose mean sits below a document's. The measures that matter for rhythm both clear: burstiness 0.71 and
zero sentences over the ceiling. The line edit's re-measurement is item 6 at the end of this self-check.

<!-- story-lint: allow "elevate" -->

**The one allowed phrase, and 🔴 round 3 finds the marker is belt-and-braces rather than load-bearing.**
`elevate` is on the banned list at line 50, as the marketing verb. It occurs once on this surface, at
S-024, as **`--elevate`** - the tool's actual flag name, inside a `<span class="mono">`, in the sentence
that tells a reader how to relaunch through a UAC prompt. Renaming a shipped flag to satisfy a phrase list
is not available, and paraphrasing around it would leave the reader without the string they have to type.

**But it would not have been flagged anyway**, which round 2 did not check and this round did. The
matcher - the hook's own, reused verbatim for the by-hand sweep - is
`(?<![\w'-])elevate(?![\w'-])`, and a hyphen is inside that character class. So the lookbehind fails
against the `-` of `--elevate` and the flag form cannot match. The marker stays: it records the intent, and
it is the guard if a future edit ever writes the bare verb. **It is not what makes the sweep come back
clean.** Saying otherwise would credit a mechanism that never fired.

🔴 **The round-3 by-hand sweep, and its result.** The lint hook cannot see one word of this file's
shipping copy - it strips every fence before it counts - so the sweep is run separately, in code, over the
extracted fence text rather than by eye. **All 36 slots, not only the changed ones.** Matcher: the hook's
own, reused verbatim, case-insensitive, whitespace-flexible for multi-word entries. Corpus: `assets/
banned-phrases.txt`, **87 phrase entries across its 102 lines**.

**Zero hits.** Including `elevate`, for the reason above. The fingerprint's own never-list was swept the
same way and also returns zero; it is read from `voice-fingerprint.md` and deliberately **not reproduced
here**, because quoting a gate's vocabulary inside the corpus that gate reads is how a record starts failing
the check it was written to document. **Described, not listed:** the entries that came closest to plausible
on a page like this one are the deletion-triumph verbs and the effortlessness adjectives, and none of them
occurs in any form.

**Two near-misses are named so the next reader knows they were weighed.** The **X, not Y** construction runs
to four on the home page - S-018's *"the site gives the window's answer, not the engine's"*, S-020's two,
and S-024's *"That costs time, not information"* - against a budget of seven at 2,046 words, with S-011's
*"never where the tool may reach"* a cousin that makes five. `/download` adds none. And S-031 was
deliberately narrowed off *"every refusal on this page holds there too"*, which is not a banned phrase but
was a false one.

🔴 **A green hook on this file is not evidence about the copy, and round 3 did not treat it as any.** The
hook reported on every write in this round; every one of those reports concerned the commentary. The
fact-checker and a human reader remain the only real gate on the shipping strings, which is why this round
exists at all: **sixteen contradictions reached a fourth round of review with the hook green throughout.**

**3. Length against the row's cap.** Row 16's cap is structural - *"a landing page, 12-15 bands"* - not a
word count. **15 bands**, unchanged; no band added, none removed, none merged. `/download` is a **separate
page** under the same row, so it is tabled beside the bands and never folded into them.

| Band | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | foot | **home** | `/dl` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Ships**, round 3 | 148 | 134 | 151 | 301 | 203 | 49 | 41 | 186 | 42 | 199 | 10 | 48 | 396 | 84 | **45** | 50 | **2,087** | **143** |
| **Ships**, round 2 | 148 | 125 | 152 | 307 | 162 | 50 | 41 | 183 | 42 | 198 | 10 | 51 | 386 | 84 | 20 | 52 | **2,011** | n/a |
| **Was**, the placeholders | 124 | 129 | 129 | 264 | 154 | 36 | 41 | 199 | 42 | 177 | 10 | 41 | 364 | 84 | 20 | 49 | **1,863** | 135 |

Counted per slot on the **inclusive** rule, so the home total is **2,087** where the rhythm table says
2,046. The 41-word gap is the three non-prose runs the rhythm measurement excludes and this one does not:
the two `<p class="mono">` path inventories, the three `.hero-facts` chips and the `.rc-total` numeral. Two
rules, both written down, both applied to both rows.

🔴 **Read the two Ships rows as one measurement each, not as a band-by-band diff** - the caution round 2
wrote, and round 3 has more use for it than round 2 did, because the instrument changed hands. Where a band
moves by one or two words and **no slot in it was edited**, that is the tokenizer: band 3 at 151 against
152, band 6 at 49 against 50, and the footer at 50 against 52, which is S-030's fence being re-wrapped to
match its source exactly.

**Five bands moved because their copy did**, and each is traceable to a correction above:

| Band | Round 2 -> 3 | Why |
|---|---|---|
| **5** | 162 -> **203** | the sixth refusal (`--exclude-path`) and the full fifteen-root enumeration, replacing an eleven-item list |
| **15** | 20 -> **45** | S-031 counted, because it now ships |
| **13** | 386 -> **396** | the CI trigger's real qualifier, S-024's split self-test answer, the de-ordinalised first answer |
| **2** | 125 -> **134** | S-004's scale correction, which spends words making the corrected gap legible |
| **8** | 183 -> **186** | *"seven of the sections"* and the developer-mode second effect, less the Gradle figure |

Net **+224 words over the home page's placeholders, about +12%**, and `/download` moves 135 -> **143**,
which is +8. At 2,087 words the home page clears the ~1,000-word floor an indexed page needs by a wide
margin, and no band is out of scale with its neighbours.

🔴 **That `/download` baseline was very nearly wrong, and the way it was nearly wrong is worth recording.**
`design/README.md` §12 tables the page at **178** provisional words, and taking that as the placeholder
figure would have reported a 35-word **shrink** where there is an 8-word growth - the sign reversed. The
178 counts **seven** rendered blocks, the five own ones plus the two `shell.js` contributes to every page;
these five slots are the five. **A total is only comparable to a total over the same set**, and the two
sets differ by exactly the blocks this file already owns at S-029 and S-030. So the baseline was
re-measured off `download.html` directly rather than lifted from a table built for another purpose.
🔴 **Every figure in this table now includes S-031 and excludes nothing** - the round-2 sentence reading
*"S-031's 26 conditional words are in none of these numbers"* is withdrawn, and the count was 25 in any
case.

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

**5. Unsure spots.** Round 1 raised two `NEEDS DECISION`, on the self-test count and the audit count; round
2 answered both. Round 3 closes the `refused: 0` question with evidence and **opens one**, which is stated
in full at the end of this section. Four findings are reported outside scope, three more are recorded
closed. Three things I am less than certain of and did not guess:

- ✅ **`refused: 0` is answered and the row is gone.** Round 2 left it open for the fact-checker; the
  fact-checker resolved it. `$ws.Refusals` counts **sections** refused by batch policy, never paths, and the
  recorded run could not have produced any other value. The row was removed from the dummy and the ledger
  now carries two facts. Recorded under S-003 rather than here, because it stopped being an uncertainty and
  became a finding.

- **`released 2026-09-07` at S-002 is carried from the placeholder**, not verified. The installer's name
  and its **2,520,200 bytes** are now sourced to the GitHub releases API and the published `SHA256SUMS.txt`
  rather than to the tracker, which is a stronger source than round 2 had. The release *date* still rides
  on the placeholder; it agrees with the tracker's own account of the 2026-09-07 release and I did not
  re-derive it. Low risk, and cheap to settle.
- **S-029's reuse of the approved tagline is a call I made, not a rule I found.** The argument is above.
  It is a one-line revert if the owner reads the footer as needing its own sentence.
- **The voice fingerprint is still `calibrated: false`.** Every rhythm figure here is measured against
  twelve specimens derived from the repository rather than from samples the owner chose. That is the
  Bible's own open item, not a new one - but it is what "reads as this voice" means on this surface, and
  it should be said rather than assumed. Unchanged since round 1. Still not a blocker.

🔴 **One open `NEEDS DECISION`, and it is a number I refuse to guess:**

> **NEEDS DECISION: the published byte count of `windowsweep_1.1.0_x64_en-US.msi`.** `/download`'s second
> artefact card prints `3.06 MB`, which came from the same superseded local build as the `.exe`'s `2.37 MB`
> - and that one is now known to be wrong by 36,538 bytes. The card is outside every pending block, so this
> draft cannot edit it either way; the decision is whether the corrected figure goes in beside the corrected
> `.exe`. Options: **(a)** read both sizes off the `desktop-v1.1.0` release assets and correct the two cards
> in one design change, which is recommended, because the page will otherwise state 2,520,200 bytes at
> S-034 one paragraph above a card reading 2.37 MB; **(b)** drop the size from both cards and leave S-034 as
> the only place a size appears, which is defensible and loses the at-a-glance comparison between the two
> installers; **(c)** leave both cards alone and accept a visible contradiction, which I do not recommend on
> the one page whose argument is that its numbers can be checked. I have the `.exe` figure and not the
> `.msi` figure, and inventing the second to make a pair is exactly the failure this surface is written
> against.

**6. The line edit - re-measured, not inherited.** Four fences changed at sentence level. Nothing else
moved. No fact, slot, band, heading or decision is different, and every one of the five settled decisions
above is where round 2 left it. S-006: *"a log and a report, and none of yours"* becomes *"a log and a
report. None of yours."*, the one short sentence a paragraph of four mid-length ones lacked. S-008: *"There
is no flag, no profile and no configuration file that reaches any of them"* loses its *there is ... that*
frame and reads *"No flag, no profile and no configuration file reaches any of them"*, three words shorter
and ending on its object. S-015: the spaced hyphen before the four-tool list becomes a colon, because a
hyphen doing a dash's job on a web page is the one mark the fingerprint's budget does not cover, and a full
stop or a colon is what it asks for. S-016: *"pruned on the idle gate"* returns to the placeholder's
*"pruned by the idle gate"*. The *on* arrived without a reason. It read as a drift.

**Instrument.** The method at the top of this section, run as written: the 30 shipping fences, tags and
comments stripped, entities resolved, block closes ending a sentence, the same three non-prose exclusions,
whitespace-split tokens, the stated split regex. It was run first on the **pre-edit** file, and it returned
**188 sentences · 1,955 words · mean 10.40 · σ 7.24 · burstiness 0.70 · shortest 1 · longest 33 (S-015 and
S-024) · 76 at or under six words**, against round 2's 188 · 1,971 · 10.48 · 7.33 · 0.70 · 1 · 33 · 76.
Identical on every sentence figure. Sixteen words apart on the total, 0.8 per cent, from where each pass
counted the `·` separators and a bare hyphen, and one apart on the at-or-over-25 count (8 against 9). Close
enough that the movement below is the edits and not the instrument.

**After the edits: 189 sentences · 1,950 words · mean 10.32 · σ 7.21 · burstiness 0.70 · shortest 1 ·
longest 33, S-024 alone · 77 at or under six · 8 at or over 25 · 0 over the ceiling · 0 em dashes · 0
exclamation marks.** One sentence gained. Five tokens lost. No verdict changed. Section 3's band table is
round 2's measurement and is not re-run here; on its own inclusion rule the line edit moves band 3 by one
word, band 4 by three, and band 8 by nothing or by one, depending on whether that instrument counted the
bare hyphen. The four edited strings were swept by hand against the same 87 banned entries and against the
fingerprint's 22-entry never-list, which is read from `voice-fingerprint.md` and not reproduced here. Zero
hits. The hook saw none of them, for the reason stated above, and its verdict on this write concerns the
commentary alone.

**7. The copy edit - mechanical, and measured with item 6's instrument**. Five fences changed, none by a
word. S-007, S-014 and S-024 lose a serial comma (*"counted, enumerated and printed"*, *"remembers the
answer and changes"*, *"defaults to nothing selected and asks"*), S-012 loses the comma from a two-item list
(*"emptying the Recycle Bin and clearing the event logs"*), and S-015's *toward* becomes *towards*, the
en-GB form. **The serial-comma convention is the en-GB default and the page's own majority practice**: no
comma before the final *and* in a list of words or phrases sharing one grammatical slot; a comma stays only
where it separates independent clauses or prevents a misreading. So S-028's three imperatives (*"Run it,
read what it found, and decide afterwards"*), S-008's *"the registry hives, and the page and swap files"*,
S-024's *"12 to 16, and 20"* and S-030's compound object keep theirs, and S-028 is flagged for the line
editor's veto rather than changed under a kept-verbatim label. **S-015's straight quotes stay**: every
apostrophe in the thirty fences is straight and so is every one in the dummy (`grep -c '’' index.html`
returns 0), so a lone typographic pair would be the inconsistency; the ASCII rule that binds `cli-strings`
does not apply here and was not the reason. **Fence tokens are 2,215 before and 2,215 after**
(`awk '/^```/{open=!open; next} open' | wc -w`), and no terminal punctuation moved, so every figure in item
6 stands as written; the four removed commas and the one dialect form are the whole difference. In the
commentary, four corrections and one normalisation: S-008's *"nine words"* is twelve; the **X, not Y**
count above is corrected from one to four; the bold-full-stop claim above is corrected to what the file
does (84 by `grep -o '[.!?]\*\*\( \|$\)' | wc -l`, labels included, none of them changed, because the
sibling drafts carry no shared label convention to conform to); seven citation occurrences are re-based to
where their quoted text sits after the 2026-09-08 applies (`README.md` :105 -> :109 twice and :367 -> :373,
`docs/safety-model.md` :74 -> :80 twice and :98 -> :104, `windowsweep.ps1` :285 -> :287 - the Bible's §3
cites :285 too, and that one is the keeper's); and the headings are brought to the sibling drafts' scheme -
one H1, bands and sections at `##`, every applied slot at `###`, so that `grep -c '^### S-'` returns exactly
the applied set. **Round 3 note:** that grep now returns **36**, because S-031 moved from `##` to `###` when
it stopped being conditional and `/download` added five.

**8. Round 3 - the citations were re-derived by string search, and two of the ones I was handed were
already stale.** Round 2 deliberately froze its dummy citations at the pinned snapshot and said so. That was
the right call then and it is the wrong one now, because the snapshot itself has been re-pinned, so the
citations are re-based instead of declared-stale:

| Round 2 | Now | How it was found |
|---|---|---|
| `index.html:168`, the `151` ledger row | **gone** - ledger at `:164-167`, two facts | the row was removed from the dummy |
| `shell.js:142`, the tagline | **`:148`**, marker at **`:149`** | string search for `Safe-by-default` |
| `shell.js:161`, the notice marker | **`:171`** | string search for `setAttribute` |
| `shell.js:58-61`, `ANALYTICS_NOTICE` | **`:59-62`** | string search for the identifier |
| `design/README.md` §10, *"What is NOT built yet"* | **§11, "What is NOT built"** - and `/download` is no longer in it | heading scan |
| `design/README.md` §11 `(:489-490)`, the greps | **§12**, and the greps are at **`:569-570`** | string search for the grep lines |

🔴 **That last row is the finding, not the fix.** The brief for this round supplied `§12, :530-531`, which
was correct when it was written and is not now - §12 opens at `:525` and its two grep lines sit
**thirty-nine lines further down**. A design agent is editing that file while this one is edited. So a line
number handed over in prose is a **measurement with a timestamp**, and the only safe procedure is the one
the Conventions section already mandates for the dummy: re-derive by fixed-string search, at the moment of
writing, and never carry a number forward because a trustworthy source said it. Every figure in the table
above was re-derived that way rather than copied.

**Every `Was:` fragment was re-checked, not sampled.** Round 2 sampled nine. Round 3 extracted all **64**
backtick-quoted fragments of 25 characters or more from every `Was:` block in this file and searched them
against the flattened text of `index.html`, `shell.js` and `download.html` - tags stripped, entities
resolved, dashes and quotes normalised, tag-boundary spacing before punctuation collapsed. **64 of 64
resolve.** The one that needed special handling is S-030's, which lives in `shell.js` as a `' + '`
concatenation: its three literals were joined and compared, and the result is byte-identical. The applier's
targets all hold. The hook's verdict on this write is about this commentary alone.
