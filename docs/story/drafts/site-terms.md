# site-terms - `/terms`, its head, its sitemap blurb, its footer label and its `llms.txt` line

Content-map row **20** · surface: a **new** click-dummy page,
`windowsweep-web/design/windowsweep-web-click-dummy/terms.html`, then the site catalogue · awareness **being
told the rules before an account or a download, a notice and never a persuasion** · structure **who runs it
and how to reach him -> the site -> the account -> the contact form -> the software deletes files ->
analytics as a pointer -> changes and the effective date -> the governing law** · tone band **P and R only,
no humour at all** · length **one page** · CTA **none** · schema **none**.

**A legal safety surface**. `story-craft/references/safety.md` was read before the first sentence, and two of
its rules govern this page: legal consequence, and the yes/no column header. Humour is off. No sentence
pressures, frightens or reassures beyond what a fact supports, and none gives a reader advice about their own
situation, because the page states the operator's rules and nothing else. **GATE 4 is not pre-authorised for
this row**: `run-state.json` lists sixteen surfaces under `gate4PreAuthorised.scope` and `site-terms` is not
one of them, so the owner approves the finished page himself.

**Framework: the row's own beat order, read as a notice**. The persuasion structures in
`copywriting-frameworks.md` each end in an action, and this row's CTA is none. BAB paints an after-state; a
terms page has none to paint. So the beats run in the row's order, one section each. Walter's hierarchy
settles everything else. Functional first. Nothing pleasurable anywhere.

## Status

**Round 1: the developmental editor's five changes are applied** (2026-09-24), on top of the owner's three
answers. Thirteen slots: nine for the page, four for its head, its sitemap entry, its footer label and its
`llms.txt` line. The page body measures **609 words** after the finalizer's pass, under the dispatch's
target of 800 to 1,100, and the self-check says why the gap is left open rather than filled. All three `NEEDS DECISION` items were answered on
2026-09-24 with the recommended option, and none is open. None was guessed. **Round 2 is applied**
(2026-09-24). The line edit made three sentence-level changes, two in S-006 and one in S-007, each named in
its slot's Change paragraph, and it moved no fact, name, number, quoted licence phrase, key or owner sentence.

**The finalizer's pass is applied** (2026-09-24), after the fact-checker and the humor-emotion reviewer both
passed. It made the four changes the main session reconciled: D38's age wording in S-004, a reader-facing second
part for S-011's blurb, *eighteen* in S-013's note, and the deploy-day check in S-008's note. The humanize pass
changed one more sentence, S-006's `elevation`, for the triplet row, and no fact. No `NEEDS DECISION` is open.
The page waits for the owner's GATE 4.

## Conventions in this file

- One numbered slot per block, `S-001` upward, no gaps. Each names the file and the element it fills.
- **`Was:` reads `(new)` on every slot**. No `terms.html` exists, no `terms` catalogue exists, and neither the
  footer, the sitemap nor `llms.txt` carries a Terms entry yet.
- **The fence holds the shipping strings in catalogue form**: one JSON member per line, under a proposed
  `terms` namespace shaped like `privacy.json`. The key names are a proposal, since the catalogue is the parent
  session's to write. The dummy carries the same words in its own HTML, with `<mono>` as `<span class="mono">`
  and `<lnk>` as the named `<a>`.
- **Markup is the site's RichText tags only**: `<lnk>`, `<mono>` and `<b>` (`src/components/ui/RichText.tsx`).
  Every link target is named under its slot, because the href belongs to the call site.
- **One `<lnk>` per string, never two**. RichText maps every `<lnk>` in a key to the single element its call
  site supplies, so a second link in one string would silently point at the first one's target. Where a
  paragraph needs two destinations, it is two keys.
- **Typography: curly apostrophes and curly quotes throughout**, as `account.json` writes them, so the page is
  consistent with itself and no JSON string needs an escape. `privacy.json` uses straight apostrophes; the
  site carries both styles today.
- **Cite the key, never a line number**. Apply by key.
- **Snapshot**: `privacy.html` md5 `c43ed7f0aa5dd1823e1ea96f6af2ea9b` (182 lines) and `privacy.json` md5
  `dd05d7d34b21dffd12638a0f2cb6d37c`, the band vocabulary and the shipped words this page must agree with.
- **en-GB** throughout, and `windowsweep` stays lower-case even where it opens a sentence.

## The lint hook cannot see any of the copy below

