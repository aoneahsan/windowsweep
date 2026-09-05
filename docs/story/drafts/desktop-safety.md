# desktop-safety — Consent and Elevation

<!-- story-lint: allow "elevate" -->

Content-map row **12** · surfaces `consent.html` and `elevation.html` · tone band **P and R only** · 🔴 **no
humor anywhere on this surface** · structure: what is being asked, then exactly what happens, then how to
revoke.

This is a slot inventory rather than a page. Every user-visible string on the two screens is listed once,
numbered, with the file and a selector precise enough to find it in one search; the string that ships sits
inside the fence, and the **Was** and **Change** lines sit outside it. Where a string is already on voice it
is kept and said so. Most of it is.

Two rules from the Bible govern every line. A deletion is never implied to be reversible, so caches are
described as gone and personal files as going to the Recycle Bin, with the difference stated wherever a
reader could confuse the two. And the app never raises its own privileges: the engine's `--elevate` opens a
second window, which is what the copy describes and what the copy must keep describing.

| Screen | Slot range | Count |
|---|---|---|
| `consent.html` (+ `page-consent.js`) | S-001 – S-035 | 35 |
| `elevation.html` (+ `page-elevation.js`) | S-036 – S-064 | 29 |
| **Total** | | **64** |

Shared chrome, meaning the title bar, the rail, the appearance panel, the toast host and the
`engine <version>` and `storage:` ends of the status bar, is inventoried once in `desktop-moment.md` §A and
is not repeated here. Section keys and titles on the elevation cards come from `seed.js`, which mirrors
`lib/constants.ps1`; those words belong to content-map row 10 and are out of scope for this draft.

---

## 1. `consent.html` — the first-run decision

### S-001 · consent.html:6 · `<title>`
```
windowsweep - Before anything is switched on
```
**Was:** windowsweep - Before we start

**Change:** rewritten. The word "we" breaks the fingerprint's person rule, there is no first-person plural
in a local utility, and a permission screen is the last place to introduce a party standing between the
reader and the program; the replacement also says what the screen is for.

### S-002 · consent.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - the first-run consent dialog.
```
**Was:** identical.

**Change:** none. It describes the prototype rather than the product, so it carries the `prototype`
exemption and the app ships the window title above instead.

### S-003 · consent.html:24 · `p.caps.ink-3`
```
First run
```
**Was:** First run

**Change:** none.

### S-004 · consent.html:25 · `h1.t-xl.wide`
```
Nothing leaves this machine unless you turn it on.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 9, verbatim, band R: the promise delivered as a refusal.

### S-005 · consent.html:26-28 · `p.lede`
```
The cleanup engine makes zero network calls - its own test suite asserts that, and it is true whether you accept anything below or not. What follows is only about the desktop window you are looking at.
```
**Was:** identical.

**Change:** none. Band P, and the shape is right: an exact claim, then the thing that enforces it, then the
boundary of what the rest of the screen can even affect, which is the separation the whole dialog exists to
draw.

### S-006 · consent.html:36 · `h2.t-md.wide`
```
Four destinations, four switches
```
**Was:** identical.

**Change:** none. Counted rather than adjectival.

### S-007 · consent.html:37-38 · `button[data-ws-action="consentAll"]`
```
Turn all on
```
**Was:** Turn all on

**Change:** none.

### S-008 · consent.html:39 · `button[data-ws-action="consentNone"]`
```
Turn all off
```
**Was:** Turn all off

**Change:** none. The two bulk controls are the same length, the same voice and the same weight, which is
what stops the screen leaning toward one answer before the reader has read a word of what the four switches
would send.

### S-009 · `page-consent.js` → `PROVIDERS[0][1]`
```
Product analytics
```
**Was:** Product analytics

**Change:** none. The purpose is the label; the vendor sits on the badge beside it.

### S-010 · `page-consent.js` → `PROVIDERS[0][2]`
```
Which screens you opened and which buttons you pressed.
```
**Was:** identical.

**Change:** none.

### S-011 · `page-consent.js` → `PROVIDERS[0][3]`
```
Google Analytics 4
```
**Was:** Google Analytics 4

**Change:** none. Naming the vendor lets a sceptical reader go and check what it is, which is the audience
this product was written for.

