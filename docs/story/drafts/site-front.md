# site-front — the documentation front door and `llms.txt`

<!-- story-lint: allow "elevate" -->

Content-map row **9** · surfaces `windowsweep-docs/docs/intro.md` and `windowsweep-docs/static/llms.txt` ·
awareness **arriving cold from search** · structure **answer-first: what it is, what it refuses, one
command** · tone bands **P, R** · length **short** · CTA `npx windowsweep --scan` · schema **WebSite +
SoftwareApplication**.

Two artefacts, one voice, two readers. The page is for a person who typed a question into a search box and
has not decided whether to trust a program that deletes files. The text file is for a machine that will
repeat whatever it finds, to someone who never visits either.

🔴 **Three things are true of this surface today and shape every slot below.**

**The documentation domain has never resolved.** `curl https://windowsweep-docs.aoneahsan.com/` returns
**000**, and `https://aoneahsan.github.io/windowsweep-docs/` returns **301** to that same dead host, because
`static/CNAME` pins it. So the whole site — this page and this text file included — is unreachable from
outside right now. Nothing written here may assume otherwise, and nothing here fixes it: the DNS rows are
owner-only work already tracked at `docs/MANUAL-TASKS.md` rows 11-12 and RW-040.

**The front door is mirrored.** `windowsweep-docs/docs/intro.md` and the repository's own
`docs/README.md` are the same index page in two trees, and `CLAUDE.md` fixes the direction: the repository
copy is corrected first, then re-mirrored. Every intro slot below therefore lands **twice**, and the slot
says so where the two files currently differ.

**Row 9 owns two of the eight questions, and routes the other six.** The question map's Surface column
assigns question 1 to surfaces 9 and 1, and question 7 to surfaces 9 and 4. The other six belong elsewhere.
Reference, safety, start and help pages own them. So this page answers 1 and 7 in its own words and names all eight
with the page that answers each in full, which is how a short front door covers the map without becoming the
FAQ page that row 6 already owns. `llms.txt` covers all eight, because a machine does not follow a link
before it answers.

| Artefact | Slot range | Count |
|---|---|---|
| §A `intro.md` (mirrored into `docs/README.md`) | S-001 – S-024 | 24 |
| §B `static/llms.txt` | S-025 – S-046 | 22 |
| **Total** | | **46** |

---

## §A `intro.md` — the page a person reaches cold

### S-001 · intro.md:3 · front matter · `id` and `slug`
```
id: intro
slug: /
```
**Was:** the same pair.

**Change:** none. This page is the site root, which is what makes it the surface a search result lands on.

### S-002 · intro.md:4 · front matter · `title`
```
title: 'windowsweep - a Windows cleanup CLI that names every path first'
```
**Was:** title: 'windowsweep documentation'

**Change:** rewritten. A title of "windowsweep documentation" tells a person scanning ten search results
nothing they did not already know from the URL, and it is the single string a search engine is most likely to
render verbatim. The replacement carries the product name, the category and the differentiator in ten words.
It is also the only place on the page where "cleanup CLI" and "names every path" sit together.

### S-003 · intro.md:5 · front matter · `description`
```
description: 'windowsweep reclaims disk space on Windows by deleting only regenerable caches. It names every path before touching one and refuses your documents, credentials and browser state outright. Start with npx windowsweep --scan, which deletes nothing.'
```
**Was:** description: 'Safe, developer-aware Windows cleanup CLI: what it deletes, how to preview it, and how
to run it.'

**Change:** rewritten as an answer rather than a contents list. Three changes in one: the adjective "safe"
goes, per the Bible's band R; "preview" goes, because the glossary reserves that word and the flag is called
`--dry-run`; and the sentence that replaces them is the page's answer-first paragraph in miniature, so a
snippet lifted from the meta description and a snippet lifted from the first paragraph say the same thing.
That agreement is the entity-consistency lever, and it costs nothing.

### S-004 · intro.md:6 · front matter · `tags`
```
tags: [windows, cleanup, cli, disk-space, overview]
```
**Was:** tags: [windows, cleanup, cli, overview]

**Change:** `disk-space` added, which is one of the twelve npm keywords and appears in three of the eight
mapped questions. No other tag is added: a tag list that grows past five stops being a tag list.

