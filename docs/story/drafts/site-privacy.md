# site-privacy - `/privacy` and the footer notice line

Content-map row **17** · surface `windowsweep-web/design/windowsweep-web-click-dummy/privacy.html` +
`shell.js` · awareness **being told, not asked** · structure **the one line -> the four destinations -> the
refusals -> the CLI's zero-network fact** · tone band **P and R only. No humor at all** · length **one page**
· CTA **none** · schema **none**.

🔴 **This is a safety surface.** `story-craft/references/safety.md` was read before the first sentence. Humor
is off. There is no urgency or shame language anywhere, and no sentence offers reassurance the facts do not
support. Row 17 marked it so deliberately: it is the page that tells a reader their behaviour is recorded,
that a session replay exists and that there is no switch.

The reader did not opt into anything and cannot opt out. So the page has one job, and persuasion is not it:
be straight, be fast, and be checkable. Every claim below either names a mechanism the reader can run
(`--self-test`, the storage inspector) or names a thing that is stored so plainly that finding it is
confirmation rather than a surprise.

## The two facts the page has to hold apart

Row 17's amendment states the trap in its own words: *"Those are three different programs, and the page says
which is which."*

| Program | What it sends | Where that is enforced |
|---|---|---|
| The command-line engine | nothing at all | self-test check `[9] No network code`, `modules/release_helpers.ps1:222` - greps every source file for `Invoke-WebRequest`, `Invoke-RestMethod`, `Net.WebClient`, `HttpClient`, `Sockets.TcpClient`, `curl.exe`, `wget `; a hit fails the build |
| The desktop window | usage events + crash reports, no opt-out | `desktop/src/lib/analytics.ts` |
| This website | usage events + crash reports, no opt-out | the site's own analytics wiring (not built yet) |

**Neither direction may bleed.** The engine's clean record says nothing about the window, and the window's
telemetry takes nothing away from the engine. Every slot below was written and then re-read a second time
asking only one question: *does this sentence let a reader carry one program's answer over to another?* Four
sentences were changed on that second read, and they are marked in their `Change:` lines.

## Conventions in this file

- One numbered slot per block, `S-001` upward, no gaps. Each names its file and element.
- **`Was:` reproduces the block's current visible text**, verbatim, with the dummy's source line-wrapping
  collapsed to single spaces, or reads `(new)` where no block exists yet.
- The fenced block below `Was:` holds the **shipping HTML** for that block's interior. Substitute the
  interior; leave the wrapper element, its classes, its inline styles and its `data-wsw-copy` attribute
  alone. 🔴 **The fence content is the exact string that ships.**
- 🔴 **Line numbers are NOT part of the contract.** Apply by fixed-string search.
- **Snapshot:** `privacy.html` md5 `dae0cac3455a278acde176d88e3be1d7` (132 lines, 4 blocks marked
  `data-wsw-copy="pending"`) · `shell.js` md5 `18c7a579e8982965f33cb55d0385c297` (253 lines).
- **en-GB** throughout.

## 🔴 The lint hook cannot see any of the copy below

`posttooluse-story-lint.sh:61` strips every code fence before it counts anything. This surface is
slot-shaped, so **every shipping string sits inside a fence and none of it is measured**. A green hook here
is a report about this commentary and about nothing a reader will ever see.

So the banned-phrase check was **run by hand**, word by word, against
`aoneahsan-cccs-story-craft/assets/banned-phrases.txt`, over the fence contents only. Result in the
self-check at the end. The fact-checker and the human reader are the real gate on this surface, and that is
stated here rather than left to be discovered.

## What changes, what stays, what is new