### S-012 · `page-consent.js` → `PROVIDERS[1][1]`
```
Behaviour analytics
```
**Was:** Behaviour analytics

**Change:** none. en-GB already.

### S-013 · `page-consent.js` → `PROVIDERS[1][2]`

**NEEDS DECISION:** the current line reads *"The same events, kept longer so trends over months are
visible."* That is a claim about how long Amplitude retains data relative to GA4, and neither retention
period is recorded anywhere in this repository. Confirm one of: (a) the difference is real and both figures
may be stated exactly, in which case give them; (b) drop the retention comparison and describe the second
destination by what it is for, for example "The same events, sent to a second destination so a funnel can be
read across releases."; (c) drop the fourth switch and ship three destinations. Option (b) is recommended,
because it keeps the switch without asserting a vendor's storage policy.

### S-014 · `page-consent.js` → `PROVIDERS[1][3]`
```
Amplitude
```
**Was:** Amplitude

**Change:** none.

### S-015 · `page-consent.js` → `PROVIDERS[2][1]`
```
Session replay
```
**Was:** Session replay

**Change:** none.

### S-016 · `page-consent.js` → `PROVIDERS[2][2]`
```
A recording of this window with every piece of text masked.
```
**Was:** identical.

**Change:** none, conditional on the decision below.

**NEEDS DECISION:** this sentence, and the phrase "with all text masked" at S-027, commit the app to running
Microsoft Clarity with masking set to cover every piece of text, and S-017 commits Sentry to stripping file
paths before a report leaves the machine. No app code exists yet, so neither commitment is enforced
anywhere. Confirm that both are binding implementation requirements the desktop app ships with, meaning
masking mode "all text" and a `beforeSend` that removes paths, or these two sentences have to be softened
before a reader sees them.

### S-017 · `page-consent.js` → `PROVIDERS[3][2]`
```
A stack trace when something breaks, with file paths stripped out.
```
**Was:** identical.

**Change:** none, conditional on the decision recorded at S-016.

### S-018 · `page-consent.js` → `PROVIDERS[3][1]` and `[3][3]`
```
Crash reports
Sentry
```
**Was:** Crash reports / Sentry

**Change:** none.

### S-019 · `page-consent.js:41` · each row's `role="switch"` `aria-label`
```
(the provider name from S-009, S-012, S-015, S-018)
```
**Was:** the same, through `sw.setAttribute('aria-label', p[1])`.

**Change:** none, recorded here so a transcriber does not invent a second label for the control; a screen
reader hears the purpose name, and the vendor badge is announced as adjacent text rather than as part of the
switch.

### S-020 · `page-consent.js:55` · `consentSummary`, nothing on
```
Nothing is switched on. The app works exactly the same.
```
**Was:** identical.

**Change:** none. The second sentence is what makes declining a first-class answer rather than a tolerated
one.

### S-021 · `page-consent.js:56` · `consentSummary`, all four on
```
All four are on. You can revoke any of them in Settings, and it stops immediately.
```
**Was:** identical.

**Change:** none. Row 12 asks for "how to revoke", and putting it in the same sentence as the acceptance is
the strongest place it can sit.

### S-022 · `page-consent.js:57` · `consentSummary`, some on
```
{n} of 4 are on. The rest stay off until you say otherwise.
```
**Was:** `on.length + ' of 4 are on. The rest stay off until you say otherwise.'`

**Change:** none. The count is interpolated rather than concatenated when this reaches the app.

### S-023 · consent.html:67 · `p.t-sm[data-ws-text="consentSummary"]`
```
Nothing is switched on.
```
**Was:** Nothing is switched on.

**Change:** none. Pre-script default, replaced by S-020 on first paint.

### S-024 · consent.html:46 · `.disclose-line`
```
What each one would receive, in plain terms
```
**Was:** identical.

**Change:** none.

### S-025 · consent.html:47 · `.disclose-more`
```
Details
```
**Was:** Details

**Change:** none. Shared disclosure affordance, identical on every screen.

### S-026 · consent.html:50-52 · disclosure body, paragraph 1
```
Never sent, by any of them: a file path, a folder name, a drive label, your user name, your machine name, or the contents of anything. A run summary is a count and a number of bytes.
```
**Was:** identical.