### S-005 · intro.md:7 · the H1
```
# windowsweep
```
**Was:** # windowsweep - Documentation

**Change:** the suffix goes. The reader is on a documentation site and the breadcrumb above the heading
already says so, and the product name is lower case even as the first thing on the page. One word.

### S-006 · intro.md:9-11 · the answer-first paragraph
```
windowsweep reclaims disk space on a Windows machine by deleting only caches that rebuild themselves: package managers, build tools, browsers, editors, desktop apps, Windows temp and update leftovers, stale project artefacts. It names every path before it touches one. Your documents, credentials and browser state are refused outright, and no flag changes that.
```
**Was:** > **windowsweep** reclaims disk space on a Windows machine without putting your data at risk:
package-manager and build caches, browser and app caches, Windows temp and update leftovers, stale project
artefacts and more, behind one deletion chokepoint, a real dry-run and a developer mode that keeps recent
work fast.

**Change:** rewritten, and this is the most consequential slot on the page. Four faults in the old lede.
"Without putting your data at risk" is a risk claim in adjective form, which band R rules out and which the
audience has heard before. "And more" is the opposite of answer-first: a machine quoting the first sentence
would quote a list that trails off. The three mechanisms at the end arrive before the reader has been told
what the tool refuses, which inverts the Bible's order for this product. And the blockquote formatting makes
the page's answer look like an aside. The replacement is 53 words across three sentences, which is inside the
40-60 answer-first window, and it runs 31 words then 8 then 14, ending on a five-word refusal.

### S-007 · intro.md:13 · the one command
```
Start with `npx windowsweep --scan`. It measures every target and deletes nothing.
```
**Was:** (new — the page currently offers no command above the fold.)

**Change:** added. Row 9's CTA is `npx windowsweep --scan` and the page did not contain it, which meant the
front door of a documentation site for a command-line tool had no command on it. Five words, then seven.
The second sentence is the reason a sceptical reader will run the first one.

