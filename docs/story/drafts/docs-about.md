# docs-about — the author page

Content-map row **7** · surface `docs/author.md` (published as `about.md` on the docs site) · awareness
**curious** · structure **who built it, the sibling tools, how to support it** · tone bands **W allowed, P
underneath** · length **short** · CTA **the payment link** · schema none.

The shortest surface in the set. A reader lands here after deciding the tool is worth using and wanting to
know who is behind it, so the page earns its keep by being concrete rather than warm. Row 7 is the only row
in the map that lets band W lead. This draft spends that budget once, at S-002.

Two facts govern what may be said here. The tool is one of three, so the family table is the page's real
content. And no surface makes a pricing claim, by the decision recorded on 2026-09-05, so the support section
says what supporting does and never what the product costs.

| File | Slot range | Count |
|---|---|---|
| §A `docs/author.md` | S-001 – S-010 | 10 |

**S-010 is new in this round** and is the only number added. It is a new paragraph in the file, sitting
between S-002 and S-003, so it is presented below in file order rather than at the end of the list. No
existing number was reused, renumbered or reordered; the `author.md:NN` references still point at the **live**
file as it stands before this draft is applied.

---

## §A `docs/author.md`

### S-001 · author.md:1 · the H1
```
# Author
```
**Was:** identical.

**Change:** none. The docs site publishes the same file as `about.md` with an `About the author` title in its
front matter, which is right for a navigation label and wrong for the page's own heading.

### S-002 · author.md:3-4 · the one-line biography
```
**Ahsan Mahmood** - independent software engineer. He writes small tools that do one thing, ships them under MIT, and then uses them on his own machine until they stop annoying him.
```
**Was:** **Ahsan Mahmood** - independent software engineer who builds small, sharp developer tools and ships
them as open source.

**Change:** rewritten, and this is the page's whole allocation of band W. "Small, sharp" is two adjectives
doing the work of a fact, and "ships them as open source" names a category rather than a licence. The
replacement keeps the register light while every clause stays checkable: three tools, MIT in the repository
root, and a build machine that is the author's own - `docs/sections.md` says so in its candidate table, where
paths are held back because the software is not installed on it. The last clause is the joke, and it is a dry
one about the author rather than about a reader or about deletion. Nothing on this page sits near an
irreversible action, so the palette allows it.

**Widened this round.** The sentence read *"small command-line tools"*. Two words gone, nothing else touched.
windowsweep is a command-line engine **and** a desktop window that drives it, which is Bible §1's own
definition of the product, so a biography admitting only the first describes part of what he ships and calls
it the whole. The three checkable clauses and the dry aside survive intact; the window is named at S-010
rather than crammed in here, so this line stays one line.

**DECIDED - owner, 2026-09-07: keep "independent software engineer".** The question this slot carried is
answered and struck. It was option (a) of the three offered - the wording the page already has, unchanged -
and the sentence needed no other edit to accommodate it. So this surface now carries **zero** unanswered
`NEEDS DECISION`, which is half of the GATE 4 pre-authorisation condition. Writing that answer into
`decision-log.md` is the keeper's job; this draft may not touch that file.

### S-010 · author.md:new paragraph, inserted after :4 · the desktop pointer
```
windowsweep also has a window: the [desktop app](./desktop.md) drives the same engine and reimplements none of it.
```
**Was:** nothing. This paragraph does not exist in the live file; it goes in between the biography and the
contact list, with a blank line either side, which pushes every line below it down by two.

**Change:** new. The page described a command-line product and nothing else, and that stopped being true when
`docs/desktop.md` went live - it is a real page on this site, `/desktop`, and Bible §1 defines the product as
the engine **plus** the docs site **plus** a desktop application driving the same engine. Three things about
the wording. The link is relative (`./desktop.md`), which is the style every other page in `docs/` uses and
which resolves in the repository **and** on the docs site. "Drives the same engine" is the trust lever the
whole page runs on - same person, same engine, one more door - and "reimplements none of it" is the clause
that makes it checkable: IRON rule 12 and `docs/desktop.md`'s own opening both say the app runs the bundled
`windowsweep.ps1` and reimplements no cleanup logic. And nothing here says the app can be downloaded,
because the install question belongs to `docs/desktop.md` and this draft has not verified a released
installer.

🔴 **Why it sits here and not in the family section.** S-006 says all three tools "make no network calls" -
an absolute the desktop window does not meet, since it checks for updates on every start and sends usage
data. A pointer in the table's Windows row, or in a paragraph either side of S-006, would be swept into that
sentence and would overclaim on the single property this page's reader is most likely to be checking.
Placing it above the family heading keeps "all three" bound to the three rows beneath it and to nothing else.
The clause "reimplements none of it" does the second half of that work: it says what "the same engine" means
- the deletion behaviour - so no reader can stretch the sameness to cover the network.