**Change:** none. This is the strongest line on the screen, an itemised refusal placed before any of the
four switches is described, and the ordering is deliberate.

### S-027 · consent.html:53-57 · disclosure body, paragraph 2
```
Analytics would receive which screens you opened and which buttons you pressed. Session replay would receive a recording of this window with all text masked. Crash reports would receive a stack trace with paths stripped. Each is individually revocable later, in Settings, and revoking one stops it immediately.
```
**Was:** identical.

**Change:** none, conditional on the decision at S-016. The conditional mood is doing real work: nothing has
been switched on yet, and the tense says so.

### S-028 · consent.html:58-59 · disclosure body, paragraph 3
```
Declining is a first-class answer. The app is not degraded, nothing nags you again, and every feature including sign-in and sync still works.
```
**Was:** identical.

**Change:** none. A four-word sentence against a twenty-two-word one, and the content is the map row's third
beat.

### S-029 · consent.html:69 · `button[data-ws-action="consentDecline"]`
```
Continue with everything off
```
**Was:** Continue with everything off

**Change:** none. Verbally equal to S-030 and framed as a choice rather than as a refusal to help.

**Note for the dummy, not a wording change:** the decline button renders as `.btn` and the accept button as
`.btn.btn-primary`, so the two are not of equal visual weight, which row 12 requires. That is a class change
in `consent.html` and outside this draft's scope, so it is reported rather than made.

### S-030 · consent.html:70 · `button[data-ws-action="consentAccept"]`
```
Save and continue
```
**Was:** Save and continue

**Change:** none.

### S-031 · `page-consent.js:63` · toast on accept
```
Saved. You can change any of this in Settings.
```
**Was:** identical.

**Change:** none.

### S-032 · `page-consent.js:64` · toast on decline
```
Nothing was switched on. Nothing will ask again.
```
**Was:** identical.

**Change:** none. The second sentence binds the rest of the app, so it is worth keeping word for word.

### S-033 · consent.html:82 · status bar, page text
```
first run - nothing is on yet
```
**Was:** first run - nothing is on yet

**Change:** none.

### S-034 · consent.html:16 · title bar
```
(shared chrome, inventoried at desktop-moment.md §A, S-001 to S-022)
```
**Was:** built by `app.js`.

**Change:** none here.

### S-035 · consent.html:81, 83 · status bar, shared ends
```
engine {version}    ·    storage: {backend}
```
**Was:** the same.

**Change:** none here. See `desktop-moment.md` §A.

---

## 2. `elevation.html` — administrator rights

### S-036 · elevation.html:6 · `<title>`
```
windowsweep - Administrator rights
```
**Was:** identical.

**Change:** none.

### S-037 · elevation.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - the elevated-run flow and the SmartScreen note.
```
**Was:** identical.

**Change:** none, on the same `prototype` grounds as S-002.

### S-038 · elevation.html:25 · `p.caps.ink-3`
```
Sections 12-16 and 20
```
**Was:** Sections 12&#8211;16 and 20, rendering as an en dash.

**Change:** none to the words. The range names six sections, which agrees with the heading below it and with
the six rows `seed.js` marks as needing administrator rights, so the count in the copy and the count in the
data cannot drift apart without one of them being wrong.

### S-039 · elevation.html:26 · `h1.t-xl.wide`
```
Six sections need Windows to ask your permission.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 5. The subject is Windows rather than the app, which is exactly
the relationship the screen exists to explain.

### S-040 · elevation.html:27-29 · `p.lede`
```
windowsweep never elevates itself. When you ask for one of these, it opens a second, elevated window that does that work and writes its own report. This window keeps running, unelevated, and shows you the log as it arrives.
```
**Was:** identical.

**Change:** none. It opens on the refusal and only then describes the mechanism, which is the order this
voice uses everywhere.

### S-041 · `page-elevation.js:20` · card badge
```
admin
```
**Was:** admin

**Change:** none. Same badge vocabulary as the Sections table, `desktop-cockpit.md` S-015.

### S-042 · `page-elevation.js:21` · card badge
```
deep
```
**Was:** deep

**Change:** none.

