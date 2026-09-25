# team-voice - the windowsweep team, in place of one person

Content-map rows **1** `readme` · **7** `docs-about` · **9** `site-front` · **13** `desktop-cockpit` · **16**
`site-home` · **19** `site-front-site`, plus **10** `cli-strings` and **15** `report-bodies` for the engine lines
added to the packet mid-run (TV-15, TV-16). Palette per row as the map sets it; nothing here widens a row's band.

Status: **publish-ready, finalized 2026-09-25.** Round 2 applied the main session's six rulings; the finalizer applied
the fact-check's one correction, noted under *Finalize*. Opened by `decision-log.md` 2026-09-25, *run opened: `team-voice`*, under
D44-D46; lean panel. GATE 4: row 13 is the owner's own; rows 1, 7, 9, 16 and 19 sit under the standing
pre-authorisation. Rows 10 and 15 are drafted now and **ship with the next CLI release**, never before: the
engine stays byte-identical to v1.3.0 until that cascade (product `CLAUDE.md`, invariant 1). en-GB throughout.

**Why.** The owner's fleet rule of 2026-09-25, verbatim: *"we market as {product} team and not as single
person"*. D45 carries it to every public surface, author metadata included, and keeps the legal and registry
facts. It supersedes the 2026-09-07 answer *"docs-about 'independent software engineer': keep it"*.

---

## Coverage

| Slot | Row | Lands in (dummy first where one exists) | Change |
|---|---|---|---|
| TV-01 | 13 | desktop dummy `page-settings.js:310` → `account.json:33` | reworded |
| TV-02 | 13 | desktop dummy `page-settings.js:312-313` → `account.json:34` | one word |
| TV-03 | 13, 16 | the vendoring drop in `ecosystem.ts`, dummy `page-settings.js`, web `roster.ts`, web dummy `roster.js` | off every rendered roster (D46) |
| TV-04 | 16 | web dummy `index.html:663` → `home.json:293` | reworded |
| TV-05 | 16 | web dummy `index.html:665` → `home.json:295` | one phrase |
| TV-06 | 16 | web dummy `shell.js:61` → `common.json:52` + `nav.ts:89` | replaced |
| TV-07 | 19 | web `public/llms.txt:42` | replaced |
| TV-08 | 19 | web `vite/prerender-html.ts:58-67` + web dummy `index.html:42` | Person → Organization: name and `url` |
| TV-09 + TV-14 | 7 | `windowsweep/docs/author.md` (source) → re-mirrored to `windowsweep-docs/docs/about.md` | **one text**, rewritten |
| TV-10 | 9 | docs `static/llms.txt:30`, `:38` | replaced |
| TV-11 | 9 | docs `docusaurus.config.ts:78`, `:80-90`, `:105-109`, `:131-135`, `:239`, `:252` | replaced / sentence removed |
| TV-12 | 1 | `README.md:72` (TOC), `:504-508` | body only |
| TV-13 | 9 | `windowsweep/docs/README.md:73` → docs `intro.md:75` | replaced |
| TV-15 | 10 | `lib/constants.ps1:11-14` · `modules/runner.ps1:211` · `modules/walkthrough.ps1:16` · `windowsweep.ps1:106` · `modules/release_helpers.ps1:8-11` | **Ships: next CLI release** |
| TV-16 | 15 | `lib/log.ps1:17`, `:109` | **Ships: next CLI release** |
| TV-17 to TV-22 | 9, 19 | found in the sweep; **in scope** by the main session's round 2 ruling (D45) | see *Found in the sweep* |
| TV-23 | none (installer metadata) | `desktop/src-tauri/tauri.conf.json:49` | **answered: kept for `desktop-v1.3.0`** |

## Conventions in this file

- **`Was:`** is the current text, byte-exact, findable with `grep -F`. The fence holds the **shipping words**. Where
  a string goes, the slot says `Change: removed` and has no fence.
- **The entity string.** *The windowsweep team* when it stands alone as a label, a name or a schema `name`; *the
  windowsweep team* inside a sentence; *the team* only where the same sentence, or the heading it sits under,
  names windowsweep. On a product's own roster surfaces the maker is *the same team* (the 2026-09-25 ruling,
  TV-01), which credits a shared maker without claiming the other products. The engine keeps the same rule with
  two constants (TV-15). Never *we*: the fingerprint bans first person plural, and the team voice keeps the ban.