### S-003 · author.md:6-10 · the contact list
```
- Web: [aoneahsan.com](https://aoneahsan.com)
- GitHub: [github.com/aoneahsan](https://github.com/aoneahsan)
- LinkedIn: [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan)
- npm: [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan)
- Email: [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)
```
**Was:** identical.

**Change:** none. Five links, no phone number, which is what this repository's IRON rule 8 permits on a public
page. All five match the constants in `lib/constants.ps1`, so the page, the CLI's `--version` output and every
JSON report credit block name the same five destinations.

### S-004 · author.md:12 · the family heading
```
## The cleanup family
```
**Was:** identical.

**Change:** none.

### S-005 · author.md:14-18 · the family table
```
| Platform | Tool | Install |
|---|---|---|
| Linux | [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) | `npx linux-cleanup` |
| macOS | [macleanup](https://github.com/aoneahsan/macleanup) | `npx macleanup` |
| Windows | [windowsweep](https://github.com/aoneahsan/windowsweep) | `npx windowsweep` |
```
**Was:** identical.

**Change:** none to the shipping words. **One mechanical fix:** the fence had lost the `|---|---|---|`
separator that `author.md:15` carries, and a slot fence **is** the shipping string, so applying it as written
would have collapsed the table into a run of pipes on GitHub and in Docusaurus. It is back. `Was: identical`
is now true of all five lines rather than four. Three rows, one per platform, each with the command rather
than a page to read first. This is the page's most useful object and it needs no prose.

**The table keeps three rows on purpose.** It is one row per platform and per platform's command-line tool,
and the desktop window is neither a fourth platform nor a fourth tool - it is the Windows tool with a second
front end. Widening the Windows row would break the parity that makes the table readable at a glance, and it
would put the desktop pointer directly above S-006's "all three", which is the one place the review ruled
out. The window is counted at S-010 instead, five lines earlier.

### S-006 · author.md:20-21 · the shared stance
```
All three share the same stance: name every path before touching it, prune files idle for 100 days by default, refuse to enter personal folders, ship a real dry-run, and make no network calls.
```
**Was:** All three share the same stance: name every path before touching it, prune idle files instead of
wiping caches, refuse to enter personal folders, ship a real dry-run, and make no network calls.

**Change:** one clause, twice. "Wiping caches" is the triumphalist register the Bible bans, and it is aimed at
what the other tools in this category do, which makes it a swipe rather than a description. The first pass
replaced it with "prune files idle for 100 days **rather than clearing a cache whole**", which added the
number - right - and an absolute - wrong.

🔴 **The absolute was false, and the map says so.** Q6 of the approved content map states that section 12
"clears the Windows Update cache, Delivery Optimization and the servicing logs": a cache cleared whole, in
the product this page is about. `docs/sections.md:36` widens the exception rather than narrowing it - a
developer-gated cache is cleared completely outside developer mode - and `--purge-all` exists to do it on
demand. So the contrast is gone and the gate is scoped as what it is: the **default**, `--days` 100 in
`lib/config.ps1:8` and in the engine's own `--help`. The named exceptions belong to `docs/sections.md`, which
owns them in full. The number stays, because the Bible wants exact numbers and this one is exact.

Two more things it buys. It reads as a description of this family rather than a jab at whoever is not in
it. And it drops the sentence from 38 words to 34, which is the fingerprint's stated ceiling rather than
four words past it.

**The claim was verified against both siblings** rather than assumed: `linux-cleanup` and `macleanup` both
default to a 100-day idle window, both ship `--dry-run`, both state zero network calls in their own README, and
`linux-cleanup/lib/common.sh` carries `PROTECTED_PATHS`, `PROTECTED_EXACT` and `PROTECTED_BASENAMES` in the
same three-list shape as `lib/safety.ps1`. A five-item claim about three products is exactly the sentence a
curious reader will spot-check.

### S-007 · author.md:23 · the support heading
```
## Supporting the work
```
**Was:** identical.

**Change:** none.

### S-008 · author.md:25-27 · the support paragraph
```
If windowsweep reclaimed space for you, a star on GitHub and a note to a colleague who has the same problem are the two things that help most. You can also support the maintenance directly at [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep).
```
**Was:** If windowsweep reclaimed space for you, a star on GitHub and a share with a colleague are the
kindest thanks. You can also support the maintenance at
[aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep).

**Change:** two edits. "The kindest thanks" is a superlative, and the Bible rules those out everywhere including
here. It was doing a job that "the two things that help most" does without the flourish. "A share with a
colleague" becomes "a note to a colleague who has the same problem", which is the specific the section was
missing: this tool is discovered by a person telling another person with a full disk. The URL is unchanged
and is the only permitted payment destination. **Nothing here states a price, a tier or the absence of one**,
which is the 2026-09-05 decision applied to the one page most likely to invite such a sentence.

### S-009 · author.md:29 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the edits above it.

