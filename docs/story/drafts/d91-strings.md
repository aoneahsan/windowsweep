# d91-strings - the plan and badge forms' refusals, an empty plan source, the release-notes confirmation, and two corrected lines

Last Updated: 2026-11-06

Content-map rows **24** and **26**, extended with no new row · awareness **administering** (S1 to S5) and **a person who
just asked for release news** (S6 to S8) · structure **one sentence and one action** for row 24 and **the fact -> what to
do next -> the team** for row 26 · tone band **P only** for row 24 and **P, R** for row 26, whose one W belongs to the
welcome · length **microcopy**, and **short** for the email · CTA **the admin action** and **Open the confirmation page**
· schema **none** · gate **GATE 4 pre-authorised under D59 (2026-11-06 D91)**.

S9 is one row 16 (`site-home`) string, corrected in place for ISSUE-002 under the same pre-authorisation. S10 is the
1.4.3 release words (D93), with row 27 covering the two changelogs.

Round 1, 2026-11-06. D91 sends seven slots here that the approved drawings left as NEEDS WORDS: web Amendment 33 for
plan administration, Amendment 35 for the signup and the desktop email gallery, which drew no confirmation email. S8
corrects one approved signup line for double opt-in, and S9 joined mid-round. No owner question is open.

Round 1 revision, 2026-11-06: the developmental editor's five changes are applied to S5, S7, S8 and S9, and S10 joins.

**Framework: what happened, then the way on.** Every admin string here is an error at a field or an empty state, so it
takes the web-app shape from `surface-webapp-ui.md`: what happened and how to fix it, in two sentences at most. The plan
editor's messages are the database's own CHECK constraints put into words, which is why they name characters and
numbers rather than describe the mistake. The email is transactional, so it says what happened, what to do, and who
sent it. Humour is off in every slot.

## Sources

| Source | What it gives these strings |
|---|---|
| `desktop/src/db/schema/plans.ts`, `referrals.ts`, `enums.ts` | every bound in S1, the unique rank, the grant sources behind S5 |
| `docs/CONTRACTS.md` §§5, 8, 15 | the plan resolved on read, Team coverage, `free_plan_required` and `badge_exists` (409) |
| `notices-1.4.0.md` N-009 to N-012 (approved) | the neighbouring keys, `config.outOfRange` and `config.allowed`, the provenance title and lede |
| Web dummy `admin-plans.js`, `admin-config.js`, `admin-users-plan.js`, `admin-kit.js` | where each slot sits, the pre-send key check, the switch-dependent fields, the en-GB bounds |
| Web `design/AMENDMENTS-2.md`, Amendments 33 and 35 (approved, D90) | the slots the drawing left unwritten |
| `emails-1.4.0.md` line 3, the Team invitation, the signup (approved) | layout, sender, sign-off, the "did not expect" line, the signup's words |
| Desktop dummy `emails.html`, `page-emails.js`, `AMENDMENTS-3.md` | the footer shape, how the plain-text part is built, the confirmation email still undrawn |
| Docs `src/lib/newsletter.ts`, `src/components/NewsletterSignup/index.tsx` | the 202 for every address, what "already" means, the constant table |
| The dispatch's FilesHub facts (fileshub-docs.zaions.com/email-marketing) | `{{confirm_url}}`, double opt-in, the link scanner, nothing before confirmation, the unsubscribe |
| `lib/safety.ps1` and `lib/fs.ps1` at `v1.4.2`; web `src/components/home/Chokepoint.tsx` | S9's resolution order, the UNC and drive-root refusals, the list's order |

## Conventions

- **Site keys nest** in `admin.json`, inside `admin`, as N-009 to N-012 do. A message both forms use sits in a new
  `field` group at the top of that object, beside N-009's shared keys, because neither page owns it.
- **`{{min}}` and `{{max}}`** are the bounds, formatted the way `config.allowed` formats them: en-GB grouping, so
  `10,000,000`. **`{{name}}`** is a plan's display name. Never its key.
- **A field message** shows at its field with `role="alert"` and marks the input `aria-invalid`, as the dummy already
  marks a taken key.
- **Signup keys.** The site's go in a `newsletter` namespace with the approved signup words. The docs site has no i18n
  catalogue, so `NewsletterSignup` keeps one constant table, `T`, under the same key names.
- **The email** is a FilesHub stored template whose only variable is `{{confirm_url}}`, so every other word is fixed.

## What the lint hook can see

Every key sits in a fence, and the hook strips fences. S7's email blocks are plain lines, so the hook reads those; the
fenced copy was checked by hand against the banned list and the fingerprint's never-list, as recorded below.

---

## S1 · Plan editor field messages

Admin Plans page, the editor drawer beside N-011. One message per rule: a value that breaks the rule, an empty one
included, gets that rule's words.

<!-- story-lint: allow "underscores" -->

```json
"field": {
  "keyFormat": "Use {{min}} to {{max}} characters: a lowercase letter first, then lowercase letters, digits or underscores.",
  "textLength": "Use {{min}} to {{max}} characters.",
  "wholeNumber": "Use a whole number from {{min}} to {{max}}."
},
"plans": {
  "rankTaken": "{{name}} already has this rank, and no two plans share one. Choose another rank."
}
```

Reused by its own key, not copied: `config.outOfRange`, *"Outside what the database accepts: {{min}} to {{max}}."*