### S-008 · intro.md:15 · the pitch pointer
```
The [README](https://github.com/aoneahsan/windowsweep#readme) is the short version; this site is the manual.
```
**Was:** The [README](https://github.com/aoneahsan/windowsweep#readme) is the elevator pitch; this folder is
the manual.

**Change:** two words. "Elevator pitch" is borrowed language and the register is wrong for a page about
deleting files; "the short version" says the same thing plainly. "This folder" becomes "this site", because
on the published page there is no folder — that phrasing survives from the repository copy this file mirrors,
and it is the one sentence where the two files should legitimately differ. The repository copy keeps "this
folder".

### S-009 · intro.md:17 · the question block heading
```
## What people ask before they run it
```
**Was:** (new.)

**Change:** added. The heading is written the way the section is read rather than as a noun ("Questions"),
and it introduces the routing table at S-010 to S-017.

### S-010 · intro.md:19-20 · question 1, answered here
```
**How do I free up disk space on Windows without deleting anything important?**
windowsweep removes only regenerable caches, and refuses your documents, credentials and browser state outright. Start with `npx windowsweep --scan`, which deletes nothing and measures what is reclaimable. Then read the [safety model](./safety-model.md).
```
**Was:** (new.)

**Change:** added. Question map row 1, whose answer-first sentence is reproduced near enough verbatim, plus
the internal-link floor's mandatory link to the safety model. This is one of the two questions row 9 owns, so
it is answered on the page rather than routed.

### S-011 · intro.md:22-23 · question 7, answered here
```
**Does this cleanup tool send my data anywhere?**
No. The command-line tool makes no network calls at all, and self-test check [9] greps its own source for HTTP and socket calls and fails the run if it finds any. The desktop application is a separate program: it can send analytics, and it sends nothing until you accept.
```
**Was:** (new.)

**Change:** added. Question map row 7, with the mechanism named. The third sentence is not optional
padding — the map marks this row "re-check on every desktop release", and a bare "no" on the front door of a
product that also ships a desktop app is the exact claim that goes stale first. Saying which program the
claim is about is what keeps it true.

### S-012 · intro.md:25-31 · questions 2 to 6 and 8, routed
```
| The question | Where it is answered |
|---|---|
| How do I delete `node_modules` from old projects? | [Sections 0-25](./sections.md), section 17 |
| How do I clear the yarn or npm cache safely? | [Sections 0-25](./sections.md), sections 1 and 3 |
| Is it safe to use a Windows cleaner - will it delete my files? | [Safety model](./safety-model.md) |
| How do I see what it will delete before it deletes it? | [Quick start](./quick-start.md) |
| Windows Update / SoftwareDistribution is taking up space | [Admin sections and elevation](./admin-and-elevation.md) |
| How do I run a cleanup on a schedule? | [CLI reference](./cli-reference.md), `--install-task` |
```
**Was:** (new.)

**Change:** added. Six rows, one per remaining mapped question, each pointing at the surface the content map
assigns it. No seventh row and no invented question. The map has eight entries; two are answered above; six are here. The table also discharges the internal-link floor's second requirement, a link to a reference
page, four times over.

### S-013 · intro.md:33 · Start here · heading
```
## Start here
```
**Was:** ## Start here

**Change:** none.

### S-014 · intro.md:35-40 · Start here · the four rows
```
| If you want to... | Read |
| Install it in under a minute | Installation |
| Run your first cleanup | Quick start |
| Read every guarantee before deleting anything | Safety model |
| Know what the developer question changes | Developer mode |
```
**Was:** row 2 read "Run your first cleanup safely"; row 3 read "Understand every guarantee before deleting
anything".

**Change:** two cells. "Safely" is the adverb form of the adjective band R rules out, and it is doing no work
that the safety-model row below it does not do better. "Understand" becomes "Read", which is what the reader
does and is two syllables shorter. Rows 1 and 4 are unchanged.

### S-015 · intro.md:42 · Reference · heading
```
## Reference
```
**Was:** ## Reference

**Change:** none.

### S-016 · intro.md:44-52 · Reference · the six "What it covers" cells
```
| Sections 0-25 | Every section: what it touches, which flags tune it, how it behaves in dry-run and batch mode |
| CLI reference | Every mode, option, exit code, environment variable and config key |
| Profiles | The named bundles: `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit` |
| Admin sections and elevation | What needs Administrator rights, how `--elevate` works, the hibernation decision |
| Reports and logs | What a run writes under `%USERPROFILE%\.windowsweep`, the JSON schema, exports |
| AI integration guide | The contract for an agent or a script: `--json`, exit codes, guarantees |
```
**Was:** the same six, with the reports row reading "under `~\.windowsweep`".

**Change:** one cell. `~\.windowsweep` is a shell shorthand that does not expand in `cmd` or in File
Explorer, and every other path on the site is written in the Windows form. The six profile names match
`WS_PROFILES` in `lib/constants.ps1` exactly.

### S-017 · intro.md:54-60 · When something is off · the two cells
```
| Troubleshooting | Symptom, cause, fix |
| FAQ | The questions people ask first |
```
**Was:** the same pair.

**Change:** none. Three words for the first one, because that is the shape of the page it points at.

### S-018 · intro.md:62-70 · Meta · the five cells
```
| Author | Who built this, the sibling tools, how to support the work |
| Packages | The dependency and manifest record (there are no dependencies) |
| What the project consists of | Every part of the project with its evidence, as audited on 2026-09-05 |
| Remaining work | The specification of every open item: evidence, success criteria, acceptance points |
| Remaining work, one page | Percentages, the next ten actions, the owner-only rows |
```
**Was:** the same five.

**Change:** none. The parenthesis in the Packages row is the driest line on the page and it is band W's whole
budget here, which is right for a front door about deletion. Verified: `package.json` has no `dependencies`
key.

### S-019 · intro.md:72-78 · Quick contact · the three rows
```
| Issues | https://github.com/aoneahsan/windowsweep/issues |
| Author | Ahsan Mahmood - aoneahsan@gmail.com |
| Support the work | https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep |
```
**Was:** the same three.

**Change:** none. The support URL is the only permitted one.

### S-020 · intro.md:80 · the footer line
```
Last Updated: 2026-09-05 - tool version 1.1.0
```
**Was:** identical.

**Change:** none. A visible date that is true is the freshness signal, and the version beside it is what a
machine quotes.

### S-021 · docusaurus.config.ts:28 · the site tagline

**Out of scope here, decided in `tagline.md`.** The docs site currently carries a **different** sentence from
the other four places that hold the tagline, and adopting any candidate in `tagline.md` also ends that
divergence. No slot is issued here so the string keeps one home.

### S-022 · docusaurus.config.ts:69-71 · WebSite schema · `description`
```
Documentation for windowsweep, a Windows command-line utility that reclaims disk space by deleting only regenerable caches - package managers, build tools, browsers, editors, Windows temp and update leftovers - behind one deletion chokepoint that refuses personal folders, credentials and browser state. Author: Ahsan Mahmood.
```
**Was:** Documentation for windowsweep, a Windows PowerShell command-line utility that reclaims disk space by
deleting regenerable package-manager, browser, editor and build caches behind one deletion chokepoint, an
idle gate and a real dry-run. Author: Ahsan Mahmood.

**Change:** the word **only** is inserted before "regenerable", and the refusal replaces the second and third
mechanisms. "Deleting regenerable caches" and "deleting only regenerable caches" are different claims, and
the second one is both true and the one the product is about. Schema text is prose a machine reads, so the
answer-first rule applies to it exactly as it does to S-006. The two now agree.

### S-023 · docusaurus.config.ts:125-126 · SoftwareApplication schema · `description`
```
Command-line disk and cache cleanup for Windows developers: a guided walkthrough, a read-only scan, a dry-run that writes nothing, schema-versioned JSON reports, and one deletion chokepoint that refuses personal folders no matter what is typed.
```
**Was:** Command-line disk and cache cleanup for Windows developers, with a guided walkthrough, read-only
scan mode, JSON session reports, and a safety model built on one deletion chokepoint, protected paths and an
idle gate.

**Change:** "a safety model built on" goes, because a safety model is a document rather than a capability,
and the clause that replaces it states what the chokepoint does. The dry-run is added, since it is the
feature the audience asks about most and the schema omitted it.

### S-024 · docusaurus.config.ts:118 · SoftwareApplication schema · `offers`

**NEEDS DECISION:** the `SoftwareApplication` block declares
`offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }`. The decision recorded on 2026-09-05
forbids a pricing claim on any surface, and the standing fleet rule naming JSON-LD explicitly says the same.
A `price: '0'` offer is a machine-readable price statement on the one surface answer engines parse
structurally, so it needs an answer before this schema is touched: (a) remove the `offers` block, leaving
`SoftwareApplication` with no price of any kind, which is the option that matches the recorded decision most
literally; (b) keep it, on the grounds that a schema offer describes the npm package's current terms rather
than a product tier, and record that reading in the decision log so it is not re-litigated; (c) replace it
with `isAccessibleForFree` — which is the same claim in a different field and is **not** recommended.
Option (a) is recommended. This is not a re-opening of the pricing decision; it is the one artefact that
decision did not name, and it is inside row 9's declared schema.

---

## §B `static/llms.txt` — the same product, addressed to a machine

Every line in the Facts block is a claim a model will repeat as its own. So each one below carries the place
it was checked, and the block grew from eight lines to sixteen because six of the eight mapped questions were
answerable only by following a link, which a machine does not do before it answers.

### S-025 · llms.txt:1 · the title
```
# windowsweep
```
**Was:** # windowsweep

**Change:** none.

### S-026 · llms.txt:3-8 · the summary blockquote
```
> A Windows cleanup CLI for developers. It reclaims disk space by deleting only caches that rebuild
> themselves - package managers, build tools, browsers, editors, desktop apps, Windows temp and update
> leftovers, stale project build artefacts - and it refuses personal folders, credentials and browser state
> outright, with no flag that overrides the refusal. Every deletion passes through one function with the
> folder it may touch declared up front. An idle gate keeps anything used in the last 100 days. A dry-run
> performs the whole run and writes nothing. Personal files a person selects go to the Recycle Bin; caches
> have no undo, because they regenerate. The command-line tool makes no network calls of its own.
```
**Was:** > A safe, developer-aware Windows cleanup CLI. It reclaims disk space by deleting regenerable
caches - package managers, build tools, browsers, editors, desktop apps, Windows temp and update leftovers,
stale project build artefacts - behind one deletion chokepoint, an idle gate that keeps anything used in the
last 100 days, and a dry-run that writes nothing. Personal files go to the Recycle Bin and are never selected
without a person choosing them. The tool makes no network calls of its own.

**Change:** four edits, each one closing a way this paragraph could be repeated wrongly. "Safe" goes and the
refusal takes its place, so a model quoting the opening quotes a checkable claim rather than an adjective.
"Regenerable" becomes "only... that rebuild themselves", which is the claim that matters and which the old
wording left open. The three mechanisms are unpacked from one subordinate clause into three sentences,
because a machine summarising a clause list drops two of three. And "caches have no undo, because they
regenerate" is stated beside the Recycle Bin sentence rather than left out, since the difference between
those two outcomes is the fact a reader is most harmed by not knowing. "The tool" becomes "the command-line
tool", for the reason at S-011.

### S-027 · llms.txt:10-11 · the identity paragraph
```
windowsweep is a Windows PowerShell 5.1 engine with a zero-dependency Node launcher, published on npm as `windowsweep` and licensed MIT. The current version is 1.1.0 and its self-test runs 151 checks. Run `npx windowsweep --scan` first: it measures every target and deletes nothing.
```
**Was:** windowsweep is a Windows PowerShell 5.1 engine with a zero-dependency Node launcher, published on
npm as `windowsweep` and licensed MIT. The current version is 1.1.0 and its self-test runs 151 checks. Run it
with `npx windowsweep --scan` (read-only) before anything else.

**Change:** the last sentence only. "(Read-only)" in brackets is a label; "it measures every target and
deletes nothing" is the same fact as a sentence a model can quote. Both numbers verified this session: `npm
view` and `VERSION` agree on 1.1.0, and the self-test printed `all 151 checks passed`.

### S-028 · llms.txt:13-28 · the Documentation list
```
## Documentation
```
**Was:** the same heading and fourteen entries, each an absolute URL under `https://windowsweep-docs.aoneahsan.com/`.

**Change:** none to the list. The absolute URLs are the canonical ones the site declares in its own
`canonical` head tag, and a machine that has read this file has by definition resolved the host. **Reported,
not fixed:** that host currently resolves to nothing, so this file is unreachable today and the URLs in it
cannot be followed. The `## Source` block below is what a reader who found this file in the repository can
actually use, which is a reason to keep it.

### S-029 · llms.txt:15 · Documentation · the intro descriptor
```
what the tool is, what it refuses, and the one command to start with
```
**Was:** what the tool is and how to approach it

**Change:** rewritten to match the page it points at, which now leads on the refusal and carries a command.
"How to approach it" describes a mood rather than a page.

### S-030 · llms.txt:16-27 · Documentation · the other thirteen descriptors
```
(unchanged: the chokepoint, protected paths, tiers, the idle gate, dry-run / what the first question changes / npx, global install, or a clone / four commands from self-test to a real cleanup / exactly what each of the 26 sections touches / every mode, flag, exit code and environment variable / dev, minimal, cache-only, system, deep, audit / sections 12-16 and 20 / the JSON schema and the exports / the contract an agent or a script runs under: the read-only sequence, then the shapes and the exit codes)
```
**Was:** the same thirteen.

**Change:** none. Each descriptor names what the page contains rather than what it is called, which is what
makes the list navigable for a machine. Each is accurate against the page it labels.

### S-031 · llms.txt:30-35 · the Source block
```
## Source
- npm package: https://www.npmjs.com/package/windowsweep
- Repository: https://github.com/aoneahsan/windowsweep
- Issues: https://github.com/aoneahsan/windowsweep/issues
- Author: Ahsan Mahmood, https://aoneahsan.com
```
**Was:** identical.

**Change:** none. Four URLs, all of which resolve today, which is more than can be said for the fourteen in
the documentation block above them, and which is the reason this block earns its place in a file whose
canonical host answers nothing.

### S-032 · llms.txt:37 · the Facts heading
```
## Facts an answer should get right
```
**Was:** ## Facts an answer should get right

**Change:** none. It is the best-named block in the file: it says what the list is for rather than what it
contains.

### S-033 · llms.txt · Fact 1 · platform
```
- Windows only. `"os": ["win32"]` makes npm refuse to install it elsewhere, and the Node launcher exits 2 on any other platform.
```
**Was:** - Windows only. npm refuses to install it elsewhere; the launcher exits 2 on any other platform.

**Change:** the mechanism is named rather than described. Checked: `package.json` `"os": ["win32"]`, and
`bin/windowsweep.js:26-31` tests `process.platform !== 'win32'` and calls `process.exit(2)`.

### S-034 · llms.txt · Fact 2 · what deletion means
```
- It deletes. Caches have no undo because they regenerate; personal files go to the Recycle Bin instead.
```
**Was:** identical.

**Change:** none. Two words, then the distinction. The Bible's safety constraint in one line.

### S-035 · llms.txt · Fact 3 · the chokepoint
```
- Every deletion passes through `Remove-PathSafe` or `Send-ToRecycleBin` with a declared root folder. It refuses drive roots, UNC paths, relative segments, 66 protected subtrees, 50 wildcard patterns and 13 protected file names, and no flag bypasses those checks.
```
**Was:** (new.)

**Change:** added. The product's central claim was absent from the file whose job is to be repeated
correctly. Checked in `lib/safety.ps1`: the header comment lists steps 1 to 5 and states "No flag bypasses
steps 1-3"; `Initialize-Safety` builds 66 subtree entries, 50 wildcard patterns and 13 basenames. Self-test
check [6] then walks all 105 declared targets and fails if any resolves inside one.

### S-036 · llms.txt · Fact 4 · scan and dry-run
```
- `--scan` and `--list-targets` are read-only. `--dry-run` performs a whole run and writes nothing: the deletion helpers short-circuit, destructive external commands are skipped, and self-test check [7c] hashes a fixture tree before and after to prove it.
```
**Was:** (new.)

**Change:** added. This answers mapped question 5, which no line in the file previously covered. It also
carries the rehearsal motif in the form a machine can repeat.

### S-037 · llms.txt · Fact 5 · the idle gate
```
- The idle gate keeps anything used in the last 100 days (`--days`), or 3 days for temp folders (`--temp-days`). Windows keeps last-access times off on most volumes, so the tool reads the newest of write, access and creation time - a file can look fresher than it is, never older.
```
**Was:** (new.)

**Change:** added. Answers mapped question 3 and states the direction of the error, which is the part a
summariser would otherwise invent. Defaults checked in `lib/config.ps1:8-9`: `days = 100`, `tempDays = 3`.

### S-038 · llms.txt · Fact 6 · junctions
```
- It never follows a junction or a symlink: a reparse point is removed as a link, and the tree it pointed at is left alone. It also handles paths beyond 260 characters - the self-test fixture removes one 445 characters long.
```
**Was:** (new.)

**Change:** added. Both halves are fixture-backed: check [7] prints `junction removed as a link; target
sentinel survives`, `nested junction not followed`, and `long path (445 chars) removed`.

### S-039 · llms.txt · Fact 7 · `--yes`
```
- `--yes` covers regenerable caches only. It never selects an item in sections 17, 18, 19 or 23, and self-test check [12] asserts that every selection prompt in `modules/` refuses to auto-answer.
```
**Was:** - `--yes` covers regenerable caches only. It never selects an item in sections 17, 18, 19 or 23.

**Change:** the enforcement is named. Check [12] prints `every Read-MultiSelect call in modules/ carries
-NoAutoYes`, which is the thing that makes the first sentence hold as the tree changes.

### S-040 · llms.txt · Fact 8 · scripted selection
```
- `--select L` and `--select-file P` are the only way those interactive sections run unattended: a person supplies the selection in advance, by index or by full path.
```
**Was:** identical.

**Change:** none. Answers mapped question 2's second half, and self-test check [16] holds it.

### S-041 · llms.txt · Fact 9 · the audits and section 23
```
- Sections 22, 24 and 25 are read-only reports and make up most of the `audit` profile. They never uninstall a program and never change a startup entry. Section 23 is not one of them: it sends orphaned application data to the Recycle Bin, and only what a person picks.
```
**Was:** - Sections 22, 24 and 25 are read-only reports (the `audit` profile). They never uninstall a
program and never change a startup entry. Section 23 sends orphaned application data to the Recycle Bin, and
only what you pick.

**Change:** two edits. "(The `audit` profile)" implied the profile is those three sections; it is
`@(0, 21, 22, 24, 25)` in `WS_PROFILES`, so five sections, and "make up most of" is the honest form. And
"Section 23 is not one of them" states the negative explicitly, because the README's Features list currently
calls section 23 an audit (corrected at `readme.md` S-023) and a model that reads both surfaces has to be
told which one is wrong.

### S-042 · llms.txt · Fact 10 · deep sections
```
- Deep sections need `--i-understand-deep` as well as `--yes`: 11 (empty the Recycle Bin), 15 (hibernation file), 16 (clear the event logs), 20 (disk-image compaction). Sections 11 and 16 are permanent and have no undo of any kind.
```
**Was:** - Deep sections (11 Recycle Bin, 15 hibernation, 16 event logs, 20 disk-image compaction) also need
`--i-understand-deep`.

**Change:** the permanence is stated. Four sections share the gate and two of them are irreversible, which
is a distinction the old line left a summariser to guess at. Checked: `Batch = 'deep'` on 11, 15, 16, 20;
`Tier = 'permanent'` on 11 and 16.

### S-043 · llms.txt · Fact 11 · elevation
```
- Sections 12 to 16 and 20 need an elevated console. Without one they skip and print the exact command to use; `--elevate` relaunches through a Windows permission prompt, which windowsweep cannot answer for you.
```
**Was:** - Sections 12 to 16 and 20 need an elevated console; `--elevate` relaunches through a UAC prompt.

**Change:** the skip behaviour is added, and "UAC prompt" is expanded, matching the desktop app's approved
wording at `desktop-safety.md` S-004 and S-046. The closing clause is the one thing a machine most needs to
know before it tells someone this can be automated.

### S-044 · llms.txt · Fact 12 · the safe batch and profiles
```
- `--all` runs the safe batch: sections 0, 1, 2, 3, 5, 6, 7, 8, 9, 10 and 21, plus 12 and 13 when the console is already elevated. The named profiles are `dev`, `minimal`, `cache-only`, `system`, `deep` and `audit`.
```
**Was:** (new.)

**Change:** added. Verbatim from `WS_SAFE_BATCH`, `WS_SAFE_BATCH_ADMIN` and the six keys of `WS_PROFILES`.
A model asked what `--all` does previously had to follow a link to answer, which is the one thing this file
exists to prevent, so the eleven section numbers and the two conditional ones are written out in full.

### S-045 · llms.txt · Fact 13 · scheduling
```
- `--install-task` registers a weekly Scheduled Task (Sundays, 03:00) that runs the safe batch with no prompts. It never runs an interactive section, and it refuses to install when started through npx, because the task would point at a cache npm evicts - it exits 3 and prints the global-install command instead.
```
**Was:** (new.)

**Change:** added. Answers mapped question 8. Checked in `modules/release_helpers.ps1`: the box title reads
`Sundays 03:00, safe batch, no prompts`, and `Test-NpxInstallerRefusal` sets `WS_EXIT_REFUSED`, which is 3.

### S-046 · llms.txt · Facts 14 to 16 · numbers, network, and the desktop app
```
- Section numbers are a frozen public contract: 0 to 21 shipped in 1.0.0, 22 to 25 in 1.1.0, and a number is never reused for something else. Exit codes are 0 success, 1 a failure, 2 a usage error, 3 a refusal, 130 an interrupt.
- No amount of reclaimed space is promised anywhere, because it depends on the disk. `--scan` measures it.
- The command-line tool makes no network calls of its own, sends no telemetry and checks for no updates; self-test check [9] greps the source and fails the run if it finds an HTTP or socket call. `--report-issue`, `--feedback` and the reports manager can open a URL in the reader's own browser, after the reader asks. The desktop application is a separate program with its own consent screen; it has not been released yet.
```
**Was:** the last of these read: - The tool makes no network calls of its own, sends no telemetry and checks
for no updates.

**Change:** the frozen-numbering fact, the exit codes and the no-promised-number fact are added, and the
network fact is expanded three ways. The `Start-Process <url>` paths are named, because a model that greps
the source and finds one would otherwise conclude the file lied. The desktop app is named for the reason at
S-011, and its release state is stated: `gh release list` shows `v1.0.0`, `v1.0.1` and `v1.1.0`, all of them
the command-line tool, and no desktop tag.

---

## Found while writing, reported rather than fixed

**The site is unreachable.** Both artefacts on this surface are served from a host that resolves to nothing.
Nobody can read either. That is the largest single fact about row 9 today and it belongs in the report rather
than in the copy.

**`docs/README.md` and `intro.md` have already drifted.** The repository copy links the AI guide at
`../AI-INTEGRATION-GUIDE.md`; the site copy links `./ai-integration-guide.md`, which is a different file that
the site keeps in `docs/`. Both are correct. It is worth writing down, because a naive re-mirror would break
one of them.

**`og:locale` is `en_US` on an en-GB product.** `docusaurus.config.ts` sets `{ property: 'og:locale',
content: 'en_US' }` while the Bible fixes the language as en-GB and every page is spelled that way. One line,
outside this draft's scope.

**The site declares four JSON-LD blocks, not two.** Row 9 names WebSite and SoftwareApplication;
`docusaurus.config.ts` also emits `SoftwareSourceCode` and `Organization`. Both are accurate and neither is a
problem — recorded so a later reviewer does not read the extra two as unplanned.

---

## Self-check

**Palette.** Band **P** carries the answer-first paragraph at S-006, the command at S-007, and every fact in
§B that names a check number, a default or a file. Band **R** carries the refusals: S-006 ends on one, S-010
leads with one, S-026 replaces an adjective with one, and S-035 is a refusal listed four ways. Band **W**
appears **twice** across both artefacts: the Packages row's parenthesis at S-018, and "which is more than can
be said for the block above them" at S-031. Neither sits near a destructive instruction. Row 9 allows P and
R and does not ask for W, so two is the ceiling rather than a target.

**Rhythm.** Shortest shipping sentence: "It deletes." at two words, S-034. Then "No." at S-011, one word
answering the question above it. Longest: the third sentence of S-046's network fact at forty-two words,
which lists three commands and a separate program and cannot be shortened without losing one of them. The
answer-first paragraph at S-006 runs 31, 8 and 14 words. It ends short.

**Length.** Row 9 says short, and the honest report is that both artefacts grew. Measured. `intro.md`'s prose
above the first table goes from **67 words to 83** (S-006, S-007 and S-008); the new question block at S-009
to S-012 adds **195**; the page goes from **383 words to about 592**, tables included. That increase is
deliberate: a front door with no command on it and no question answered on it was short in the wrong way, and
it is still a page a person reads in two minutes. `llms.txt` goes from **494 words to about 980**, and almost
all of that is the Facts block, which went from **163 words across 8 lines to 607 across 16**. The
Documentation and Source blocks are untouched. That was the trade. Sixteen facts at an average of 38 words
each is the price of
covering all eight mapped questions in the one artefact whose reader will not follow a link, and it is the
place on this surface where length buys the most.

**Unsure.** One `NEEDS DECISION`, at **S-024**, on the `offers: { price: '0' }` field in the
SoftwareApplication schema. It is raised because that field is inside row 9's declared schema and the
2026-09-05 pricing decision did not name it. The decision itself stands. One phrase is allowed on purpose:
"elevate" is on the shared list as an inflation verb and is, here, the name of the `--elevate` flag and the
Windows term for what it does.

Two shipping strings keep a word the glossary bans. Both are deliberate. S-010 and S-012 reproduce the
question map's own phrasing for questions 1 and 3, "free up disk space" and "cache safely", because a
question heading is written in the reader's words while its answer is written in the product's, which is the
split the map itself makes: its question column says "free up" and its answer column says "reclaimable".
Rewriting the questions into glossary vocabulary would make them phrases nobody types, which is the one thing
an indexed question heading may not be.