`posttooluse-story-lint.sh` strips every code fence before it counts anything. This surface is slot-shaped, so
every shipping string sits inside a fence and **none of it is measured**. A green hook on this file is a
report about the commentary. Nothing more.

So the copy was checked by hand: the 87 entries of `aoneahsan-cccs-story-craft/assets/banned-phrases.txt`
with the hook's own matching rule, and the rhythm rows with the hook's own tokenizer and sentence splitter,
through inline commands that read the strings and wrote nothing. **The fact-checker and a human reader are
the only real gate on the fenced copy**, and this paragraph exists so that nobody reads the hook's silence as
evidence about it.

## Where each fact comes from

| On the page | Packet item | Already shipped or verified at |
|---|---|---|
| Ahsan Mahmood, *"an independent software engineer"* | 1 | `docs/author.md`, the author line |
| `aoneahsan@gmail.com` | 1 | `privacy.json` `nothingLeaves.questions` |
| Pakistan's laws and courts, no city | 2 | content-map amendment of 2026-09-24 |
| Google's age, no number, worded by D38 | 3 | the same amendment |
| The site, the account, the software | 4 | the same amendment |
| Optional, Google only, one account, deletion immediate and final | 5 | `privacy.json` `signedIn.lede`, `account.json` `deleteWhatGoes` |
| Sign-in to send, kept to answer, five in any hour, a sixth refused | 6 | `contact.json` `lede` and `signedOutBody`, `account.json` `db.error.rateLimited` |
| `--dry-run`, `--scan`, and the desktop's *Dry-run first* button, which nothing requires | 7, corrected in round 1 | `privacy.json` `nothingLeaves.scan`; `desktop/src/screens/Home.tsx` (`home.dryRunFirst`); Home's Reclaim waits only for a scan (`state/derived.ts` `useReclaimOffer`), Run's Start for neither (`screens/Run.tsx`) |
| The Recycle Bin by default, Permanent, `--permanent` | 7, bounded | `docs/cli-reference.md`, `docs/safety-model.md` tier table, `lib/safety.ps1` `Send-ToRecycleBin`, `desktop/src/screens/Picker.tsx` |
| Administrator rights and the UAC prompt | 7, bounded | `docs/admin-and-elevation.md` |
| MIT, the copyright line, *"as is"*, *"without warranty of any kind"* | 8 | `LICENSE` at the product root |
| The analytics pointer | 9 | `/privacy` |
| GitHub Releases, npm, Google's own terms | 10 | the packet |
| 24 September 2026, the go-live day, no notification | 11 | the packet; the go-live rule is the owner's (`decision-log.md`, 2026-09-24) |
| No pricing claim | 12 | the sweep in the self-check |
| Acceptance by use, the service's as-is line, the misuse rule | the owner, ND-1 to ND-3 | `decision-log.md`, 2026-09-24 |

---

# `/terms` - the page

## S-001 · `terms.html` · `.page-head` - the crumb, the H1 and the lede

**Was:** `(new)`

```json
"crumb": "Terms",
"title": "These are the terms for using windowsweep.",
"lede": "They cover this website, the account and the software, which is two programs: the command line, published on npm as <mono>windowsweep</mono>, and the desktop app. Using any of them means you accept these terms."
```

**Change:** new. The crumb is S-012's label, one word, as `privacy.crumb` is. **The H1 is a plain sentence
of scope, on purpose**. Row 20 opens on who runs the service, so the page head introduces the page and leaves
the software's rules to S-006, which carries them with their flags and their licence text. **The lede fixes one
name for each thing the terms cover** (round 1): *this website*, *the account*, *the software*, and its two
programs, *the command line* and *the desktop app*. Every later slot uses exactly those names, so *program*
always means one of the two. *The desktop window*, which `/privacy` also uses, appears nowhere here. The
shared-account fact the lede used to carry moved to S-004, where the account's rules are. **The last sentence
is the owner's answer to ND-1**, verbatim, and it is how the page now says a reader comes to be bound: by
use, with no product change at sign-in.

## S-002 · `terms.html` · `.band-well` - who runs it and how to reach him - **beat 1**

**Was:** `(new)`

```json
"operator": {
  "title": "Who runs windowsweep",
  "body": "Ahsan Mahmood, an independent software engineer, runs this website and the account service himself, and he holds the copyright in the software. He sets these terms.",
  "questions": "A question about anything on this page goes to <lnk>aoneahsan@gmail.com</lnk>."
}
```

