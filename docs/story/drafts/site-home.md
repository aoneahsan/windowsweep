# site-home - the marketing site's home bands

Content-map row **16** · surface `windowsweep-web/design/windowsweep-web-click-dummy/` · awareness
**unaware to problem-aware, arriving cold** · structure **hero promise -> the gamble they already lost ->
the guarantees as refusals -> proof -> the two install paths** · tone band **P dominant, R strong, W once** ·
length **a landing page, 12-15 bands** · CTA **`npx windowsweep --scan` and the desktop download** · schema
**SoftwareApplication, no `offers`, no `isAccessibleForFree`**.

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

## Where the thirty slots live

| File | Slots | Marked `pending` today |
|---|---|---|
| `index.html` | S-001 - S-028 | 28 |
| `shell.js` (the shared footer, extracted mid-draft) | S-029 - S-030 | 1 |
| **Total** | **30** | **29** |

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

## Three facts this draft corrects

1. 🔴 **151 -> 154 self-test checks**, in S-001, S-019 and S-024. See the `NEEDS DECISION` at the end: the
   number is coupled to a release that has not shipped, and there is a **fourth** occurrence outside every
   pending block that this inventory cannot reach.
2. 🔴 **"The first two write nothing at all" is false** (S-005). A dry-run is not one of the quiet modes -
   `windowsweep.ps1:285` lists only `help`, `version` and `list` - so it initialises a log and
   `Initialize-Report` runs unconditionally. It writes **two files, both its own, and none of yours**. This
   is Bible §3 commitment 2 as corrected on 2026-09-07, reaching this surface for the first time.
3. 🔴 **`--i-understand-deep` reaches four sections, not two** (S-012). The placeholder implied the flag
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
  <span><b>154</b> self-test checks</span>
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
  One authorised run, on one Windows machine, on one day, with nothing refused. That is the whole
  claim. It is not an average and it is not a promise, because your disk decides the number and
  <span class="mono">--scan</span> is how you read it.
</p>
```

**Why.** Same three facts, reordered so the paragraph opens on what the number **is** and only then says
what it is not. The placeholder opened on two denials, which makes a reader look for the thing being
denied before they have been told what they are looking at. "That is the whole claim" is the four-word
sentence this band needs for rhythm, sitting between a 15-word and a 27-word neighbour. The Bible's §10
rule is never to promise a number, and here it is delivered as a refusal rather than as a disclaimer.
Band R doing an asterisk's job.

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
`design/README.md` §2 already carries. The long semicolon clause splits into two short sentences, which is
where the contrast actually lands: *"The tool counts what it deleted. Windows counts what is free."* The
closing sentence loses "Anyone printing". That was a claim about competitors, which this project cannot
verify and the map's §4 already refuses to make. What stands instead is a claim about arithmetic. It holds
alone.

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
<h2 class="h-band">Two answers, because there are two programs.</h2>
<p class="lede">They are different, so they are printed side by side at the same size.</p>
```

**Why.** "Next to each other" becomes "side by side". Shorter, and literal. The
heading is kept because it is the honest frame. The alternative - one headline claiming the product is
offline, with the analytics in a footnote - is the presentation this band was designed to refuse, and
`design/README.md` says so in the band's own source comment.

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
    HTTP and socket calls and fails the build if it finds one, and it is one of the 154.</span></li>
</ul>
<p class="t-sm ink-3">Crash bundles stay on disk. Session logs and reports stay on disk. The only
  time it opens a browser is when you ask it to report an issue.</p>
