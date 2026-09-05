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
| §A `docs/author.md` | S-001 – S-009 | 9 |

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
**Ahsan Mahmood** - independent software engineer. He writes small command-line tools that do one thing, ships them under MIT, and then uses them on his own machine until they stop annoying him.
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

**NEEDS DECISION: is "independent software engineer" the description you want on this page?** It is the
existing wording and it is kept unchanged, because how you describe yourself is yours to decide rather than
a fact this draft can check. The repository does not settle it: `WINDOWSWEEP_portfolio-info_2026-09-05.md`
carries your name, email and site and no job title at all. Three options. (a) Keep "independent software
engineer", which is what the page says today and reads plainly. (b) Give the wording you use on
aoneahsan.com, which this draft cannot read. (c) Drop the title and let the five links speak, so the line
becomes the name and the sentence after it. **(a) is recommended**, and if you want one wording across every
surface then the answer is yours and it changes five files rather than this one.

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
| Linux | [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) | `npx linux-cleanup` |
| macOS | [macleanup](https://github.com/aoneahsan/macleanup) | `npx macleanup` |
| Windows | [windowsweep](https://github.com/aoneahsan/windowsweep) | `npx windowsweep` |
```
**Was:** identical.

**Change:** none. Three rows, one per platform, each with the command rather than a page to read first. This
is the page's most useful object and it needs no prose.

### S-006 · author.md:20-21 · the shared stance
```
All three share the same stance: name every path before touching it, prune files idle for 100 days rather than clearing a cache whole, refuse to enter personal folders, ship a real dry-run, and make no network calls.
```
**Was:** All three share the same stance: name every path before touching it, prune idle files instead of
wiping caches, refuse to enter personal folders, ship a real dry-run, and make no network calls.

**Change:** one clause. "Wiping caches" is the triumphalist register the Bible bans, and it is aimed at what
the other tools in this category do, which makes it a swipe rather than a description. "Clearing a cache
whole" says the same thing plainly and adds the number that makes the claim checkable. **The claim was
verified against both siblings** rather than assumed: `linux-cleanup` and `macleanup` both default to a
100-day idle window, both ship `--dry-run`, both state zero network calls in their own README, and
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

**Change:** the date moves with the two edits above it.

---

## What the page deliberately does not gain

No thanks-to list, because there are no contributors yet and an empty one is worse than none. No history
section, because `CHANGELOG.md` is the record and duplicating it here creates a second version to keep
current. No sentence about what the author does professionally, because this is a page about a tool and the
five links answer that question for anyone who wants it. And no mention of the desktop application, which is
`desktop-readme`'s surface and has nothing to download yet.

---

## SELF-CHECK

**Palette.** W leads once, at S-002's last clause, which is the only aside in the whole six-surface batch and
is on the only page row 7 permits it. P is underneath everywhere else: five verified links, three verified
sibling claims, one exact number in the stance sentence. R appears twice, both as things the tool declines
rather than as reassurance: "refuse to enter personal folders" and "make no network calls".

**Rhythm.** Shortest shipping sentence: *"## The cleanup family"* is a heading, so the real shortest is
S-002's first clause at four words before the dash. Longest: the stance sentence at 38 words, which is a list
and reads as one.

**Length.** Row 7 asks for short. The page measures 129 words today and lands at 158, which is the shortest
surface in the batch by a wide margin and should stay that way.

**Unsure spots.** One, raised as a `NEEDS DECISION` at S-002: the biography line's description of the author
is his to choose, and this draft keeps the existing wording rather than inventing a better one.

**Banned-phrase sweep.** Run with a script over the fenced shipping strings only, 158 words of them, against
the shared list plus this project's own bans. Zero hits. Two were removed rather than kept: the superlative
"kindest" at S-008 and "wiping caches" at S-006. No pricing word of any kind appears, which was checked
explicitly because the support section is where one would appear.