`<lnk>` target: `mailto:aoneahsan@gmail.com`.

**Change:** new. *"an independent software engineer"* is the author page's wording, which every surface
already uses. *"holds the copyright"* is read from the licence's own first line rather than inferred, since
the packet says he runs the site and the account service himself and says nothing more about who stands
behind the software. The question line is `privacy.nothingLeaves.questions` word for word, minus its second
sentence. One address, one sentence, on both pages. The contact form is not offered here, because S-005 is
where it lives, with the account it needs.

## S-003 · `terms.html` · `.band-app` - the site - **beat 2**

**Was:** `(new)`

```json
"site": {
  "title": "This website",
  "body": "Reading this website, windowsweep.aoneahsan.com, needs no account. Its download links lead to GitHub Releases and to npm, which host the installers and the package under terms of their own."
}
```

**Change:** new. The packet gives the site exactly one fact, its scope, so the section says two things: what
reading it asks of you, and where the downloads actually come from. The second is the one a reader could get
wrong. Naming both hosts keeps these terms from appearing to govern a download that another service holds
under terms of its own. **No third-party link is written**. The packet carries no address for GitHub's, npm's
or Google's terms, and an address written from memory would be a guess on a legal page. Round 1 put the bound
name first. The address now sits beside *this website* instead of standing in for it.

## S-004 · `terms.html` · `.band-well` - the account - **beat 3**

**Was:** `(new)`

```json
"account": {
  "title": "The account",
  "optional": "An account is optional, and neither program needs one: downloading and running them work the same without it. Signing in is Google only, under Google’s own terms. One account covers this website and the desktop app.",
  "age": "To hold an account, you need to be at least the age Google requires to manage your own Google Account in the country where you live. windowsweep asks nothing about your age that Google does not already ask.",
  "delete": "You can delete the account from the <lnk>account page</lnk>. It happens immediately. It cannot be undone.",
  "stored": "What an account stores, what deleting it removes and what stays afterwards are all on the <lnk>privacy page</lnk>.",
  "asIs": "This website and the account service are provided as they are, with no promise that either is available at any given time, and no liability is accepted for data lost from an account."
}
```

`<lnk>` targets: `delete` to `/account`, `stored` to `/privacy`. Both are internal router links.

**Change:** new, and the beat the row names in three parts: Google only, the age, deletion. **The age is the
owner's decision in his own shape, and D38 set its wording** (2026-09-24, *"Manage own account (Recommended)"*,
answered the turn the fact-checker raised it). The first sentence used to name the age Google requires *for a
Google account*. It now names the age Google requires *to manage your own Google Account*, so a child on a
parent-supervised account does not qualify. The capital A is D38's, and it keeps Google's account apart from
the windowsweep account the rest of the section means. No number is printed, because the number is Google's
and it moves with the country. The sentence after it gives the reason as a refusal: windowsweep asks nothing
about age.
*"neither program needs one"* is the packet's *optional* made concrete, in the words `/signin` already ships
(`signin.for3`). **The deletion lines are `/account`'s own** (`account.deleteWhatGoes`), split into two short
sentences exactly as that page splits them, so the consequence reads the same wherever a reader meets it.
**Round 1 moved the shared-account fact here** from the lede, in the settled names. `asIs`, the last member,
is the owner's answer to ND-3, verbatim. It has no link.

**Two homes, avoided on purpose**. What an account holds, what deletion takes and the audit line that
outlives it are all `/privacy`'s, verbatim and approved. `stored` points at them by name and restates none,
so on the day the schema moves, one page goes stale instead of two.

## S-005 · `terms.html` · `.band-app` - the contact form - **beat 4**

**Was:** `(new)`

```json
"contact": {
  "title": "The contact form",
  "body": "Sending a message from the <lnk>contact page</lnk> needs a signed-in account, so a reply has somewhere to go. Each account can send five messages in any hour. A sixth is refused, and the form says why. An account used to send abuse or spam through the contact form may be deleted."
}
```

`<lnk>` target: `/contact`.