```

*(The three `<svg>` icons inside the `<li>` elements are unchanged; `…` marks where each one stays.)*

**Why.** The third fact gains the half that makes it a guarantee rather than a habit. A check that greps
is a description. A check that **fails the build** is an enforcement, and it is the reason the Bible's §3
commitment 3 still holds for the engine after the desktop window stopped qualifying. Naming it **check
[9]** matches how the safety model and the decision log refer to it, so a reader who goes looking finds
the same label. The count moves 151 to 154. See the decision below.

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
    <p><span class="mono">windowsweep --self-test</span> runs 154 checks on your machine, with a
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
command", because *skip with* reads as though the command is a condition of skipping. The self-test count
moves 151 -> 154 and its proof clause changes to "the tree did not change", matching S-006. The
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
(`Windows 10 (1809 and later)…`) is outside this block and is untouched.

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

# 🔴 NEEDS DECISION

Two. Both verbatim, and both about one number.

> **NEEDS DECISION: the self-test count is coupled to a release that has not shipped, and this page states
> a version.** This draft writes **154** at S-001, S-019 and S-024, per the brief's measured figure and the
> engine at `HEAD`. But 154 arrives with **1.2.0, which is unreleased**, and the page brands itself
> `1.1.0` in three places outside every pending block - the header chip, the `SoftwareApplication` JSON-LD
> `softwareVersion`, and the footer's `MIT licence · windowsweep 1.1.0`. Today it prints **151**.
> If the site goes live before 1.2.0 does, the front door states a number a
> reader disproves in one command, on the page whose entire design argument is that its numbers are
> checkable. Options: **(a)** hold the site's launch behind the 1.2.0 publish, so every number on the page
> and every number the tool prints agree; recommended, since 1.2.0 is already owed the `cli-strings`,
> `report-bodies` and tagline cascade and the site is not finished either. **(b)** Ship 151 now and treat
> the bump as part of the 1.2.0 cascade, adding the site to the list of places a version touches. **(c)**
> Cut the count from the page and let `--self-test` be the only place it appears - honest, but it removes
> one of the four hero facts and weakens S-019 from an enforcement to a description. I have not chosen.
> The draft carries 154, because that is the figure the brief supplied as measured. My recommendation is
> (a).

> **NEEDS DECISION: the brief says four read-only audits; the product's own documents say three, and its
> tier table says five.** `README.md:105` reads *"plus three read-only audits (global packages, idle
> programs, startup items)"* and goes on to say orphaned application data *"is a fourth 1.1.0 section and is
> **not** an audit"*, which is the likeliest origin of the four. `docs/safety-model.md:98` also says three
> (22, 24, 25 - read-only, safe, outside `--all`), while its tier table at line 74 puts **five** sections in
> the Report-only tier (0, 21, 22, 24, 25), because 0 and 21 report as well but do run in the safe batch.
> Three numbers, three questions. **No slot in this draft asserts an audit count**,
> so nothing ships on a guess and no correction is owed if the answer is one of the other two. What is
> needed is which question the page should answer if it ever does: audit-only sections outside `--all`
> (**3**), or sections that delete nothing (**5**). Recommendation: **neither, on this surface.** The tier
> table in band 6 already shows the reader all five report-only sections in the row they belong to, which
> is more useful than a count, and the sections grid in band 7 marks every one of them. A number here would
> just be a fourth place to disagree. Three is already too many.

# Reported, not fixed - three findings outside this draft's scope

1. 🔴 **A fourth `151` sits outside every pending block.** The receipt band's evidence ledger reads
   `<dt>Guards proved on this machine first</dt><dd>151</dd>` (`index.html:165` at the snapshot). It is not
   marked `pending`, so this inventory cannot slot it - but applying S-001, S-019 and S-024 without it
   leaves **one page saying 154 three times and 151 once**, which is worse than either number alone.
   Whatever the decision above resolves to, that `<dd>` moves with the other three.
2. 🔴 **The hand-back grep under-reports by one.** `design/README.md` §11 says 30 blocks and gives
   `grep -c 'data-ws-copy="pending"'`. The attribute is now `data-wsw-copy` and the count is 28, because
   the two footer blocks moved to `shell.js` and only one of them kept its marker. See S-029.
3. **The `<meta name="description">` and `og:description` are not marked `pending`** and are not slotted
   here, but they are product-voice prose on an indexed page and belong to a row - most likely **19**
   `site-front`, which the map assigns the site's per-route `<title>` and description text. Flagged so the
   boundary is decided rather than discovered.

---

# SELF-CHECK

**Method, stated because a figure without one cannot be reconciled.** Every number below is measured over
**the shipping strings only** - the text inside the 30 fenced blocks, with HTML tags, `<!-- -->` comments
and JavaScript scaffolding stripped and entities resolved. Block-level closes (`</p> </h2> </h3> </li>
</summary>`) end a sentence; inline `<span> <b> <em>` do not. Three non-prose runs are excluded: the two
`<p class="mono">` path inventories, the four `.hero-facts` chips and the `.rc-total` numeral. So is the
verification `bash` fence, and so are `S-006`'s three terminal transcripts, because row 10 owns them.
Commentary and `Was:` lines are **not** counted. Nor is this self-check. Sentence split is `(?<=[.!?])\s+`
with `1.1.0`, `2,483,662`, `5.84`, `9.85`, `3.92`, `SHA-256` and `Windows 10 1809` protected first.

🔴 **The figures below replaced a first-pass estimate, and the estimate was wrong in both directions.**
Before the method above was fixed, this section carried *1,148 words · 96 sentences · burstiness 0.60 · one
em dash*. Measured, it is **1,967 words · 187 sentences · burstiness 0.70 · zero em dashes**. Three
different tokenizers gave three different answers on the way there, which is why the rule is to write the
method next to the number. Corrected in place rather than restated as though it had always read this way.

🔴 **The project's lint hook is structurally blind to this file.** `posttooluse-story-lint.sh:61` runs
`re.sub(r"```.*?```", " ", body, flags=re.S)` before it counts anything, and **every shipping string here
is fenced**. So a green hook on this draft is evidence about my commentary and nothing about the copy that
ships. Proved with a plant, not inferred. The figures above are the real ones; the fact-checker and a human
reader are the only gate on this surface. The sibling trap is handled too: every
bolded sentence-end in my prose is written `**like this**.` with the period outside the emphasis, because
the hook's splitter does not break on a full stop followed by `**`.

**1. Palette - P dominant, R strong, W exactly once.**

| Band | Slots | Delivered |
|---|---|---|
| **P** precision before an irreversible act | S-001 (hero lede), S-002, S-003, S-004, S-005, S-006, S-009, S-010, S-012, S-013, S-014, S-015, S-016, S-018, S-020, S-024, S-025, S-026, S-027, S-028, S-029, S-030 | **~62%** of shipping words |
| **R** refusal as reassurance | S-001 (*"No flag lifts that"*), S-007, S-008, S-011, S-017, S-019, S-021, S-023 - the whole refusal band plus the override note, each one a **named refusal** rather than an adjective | **~35%** of shipping words |
| **W** workshop dryness | **S-022, one line:** *"Which is the only kind of promise worth writing down."* | **~3%** |

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
| Words · sentences | 1,967 · 187 | - |
| Mean length | 10.5 words | median 12-16 (under, and deliberately - see below) |
| Standard deviation | 7.4 | - |
| **Burstiness** (σ ÷ mean) | **0.70** | ≥ 0.45 ✅ |
| **Shortest** | **3 words** - *"Never less."* (S-015), *"It deletes nothing."* (S-001), *"The tools are not."* (S-008) | ≤ 6 ✅ |
| **Longest** | **33 words** - S-024: *"windowsweep --self-test runs 154 checks on your machine, with a real junction, a 445-character path and a dry-run fixture whose tree is hashed before and after to prove the tree did not change."* | ≤ 34 ✅ |
| Sentences ≤ 6 words · ≥ 25 words | 75 · 10 | both present ✅ |
| Sentences over the 34-word ceiling | **0** | 0 ✅ |
| **Em dashes** | **0** | ≤ 1 per 150 words ✅ - the placeholders carried **11**; all 11 became full stops, colons or commas |
| "not X, but Y" | **0** | ≤ 1 per 300 ✅ |
| Rule-of-three lists | 5 in 1,967 words | ≤ 2 per 500 ✅ |
| Consecutive same-word openers | max 2 | < 3 ✅ |
| Semicolons | 5 | allowed by the fingerprint, used to join related facts |
| Exclamation marks | **0** | 0 ✅ |
| Banned phrases | **1**, allowed with a marker - see below. Swept against `assets/banned-phrases.txt`, all 152 entries, case-insensitive on word boundaries | 0 or allowed ✅ |
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

**3. Length against the row's cap.** Row 16's cap is structural - *"a landing page, 12-15 bands"* - not a
word count. **15 bands**, unchanged; no band added, none removed, none merged. Words per band, shipping
copy only:

| Band | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | foot | **all** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Ships** | 152 | 128 | 152 | 310 | 164 | 50 | 41 | 183 | 42 | 181 | 10 | 52 | 387 | 84 | 20 | 50 | **2,006** |
| **Was** | 124 | 129 | 129 | 264 | 154 | 36 | 41 | 199 | 42 | 177 | 10 | 41 | 364 | 84 | 20 | 49 | **1,863** |

Counted per slot, so this total is **2,006** where the rhythm table above says 1,967. The 39-word gap is
the three non-prose runs the rhythm measurement excludes and this one does not: the two `<p class="mono">`
path inventories, the four `.hero-facts` chips and the `.rc-total` numeral. Two rules, both written down.

Net **+143 words, +7.7%** over the placeholders. Four places take almost all of it: band 4's three added R
sentences (+46), band 5's chokepoint and override rewrites (+10), band 13's `--list-targets` closer and the
admin answer (+23), and band 3 naming the two files a dry-run writes (+23). **One band shrank** - band 8,
199 to 183, where the unbudgeted W line came out. No band is out of scale with its neighbours, and at 2,006
words the page clears the ~1,000-word floor an indexed home page needs by a wide margin.

**4. The pricing sweep - CLEAN.** Row 16 and `design/README.md` §7 both forbid a pricing claim in either
direction, so the shipping strings were swept for `free`, `paid`, `price`, `pricing`, `tier`,
`subscription`, `offers`, `trial` and `$`, case-insensitive on word boundaries. **Three hits, none of them
a pricing claim**, each read in context rather than counted:

| Hit | Where | What it actually says |
|---|---|---|
| `free` ×2 | S-004 | *"Windows reported **free** space on C: rising"* and *"Windows counts what is **free**"* - disk space, the product's subject |
| `paid` ×1 | S-002 | *"not signed with a **paid** code-signing certificate"* - GATE-4-approved wording about a certificate that was not bought |

No sentence says the product is free, and none says there is no paid tier. **The word "free" never
modifies windowsweep.** The schema block is outside every pending block and already carries no `offers` and
no `isAccessibleForFree`; this draft adds neither and touches neither. One thing worth keeping in view: the
word *paid* survives here only because the certificate sentence is approved copy, and removing *paid* would
turn it into a claim about the file rather than about what was purchased.

**5. Unsure spots.** Two `NEEDS DECISION` above, both verbatim, both on the self-test count and the audit
count. Three findings reported outside scope. Three things I am less than certain of and did not guess:

- **`released 2026-09-07` at S-002 is carried from the placeholder**, not verified. The installer's name
  and its 2,483,662 bytes are sourced to the tracker; the release *date* I could not confirm from the
  repository, and I did not reach for the network to check. Low risk, and cheap to settle.
- **S-029's reuse of the approved tagline is a call I made, not a rule I found.** The argument is above.
  It is a one-line revert if the owner reads the footer as needing its own sentence.
- **The voice fingerprint is still `calibrated: false`.** Every rhythm figure here is measured against
  twelve specimens derived from the repository rather than from samples the owner chose. That is the
  Bible's own open item, not a new one - but it is what "reads as this voice" means on this surface, and
  it should be said rather than assumed.
