# site-front-site - the marketing site's machine-facing text

Content-map row **19** · surface `windowsweep-web` (`public/llms.txt`, the per-route content record, the
per-route JSON-LD) · awareness **a machine, or a search result** · structure **answer-first** · tone band
**P only** · length **short** · CTA **none** · schema **WebSite + Organization**.

Every string below is read by something that is not a person: a crawler deciding what a page is, an answer
engine deciding whether to quote it, a search result deciding what forty words to show. There is no reader
to charm. So the whole surface is band **P** - exact nouns, exact numbers, present tense, and no adjective
doing work a number could do. Workshop dryness is at zero, deliberately. The 404 page carries a dry line of
its own; its description does not, because a description is read in a list of ten results by someone who has
never seen the page.

**Answer-first, on every one of them.** A description that opens by naming the category is the failure mode
of this surface. The first clause answers the question the reader typed.

## The three files these strings land in

| File | Slots | What it is |
|---|---|---|
| `windowsweep-web/public/llms.txt` | S-001 - S-006 | the site's own summary for AI crawlers |
| the per-route content record (`src/content/`, read by the page **and** by the prerendered head) | S-007 - S-033 | thirteen `<title>` + `<meta name="description">` pairs, and one `og` rule |
| the per-route JSON-LD blocks | S-034 - S-036 | `WebSite`, `SoftwareApplication`, and the author node |

Thirty-six slots. The dummy already carries a `<title>` and a description on all thirteen pages and a
`SoftwareApplication` block on `/`, so most slots have a real `Was:` line rather than `(new)`.

## Routes covered, and routes skipped

The route list is not invented here. It is `pages-registry.js` in the approved dummy, whose own header says
*"`route` is the real public URL the page will have. Public paths are frozen in
`../../docs/PROJECT-CONTEXT.md` and are never invented here."*

**Thirteen routes have a dummy page and are written:** `/`, `/download`, `/changelog`, `/privacy`,
`/sitemap`, `/feed`, `/404`, `/signin`, `/contact`, `/account`, `/admin`, `/admin/users`, `/admin/audit`.

**Skipped, with the reason:**

| Skipped | Why |
|---|---|
| `/admin/inbox` | plan v2 §7.5 names it; **the dummy does not have it.** `admin-inbox.html` carries `route: '/admin'`, so the inbox *is* `/admin` and there are three admin routes, not four. The dummy is the specification (`frontend-ui-standards` §10a) and its registry is the frozen list, so `/admin` is written and `/admin/inbox` is not. Reported rather than reconciled - amending the plan is not this draft's to do |
| `/sitemap.xml`, `/feed.xml`, `/robots.txt` | not HTML. They have no `<title>` and no description. Their generation belongs to §7.7 |
| the seven `gallery-*` pages and `pages.html` | `route: null` in the registry - review harness, not product pages |
| an OG image, a canonical tag, a `meta robots` value | not copy. §7.7 owns them. Where a route wants `noindex`, this draft says so in the slot's `Change:` line and stops there |

## Conventions in this file

- One numbered slot per shipping string, `S-001` upward, no gaps.
- **`Was:` reproduces the string that is in the dummy today**, verbatim, or reads `(new)` where no string
  exists yet.
- 🔴 **The fence content is the exact string that ships.** For a `<title>` or a description the fence holds
  the attribute *value*, not the tag. For a JSON-LD node it holds the whole node, because that is what ships.
- Every title and description carries its **rendered character count** beside the fence. Titles want 60 or
  fewer, descriptions 155 or fewer. Counts were taken with `[...s].length` in Node, which counts code points
  rather than UTF-16 units, so the `·` separator counts as one character and a later editor measuring the
  same string a different way will get the same answer.
- **en-GB** throughout: `licence` as a noun, `artefact`, `behaviour`. `SmartScreen`, `CHANGELOG.md` and
  `sitemap.xml` keep their own spelling because they are identifiers.
- The product name is lower-case **windowsweep**, including at the start of a sentence. No exceptions.

## 🔴 The lint hook cannot see any of the copy below

`posttooluse-story-lint.sh:61` strips every code fence before it counts anything. This surface is
slot-shaped: every shipping string sits inside a fence, so **none of it is measured**. A green hook here
reports on this commentary and on nothing a reader or a crawler will ever see.

The banned-phrase check was therefore **run by hand**, over the fence contents only, against
`aoneahsan-cccs-story-craft/assets/banned-phrases.txt`. The result is at the end of this file, with the
near-misses named rather than quietly passed.

## Four decisions taken in this draft

