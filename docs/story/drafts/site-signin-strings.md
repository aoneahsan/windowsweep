# site-signin-strings - the four strings Google sign-in going live makes false, and the privacy blurb

Content-map row **18** `site-app` · awareness **working** · structure **plain lines above dense tables; every
action names what it does** · palette **P, W in the empty states** · length **a screen each** · CTA **varies per
screen** · schema **none**. Row **19** `site-front-site` · awareness **a machine, or a search result** · structure
**answer-first** · palette **P only** · length **short** · CTA **none** · schema **untouched here**.

Status: **publish-ready, finalized 2026-09-25**. Round 1 closed with a fact-check PASS, and the finalizer's sheet
is under *Finalize* at the end. The run is the one `decision-log.md` opens under *rows 18 and 19 (`site-app`,
`site-front-site`): the strings sign-in going live makes false*. Both rows sit inside the standing GATE 4
pre-authorisation, which asks for a finalizer PASS and zero open NEEDS DECISION. Round 1's revision applied the
developmental editor's two findings: S-001 gets its *only* back, and S-003's second sentence becomes two. S-004's
passive stays, as that review advised. S-005, the privacy blurb, joins at the main session's decision. The
writer's one NEEDS DECISION and the fact-checker's three were answered in the main session, so none is open. The
Bible was approved at GATE 1 on 2026-09-05; the fingerprint is still `calibrated: false`, open and not blocking.
en-GB throughout.

---

## What this draft covers, and what it does not

Five slots. Google sign-in went on at the backend on 2026-09-24 (D25), and the first build that carries the
Supabase pair probes it and turns the site's sign-in state on. Two strings render in every state and turn false
with it. One has been false since the error page gained its own head. The fourth is new, for web TASK-007. The
fifth has nothing to do with sign-in. It joined in this revision, because its second half names the copy's own
register, the shape the Terms page's humor-emotion reviewer flagged on its sibling.

| Slot | Key | Row | Renders |
|---|---|---|---|
| S-001 | `seo.signin.description` | 19 | every build state: the static head (`vite/prerender.ts:374`, `:379`) and the client-side head (`src/lib/head.ts:136`, `:155`) |
| S-002 | `sitemap.blurb.signin` | 19 | every build state: the `/sitemap` card (`src/routes/sitemap.tsx:112`) and its static body (`vite/prerender-pages.ts:343`) |
| S-003 | `seo.error.description` | 19 | the error page, in any state (`src/lib/head.ts:116`) |
| S-004 | `signin.cancelled` **NEW** | 18 | an ON build only, on the return from a sign-in cancelled at Google |
| S-005 | `sitemap.blurb.privacy` | 19 | every build state: the `/sitemap` card (`src/routes/sitemap.tsx:112`) and its static body (`vite/prerender-pages.ts:343`) |

| Not in this draft | Why |
|---|---|
| `signin.blockedLead`, `signin.blocked`, `contact.blockedLead`, `contact.blocked` | they render in an OFF build only; *Reported, not written* #1 is the limit on calling that fine |
| `seo.signin.title` (*Sign in · windowsweep*) | true in both states |
| `db.error.unknown` | reused unchanged by NEEDS DECISION 1's option (a) |

---

## Conventions in this file

- One slot per string, `S-001` to `S-005`, numbered for this file alone.
- **`Was:`** is the current catalogue value, byte-exact and findable with `grep -F` in the named file. The dummy
  line named in the heading carries the same text unless the slot says otherwise.
- The fenced block holds the **shipping words** as a JSON object, flat dotted keys exactly as `t()` receives
  them. Per `frontend-ui-standards.md` §10a the dummy is amended first and the app matches it, so every slot
  names its dummy line.
- Row 19's strings carry their rendered length, counted with `[...s].length` in Node as `site-front-site`
  counts. A description stays at 155 characters or fewer.
- The lint hook strips fences. All five values were therefore checked by hand, against the banned list, the
  fingerprint's never-list and its punctuation budget; the check is near the end, and a green hook says nothing
  about them.