- **Dummy first.** Desktop IRON rule 12 and the site's design rule: the dummy line changes, then the app matches.
- Line numbers are the 2026-09-25 snapshot. Apply by key, anchor or exact string.
- The lint hook strips fences, so every fenced value was checked by hand against the banned list, the
  fingerprint's never-list and its punctuation budget.

---

## Row 13 - desktop Settings (GATE 4: the owner's, before `desktop-v1.3.0` is tagged, D44)

### TV-01 · `settings.promoTitle` · dummy `page-settings.js:310` → `account.json:33`

**Was:** `More from the same developer`

```json
{ "settings.promoTitle": "More from the same team" }
```

Reason: **ruled 2026-09-25 by the main session, from the record: option (a), *the same team*.** Every other product on this roster markets under its own team name, so *the windowsweep team* as their maker would be a claim no surface backs and each linked product contradicts. *The same team* credits the shared maker without claiming them, in the same five words.

### TV-02 · `settings.promoNote` · dummy `page-settings.js:312-313` → `account.json:34`

**Was:** `These are the developer’s own tools, not an advertising network – nothing here is sold, tracked or third-party, and windowsweep never appears in its own list.`

```json
{ "settings.promoNote": "These are the team’s own tools, not an advertising network – nothing here is sold, tracked or third-party, and windowsweep never appears in its own list." }
```

Dummy form, escaped as the file writes it: `'These are the team\u2019s own tools, not an advertising network \u2013 nothing here is sold, ' +`, second line unchanged. *(Corrected in round 2: round 1 printed the two characters where the file has the escapes.)*

Reason: **stands as drafted - my call under the TV-01 ruling.** Directly under *More from the same team*, *the team’s own tools* reads straight back to that shared maker and claims none of the products for windowsweep. *The same team’s* would repeat the heading a line later. Every claim stays.

### TV-03 · the portfolio roster entry · rows 13 and 16

**Was:** `{ id: 'aoneahsan-portfolio', name: 'Meet the Developer', tagline: 'The developer behind these tools.' }` in
`desktop/src/lib/ecosystem.ts:51`. The desktop dummy (`page-settings.js:29`) writes `blurb:` for `tagline:`. The
site copies (`windowsweep-web/src/content/roster.ts:53`, dummy `roster.js:45`) write `line:` and add
`url: 'https://aoneahsan.com'`, `mark: 'M'`.

**Change: removed (D46)** from every rendered roster. No new words.

Already in the working tree, uncommitted, and not this draft's doing: all four files keep the row in their
vendored `ROSTER_SOURCE`, because a vendored copy is never hand-edited, and drop it at the vendoring filter
through an `OFF_ROSTER` set. That also survives a re-vendor. This slot's words agree with it and add nothing.

Reason: D46 verbatim, *"Drop it from product rosters"*. The fleet source (`~/.claude/rules/ecosystem-products.json:166-169`) still carries the entry for every other product (item 6 of *For the main session*).

---

## Row 16 - the site's home and footer

### TV-04 · `home.more.eyebrow` · web dummy `index.html:663` → `home.json:293`

**Was:** `Also by the same developer`

```json
{ "home.more.eyebrow": "Also by the same team" }
```

Reason: the TV-01 ruling, on the site. *The same team* credits the shared maker without claiming the other products. The band's H2, *Other things built here.* (`home.json:294`), names nobody and stays.

### TV-05 · `home.more.lede` · web dummy `index.html:665` → `home.json:295`

**Was:** `Not advertising. These are the developer's own projects, and there is no ad network on this site. That sentence is the promise: adding one would mean deleting it first. Which is the only kind of promise worth writing down.`

```json
{ "home.more.lede": "Not advertising. These are the same team's own projects, and there is no ad network on this site. That sentence is the promise: adding one would mean deleting it first. Which is the only kind of promise worth writing down." }
```

Reason: the TV-01 ruling's wording, with the promise and its logic standing word for word and the straight apostrophe kept as the catalogue writes it.

### TV-06 · `footer.links.author` · web dummy `shell.js:61` → `common.json:52`, href at `nav.ts:89`

**Was:** label `Ahsan Mahmood` → `https://aoneahsan.com`, in the *Elsewhere* column beside GitHub, Report an issue and Contact.

**Replaced, not removed.** Label:

```json
{ "footer.links.author": "The windowsweep team" }
```

Target: `https://windowsweep-docs.aoneahsan.com/about`, the team page (TV-09). The key `author` stays, so `nav.ts`,
the footer's `footer.links.${row.key}` template and the template-key gate need no rename.