**One separator, and it is the middot**. The thirteen titles today use three different schemes: an em dash
on nine pages, a middot inside the three admin titles and both at once on `Admin · Inbox — windowsweep`.
Standardising on `·` is not a preference. An em dash in every title would spend the fingerprint's whole
punctuation budget - one per 150 words - thirteen times over across 374 words of route strings. The
middot is already the product's own separator: the home eyebrow reads `Windows 10 and 11 · PowerShell 5.1 ·
nothing to install`, and the footer reads `MIT licence · windowsweep 1.1.0`.

**The `og` pair mirrors the route pair, and one divergent string is retired**. `index.html` ships an
`og:description` that is a *third* self-description of the product, different from both its own
`<meta name="description">` and the approved tagline. Entity consistency is the one AEO lever that costs
nothing. So S-033 sets one rule: `og:title` is the route title and `og:description` is the route
description, on every route. The divergent line is retired, not joined by a fourth.

**No pricing claim, in either direction, anywhere in these thirty-six slots**. Not a price, not a tier, not
a sentence saying there is no paid tier. Silence is the honest form. The `SoftwareApplication` node carries
**no `offers` and no `isAccessibleForFree`** - both are pricing claims wearing schema clothing, and the
second one has already had to be removed from two other artefacts in this project rather than being caught
before it was written. The dummy states this in a comment above its own block. This draft does not weaken
it.

🔴 **One cost-adjacent word is kept and it is `licence`.** `Licence: MIT` appears in S-005. MIT is a licence
rather than a price, and it is already visible in the footer (`MIT licence · windowsweep 1.1.0`), in the
`README`, in `package.json` and in the dummy's own JSON-LD as
`"license": "https://opensource.org/licenses/MIT"`. Removing it from the machine-facing file alone would
make that file less accurate than the page it describes, which is the opposite of what this surface is for.
It is flagged rather than assumed. One line deletes it if it reads as a price claim.

## The two counts this draft declines to assert

Both were ruled out on `site-home` earlier today, and the same ruling holds here for the same reason rather
than by inheritance.

**No self-test count.** Three numbers are live at once. The site brands **1.1.0** in three places; the
shipped 1.1.0 binary prints **151**; the source at `HEAD` runs **155** on the way to an unreleased 1.2.0. A
tally in `llms.txt` is therefore a number that goes stale on a schedule nobody watches, in the one file
whose whole purpose is to be believed without being checked. S-006 names **the check itself** instead - a
self-test check greps every source file for HTTP and socket calls and fails the build on a hit - which is
what the sentence is about, and which is true at every count. (`index.html` band 2 does print `151`, as a
recorded property of one measured run rather than a live count. That block belongs to `site-home` and is not
touched here.)

**No audit count.** The sources disagree. `README.md:105` says three read-only audits; the tier table at
`docs/safety-model.md:74` puts five sections in the report-only tier. No slot asserts one.

---

# Group A - `public/llms.txt`

The docs site already ships an `llms.txt` at `windowsweep-docs/static/llms.txt`. This one is **not** a copy
of it and not a competitor to it. That file documents the tool section by section and links fourteen
documentation pages. This one says what the *site* is, what each page answers and where the installers are.
The H1 is the same on purpose - one entity, one name - and the summary differs because the two properties do
different jobs.

## S-001 · `llms.txt` · the H1 and the summary blockquote

**Was:** `(new)` - `windowsweep-web` has no `llms.txt`.

```text
# windowsweep

> windowsweep is a Windows disk-cleanup command line that names every path before it touches one. It
> removes regenerable caches: package managers, build tools, browsers, editors, Windows temp and update
> leftovers, stale project build artefacts. Every deletion passes through one function that refuses
> documents, credentials, cloud-sync folders and browser profiles, and no flag lifts the refusal. It runs
> on Windows 10 (1809 and later) and Windows 11.
```

**Change:** new. Answer-first: the first eleven words say what it is and what makes it different, so a model
quoting a single sentence of this file carries the whole claim rather than half of it. The refusal list is
named rather than summarised as "safe",
because band R delivers reassurance as a specific refusal. 🔴 It is **four** sentences of 15, 19, 21 and 11
words rather than the two a summary paragraph invites, because the docs site's own `llms.txt` opens with a
50-word sentence and the fingerprint's stated ceiling is 34; matching that precedent would have broken the
rhythm rule on the first line of the surface.

## S-002 · `llms.txt` · what this site is

**Was:** `(new)`

```text
This site is windowsweep.aoneahsan.com: where the tool is downloaded, and where an account holds what the
desktop app has synced. The documentation lives on a separate site and is not duplicated here. Three programs
carry the name and they do not behave the same way on the network - the command-line engine, the desktop
window, and this site. The privacy page says which is which.
```

**Change:** new. It exists so a crawler does not merge this site and the docs site into one blurred
property. The three-programs sentence sits here rather than only on `/privacy`, because a model summarising
the site from `llms.txt` alone is exactly the reader who would otherwise carry the engine's offline record
over to the window.

## S-003 · `llms.txt` · the page list

**Was:** `(new)`

```text
## Pages on this site