**Change:** new. Two of the rules here are the product's own, which is why the page can state them flatly: the
sign-in to send, with its reason, and the hourly limit. *"in any hour"* is the database rule's shape, five in
the trailing hour, and it is narrower than *"an hour"*, which a reader could take for a clock hour. *"the form
says why"* is literal: `db.error.rateLimited` names the limit when it refuses. **The third rule is the
operator's, and the product does not enforce it**: the last sentence is the owner's answer to ND-2, verbatim, a
power he holds as the owner of the account service. **Round 1 cut the retention clause** that opened the
paragraph, on the developmental editor's finding that what a message keeps belongs to `/privacy`
(`never.contactForm.body`). The sentence starts on the rule now. The second home is gone. Nothing here
promises a reply, or a time.

## S-006 · `terms.html` · `.band-well` - **beat 5, the software deletes files**

**Was:** `(new)`

```json
"software": {
  "title": "The software deletes files",
  "removes": "The command line and the desktop app both remove files from your disk. A cache they remove has no undo. A personal file you pick goes to the Recycle Bin by default. Choosing Permanent in the desktop app, or <mono>--permanent</mono> on the command line, deletes it outright. The <lnk>safety model</lnk> sets out, tier by tier, what has no undo.",
  "elevation": "Sections that need administrator rights run only in an elevated session; asking Windows for one goes through its own UAC prompt, which you answer yourself.",
  "dryRun": "Each program has a dry-run. Neither requires one. On the command line it is <mono>--dry-run</mono>, which lists what the same run would remove and removes none of it. In the desktop app it is the <b>Dry-run first</b> button on the Home screen. <mono>npx windowsweep --scan</mono> measures what is reclaimable and deletes nothing. No amount of reclaimed space is promised.",
  "licence": "Both programs are open source under the MIT licence, whose copyright line reads Copyright (c) 2026 Ahsan Mahmood. Under it they are provided “as is”, without warranty of any kind. Its full text is in the <lnk>licence file</lnk>, beside the source.",
  "liability": "Ahsan Mahmood accepts no liability for data lost through the use of either program."
}
```

`<lnk>` targets: `removes` to `https://windowsweep-docs.aoneahsan.com/safety-model`, his own docs site, so an
`ExternalLink` that opens a new tab and stays do-follow · `licence` to
`https://github.com/aoneahsan/windowsweep/blob/main/LICENSE`, his own repository, the same treatment.

**Change:** new. This is the heaviest beat on the page, because it says who carries the loss when a tool
that deletes files deletes something wanted. The heading is the row's own phrase. **Round 1 set the member
order**: removes, elevation, dry-run, licence, liability. What the two programs do to a disk comes first,
including the one thing that needs Windows's own permission, and then the row's three rules in the row's
order. So the dry-run is still the first rule stated.

**Round 2, the line edit, touched two sentences here and no fact**. *"deletes it outright instead"* lost
*instead*, because *by default* in the sentence before already carries the contrast; the sentence now ends on
*outright*, the word that matters. *"A dry-run is available in both programs."* became *"Each program has a
dry-run."*, which is active and two words shorter; *each* is also the word *"Neither requires one."* answers.
*Both* was not used as the opener: the licence paragraph beneath opens on it, and two consecutive paragraphs
opening on one word is a tell the fingerprint names.

**The finalizer's pass changed one more sentence here, and no fact**. In `elevation`, *", and"* became a
semicolon, the fingerprint's own way of joining two related facts. The hook's triplet formula counts any
sentence with exactly two commas and *", and"*, and round 2's comma in S-007 had made that three sentences
against a budget of two. None of the three matched on a list. The semicolon takes this one out. It is still
one sentence, at 25 words, so window 3 keeps its long one.

**Two packet sentences are bounded, and both bounds come from the product's own code and approved docs**.

- **The Recycle Bin**. The packet reads *"personal files it is asked to remove go to the Recycle Bin"*. That
  is the default, in both programs. `--permanent` makes sections 18, 19 and 23 delete outright
  (`docs/cli-reference.md`, and the Recycle Bin tier in `docs/safety-model.md`), and `Send-ToRecycleBin`
  hands the path straight to `Remove-PathSafe` whenever that flag is set. The desktop Picker offers the same
  choice under the label *Permanent* (`picker.permanent`), and it starts on the Recycle Bin
  (`screens/Picker.tsx`). On a page that disclaims liability for lost data, an unbounded Recycle Bin sentence
  would promise a way back that one choice removes, which Bible section 10 forbids. So *"by default"* goes
  in with both names for the choice, and the safety model keeps the tier table.