- Line numbers cite the snapshot below. They are evidence, not the contract: apply by key. `/terms` was added on
  2026-09-25 and moved several of them, so a line number is a snapshot. The ones found stale cite that day's tree
  instead: `seo.json:34` and `:42`, `sitemapBlurbs.json:11`, `pages-registry.js:41`, `routes.json:105` and
  `prerender-pages.ts:343` from the fact-check, and `public/llms.txt`'s lines 21, 22 and 26-27 at finalize. Every
  other number is the snapshot's.

**Snapshot, 2026-09-24** (paths under `windowsweep-web/`; the dummy is `design/windowsweep-web-click-dummy/`,
since the brief's `design/windowsweep-click-dummy/` does not exist):

| File | md5 |
|---|---|
| `src/lib/i18n/locales/en/seo.json` | `1a07987f4c40eb7c45028c5ebb61c7e4` |
| `src/lib/i18n/locales/en/sitemapBlurbs.json` | `0df82ddc829d577ab7319dbddd6a4539` |
| `src/lib/i18n/locales/en/account.json` | `3d434e72b66db77ff31563e88ad996af` |
| `src/lib/i18n/locales/en/contact.json` | `e0e7222678514ba53bdab004cec6162a` |
| `src/lib/i18n/locales/en/errors.json` | `b35831ea1a62e08e7af14afed3a2ca64` |
| `public/llms.txt` | `e808d83e25389d428be30b4052d54218` |
| dummy `signin.html` | `7f649eeeeb25caa35b7bea507a2605aa` |
| dummy `error.html` | `5bb28a7113565bdc233199d9668cd45c` |
| dummy `pages-registry.js` | `a108373828bac210ffb20c4d3001bdf0` |
| dummy `wire.js` | `69c098a26ededa2ecd38cb43ec2699c9` |
| `src/lib/auth.ts` | `b4301a31877bf5b69be1ccfba036f3a6` |
| `src/routes/signin.tsx` | `f09aab57db85b267cc8a5276c03acb3e` |
| `src/lib/head.ts` | `1e7d5b3a07cae09c96f4d7fefb6ccb5e` |
| `src/components/layout/ErrorPage.tsx` | `d2c6e71e3d05f3f6353437f3c946396f` |
| `vite/prerender.ts` | `7221948ec8fe328e77e1b88fcbed393c` |
| `vite.config.ts` | `91aca66982310b8154e6aaeb5910d70a` |
| `src/content/routes.json` | `4b2db75bb5b7a51f0c57cc70e5cfeddb` |
| `src/lib/i18n/locales/en/privacy.json` | `dd05d7d34b21dffd12638a0f2cb6d37c` |
| `src/routes/sitemap.tsx` | `571d7b67f629805db96aca87a9a4b820` |
| `vite/prerender-pages.ts` | `77d6fb1162e6ed5433a9fce919f3e784` |
| dummy `page-index.js` | `d23db76e350e17725d55edd07d8b08d2` |

---

## S-001 · `/signin` · `<meta name="description">` (`seo.json` → `seo.signin.description`, dummy `signin.html:7`)

**Was:**

| Key | Now |
|---|---|
| `seo.signin.description` | Google sign-in on the shared account used by the desktop app. It is not enabled yet, and this page says so rather than failing when you press it. |

The dummy's `signin.html:7` is identical.

```json
{
  "seo.signin.description": "Google sign-in for one account, shared with the desktop app. Only two things need it: sending a message from this site and reading what the app has synced."
}
```

**155 characters**, 28 words, at the cap. One string for both build states.

**Why**. Answer-first: what the page is, then what it is for, and both halves are the page's own words. The first
sentence puts the provider in front of the H1 (*One account, shared with the desktop app.*), joined by *for*
rather than a colon, so only the second sentence turns on one. The second is the lede's count with its limiting
word (*Signing in is **only** needed for two things*). *Only* is the guarantee. This is the one version a
link-preview reader gets, and without *only* it reads as a list where the page reads as a limit: a disk cleaner
with no login wall. *From this site* stands in for *that can be replied to*, because a GitHub issue is a message
too and needs no account. *Back* and the comma before *and* were cut to make room for *only* and *for*. Neither
sentence reports the provider's state. So both hold in an ON build and in an OFF one.

**No OFF variant**. The brief asked, and the answer is no, for three reasons.

1. **The OFF state outlives D25**. `probeGoogleSignIn` answers `false` for a blank pair, a non-OK response, any
   thrown error and a four-second abort (`vite.config.ts:362-376`), so a build with the pair filled can still ship
   OFF on a bad minute. A description bound to one state would then be false in the other.
2. **A variant needs the flag in two writers**. The static head and the client-side head both build the key as
   `seo.${id}.description` (`vite/prerender.ts:374`, `src/lib/head.ts:136`). A string true in both states needs
   neither to change.
3. **Nobody meets it in a search result**. `/signin` is `indexable: false` (`src/content/routes.json:105`) and
   ships `noindex` (`vite/prerender.ts:359-364`, `:380`). It is read by a crawler told not to index the page and by
   the preview of a shared `/signin` link. The state is the body's job, and the body already does it:
   `signin.blocked` renders in an OFF build only, and `assertSigninBranch` fails a build whose static page
   disagrees with its flag (`vite/prerender.ts:309-316`).

**The dummy carries** the new value at `signin.html:7`.

---

## S-002 · `/sitemap` · the Sign in card's blurb (`sitemapBlurbs.json` → `sitemap.blurb.signin`, dummy `pages-registry.js:41`)

**Was:**

| Key | Now |
|---|---|
| `sitemap.blurb.signin` | Google, on the shared Supabase project. Carries the honest not-configured-yet state, because that is today’s truth. |

The dummy's `pages-registry.js:41` is identical.

```json
{
  "sitemap.blurb.signin": "Google, on the shared Supabase project. Not needed to download anything or to run any of the 26 sections."
}
```

**105 characters**, 19 words. The other eleven blurbs run from 76 to 123.

**Why**. The first sentence is the half of the old blurb that stays true, kept word for word. The second trades a
state report for the page's own refusal list (*What it is not needed for* · *Downloading anything, or running any
of the 26 sections*), which holds in every build. The shape is the file's: a fragment carrying one fact, like
*Signed-in only.* and *Append-only.* beside it. Nothing on `/sitemap` reads the sign-in flag, in the app
(`src/routes/sitemap.tsx:112`) or in the static body (`vite/prerender-pages.ts:343`), so a variant would add a
branch to both, and S-001's first reason applies unchanged. No OFF variant. One side effect, harmless: the filter
searches blurbs (`src/routes/sitemap.tsx:48-57`), so a visitor who types *download* now also meets this card, and
its words answer them.