### S-043 · `page-elevation.js:17-23` · card key and title
```
(from seed.js SECTIONS, the engine catalogue)
```
**Was:** the same.

**Change:** none, and none permitted here, because section keys and one-line titles mirror
`lib/constants.ps1` and belong to content-map row 10 rather than to this surface.

### S-044 · elevation.html:41 · `h2.t-md.wide`
```
What happens when you press it
```
**Was:** identical.

**Change:** none.

### S-045 · elevation.html:44 · timeline step 1, heading
```
Windows asks you.
```
**Was:** Windows asks you.

**Change:** none.

### S-046 · elevation.html:45-46 · timeline step 1, body
```
The standard User Account Control prompt, from Windows, not from windowsweep. If you say no, nothing happens and nothing is written.
```
**Was:** The standard User Account Control prompt, from Windows – not from us. If you say no, nothing happens and nothing is written.

**Change:** "us" replaced by the product name. The fingerprint bans first-person plural outright, and on a
permission screen the word does more damage than a style slip, because it implies a party on the other side
of the prompt and that is the misunderstanding this paragraph exists to prevent. The dash went too, for a
comma.

### S-047 · elevation.html:48 · timeline step 2, heading
```
A second window opens.
```
**Was:** A second window opens.

**Change:** none.

### S-048 · elevation.html:49-51 · timeline step 2, body
```
It runs only the sections you chose, with --reports-dir and --logs-dir pointed at this run's folder.
```
**Was:** identical.

**Change:** none. Naming the two flags is what makes the claim checkable by a reader who does not trust it.

### S-049 · elevation.html:53 · timeline step 3, heading
```
This window tails the log.
```
**Was:** This window tails the log.

**Change:** none.

### S-050 · elevation.html:54-55 · timeline step 3, body
```
You watch it from here. The elevated window closes itself when it is done, and its exit code comes back to this one.
```
**Was:** identical.

**Change:** none. Four words, then twenty, which is the rhythm the fingerprint asks for.

### S-051 · elevation.html:57 · timeline step 4, heading
```
Both reports land side by side.
```
**Was:** Both reports land side by side.

**Change:** none.

### S-052 · elevation.html:58-59 · timeline step 4, body
```
Under %LOCALAPPDATA%\windowsweep-desktop\runs\, one JSON each.
```
**Was:** identical.

**Change:** none. The path is named rather than described, which is this surface's habit throughout and the
reason a sceptical reader can verify the sentence in a file browser.

### S-053 · elevation.html:62 · `button[data-ws-action="elevateRun"]`
```
Ask for permission and run
```
**Was:** Ask for permission and run

**Change:** none. The verb is "ask", and the asking is done by Windows.

### S-054 · elevation.html:63 · `button[data-ws-action="elevateDry"]`
```
Measure without elevating
```
**Was:** Preview without elevating

**Change:** rewritten. "Preview" is a banned synonym for the dry-run in the glossary, and this button is not
a dry-run at all: it is `--scan`, which measures and deletes nothing. Naming the action after what the
engine actually does removes both problems in one word.

### S-055 · elevation.html:65-66 · note under the two buttons
```
A scan can measure these sections without administrator rights. It cannot clear them.
```
**Was:** A preview can measure these sections without administrator rights. It just cannot clean them.

**Change:** three fixes in one line. "Preview" follows S-054 to "scan", "just" is banned diction, and
"clean" is the glossary's banned verb, replaced by "clear", the word the engine's own catalogue uses for
these sections. The line now ends on the limit, which is where this voice ends a paragraph.

### S-056 · elevation.html:74 · `.disclose-line`
```
Windows may warn you the first time you install this
```
**Was:** identical.

**Change:** none.

### S-057 · elevation.html:75 · `.disclose-more`
```
Details
```
**Was:** Details

**Change:** none. See S-025.

### S-058 · elevation.html:78-80 · SmartScreen body, paragraph 1