- **The UAC prompt**. The packet reads *"Sections that need administrator rights ask Windows for them through
  a UAC prompt."* In a console that is already elevated, sections 12 and 13 join `--all` without one
  (`docs/admin-and-elevation.md`). No prompt appears then. The shipped sentence holds for every run: the
  sections run only in an elevated session, and asking for one is Windows's own prompt.

**The licence is quoted, never paraphrased**. *"provided “as is”, without warranty of any kind"* is its own
wording in its own order, lower-cased, keeping its own quote marks round *as is*. The original continues
*"express or implied"*, and the link carries everything after that. Its liability clause is **not**
restated, since any paraphrase of it comes out narrower or wider than the original and the packet forbids
both. The owner's own rule ships instead as the last line, and the full text is one click away. The grant's
*"free of charge"* appears nowhere on this page.

**Round 1 rewrote the dry-run lines to what each program verifiably offers**. The old opener, *"A dry-run
comes first, in either program."*, described a safeguard nothing enforces. Both run for real when asked.
The desktop app's Home screen carries *Dry-run first* as a button
(`home.dryRunFirst`, `screens/Home.tsx`), while the Reclaim button beside it waits only for a scan: in
`state/derived.ts`, `useReclaimOffer` is null until a scan has measured, and a rehearsal only refines the
figure it offers. The Run screen's Start waits for neither, since its queue is the engine's safe batch read
from the catalogue (`screens/Run.tsx`). So the lines now say what exists. A dry-run is offered in both,
neither requires one, and each is named where a reader will find it. *"lists what the same run would remove
and removes none of it"* replaces *"changes nothing in the tree it walks"*, the developer idiom round 1
flagged. The wording is plain now. It stays exact without the old scope words, because it claims nothing
about the dry-run's own log and report under `~\.windowsweep`.

*"No amount of reclaimed space is promised."* is Bible section 10's *"never promise a number"*, which the
packet itself cites, written as the absence it is. The Bible's example sentence for that idea sits in band W,
so the plain form is used instead.

## S-007 · `terms.html` · `.band-panel.band-tight` - analytics, as a pointer - **beat 6**

**Was:** `(new)`

```json
"analytics": {
  "title": "Analytics, on the privacy page",
  "body": "The <lnk>privacy page</lnk> sets out what this website, the desktop app and the command line each send, and lists what is never sent by any of them. These terms add nothing to it."
}
```

`<lnk>` target: `/privacy`. The heading takes the band's `h-sub` class, as privacy's *"Two requests that run
without being asked for"* does.

**Change:** new, and short on purpose: one pointer and one refusal. **Round 1 renamed the heading to what the
section does**, which is to point at `/privacy`, and replaced *"the three programs"* with the settled names,
so *program* keeps meaning one of the two pieces of software on this page. Nothing from `/privacy` is restated, and the
missing switch is not named here either, because naming it would be restating it. *"These terms add nothing
to it."* is the one thing only this page can say about the analytics, and it is checkable against the page
it points at.

Round 2 put a comma before *and lists*. Without it, *each send and lists* reads for a beat as two verbs on
the three senders; the comma hands *lists* back to the privacy page. Twenty-seven words either way, so the
tail window keeps its long sentence.

## S-008 · `terms.html` · `.band-app` - changes and the effective date - **beat 7**

**Was:** `(new)`

```json
"changes": {
  "title": "When these terms change",
  "body": "These terms apply from 25 September 2026. When they change, this page changes and that date moves to the day the new version applies. No email or other notice is sent."
}
```

**Change:** new. The date is the packet's, written as en-GB writes a date. **No notification is promised,
and the page says so out loud**: nothing in either program or on the site sends one, so a reader who wants to
know whether the terms moved has the date, and only the date. It sits here in the row's place and nowhere in
the page head. A second copy would be a second thing to move.

**For the applier**, the owner's rule (`decision-log.md`, 2026-09-24):
*the date is the go-live day; the applier re-sets it if the deploy lands on a later day*. The page deploys
today, 2026-09-24, so 24 September 2026 stands. The applier re-checks the calendar at deploy and moves the
date only if the deploy day is not 24 September 2026. Then the deploy day becomes the date. **Applied 2026-09-25**: the page deployed on 25 September 2026 (Pakistan time), so the fence reads 25.

## S-009 · `terms.html` · `.band-well` - the governing law - **beat 8**

**Was:** `(new)`