| Field | The database's rule | Empty, or not a whole number | A whole number outside the rule | Also |
|---|---|---|---|---|
| Key (New plan only; read-only once saved) | `^[a-z][a-z0-9_]{1,31}$`, 2 to 32 | `field.keyFormat` 2, 32 | - | already taken: S2 |
| Name | 1 to 40 characters | `field.textLength` 1, 40 | - | - |
| Rank | 0 to 1,000, required, unique | `field.wholeNumber` 0, 1,000 | `config.outOfRange` 0, 1,000 | another plan's rank: `plans.rankTaken` |
| Price a month, in US cents | 0 to 1,000,000; empty is allowed | `field.wholeNumber` 0, 1,000,000, for a fraction | `config.outOfRange` 0, 1,000,000 | - |
| Price a year, in US cents | 0 to 10,000,000; empty is allowed | `field.wholeNumber` 0, 10,000,000, for a fraction | `config.outOfRange` 0, 10,000,000 | - |
| Minimum seats | 1 to 1,000, required while Priced per seat is on | `field.wholeNumber` 1, 1,000 | `config.outOfRange` 1, 1,000 | - |
| Real runs a month on each machine | 0 to 100,000; empty uses the allowance page | `field.wholeNumber` 0, 100,000, for a fraction | `config.outOfRange` 0, 100,000 | - |
| Extra real runs a month, signed in | 0 to 100,000; empty uses the allowance page | as above | as above | - |
| Machines in multi-machine reports | 1 to 1,000 while Multi-machine reports is on | `field.wholeNumber` 1, 1,000, for every refusal | - | 0 included: the column's 0 means the switch is off |
| Badge key (S4's form) | `^[a-z][a-z0-9_]{1,63}$`, 2 to 64 | `field.keyFormat` 2, 64 | - | already taken: S4 |
| Badge name | 1 to 80 characters | `field.textLength` 1, 80 | - | - |

| Element | Note |
|---|---|
| `field` | Shared by the plan editor and the badge form. Empty counts as a value the rule refuses, so no separate "required" message exists: an empty name reads *Use 1 to 40 characters*, an empty rank *Use a whole number from 0 to 1,000* |
| `config.outOfRange` | The approved sibling, called by its key from the plan editor. One rule, one string, so the two pages cannot drift apart |
| Machines | The column accepts 0, and 0 means no report. With the switch on, 0 contradicts the switch rather than breaking a CHECK, so this field never says *Outside what the database accepts* |
| `rankTaken` | Before sending, the editor checks the rank against the rows the page already lists, inactive ones included, as it checks a key for S2. `{{name}}` is the plan holding that rank |
| Bounds | Each is the CHECK constraint's own number, so the form never offers a value the database would refuse |

---

## S2 · A plan key that already exists

Inside `plans`, beside `keyLabel` and `keyHint`, on New plan only.

```json
"keyTaken": "{{name}} already uses this key, so nothing was saved. To change {{name}}, edit it; to add a plan, choose another key."
```

| Element | Note |
|---|---|
| What happened | The save is an upsert by key, so sending would have rewritten `{{name}}`. The editor refuses before sending and marks the key field. *Nothing was saved* answers the one fear an upsert raises |
| The two ways on | Mapped to the two things the admin can have meant: change that plan, or add a new one |
| `{{name}}` | The editor found the plan in order to refuse, so its display name is always to hand. The key itself is not repeated; the admin has just typed it |

---

## S3 · Why Free has no Active switch

Inside `plans`. Free's editor only, standing where `activeLabel` and `activeHint` would be.

```json
"freeAlwaysActive": "Free stays active. Every account with no other plan uses it, so the server refuses to turn it off."
```

| Element | Note |
|---|---|
| Claims | Two, and nothing beyond them: the server refuses to switch Free off (`free_plan_required`), and Free is the plan an account uses when it holds no other |
| *Free* | Named the way `planEndsHint` and `deviceRunsHint` already name it |
| *Turn it off* | `neverDeleted`'s own verb: *Turn Active off instead.* The error code `free_plan_required` stays out of the line |

---

## S4 · A badge key that already exists

Inside `config`, beside `badgeKeyLabel` and `badgeCreate`.

```json
"badgeExists": "A badge already uses this key, so nothing was created. Choose another key for the new badge."
```

| Element | Note |
|---|---|
| When | The server's `badge_exists` (409), shown at the key field in place of the generic `refused` line |
| No name | The refusal names no badge. S2 can name its plan because the editor found it before sending; here the server answered |
| Shape | S2's first clause, so a taken key reads one way on both pages |

---

## S5 · An empty plan-source list

Inside `users`, in the account drawer on the Users page, under `provenanceTitle` (*Where this plan came from*) and
`provenanceLede` (*Every paid period and every grant on this account, newest first.*).

```json
"provenanceEmpty": "No paid period or grant is recorded on this account.",
"provenanceEmptyTeam": "This account is a Team member. The Team owner’s plan covers it and is recorded on the owner’s account."
```

| Element | Note |
|---|---|
| `provenanceEmpty` | Every empty list. The lede's own two nouns: a referral reward is a grant (`grant_source` is `admin` or `referral`), so nothing the list can hold is left out |
| `provenanceEmptyTeam` | Shown after it only when `users.view` returns the plan with `source` set to `team`, so no other account sees it. With an empty list that source has one meaning: a member has Team through the team's entitlement, which the owner's payment or grant carries. Neither line says *uses Free* |
| The drawn state | The dummy hides the section while it is empty and waits for these words. With them, the title and lede stay and the one or two lines take the list's place |
| For the dummy | `derive.planAt` resolves only paid periods and grants, so the dummy has no Team member to show the second line on. Drawing it needs a seeded member whose plan comes from a team, the case Amendment 33 lists as unwritten |

---

## S6 · An invalid newsletter address

The site, in the `newsletter` namespace beside the approved signup keys:

```json
"invalidEmail": "Enter a complete email address, such as name@example.com."
```

The docs site, in `NewsletterSignup`'s constant table:

```ts
invalidEmail: 'Enter a complete email address, such as name@example.com.',
```

| Element | Note |
|---|---|
| When | At the Email address field, `role="alert"`, when the typed text is not a complete address, an empty field included. FilesHub answers every signup with the same 202, so this and the approved send-failure line are the only refusals the form can show |
| Shape | `releases.versionInvalid`'s: the instruction, then an example (*Write the version as three numbers, such as 1.4.0.*) |
| The example | `example.com` is reserved for documentation (RFC 2606), so the address belongs to nobody |

---

## S7 · The newsletter confirmation email - `windowsweep-release-confirm`

**Production note:** FilesHub sends this as the list's double opt-in `confirmation_template`. Its only variable is
`{{confirm_url}}`, so there is no name, no date and no sign of which form was used. The footer carries no unsubscribe
link, because the address is not on the list yet.

**Trigger:** the list's double opt-in, after a signup on the website's changelog or in the docs footer. **Audience:** the
address typed into the signup. **Subject:** Confirm this address for windowsweep. **Preheader:** No release email
reaches this address until you do.

**Eyebrow:** Release notes signup

**Heading:** Confirm this address.

This address was entered in the windowsweep release notes signup. It joins the list only after you confirm it on the page
linked below.

**Facts card**

| Label | Value |
|---|---|
| Release notes | One email when a windowsweep release is ready |
| Leaving the list | In one click, from any release email |

**Button:** Open the confirmation page → `{{confirm_url}}`

If you did not ask for release emails, leave this message alone. The address stays off the list until someone confirms it
on that page. A mail filter that opens links cannot do that.

The windowsweep team

**Footer reason:** You received this because this address was entered in the release notes signup, on
[windowsweep.aoneahsan.com/changelog](https://windowsweep.aoneahsan.com/changelog) or in the footer of
[windowsweep-docs.aoneahsan.com](https://windowsweep-docs.aoneahsan.com). Use the
[site contact form](https://windowsweep.aoneahsan.com/contact) for help.

**Plain-text part**, in the reading order `page-emails.js` builds from the drawn markup:

```text
windowsweep

Release notes signup

Confirm this address.

This address was entered in the windowsweep release notes signup. It joins the list only after you confirm it on the page linked below.

Release notes: One email when a windowsweep release is ready
Leaving the list: In one click, from any release email

Open the confirmation page: {{confirm_url}}

If you did not ask for release emails, leave this message alone. The address stays off the list until someone confirms it on that page. A mail filter that opens links cannot do that.

The windowsweep team

--
You received this because this address was entered in the release notes signup, on https://windowsweep.aoneahsan.com/changelog or in the footer of https://windowsweep-docs.aoneahsan.com. Use the site contact form (https://windowsweep.aoneahsan.com/contact) for help.
windowsweep · https://windowsweep.aoneahsan.com
```

| Element | Note |
|---|---|
| Subject, preheader | The one action, then what waits on it. *Until you do* continues the subject instead of repeating it. The subject names the address, as the heading does, and not *your* emails: in an inbox it may reach a person who never asked |
| Heading | Neutral for both readers: the person who signed up, and the one whose address someone else typed |
| Intro | The event first, then the condition, as the Team invitation opens on who invited the address. The reader whose address someone else typed learns why before the footer |
| *The page linked below* | True of the button and of the text part's URL line, so both parts carry the same words. Nothing says what the page looks like or what it says |
| Facts card | The approved signup's own promise, then the unsubscribe every release email carries, in the release email's own words (*in one click*) |
| *Open the confirmation page* | Says where the button goes. The person confirms on that page, so the label never claims the click confirms |
| *Leave this message alone* | The Team invitation's shape: the instruction, then the condition, then the refusal, one band each (P, P, R). A mail filter that opens every link is the worry a cautious reader has here, and FilesHub's overview page answers it: *"a link scanner cannot confirm for the person"* (fileshub-docs.zaions.com/email-marketing/overview) |
| Left out | How long the link lasts, any limit count, any first name |

---

## S8 · The after-signup line, for double opt-in

The site (`newsletter`) and the docs table (`T`) carry the same words.

```json
"done": "Open the confirmation email in your inbox and confirm this address on the page it links to. Release emails start only after that, and you can leave the list from any of them.",
"already": "If this address is on the list, the next release email will arrive there. If it is not confirmed yet, open the confirmation email in your inbox."
```

**Was** `done`: *"Check your inbox for release notes. You can leave the list from any email."* **Was** `already`: *"If this
address is on the list, the next release email will arrive there."*

| Element | Note |
|---|---|
| First sentence | Names the confirmation email and where the confirming happens: on the page it links to, as the email itself says, never in the inbox. The old one sent the reader to look for release notes, and the confirmation email now arrives first |
| Second sentence | What waits on it, then the approved leaving clause, one word narrower. *Any email* would take in the confirmation email, which has no unsubscribe link and arrives before the address is on the list; *any of them* points back to the release emails |
| `already`, first sentence | Kept word for word, because it is still true. Under double opt-in *on the list* means confirmed, a confirmed address gets the next release email, and the *if* still never confirms membership |
| `already`, added sentence | The unconfirmed case's one action. The form re-submits the address before it chooses this state. A fresh confirmation is inferred, not documented: FilesHub caps confirmation emails per address a day, and its docs do not state a re-send. The line therefore points at the confirmation email already in the inbox and never says a new one is on its way |

---

## S9 · The chokepoint band's first refusal (row 16, ISSUE-002)

The site's `home.json`, inside `home.chokepoint`, first of the six items under *"These helpers apply six ordered
refusals."*

```json
"traversal": "<b>Traversal.</b> UNC paths and drive roots are refused outright. A <mono>..</mono> segment is not refused as text: each path is resolved to its full form first, and the resolved path must pass every refusal that follows, Containment included."
```

**Was:** *"<b>Traversal.</b> Paths with <mono>..</mono> segments, UNC paths and drive roots are refused outright."*

| Element | Note |
|---|---|
| What was false | Both helpers run `Get-FullPath` before `Get-ProtectionReason`, so a `..` segment is resolved, never refused as text |
| First sentence | The approved line's true half, word for word. The refusal this item owns comes first, because row 16 states the guarantees as refusals and the lede promises six of them. Both run on the resolved path |
| Second sentence | Then the mechanism. The resolved path meets the five refusals after this one, and Containment refuses a path that climbs out of its section's root |
| Six | The item still refuses something, so the lede's count stays true. The label stays as well: traversal is what a reader checks this list for, and the line now answers it |
| Left out | The raw `..` check for a path that reaches it unresolved, as asked. Neither helper sends one |

---

## S10 · The release words for windowsweep 1.4.3 (D93)

Row 27 covers the changelogs. Each piece takes the shape of its 1.4.2 neighbour, and every fact comes from
windowsweep `30b5466` (the bar and the hint) and `0b03d92` (the numerals). There is no desktop app or CLI change after
`desktop-v1.4.2` besides these two. The background update and install-on-close stay out of every piece: 1.4.2's notes carry them, and
1.4.3 is only their first real use, which nobody has proven yet.

### (a) The desktop release notes, the GitHub release body for `desktop-v1.4.3`

```markdown
# windowsweep desktop 1.4.3

One bar at the bottom right replaces the full-screen first-run notice, and the window stays usable under it. The one-time Tour this page hint waits until that bar has closed, so two notes never stack. The walkthrough's step numbers now sit in the centre of their circles.

That bar holds the Privacy Policy and Terms of Service sentence, the usage-data line and **Okay**; the policy links open in your browser. The usage line ends "Never a file path, never the contents of anything." It closes by itself after 10 seconds. Hover or keyboard focus holds it. **Okay** or Escape closes it. A machine that has shown it never shows it again, and a signed-in account that saw it on one machine is not shown it on another. It never appears on the start screen, on the Run, Choose and Admin screens, or beside an update notice or block.

While an update notice or block is on screen, the **Tour this page** hint also waits.

The installers are signed for the app's updater but are not Windows code signed, so SmartScreen may show a warning. The `SHA256SUMS` asset lists hashes for both installers, `latest.json` and the stable `windowsweep-setup.exe` download.
```

### (b) The CLI release notes for `v1.4.3`

```markdown
# windowsweep CLI 1.4.3

The command-line tool is unchanged. The 30 sections, their targets and their safety checks are the same as in 1.4.2. It moves to 1.4.3 so the CLI and the desktop app stay on one version; the desktop changes are in the `desktop-v1.4.3` release.

Run `npx windowsweep@1.4.3 --list` to see the sections. Start with `--dry-run` to review candidates before selecting anything.
```

### (c) The root `CHANGELOG.md` entry, under `## [Unreleased]`

```markdown
## [1.4.3] - 2026-11-06

### Changed

- **One bar replaces the full-screen first-run notice.** In the desktop app it sits at the bottom right and holds the
  Privacy Policy and Terms of Service sentence, the usage-data line and **Okay**; the policy links open in the
  browser. The usage line ends "Never a file path, never the contents of anything." The window stays usable under
  the bar, which closes by itself after 10 seconds; hover or keyboard focus holds it. **Okay** or Escape closes
  it. A machine that has shown it never shows it again, and a signed-in account that saw it on one machine is not
  shown it on another. It never appears on the start screen, on the Run, Choose and Admin screens, or beside an update
  notice or block.
- **The tour hint waits for the bar.** The one-time **Tour this page** hint now waits until that bar has closed, and
  while an update notice or block is on screen, so two notes never stack.

### Fixed

- **Walkthrough step numbers are centred.** In **Walk through windowsweep**, the step numbers sit in the centre of
  their circles; in 1.4.2 each sat 14 px left of centre.
- The command-line tool is unchanged in this release. It moves to 1.4.3 so the CLI and the desktop app stay on one
  version.
```

### (d) The docs site's `docs/changelog.md` entry

The same entry as (c), word for word, in the same place under `## [Unreleased]`. The two 1.4.2 entries are identical
too, and both files open with the same header.

### (e) The website's `changelog.json`, inside `changelog.entry`

```json
"v143": {
  "changed": {
    "i1": "One bar at the bottom right of the desktop window replaces the full-screen first-run notice, and the window stays usable under it. The bar closes by itself after 10 seconds and shows once per machine and once per account.",
    "i2": "The one-time Tour this page hint waits until that bar has closed, and while an update notice or block is on screen, so two notes never stack."
  },
  "fixed": {
    "i1": "In the walkthrough, the step numbers sit in the centre of their circles; in 1.4.2 each sat 14 px left of centre.",
    "i2": "The command-line tool is unchanged. It moves to 1.4.3 so the CLI and the desktop app stay on one version."
  }
}
```

### (f) The README's "Latest release:" sentence

```markdown
Latest release: **`1.4.3`** - the desktop app replaces its full-screen first-run notice with one bar at the bottom
right, and the window stays usable under it. The 1.4 scanner searches Downloads and folders you add for large or old
files; you choose individual files for the Recycle Bin. The uninstall and leftover-folder sections require explicit
selection.
```

### (g) One summary in three places: the `latest.json` `notes`, the feed's newest item, and (a)'s first paragraph

SA-WINDOWSWEEP-012 asks for the same words in all three, so this text is written once, with no markup:

```text
One bar at the bottom right replaces the full-screen first-run notice, and the window stays usable under it. The one-time Tour this page hint waits until that bar has closed, so two notes never stack. The walkthrough's step numbers now sit in the centre of their circles.
```

The feed carries it in the site's `pages.json`, inside `feed.items`, beside its CLI pair:

```json
"desktop143": {
  "title": "Desktop app 1.4.3",
  "body": "One bar at the bottom right replaces the full-screen first-run notice, and the window stays usable under it. The one-time Tour this page hint waits until that bar has closed, so two notes never stack. The walkthrough's step numbers now sit in the centre of their circles."
},
"cli143": {
  "title": "windowsweep 1.4.3",
  "body": "The command-line tool is unchanged. It moves to 1.4.3 so the CLI and the desktop app stay on one version."
}
```

| Element | Note |
|---|---|
| Which key carries it | No key of the (e) entry: the 1.4.2 entry in `changelog.json` has no summary key and feeds nothing. `vite.config.ts` writes `feed.xml` from `src/content/feed.json` plus the `feed.items.<id>` words in `pages.json`, and the 1.4.2 summary sits in `feed.items.desktop142.body`. So the summary goes in `feed.items.desktop143.body` |
| The registry rows | `feed.json` gains `desktop143` (date `2026-11-06`, link `/download`, `downloadIt`) and `cli143` (link `/changelog`, `readEntry`), in 1.4.2's order. That is structure, not words |
| 1.4.2, for comparison | The search-audit report records the three as matching. Byte for byte they still differ: `latest.json` adds a release-notice sentence, the feed drops it, and the release body opens on the tours alone. One text for 1.4.3 makes them identical |
| No markup | `latest.json` and the feed take none, so (a)'s first paragraph carries none either. Its bold names start in the second paragraph |
| `cli143` | cli142's words with the version moved, matching (b) and the `fixed.i2` item in (e) |

| Element | Note |
|---|---|
| The bar's words | Named, never reproduced: the Privacy Policy and Terms of Service sentence and the usage-data line. Only the usage line's refusal is quoted, in (a), (c) and (d), as band R. The legal sentence stays unquoted, so a note never reads as asserting the agreement and *our* stays out of a voice with no *we* |
| One unit per change | As 1.4.2 has it. The bar's unit carries what it holds, how it closes and where it never appears; the once-per-machine rule is said once, by its cross-machine detail |
| *Machine* | The Bible's sync noun (§7): *PC* belongs only inside the account-deletion band, and the app's approved strings keep to that. The code's comments say *PC*; the reader-facing pieces say *machine* |
| (g) | Plain text with no markup, three sentences, one per change, as the 1.4.2 field has. The hint's wait beside an update notice is left to the longer pieces; the sentence stays true without it |
| Groups | Changed for the bar and the hint, Fixed for the numerals. The CLI line sits under Fixed because 1.4.2 put it there |
| *Admin* | The name a reader can find: the rail item `nav.elevation` reads *Admin*, beside *Run* and *Choose*, and the screen's title is a sentence, not a name. The keeper records *Admin* as the public name |
| (a), the hint and the numerals | The hint's update-notice case has one place, its own short paragraph. The numerals paragraph is gone: the summary states the fix, and (c) carries the 14 px |
| (a), last paragraph | 1.4.2's, word for word. It names no version, so nothing in it changes |
| (e), the registry | `src/content/changelog.ts` gains `v143`: version `1.4.3`, date `2026-11-06`, two `changed` items and two `fixed`. That is structure, not words |
| (f) | The version and one clause on what changed, then the standing 1.4 scanner sentences, untouched |

---

## NEEDS DECISION

None is open. Every slot traces to a source below, and no fact had to be guessed.

Round 1 raised one observation, about the `already` state reaching an address nobody confirmed. The main session
answered it from evidence: the form re-submits the address before it picks that state, and FilesHub sends at most three
confirmation emails per address a day. S8's added sentence carries the answer, and it promises no new email.

## Before publishing

- S7: draw the confirmation email in `emails.html` first, as D90's approval note requires.
- S7: then send it in the D88 `[TEST]` to the automation inbox.

## Every fact, with its source

| Fact | Source |
|---|---|
| Plan key `^[a-z][a-z0-9_]{1,31}$`, so 2 to 32 characters with a lowercase letter first | `desktop/src/db/schema/plans.ts:72` (`plans_id_format`) |
| Plan name 1 to 40 characters | `plans.ts:73` |
| Rank 0 to 1,000, and no two plans share one | `plans.ts:75`, `:86-88` (`plans_rank_unique`) |
| Prices 0 to 1,000,000 and 0 to 10,000,000 cents | `plans.ts:76-79` |
| Minimum seats 1 to 1,000 | `plans.ts:80` |
| Run limits 0 to 100,000; empty means the allowance page's number | `plans.ts:44`, `:81-84`; N-011 `deviceHint` |
| Report machines 0 to 1,000, where 0 means no report; 1 to 1,000 while the switch is on | `plans.ts:45-46`, `:85`; dummy `admin-plans.js` (`machines`, `refresh()`) |
| Every number is a whole number; switch-dependent fields required only while shown | integer and smallint columns, `plans.ts:54-63`; dummy `admin-plans.js` `refresh()` |
| Badge key 2 to 64 in the same pattern, badge name 1 to 80 | `desktop/src/db/schema/referrals.ts:96-97` |
| *Outside what the database accepts*, and bounds printed from the database | notices-1.4.0 N-012 `outOfRange`, `allowed` (approved) |
| Bounds formatted with en-GB grouping | dummy `admin-config.js:53`, `admin-kit.js:63` |
| The save is an upsert by key; the editor refuses before sending and marks the field | the dispatch, S2; dummy `admin-plans.js` submit handler |
| The plan list includes inactive rows | dummy `admin-plans.js` header (`admin_plans_list, inactive rows included`) |
| The server refuses to switch Free off | `docs/CONTRACTS.md` §15 (`free_plan_required`, 409); web Amendment 33, item 2 |
| Free is the plan an account uses when it holds no other | the dispatch, S3; `CONTRACTS.md` §5 (`source: 'free'`, the plan resolved on read) |
| A taken badge key is refused | `CONTRACTS.md` §15 (`badge_exists`, 409) |
| The list holds this account's paid periods and its admin and referral grants | N-010 `source*` keys; `enums.ts:20` (`grant_source`) |
| A Team member is covered through the Team owner's plan, recorded on the owner's account | the dispatch, S5; `CONTRACTS.md` §8 (a Team purchase or grant creates the team; members have Team while its entitlement is active) |
| The drawer knows a Team member: `users.view` returns the plan in the `my_plan` shape, whose `source` can be `team` | `CONTRACTS.md:361` (`users.view`), `:164` (`source`) |
| The dummy resolves a plan from paid periods and grants only | web dummy `db.js` `derive.planAt` |
| FilesHub answers every signup with 202; *already* means this browser sent the address | the dispatch, S6; docs `src/lib/newsletter.ts` header and `wasSent` |
| `{{confirm_url}}` is required, and this template uses it alone | FilesHub docs (fileshub-docs.zaions.com/email-marketing): `{{confirm_url}}` is required, and `{{first_name}}` and `{{list_name}}` are optional placeholders. This template uses neither by design: the form collects no name (windowsweep-docs `src/lib/newsletter.ts` sends only the address), and the copy names the list in fixed words, so `{{list_name}}` is not needed either |
| The person joins only after confirming on FilesHub's page, and a link scanner cannot confirm | the dispatch, S7; https://fileshub-docs.zaions.com/email-marketing/overview: *"Double opt-in: A public sign-up form confirms by email first; a link scanner cannot confirm for the person."* |
| Nothing else is sent before confirmation; no release email arrives until then | the dispatch, S7 and S8 |
| A repeat signup re-submits the address before the `already` state is chosen | docs `src/components/NewsletterSignup/index.tsx:83-90` (`subscribe()` at 84, `setState(known ? 'already' : 'done')` at 90) |
| FilesHub sends at most three confirmation emails per address per day. A fresh confirmation on a repeat signup is inferred from that cap: the docs do not state a re-send | fileshub-docs.zaions.com/email-marketing/api, "Public subscribe (browser)" |
| Every release email carries a one-click unsubscribe | the dispatch, S7; legal-payments P-06 `newsletter`; the release email's footer, *Unsubscribe in one click* |
| The list is windowsweep's release notes; the signup is on `/changelog` and in the docs footer | the dispatch, S7; web Amendment 35 |
| *One email when a windowsweep release is ready* | emails-1.4.0, the signup paragraph (approved) |
| Sender windowsweep, the sign-off, the footer with the site contact form | emails-1.4.0 line 3; desktop `emails.html` footers |
| The plain-text part's order and its `Label: value` and `Label: URL` lines | desktop dummy `page-emails.js` `plain()` |
| `Remove-PathSafe` resolves with `Get-FullPath`, then runs `Get-ProtectionReason`, then containment | `lib/safety.ps1:243-249` at `v1.4.2` |
| `Send-ToRecycleBin` does the same | `lib/safety.ps1:462-467` at `v1.4.2` |
| `Get-FullPath` resolves `.` and `..` | `lib/fs.ps1:12-20` at `v1.4.2` |
| UNC paths and drive roots are refused after resolution | `lib/safety.ps1:136-137` at `v1.4.2` (`UNC path`, `drive root`) |
| Containment: strictly inside the declared root, never the root itself | `lib/safety.ps1:248-249`, `:465-467`; `home.chokepoint.containment` (approved) |
| The band's six items, in this order, as an ordered list | web `Chokepoint.tsx:16` (`STEPS`); `home.chokepoint.lede` |
| `lib/safety.ps1` and `lib/fs.ps1` are unchanged since `v1.4.2` | `git diff v1.4.2 HEAD` on both files, empty |
| 1.4.3: the full-screen first-run notice is gone | windowsweep `30b5466` (`desktop/src/screens/Consent.tsx` deleted) |
| One bar at the bottom right, with N-001's sentence, its analytics line and *Okay* | `30b5466`: `shell.json` `legal.sentence`, `legal.analytics`, `legal.okay`; `13-legal-bar.css` (bottom, inline end) |
| Both policy links open in the browser; the window stays usable under the bar | `30b5466`: `LegalBar.tsx` (`openExternal`, `/privacy` and `/terms` on the website; `role="status"`, no focus taken) |
| It closes after 10 seconds; hover or keyboard focus holds it; *Okay* or Escape closes it | `30b5466`: `LegalBar.tsx:10-11`, `:25` (`NOTICE_MS = 10_000`) |
| Once per machine and once per account: a machine that showed it never shows it again, and a signed-in account that saw it on one machine is not shown it on another | `30b5466`: `LegalNotice.tsx` header, in the code's own words *this PC has seen it* and *teaches this PC when it saw the bar elsewhere*; the noun follows Bible §7, the *machine* row |
| Never on the start screen or the Run, Choose and Admin screens, never beside an update notice or block | `30b5466`: `consent.ts` `TASK_ROUTES` (`/splash`, `/run`, `/picker`, `/elevation`); `LegalNotice.tsx` header; `shell.json` `nav.run` *Run*, `nav.picker` *Choose*, `nav.elevation` *Admin* |
| *Admin* is the name a reader can find for the elevation screen; its title is a sentence | `shell.json` `nav.elevation`; `sections.json` `elevation.title_one`, `title_other`; the main session's answer |
| The one-time *Tour this page* hint waits for the bar, and while an update notice or block is on screen | `30b5466`: `TourControl.tsx:49-51` (`holdsTourHint(...) \|\| s.release`); `consent.ts:136-143` |
| The walkthrough's step numbers sit in the centre of their circles; in 1.4.2 each sat 14 px left of centre | the body of windowsweep commit `0b03d92`: *"The step buttons were blocks with start-aligned text, so every numeral sat 14 px left of centre in the installed 1.4.2 walkthrough at 1440 and 760."*; `walkthrough.css` (`place-items: center`) |
| The CLI's 30 sections, their targets and their safety checks are as in 1.4.2; only the version lines differ | `git diff --stat v1.4.2 -- lib modules windowsweep.ps1 bin`, on the working tree with the 1.4.3 bump, shows only `lib/constants.ps1`, its `WS_VERSION_FALLBACK` line from `'1.4.2'` to `'1.4.3'`; the root `package.json` differs only in its version line; `docs/sections.md` (0-29) |
| No desktop app or CLI change after `desktop-v1.4.2` besides these two | `git log desktop-v1.4.2..HEAD -- desktop/src desktop/src-tauri lib modules windowsweep.ps1 bin` lists only `30b5466` and `0b03d92`; the later `7f72831` is the server email functions (D92), outside the app and the CLI |
| The SmartScreen and `SHA256SUMS` paragraph | `release-kit-1.4.2/desktop-release-notes.md`, its last paragraph |
| *Walk through windowsweep*, *Tour this page* | `release-kit-1.4.2/desktop-release-notes.md`; `CHANGELOG.md` 1.4.2 |
| The site's changelog entries carry a registry row per version | web `src/content/changelog.ts` (`RELEASES`, `v142`) |
| The `latest.json` notes, the feed's newest item and the release body's first paragraph must carry the same words | `D:\work\my-work\temp\code-folder-root\production-projects\search-audit-owner-handoff\reports-for-dot-agent\projects\windowsweep\2026-10-30-2224-search-audit-report.md`, section "SA-WINDOWSWEEP-012 — `latest.json` notes empty — live-verified": *"notes text = the site feed's item-1 description and matches the release body's first paragraph."* |
| The feed's words live in `pages.json` under `feed.items.<id>`, and `feed.xml` is written from `feed.json` plus those words | web `vite.config.ts:95-96`, `:155`; `src/content/feed.json` (`_comment`, the `desktop142` and `cli142` rows); `pages.json:89-96` |
| The 1.4.2 notes field, plain text: *Each main screen has Tour this page, ...* | `release-kit-1.4.2/work/latest.json` (`notes`) |
| The three 1.4.2 texts differ byte for byte, though the report records them as matching | that file (its `notes`, 240 bytes, the size the report measured live); `pages.json` `feed.items.desktop142.body`, unchanged since web `9ca2cbd`; `release-kit-1.4.2/desktop-release-notes.md`, first paragraph |

## Banned words and tells

The fenced copy was read against the banned list and the fingerprint's never-list with the hook's own matching rule.
One word stays on purpose: *underscores*, in `field.keyFormat`, which names the `_` character the key rule allows and
not the verb the list bans; no other word says it as plainly, and the allow marker sits above S1's fence. The email's
unsubscribe fact avoids the never-list's *one-click* by borrowing the release email's own *in one click*. No exclamation
marks. No em dashes, no *we*, no *our*, no *sorry*, no *please*: the server and the tool act in the third person, and
the reader decides in the second. S10 names the legal sentence instead of quoting it, which is what keeps *our* out.

## Measured lengths

| String | Characters | Limit or neighbour |
|---|---|---|
| `field.keyFormat`, 2 to 32 or 2 to 64 | 96 | the longest field message; one rule, spelled out |
| `field.textLength`, 1 to 80 | 23 | |
| `field.wholeNumber`, 0 to 10,000,000 | 40 | |
| `config.outOfRange`, 0 to 10,000,000 | 51 | approved |
| `plans.rankTaken`, with *Team* | 76 | |
| `plans.keyTaken`, with *Team* | 109 | two sentences |
| `plans.freeAlwaysActive` | 98 | |
| `config.badgeExists` | 92 | |
| `users.provenanceEmpty` · `provenanceEmptyTeam` | 52 · 102 | `provenanceLede` above them is 64 |
| `newsletter.invalidEmail` | 57 | |
| S7 subject · preheader | 37 · 51 | 45 · 90 |
| S7, eyebrow to sign-off | 91 words | the seven approved siblings run 49 to 101; the Team invitation is 71 |
| `newsletter.done` | 174 | the line it replaces, 74; the extra words say where the confirming happens |
| `newsletter.already` | 144 | the approved first sentence alone, 73 |
| `home.chokepoint.traversal`, visible text | 223 | the band's other five items run 92 to 252 |
| S10 (a) desktop release notes · (b) CLI release notes | 202 · 64 words | 1.4.2's run 175 · 67; (a)'s extra words are the summary paragraph SA-WINDOWSWEEP-012 requires |
| S10 (c) and (d) the changelog entry | 222 words | 1.4.2's is 217 |
| S10 (e) `v143` items | 105 to 221 | `v142`'s run 105 to 204; `changed.i1` grew by 5 when *machine* replaced *PC* |
| S10 (f) the README's first sentence | 26 words | 1.4.2's is 23; the two standing sentences unchanged |
| S10 (g) the one summary, in all three places | 271 characters, 47 words | the 1.4.2 `latest.json` notes, 240 |

## Self-check

- **Palette.** P carries every string. R lands where row 26 allows it: the email's preheader, its mail-filter sentence
  and S8's *you can leave the list from any of them*. S9 opens on row 16's refusal, *refused outright*, and S10 quotes
  N-001's own refusal, *Never a file path, never the contents of anything.* No W, and no humour anywhere. The finalize
  pass moved no band.
- **Rhythm.** Shortest: *Free stays active.*, *Confirm this address.* and *Choose another rank.*, three words each, one
  under the fingerprint's measured floor of four. They stay, as the keeper accepted. The floor is the range measured
  across prose paragraphs, and these are a heading and two one-line refusals, where the fingerprint's own specimen
  *This was a dry-run.* sets the shape. Longest: the bar sentence in S10 (c) at 32 words, inside the ceiling of 34, then
  S9's resolution sentence at 29 counting the `..`. Each two-sentence message pairs a short clause with a longer one, as
  `keyTaken` (9 and 12) and `provenanceEmptyTeam` (6 and 13) do. Four pieces are long enough for the rubric's rhythm
  rows. On their rendered text, with a closing quote ending its sentence, S7's body scores 0.69, S10 (b) 0.55, and (c)
  and (d) 0.56. Each has a sentence of six words or fewer and one of 25 or more. S10 (a) scores 0.41. It is allowed at
  finalize: the first paragraph is the shared summary and the last is 1.4.2's, so only the two between them could change.
- **Length.** S1 to S6 and S8 are microcopy, one or two sentences each, 23 to 174 characters. S7 is short: 91 words from
  eyebrow to sign-off, inside its siblings' 49 to 101. S9 is one label and two sentences, 223 characters against the
  band's 92 to 252. S10 sits near each 1.4.2 neighbour: (a) 202 words against 175, (c) and (d) 222 against 217, (b) 64
  against 67. Characters are UTF-16 code units; words are whitespace-separated across the whole block, its heading
  line included.
- **Unsure.** No NEEDS DECISION is open. One note goes back to the main session: the feed's words sit in `pages.json`,
  not in the (e) entry (S10 (g)), and *Admin* now names the elevation screen, as the main session answered.
  *Underscores* stays, behind an allow marker, because it names the `_` character. Two record cells changed at
  finalize, both from the keeper's finding 7. The `{{confirm_url}}` row no longer says a placeholder with no value
  fails a send; FilesHub states that for marketing templates only. The 1.4.2 `latest.json` notes measure 240
  characters, not 238.