Reason: the Organization node (TV-08) is emitted on **every** route beside `WebSite` (`prerender-html.ts:141-161`). The header and the footer both render on every route (`__root.tsx:81`, `:86`), and the footer is the only element carrying the team label, so this label keeps that node describing something each page shows.

---

## Row 19 - the site's machine-facing front

### TV-07 · `public/llms.txt:42`

**Was:** `- Author: Ahsan Mahmood, https://aoneahsan.com`

```text
- Author: The windowsweep team, https://windowsweep-docs.aoneahsan.com/about
```

Reason: same field, same terse shape; the name is TV-06's label and the URL is TV-06's target, so a machine reading either file finds one entity.

### TV-08 · the JSON-LD node · `vite/prerender-html.ts:58-67` + web dummy `index.html:42`

**Was:** `"@type": "Person"`, `"name": "Ahsan Mahmood"`, `"url": "https://aoneahsan.com"`, `sameAs` the personal
GitHub and LinkedIn profiles. `WebSite.publisher` and `SoftwareApplication.author` point at it by `@id`.

```json
{ "@type": "Organization", "name": "The windowsweep team", "url": "https://windowsweep-docs.aoneahsan.com/about" }
```

`description`: **none, deliberately.**

Reason: the name is TV-06's visible label byte for byte, and the `url` (added by the round 2 ruling) is TV-06's target, so both are things every route shows. No page says more about the team than that, so a description would be the one sentence no page shows.

Measured, not assumed: in the built `dist/` of 2026-09-25 the name appears once per route, inside this node
(`dist/index.html:59`). The footer renders client-side, so the node-to-label relationship stays exactly what it
is today (`grep -n "Ahsan Mahmood" dist/index.html`). The Person's personal `url` and `sameAs` leave with the
Person type. The new `url` is the team page, the address both `llms.txt` files and TV-21's footer link carry. The comments at `prerender-html.ts:14-16`, `:47-53` and `:141`
state the opposite of the new node, so they are rewritten with the code.

---

## Row 7 - the team page (TV-09 and TV-14: one text)

**They are one page.** `windowsweep/docs/author.md` is the source and the docs site publishes it as `about.md`
(row 7's own draft, `docs-about.md:3`). So it is drafted once, below. Apply it to `author.md` first (the file
name stays: a rename breaks its GitHub URL and the mirror's mapping), then re-mirror it to `about.md` (the
`/about` URL is frozen) with the front matter on top, per docs-site rule 4.

**The live `about.md` is stale against row 7 today**, and the stale text is not this run's doing. It still
carries the pre-approval biography, stance sentence and support paragraph (S-002, S-006, S-008 *Was* text; the
file has two commits, `e3f86fd` and `83b1e8e`, neither of them `b6bd940`). Re-mirroring this text fixes that too. Row 7's approved S-010,
the desktop pointer, never reached either file; its fact is carried in the new first sentence.

**Was (the lines that change):**

| File:line | Was |
|---|---|
| `about.md:2-4` | `title: 'About the author'` · `description: 'Who built windowsweep, the sibling tools, and how to support the work.'` · `tags: [about, author]` |
| `author.md:1` / `about.md:6` | `# Author` |
| `author.md:3` | `**Ahsan Mahmood** - independent software engineer. He writes small tools that do one thing, ships them under MIT, and then uses them on his own machine until they stop annoying him.` |
| `about.md:8-9` | `**Ahsan Mahmood** - independent software engineer who builds small, sharp developer tools and ships them as open source.` |
| `author.md:5-9` / `about.md:11-15` | the five personal channels: Web `aoneahsan.com`, GitHub `github.com/aoneahsan`, LinkedIn, npm `~aoneahsan`, Email `aoneahsan@gmail.com` |
| `author.md:25` / `about.md:34` | `Last Updated: 2026-09-05` / `Last Updated: 2026-09-03` |

Front matter, docs site only:

```yaml
---
title: 'The windowsweep team'
description: 'Who makes windowsweep, the two sibling tools for Linux and macOS, and how to support the work.'
tags: [about, team]
---
```

The page, both files:

```markdown
# The windowsweep team

The windowsweep team makes the command-line tool and the [desktop app](./desktop.md), which drives the same engine and reimplements none of it. Both programs are open source under the MIT licence.

No guessed paths. A path becomes a target only once it has been seen on a real machine holding only regenerable data, and the ones still waiting are in the [candidate table](./sections.md#candidate-targets-awaiting-verification). Steam's shader cache is one of them, because the build machine has Steam and no games.

- Website: [windowsweep.aoneahsan.com](https://windowsweep.aoneahsan.com)
- Repository: [github.com/aoneahsan/windowsweep](https://github.com/aoneahsan/windowsweep)
- Issues: [github.com/aoneahsan/windowsweep/issues](https://github.com/aoneahsan/windowsweep/issues)
- Contact form: [windowsweep.aoneahsan.com/contact](https://windowsweep.aoneahsan.com/contact) - after signing in, so a reply has somewhere to go
- npm: [npmjs.com/package/windowsweep](https://www.npmjs.com/package/windowsweep)

## The cleanup family

| Platform | Tool | Install |
|---|---|---|
| Linux | [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) | `npx linux-cleanup` |
| macOS | [macleanup](https://github.com/aoneahsan/macleanup) | `npx macleanup` |
| Windows | [windowsweep](https://github.com/aoneahsan/windowsweep) | `npx windowsweep` |

All three share the same stance: name every path before touching it, prune files idle for 100 days by default, refuse to enter personal folders, and ship a real dry-run. None of the three makes a network call unless you ask one to check for an update.

## Supporting the work

If windowsweep reclaimed space for you, the two things that help most are a star on GitHub and a note to a colleague who has the same problem. You can also support the maintenance at [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep).

Last Updated: 2026-09-25
```

Reasons, one per changed part:

- **Title, H1, description, tags:** the page's subject is now the team. The description leads with the question the page answers (round 2 ruling), then names its other two sections in the page's own order.
- **Paragraph 1:** who makes it, first. It carries S-010's approved fact (`docs/desktop.md` and IRON rule 12: the window runs the bundled script and reimplements no cleanup logic) above the family heading, so *None of the three* stays bound to the three CLIs. *Both programs … MIT* is the Terms page's approved wording (`terms.json:32`).
- **Paragraph 2:** the page's one W line, and only a person close to the product knows it. The rule is quoted from `sections.md:261`, *no guessed paths* paraphrases `:262-263`, and the Steam row is `:270` (*"the build machine has Steam but no games"*). 🔴 Kept by the round 2 ruling. It is true while that row stays in the table, so the main session's apply step puts a note beside the row it quotes: `windowsweep/docs/sections.md:270`, mirrored at `windowsweep-docs/docs/sections.md:275`. Whoever ships the Steam target then edits this line in the same release.
- **The list:** the personal channels give way to the team's five, which all exist. The contact item states its limit in the site's own approved reason (`home.json` contact lede; `llms.txt:21`).
- **The family, the support paragraph and its link:** row 7's approved text, unchanged except the stance's last sentence (next item). The support URL is kept exactly.
- **The stance's last sentence, corrected by the fact-check.** Row 7's approved *"None of the three makes a network call."* is false of macleanup, whose opt-in `--check-update` asks the npm registry for a newer version (macleanup `README.md:370-371`, `mac-cleanup.sh:943-953`). The main session ruled the fact-checker's option (a). This corrects row 7's approved text, recorded on 2026-09-13 and live in `author.md:19` since `b6bd940` was pushed on 2026-09-08. The stale `about.md:25-26` makes the same claim in older words (*"and make no network calls"*), so the re-mirror corrects both files. It holds for each tool: linux-cleanup and windowsweep make none, and macleanup makes one only when asked.
- **Last Updated:** the day the change lands. If it lands later, the applier uses that date, so the stamp stays true.

---

## Rows 9 and 1 - the docs front door and the README

### TV-10 · docs `static/llms.txt:30` and `:38`

**Was (:30):** `- [About the author](https://windowsweep-docs.aoneahsan.com/about): who built this, the sibling tools, how to support the work`

```text
- [The windowsweep team](https://windowsweep-docs.aoneahsan.com/about): its channels, the sibling tools, how to support the work
```

**Was (:38):** `- Author: Ahsan Mahmood, https://aoneahsan.com`

```text
- Author: The windowsweep team, https://windowsweep-docs.aoneahsan.com/about
```

Reason: the link takes the page's new title and the gloss names what the page now holds; `:38` is TV-07's line, so both `llms.txt` files name one entity at one URL.

### TV-11 · docs `docusaurus.config.ts` metadata

| Line | Was | Now |
|---|---|---|
| `:239` | `{ name: 'author', content: 'Ahsan Mahmood' }` | content below |
| `:252` | `{ property: 'article:author', content: 'Ahsan Mahmood' }` | content below |
| `:78` | the `WebSite` description ends `… refuses personal folders, credentials and browser state. Author: Ahsan Mahmood.` | **Change: the last sentence removed.** The description ends `… credentials and browser state.` |
| `:80-90`, `:105-109`, `:131-135` | three `Person` nodes, `name: 'Ahsan Mahmood'`; the first adds `email` and three personal `sameAs` profiles | the same `Organization` as TV-08, name and `url` below; no email, no `sameAs`, no founder |

