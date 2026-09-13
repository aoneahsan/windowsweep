# site-app - sign-in, `/contact`, `/account`, `/admin`, empty and error states, 404

Content-map row 18 · awareness **working** · structure **plain lines above dense tables; every action names
what it does** · palette **P, W in the empty states** · length **a screen each** · CTA **varies per screen** ·
schema **none**

Status: **finalized; GATE 4 approved 2026-09-13** under the standing pre-authorisation, with #15 taken into the apply. Round 2 brought in the developmental edit, the line edit,
the fact-check and the humor-emotion review; the finalizer then re-verified the seven round-2 fixes against the
code and changed no shipping word. It found two failure paths that show a string written for another case, now
*Reported, not written* #15 and #16. The Bible was approved at GATE 1 on 2026-09-05. The fingerprint is still
`calibrated: false`, which is open and does not block this draft. Language: en-GB. The product name is
lower-case throughout. On the three admin pages the row's structure, a plain line above each dense block, holds
in the dummy only: the app draws no page head there until #4 lands. Four items are preconditions of applying
this surface, #4, #6, #14 and #15, and S-034's aside also waits for #11.

---

## What this draft covers, and what it does not

Forty-one slots, one per element, across the eight screens row 18 names: `/signin`, `/contact`, `/account`, the
three `/admin` pages, the 404 and the route error page. Every string on them lives in two places at once, the
approved click dummy (`windowsweep-web/design/windowsweep-web-click-dummy/`) and the app's English catalogue
(`windowsweep-web/src/lib/i18n/locales/en/`). Both were read first. Where they differ, the slot says so
under its `Was:` table.

| Not in this draft | Why |
|---|---|
| Each route's `<title>` and meta description (`seo.json`) | owned by `site-front-site`, already applied |
| Header and footer labels (`common.nav.*`, `common.footer.*`) | navigation, not a surface (content-map amendment, 2026-09-08) |
| The rows of the audit log | data, not copy (same amendment) |
| The home page's band 14 strings (`home.contact.*`) | owned by `site-home` (S-025, S-026 there) |
| The line on `signin.html` that begins "Reviewing this dummy?" | the review harness, never shipped |
| The dummy's own toasts in `wire.js` | they describe the prototype's demo data; the product's words are in S-011, S-020 and S-023 |
| `error._provenance` in `errors.json` | a note for builders, never rendered |

**Shared keys**. `ContactForm` renders in two places, on `/contact` and in the home page's band 14
(`src/components/home/Contact.tsx:65`), and band 14 also prints `contact.signIn` and `contact.signedOutBody`
in its signed-out state (`Contact.tsx:68-73`). Every `contact.*` string below was checked against both mounts.
None of them carries a W line. Band 14 sits inside `site-home`'s budget of one.

---

## Conventions in this file

- One numbered slot per element, `S-001` upward, no gaps. Each heading names the page, the element and the
  catalogue file its keys live in.
- S-041 was added in round 2 and sits with its page, after S-007. A number is never shifted or reused, so
  every round-1 reference still points at the same slot.
- **`Was:`** reproduces the current visible text. For a changed slot it is a table of every key in the slot
  with its current catalogue value, byte-exact and findable with `grep -F` in the named file. The dummy's
  visible text is the same unless a line under the table says otherwise; its source writes `’` and `—` as
  entities, so decode those before searching it. For a slot that changes nothing it reads **identical - kept
  verbatim**, and the slot is numbered anyway so the applier can see it was read.
- The fenced block holds the **shipping words** as a JSON object: flat dotted keys exactly as `t()` receives
  them, values exactly as they go into the catalogue, with every `{{...}}` interpolation and `<mono>` tag
  unchanged. The dummy element named in the heading takes the same words. Per `frontend-ui-standards.md`
  §10a the dummy is amended first and the app matches it.
- A key marked **NEW** does not exist yet and needs one lookup in code before it renders; the slot says where.
- Line numbers cite the snapshot below. They are evidence, not the contract: apply by key.
- The lint hook strips fenced blocks, so every shipping string here was checked by hand against the banned
  list, the fingerprint's never-list, the punctuation budget and en-GB spelling. A green hook proves nothing
  about them.

**Snapshot the quotes were taken against, 2026-09-13:**