**The dummy carries** the new value at `pages-registry.js:41`, which `page-index.js:45` draws.

---

## S-003 · error page · `<meta name="description">` (`seo.json` → `seo.error.description`, dummy `error.html:7`)

**Was:**

| Key | Now |
|---|---|
| `seo.error.description` | That path does not exist on this site. Nothing was deleted. The home page and the sitemap are both one link away. |

The 404's words, verbatim (`seo.notFound.description`, `seo.json:34`). The dummy's `error.html:7` is identical.

```json
{
  "seo.error.description": "This page hit an error partway through loading. Nothing on your machine was touched. The home page is one link away."
}
```

**116 characters**, 21 words.

**Why**. Three facts, each already on the page: the H1 and the lede (*This page did not finish loading.* · *It hit an
error partway through, and nothing on your machine was touched.*), and the one link every render of it draws,
**Go to the home page** (`src/components/layout/ErrorPage.tsx:107-109`). Two things are left out on purpose. It
does not say the page exists: `RootLayoutFailure` writes this head on any path when the layout itself throws
(`src/routes/__root.tsx:99-104`, `:112`), an unknown one included, and there *exists* would be false. It names no
retry either, because **Try again** draws only when the router passes `reset` (`ErrorPage.tsx:102-106`) and
*Reported, not written* #6 doubts what it recovers. After the first sentence it keeps the 404's beats, each a
sentence of its own: the refusal, then the next action (*Nothing was deleted. The home page and the sitemap are
both one link away.*). Joined by *and*, the two beats were one. So the two descriptions part at their first
sentence, which is the one that gets read, and match after it.