Meta `content` at `:239` and `:252`:

```text
The windowsweep team
```

The three nodes:

```json
{ "@type": "Organization", "name": "The windowsweep team", "url": "https://windowsweep-docs.aoneahsan.com/about" }
```

Reason: one entity string for both meta tags and all three nodes; one address for the nodes, the team page (round 2 ruling). The byline sentence goes because the `publisher` node already states it, and it spends snippet characters on nothing. 🔴 **This depends on TV-21**. Without that footer column only `/about` shows the name, while these nodes sit on every page. The comment at `:142-146` says *no Organization node, deliberately*, so it is rewritten with the code.

### TV-12 · `README.md:72` (TOC) and `:504-508` (the section)

**Was:** `<a id="author"></a>` (`:504`) · `## 👤 Author&nbsp;[#](#author)` (`:505`) · TOC `- [👤 Author](#author)` (`:72`) · body
(`:507-508`) `**Ahsan Mahmood** - [aoneahsan.com](https://aoneahsan.com) · [GitHub](https://github.com/aoneahsan) · [LinkedIn](https://linkedin.com/in/aoneahsan) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)`

```markdown
<a id="author"></a>
## 👤 Author&nbsp;[#](#author)

**The windowsweep team** - [team page](https://windowsweep-docs.aoneahsan.com/about) ·
[contact form](https://windowsweep.aoneahsan.com/contact), after signing in
```

TOC line `:72`, unchanged:

```markdown
- [👤 Author](#author)
```

Reason: anchor, emoji, heading and TOC stay, because row 1 fixes the anchors and the fleet section map fixes `👤 Author`. The body links only the two team channels 🔗 Links lacks (single-home rule), all absolute for npmjs.com, and the License line (`:500`) stays (D45).

### TV-13 · `windowsweep/docs/README.md:73` → docs `intro.md:75`

**Was:** `| **Author** | [Ahsan Mahmood](https://aoneahsan.com) - [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |`

```markdown
| **Author** | [The windowsweep team](./author.md) - [contact form](https://windowsweep.aoneahsan.com/contact), after signing in |
```

On the docs site the link reads `./about.md`, as `intro.md:66` already rewrites it.

Reason: the two columns and the field name stay, matching the README and both `llms.txt` files; the personal site and address give way to the team page and the contact form.

---

## Rows 10 and 15 - the engine (Ships: next CLI release)

🔴 Not before the next CLI cascade: `git diff v1.3.0..HEAD -- lib modules windowsweep.ps1 …` stays empty until
then, and `desktop-v1.3.0` bundles the 1.3.0 engine byte-identical. The desktop picks this up at its first build
after that CLI release (`yarn sync:cli`). Everything below is ASCII.

### TV-15 · the maker lines · row 10 · Ships: next CLI release

Constants, `lib/constants.ps1`:

```powershell
$Script:WS_AUTHOR = 'the windowsweep team'
$Script:WS_TEAM = 'The windowsweep team'
$Script:WS_WEB = 'https://windowsweep.aoneahsan.com'
```

- `:11` **Was:** `$Script:WS_AUTHOR = 'Ahsan Mahmood'`. `:13` **Was:** `$Script:WS_WEB = 'https://aoneahsan.com'`: it is
  repointed from the personal site to the product's own, so every `Web:` line prints a team channel.
- `:12` `WS_EMAIL`: **unchanged.** After this slot it prints only as a contact channel (`crash_trap.ps1:43`,
  `--feedback` at `release_helpers.ps1:266`), never as authorship.
- `:14` `WS_LINKEDIN`: **delete.** No use remains once `Show-Version`'s row and the credits value go (TV-16).
- `WS_TEAM`: **new, beside `:11`.** The standing-alone form, used only by the two `Author:` labels (round 2).

Each printed line, with `<version>` for whatever the release is:

| Where | Was (source) | Now (source) | Prints |
|---|---|---|---|
| `modules/runner.ps1:211`, the end-of-run line | `"$Script:WS_NAME v$(Get-ToolVersion) by $Script:WS_AUTHOR - $Script:WS_REPO"` | unchanged | `windowsweep v<version> by the windowsweep team - https://github.com/aoneahsan/windowsweep` |
| `modules/walkthrough.ps1:16` | `"by $Script:WS_AUTHOR - $Script:WS_WEB"` | unchanged | `by the windowsweep team - https://windowsweep.aoneahsan.com` |
| `windowsweep.ps1:106`, the usage header | `$Script:WS_NAME v$v  by $Script:WS_AUTHOR <$Script:WS_EMAIL>  $Script:WS_WEB` | `$Script:WS_NAME v$v  by $Script:WS_AUTHOR  $Script:WS_WEB` | `windowsweep v<version>  by the windowsweep team  https://windowsweep.aoneahsan.com` |
| `modules/release_helpers.ps1:8`, `--version` | `("  Author:    $Script:WS_AUTHOR")` | `("  Author:    $Script:WS_TEAM")` | `  Author:    The windowsweep team` |
| `release_helpers.ps1:9` | `("  Email:     $Script:WS_EMAIL")` | **Change: removed** | - |
| `release_helpers.ps1:10` | `("  Web:       $Script:WS_WEB")` | unchanged | `  Web:       https://windowsweep.aoneahsan.com` |
| `release_helpers.ps1:11` | `("  LinkedIn:  $Script:WS_LINKEDIN")` | **Change: removed** | - |

Consequence, intended: `release_helpers.ps1:267`, `--feedback`'s `Web:` row, follows `WS_WEB` to the product site,
where the contact form lives.

Reason: `WS_AUTHOR` carries the team into every byline without reshaping them. It is lower-case because it lands mid-line (*by the windowsweep team*), and the email and LinkedIn rows go because they are the maker's, not the team's.

**Label casing, decided in round 2:** a label value stands alone, so both `Author:` fields take *The windowsweep team* through `WS_TEAM`, the form every other surface's Author field shows.

### TV-16 · the log header and the report credits · row 15 · Ships: next CLI release

`lib/log.ps1:17`. **Was:** `"# Author:   $Script:WS_AUTHOR <$Script:WS_EMAIL>"`

```powershell
"# Author:   $Script:WS_TEAM"
```

It prints `# Author:   The windowsweep team`, the label form (TV-15). `:18` is unchanged and prints `# Web:      https://windowsweep.aoneahsan.com`.

`lib/log.ps1:109`. **Was:** `author = [ordered]@{ name = $Script:WS_AUTHOR; email = $Script:WS_EMAIL; website = $Script:WS_WEB; linkedin = $Script:WS_LINKEDIN }`

```powershell
author = [ordered]@{ name = $Script:WS_AUTHOR; email = ''; website = $Script:WS_WEB; linkedin = '' }
```

It writes `"author": { "name": "the windowsweep team", "email": "", "website": "https://windowsweep.aoneahsan.com", "linkedin": "" }`.

Reason: the four keys and their string type stay, so a reader of `schema_version: 1` keeps working. An empty string says *none published*. A null would be new: the field has never carried one. `docs/reports-and-logs.md:31` shows `"..."` for all four, so no doc changes. The name keeps the sentence form, `WS_AUTHOR`, because `reports.ps1:62` prints it after *by*.

Consequences, checked: `modules/reports.ps1:62` (the Markdown footer) and `:127` (the HTML footer) print
`credits.author.name`. A new Markdown report reads *by the windowsweep team*. A new HTML report prints
`by windowsweep v<version> - the windowsweep team`, the name after a dash and still mid-line. Same constant, same
casing rule. A report written earlier keeps the name it recorded, as a record should. The desktop skips every engine line that starts with `#` (`run-tail.ts:100`) and
reads only the totals, so neither change reaches it. The self-test fixture at `self_test_extra.ps1:170` is input
data and passes either way.

---

## Found in the sweep (in scope by the main session's ruling, D45)

A sweep of the tracked source found these: ripgrep, run from inside each of the three repositories and excluding
gitignored output, `docs/story/`, trackers, history records, `CHANGELOG.md` and `LICENSE`. They are the same kind
of string as the packet's slots. **TV-17 to TV-22 are in scope**: the main session's round 2 ruling
took them in under D45, and they ship like the packet's slots. TV-23 is answered from the record.

### TV-17 · row 9 · the docs index row · `windowsweep/docs/README.md:58` → docs `intro.md:66`

**Was:** `| [Author](./author.md) | Who built this, the sibling tools, how to support the work |`

```markdown
| [The windowsweep team](./author.md) | Its channels, the sibling tools, how to support the work |
```

The docs site's link reads `./about.md`. Reason: the index names the page by its new title and describes it in the same words as TV-10's `llms.txt` line, so both front doors agree.