```json
"law": {
  "title": "The law that applies",
  "body": "The laws of Pakistan govern these terms. A dispute under them goes to the courts of Pakistan."
}
```

**Change:** new, and the owner's decision exactly: Pakistan's law, Pakistan's courts, and no city. The page
ends here, on the plain limit, because the row ends here. There is no closing summary and no second contact
line, since the address already sits in S-002.

---

# The head, the sitemap, the footer and `llms.txt`

## S-010 · `terms.html` `<head>` and `seo.json` - `seo.terms.title` and `seo.terms.description`

**Was:** `(new)`

```json
"terms": {
  "title": "Terms · who runs windowsweep, and the rules for using it",
  "description": "Ahsan Mahmood runs windowsweep. Its software deletes files and is provided as is, under the MIT licence, with no liability accepted for lost data."
}
```

**Change:** new. The title keeps `/privacy`'s shape: a one-word label, a middle dot, then two clauses joined
by *and*, at 56 characters against privacy's 57. The description is 146 characters against privacy's 144,
in two full sentences, and it carries the two facts a search result should never hide: who stands behind the
product, and that the software comes as is with no liability for lost data. `seo.json`'s `_provenance` says
every title and description is the dummy's own, so `terms.html` carries both in its `<title>` and
`<meta name="description">` first. *"as is"* goes unquoted here. A meta description summarises; the page
itself quotes the licence.

## S-011 · `sitemapBlurbs.json` - `sitemap.blurb.terms` and `sitemap.name.terms`

**Was:** `(new)`

```json
"blurb": { "terms": "Who runs it, the account rules, the software as is under MIT, and the law. A notice to read before any account or download." },
"name": { "terms": "Terms" }
```

**Change:** new, and both members sit inside `sitemap`. The blurb follows the privacy blurb's two-part shape:
what the page covers, then what kind of surface it is. **The finalizer replaced the second part**, on the
humor-emotion reviewer's finding. It read *"A safety surface: no humour, no urgency."*, the story system's own
name for the copy's register, which no reader has been given. The reviewer's *"A notice to read before an
account or a download."* brought the blurb to 124 characters, one over the longest of the other blurbs, which
run 76 to 123. *"any account or download"* takes out that character and no noun. **The blurb is 123 characters, 24
words**. Each noun is the page's own: the notice is the page itself, the account is S-004's, and the download
is what S-003's links lead to.

## S-012 · `common.json` - `footer.links.terms`, and `nav.terms` if the header carries it

**Was:** `(new)`

```json
"terms": "Terms"
```

**Change:** new. One word, like *Privacy* and *Sitemap*. The owner asked for a *"terms & conditions"* page,
and the label is shortened the way every footer label on the site is; the H1 and the title carry the full
sense. **Placement is not this draft's**. The footer's Product column carries Privacy (`shell.js`), which
makes the place beside it the natural home, but the column, and whether the header gains the link too, are
the dummy's call, first.

## S-013 · `public/llms.txt` - the page's line under *Pages on this site*

**Was:** `(new)`

```text
- [Terms](https://windowsweep.aoneahsan.com/terms): who runs windowsweep, the account rules, the software as is under the MIT licence, and Pakistan law
```

**Change:** new, in the form of the lines beside it: a bracketed label, the absolute address, a colon, then a
lower-case description with no closing stop. It belongs directly after the Privacy line. Its description is
99 characters, the longest in that list by eighteen, and the length is four beats a machine reader needs, each
named once. Eighteen is the fact-checker's count, where this note first said twenty.

---

# NEEDS DECISION

Three, verbatim. Each is a clause the packet does not supply, raised because a terms page reads as though it
carries one. None blocks the other words on the page. Every option is one sentence, placed where it says.