**The dummy carries** the new value at `error.html:7`. Its comment at `error.html:31-36` changes in the same edit
(#4 below).

---

## S-004 · the sign-in control · a sign-in cancelled at Google (`account.json` → `signin.cancelled`, NEW; web TASK-007)

**Was:** (new). Today the return lands on `/account`'s signed-out state (`SIGN_IN_REDIRECT`, `src/lib/auth.ts:24`)
and says nothing about the attempt (`site-app` *Reported, not written* #10; web `PENDING-TASKS.md`, TASK-007).

```json
{
  "signin.cancelled": "Sign-in was cancelled on Google’s page, so no account was created or changed."
}
```

**13 words**, one line.

**Why**. The brief's two beats, in its order: what happened, then what did not. *On Google’s page* is the site's own
name for that step (`signin.opensBrowser`: *Sign-in happens on Google’s own page*). The second clause says
**account** and stops there, a noun chosen for precision. auth-js 2.116.0 writes a PKCE verifier into this
browser the moment the press starts the flow (under `node_modules/@supabase/auth-js/dist/module/`:
`GoTrueClient.js:4797`, `:4840-4842`, `lib/helpers.js:395`), and its error path leaves it in place
(`GoTrueClient.js:403-418`), so the clause claims what the line can vouch for and nothing about the browser's own
storage. It is the narrowing the Bible's correction of 2026-09-07 gave a dry-run, from *writes nothing* to *writes
nothing of yours*. S-003's sentence is a different claim: *your machine* is the glossary's noun for the disk the
product cleans and the files on it, never the browser's own storage (Bible §7, 2026-09-25). The shape is
fingerprint specimen 1's, a state reported plainly (*This was a dry-run.*). It ends on the
limit rather than on a button's name, so it reads true beside **Continue with Google** on `/signin` and beside
**Sign in** on `/account`. The passive stays. As the review noted, the parameters survive a refresh and travel in a
copied link (#8 below), so whoever reads the line may not be the person who cancelled, and *you cancelled* would
be the riskier claim.

**Where it renders**. The words hold in either place, and the dummy follows the choice: `signin.html`, beside the
Google button, if the return is sent on to `/signin`; `account.html`, inside the signed-out notice, if the line
renders where the redirect lands. Recommended: `/signin`. The answer belongs at the control that was pressed, and
TASK-007 already names `signin.html`. The dummy also needs a way to reach the state, because its `googleSignIn`
goes straight to `account.html` (`wire.js:370-374`); the URL state the app reads is the natural one.

**Shown only after a cancel**. Which returns count was NEEDS DECISION 1, answered (a) below: a real cancel's exact
parameters only. Pressing Back on Google's page sends no error at all (#7 below), and after a cancel its
parameters stay in the address (#8).

---

## S-005 · `/sitemap` · the Privacy card's blurb (`sitemapBlurbs.json` → `sitemap.blurb.privacy`, dummy `pages-registry.js:30`)

**Was:**

| Key | Now |
|---|---|
| `sitemap.blurb.privacy` | What each of the three programs sends. A safety surface: no humour, no urgency, no promised switch. |

The dummy's `pages-registry.js:29-30` is identical.

```json
{
  "sitemap.blurb.privacy": "What each of the three programs sends. No promised switch: a notice rather than a consent request."
}
```

**98 characters**, 17 words. The other blurbs run from 76 to 123, counting S-002's new value and the Terms blurb at
123 in its current draft.

**Why**. The first half stays word for word; it is the page's own heading, *What each of them sends*, with the
lede's count of three programs. The second half named the copy's register in the story system's words (*safety
surface*, *no humour*, *no urgency*), which no reader of `/sitemap` has been given. On a page with humour off, a
line that knows its own register is the nearest thing to a wink. The Terms page's humor-emotion reviewer found
that shape on `sitemap.blurb.terms` (`decision-log.md`, the D38-D41 block), and the main session sent this one to
the same fix. The replacement is how the page describes itself (`privacy.json:5`: *This page is a notice rather
than a consent request, and nothing on it asks you for an answer.*). *No promised switch* stays. It is a product
fact, not a register: the analytics has had no opt-out since the owner removed it on 2026-09-07, and the lede
opens on *There is no switch.* The fact goes first, and the colon makes it the reason the page is a notice. That
order also keeps this card's second sentence off *A notice*: the Terms blurb (S-011 of `site-terms.md`), built on
this one's two-part shape, opens its own second sentence on *A notice to read*, and `/sitemap` draws it directly
below this card. Two cards in a row, same beat, same two words, would read as a template. Nothing on `/sitemap` or
`/privacy` reads the sign-in flag, so the blurb holds in every build state. The filter searches blurbs
(`src/routes/sitemap.tsx:48-57`), so *consent* now finds this card and *humour* no longer does.

**The dummy carries** the new value at `pages-registry.js:30`, which `page-index.js:45` draws.

---

## Every other string that says sign-in is off

Grepped in `src/lib/i18n/locales/en/` and `public/llms.txt` for *not configured*, *not enabled*, *not been
enabled*, *dormant*, *not yet*, *until it is* and every sign-in key.

| Key or file | Says | Renders | Verdict |
|---|---|---|---|
| `signin.blockedLead` (`account.json:6`) | Sign-in is not configured yet. | OFF build only (`src/routes/signin.tsx:58-65`), held to the flag by `assertSigninBranch` | fine, with #1 below |
| `signin.blocked` (`account.json:7`) | Google sign-in has not been enabled on the account server … | OFF build only, the same branch | fine, with #1 |
| `contact.blockedLead` (`contact.json:6`) | Sign-in is not configured yet. | OFF build only, in `ContactGate` (`src/components/contact/ContactGate.tsx:45-51`) on `/contact` and in the home page's band 14, held by `assertContactBranch` | fine, with #1 |
| `contact.blocked` (`contact.json:7`) | Google sign-in has not been enabled on the account server … | OFF build only, the same gate | fine, with #1 |
| `seo.signin.description` (`seo.json:42`) | It is not enabled yet … | every state | must change: S-001 |
| `sitemap.blurb.signin` (`sitemapBlurbs.json:11`) | … the honest not-configured-yet state … | every state | must change: S-002 |
| `public/llms.txt` | nothing of the kind | - | no change. Line 21, *signing in is required so a reply has somewhere to go*, is true in both states |

The dummy splits the same way. `signin.html:50-53`, `contact.html:46-49` and `index.html:778-781` render OFF only
(`data-wsw-if="signInOff"`, `wire.js:126`). `signin.html:7` and `pages-registry.js:41` render always; they are
S-001 and S-002. `src/lib/auth.ts:43` also names `signin.blockedLead` as a `reasonKey` that nothing renders (#5).

---

## Reported, not written

None of these is copy in this draft's scope. Each changes whether a slot, or a string beside one, reads true.

| # | Where | What | Suggested |
|---|---|---|---|
| 1 | `vite.config.ts:361-377`; `signin.blocked`, `contact.blocked` | **An OFF build is still reachable after D25**. The probe answers `false` on a blank pair, a non-OK response, a throw or a four-second abort. From 2026-09-24 both OFF bodies are false whenever they render, because the account server has Google enabled and only the build failed to confirm it. *OFF only, so fine* holds only while an OFF build means Google is off | fail a build that carries the pair and gets no answer, so OFF ships only from a pair left blank on purpose; the build already needs the network for TASK-006's release check. Or reword the two bodies to what a build can know, a row 18 change outside this draft |
| 2 | dummy `wire.js:41-46`, `demo.js:14-18`; `src/lib/auth.ts:4-10`, `src/routes/signin.tsx:4-8`, `src/lib/features.ts:13-15`, `vite.config.ts:354-359` | comments, never rendered, that call the provider off, dormant or *today's truth*; false since D25. `GOOGLE_SIGN_IN = false` is the dummy's half of the switch, and §10a has the dummy show the finished product | flip the switch with the deploy, and correct the comments |
| 3 | `public/llms.txt:26-27` | *they hold one person's own data*: `/signin` holds none, and the three admin pages hold every account's messages, the users list and the audit log. One person's own data is `/account`, which line 22 lists. Row 19's approved S-003; not a sign-in-state string | say what the gated pages hold, at row 19's next pass |
| 4 | dummy `error.html:31-36`; `seo.json:3` | both notes predate S-25. The comment says the error page keeps the failed route's `<head>` and *has no title of its own in the product*; `_provenance` says the dummy has no head block for it. `applyErrorHead` writes its own title, description, og pair and robots tag and keeps only the canonical (`src/lib/head.ts:108-123`), and `error.html:6-7` carries a head | correct both with S-003 |
| 5 | `src/routes/signin.tsx:77-84`; `src/lib/auth.ts:43`, `:51` | `signInWithGoogle` returns a `reasonKey` that nothing renders: the press reads `result.ok` alone, so a failed start puts the button back with no word. TASK-007's silence, on the way out instead of the way back | render the key at the control; `db.error.unknown` is already its value for a failed start |
| 6 | `@tanstack/react-router` 1.170.33, `dist/esm/lazyRouteComponent.js:35-46` | a failed route chunk is thrown again from cache on every render after its one automatic reload, so **Try again** (`reset`, `ErrorPage.tsx:102-106`) redraws the same failure. The dummy's own sample message is that case (`error.html:58`). `error.lede` stays true, since it names a route for a repeat, but for a stale chunk after a deploy the retry that recovers is a reload. Read in the package, not exercised | plant a chunk failure and press it before the next error-page round |
| 7 | `src/routes/signin.tsx:38`, `:76-79` | Back on Google's page sends no redirect, so no error reaches the site and S-004 cannot show. If the browser restores `/signin` from its back-forward cache, `opening` is still true, since only a refusal resets it, and the button still reads *Opening Google…*. Not exercised | check both when TASK-007 is verified; reset `opening` on `pageshow` if the second is real |
| 8 | auth-js 2.116.0, `GoTrueClient.js:403-418`, `:3252-3258` | the error path returns without touching the address, so the parameters survive a refresh and travel in a copied link | clear them once read, or S-004 reaches a visitor who cancelled nothing |

---

## NEEDS DECISION

None open. Four were asked, and all four are answered: the writer's one on 2026-09-24 and the fact-checker's
three on 2026-09-25.

**NEEDS DECISION 1 (S-004), answered 2026-09-24: (a)**. The question was which returns show `signin.cancelled`,
because the redirect carries more than cancels. auth-js 2.116.0 treats any `error`, `error_description` or
`error_code` in the address as a failed return (`GoTrueClient.js:3252-3258`, `:3347-3351`), and its own code list
holds `signup_disabled`, `user_banned`, `bad_oauth_state` and `bad_oauth_callback` among others
(`lib/error-codes.d.ts:6`). After one of those, *cancelled* is false and *no account was created* is unproven. Two
options were put. **(a)** Show it only for the exact parameters a real cancel returns on the hosted project,
recorded when TASK-007 is verified, and show `db.error.unknown` for any other error on the redirect, the key
`src/lib/auth.ts:51` already uses for a failed start. As first put, (a) named those parameters *error and error
code both*; the fact-check corrected that, below. **(b)** Show one line for every error return, under a key named
for that (`signin.returnFailed`); it could then claim neither beat, and would read *Sign-in did not finish*. The
writer recommended (a).

**The answer, and its reason**. (a), decided in the main session rather than asked (`decision-log.md`, *2026-09-24
(later) - row 20's specialist round, and four more answers (D38-D41)*). Both options keep every sentence true, and
neither changes what the product does, so it was a wording call; (a) is the more specific one, and (b) would have
claimed neither beat for a real cancel. So `signin.cancelled` shows only for the exact parameters a real cancel
returns on the hosted project, recorded when TASK-007 is verified. Every other error on the redirect shows the
existing `db.error.unknown`.

**Corrected by the fact-check, 2026-09-25**. A real cancel is `error=access_denied` with **no** `error_code`.
GoTrue's `OAuthError` sets `error` and `error_description` only, while `signup_disabled`, `user_banned` and the
others carry an `error_code`. So `signin.cancelled` shows for exactly that signature. Every other error on the
redirect shows `db.error.unknown`.

**The fact-checker's three**. All three were decided in the main session as the fact-check recommended
(`decision-log.md`, *2026-09-25 - `site-signin-strings` round 1 closed*). None was an owner call. The log keeps
each answer and its reason but not the report's option lists, so each entry below keeps the question as the
answer frames it and names the option taken.

**S-003, fact-check NEEDS DECISION 1, answered 2026-09-25: the sentence stays**. The question: does *Nothing on
your machine was touched* hold, given the site's own storage in the browser? It stays. *Your machine* means the
disk the product cleans, the way the approved `error.lede` and both deletion bands already ship it. The browser's
own storage is `/privacy`'s to disclose. Bible §7 carries that definition as a glossary row from
2026-09-25.

**S-004, fact-check NEEDS DECISION 2, answered 2026-09-25: the residual misfire is accepted**. The question: a
Google Workspace administrator's block also returns `access_denied` with no `error_code`, so S-004 would reach a
reader who cancelled nothing. Accepted: *no account was created or changed* stays true for that reader, and
the case is rare for a consumer product.

**The consent screen, fact-check NEEDS DECISION 3, answered 2026-09-25: a MANUAL-TASKS row**. The question: where
the publish of the Google OAuth consent screen is recorded. It gets a row of its own, the main session's to write
at the records close-out, with the exemption that a sign-in asking only for email and profile needs no
verification.

---

## The by-hand banned-phrase check

Over the five fence values, re-run on this revision and again after the line edit reordered S-005: all 87 entries in
`aoneahsan-cccs-story-craft/assets/banned-phrases.txt`, the fingerprint's never-list, the glossary's *opt-out*
family, the three register words S-005 drops, first person plural and the pricing words, matched on word
boundaries. The matcher first caught a planted *humour* in S-005's old value. No hit. No em dash, no exclamation
mark, no *not X, but Y*, and no pricing claim in either direction. *Cancelled* is en-GB.

---

## Self-check

- **Palette:** P carries all five slots, in the order the rows ask: S-001 and S-003 answer first, S-002 and S-005
  keep the blurbs' two-fragment shape, and S-004 reports what happened, then what did not. No W: none of the five
  is an empty state, and row 19 allows none. No humour anywhere, which S-003's error page and S-004's failed
  attempt both require, and S-005 no longer names that register. S-001's *only*, the second sentences of S-002
  and S-003, S-004's second clause and S-005's *no promised switch* each state a limit, in P's register with no
  adjective, the way `site-app` classed `signin.for3`.
- **Rhythm:** measured over the five fence values only, sentences split at a full stop before a capital: 10
  sentences, 98 words, median 9, burstiness 0.38 (population standard deviation over the mean; round 1's four gave
  0.33) against the fingerprint's 0.45. Shortest 6 words, twice (*Google, on the shared Supabase project.* ·
  *Nothing on your machine was touched.*); longest S-001's second sentence (18). Still below target. Five unrelated
  strings, with S-001 at its cap and S-004 held to one line by the brief, leave no sentence room to reach 25 words
  without the padding the rubric names as the fault.
- **Length:** S-001 155 characters of 155 (28 words) · S-002 105 characters and 19 words, inside the other
  blurbs' 76 to 123 · S-003 116 of 155 (21 words) · S-004 13 words, one line against *a screen each* · S-005 98
  characters and 17 words, inside the same 76 to 123. 98 words in all.
- **Unsure:** no NEEDS DECISION is open. S-001 is at its cap, so a word added there needs one taken out, and its
  *only* is the approved lede's, which leaves out `/admin` (two fixed addresses) as the lede does. S-001 and
  S-002 recommend one string for both build states and no OFF variant. Where S-004 renders is the main session's
  call; its words hold on `/signin` and on `/account`, and `/signin` is recommended.

---

## Finalize, 2026-09-25

**Publish-ready**. This is the finalizer's humanize pass, checked against `docs/story/voice-fingerprint.md`
(`calibrated: false`) and the rubric in `aoneahsan-cccs-story-humanize`. **The lint hook cannot see this surface's
copy**: it strips code fences, and every shipping string here is a fence. That was measured, not assumed. On a
scratch copy of this draft, a banned word planted inside S-003's fence left the hook silent at exit 0. On a
second copy, the same word in S-003's Why paragraph was named at exit 2. The draft itself was never planted, and
its md5 was unchanged before the first edit. So the sheet's left column was computed by hand on the five values,
and its right column is the commentary the hook reads. A green hook says nothing about the copy. The reader and
the fact check are the gate.

No fence changed. Twelve rows pass on the five values, and the two rhythm rows are allowed with a reason. Each
string is too short for them to apply: one to three sentences and 13 to 28 words, under the rubric's five-sentence
floor and the hook's 60-word one. Pooled, the ten sentences score 0.38 and none reaches 25 words, but the moves
that would raise that number are the ones this surface rules out. Merging S-003's last two beats undoes the
developmental editor's split; merging S-001's two sentences buries *only*, which the same review restored. A
25-word sentence anywhere else would be padding, the fault the rubric names.

```
HUMANIZE - site-signin-strings - checked against docs/story/voice-fingerprint.md (calibrated: no)
Scope: left, the five fence values by hand (98 words, 10 sentences); right, the commentary as the hook
reads it (fences, tables and headings out). No fence changed, so the left column is before and after.
                     five values                            commentary  before -> after
 1 burstiness        n/a per string; pooled 0.38  ALLOWED   0.74 -> 0.72  PASS
 2 range             n/a per string; pooled 6-18  ALLOWED   17 of 17 windows -> 21 of 21  PASS
                                                            (fired twice mid-edit; fixed by a merge)
 3 banned            0 of 87; never-list 0  PASS            0 -> 0  PASS
 4 dashes per 150    0  PASS                                0 -> 0  PASS
 5 not-X-but-Y       0  PASS                                1, budget 8 -> 1, budget 11  PASS
 6 triplets          0  PASS                                7, budget 10 -> 7, budget 12  PASS
                                                            (13 mid-edit, six of them new; re-punctuated)
 7 openers           PASS  (one paragraph each)             PASS -> PASS (fired once mid-edit; fixed)
 8 throat-clearing   PASS                                   PASS
 9 summary tell      PASS                                   PASS
10 specificity       PASS  "the 26 sections"; "the three programs"; "one link away"; "Google’s page"
11 point of view     PASS  "Only two things need it"; "No promised switch"
12 hedging           PASS  none owed: each claim is certain and verified; the voice hedges only on doubt
13 voice match       PASS  under specimens 1, 5 and 11 ("This was a dry-run." / "Six sections need Windows
                           to ask your permission first." / "Emptying the Recycle Bin is permanent."):
                           "Nothing on your machine was touched." / "Only two things need it: ..." / "Not
                           needed to download anything or to run any of the 26 sections." do not sort apart
14 palette           PASS  P in all five, as rows 18 and 19 ask; no W, since none is an empty state;
                           no humour on an error page or a failed attempt
VERDICT: before - no FAIL but the pooled rhythm figure; after - 12 PASS, rows 1-2 ALLOWED (reason above).
Commentary: hook silent at exit 0 before the first edit and after the last.
```

```
FACT CHECK - round 1's report as decision-log.md records it (2026-09-25), re-read in the tree today
 verdict                                 PASS  60 claims verified; 3 contradictions, all in commentary
 open UNVERIFIABLE / CONTRADICTS / fail  none open; the main session's reconciled corrections are applied
 NEEDS DECISION                          4 asked, 4 answered, 0 open (the writer's 1, the fact-check's 3)
 seo-aeo report                          none: the lean panel ran no seo-aeo reviewer, and none was pasted
 a real cancel's signature               error=access_denied, no error_code: ND 1's option (a) and answer
 six stale line numbers                  each re-read before it was written: seo.json:34 and :42,
                                         sitemapBlurbs.json:11, pages-registry.js:41, routes.json:105,
                                         prerender-pages.ts:343
 S-004's precision note                  "account" chosen for precision; S-003 stays true under Bible 7
 caps                                    S-001 155 of 155 | S-002 105 and S-005 98, inside 76-123 |
                                         S-003 116 of 155 | S-004 one line, 77 characters
Also corrected, not on the list: public/llms.txt moved one line when /terms joined it, so the
draft's lines 20, 21 and 25-26 are now 21, 22 and 26-27, re-read today.
Changed since the snapshot and left as written: src/routes/signin.tsx, where TASK-007 is in the web
working tree. The draft's signin.tsx numbers and Reported #2, #5 and #7 describe 2026-09-24. That
tree's src/lib/auth-return.ts:41 classifies a cancel as error === 'access_denied' && !code, the
corrected signature.
```

Apply by key, the dummy first (`frontend-ui-standards.md` §10a), at the dummy line each slot names. S-004's value is
already in the web working tree, byte for byte, at `account.json:10` and the dummy's `signin.html:59`.