🔴 **Left at `2026-09-05`, and it is knowingly not the right value.** The footer should read the day the page
actually lands, and this draft cannot know that day: it was revised on 2026-09-07 and the apply has not
happened. Guessing a landing date is inventing a fact, and a wrong date in a fence is a wrong string shipped,
because the fence **is** the shipping string. **Whoever applies this sets it** - the finalizer or the main
session - and it is the one line in this file that must not be pasted unread. It is not a `NEEDS DECISION`:
nothing here is the owner's to decide, only the applier's to observe.

---

## What the page deliberately does not gain

No thanks-to list, because there are no contributors yet and an empty one is worse than none. No history
section, because `CHANGELOG.md` is the record and duplicating it here creates a second version to keep
current. One line about what the author does, and no more: no employment history, no client list, no
years-of-experience number, because this is a page about a tool and the five links answer the rest for
anyone who wants it. (The earlier draft said this page carried **no** such sentence, which was never true -
S-002's second sentence is one. What the page refuses is the paragraph after it, not the line itself.)

🔴 **And the desktop app is no longer omitted.** The earlier rationale - that it "has nothing to download
yet" - was written before `docs/desktop.md` existed. That page is live now, at `/desktop`, and Bible §1 has
counted the desktop application as part of the product since GATE 1, so the omission had no reason left to
stand on. It is named once, at S-010. What the page still declines is everything **about** it: what it adds over the
command line, what leaves the machine, the SmartScreen note, the installers. Those are row 14's, `desktop-readme` and the docs-site desktop page, and repeating them here would create the second
copy this section exists to prevent.

---

## SELF-CHECK

**Palette.** Unchanged but for one line. W leads once, at S-002's last clause, which is the only aside in
the whole six-surface batch and is on the only page row 7 permits it. P is underneath everywhere else: five verified links, three verified
sibling claims, one exact number in the stance sentence, and now S-010's flat statement of what the desktop
app runs. **R moved from twice to three times**, and the third is new: "reimplements none of it" joins
"refuse to enter personal folders" and "make no network calls" as a thing the tool declines rather than an
adjective claiming a virtue. That is a change to a balance the review called working, so it is recorded
rather than slipped in. It moves toward the Bible's 60/25/15 and not away from it, and the refusal is
load-bearing besides: it is what stops "the same engine" being read as "the same network stance".

**Rhythm.** Measured with `\b[\w'-]+\b` over the fenced strings, headings excluded as labels. Shortest:
S-002's opening at 5 words, with the footer's 3-word label below it and not counted. Longest: the stance
sentence at **34**, down from 38, which is exactly the fingerprint's stated ceiling rather than four words
over it. S-010 lands at 19 and fills the gap between the biography's 25 and the support paragraph's 28.

**Length.** Row 7 asks for short. Short is what it stays. **170 words** - tokenizer: whitespace split;
scope: every fenced shipping string in this file and nothing outside a fence; exclusion: the `#`/`##` heading
markers, the five `-` list bullets and the table separator row, none of which renders as a word. Measured the
same way, the live page is **130** and the previous draft of this file was **158**, so this round is **+12**.
Raw, with nothing excluded, the three numbers are 139, 166 and 179. The +12 is almost entirely the desktop
pointer: S-010 adds 17, S-006 gives back 4 by dropping the false contrast, S-002 gives back 1 with
"command-line", and the separator row's single token is excluded by the rule above. The review asked for a
pointer to a page that now exists; 17 words is what it cost.

**Unsure spots.** None. This surface carries **zero** `NEEDS DECISION`, answered or otherwise - the one it
had is struck at S-002 with the owner's answer recorded in its place. One item still needs a human hand and
is not a decision: **S-009's date**, which must be set to the day the page lands and cannot be known from
here.

**Banned-phrase sweep.** Run with a script over the fenced shipping strings only, 179 raw tokens of them,
against all 87 entries of the shared list, the fingerprint's own "Never" column, and a pricing vocabulary.
Zero hits in all three. Zero exclamation marks, zero em-dashes. Three phrases were removed across the two
rounds rather than kept: the superlative "kindest" at S-008, "wiping caches" at S-006, and now S-006's
"rather than clearing a cache whole", which was not a banned phrase but a false one.

🔴 **The lint hook did not check any of this, and it was proved rather than assumed.**
`posttooluse-story-lint.sh:61` strips every fenced block before it counts a word, and on this surface the
fences **are** the shipping copy. Measured both ways on this file, then restored byte-identical (md5 checked):
three entries from the shared list, appended as **commentary**, made the hook exit 2 and name all three; the
identical sentence appended inside a **fence** left it exit 0 and silent. The words are not reproduced here -
a gate that reads this file would find them in the record of its own test. So its green is real about the
commentary and says nothing at all about the page. Its verdict is not evidence here, in either direction; the
sweep above, the fact-checker and a human reader are the gate on this surface.