| File | md5 |
|---|---|
| dummy `signin.html` | `e4bb508dd2f42ac530455776f7dd728a` |
| dummy `contact.html` | `e259e6d61726e7766d122ff80fd03045` |
| dummy `account.html` | `add9973b881903284996992f5f971417` |
| dummy `admin-inbox.html` | `6e0edd6d6369680d2f0df8b8f83a6428` |
| dummy `admin-users.html` | `4555483f10fe3ddc847af78827059b4d` |
| dummy `admin-audit.html` | `37b8471e89032bc1646c3da6ddf5c88d` |
| dummy `404.html` | `5f1e9edb5bac36580ab19f2e192241ac` |
| dummy `wire.js` | `7809d23303bf77efad83ffbc6ee74f87` |
| dummy `shell.js` (the footer's "Report an issue" link, cited in S-002, round 2) | `8254ae461ac7cafce7d131142396b133` |
| `account.json` | `f030ef850383ff568310ac15d188a746` |
| `contact.json` | `d2ba590364b098b7d05d6826bccb6029` |
| `admin.json` | `52f4f91449e5f6f04d93b807251f0549` |
| `errors.json` | `5bf9136b2a4172cada924056ba60848a` |
| `common.json` | `bdb27316f2532c05c0991ee4259f1498` |
| `privacy.json` (cross-checked, not edited; re-read at finalize after its 03:21 commit, and S-021's sentence still matches) | `1a8fb083cbe32a10796de7e9251b55fe` |

---

## CTA per screen

| Screen | CTA |
|---|---|
| `/signin` | **Continue with Google** once sign-in is enabled; disabled today, with the reason beside it. Signed in: **Go to your account** |
| `/contact` | Sign-in off (today): **Open a GitHub issue**, the only live action. Enabled and signed out: **Sign in**, or **Open a GitHub issue**. Signed in: **Send message** |
| `/account` | nothing the page pushes; its actions are **Show older runs**, **Sign out** and **Delete this account**, the last behind a typed word |
| `/admin` | **Mark open** · **Mark handled** · **Mark closed** on each request, each followed by **Undo** |
| `/admin/users` | **Search** |
| `/admin/audit` | none, the log is read-only by grant; **Previous** and **Next** page it |
| 404 | **Go to the home page**, then **See every page** |
| Error page | **Try again**, then **Go to the home page** |

## Which state shows which slot

| Screen · state | Slots that render |
|---|---|
| `/signin` · sign-in not enabled (today) | S-001, S-002, S-003 with the button disabled, S-004 |
| `/signin` · enabled, signed out | S-001, S-003, S-004 |
| `/signin` · signed in | S-001, S-005, S-004 |
| `/contact` · sign-in not enabled (every visitor today) | S-006, S-041 |
| `/contact` · enabled, signed out | S-006, S-007 |
| `/contact` · signed in | S-006, S-008 to S-013 |
| `/account` · signed out | S-014, S-015 |
| `/account` · signed in | S-014, S-016 to S-023 |
| any `/admin` page · signed out | S-025 |
| any `/admin` page · signed in, no admin role | S-026 |
| any `/admin` page · platform admin | S-024 and the page's own slots |

The app renders no page head on the three admin routes (`src/routes/admin/route.tsx` has no `PageHead`), so
S-027, S-032 and S-036 show in the dummy only until *Reported, not written* #4 lands. Preconditions of
applying this surface: #4, #6, #14 and #15. S-034's aside waits for #11 as well. S-041 renders once
`src/routes/contact.tsx` gains the branch in #14.

---

## The facts this draft corrects

| # | Key | The claim | What the code says | Slot |
|---|---|---|---|---|
| 1 | `signin.opensBrowser` | "this opens your normal browser so you can see the address bar" | That is the desktop window's behaviour, and `/privacy` says so about the window. On this site the reader is already in a browser; `signInWithOAuth` sends the tab to Google and back to `/account` (`src/lib/auth.ts:24`, `:45-48`) | S-003 |
| 2 | `contact.messageTooShort` | "at least a dozen characters" | `MESSAGE_MIN = 10` (`src/lib/db.ts:82`); the database check is 10 to 4,000 | S-009 |
| 3 | `contact.sentBody` | "You will get a reply" · "it appears below" | No reply is guaranteed, and on the home page's band 14 nothing is below it | S-011 |
| 4 | `contact.mineEmptyBody` | "whether it has been read" | There is no read status; the three are Open, Handled and Closed | S-012 |
| 5 | `db.error.notSignedIn` | "Sign in again and your message will still be here" | Signing in leaves the page for Google and returns to `/account`; the form's contents live in memory only | S-013 |
| 6 | `db.error.unknown` | "It is not something you did" | An unclassified failure has no known cause | S-013 |
| 7 | `account.title` | "Everything stored about you, on one page" | The messages a person sent are listed on `/contact` | S-014 |
| 8 | `account.syncedEmpty`, `account.runsEmptyBody` | "It syncs on sign-in and after a run" | No file in `desktop/src` imports `lib/sync.ts`, so no trigger can be verified today | S-017, S-019 |
| 9 | `account.signOutNote` | "Signing out on this device" | Round 1 found `signOut()` on the library default, `scope: 'global'` (auth-js 2.116.0, `GoTrueClient.js:3409`), which ends every session the account has. Settled 2026-09-13 as option (a): `src/lib/auth.ts:64` now calls `supabase.auth.signOut({ scope: 'local' })`, so only this browser's session ends | S-020 |
| 10 | `account.deleteWhatStays` | "when an admin marks a message handled" | The audit trigger fires on every admin change to a message's status, handled time or handler; the settled `/privacy` wording says *handles* | S-021 |
| 11 | `account.deleteConfirmHint` | "reads exactly delete" | The word is compared after `trim()` (`DeleteAccount.tsx:41`, `:67`) | S-022 |
| 12 | `account.deleteFailedLead` | "That did not go through" | The client cannot know whether the account went (`src/lib/account.ts:101-106`) | S-023 |
| 13 | `admin.inbox.emptyFilteredBody` | "There are requests here" | It shows for any filter but All, an empty inbox included (`src/routes/admin/index.tsx:162-164`) | S-030 |
| 14 | `admin.inbox.auditNote` | "undoable for a few seconds" | `UNDO_LIFETIME_MS = 6500`, with no pause on hover (`src/state/toastStore.ts:37`) | S-031 |
| 15 | `admin.users.missingColumns` | backticks around two table names | `t()` renders them as literal characters | S-035 |
| 16 | the Role cells | raw `superadmin`, `admin`, `user` | `platform_role` is printed unmapped (`src/routes/account.tsx:78`, `src/routes/admin/users.tsx:59-63`) | S-033 |
| 17 | `error.lede` | "this site only ever reads" · "on our side" | The contact form, the inbox and account deletion all write; first person plural is banned by the fingerprint | S-040 |
| 18 | `signin.blocked` | "This state is read from the server at build time rather than assumed" | With the Supabase URL or key blank, `vite.config.ts:342-343` returns false before any request, and the committed `.env` leaves both blank, so today's build assumes the answer (`src/lib/features.ts:12-15`). Round 1 kept a softer form of the claim; the fact-check cut it | S-002 |
| 19 | `admin.notAdminBody` | "Asking the server for this data as an ordinary member returns nothing" | `listInbox` and `listProfiles` carry no user filter, and the own-row select policies are permissive, OR-ed with the admin ones (`20260908065411_site_tables.sql:47-51`), so an ordinary account gets its own rows; only `admin_audit`, with an admin policy alone (`:45`), returns none. Round 1 kept the claim; the fact-check caught it | S-026 |

---

## `/signin` (`account.json` → `signin.*`, dummy `signin.html`)

### S-001 · `/signin` · page head - crumb, H1, lede

**Was:** identical - kept verbatim.

```json
{
  "signin.crumb": "Sign in",
  "signin.title": "One account, shared with the desktop app.",
  "signin.lede": "Signing in is only needed for two things: sending a message that can be replied to, and reading back what the desktop app has synced. Nothing on the rest of the site needs it."
}
```

**Why**. Kept. The H1 carries the page's one concrete fact, that the desktop window and this site share a
single account, and the lede limits sign-in to two named uses, which agrees with the finalised `/privacy`
line that signing in is optional and Google.

---

### S-002 · `/signin` · `.blocked` notice - the not-yet-enabled state

**Was:**

| Key | Now |
|---|---|
| `signin.blockedLead` | Sign-in is not configured yet. |
| `signin.blocked` | Google has not been enabled on this project’s authentication settings, so the button below cannot do anything. This state is read from the server at build time rather than assumed, which is why the page says so instead of failing when you press it. |

The dummy's visible text is identical.

```json
{
  "signin.blockedLead": "Sign-in is not configured yet.",
  "signin.blocked": "Google sign-in has not been enabled on the account server this site shares with the desktop app, so the button below does nothing yet. Until it is enabled, send your message as an issue on GitHub, through the “Report an issue” link in the footer."
}
```

**Why**. The lead stays word for word, because the home page's band 14 prints the same lead (`site-home`
S-026) and two words for one state would read as two states. The body names which server has Google turned
off. The fact-check cut the sentence that followed, *The site checks that setting every time it is built*,
because today the build checks nothing: with the Supabase URL or key blank, `vite.config.ts:342-343` returns
false before any request, and the committed `.env` leaves both blank, so the answer is assumed
(`src/lib/features.ts:12-15`). The provider is off all the same, probed on 2026-09-08 and recorded there, so
the first sentence carries the fact and the second the exit: until sign-in works, a message goes to GitHub,
and the footer's "Report an issue" link points at the tracker in both the app (`src/content/nav.ts:85-86`)
and the dummy (`shell.js:53`). No date is given.

---

### S-003 · `/signin` · the Google button, its caption and its pending label

**Was:**

| Key | Now |
|---|---|
| `signin.continue` | Continue with Google |
| `signin.opensBrowser` | When it is enabled, this opens your normal browser so you can see the address bar, and returns you here. |

The dummy's visible text is identical. `signin.opening` is **NEW**.

```json
{
  "signin.continue": "Continue with Google",
  "signin.opensBrowser": "Sign-in happens on Google’s own page, and afterwards you land on your account page here.",
  "signin.opening": "Opening Google…"
}
```

**Why**. The old caption described the desktop window, which opens the system browser so the reader can
see the address bar they type into; `/privacy` says exactly that about the window. On this site the reader
is already in a browser, and `signInWithOAuth` sends the tab to Google and returns it to `/account`. The new
caption describes the flow instead of the button's state, so it is true under the disabled button today and
under the working one later. `signin.opening` is the pending label the button owes once it works, the
acknowledgement at the control that `interaction-feedback` asks for; it needs `isPending` on the `Button` in
`src/routes/signin.tsx:60-72`.

---

### S-004 · `/signin` · the fact list - one refusal under its own title, the closing line removed

**Was:**

| Key | Now |
|---|---|
| `signin.forTitle` | What signing in is for |
| `signin.for1` | Sending a message that has somewhere to be answered. |
| `signin.for2` | Reading back the settings and run summaries the desktop app has synced. |
| `signin.for3` | It is not needed to download anything, and it unlocks no feature of the tool itself. |
| `signin.oneAccount` | It is the same account the desktop window signs into — one sign-in across the family, not two. |

The dummy's visible text is identical.

**Removed in round 2:** `signin.for1`, `signin.for2` and `signin.oneAccount`, with their two `li.f-yes` items
(`src/routes/signin.tsx:87-94`) and the closing paragraph (`:100`), from the dummy and the app alike.

```json
{
  "signin.forTitle": "What it is not needed for",
  "signin.for3": "Downloading anything, or running any of the 26 sections, which run the same without it."
}
```

**Why**. Round 2 gives each fact one home. The lede already names the two uses, so the list items that
repeated them are gone, and `oneAccount` went with them because it restated the H1 in other words. What is
left is the one thing the lede does not say, under a title that fits a list holding a single refusal: no
account is needed to download either install path (`/download` says *neither needs an account*), and the 26
sections are the engine's work, which makes no network call of any kind. Round 1 had already removed
*unlocks*, a relative of the banned list's dressed-up verbs.

---

### S-005 · `/signin` · the signed-in state

**Was:**

| Key | Now |
|---|---|
| `signin.alreadyIn` | You are signed in. |
| `signin.toAccount` | Go to your account |

App only; the dummy draws no signed-in state on this page.

```json
{
  "signin.alreadyIn": "You are already signed in.",
  "signin.toAccount": "Go to your account"
}
```

**Why**. One word. A reader who reaches this page from an old link while signed in sees no Google button
(`src/routes/signin.tsx:40-48`), and *already* is the reason why. The link names where it goes and stays.

---

## `/contact` (`contact.json` → `contact.*`, errors in `account.json` → `db.error.*`, dummy `contact.html`)

### S-006 · `/contact` · page head - crumb, H1, lede

**Was:**

| Key | Now |
|---|---|
| `contact.crumb` | Contact |
| `contact.title` | Found a bug, or a path it should know about? |
| `contact.lede` | Sending a message needs an account, so that a reply has somewhere to go and so the inbox is not a spam target. It is the same account the desktop app signs into. |

The dummy's visible text is identical.

```json
{
  "contact.crumb": "Contact",
  "contact.title": "Found a bug, or a path it should know about?",
  "contact.lede": "A message from this page, or an issue on GitHub. Sending from here needs a signed-in account, the same one the desktop app uses, so a reply has an address to go to."
}
```

**Why**. `/contact` is the one indexable route on this surface (`src/content/routes.json`: `indexable:
true`), so a crawler reads its signed-out state, and the lede answers the heading's question in its first
sentence before it gives the account requirement and the reason for it. That first sentence names both routes
and claims neither is open. The line edit made it so, because the lede sits directly above S-041, which says
nothing can be sent from this page yet; as a fragment it holds above S-041 today, above S-007 once sign-in is
enabled and above the form once signed in. The H1 is the same sentence as the home band's heading. It stays
that way.

---

### S-007 · `/contact` · signed-out notice - heading, body, two buttons

**Was:**

| Key | Now |
|---|---|
| `contact.signedOutTitle` | You are not signed in |
| `contact.signedOutBody` | The form is not on this page while you are signed out — not hidden, not disabled: it is not rendered, and neither is anybody else’s message list. |
| `contact.signIn` | Sign in |
| `contact.openIssue` | Open an issue instead |

The dummy's visible text is identical.

```json
{
  "contact.signedOutTitle": "You are not signed in",
  "contact.signedOutBody": "The form appears once you are signed in. There is no captcha: sending needs an account, and each account may send five messages an hour.",
  "contact.signIn": "Sign in",
  "contact.openIssue": "Open a GitHub issue"
}
```

**Why**. The old body explained rendering to someone who wanted to send a message. The new one says when
the form appears and why an account is asked for, with the one limit a sender can actually reach: five
messages per account in any rolling hour, the sixth refused by a database trigger
(`desktop/supabase/migrations/20260908065528_site_privileges_and_triggers.sql`, section 3c). It also renders
under band 14's **Sign in** button on the home page, so it stays in P. The second button now names its
destination.

---

### S-041 · `/contact` · the sign-in-off notice - lead, body, the one live button (added in round 2)

**Was:** nothing. `/contact` has no sign-in-off state today, so every visitor sees S-007's **Sign in**, which
leads to the disabled button on `/signin`. The home page's band 14 already has the branch this state needs
(`src/components/home/Contact.tsx:49-63`), and *Reported, not written* #14 gives `/contact` the same one.
`contact.blockedLead` and `contact.blocked` are **NEW**; `contact.openIssue` is S-007's key, reused.

```json
{
  "contact.blockedLead": "Sign-in is not configured yet.",
  "contact.blocked": "Google sign-in has not been enabled on the account server this site shares with the desktop app, so no message can be sent from this page yet. Until it is, a GitHub issue is the working route.",
  "contact.openIssue": "Open a GitHub issue"
}
```

**Why**. The developmental edit found that the state every visitor sees today said nothing about sign-in
being off, while its primary button led to a disabled one. This slot writes that state the way band 14
already writes it on the home page: the same lead, so one state never reads as two, then a body naming what
cannot happen and which route works, with **Open a GitHub issue** as the only live action and no **Sign in**
beside it. No date is promised. The layout is new to the dummy too, so under §10a it is drawn there first.

---

### S-008 · `/contact` · subject field - label, placeholder, two errors

**Was:** identical - kept verbatim.

```json
{
  "contact.subject": "Subject",
  "contact.subjectPlaceholder": "A cache path windowsweep misses",
  "contact.subjectRequired": "A subject is needed so the inbox can be triaged.",
  "contact.subjectTooLong": "A subject is at most {{max}} characters. Put the detail in the message."
}
```

**Why**. Kept. The placeholder is the most specific string on the page, both errors say what to do, and
`{{max}}` is `SUBJECT_MAX = 120` (`src/lib/db.ts:81`).

---

### S-009 · `/contact` · message field - label, placeholder, hint, counter, editor, two errors

**Was:**

| Key | Now |
|---|---|
| `contact.message` | Message |
| `contact.messagePlaceholder` | Which path, on which Windows build, and what you expected. |
| `contact.messageHint` | Plain words are fine. |
| `contact.messageLoading` | Loading the editor… |
| `contact.count` | {{used}} / {{max}} |
| `contact.messageTooShort` | A few more words, please — at least a dozen characters. A one-word report cannot be acted on. |
| `contact.messageTooLong` | That is longer than the {{max}} characters the server accepts. Trim it and nothing will be lost on the way. |
| `contact.format.group` | Formatting |
| `contact.format.bold` | Bold |
| `contact.format.italic` | Italic |
| `contact.format.underline` | Underline |
| `contact.format.bullets` | Bulleted list |

The dummy shows the first three, the short-message error and the format buttons with the same words; it
also draws a *Clear formatting* button the app does not have.

```json
{
  "contact.message": "Message",
  "contact.messagePlaceholder": "Which path, on which Windows build, and what you expected.",
  "contact.messageHint": "Plain words are fine.",
  "contact.messageLoading": "Loading the editor…",
  "contact.count": "{{used}} / {{max}}",
  "contact.messageTooShort": "A few more words, please: a message needs at least 10 characters. A one-word report cannot be acted on.",
  "contact.messageTooLong": "That is longer than the {{max}} characters the server accepts, and formatting counts towards them. Shorten it, or remove some formatting.",
  "contact.format.group": "Formatting",
  "contact.format.bold": "Bold",
  "contact.format.italic": "Italic",
  "contact.format.underline": "Underline",
  "contact.format.bullets": "Bulleted list"
}
```

**Why**. The minimum was wrong by two: `MESSAGE_MIN = 10` (`src/lib/db.ts:82`) mirrors a database check of
10 to 4,000, and *a dozen* promised twelve. The long-message error now explains the one case that surprises
people, because the counter shows plain-text length (`RichTextField.tsx:102`) while the check also bounds the
stored markup (`ContactForm.tsx:69`), so a heavily formatted message can be refused under the count on
screen. *Nothing will be lost on the way* promised something it never defined. Gone.

---

### S-010 · `/contact` · the send row - button, pending label, sender line

**Was:**

| Key | Now |
|---|---|
| `contact.send` | Send |
| `contact.sending` | Sending… |
| `contact.sentAs` | `Sent as <mono>{{email}}</mono>` |

The dummy has no pending label and prints the address in a `span.mono`.

```json
{
  "contact.send": "Send message",
  "contact.sending": "Sending…",
  "contact.sentAs": "From <mono>{{email}}</mono>"
}
```

**Why**. *Send message* is verb and object. *Sent as* sat in the past tense beside a button nobody had
pressed yet, and *From* is the line every reader already knows from the top of an email, which is exactly
the fact this line exists to show.

---

### S-011 · `/contact` · the sent state - title, body, the reset button

**Was:**

| Key | Now |
|---|---|
| `contact.sentTitle` | Sent. |
| `contact.sentBody` | `Your message is in the inbox as <mono>{{id}}</mono>, and it appears below with its status. You will get a reply at the address you signed in with.` |
| `contact.sendAnother` | Send another |

App only. The dummy acknowledges a send with a toast from `wire.js` ("Sent. It is in your list below, and in
the admin inbox.") and should take these words instead.

```json
{
  "contact.sentTitle": "Sent.",
  "contact.sentBody": "It is in the inbox as <mono>{{id}}</mono> and listed under “Your messages” on the contact page. Any reply goes to the address you signed in with.",
  "contact.sendAnother": "Write another"
}
```

**Why**. Two corrections. *You will get a reply* promised an outcome nobody can guarantee, and *appears
below* is false on the home page, where the same component renders with no list beneath it; naming the
*Your messages* section on the contact page is true in both places. *Write another* describes the button,
which clears the form and sends nothing.

---

### S-012 · `/contact` · "Your messages" - heading, empty state, row labels, statuses

**Was:**

| Key | Now |
|---|---|
| `contact.mineTitle` | Your messages |
| `contact.mineEmptyTitle` | Nothing sent yet |
| `contact.mineEmptyBody` | Anything you send appears here with its status, so you can see whether it has been read without asking. |
| `contact.sentOn` | Sent {{when}} |
| `contact.loadMore` | Show older messages |
| `contact.status.new` | Open |
| `contact.status.handled` | Handled |
| `contact.status.archived` | Closed |

The dummy shows the heading and the empty state with the same words.

```json
{
  "contact.mineTitle": "Your messages",
  "contact.mineEmptyTitle": "Nothing sent yet",
  "contact.mineEmptyBody": "Each message you send is listed here with its status: Open, Handled or Closed.",
  "contact.sentOn": "Sent {{when}}",
  "contact.loadMore": "Show older messages",
  "contact.status.new": "Open",
  "contact.status.handled": "Handled",
  "contact.status.archived": "Closed"
}
```

**Why**. There is no *read* state to see. A message is Open, Handled or Closed, and the empty state now
names those three statuses in the badges' own words, which is the after-state this list will show once it
has rows.

---

### S-013 · `/contact` · server errors (`account.json` → `db.error.*`)

**Was:**

| Key | Now |
|---|---|
| `db.error.rateLimited` | That is five messages in an hour, which is the limit. Please try again a little later — nothing you wrote was lost. |
| `db.error.duplicate` | That has already been recorded. Nothing was sent twice. |
| `db.error.refused` | The server refused that write. This is a permissions rule doing its job, not a fault you can fix from here. |
| `db.error.tooLongOrShort` | One of those fields is outside the length the server accepts. Check the subject and the message and try again. |
| `db.error.notSignedIn` | You are not signed in any more. Sign in again and your message will still be here. |
| `db.error.unknown` | That did not go through. It is not something you did — try again in a moment. |

App only; the dummy has no server.

```json
{
  "db.error.rateLimited": "That would be a sixth message within an hour, and the limit is five. What you wrote is still in the form. It can be sent within the hour.",
  "db.error.duplicate": "That has already been recorded. Nothing was sent twice.",
  "db.error.refused": "The server refused this under a permissions rule, and nothing on this page can change that. Open an issue on GitHub to report it.",
  "db.error.tooLongOrShort": "A field is outside the length the server accepts: up to 120 characters for the subject, and 10 to 4,000 for the message, formatting included.",
  "db.error.notSignedIn": "You are no longer signed in, and the server refused this. Signing in again leaves this page, so copy anything you have typed first.",
  "db.error.unknown": "That did not go through. Try again in a moment, and if it keeps failing, open an issue on GitHub."
}
```

**Why**. These six render inside the form and inside the *Your messages* list (`ContactForm.tsx:143`,
`MyRequests.tsx:73`), so each one reads correctly for a send and for a read. Two of them promised what the
code does not do. Signing in again sends the tab to Google and back to `/account`, so a typed message would
not *still be here*, and the line now tells the reader to copy it first; *It is not something you did* is
unknowable for a failure nobody classified. The rate-limit line keeps its fact about the form, which
`ContactForm.tsx:142-145` confirms by never resetting on a failure. Round 2 gives the refusal the GitHub route
it lacked, unconditionally, because a permissions refusal comes back the same every time it is tried. The
rate-limit line now bounds its wait: the window is a rolling hour, so a slot frees within the hour.

---

## `/account` (`account.json` → `account.*`, dummy `account.html`)

### S-014 · `/account` · page head - crumb, H1, lede

**Was:**

| Key | Now |
|---|---|
| `account.crumb` | Account |
| `account.title` | Everything stored about you, on one page. |
| `account.lede` | There is not much of it, and this page is the whole list. What the desktop app syncs is shown read-only here: the window owns those settings, so changing them here would give you two places to change one thing. |

The dummy's visible text is identical.

```json
{
  "account.crumb": "Account",
  "account.title": "Your account, and what is stored against it.",
  "account.lede": "This page holds the profile, the settings the desktop app has synced and your run summaries. The messages you have sent are listed on the contact page."
}
```

**Why**. *Everything stored about you, on one page* was false by one page, since the messages a person has
sent are listed on `/contact` and the deletion paragraph on this same screen names them. The new heading
echoes that paragraph's *stored against it*. The lede stops repeating the read-only reasoning, which S-017's
plain line now carries once, directly above the block it explains.

---

### S-015 · `/account` · signed-out notice

**Was:**

| Key | Now |
|---|---|
| `account.signedOutTitle` | You are not signed in |
| `account.signedOutBody` | There is no account page to show, and no account details are on this page while you are signed out. |
| `contact.signIn` | Sign in |

The dummy's visible text is identical.

```json
{
  "account.signedOutTitle": "You are not signed in",
  "account.signedOutBody": "Once you are signed in, this page shows what is stored against the account. None of it is loaded while you are signed out.",
  "contact.signIn": "Sign in"
}
```

**Why**. The old body said one thing twice. The new one gives the after-state and one checkable fact: the
account queries live inside the signed-in branch of `src/routes/account.tsx`, so a signed-out browser fetches
none of it. The state's one button is `contact.signIn`, the key S-007 also uses (`src/routes/account.tsx:217-219`),
listed here so this slot holds everything the state renders.

---

### S-016 · `/account` · Profile block

**Was:** identical - kept verbatim.

```json
{
  "account.profile": "Profile",
  "account.displayName": "Display name",
  "account.email": "Email",
  "account.role": "Role",
  "account.created": "Account created"
}
```

**Why**. Kept. The Role value under this label is printed raw today, and the three labels in S-033 apply here
as well.

---

### S-017 · `/account` · synced settings - heading, the plain line, three labels, empty state

**Was:**

| Key | Now |
|---|---|
| `account.syncedTitle` | Settings synced from the desktop app |
| `account.syncedLede` | Read-only here. The window owns them, and two places to change one setting is how the two places end up disagreeing. |
| `account.developerMode` | Developer mode |
| `account.settingsUpdated` | Settings last changed |
| `account.lastSeen` | Last seen |
| `account.syncedEmpty` | The desktop app has not synced anything to this account yet. It syncs on sign-in and after a run. |

The dummy shows the heading and the plain line with the same words, then five demo rows (Developer mode, Idle
window, Temp window, Notify on finish, Appearance) and no empty state; the app draws three rows.

```json
{
  "account.syncedTitle": "Settings synced from the desktop app",
  "account.syncedLede": "Read-only here. The window owns them. Changing them here would give you two places to change one thing.",
  "account.developerMode": "Developer mode",
  "account.settingsUpdated": "Settings last changed",
  "account.lastSeen": "Last synced",
  "account.syncedEmpty": "The desktop app has synced nothing to this account yet."
}
```

**Why**. *Last seen* never said seen by whom. The column is `last_seen_at`, and the only code that writes it
is the desktop app's `pushSettings`, which stamps the moment of each settings sync
(`desktop/src/lib/sync.ts:117`, `:136`), so the label now says *Last synced*. The empty state loses *It
syncs on sign-in and after a run*, because nothing in `desktop/src` imports `lib/sync.ts` today and a trigger
that cannot be found in the code does not go into the copy. The plain line above the block carried a maxim
from the dummy, *two places to change one setting is how the two places end up disagreeing*, which the
humor-emotion review ruled W: it sits above a table, not in an empty state, on the page that holds the
deletion band. The main session took the review's option (a). The line is P again, in words the pre-edit
`account.lede` already used, a consequence stated once.

---

### S-018 · `/account` · "Your last runs" - heading, caption, columns, badges, total, paging

**Was:**

| Key | Now |
|---|---|
| `account.runsTitle` | Your last runs |
| `account.runsCaption` | Synced from the desktop app. A run summary is a count and a number of bytes; no path is ever part of it. |
| `account.colWhen` | When |
| `account.colMode` | Mode |
| `account.colSections` | Sections |
| `account.colReclaimed` | Reclaimed |
| `account.colNote` | Note |
| `account.dryRun` | dry-run |
| `account.elevated` | elevated |
| `account.totalReclaimed` | Total reclaimed across these runs: |
| `account.loadMoreRuns` | Show older runs |

The dummy shows the heading, the caption, the five columns and the total with the same words.

```json
{
  "account.runsTitle": "Your last runs",
  "account.runsCaption": "Synced from the desktop app. A run summary records when, which sections and how many bytes; no path is ever part of it.",
  "account.colWhen": "When",
  "account.colMode": "Mode",
  "account.colSections": "Sections",
  "account.colReclaimed": "Reclaimed",
  "account.colNote": "Note",
  "account.dryRun": "dry-run",
  "account.elevated": "elevated",
  "account.totalReclaimed": "Total reclaimed across these runs:",
  "account.loadMoreRuns": "Show older runs"
}
```

**Why**. *A count and a number of bytes* was narrower than the record: `stripRun` keeps the time, the mode,
two flags, the section numbers, two byte figures and the duration, and drops every path
(`desktop/src/lib/sync.ts:47-66`). The new caption names what the table shows without claiming to be the whole
list. The total is a sum over the rows on screen (`src/routes/account.tsx:56-60`), which is what *across
these runs* already says.

---

### S-019 · `/account` · runs empty state

**Was:**

| Key | Now |
|---|---|
| `account.runsEmptyTitle` | No runs synced yet |
| `account.runsEmptyBody` | A run summary arrives here after the desktop app finishes a run while you are signed in. |

App only.

```json
{
  "account.runsEmptyTitle": "No runs synced yet",
  "account.runsEmptyBody": "The runs synced from the desktop app are listed here, newest first, with the bytes each one reclaimed."
}
```

**Why**. The after-state in the table's own terms, without the timing S-017 removed for the same reason.
*Newest first* is the query's order (`src/lib/account.ts:82`). The fact-check caught a present-tense habit in
round 1's *the desktop app syncs*: `pushRun` has no caller, so the line described something that does not
happen yet, and the participle S-018's caption already uses describes the rows without claiming a schedule.

---

### S-020 · `/account` · sign-out section - heading, button, note

**Was:**

| Key | Now |
|---|---|
| `account.leavingTitle` | Leaving |
| `account.signOut` | Sign out |
| `account.signOutNote` | Signing out on this device clears the session stored in this browser. Your appearance settings are kept — they are yours, not the account’s. |

The dummy's note differs: "Signing out on this device clears everything stored in this browser, including
the seeded demo data."

```json
{
  "account.leavingTitle": "Signing out",
  "account.signOut": "Sign out",
  "account.signOutNote": "Signing out here ends this browser’s session only; the desktop app stays signed in. Your appearance settings are kept. They are stored in this browser, not in the account."
}
```

**Why**. The heading names the one action left in the section now that deletion has its own. NEEDS
DECISION 1 was answered on 2026-09-13 with option (a): the approved dummy's own note already said sign-out
clears what is stored in this browser, so the code was the defect, and `src/lib/auth.ts:64` now calls
`supabase.auth.signOut({ scope: 'local' })`, which leaves every other session alone. The note says exactly
that. The dummy's version describes its own demo data and takes this sentence.

---

### S-021 · `/account` · deletion - what goes and what stays (safety surface)

**Was:**

| Key | Now |
|---|---|
| `account.deleteTitle` | Deleting this account |
| `account.deleteWhatGoes` | Deleting removes the sign-in itself and everything stored against it: the profile on this page, the settings the desktop app has synced, your run summaries, and the messages you have sent. It happens immediately and it cannot be undone. |
| `account.deleteWhatStays` | What stays is not yours: when an admin marks a message handled, that action is logged with the message’s id, its status and who handled it, and it carries none of your words. Nothing on your machine is touched. |

The dummy's visible text is identical.

```json
{
  "account.deleteTitle": "Deleting this account",
  "account.deleteWhatGoes": "Deleting removes the sign-in itself and everything stored against it: the profile on this page, the settings the desktop app has synced, your run summaries, and the messages you have sent. It happens immediately. It cannot be undone.",
  "account.deleteWhatStays": "What stays is not yours: when an admin handles one of your messages, that action is logged with the message’s id, its status and who handled it. It carries none of your words. Nothing on your machine is touched."
}
```

**Why**. **Safety surface**: no humour, no urgency, no softening, and every fact unchanged. *It happens
immediately and it cannot be undone* becomes two sentences, so the paragraph ends on its shortest one and the
irreversible fact stands on its own. The second paragraph is the settled `/privacy` sentence word for word
(`privacy.json` → `signedIn.deleteWhatStays`), which replaces *marks a message handled* with *handles one of
your messages*: the audit trigger fires on any admin change to a message's status, handled time or handler.
The apostrophe is the curly one this catalogue uses everywhere else.

---

### S-022 · `/account` · deletion - the typed gate (safety surface)

**Was:**

| Key | Now |
|---|---|
| `account.deleteConfirmLabel` | Type delete to confirm |
| `account.deleteConfirmHint` | The button stays disabled until this field reads exactly delete, in lower case. |
| `account.deleteAccount` | Delete this account |
| `account.deleting` | Deleting… |

The dummy shows the first three with the same words and has no pending label.

```json
{
  "account.deleteConfirmLabel": "Type delete to confirm",
  "account.deleteConfirmHint": "The button stays disabled until this field reads delete, in lower case.",
  "account.deleteAccount": "Delete this account",
  "account.deleting": "Deleting…"
}
```

**Why**. **Safety surface**. One word removed. The confirmation is compared after `trim()`
(`DeleteAccount.tsx:41`, `:67`, and the dummy's inline script does the same), so a stray space before or after
the word still arms the button, and *exactly* described a stricter test than the one that runs. Lower case is
still required. Still said.

---

### S-023 · `/account` · deletion - the failure lead and the done notice (safety surface)

**Was:**

| Key | Now |
|---|---|
| `account.deleteFailedLead` | That did not go through, and you are still signed in. The server said: |
| `account.deletedToast` | Account deleted. You are signed out on this device, and there is nothing left to sign back in to. |

App only. The dummy's toast describes its prototype ("This prototype reseeds rather than keeping a
tombstone").

```json
{
  "account.deleteFailedLead": "The request failed, and this page kept you signed in so you can try again. If it fails again, open an issue on GitHub. The error:",
  "account.deletedToast": "Account deleted, and you are signed out."
}
```

**Why**. **Safety surface**. The failure lead used to assert *That did not go through*, while the code's own
comment says the client cannot know whether the account went (`src/lib/account.ts:101-106`); a response lost
after the server committed would make that sentence false at the worst possible moment. The new lead states
only what the page knows and did, leaves the server's words to follow in bold (`DeleteAccount.tsx:121-125`),
and names a next step that is harmless either way. Round 2 adds the fourth beat `safety.md` asks of an error
of consequence, who to turn to if the retry fails, and names GitHub because it is the one route that does not
need this account: the contact form does, and the account may already be gone. The notice keeps what changed,
in seven words. Its dropped clause could be read as a permanent lock-out, which is a claim with no evidence
behind it.

---

## `/admin` - the states all three pages share (`admin.json`, dummy `admin-inbox.html`, `admin-users.html`, `admin-audit.html`)

### S-024 · every `/admin` page · crumbs, the section tabs, the pager

**Was:** identical - kept verbatim.

```json
{
  "admin.crumbAccount": "Account",
  "admin.crumbInbox": "Admin",
  "admin.crumbUsers": "Users",
  "admin.crumbAudit": "Audit log",
  "admin.navGroup": "Admin sections",
  "admin.navInbox": "Inbox",
  "admin.navUsers": "Users",
  "admin.navAudit": "Audit log",
  "admin.page": "Page {{page}} of {{pages}}",
  "admin.prev": "Previous",
  "admin.next": "Next",
  "admin.countRows_one": "{{count}} row",
  "admin.countRows_other": "{{count}} rows"
}
```

**Why**. Kept. Each label names its destination or its count, and `countRows` already uses the plural pair
the i18n layer expects.

---

### S-025 · every `/admin` page · signed-out state

**Was:**

| Key | Now |
|---|---|
| `admin.signedOutTitle` | You are not signed in |
| `admin.signedOutBody` | Nothing from the admin surface is on this page. The gate here is a mirror of the one the database enforces: the real protection is a row-level policy on a platform role, not this markup. |
| `admin.signIn` | Sign in |

The dummy's visible text is identical on all three pages.

```json
{
  "admin.signedOutTitle": "You are not signed in",
  "admin.signedOutBody": "No admin data is loaded while you are signed out. The real gate is a row-level policy in the database; this page only mirrors it.",
  "admin.signIn": "Sign in"
}
```

**Why**. Two shorter sentences, both facts kept and made checkable. `AdminGuard` renders nothing of the admin
pages to a signed-out reader and the tab counts render only for a confirmed admin
(`src/routes/admin/route.tsx`), while the rows themselves are withheld by the row-level policy that calls
`is_platform_admin()` (`src/lib/auth.ts:63-73`).

---

### S-026 · every `/admin` page · the no-admin-role state

**Was:**

| Key | Now |
|---|---|
| `admin.notAdminTitle` | This account is not a platform admin |
| `admin.notAdminBody` | The role is seeded out of band for two fixed addresses and is not something this interface can grant. Asking the server for this data as an ordinary member returns nothing, which is where the boundary actually is. |
| `admin.backToAccount` | Back to your account |

The dummy's visible text is identical on all three pages.

```json
{
  "admin.notAdminTitle": "This account has no admin role",
  "admin.notAdminBody": "The role is seeded out of band for two fixed addresses, and nothing here can grant it. When an ordinary account asks for this data, the database returns only that account’s own rows, and nobody else’s; that is the boundary.",
  "admin.backToAccount": "Back to your account"
}
```

**Why**. The heading drops to six words and names the missing thing, a role. The body keeps *seeded out of
band*, the phrase the users page head uses for the same fact, and describes the boundary the way the database
draws it. The fact-check found round 1 wrong here: `listInbox` and `listProfiles` carry no user filter, and
each table's own-row select policy is permissive, OR-ed with the admin one
(`desktop/supabase/migrations/20260908065411_site_tables.sql:47-51`), so an ordinary account gets its own rows
and nobody else's; only the audit log, which has an admin policy alone (`:45`), returns none. The semicolon
keeps the state at two sentences.

---

## `/admin` - the inbox

### S-027 · `/admin` · page head - H1, lede (dummy only until Reported #4)

**Was:**

| Key | Now |
|---|---|
| `admin.inbox.title` | Contact requests. |
| `admin.inbox.lede` | The whole admin surface is three pages: this inbox, a users list and an audit log. There is nothing else to administer here. |

The dummy's visible text is identical.

```json
{
  "admin.inbox.title": "Contact requests.",
  "admin.inbox.lede": "The whole admin surface is three pages: this inbox, a users list and an audit log. There is nothing else to administer here. Every status change writes a row to the audit log, and a change made with a request’s buttons can be undone for 6.5 seconds from its notice."
}
```

**Why**. Round 2 puts the sentence an admin needs before the first click above the list, as the row's
structure asks, by folding it into this lede: every status change is logged, and one made with a request's
buttons can be undone within a window stated exactly (`src/state/toastStore.ts:37`). The fact-check scoped
that second claim, because an undo is itself a status change and its own notice offers no second undo
(`src/routes/admin/index.tsx:93-96`). Folding it in changes words and not layout, so the dummy needs no layout
amendment for it. The app shows this lede only once Reported #4 gives the admin routes a page
head, which is why #4 is a precondition of applying this surface. The count is still right.

---

### S-028 · `/admin` · list controls - heading, filter, sort, the sender line

**Was:** identical - kept verbatim.

```json
{
  "admin.inbox.heading": "Requests",
  "admin.inbox.filterLabel": "Status",
  "admin.inbox.filterAll": "All",
  "admin.inbox.sortLabel": "Order",
  "admin.inbox.sortNewest": "Newest first",
  "admin.inbox.sortOldest": "Oldest first",
  "admin.inbox.from": "{{email}} · {{when}}"
}
```

**Why**. Kept. The filter and the sort live in the URL (`src/routes/admin/index.tsx:38-41`), and each label
is the noun an admin reaches for.

---

### S-029 · `/admin` · row actions and the notices they raise (`admin.json`, `common.json` → `action.undo`)

**Was:**

| Key | Now |
|---|---|
| `admin.inbox.markNew` | Reopen |
| `admin.inbox.markHandled` | Mark handled |
| `admin.inbox.markArchived` | Close |
| `admin.inbox.changed` | Marked “{{subject}}” {{status}}. |
| `admin.inbox.undone` | Put back. |
| `admin.inbox.refused` | That did not change anything. The server returned no rows, which means this account is not permitted to triage — the gate is the database, not this page. |
| `action.undo` | Undo |

The dummy's buttons match; its notice is built in `wire.js` from the button label and prints lines such as
`Marked "…" mark handled.`

**`admin.inbox.refused` reads true only after Reported #15**. Until #15 lands it also shows when the write
fails with an error, where *The database returned no rows* names the wrong cause. The current catalogue string
names the same cause, so it is no fallback; #15 goes in with the apply.

```json
{
  "admin.inbox.markNew": "Mark open",
  "admin.inbox.markHandled": "Mark handled",
  "admin.inbox.markArchived": "Mark closed",
  "admin.inbox.changed": "Status set to {{status}}: “{{subject}}”.",
  "admin.inbox.undone": "Change undone. The log keeps both rows.",
  "admin.inbox.refused": "Nothing changed. The database returned no rows, so this account may not change a status.",
  "action.undo": "Undo"
}
```

**Why**. *Close* failed the row's test, since it reads as closing a panel as easily as closing a request, and
*Reopen* broke the pattern its neighbours set. The three buttons now name the status each one sets, in the
badges' own words, and only the two that differ from the current status are drawn (`index.tsx:182`). The
notice leads with what changed and puts the subject last, where the code's 28-character cut does the least
harm. *Put back.* becomes a line that also teaches the log: an undo is a triage write of its own, so the audit
log gains a row instead of losing one. The refusal keeps its fact and drops the lecture.

---

### S-030 · `/admin` · the two empty states

**Was:**

| Key | Now |
|---|---|
| `admin.inbox.emptyTitle` | The inbox is empty |
| `admin.inbox.emptyBody` | Nothing has been sent. When something is, it lands here with the sender and the time, and stays open until somebody marks it otherwise. |
| `admin.inbox.emptyFilteredTitle` | Nothing matches that filter |
| `admin.inbox.emptyFilteredBody` | There are requests here, just none with this status. Clear the filter to see the rest. |

The dummy has the first pair only, with the same words.

```json
{
  "admin.inbox.emptyTitle": "The inbox is empty",
  "admin.inbox.emptyBody": "Nothing has been sent yet. New messages arrive as Open, with the sender’s email and the time.",
  "admin.inbox.emptyFilteredTitle": "Nothing matches that filter",
  "admin.inbox.emptyFilteredBody": "No request has this status. Choose All to see every request."
}
```

**Why**. The inbox line now names the status a new message arrives with and the two facts each row shows,
both visible in `index.tsx:170-179`, in a second sentence round 2 cut to twelve words. The filtered line claimed *There are requests here*, which is false
whenever the whole inbox is empty and a filter is set, and it used *just*, which the fingerprint never allows.
*Choose All* names the actual control. It is a radio group whose first option reads All.

---

### S-031 · `/admin` · the plain line under the list

**Was:**

| Key | Now |
|---|---|
| `admin.inbox.auditNote` | Changing a status writes an audit row through one path, so it cannot be forgotten at one call site. Every change here is undoable for a few seconds — an undo interrupts nobody, where a confirmation dialog would interrupt everybody. |

The dummy's visible text is identical.

```json
{
  "admin.inbox.auditNote": "This page writes no audit row; a database trigger does. The undo is a change of its own, so it writes a second row."
}
```

**Why**. Round 2 moved the sentence an admin needs before the first click, the logging and the undo window,
up into S-027's lede, where *a few seconds* is stated as 6.5 with no pause on hover
(`src/state/toastStore.ts:37`, `:50-56`). What stays below the list is where the audit row comes from, a
`security definer` trigger on the triage columns (`src/lib/admin.ts:20-23`), and the clause about undo
writing a second row, word for word. The argument about confirmation dialogs was written for the builder, and
it leaves the admin's screen.

---

## `/admin/users` (`admin.json` → `admin.users.*`, dummy `admin-users.html`)

### S-032 · `/admin/users` · page head - H1, lede (dummy only today)

**Was:** identical - kept verbatim.

```json
{
  "admin.users.title": "Everyone with an account.",
  "admin.users.lede": "Read-mostly on purpose. The platform role is seeded out of band for two fixed addresses, so there is no button here that can grant it."
}
```

**Why**. Kept. *Read-mostly* is the brief's word for this page, and the second sentence is the reason no
grant button exists.

---

### S-033 · `/admin/users` · the table - heading, caption, columns, search, role labels

**Was:**

| Key | Now |
|---|---|
| `admin.users.heading` | Accounts |
| `admin.users.caption` | Every account on the shared project. |
| `admin.users.colName` | Name |
| `admin.users.colEmail` | Email |
| `admin.users.colRole` | Role |
| `admin.users.colCreated` | Joined |
| `admin.users.searchLabel` | Search |
| `admin.users.searchPlaceholder` | name or email |
| `admin.users.noName` | — |

The dummy differs. Its caption reads "Every account on the shared project. Run counts come from the desktop
app’s sync.", its columns are Name, Email, Role, Runs and Last seen, and its role cells read "Platform admin"
and "Member" (`wire.js`). The three `admin.role.*` keys are **NEW**.

```json
{
  "admin.users.heading": "Accounts",
  "admin.users.caption": "Every account on the shared project, newest first, 20 to a page.",
  "admin.users.colName": "Name",
  "admin.users.colEmail": "Email",
  "admin.users.colRole": "Role",
  "admin.users.colCreated": "Joined",
  "admin.users.searchLabel": "Search",
  "admin.users.searchPlaceholder": "name or email",
  "admin.users.noName": "—",
  "admin.role.superadmin": "Superadmin",
  "admin.role.admin": "Admin",
  "admin.role.user": "Member"
}
```

**Why**. The caption gains the two facts a reader of a paged table needs, the order and the page size:
`created_at` descending and 20 rows (`src/lib/admin.ts:189-194`). The role labels are new because the cell
prints `superadmin`, `admin` or `user` straight from the database (`users.tsx:59-63`, and `account.tsx:78`
does the same), and a raw column value on screen is a string no catalogue can ever translate. The dummy named
two roles; the check constraint allows three (`20260908065411_site_tables.sql:32-35`), so each gets a label and
both cells look it up.

---

### S-034 · `/admin/users` · search empty state (the page's W line)

**Was:**

| Key | Now |
|---|---|
| `admin.users.emptyTitle` | No account matches that |
| `admin.users.emptyBody` | Search runs on the server across display name and email. Clear it to see everyone. |

App only.

**Applies only after Reported #11**. Until #11 lands, `admin.users.emptyBody` keeps its current catalogue value,
the P sentence without the aside, because a failed users query renders this same empty state.

```json
{
  "admin.users.emptyTitle": "No account matches that",
  "admin.users.emptyBody": "Search runs on the server across display name and email, so a miss here is a miss everywhere. Clear it to see everyone."
}
```

**Why**. This page's one W line. Search is an `ilike` over every profile on the server, not a filter over the
twenty rows on screen (`src/lib/admin.ts:196-199`), so an empty result is the whole answer, and the aside says
so in eight words. The humor-emotion review found that a failed users query renders this same empty state
(Reported #11), where the aside would be both out of the row and false. This draft makes #11 a precondition of
the aside rather than holding it to the P sentence, so the words are written once; until #11 lands, the
fallback is the string already in the catalogue.

---

### S-035 · `/admin/users` · the note under the table

**Was:**

| Key | Now |
|---|---|
| `admin.users.missingColumns` | Run counts and last-seen are not on this table. `runs` and `user_settings` carry own-row policies and no admin policy, so an administrator reads their own and nobody else’s — a column here would be blank for everyone or, worse, show the reader their own figures beside somebody else’s name. |

App only.

```json
{
  "admin.users.missingColumns": "Run counts and last-sync times are not shown. Each account can read only its own runs and synced settings, admins included, so those columns would be blank for every account but yours."
}
```

**Why**. The same fact at a third of the length, addressed to the admin reading the table instead of the
developer who built it. The backticks rendered as literal characters, because this string reaches the page
through `t()` as plain text (`users.tsx:109-111`).

---

## `/admin/audit` (`admin.json` → `admin.audit.*`, dummy `admin-audit.html`)

### S-036 · `/admin/audit` · page head - H1, lede (dummy only today)

**Was:**

| Key | Now |
|---|---|
| `admin.audit.title` | Every admin write, in order. |
| `admin.audit.lede` | Append-only. There is no edit control and no delete control on this page, and that absence is the feature — a log an administrator can tidy is not a log. |

The dummy's visible text is identical.

```json
{
  "admin.audit.title": "Every admin write, in order.",
  "admin.audit.lede": "Append-only. There is no edit control and no delete control on this page, and the database grants neither to anyone."
}
```

**Why**. The lede keeps its first two claims and swaps the aphorism for the stronger fact behind it:
`admin_audit` holds SELECT and nothing else for every role (`src/lib/admin.ts:20`), so the missing controls
are missing in the database too. The page's one dry line lives in its empty state, S-038, where the row
allows it.

---

### S-037 · `/admin/audit` · the table - heading, caption, columns, the change cell

**Was:**

| Key | Now |
|---|---|
| `admin.audit.heading` | Every admin write, newest first |
| `admin.audit.caption` | Newest first. Rows are written by the same path that performs the change, never beside it. |
| `admin.audit.colAction` | Action |
| `admin.audit.colActor` | Actor |
| `admin.audit.colTarget` | Target |
| `admin.audit.colDetail` | Detail |
| `admin.audit.colWhen` | When |
| `admin.audit.change` | {{before}} → {{after}} |

The dummy's visible text is identical for the heading, the caption and the five columns.

```json
{
  "admin.audit.heading": "Every admin write, newest first",
  "admin.audit.caption": "Newest first. A database trigger writes each row in the same transaction as the change it records.",
  "admin.audit.colAction": "Action",
  "admin.audit.colActor": "Actor",
  "admin.audit.colTarget": "Target",
  "admin.audit.colDetail": "Detail",
  "admin.audit.colWhen": "When",
  "admin.audit.change": "{{before}} → {{after}}"
}
```

**Why**. *The same path that performs the change* becomes what that path is. A trigger runs inside the
transaction of the update that fires it, so a status cannot change without its row, and the caption can say
so in words an admin can check against the migration.

---

### S-038 · `/admin/audit` · empty state (the page's W line)

**Was:**

| Key | Now |
|---|---|
| `admin.audit.emptyTitle` | Nothing has been recorded yet |
| `admin.audit.emptyBody` | The log fills as administrators act. It cannot be seeded with a placeholder row, because a placeholder in an audit log is a lie with a timestamp. |

The dummy's visible text is identical.

```json
{
  "admin.audit.emptyTitle": "Nothing has been recorded yet",
  "admin.audit.emptyBody": "The log fills when an admin changes a message’s status. It holds no placeholder row, because a placeholder in an audit log is a lie with a timestamp."
}
```

**Why**. This page's one W line, kept from the dummy and trimmed. The first sentence now names the one action
that fills the log, since the triage columns of a message are the only thing the trigger watches.

---

## 404 (`errors.json` → `notFound.*`, `common.json` → `action.*`, dummy `404.html`)

### S-039 · 404 · code, H1, lede, two buttons

**Was:**

| Key | Now |
|---|---|
| `notFound.code` | 404 |
| `notFound.title` | This path does not exist. |
| `notFound.lede` | Which is at least consistent: the tool refuses paths it does not recognise too. Nothing was deleted. |
| `action.goHome` | Go to the home page |
| `action.seeEveryPage` | See every page |

The dummy's visible text is identical.

```json
{
  "notFound.code": "404",
  "notFound.title": "This path does not exist.",
  "notFound.lede": "Nothing was deleted. The address may be mistyped or come from an old link; the home page and the list of every page are one link away.",
  "action.goHome": "Go to the home page",
  "action.seeEveryPage": "See every page"
}
```

**Why**. The dummy's first sentence was the driest line on the surface, and it went for two reasons. The row
allows W in empty states only, and a 404 is an error page. The claim was also loose, because the chokepoint
refuses any path outside a declared root, which is narrower and stronger than paths it *does not recognise*.
What stays is the brief's fact, *Nothing was deleted*, then the likely reason and both ways out; it agrees
with the route's meta description, and *every page* is accurate because `/sitemap` lists all twelve routes in
the registry.

---

## The error page (`errors.json` → `error.*`; not in the dummy)

### S-040 · error page · code, H1, lede, buttons, the developer-only summary

**Was:**

| Key | Now |
|---|---|
| `error.code` | Error |
| `error.title` | This page did not finish loading. |
| `error.lede` | Something on our side failed, not on yours. Nothing on your machine was touched — this site only ever reads. |
| `error.retry` | Try again |
| `error.detailSummary` | What went wrong |

Not in the dummy.

```json
{
  "error.code": "Error",
  "error.title": "This page did not finish loading.",
  "error.lede": "It hit an error partway through, and nothing on your machine was touched. The “Try again” button runs this page once more without reloading the site; if it keeps failing, open an issue on GitHub.",
  "error.retry": "Try again",
  "error.detailSummary": "What went wrong"
}
```

**Why**. Not in the dummy, and the catalogue says so in `_provenance`; these words count as approved only
once the dummy draws an error page. Two claims went. *This site only ever reads* is false, since the contact
form, the inbox and account deletion all write, and *our side* is first person plural, which the fingerprint
bans; *not on yours* was also a certainty nobody has about a render error, which a browser extension can cause
as easily as a bug. The new lede says what happened and what the button does: `reset` re-renders the route
without a reload (`src/routes/__root.tsx:68-74`). The humor-emotion review restored the what-is-safe beat with
the one part of the old lede that was true of a render error, *nothing on your machine was touched*, and the
lede now ends on the same GitHub route as S-013 and S-023. Two sentences, as the error shape allows.

---

## Reported, not written

None of these is copy, and none is in this draft's scope; each changes whether a slot above renders or reads
true.

| # | Where | What | Suggested |
|---|---|---|---|
| 1 | dummy `wire.js` | The contact check refuses under 12 characters; the database minimum is 10 | amend to 10 with S-009 |
| 2 | dummy `account.html` | Five demo rows in the synced block; the app shows three | the dummy absorbs the app's three (§10a) |
| 3 | dummy `admin-users.html` | Runs and Last seen columns, and a caption about run counts, which the own-row policies make impossible | the dummy absorbs the app's columns and S-035's note |
| 4 | app `src/routes/admin/route.tsx` | No page head on any admin route; the dummy draws one on each, and S-027's lede now carries the sentence an admin needs first | render `PageHead` with S-027, S-032, S-036; **a precondition of applying this surface** |
| 5 | app `src/routes/admin/index.tsx:89` | `{{subject}}` is cut at 28 characters with no ellipsis | append `…` when cut |
| 6 | app `ContactForm.tsx:93-95` | `{{max}}` renders `4000`, not `4,000`, while S-013 writes 4,000 | pass `formatNumber(...)`; **a precondition of applying this surface** |
| 7 | desktop `src/lib/sync.ts` | `pushSettings` and `pushRun` have no caller, so `/account`'s synced blocks stay empty | wire them; S-017 and S-019 can then name the trigger |
| 8 | dummy | No error page; S-040 is unapproved prose until it draws one | §10a |
| 9 | dummy `wire.js` toasts | Sign-out, deletion and send toasts describe the prototype | take S-011, S-020, S-023 |
| 10 | app `src/routes/signin.tsx` | A Google sign-in cancelled at Google lands on `/account`'s signed-out state with no word about what happened | a string for that return, once sign-in is enabled |
| 11 | app `src/routes/admin/users.tsx` | A failed users query renders the "No account matches that" empty state | show the failure instead; **a precondition of applying S-034's aside** |
| 12 | app `src/routes/admin/index.tsx:83` | The inbox refusal is a toast only; the feedback ladder puts a failure at its cause | noted for the interaction pass |
| 13 | app `src/routes/signin.tsx:60-72` | No pending state on the Google button | wire `isPending` for S-003's `signin.opening` |
| 14 | app `src/routes/contact.tsx` and dummy `contact.html` | No sign-in-off branch: every visitor today sees **Sign in**, which leads to a disabled button on `/signin` | add band 14's `!signIn` branch (`src/components/home/Contact.tsx:49-63`) rendering S-041, with **Open a GitHub issue** its only live action; **a precondition of applying this surface** |
| 15 | app `src/routes/admin/index.tsx:82-83` | Any failed triage write shows `admin.inbox.refused`, but `setRequestStatus` also returns `ok: false` for a missing client or a database error (`src/lib/admin.ts:155`, `:171`), where *The database returned no rows* names the wrong cause. Found at finalize | when `result.failure` is set, show `t(failureKey(result.failure))`, S-013's line for that failure, and keep `admin.inbox.refused` for zero rows; **a precondition of applying this surface** |
| 16 | app `src/routes/admin/index.tsx:160-166`, `src/routes/admin/audit.tsx:82-89`, `src/routes/account.tsx:92-118` | #11's defect on three more screens: a failed read returns no rows and a `failure` nothing reads (`src/lib/admin.ts:80`, `:218`; `src/lib/account.ts:60`, `:88`), so the empty state draws. *The inbox is empty* and *Nothing has been recorded yet* are then false, and S-038's W line sits in a failure, although its words stay true. `/account`'s two blocks are empty today anyway, because nothing syncs. Found at finalize | show the failure instead, as #11 does |

---

## NEEDS DECISION

**NEEDS DECISION 1, answered 2026-09-13: option (a)**. The question was what Sign out on `/account` should
sign out of, because the catalogue said *on this device* while `signOut()` ran on the library default and
ended every session the account had. This browser only. The approved dummy's own note already said so, which
made the code the defect, and `src/lib/auth.ts:64` now calls `supabase.auth.signOut({ scope: 'local' })`;
S-020 carries the option (a) sentence.

The options as asked, kept for the record: (a) the local scope and the sentence now in S-020; (b) keep the
global scope; (c) offer both, which would have added a control the dummy does not draw.

No NEEDS DECISION is open in this draft.

---

## Self-check

- **Palette:** P carries every slot. W lands twice, in two admin empty states: S-038, and S-034 once Reported
  #11 lands, until when S-034 keeps its P sentence. S-017's plain line is P again after the humor-emotion
  review, and the 404's dry line was removed on the row's letter. The deletion slots and every error carry no
  humour, no urgency and no softening of *cannot be undone*; the deletion failure (S-023), the two contact
  errors that can outlast a retry (S-013's `refused` and `unknown`) and the error page (S-040) all end on the
  same GitHub route.
- **Rhythm:** measured after this round, on the shipping strings only. The scope is the prose keys (ledes,
  bodies, notes, hints, captions, errors and empty states, 55 keys); labels, buttons, crumbs, titles, column
  heads and status and role values are excluded. Sentences split at a full stop, question or exclamation mark
  before a capital; a `{{…}}` interpolation counts as one word, a `<mono>` tag as none and *6.5* as one. The
  figures: 100 sentences, 1,137 words, median 10, burstiness 0.63 against the fingerprint's 0.45. Over every
  key: 1.03. The line edit's 103 sentences and 1,130 words came from a slightly different inclusion
  set or tokenizer (this one reads 101 and 1,123 on the same pre-round text), so the gap is scope, not drift.
  Shortest shipping sentences *Sent.* (1 word, kept) and *Nothing changed.* (2, S-029), longest the first
  sentence of `account.deleteWhatGoes` (31 words), with that paragraph running 31, 3 and 4. The rubric's
  one-sentence-of-25 per 150 words now holds on every window but one, from S-033's caption to S-039's lede,
  whose longest sentence is 24 words. Padding one to reach 25 would be the fault the rubric names. It is left.
- **Length:** largest rendered state per screen, against *a screen each*, with the same tokenizer: `/signin`
  132 words · `/contact` 111 · `/account` 245 · `/admin` 109 · `/admin/users` 86 · `/admin/audit` 84 · the
  no-admin state 50 · 404 41 · error page 49, from 1,441 words across 177 keys in 41 slots. Empty states: two
  sentences at most.
- **Unsure:** no NEEDS DECISION is open. Preconditions of applying this surface: Reported #4 (the admin page
  heads, without which the plain-line-first structure holds in the dummy only), #6 (the `{{max}}` format), #14
  (the `/contact` sign-in-off branch, which S-041 needs) and #15 (a failed triage write shown as a refusal,
  added at finalize); S-034's aside also waits for #11. S-003's
  *Opening Google…* and S-033's role labels need a line of code each; *Read-mostly* is kept from the brief
  although the users page has no write control. S-006's lede sat above S-041 offering to send
  from this page, which S-041 says cannot happen yet; the line edit made its first sentence name both routes
  without claiming either is open, so no tension between slots is left on this surface.