### TV-18 · row 9 · docs `intro.md:68`, *Project status* (row 9's approved S-018; the source README has no such clause)

**Was:** `… and the rows only the author can close |`

```markdown
| [Project status](https://github.com/aoneahsan/windowsweep/blob/main/docs/features/windowsweep-completion/00-tracker.json) | The live status record: every phase and sub-task with its state, the evidence behind it, and the rows only the windowsweep team can close |
```

Reason: the same claim, with the team as its subject.

### TV-19 · row 9 · docs `docusaurus.config.ts:232`, the meta `description`

**Was:** ends `… behind one deletion chokepoint and an idle gate. By Ahsan Mahmood.`

**Change: the last sentence removed**, so it ends `… behind one deletion chokepoint and an idle gate.` Reason: the same call as TV-11's `:78`.

### TV-20 · row 9 · docs `docusaurus.config.ts:245-246`, `twitter:creator` and `twitter:site` = `@aoneahsan`

**Change: removed (both).**

Reason: a personal handle in page metadata. No windowsweep account is on record to take its place; if one exists, its handle fills both.

### TV-21 · row 9 · docs `docusaurus.config.ts:329-337`, the footer column on every docs page

**Was:** `title: 'Built by Ahsan Mahmood'`, items `aoneahsan.com`, `LinkedIn`, `GitHub` (the personal profile), `npm packages` (`~aoneahsan`).

```ts
{
  title: 'The windowsweep team',
  items: [
    { label: 'About the team', to: '/about' },
    { label: 'Contact', href: 'https://windowsweep.aoneahsan.com/contact' },
  ],
},
```

Reason: this is the docs site's TV-06. The footer and the navbar both render on every docs page; the navbar names no maker, so this column is what keeps TV-11's node visible site-wide. *About the team* sits under a heading that names windowsweep, and the *Project* column (`:322-327`) already carries source, npm and issues.

### TV-22 · rows 19 and 9 · the social cards

| Master | Was | Now |
|---|---|---|
| web `public/og/svg/site-card.svg:55` | `MIT · Ahsan Mahmood` | `MIT · The windowsweep team` |
| docs `static/img/social-card.svg:43` | `MIT - Ahsan Mahmood` | `MIT - The windowsweep team` |

Reason: this is the credit every shared link shows. Each card keeps its own separator, the PNGs are re-exported from these masters, and the line grows seven characters leftwards from its right anchor (`x=1110`). By estimate it stays clear of the left-hand URL on the same baseline; the render decides.

### TV-23 · the desktop installer's `publisher` · `desktop/src-tauri/tauri.conf.json:49` = `"Ahsan Mahmood"`

Windows shows it as the Publisher.

**ANSWERED - main session, 2026-09-25, from the record** (round 1 raised it as a question): **kept for
`desktop-v1.3.0`** as an installer registry fact, the class D45 keeps, like npm's `author` field. It changes in a
later desktop release, after an update test from the previous version, and takes the entity string then. **No
words for 1.3.0.**

### Seen, and kept on purpose

| What | Where | Kept because |
|---|---|---|
| Legal operator, licence and copyright | both `LICENSE` files · `README.md:500` · docs footer `copyright` (`docusaurus.config.ts:339`) · `terms.json:8`, `:32`, `:33` · `seo.json:26` · web dummy `terms.html` | D45 and D33 |
| Registry fields | `package.json` `author` in the product and docs repos (`windowsweep-web/package.json` and `desktop/package.json` have none) · `desktop/src-tauri/Cargo.toml:5` | D45 (registry facts) |
| Source comments | `windowsweep.ps1:9` · `bin/windowsweep.js:16` · `docusaurus.config.ts:7` · `terms.tsx:15` | D45. The comments TV-08 and TV-11 make **false** are rewritten with that code |
| Contact channels, not bylines | the security address (`README.md:491`, `SECURITY.md:11`, `CODE_OF_CONDUCT.md:26`, both issue templates) · `crash_trap.ps1:43` · `release_helpers.ps1:266` · `/privacy` and `/terms` questions address | no team address exists to replace them (see *For the main session*) |
| Governance | `CONTRIBUTING.md:23`, the maintainer who pushes to `main` | content map §2; a permission fact |
| Data, not copy | web dummy `demo.js:50`, `g-display.js:235`, `seed.js:44`; the admin-seed migrations | the signed-in admin and the seed rows |
| Internal records | `desktop/design/CLICK-DUMMY-INVENTORY-ledger.md:102`, which names the heading *More from the same developer* | updated with TV-01 |

---