**Eleven slots. Four are new**, because the row's structure asks for beats the dummy has no element for:
cookies and browser storage (S-008), and the closing zero-network beat with the address for a privacy
question (S-010). Two more are new sub-blocks inside existing sections (S-007's stored-facts paragraph,
S-004's fourth destination line).

🔴 **Adding a block to an approved dummy is a structural amendment**, not a copy substitution.
`frontend-ui-standards` §10a puts it in the dummy first with its reason in `design/README.md`. **That edit
is the parent session's, not this draft's** - this file may write only itself.

## Four facts this draft corrects

1. 🔴 **"There are two programs" is one short** (S-001). Three carry the name: the command line, the desktop
   window and this website. Two answers, three programs - and row 17's amendment requires the page to say
   which is which. The H1 said two.
2. 🔴 **The self-test count is removed rather than restated** (S-003). `privacy.html` says *"One of the 151
   self-test checks"*. `site-home` has an open, unresolved `NEEDS DECISION` on that number - the engine at
   `HEAD` has 155 and ships them with **1.2.0, which is unreleased**, while the site brands itself 1.1.0.
   This draft names **check `[9] No network code`** instead. The reader sees it print. That check's
   identity is stable across every count, and it is the thing the sentence is actually about. **This adds
   no fourth voice to an open decision**, which was the alternative.
3. 🔴 **"The only time it opens a browser is when you ask it to report an issue" is incomplete** (S-003).
   IRON rule 5 names three paths, not one: `--report-issue`, `--feedback`, and the reports manager. A
   sentence that says "the only time" and then lists a third of the times is the kind of near-miss a reader
   who finds the other two stops trusting the rest of the page for.
4. 🔴 **The refusal list was silent on the two things that ARE stored** (S-006, S-007). The page listed four
   refusals about the disk and nothing about the email address or the contact message. Both are now stated
   at the same weight as the refusals, in the same section, before the reader has to go looking.

---

# `/privacy` - the page

## S-001 · `privacy.html` · `.page-head` - the H1 and the lede - **beat 1, the one line**

**Was:** `There are two programs, so there are two answers.` / `The command line and the desktop window are
not the same thing, and they do not behave the same way. Both answers are on this page, at the same size,
because printing one of them larger than the other would be the misleading way to write this.`

```html
<h1>windowsweep collects usage data and crash reports to improve the product for everyone.</h1>
<p class="lede" data-wsw-copy="pending">There is no switch. This page is a notice rather than a consent
  request, and nothing on it asks you for an answer. Three programs carry the windowsweep name, and they do
  not behave alike. The desktop window and this website send analytics. The command line sends nothing at
  all, and that one is not a promise about intentions: it is a check in the test suite that fails the build
  if a network call appears.</p>
```

**Change:** the H1 becomes the owner's own decision of 2026-09-07, in the third person the fingerprint
requires - *"there is no 'we' in a local utility"* - and in the wording the desktop's `consent.title` already
ships, so the two surfaces do not invent two sentences for one fact. One fact, one sentence. *"and crash
reports"* is added because
Sentry is the fourth destination and *"usage data"* alone would undercount it. **The lede opens on
`There is no switch.`** and that is four words on purpose: softening it into a preference is the one thing
this page cannot survive, and a four-word sentence cannot be skimmed past. *"Two programs"* becomes three,
named, with which-is-which in the same breath - the correction row 17's amendment asks for. The closing
33-word sentence carries the engine's fact without letting it drift into a claim about the window. It says
*that one*. And it says what makes it true.

---

## S-002 · `privacy.html` · `.band-well` - the section heading

**Was:** `What each of the two programs sends`

```html
<h2>What each of them sends</h2>
```

**Change:** the count comes out. Two panels cover three programs - the right one covers the window and the
site together, because their answer is identical - so any number in this heading is either wrong or has to
explain itself. Dropping it costs nothing; S-001 has already named all three.

---

## S-003 · `privacy.html` · left `.panel.pad` - the command line - **the contrast, stated first**

**Was:** `The command line sends nothing.` / `No telemetry.` `No update check.` `No network calls of any
kind. One of the 151 self-test checks greps the source for HTTP and socket calls.` / `Session logs, reports
and crash bundles are written to disk and stay there. The only time it opens a browser is when you ask it to
report an issue.`

```html
<h3 class="h-sub">The command line sends nothing.</h3>
<ul class="factlist">
  <li class="f-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg><span>No telemetry.</span></li>
  <li class="f-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg><span>No update check.</span></li>
  <li class="f-no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg><span>No network call of any kind. Check <span class="mono">[9] No network code</span> greps every source file for HTTP and socket calls, and a hit fails the build. Run <span class="mono">npx windowsweep --self-test</span> to watch it go past.</span></li>
</ul>
<p class="t-sm ink-3">Session logs, reports and crash bundles are written to disk and stay there. It opens
  your browser only when you ask it to: <span class="mono">--report-issue</span>,
  <span class="mono">--feedback</span>, or a link out of the reports manager.</p>
```

**Change:** two corrections, both listed above. The **151 disappears** in favour of the check's own printed
name, which is stable across 151, 154 and 155 and is what the reader sees on their own screen. **"The only
time it opens a browser"** becomes the three real paths; a reader who runs `--feedback` and watches a
browser open would otherwise have caught the page in a small lie, on the page where a small lie is
expensive. `--self-test` is named with the command to run it, because a refusal a reader can execute is band
R doing its job and an unverifiable one is an adjective.

---

## S-004 · `privacy.html` · right `.panel.pad` - **beat 2, the four destinations**

**Was:** `The desktop window and this website send analytics.` / `Usage events go to Google Analytics 4,
Amplitude and Microsoft Clarity.` `Errors go to Sentry.` `Clarity records session replays — your
interactions with the interface, not the contents of your disk.` `There is no opt-out. This page is a
notice, not a consent request.` / `If you want a cleanup that transmits nothing at all, that is the command
line, and it runs the same engine.`

```html
<h3 class="h-sub">The desktop window and this website send analytics.</h3>
<ul class="factlist">
  <li class="f-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg><span><b>Google Analytics 4</b> records which pages you opened and which controls you pressed.</span></li>
  <li class="f-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg><span><b>Amplitude</b> records the same events again, in a second tool.</span></li>
  <li class="f-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg><span><b>Microsoft Clarity</b> records a session replay: the page as you used it, with every piece of text masked. It sees where you moved and what you clicked. It does not see what any of it said.</span></li>
  <li class="f-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg><span><b>Sentry</b> receives a stack trace when something breaks, with file paths stripped out, because a stack trace from your machine would otherwise carry the name of the folder it ran in.</span></li>
  <li class="f-yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg><span><b>There is no opt-out</b> and no setting to find. Not in the desktop window either. This is how windowsweep gets better for the next person who runs it.</span></li>
</ul>
<p class="t-sm ink-3">If you want a cleanup that transmits nothing at all, that is the command line, and it
  runs the same engine.</p>
```

**Change:** the four destinations become **four separate lines instead of two**. Each is named. Each says
what that one receives, because a reader scanning for *"who has my data"* counts entries rather than reading
sentences. The wording is lifted from the desktop's already-approved `consent.provider.*` strings and
adapted from *"this window"* to *"the page"*, so the app and the site describe the same four tools in the
same words. **Two lines are extended past the desktop's version, and both extensions are load-bearing.** The
replay line gains a pair of sentences, because **what a replay is** matters more than the label and *"It
does not see what any of it said"* is the specific refusal that makes the first half survivable. The Sentry
line gains its reason: a stack trace carries frame filenames, so saying paths are stripped without saying
why leaves the reader to wonder what a stack trace had to do with their folders. That scrub is real and
mechanical - `desktop/src/lib/analytics.ts:167` runs `frame.filename = scrub(frame.filename)` inside
`beforeSend`, alongside the message and exception-value scrubs on the two lines above it. The final line is
the desktop's approved `consent.noSwitch`, which beats the placeholder's *"not a consent request"* because
it answers the question the reader is actually forming - *where is the setting* - instead of describing the
page; *"Not in the desktop window either"* is added because this page speaks for both and a reader who has
only the app installed must not read the refusal as belonging to the website. The closing note is **kept
verbatim**: it is the best sentence on the panel and rewriting it to prove a pass happened is how a good
line gets quietly worse.

---

## S-005 · `privacy.html` · `.band-app` - the refusals heading and lede

**Was:** `What is never part of an analytics event` / `The window knows a great deal about your disk. None of
it leaves. A run summary is a count and a number of bytes.`

```html
<h2>What is never part of an analytics event</h2>
<p class="t-sm ink-2" data-wsw-copy="pending">The desktop window knows a great deal about your disk. None of
  it leaves. This website knows none of it in the first place: it is a page in a browser, and it never reads
  your disk. A run summary is a count and a number of bytes.</p>
```

**Change:** the placeholder spoke only for the window, on a page that covers three programs, which is
exactly the bleed this surface exists to prevent - a reader could carry *"the window knows a great deal"*
across to the site. The added sentence closes it with the reason rather than an assurance: the site cannot
send a file path because it has never seen one. The heading is left alone. It is declarative rather than a
question, so it does not fall into the trap `safety.md` records - a `?` in a header turns every line beneath
it into an answer to a question the lines were not written for.

---

## S-006 · `privacy.html` · `ul.refuse` - **beat 3, the refusals**

**Was:** `A file path or a folder name` / `Not the ones it removed, not the ones it refused, not the ones it
skipped.` · `A drive label or a machine name` / `Or your Windows user name.` · `The contents of anything` /
`The engine reads sizes and timestamps. Nothing it reads is transmitted anywhere by any part of the
product.` · `A scan result` / `What the map shows you is computed on your machine and stays there.`

```html
<li><h3>A file path or a folder name</h3><p>Not the ones it removed, not the ones it refused, not the ones it skipped. This website has none to send in the first place.</p></li>
<li><h3>A drive label or a machine name</h3><p>Or your Windows user name.</p></li>
<li><h3>The contents of anything</h3><p>The engine reads sizes and timestamps. Nothing it reads is transmitted anywhere by any part of the product.</p></li>
<li><h3>A scan result</h3><p>What the map shows you is computed on your machine and stays there.</p></li>
<li><h3>Anything you type into the contact form</h3><p>The subject and the message are stored, and they are stored so the message can be read and answered. They are never sent to any of the four tools above.</p></li>
```

**Change:** the list is the part of this page a reader can check, so it stays specific and the four existing
entries are kept almost whole. Three are verbatim. Item one gains the site's half of the answer.
**Item five is new**, and it is the item that stops the heading being read wider than it is: *"never part of
an analytics event"* is precisely true of the contact message and would be badly misread as *"nothing is
stored"*. Saying it here, inside the refusal list, at the moment the reader is forming that belief, is worth
more than a correction two headings later.

---

## S-007 · `privacy.html` · `.band-well` - the sign-in section

**Was:** `If you sign in` / `Signing in is optional and it is Google. The window opens your normal browser
rather than a window inside the app, so you can see the address bar. What it uploads, in full:` /
`You can read every one of those values back on your account page, and delete the account from there.
Deleting it removes the settings and the run summaries.`

```html
<h2>If you sign in</h2>
<p class="t-sm ink-2" data-wsw-copy="pending">Signing in is optional and it is Google. One account covers
  the desktop window and this website, so what follows is true of both. The window opens your normal browser
  rather than a panel inside the app, which is how you get to see the address bar you are typing into. What
  it uploads, in full:</p>
```

then, immediately below the existing `<table class="tbl">`, replacing the closing paragraph:

```html
<p class="t-sm ink-2" style="margin-top: var(--sp-4)">Two more things are stored. Neither is on the refusal
  list, because neither is a refusal. The email address you signed in with is kept, so the account
  page can show you which account you are looking at and a message has somewhere to be answered. Anything
  you send through the contact form is kept in full, subject and message both. Neither reaches Google
  Analytics 4, Amplitude, Clarity or Sentry.</p>
<p class="t-sm ink-2" style="margin-top: var(--sp-3)">You can read every one of those values back on your
  <a href="account.html">account page</a>, and delete the account from there. It removes four things. Your
  profile, your settings, your run summaries and your contact requests.</p>
```

**Change:** the intro said *"the window"* on a page that now covers three programs; it gains the sentence
that ties the site's account to the app's, which is the fact that makes one table serve both. **The
stored-facts paragraph is new** and it is the honest counterweight the section was missing - the brief for
this surface names both, and a privacy page that lists only refusals has told the reader half of something.
Half is worse than none. It ends on the refusal that makes the two storages tolerable, which is the shape
band R takes here.
**"Removes the settings and the run summaries" becomes four things**: `profiles`, `user_settings`, `runs`
and `contact_requests` all carry `references(authUsers.id, { onDelete: 'cascade' })`, so the old sentence
under-reported a deletion the reader is entitled to know is wider than stated. 🔴 **It deliberately does not
say "everything"** - `admin_audit` keeps `subject_id` as text with no foreign key, so status-change rows
survive the account, and a totality claim would be false. Naming four things is checkable; *"everything"* is
not.

---

## S-008 · `privacy.html` · **(new section, after the sign-in band)** - cookies and browser storage

**Was:** `(new)`

```html
<section class="band band-app">
  <div class="wrap-narrow rise section">
    <h2>What is kept in your browser</h2>
    <p class="t-sm ink-2" data-wsw-copy="pending">Three kinds of thing, and none of them behind a banner,
      because there is nothing here for you to accept or decline.</p>
    <ul class="refuse" style="margin-top: var(--sp-5)">
      <li><h3>Your appearance settings</h3><p>The theme, the colour treatment and the other axes, read back before the page paints. That is why you do not get a flash of the wrong one on the way in.</p></li>
      <li><h3>Your sign-in session, if you signed in</h3><p>It is what stops a refresh signing you out. Signing out removes it.</p></li>
      <li><h3>An identifier for each analytics tool</h3><p>So a second visit is recognised as the same browser rather than as a new person. That is the whole of what they are for.</p></li>
    </ul>
    <p class="t-sm ink-2" style="margin-top: var(--sp-4)">You can read all of it yourself. Open your
      browser's storage inspector on this page and it is listed there under this site's own name, which is
      the only sort of privacy claim worth making: one you can go and check.</p>
  </div>
</section>
```

**Change:** new, because the row's page owes a reader the answer to *"what did you put on my machine"* and
the dummy has no element for it. Three categories rather than a cookie inventory, and that is a deliberate
limit. Two of the three are now verified in built code - `src/lib/prefs.ts` puts the appearance axes through
`strata-storage` on one `localStorage` key, and `src/lib/supabase.ts:44` sets `persistSession: true` - but
the third is the analytics tools' own cookies, which exist only at runtime with real keys, so naming them
would mean writing from general knowledge rather than from this repository. On a safety surface that is the
failure mode and not the finish. The `NEEDS DECISION` at the end offers to enumerate them once they can be
measured against a real build. The closing sentence hands the reader the instrument instead of an adjective,
and a claim that tells you how to falsify it is the strongest form this page has.

---

## S-009 · `privacy.html` · `.band-tight` - the two unasked requests

**Was:** `Two requests that run without being asked for` / `On every start the desktop app fetches
latest.json from the release page to see whether an update exists. On a machine with no WebView2, the
installer downloads it from Microsoft. Neither request carries anything the app knows about you.`

```html
<h2 class="h-sub">Two requests that run without being asked for</h2>
<p class="t-sm ink-2" style="margin-top: var(--sp-3)" data-wsw-copy="pending">On every start the desktop
  app fetches <span class="mono">latest.json</span> from the release page to see whether an update exists.
  On a machine with no WebView2, the installer downloads it from Microsoft. Neither request carries anything
  the app knows about you. Both are ordinary downloads, so GitHub and Microsoft see them the way any website
  sees a visit.</p>
```

**Change:** the first three sentences are **kept verbatim** - they are accurate, they are in voice, and they
already name the two requests and both hosts. The fourth is new. *"Neither request carries anything the app
knows about you"* is precisely true and, read alone, invites a reader to conclude that nothing at all is
observable, which is not something this page can promise about somebody else's server. Saying what GitHub
and Microsoft do see is a smaller claim honestly bounded, and it costs nothing the section was relying on.

---

## S-010 · `privacy.html` · **(new closing section)** - **beat 4, the CLI's zero-network fact**

**Was:** `(new)`

```html
<section class="band band-well">
  <div class="wrap-narrow rise section">
    <h2>If you would rather nothing left the machine at all</h2>
    <p class="t-sm ink-2" data-wsw-copy="pending">Then use the command line. It is the same engine the
      desktop window drives, and it runs the same twenty-six sections. It makes no network call: check
      <span class="mono">[9] No network code</span> greps every source file for HTTP and socket calls, and a
      hit fails the build. That is not a setting somebody can change for you later. It is a check that has
      to pass before the code ships.</p>
    <p class="t-sm ink-2" style="margin-top: var(--sp-4)"><span class="mono">npx windowsweep --scan</span>
      measures what is reclaimable and deletes nothing.</p>
    <p class="t-sm ink-2" style="margin-top: var(--sp-5)">A question about anything on this page goes to
      <a href="mailto:aoneahsan@gmail.com">aoneahsan@gmail.com</a>. The contact form on this site works too,
      though it needs an account first.</p>
  </div>
</section>
```

**Change:** new. It is the row's fourth beat, which the dummy delivers only as three bullets inside a
panel above the fold. The row puts it **last** for a reason: the page has just spent four sections telling a
reader what is collected, and the last thing it owes them is the door out. *"That is not a setting somebody
can change for you later"* is the sentence that stops the engine's fact reading as a policy the way the
window's telemetry is a policy - the two are different in kind, and this is where the page says so. The
address is `aoneahsan@gmail.com`, read from `package.json` (author and `bugs.email`), `README.md:485` and
`docs/author.md`. Nothing was invented. The last clause is there because pointing a privacy question at a
form that requires an account, on the page that explains what an account stores, would be a small unkindness
if it went unsaid.

---

# The footer notice line

## S-011 · `shell.js` · `ANALYTICS_NOTICE` - the line on every page

**Was:** `This site and the desktop window send usage events to Google Analytics 4, Amplitude and Microsoft
Clarity, and errors to Sentry. Clarity records session replays. There is no opt-out. The command line sends
nothing.`

```js
  var ANALYTICS_NOTICE =
    'This site and the desktop window send usage events to Google Analytics 4, Amplitude and ' +
    'Microsoft Clarity, and errors to Sentry, to improve the product for everyone. Clarity records ' +
    'session replays. There is no switch. The command line sends nothing. The whole of it is on the ' +
    'privacy page.';
```

**Change:** four small ones and no softening. *"to improve the product for everyone"* is added because the
owner's decision is a sentence with a reason in it, and a destination list with the reason removed reads as
a disclosure extracted rather than one offered. *"There is no opt-out"* becomes **`There is no switch.`** -
his own word, the desktop's approved `consent.noSwitch` word, and one wording across the family instead of
two. The pointer sentence is added because this notice currently ends without a route to the page that
explains it; `/privacy` is in the header navigation and in no footer column, so a reader who reads the
notice in the footer has nowhere to go from where they are standing.

🔴 **Plain text on purpose.** `shell.js:169` passes this string to `el('p', null, ANALYTICS_NOTICE)`, which
sets `textContent`, so an `<a>` written here would render as visible angle brackets. Making it a real link
is a **`shell.js` change, not a copy change**, and it is reported below rather than smuggled into a string.

---

# 🔴 NEEDS DECISION

Two. Both verbatim.

> **NEEDS DECISION: the cookie and browser-storage inventory is written as three categories because the
> exact keys cannot yet be measured.** S-008 says *what* is kept and *why*, and does not name a single
> cookie or storage key. 🔴 **Corrected mid-draft:** this decision was first written saying the site's
> application tree did not exist. It does now - another agent built `windowsweep-web/src/` during this
> draft - so the two site-owned categories are no longer inferred and are cited below. What is still not
> measurable is the third: **the analytics tools' own cookies**, which only appear at runtime once real
> keys are present, so naming them would come from general knowledge of GA4, Amplitude and Clarity rather
> than from anything here - an invented fact rather than a small gap, on a surface where that is a hard
> fail. **Now verified in built code:** the appearance axes go through `strata-storage` on `localStorage`
> under one key (`src/lib/prefs.ts:34-73`, `PREFS_PHYSICAL_KEY`) and are read before paint, and the
> Supabase client is constructed with **`persistSession: true`** (`src/lib/supabase.ts:44`), which is the
> sign-in half. Options: **(a)** ship the three categories now and add a named
> inventory once the app is built and the storage inspector can be read against a real build; recommended,
> because the categories are true today and a list is a maintenance promise this page would then owe
> forever. **(b)** Add the named keys now from documentation of the three tools, and accept that the page
> asserts something nobody here has observed. **(c)** Cut the section, which the row does not permit -
> browser storage is one of the things the brief names. I recommend (a). The draft ships (a).

> **NEEDS DECISION: the site masks Clarity's text by a mechanism that leaves the window the desktop
> deliberately closed, so the sentence this page ships is true of the steady state and not of the first
> moments of a session.** S-004 ships *"with every piece of text masked"*, which this surface's brief
> requires and which the desktop's approved `consent.provider.clarity.what` already says. **Both now
> implement it**. Differently, and the difference is the whole question. The desktop puts the masking
> in the markup - `desktop/index.html:23`, `<div id="root" data-clarity-mask="true">` - and its own comment
> beside it says why: *"it is here rather than in the loader because a replay can begin before any module
> has run."* The site puts it in the loader. `windowsweep-web/src/lib/analytics.ts:134-138` **awaits**
> `loadScript('https://www.clarity.ms/tag/…')` and only then calls
> `window.clarity('set', 'maskText', 'true')`, so between the tag executing and that call returning,
> recording is live under Clarity's shipped **Balanced** mode, which masks only text it judges sensitive.
> On a sign-in or contact page that window is small and it is not nothing. Options: **(a)** add
> `data-clarity-mask="true"` to `index.html:36`'s `<div id="root">`, matching the desktop, and keep the
> loader call as the belt to its braces - recommended: it is one attribute, it needs no key, and it is in
> place before any script runs. **(b)** Keep the loader-only call and narrow the copy to say masking starts
> with the recording, which is honest and is also the page volunteering that the site is weaker than the
> app. **(c)** Accept the gap unstated, which this surface may not do. I recommend **(a)** and have written
> the copy that (a) makes true. 🔴 **This is a code finding**. The file is outside this draft's scope, so
> it is raised rather than fixed.

# Reported, not fixed - outside this draft's scope

0. 🔴 **The site's Clarity masking runs one `await` too late.** Full argument in the second
   `NEEDS DECISION`. In one line: `src/lib/analytics.ts:134-138` awaits the Clarity tag and *then* sets
   `maskText`, while the desktop sets it in the markup and says in a comment why. The fix is one attribute
   on `index.html:36`. It is listed here as well as above because a decision buried in a copy draft is a
   decision nobody applies, and this one is the difference between a sentence being true and being true
   soon.

1. 🔴 **The footer notice has no link to `/privacy`.** `shell.js:169` renders the string as `textContent`
   inside a `<p>`, and the four footer columns carry no Privacy entry - it exists in the header navigation
   only. S-011 works around it with a plain-text pointer, which is the most a copy slot can do. The real fix
   is code. A `shell.js` change: split the notice or append an `<a>` node. **A notice a reader cannot
   follow is half a notice**, and on this surface the half that is missing is the detailed half.
2. 🔴 **`privacy.html`'s `<title>` and `<meta name="description">` are product-voice prose and belong to row
   19**, not here. They currently read *"Privacy — what windowsweep sends, and what it never sends"* and
   *"The command line makes no network calls. The desktop window and this website send usage events to four
   destinations, with no opt-out. Both facts, at the same size."* Both are good and both say **two
   programs** by implication where S-001 now says three. They are not slotted here. Row 19 owns them, and
   the correction should travel with that row rather than being lost between two.
3. **The dummy's sign-in table caption reads "The whole of it. There is no other table."** That is now
   narrower than true: `profiles` and `contact_requests` are two more tables holding the reader's data, and
   S-007's new paragraph names what they hold. The caption is data-adjacent rather than a pending block, so
   it is reported rather than slotted - but applying S-007 without adjusting it leaves one page saying
   *"there is no other table"* four lines above a paragraph describing two.
4. **`design/README.md` §11's pending-block table records `privacy.html` at 6 blocks / 188 provisional
   words.** This draft adds two new sections carrying `data-wsw-copy="pending"` blocks of their own, so that
   row moves to 8 when S-008 and S-010 land. Recorded here so the count is corrected in the same edit rather
   than drifting.

---

# Self-check

**1. Palette match - band by band.** Row 17 allows **P and R only, and no humor at all**. Checked sentence
by sentence over all **12 fenced blocks** - eleven slots, because S-007 carries two.

| Band | Where it lands |
|---|---|
| **P** - precision before an irreversible act | S-001's H1 and the whole lede · S-003's check name and the three browser-opening flags · S-004's four destination lines · S-007's four cascade targets · S-009's two named requests and two named hosts · S-010's `--scan` line |
| **R** - refusal as reassurance, delivered as a **specific** refusal | S-003 *"a hit fails the build"* with the command to watch it · S-004 *"it does not see what any of it said"* · S-006's five refusals, four of them the dummy's own · S-007 *"Neither reaches Google Analytics 4, Amplitude, Clarity or Sentry"* · S-008 *"Open your browser's storage inspector"* · S-010 *"not a setting somebody can change for you later"* |
| **W** - workshop dryness | 🔴 **zero, deliberately.** Two candidate lines were written and cut: an aside about the contact form needing the account the page is about, and one about reading a policy nobody opens. Both were mild and both were jokes, on a page whose subject is that the reader has no choice |

**The humor sweep, run as its own pass.** Every fence was re-read looking only for a wink, a pun, a
self-aware aside or a line whose pleasure is in its phrasing rather than its content. **Two found, both
cut** (above). Nothing remaining is positioned near a statement of what is collected. Exclamation marks:
zero.

**The urgency sweep, and a claim corrected in place.** The shipping strings were swept for `now`, `today`,
`before`, `act`, `hurry`, `miss`, `must`, `should`, `urgent` and `immediately`, case-insensitively on word
boundaries. The draft first asserted **none appears**, which is false: **`before` occurs twice** - *"read
back before the page paints"* (S-008) and *"a check that has to pass before the code ships"* (S-010). Both
are ordinary temporal usage describing a sequence in software, neither pressures the reader toward or away
from anything, and both stay. The count is recorded rather than the claim repaired, because a sweep that
reports zero is worth nothing once a reader finds the first hit. Every other term: **absent**.

**No shame language.** The page never suggests the reader should have known, should have read something, or
is doing anything wrong; every sentence describes the product's behaviour rather than grading the reader's.
`should` and `must` do not occur at all, which is the mechanical half of that claim.

🔴 **The pricing sweep - CLEAN.** Row 17 and `design/README.md` §7 forbid a pricing claim in **either**
direction, so the shipping strings were swept for `free`, `paid`, `price`, `pricing`, `tier`, `plan`,
`subscription` and `trial`. **Zero hits, all eight terms.** The word *free* does not appear on this surface
at all, in any sense - not even the disk-space sense that legitimately puts it on the home page twice.

**No reassurance the facts do not support.** Three places were tested for it specifically. S-009 now bounds
*"neither request carries anything the app knows about you"* with what GitHub and Microsoft do see. S-007
refuses the word *"everything"* about account deletion and names four tables instead, because `admin_audit`
survives. S-008 refuses to name cookies it has not measured.

**2. Rhythm - measured, with the instrument written down.** 🔴 **The figures in this section were first
written as estimates and were wrong; they are corrected here in place rather than presented as though they
had always been right.** Two of them mattered: the draft claimed *"nothing exceeds the 34-word ceiling"*
while S-010 carried a **41-word** sentence, and it claimed 820 shipping words against a measured 1,044. The
41-word sentence was split rather than re-described. Re-measure, never re-assert.

**Tokenizer:** `\b[\w'-]+\b`, the hook's own. **Sentence split:** `(?<=[.!?])\s+`, the hook's own.
**Inclusion rule for rhythm:** fence contents only, with `<svg>` nodes, all HTML tags, `<h1>`-`<h3>` text
and the table `<caption>` removed - headings are excluded because the hook excludes markdown headings, and
counting an HTML heading as the first clause of the paragraph under it glues a five-word line onto a
twenty-word one and hides both. **933 prose words** under that rule.

| | |
|---|---|
| **Shortest sentence** | **`No telemetry.`** - 2 words, S-003 |
| Others at or under 6 | `There is no switch.` (4, S-001) · `No update check.` (3, S-003) · `Then use the command line.` (5, S-010) · `It removes four things.` (4, S-007) · `Two more things are stored.` (5, S-007) · `Not in the desktop window either.` (6, S-004) |
| **Longest sentence** | **34 words**, S-008: *"Open your browser's storage inspector on this page and it is listed there under this site's own name, which is the only sort of privacy claim worth making: one you can go and check."* |
| Fingerprint ceiling | 34 words. **Nothing exceeds it**, and one sentence sits exactly on it. Next longest: 33 (S-001), 31 (S-004), 30 (S-007) |
| **Burstiness** (sd ÷ mean) | **0.57** over all 71 sentences, against a floor of 0.45 |
| Range rule (≤6 **and** ≥25 per ~150 words) | **6 windows, 6 pass.** Three failed on the first measurement (W2 had no long sentence, W4 and W6 no short one) and each was fixed by writing one, not by re-drawing the windows |
| Mean sentence length | **13.1** words, inside the fingerprint's 12-16 median band |

**Per-slot burstiness, including the three that do not clear 0.45 on their own:** S-001 0.67 · S-003 0.67 ·
S-004 0.51 · S-005 0.57 · **S-006 0.38** · S-007 0.53 · S-008 0.58 · **S-009 0.28** · **S-010 0.41** ·
S-011 0.94. The rubric measures burstiness over the piece and range per window, and both pass - but the
three are named rather than averaged away. **S-006 is a refusal list**, where parallel form is the point and
Strunk's rule and the humanize rubric pull in opposite directions; the list wins, because a reader scanning
five refusals is comparing them. **S-009 is four sentences of which three are kept verbatim** from copy
already on the page, and buying variance there means rewriting a good line to move a number.

**Punctuation budget, over the shipping copy.** Em dashes **0** (the dummy's one `&mdash;`, in S-004's
replay line, became a full stop). `not X, but Y` **0**. Triplet lists **2**, against a budget of 4 at 1,044
words. Exclamation marks **0**. Semicolons **1**, which the voice permits. No two consecutive blocks open on
the same word.

**3. Banned-phrase check - run against the fences BY HAND, because the hook cannot see one word of them.**
All **87** non-comment entries in `assets/banned-phrases.txt` were matched against the fence contents with
the hook's own pattern - case-insensitive, on word boundaries, whitespace-flexible for multi-word entries.
**Result: 0 hits. No allow marker is used and none is needed.** Four near-neighbours were checked
deliberately, because a privacy notice attracts all four:

| Entry | Verdict |
|---|---|
| `comprehensive` | absent. The page never rates its own coverage |
| `unlock` · `elevate` | absent. No elevation copy arises on this surface |
| `crucial` · `pivotal` | absent. No sentence rates the importance of anything |
| `it is worth noting` · `in conclusion` | absent. Every sentence states its fact directly, and the page ends on an address |

The commentary in this file was checked separately with the same list, since that is the half the hook does
read, and it is also clean.

**4. Length against the row's cap.** Row 17's cap is **one page**. Counted with the same tokenizer, on the
fence contents with markup and `<svg>` stripped, headings and table cells **included** (a reader reads
them):

| Slot | S-001 | S-002 | S-003 | S-004 | S-005 | S-006 | S-007 | S-008 | S-009 | S-010 | S-011 | **all** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **Ships** | 89 | 5 | 78 | 147 | 56 | 119 | 164 | 155 | 65 | 115 | 51 | **1,044** |
| **Was** | 56 | 7 | 59 | 72 | 32 | 72 | 65 | 0 | 48 | 0 | 34 | **445** |

**1,044 shipping words, up from 445.** The `Was` column reproduces the dummy's current visible text; summed
independently, `privacy.html`'s whole `<main>` measures **453**, and the 8-word gap is the table body and
caption, which are data and are not slotted. Two numbers, two methods. The difference between them has a
stated reason, which is the only honest way to report a count.

**Where the +599 went**, since growth on a notice needs justifying rather than admiring: the two new
sections S-008 and S-010 are **270** of it, and both are beats row 17 names. S-007 gains **99**, almost all
of it the stored-facts paragraph the page was missing. S-004 gains **75** by writing four destinations as
four lines instead of two. S-006 gains **47** for the fifth refusal. That is 491 of 599 in four places, each
traceable to the row or to a correction listed above. No section runs past 164 words and the page holds six
sections, which is what *"one page"* can mean on a notice nobody chose to read.

**One thing about that total.** It counts S-011, which is the footer line and appears on all 21 pages rather
than on this one. **The page alone is 993.**

**5. Voice match - confidence and the reason.** **Moderate-to-high**, and the qualifier is not modesty. It
is high on stance and rhythm: third person for what the tool does throughout, no first-person plural
anywhere, every reassurance delivered as a named refusal rather than an adjective, no anthropomorphism
beyond plain verbs, and openers that start on the fact with no throat-clearing frame. Three sentences are
lifted or adapted from strings the owner has already approved (`consent.title`, `consent.noSwitch`, the four
`consent.provider.*` lines), which is the strongest possible match on those.

It is **not** high in the sense the word usually implies, and the reason is recorded in the artefact itself:
**the fingerprint is still `calibrated: false`.** Its twelve specimens were derived from copy already in the
repository rather than from samples the owner chose, so every rhythm figure above is measured against a
target that has not been blessed. That is the Bible's own open item and not a new one - but on a safety
surface it is worth saying plainly rather than reporting a number as though it settled the question.

**6. Unsure spots.** Two `NEEDS DECISION` above, verbatim. Four findings reported outside scope. Three
things stated rather than guessed:

- **S-008's sign-in session line was the least confident sentence here, and is no longer.** It was written
  against the dummy, because `windowsweep-web/src/` held only `db/` when this draft opened. Another agent
  built the site tree mid-draft, and the line is now **verified in code**: `src/lib/supabase.ts:44`
  constructs the client with `persistSession: true`. Corrected in place rather than left reading as a
  hedge. Its companion is verified too - `src/lib/prefs.ts` puts the appearance axes through
  `strata-storage` on `localStorage` under one key.
- **The two GATE 1 artefacts that are currently false about this exact subject were NOT edited and NOT
  inherited.** `voice-fingerprint.md:25` and Bible §3's third commitment are both true of the engine and
  false of the window; both are recorded as open. Neither file was touched. Nothing in this draft repeats
  either sentence, quotes either as a specimen, or narrows either file. Where the page needed the fact those
  sentences carry, it was written fresh and scoped to the program it is true of.
- **Row 17's beat order is honoured with one deliberate deviation.** The row reads *one line -> four
  destinations -> refusals -> the CLI's zero-network fact*, and the dummy's approved layout puts the CLI
  panel to the LEFT of the destinations panel, side by side at the same size - which is the design's whole
  argument and not something a copy draft may reorder. So the CLI appears twice: as the contrast in S-003,
  where the layout puts it, and as the row's closing beat in S-010, where the row puts it. If a reviewer
  reads that as the row being bent rather than served, S-003's panel is the half that could be thinned. I do
  not recommend it - the same-size pairing is what makes the page fair.