- [Home](https://windowsweep.aoneahsan.com/): what it removes, what it refuses, one recorded run, and both install paths
- [Download](https://windowsweep.aoneahsan.com/download): both desktop installers with their sizes, what verifies them, and the npx command
- [Changelog](https://windowsweep.aoneahsan.com/changelog): every released version, rendered from the product repository
- [Privacy](https://windowsweep.aoneahsan.com/privacy): what each of the three programs sends, and the list of what is never sent
- [Contact](https://windowsweep.aoneahsan.com/contact): a message form; signing in is required so a reply has somewhere to go
- [Account](https://windowsweep.aoneahsan.com/account): the settings and run summaries the desktop app has synced, and account deletion
- [Sitemap](https://windowsweep.aoneahsan.com/sitemap): every public page on the site
- [Feed](https://windowsweep.aoneahsan.com/feed): the releases as dated entries, mirrored at /feed.xml

Sign-in, and the three admin pages behind it, are not listed: they hold one person's own data and a
row-level policy refuses them to everyone else.
```

**Change:** new. Seven public pages, and the reason the gated ones are missing, so their absence reads as a
decision rather than an omission. The site's own domain resolves over HTTPS today with a valid certificate
(measured 2026-09-08: it answers 404, because nothing is deployed yet), so these URLs are safe to write out.

## S-004 · `llms.txt` · the documentation link block

**Was:** `(new)`

**NEEDS DECISION - left unwritten.** The scheme is not mine to choose; the decision is recorded verbatim at
the end of this file. Everything around this block is written, and the block drops in as one substitution.

## S-005 · `llms.txt` · download and source

**Was:** `(new)`

```text
## Download and source

- Desktop installers, checksums and signatures: https://github.com/aoneahsan/windowsweep/releases
- npm package: https://www.npmjs.com/package/windowsweep
- Repository: https://github.com/aoneahsan/windowsweep
- Issues: https://github.com/aoneahsan/windowsweep/issues
- Author: Ahsan Mahmood, https://aoneahsan.com
- Licence: MIT
```

**Change:** new. Every URL here is read from the repository - `package.json` for the npm, repository and
author fields, and the dummy footer for the issues link. None is guessed. The releases page is named as the
source of the installers rather than the site's own `/download`, because the checksums and the signatures
are published there, and a machine following this line should land where the files are.

## S-006 · `llms.txt` · facts an answer should get right

**Was:** `(new)`

```text
## Facts an answer should get right

- Windows only. npm refuses to install it elsewhere, and the launcher exits 2 on any other platform.
- Three programs carry the name and only one of them is offline. The command-line engine makes no network
  calls at all - a self-test check greps every source file for HTTP and socket calls and fails the build on
  a hit. The desktop window and this website send usage events to Google Analytics 4, Amplitude and
  Microsoft Clarity, and errors to Sentry. Clarity records session replays. There is no opt-out.
- Personal folders are refused unconditionally. Documents, Desktop, Pictures, credentials, cloud-sync
  folders and browser profiles sit among 66 protected subtrees, and no flag lifts the refusal.
- It deletes. Caches have no undo because they regenerate; personal files a person selects go to the
  Recycle Bin instead.
- Two sections are permanent: emptying the Recycle Bin (11) and clearing event logs (16). Both sit behind
  --i-understand-deep, which also gates the hibernation file (15) and disk-image compaction (20). None of
  the four runs in the safe batch.
- Twenty-six numbered sections, 0 to 25. A section number is a frozen public contract.
- The desktop installer is not signed with a code-signing certificate, so SmartScreen warns on first run.
  Every release publishes a SHA-256 checksum and a minisign signature. Neither is a certificate.
- One authorised run removed 3,924,712,402 bytes across 11 sections, on one Windows machine, on
  7 September 2026. It is not a promise and not an average. windowsweep --scan measures a given machine and
  deletes nothing.
- The documentation is a separate site. This one is where the tool is downloaded.
```

**Change:** new, and every line is checkable. Four of the nine exist to stop a specific wrong answer: that
the tool is cross-platform, that "no telemetry" covers the window, that a checksum is a certificate, and
that a recorded figure is a typical result. The permanent-sections line names the flag's full reach - 11,
15, 16, 20 - beside the two that are permanent, because a sentence that says "two" and then names a flag
covering four is the near-miss a reader who finds the other two stops trusting the rest of the file for.

---

# Group B - the per-route `<title>` and description

Thirteen routes, twenty-six strings, plus the `og` rule at S-033. Every description is true of **its own
page**, and no two are alike; the uniqueness check is at the end of this file.

## `/` - home

### S-007 · `/` · `<title>`

**Was:** `windowsweep — safe Windows cleanup that names every path first`

```text
windowsweep · Windows cleanup that names every path first
```

**57 characters.** **Change:** `safe` comes out. It is an adjective standing where a refusal belongs, which
is the exact swap the approved `tagline` surface made when it replaced *safe-by-default*: a reader who has
watched a cleaner delete something they needed has already been told a tool was safe. The clause that
survives is the page's own H1.

### S-008 · `/` · `<meta name="description">`

**Was:** `windowsweep reclaims disk space on Windows without touching your files. It names every path before
it acts, refuses fifteen roots and sixty-six protected subtrees, never follows a junction, and the command
line makes no network calls.`

```text
windowsweep removes regenerable caches on Windows. It names every path before it touches one, and refuses documents, credentials and browser profiles.
```

**150 characters** - the old one was 231, so roughly a third of it never rendered. **Change:** the first
sentence is now a complete answer on its own, which is what an engine extracts. One clause had to go.
*"without touching your files"* is dropped as false-adjacent: three interactive sections do touch personal
files, with a list and a final question, and the FAQ on this very page says so. The four-clause pile-up loses the two claims that
belong on other pages - the junction check is a mechanism `/privacy` explains, and the zero-network fact is
`/privacy`'s opening line.

## `/download`

### S-009 · `/download` · `<title>`

**Was:** `Download windowsweep — installers and the command line`

```text
Download windowsweep · installers, checksums, npx
```

**49 characters.** **Change:** separator, and `checksums` earns the space that *and the* was using. It is
the word someone types when they are deciding whether to trust an unsigned binary.

### S-010 · `/download` · `<meta name="description">`

**Was:** `Both desktop installers with their sizes, what a checksum and a minisign signature actually prove,
and the zero-install command line beside them.`

```text
Both desktop installers with their sizes, the SHA-256 checksum and minisign signature that verify them, why SmartScreen warns, and the npx command.
```

**147 characters.** **Change:** SmartScreen is named. It is the first thing that happens to a person who
downloads this file, the page spends a whole section on it, and a description that omits it lets the warning
arrive as a surprise. `actually` goes; the algorithm name replaces it, which is more useful to a machine and
shorter besides.

## `/changelog`

### S-011 · `/changelog` · `<title>`

**Was:** `Changelog — windowsweep`

```text
Changelog · every released version of windowsweep
```

**49 characters.** **Change:** the bare form was a label. Twenty-six characters of unused budget bought the
answer to *what is on this page*.

### S-012 · `/changelog` · `<meta name="description">`

**Was:** `Every released version of windowsweep, rendered from the product repository's CHANGELOG.md.`

```text
Every released version of windowsweep with its added, changed and fixed entries, rendered from the CHANGELOG.md in the product repository.
```

**138 characters.** **Change:** the three Keep a Changelog headings are named, because they are the page's
actual structure and they tell a machine what shape the content has. The possessive is rewritten as a
prepositional phrase: an apostrophe in a description is one of the characters search engines strip.

## `/privacy`

### S-013 · `/privacy` · `<title>`

**Was:** `Privacy — what windowsweep sends, and what it never sends`

```text
Privacy · what windowsweep sends, and what it never sends
```

**57 characters.** **Change:** separator only. The title is already the page in six words, and its second
half is band R doing its job, so it is kept.

### S-014 · `/privacy` · `<meta name="description">`

**Was:** `The command line makes no network calls. The desktop window and this website send usage events to
four destinations, with no opt-out. Both facts, at the same size.`

```text
The command line makes no network calls. The desktop window and this site send usage events and errors to four destinations, with no opt-out.
```

**141 characters.** **Change:** neither half is softened, and neither is allowed to bleed into the other -
the offline claim is scoped to the command line in its own sentence, and *no opt-out* is the last thing in
the sentence that carries it, which is the emphatic position. `and errors` is added because Sentry is
one of the four destinations and *usage events* alone would have undercounted what is sent. The closing
*Both facts, at the same size* is a sentence about the page's layout rather than about the product; it is
right on the page and does nothing in a search result, so the space went to the fourth destination.

🔴 **The page's program count is in its headings, not in these two strings**. `privacy.html` says *two
programs* in its `<h1>` (line 35) and in one `<h2>` (line 41); there are three, with two answers. Those
headings are row 17's and are being rewritten there. The `<title>` and description never carried the count:
the `Was:` lines above are the dummy's head strings verbatim, and the description already named all three.
What ships here keeps that shape. It names the command line, the desktop window and this site; it gives the
two answers; it counts nothing. So it stays true when the heading changes.

## `/sitemap`

### S-015 · `/sitemap` · `<title>`

**Was:** `Sitemap — windowsweep`

```text
Sitemap · every public page on windowsweep.aoneahsan.com
```

**56 characters.** **Change:** the host is in the title because a sitemap page is what a person lands on
when they are trying to establish what a site contains, and the host answers that before they click.

### S-016 · `/sitemap` · `<meta name="description">`

**Was:** `Every public page on windowsweep.aoneahsan.com, with a filter.`

```text
Every public page on this site, with a filter. The machine-readable counterpart, sitemap.xml, is regenerated on every build from the same routes.
```

**145 characters.** **Change:** the old line was true and half-empty at 61 characters. What is added is the
page's own explanation of why it exists beside an XML file, which is the question a machine reading two
sitemap URLs on one origin would otherwise have to guess at.

## `/feed`

### S-017 · `/feed` · `<title>`

**Was:** `Feed — windowsweep`

```text
Feed · every windowsweep release, newest first
```

**46 characters.** **Change:** the ordering is stated, because it is the one thing a reader wants to know
before clicking a feed link.

### S-018 · `/feed` · `<meta name="description">`

**Was:** `The readable feed. Its entries are the changelog's, which is the only dated thing this site has.`

```text
Release entries, newest first, with the date and what changed. The changelog is the only dated surface on this site, and it is what feed.xml carries.
```

**149 characters.** **Change:** the honest point survives - this feed carries releases because releases are
the only dated thing here - and it now leads with what an entry contains rather than with a category name.
The possessive apostrophe goes for the same reason as S-012.

## `/contact`

### S-019 · `/contact` · `<title>`

**Was:** `Contact — windowsweep`

```text
Contact · send a message about windowsweep
```

**42 characters.** **Change:** a verb, so the title says what the page is for rather than what it is called.

### S-020 · `/contact` · `<meta name="description">`

**Was:** `Send a message about a missed cache path, a section that behaved unexpectedly, or anything else.
Signing in is required so a reply has somewhere to go.`

```text
Send a message about a missed cache path or a section that behaved unexpectedly. Signing in is required so a reply has somewhere to go.
```

**135 characters.** **Change:** `or anything else` is cut. Two named examples are more useful to a person
deciding whether this is the right page than a third clause that names nothing. The sign-in sentence is kept
verbatim: it is the page's own reason, and rewriting a good sentence to prove a pass happened is how an
approved line gets quietly worse.

## `/account`

### S-021 · `/account` · `<title>`

**Was:** `Your account — windowsweep`

```text
Your account · windowsweep
```

**26 characters.** **Change:** separator only.

### S-022 · `/account` · `<meta name="description">`

**Was:** `Your email and display name, the desktop settings this account has synced, your last runs,
sign-out and account deletion.`

```text
Your email and display name, the desktop settings this account has synced, your last runs, sign-out and account deletion.
```

**121 characters. Kept verbatim.** **Change:** none. It is answer-first, it lists the page's contents in the
page's own order, and it is the shortest honest form of them.

## `/signin`

### S-023 · `/signin` · `<title>`

**Was:** `Sign in — windowsweep`

```text
Sign in · windowsweep
```

**21 characters.** **Change:** separator only. This route is a `noindex` candidate - it has nothing to rank
for and it is the door to one person's own data - but the robots value belongs to §7.7, so the title is
written for the browser tab and the recommendation is left here rather than acted on.

### S-024 · `/signin` · `<meta name="description">`

**Was:** `Google sign-in on the shared account used by the desktop app. It is not enabled yet, and this page
says so rather than failing when you press it.`

```text
Google sign-in on the shared account used by the desktop app. It is not enabled yet, and this page says so rather than failing when you press it.
```

**145 characters. Kept verbatim.** **Change:** none. It states today's truth, including the part most copy
would hide, and that is the register this whole surface is written in. 🔴 It carries a date-bound fact: when
Google is enabled on the shared Supabase project the second sentence becomes false, so this slot is the one
string on the surface that has to be re-read at that moment rather than at the next release.

## `/admin`

### S-025 · `/admin` · `<title>`

**Was:** `Admin · Inbox — windowsweep`

```text
Admin inbox · windowsweep
```

**25 characters.** **Change:** two separators become one. A `noindex` candidate, same as S-023, same
reasoning, same hand-off.

### S-026 · `/admin` · `<meta name="description">`

**Was:** `Contact requests with a status field. Every status change writes a row to the audit log.`

```text
Contact requests with a status field. Every status change writes a row to the audit log through the same path that performs the change.
```

**135 characters.** **Change:** the page's own sentence about *one path* is folded in, because it is the
mechanism that makes the audit claim credible rather than decorative.

## `/admin/users`

### S-027 · `/admin/users` · `<title>`

**Was:** `Admin · Users — windowsweep`

```text
Admin users · windowsweep
```

**25 characters.** **Change:** separator.

### S-028 · `/admin/users` · `<meta name="description">`

**Was:** `The users list. Roles are seeded out of band, not granted from this interface.`

```text
Everyone with an account, read-mostly. The platform role is seeded out of band for two fixed addresses, so no button here can grant it.
```

**135 characters.** **Change:** *two fixed addresses* is the specific fact the old line gestured at, and the
page's own heading says it. `no button here can grant it` is the refusal that makes the sentence band R in
substance rather than a policy note, and it is also the half a machine needs in order to describe what this
interface can and cannot do to an account.

## `/admin/audit`

### S-029 · `/admin/audit` · `<title>`

**Was:** `Admin · Audit log — windowsweep`

```text
Admin audit log · windowsweep
```

**29 characters.** **Change:** separator.

### S-030 · `/admin/audit` · `<meta name="description">`

**Was:** `Append-only. Nothing in this interface can edit or delete a row, which is the point of it.`

```text
Append-only. Every admin write in order, with its actor and target. There is no edit control and no delete control here, and that absence is the feature.
```

**153 characters.** **Change:** the page makes two claims and the old line carried one. What is added is
what a row actually contains, which is the half a machine needs in order to know what this page holds.

## `/404`

### S-031 · `/404` · `<title>`

**Was:** `Not found — windowsweep`

```text
Not found · windowsweep
```

**23 characters.** **Change:** separator.

### S-032 · `/404` · `<meta name="description">`

**Was:** `That page does not exist on this site.`

```text
That path does not exist on this site. Nothing was deleted. The home page and the sitemap are both one link away.
```

**113 characters.** **Change:** `page` becomes `path`, matching the page's own H1 and the product's own
vocabulary. `Nothing was deleted` is on the page and belongs here: this is a product that deletes things,
and a 404 in that context is a sentence worth being explicit about. The dry aside the page carries after it
- *which is at least consistent* - is deliberately **not** brought across. The row is band P only, and a
joke read cold in a list of search results by someone who has not seen the page is a joke with no setup.

## S-033 · every route · the `og:title` and `og:description` rule

**Was:** on `/`, an `og:title` matching the page title, and a standalone `og:description`:
`Developer-aware Windows cleanup. Dry-run first, one deletion chokepoint, twenty-six numbered sections,
zero network calls from the CLI.` On the other twelve routes, `(new)`.

```text
og:title       = the route's <title>, unchanged
og:description = the route's <meta name="description">, unchanged
```

**Change:** the rule replaces a string. That standalone `og:description` is a third description of the
product on one page - different from the page's own meta description, and different again from the approved
tagline - and three self-descriptions on one URL is the entity-consistency problem the AEO reference names
first. Retiring it costs nothing: everything it said is in S-008 or on the page. This is one line in the
per-route record rather than twenty-six more strings, which is also why it is one slot.

---

# Group C - the JSON-LD, and the text inside it

🔴 **Schema that says more than the page shows is a penalty and a lie in the same act.** Every string in
these three nodes is either the route's own title or description from Group B, or a fact printed on the page
it sits on. Nothing here describes a capability the site does not render.

**What is deliberately absent, and why:**

| Absent | Why |
|---|---|
| `offers` | a pricing claim. The standing exemption is silence about price, in both directions |
| `isAccessibleForFree` | the same claim in one field. It has already had to be removed from two other artefacts in this project |
| `aggregateRating`, `review` | no rating and no review exists. A schema rating with nothing behind it is fabricated |
| `potentialAction` / `SearchAction` | the site has no search endpoint. `/sitemap` has a client-side filter over its own route list, which is not a search a machine can call |
| `screenshot` | the home page's desktop band shows screenshots, but the asset paths belong to §7.7. A URL guessed here would be a broken one |
| `FAQPage` | it belongs on `/`, and its text has to be the visible questions byte for byte, so its content is `site-home`'s approved copy rather than a new authoring job. §7.7 builds it from the same record the page reads |

## S-034 · every route · the `WebSite` node

**Was:** `(new)` - the dummy has no `WebSite` node.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://windowsweep.aoneahsan.com/#website",
  "name": "windowsweep",
  "url": "https://windowsweep.aoneahsan.com/",
  "description": "Where windowsweep is downloaded, and where an account holds what the desktop app has synced.",
  "inLanguage": "en-GB",
  "publisher": { "@id": "https://windowsweep.aoneahsan.com/#author" }
}
```

**Change:** new. The one authored string is `description`, and it is S-002's sentence about what this site
is, shortened - so the site describes itself the same way to a crawler reading `llms.txt` and to one reading
the head. `inLanguage` is `en-GB` because the Bible fixes the spelling and the copy uses it.

## S-035 · `/` · the `SoftwareApplication` node

**Was:**

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "windowsweep",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Windows 10 (1809+), Windows 11",
  "softwareVersion": "1.1.0",
  "url": "https://windowsweep.aoneahsan.com/",
  "downloadUrl": "https://github.com/aoneahsan/windowsweep/releases",
  "license": "https://opensource.org/licenses/MIT",
  "author": { "@type": "Person", "name": "Ahsan Mahmood", "url": "https://aoneahsan.com" }
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://windowsweep.aoneahsan.com/#software",
  "name": "windowsweep",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Windows 10 (1809 and later), Windows 11",
  "softwareVersion": "1.1.0",
  "description": "windowsweep removes regenerable caches on Windows. It names every path before it touches one, and refuses documents, credentials and browser profiles.",
  "url": "https://windowsweep.aoneahsan.com/",
  "downloadUrl": "https://github.com/aoneahsan/windowsweep/releases",
  "license": "https://opensource.org/licenses/MIT",
  "author": { "@id": "https://windowsweep.aoneahsan.com/#author" }
}
```

**Change:** three edits, and one thing held. `description` is added and it is **S-008 verbatim**, so the node
and the meta description are one sentence rather than two that can drift. `Windows 10 (1809+)` becomes
`Windows 10 (1809 and later)`, which is what `/download` prints on the page. The inline author object
becomes a reference to S-036, so the person is described once on the site. **`offers` and
`isAccessibleForFree` stay absent**, as they already are.

🔴 **`softwareVersion` is `1.1.0` today and must not stay a literal.** It is true right now - the footer, the
download page and the release tag all say 1.1.0 - and it stops being true the moment CLI 1.2.0 ships, which
plan v2 puts in W4, before this site deploys in W7. `/download` already reads the release at build time
(§7.5); this field reads the same value from the same place. A build-time value cannot go stale. A literal
in a schema block is a claim nobody re-reads.

## S-036 · site-wide · the author node

**Was:** inline inside the `SoftwareApplication` block -
`"author": { "@type": "Person", "name": "Ahsan Mahmood", "url": "https://aoneahsan.com" }`

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://windowsweep.aoneahsan.com/#author",
  "name": "Ahsan Mahmood",
  "url": "https://aoneahsan.com",
  "sameAs": [
    "https://github.com/aoneahsan",
    "https://linkedin.com/in/aoneahsan"
  ]
}
```

**Change:** promoted out of the `SoftwareApplication` block into its own node with a stable `@id`, so
`WebSite` and `SoftwareApplication` both point at one description of one person. `sameAs` carries the two
profiles that are **read from the repository** - `README.md:501` names both, and `src/lib/links.ts:37`
registers `linkedin.com/in/aoneahsan` as the owner's own profile path. No third profile is added. None was
read.

🔴 **It is `Person`, and row 19 says `Organization`.** That is a `NEEDS DECISION`, recorded verbatim below.
`Person` is written here because it is the only type the visible page supports: the footer shows
`Ahsan Mahmood` linking to a personal site, no organization name appears on any of the thirteen pages, and
the dummy's own JSON-LD already declares `Person`. Declaring an `Organization` would be schema describing
something the page does not show, which is the one rule this group is built around.

---

## Every count, in one table

| Slot | Route | Kind | Chars | Cap | Over? |
|---|---|---|---|---|---|
| S-007 | `/` | title | 57 | 60 | no |
| S-008 | `/` | description | 150 | 155 | no |
| S-009 | `/download` | title | 49 | 60 | no |
| S-010 | `/download` | description | 147 | 155 | no |
| S-011 | `/changelog` | title | 49 | 60 | no |
| S-012 | `/changelog` | description | 138 | 155 | no |
| S-013 | `/privacy` | title | 57 | 60 | no |
| S-014 | `/privacy` | description | 141 | 155 | no |
| S-015 | `/sitemap` | title | 56 | 60 | no |
| S-016 | `/sitemap` | description | 145 | 155 | no |
| S-017 | `/feed` | title | 46 | 60 | no |
| S-018 | `/feed` | description | 149 | 155 | no |
| S-019 | `/contact` | title | 42 | 60 | no |
| S-020 | `/contact` | description | 135 | 155 | no |
| S-021 | `/account` | title | 26 | 60 | no |
| S-022 | `/account` | description | 121 | 155 | no |
| S-023 | `/signin` | title | 21 | 60 | no |
| S-024 | `/signin` | description | 145 | 155 | no |
| S-025 | `/admin` | title | 25 | 60 | no |
| S-026 | `/admin` | description | 135 | 155 | no |
| S-027 | `/admin/users` | title | 25 | 60 | no |
| S-028 | `/admin/users` | description | 135 | 155 | no |
| S-029 | `/admin/audit` | title | 29 | 60 | no |
| S-030 | `/admin/audit` | description | 153 | 155 | no |
| S-031 | `/404` | title | 23 | 60 | no |
| S-032 | `/404` | description | 113 | 155 | no |

**Nothing exceeds its cap.** One description sits within two characters of it - S-030 at 153 - and it is named here so a later
edit knows it has no room. Six titles are short on purpose
(S-021, S-023, S-025, S-027, S-029, S-031): they are browser-tab labels on gated or error routes, and
padding them would invent content the page does not have.

---

## NEEDS DECISION

Three of them. None is a wording preference. Each is a fact this draft could not read, an artefact it would
have had to contradict, or a claim whose blast radius reaches past this surface, so each is left unwritten
with the options and a recommendation rather than resolved quietly in a fence.

**NEEDS DECISION: which URL scheme does the documentation link block in the site's `llms.txt` ship with?
Measured 2026-09-08: `https://windowsweep-docs.aoneahsan.com/` fails the TLS handshake (curl returns HTTP
000) and `http://windowsweep-docs.aoneahsan.com/` returns 200 with no redirect, because GitHub has not yet
issued the certificate (RW-102). Options: (a) ship `https://` now, accepting that every documentation link
an AI crawler follows is dead until RW-102 completes; (b) ship `http://`, which works today and becomes the
wrong scheme the moment the certificate is issued, with nothing in the build that would notice; (c) omit the
Documentation block from the first deploy and add it in RW-102's write-back pass, so the file never carries
a dead link or a downgraded one. Recommendation: (c). `llms.txt` exists to be followed rather than read, a
dead link in it is worse than a missing section, and RW-102 already owns a write-back over that domain.**

The second one is a conflict between two approved artefacts rather than a gap. Both sides are set out. A
type declared in a schema block is the sort of field that is set once and then believed by everything
downstream of it, so guessing it here would be the expensive kind of quiet.

**NEEDS DECISION: is the site's author node a `Person` or an `Organization`? Content-map row 19 and plan v2
§7.7 both say `Organization`, and no organization is named on any of the thirteen pages - the footer shows
"Ahsan Mahmood" linking to `aoneahsan.com`, `package.json` declares an author object with a person's name
and email, and the dummy's existing JSON-LD already declares `"@type": "Person"`. Options: (a) `Person`, as
written at S-036, with row 19's schema field corrected by the keeper in an amendment note - recommended,
because schema must match visible content and nothing visible supports an organization; (b) `Organization`,
which needs a legal or trading name, a logo URL and whatever `sameAs` profiles belong to it, none of which
is in either repository, so it cannot be written without inventing three facts. Recommendation: (a).**

**NEEDS DECISION: does `Licence: MIT` stay in the site's `llms.txt` (S-005)? It is a licence rather than a
price, it is already visible in the site footer as "MIT licence · windowsweep 1.1.0", and it already ships
in the dummy's JSON-LD as `"license": "https://opensource.org/licenses/MIT"` - so removing it from the
machine-facing file alone would make that file less accurate than the page it describes. Against it: an
answer engine reading MIT may state a price the standing exemption says this project never states. Options:
(a) keep it, as written, because a licence is a redistribution fact and the surrounding surfaces already
carry it - recommended; (b) remove it from `llms.txt` and leave it only where it already ships.
Recommendation: (a).**

---

## Findings recorded, not asked

Three things are reported rather than raised as questions, because the evidence answers them.

**`/admin/inbox` does not exist.** Plan v2 §7.5 names it; `pages-registry.js` puts the inbox at `/admin` and
declares public paths frozen. The dummy is the specification, so this draft writes `/admin` and skips
`/admin/inbox`. If the app is later built at `/admin/inbox`, S-025 and S-026 move with it unchanged - only
the route key changes.

**Row 19's schema field is one node short.** It reads `WebSite + Organization`. Plan v2 §7.7 requires
`WebSite` + `SoftwareApplication` (no offers) + `Organization`, and the `SoftwareApplication` block already
ships in the dummy. Group C writes all three. This is a map-accuracy note for the keeper rather than a
conflict, since nothing in the row forbids the node it omits.

**Row 19's `CTA: none` holds.** Nothing in these thirty-six slots asks the reader to do anything. S-006's
`windowsweep --scan` sentence is a fact about how a machine is measured, inside a list of facts, and it is
there because the alternative was leaving `3,924,712,402` in the file with no way for a reader to find their
own number.

---

## Self-check

**Palette.** Band **P only**, as row 19 requires, and it is delivered by construction rather than by
restraint: every string is a fact with a noun or a number in it. Band R is present in substance and never in
style - S-008 *refuses documents, credentials and browser profiles*, S-028 *no button here can grant it*,
S-006's *no flag lifts the refusal* - which is the Bible's definition of R, a specific refusal rather than an
adjective. Band **W is at zero**, and one place proves that was a decision: the `/404` page carries a dry
aside, and S-032 leaves it on the page.

**Rhythm.** Shortest shipping sentence: *Append-only*, one word, opening S-030; *It deletes* at two, opening
a bullet of S-006. Longest: the network sentence in that same bullet, at **28 words**, inside the
fingerprint's stated 4-to-34 range. Nothing shipped runs past it. The descriptions run 113 to 153 characters
and alternate on purpose between one long sentence and two short ones - S-030 opens on one word and closes
on twenty-four; S-008 opens on seven and closes on seventeen.

**Length.** Every title is inside 60 characters and every description inside 155. Nothing is over. The
tightest is named in the counts table, and those twenty-six strings total **374 words**.

🔴 **`llms.txt` is 615 words, and the comparable artefact is 494.** Measured on the fence contents of S-001,
S-002, S-003, S-005 and S-006 with the tokenizer `\b[\w'-]+\b`, URLs included, which is the same measurement
applied to the docs site's shipped `llms.txt` for the comparison. **This is reported rather than claimed as
a pass**: row 19 says *short*, that word has no number behind it, and the only precedent this project has is
the 494-word file row 9 produced. Mine is 24 per cent longer. The reason is that it carries two things the
docs site's does not - the three-programs network split, and the unsigned-installer fact - and its facts
block is 271 of the 615. **If a reviewer rules it long, S-003's page list is what to cut**: eight bullets
whose content is also each route's own description, and the only slot here that repeats something a crawler
can already read elsewhere.

🔴 **A correction rides with this figure, because it was wrong in the first draft of this file.** The
self-check claimed 520 words *and* that the file was shorter than the docs site's 620. Both numbers were
guesses and the comparison had its **sign backwards**. Re-measuring produced 614 against 494 - longer, not
shorter. The line pass then added one word at S-001. That is the 615 above. The same pass caught twelve declared character counts each one low, because the first measuring
run had been made against candidate strings rather than against the fences that shipped. Every number in
this file is now taken from the file itself, and the tokenizer and the inclusion rule are written beside it
so the next reader can reproduce it rather than trust it.

**Unsure spots.** Three, all recorded verbatim above as `NEEDS DECISION`: the documentation link scheme, the
`Person`-versus-`Organization` type, and whether `Licence: MIT` may stay. Nothing else is held. One slot is
date-bound rather than uncertain - S-024 becomes false the day Google sign-in is enabled
on the shared Supabase project, and it is marked in place so the person who enables it finds the sentence.

## The by-hand banned-phrase check

Run over the **fence contents only** - the shipping strings - because the lint hook cannot see them. The
method was mechanical rather than impressionistic: every non-comment line of
`aoneahsan-cccs-story-craft/assets/banned-phrases.txt` was taken in turn and searched for across the
thirty-six fences, case-insensitively and on word boundaries, which is the same match the hook itself uses
so that a by-hand pass and an automated one cannot disagree about what counts as a hit.

**Result**: zero hits. No entry on that list appears in any shipping string.

🔴 **The list's own words are not reproduced in this file, and that is the second finding.** Naming them
here is what makes a clean record fail its own gate: they would sit in the commentary the hook *can* read,
so a report saying *nothing was found* is itself reported as eleven violations. It happened on the first
write of this file. That is the archive trap in miniature - evidence quoted inside the corpus the gate reads
- so the method is written down instead of the words, and the method is repeatable in one command.

**One near-miss, described rather than quoted.** The dummy's `/signin` page uses a listed verb in its
sentence about what signing in does *not* do for the tool itself. That copy belongs to row 18. It is not
carried into S-024, whose fence is the description only.

The fingerprint's own never-list was checked in the same pass, the same way, with the same result, and its
entries are likewise not reproduced. One word needed a ruling. `cleanup` appears in
S-007 and S-009 as a noun compound, which the `tagline` surface already settled: the glossary bans `clean`
and `sweep` as **verbs**, and `cleanup` is the product's own category word, carried by three of its twelve
npm keywords.