## For the main session (requested changes; this draft may not make them)

1. `content-map.md` row 19's schema cell says `Person (ND-2 … no page names an organisation)`. After TV-06 and TV-08 it
   is `Organization` (*The windowsweep team*, in the footer on every route). Row 7 moves with it. Its label
   `(author)` and its *who built it* become the team's, and one amendment note citing D45 covers both.
2. `story-bible.md` §7: a glossary row for **the windowsweep team**, with this file's entity-string convention in the
   use column, and *the developer, the author, a person's name, we* in the never column. The same row allows **the
   same team** on a product's own roster surfaces (the 2026-09-25 ruling on TV-01, TV-04 and TV-05). It credits a
   shared maker without claiming the other products, each of which markets under its own team name.
3. Product `CLAUDE.md`/`AGENTS.md` IRON rule 8 says *"The author block is name, site, GitHub, LinkedIn and the
   public email"*. It is false once TV-12 lands. `docs/PROJECT-CONTEXT.md:44` records the same rule (*"Author block
   carries name, site, GitHub, LinkedIn and the public email only"*), so it changes with them.
4. The decision log records 2026-09-13 as *"each mirrored to the docs site"* for `b6bd940`. `about.md` was not,
   because its file name differs from the source's. The re-mirror in TV-09 closes that; the record should say so.
5. Every personal-address channel in *Seen, and kept* stays until a team address exists. If the owner wants one,
   it has to be created before any of those lines can change.
6. The fleet roster `~/.claude/rules/ecosystem-products.json:166-169` still lists *Meet the Developer* as a product
   entry. D46 covers every product roster, so each product that vendors it now needs its own `OFF_ROSTER`.
   A fleet-source flag does it once.
7. `lib/constants.ps1:15` `WS_GITHUB`, the personal GitHub profile, is defined and used nowhere. TV-15 should delete
   it on the same ground as `WS_LINKEDIN`, in the same next-CLI-release change.
8. `windowsweep-docs/static/llms.txt:57` still calls the desktop *"released as `desktop-v1.1.0`"* and says *"so
   nothing has left the machine yet"*, both stale since 1.2.0. The fix is outside this run.
9. TV-09's correction changes row 7's recorded text, so the decision log's row 7 record should carry it. Across the
   three repositories' tracked surfaces the family-wide network claim sits only in `windowsweep/docs/author.md:19`
   and the stale `windowsweep-docs/docs/about.md:25-26`; TV-09's apply replaces both. Every other offline claim is
   scoped to windowsweep's own command-line tool and stays true.

## Self-check

Palette: P carries every label, metadata value and engine line (rows 10, 13, 15, 19); R lands in "No guessed paths." and the corrected stance sentence (both TV-09) and in TV-02/TV-05's ad-network refusals, kept verbatim; W appears once, TV-09's Steam line, beside row 16's existing W line, which TV-05 keeps unchanged.
Rhythm: shortest "No guessed paths." (3 words), longest new sentence the candidate rule (29 words); the team page's new prose runs 21 · 9 · 3 · 29 · 16 words, and the corrected stance sentence 17 (was 8).
Length: TV-01 "More from the same team" 5 words (was 5) and TV-02 25 (was 25), within row 13's "a screen"; TV-04 "Also by the same team" 5 (was 5) and TV-05 40 (was 39), within row 16's band; the team page's two new paragraphs total 78 words and its description 94 characters, "short" for row 7, and the stance correction adds 9 words to row 7's approved text; TV-12's body 10 words in row 1's fixed structure; every row 9, 19, 10 and 15 value is one line. All within caps.
Unsure spots: the Steam sentence (TV-09) is kept by ruling and holds while `windowsweep/docs/sections.md:270` keeps its row, which the apply step's reverse note guards; TV-21's "About the team" reads the rule's "heading" as the column title above it; TV-23 is answered from the record (kept for `desktop-v1.3.0`, changed in a later desktop release after an update test), so zero NEEDS DECISION remain open.

## Finalize

The fact-check passed every claim in all 23 slots except one clause, TV-09's stance sentence, which now carries the ruled correction with its reason above. Four claims in this file's own commentary were corrected: the registry row under *Seen, and kept*, TV-06's and TV-21's reasons, and TV-16's report footers. *For the main session* gains four notes: the second half of item 3, and items 7 to 9. The claim that `about.md` has two commits, neither `b6bd940`, was verified and kept. The humanize pass scored the team page on all fourteen rows against `voice-fingerprint.md` (`calibrated: false`) and changed nothing. No other shipping word changed.