> **ND-1**. **ANSWERED 2026-09-24: option (b)**, as recommended, recorded in `decision-log.md` the same day
> and applied as the last sentence of S-001's lede.
> NEEDS DECISION: does using the site, the account or the software mean accepting these terms, and
> does the page say so? The draft states only what the terms cover (S-001's lede) and claims no way a reader
> agrees to them, because no fact in the packet says how they bind. Options: (a) scope only, the draft as
> written; (b) one sentence at the end of S-001's lede, *"Using any of them means you accept these terms."*;
> (c) an explicit acceptance at sign-in, a product change to `/signin` and the desktop Account screen that
> goes into both click dummies first. Recommended (b), because it is the conventional statement, it needs no
> product change before Google reviews the consent screen, and every rule it would bind a reader to is
> already on the page in plain words.

> **ND-2**. **ANSWERED 2026-09-24: option (b)**, as recommended, recorded in `decision-log.md` the same day
> and applied as the last sentence of S-005's `body`.
> NEEDS DECISION: may an account be deleted, or a message discarded, for misuse? The page states
> only the limits the product enforces by itself: a signed-in account to send, and five messages in any hour.
> The packet reserves no right to act against abuse or spam sent through the contact form, and the draft
> invents none. Options: (a) no such clause, the draft as written; (b) one sentence at the end of S-005, *"An
> account used to send abuse or spam through the contact form may be deleted."*; (c) a short list of what the
> form may not be used for. Recommended (b), because as the owner of the Supabase project behind the account
> service he can already delete any account, and a terms page is where that power is either stated or left
> for a reader to discover; one sentence states it with no list to keep current.

> **ND-3**. **ANSWERED 2026-09-24: option (b)**, as recommended, recorded in `decision-log.md` the same day
> and applied as S-004's last member, a key of its own (`account.asIs`).
> NEEDS DECISION: does the as-is position reach the website and the account service? The packet
> scopes *"as is"* and *"no liability for lost data"* to the software, and the draft keeps them there, so the
> page says nothing about whether the site is available or about data held in an account. Options: (a) the
> software only, the draft as written; (b) one sentence at the end of S-004, *"This website and the account
> service are provided as they are, with no promise that either is available at any given time, and no
> liability is accepted for data lost from an account."*; (c) availability only, without the data clause.
> Recommended (b), because the software's position and the service's then match, and a reader does not have
> to work out from silence which of the two covers the settings and run summaries an account syncs.

# Not written, deliberately

Seven things a lawyer might look for are absent: an indemnity, a cap on liability, arbitration, a notice
period before a change, a severability clause, a postal address, and a licence for the site's own words. None
is raised as a decision. Nothing on the page implies any of them, and the row does not ask for them. The last
one needs a sentence of reasoning: S-006 scopes the MIT licence to *"Both programs"* by name, so it cannot be
read as covering the site, whose repository is private (D9). Each of the seven is one sentence away if the
owner wants it.

# Reported, not fixed - outside this draft's scope

1. **Two approved site strings go stale the moment Google sign-in is live on the site**.
   `seo.signin.description` reads *"It is not enabled yet, and this page says so rather than failing when you
   press it."*, and `sitemap.blurb.signin` reads *"Carries the honest not-configured-yet state, because that
   is today’s truth."* Row 20's amendment records that sign-in *"went live on the backend the same morning"*.
   The first string is row 19's. The second is a sitemap blurb, which the 2026-09-08 amendment left outside
   the map as navigation. Neither was re-read when sign-in landed. I have not checked sign-in on the wire, so
   this is conditional. The `signin.blocked` and `contact.blocked` strings render only while sign-in is off,
   and they are unaffected.
2. **Content-map question 5 still says a dry-run *"writes nothing"***. Its answer-first sentence reads
   *"`--dry-run` performs the whole run and writes nothing"*. Bible section 3 corrected that exact claim on
   2026-09-07, with a measurement: a dry-run writes its own log and its own report, and nothing of yours. The
   map is a GATE 2 artefact. It is outside this scope.
3. **Row 20's amendment points D31 to D34 at a file that does not hold them**. It says they are recorded in
   `docs/PROJECT-CONTEXT.md`, whose decisions end at D24 and which was last updated on 2026-09-17. Today the
   four answers live only in the amendment's own table and in `run-state.json` `currentRun`. A pointer to an
   empty home is how the next session re-asks a question the owner has already answered.
4. **Two sentences in this dispatch's facts packet are unbounded**: item 7's Recycle Bin line and its UAC
   line. S-006 bounds both. Its sources are named there. If the packet was copied from a record, that record
   carries the same two sentences and wants the same two corrections.

---

# Self-check

**Unit and instrument, stated once**: the nine page fences, `S-001` to `S-009`; RichText tags removed; curly
apostrophes read as straight before tokenizing; the hook's tokenizer `\b[\w'-]+\b` and its splitter
`(?<=[.!?])\s+`. Headings are excluded from rhythm and from the palette, and included in length.

1. **Palette, counted in sentences: P 37 of 44, R 7 of 44, W 0**. R lands only where the page names a refusal
   that is a fact: reading this website needs no account (S-003) · neither program needs one, and nothing asks
   your age (S-004) · administrator rights wait for the UAC prompt you answer, `--dry-run` removes none of what
   it lists, and `--scan` deletes nothing (S-006) · the terms add nothing to `/privacy` (S-007). P carries every
   other line, the deletion facts, the licence and the liability among them, and so do the three answered
   sentences: acceptance by use (S-001), the service's as-is line (S-004) and the misuse rule (S-005). Each
   states a limit or a rule. None is comfort. Round 1's *"Neither requires one."* is P too, a plain limit on a
   safeguard. **Humour sweep: zero W lines**. The shortest sentences are in that count. **Sweeps over every
   fence, S-001 to S-013, re-run after round 1**: 0 of 87 banned entries, no allow marker; em dashes 0; *not X,
   but Y* 0; exclamation marks 0; no heading asks a question and there is no table, so the yes/no header rule
   has nothing to catch; pricing words 0 (`free`, `paid`, `price`, `pricing`, `plan`, `subscription`, `trial`,
   `cost`, `charge`), with `tier` twice in *"tier by tier"*, the safety model's word for its deletion tiers;
   urgency words 0 except *immediately*, once, in S-004, saying when a deletion happens. The finalizer re-ran
   them all.
2. **Rhythm: shortest *"It happens immediately."* (S-004, `/account`'s own split) and *"Neither requires one."*
   (S-006), 3 words each; longest S-004's `asIs`, the owner's ND-3 sentence, at 33 words**. Burstiness
   **0.540** over 44 sentences after the finalizer's pass (0.538 after round 2, 0.532 before it), against a
   floor of 0.45. Mean 13.0 and median 12, inside
   the fingerprint's 12 to 16, and the longest sits one word under its ceiling of 34. Range windows: 4 of 4
   checked pass, the 106-word tail included, re-measured after round 2 and after the finalizer's pass, where
   D38's 26-word age sentence gave window 1 a second long one. Window 3, S-006 `removes` to `licence`,
   now holds a 5-word sentence beside its 3-word one. The other three are unchanged. **Corrected by the finalizer**: round 2's comma in S-007 made three sentences match the hook's
   triplet formula, S-006's elevation line, S-004's `asIs` and S-007's `body`, against a budget of two. The
   semicolon in the elevation line leaves two, which is exactly the budget at this length; neither match is a
   list. By eye there are three real three-part lists, where two were first counted: the lede's scope, S-004's
   pointer and S-007's three senders. Each counts a set with exactly three members. The two 3-word sentences
   sit one under the fingerprint's floor of 4. The first is `/account`'s split, and the second is round 1's
   limit, kept short so it cannot be skimmed past.
3. **Length, with headings**. Against the row's cap of one page: S-001 42 · S-002 41 · S-003 33 · S-004 143 ·
   S-005 54 · S-006 202 · S-007 38 · S-008 35 · S-009 21, **total 609**, inside the cap and 191 under the
   dispatch's 800 floor. The gap is left open. The two-homes rule sends the account's inventory, the analytics
   and the deletion list to `/privacy`; the packet holds twelve facts, and each beat states its own; and every
   other candidate needed a fact the packet does not carry. Round 1 moved the total from 590 to 611: S-006 +16
   for the desktop's dry-run control, S-007 +10 for the settled names and the renamed heading, S-004 +9 for the
   shared-account sentence it took from the lede, S-003 +2, S-001 -4, and S-005 -12 for the retention clause.
   Round 2 took three words from S-006 (611 to 608); no other slot moved. The finalizer's pass moved S-004
   +2 for D38's wording and S-006 -1 for the *and* the semicolon replaced, 608 to 609.
   Head and index slots: title 56 characters, description 146, blurb 24 words and 123 characters, label 1
   word, `llms.txt` description 99 characters.
4. **Unsure spots**: the two bounded packet sentences in S-006, both stricter than the packet and both sourced ·
   *Dry-run first* is the desktop's own button label (`home.dryRunFirst`), so a rename there makes S-006 stale ·
   item 1's *"the first thing stated inside the software beat"*, read with item 3's order as the first of the
   row's three rules · S-008's date, which is today's and moves if the deploy lands later · the fingerprint is
   still `calibrated: false`, the Bible's open item, so every rhythm figure is measured against an unblessed
   target. That is the whole list.