**NEEDS DECISION:** the current line asserts *"The installer is not signed with a paid code-signing
certificate, so Microsoft SmartScreen shows 'Windows protected your PC' on first run."* No desktop app,
installer or release pipeline exists yet, so the signing position is recorded nowhere in this repository and
cannot be written from evidence. Confirm one of: (a) the Windows installer ships unsigned, in which case
that sentence ships as written and the disclosure stays; (b) an OV or EV code-signing certificate is bought
before the first release, in which case the disclosure is cut rather than reworded; (c) undecided, in which
case the app ships with no signing claim of any kind until the answer exists. Option (a) is recommended if
no certificate is budgeted, because meeting that dialog unexplained is the outcome the screen is trying to
avoid.

### S-059 · elevation.html:81-83 · SmartScreen body, paragraph 2

**NEEDS DECISION:** the current line says *"You can verify what you downloaded first: every release
publishes its installers next to a signature, and the source is public."* Nothing in the repository records
what a release will publish beside an installer. Confirm which artefact the copy may point at: (a) a SHA-256
checksum file per installer; (b) a minisign signature from the Tauri updater keypair, which is a different
thing from a code-signing certificate and worth naming as such; (c) both; (d) neither yet, in which case the
sentence is cut and only "the source is public" survives. Whichever is chosen, the copy names that artefact
exactly, because the bare word "signature" currently reads as though it contradicts S-058.

### S-060 · elevation.html:84-85 · SmartScreen body, paragraph 3
```
This note is here rather than hidden because meeting that dialog unexplained is worse than reading about it in advance.
```
**Was:** identical.

**Change:** none. It survives whichever way S-058 is answered, as long as the disclosure exists at all.

### S-061 · `page-elevation.js:36-37` · toast, elevated run
```
Windows would show its permission prompt here. This is a design prototype, so nothing elevates and nothing runs.
```
**Was:** identical.

**Change:** none. A `prototype` exemption, and the flatness of it is the right register for this screen.

### S-062 · `page-elevation.js:44-45` · toast, measure without elevating
```
Measured 15.9 GB across 6 admin sections. Nothing was deleted, and no permission was needed to look.
```
**Was:** identical.

**Change:** none. The figure carries the `demo-data` exemption: it is what the prototype shows rather than a
promise, and the Bible's rule against promising a number holds here because the sentence reports a
measurement that has already happened instead of predicting one that has not.

### S-063 · elevation.html:98 · status bar, page text
```
six sections need an elevated window
```
**Was:** six sections need an elevated window

**Change:** none.

### S-064 · elevation.html:19 · `nav.rail` `aria-label`
```
Main
```
**Was:** Main

**Change:** none. Shared chrome, `desktop-moment.md` §A.

---

## Out of scope, stated rather than dropped

Section keys, titles, tiers and batch names on the elevation cards come from `seed.js`, which mirrors
`lib/constants.ps1`, and content-map row 10 owns them. The review-tools panel built by `demo.js`, with its
gate runner, its two planted defects and its reset control, is prototype scaffolding the app deletes, so no
slots are issued for it. Class and layout changes, including the unequal visual weight of the two consent
buttons noted at S-029, are reported rather than made, because this draft may not edit the dummy.

---

## Self-check

**Palette.** P and R only, with no W anywhere: band P carries the mechanism lines at S-005, S-040, S-046,
S-048, S-052 and S-055, and band R carries the refusals at S-004, S-026, S-028, S-032 and S-039. Nothing
dry, nothing light, no aside anywhere near an irreversible action. The humor budget for this surface is
zero and it is spent nowhere.

**Rhythm.** Shortest shipping sentence: "Windows asks you." at three words, S-045. Longest: the first
sentence of S-005 at thirty-one words. The median across the surface sits near fourteen, and the two
rewritten lines at S-046 and S-055 both end on their shortest clause.

**Length.** `consent.html` carries about 201 words of visible copy and `elevation.html` about 272, both
inside row 12's "a screen" cap. Nothing grew. The rewrites at S-001, S-046, S-054 and S-055 are one for one
or shorter.

**Unsure.** Four `NEEDS DECISION` entries, at S-013 for the Amplitude retention claim, S-016 for masking and
path stripping as binding requirements, S-058 for the installer signing position and S-059 for what a
release publishes beside an installer. One banned phrase is allowed deliberately at the top of this file:
"elevate" is on the shared list as an inflation verb, and in this product it is the literal Windows term for
what `--elevate` does, so the commentary uses it about the mechanism rather than about the reader.
