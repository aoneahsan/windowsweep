# desktop-moment — Home, Run, Splash, Account

Content-map row **11** · surfaces `index.html`, `run.html`, `splash.html`, `account.html` · tone bands **P
and R**, with **W** allowed sparingly · structure: the number, then what it will touch, then the action.

This is a slot inventory rather than a page. Every user-visible string on the four screens is listed once,
numbered, with the file and a selector precise enough to find it in one search; the string that ships sits
inside the fence, and the **Was** and **Change** lines sit outside it. Where a string is already on voice it
is kept and said so. Most of it is.

Section §A carries the shared chrome, which is built once by `app.js` and appears on all eleven screens. The
other two drafts point here rather than repeating it, so a string has one home and one slot number.

| Screen | Slot range | Count |
|---|---|---|
| §A shared chrome (`app.js`, `widgets.js`) | S-001 – S-022 | 22 |
| §B `index.html` Home (+ `wire.js`, `reclaim-map.js`) | S-023 – S-096 | 74 |
| §C `run.html` (+ `page-run.js`) | S-097 – S-124 | 28 |
| §D `splash.html` (+ `page-splash.js`) | S-125 – S-143 | 19 |
| §E `account.html` (+ `page-account.js`) | S-144 – S-168 | 25 |
| **Total** | | **168** |

Section keys, titles, tiers and batch names come from `seed.js`, which mirrors `lib/constants.ps1`. Those
words belong to content-map row 10 and are out of scope here; where a screen renders them, the slot says so
and stops.

---

## §A Shared chrome

### S-001 · `app.js:689` · `.tb-title`
```
windowsweep
```
**Was:** windowsweep

**Change:** none. Lower case, always, including here where it is the first thing on the screen.

### S-002 · `app.js:691` · title bar version badge
```
{engine version}
```
**Was:** the same, seeded to 1.1.0.

**Change:** none.

### S-003 · `app.js:696` · privilege badge
```
standard user
```
**Was:** standard user

**Change:** none. It states the window's own privilege level in two words, which is the fact a reader needs
before pressing anything on the Admin screen.

### S-004 · `app.js:697` · privilege badge `title`
```
Admin sections need a Windows permission prompt this window cannot answer.
```
**Was:** Admin sections need a UAC prompt this window cannot answer

**Change:** the acronym is expanded and the sentence is closed. Home and Elevation both say "Windows
permission prompt" in full, and a tooltip is the one place a reader meets the idea with no surrounding
paragraph to define it.

### S-005 · `app.js:699` · prototype badge
```
design dummy · demo data
```
**Was:** design dummy · demo data

**Change:** none. A `prototype` exemption: the app drops this badge, and the dummy keeps it so no reviewer
mistakes a seeded number for a measurement.

### S-006 · `app.js:707` · window control
```
Minimise
```
**Was:** Minimise

**Change:** none. en-GB already.

### S-007 · `app.js:707` · window control
```
Maximise
```
**Was:** Maximise

**Change:** none.

### S-008 · `app.js:707` · window control
```
Close
```
**Was:** Close

**Change:** none.

### S-009 · `app.js:663` · drawer button `aria-label`
```
Menu
```
**Was:** Menu

**Change:** none.

### S-010 · `app.js:729-730` · theme toggle `aria-label` and `title`
```
Appearance settings
Appearance
```
**Was:** the same pair.

**Change:** none.

### S-011 · `app.js:170` · rail group heading
```
Reclaim
```
**Was:** Clean

**Change:** rewritten. The glossary gives "reclaim" as the word for what this tool does to space and rules
"clean" out, and the group heads the four screens that do exactly that. It also matches the wordmark on the
splash screen and the "Reclaimable" readout in the rail's own foot, so the three agree.

### S-012 · `app.js:175` · rail group heading
```
Records
```
**Was:** Records

**Change:** none.

### S-013 · `app.js:178` · rail group heading
```
You
```
**Was:** You

**Change:** none.

### S-014 · `app.js:182` · rail group heading
```
Prototype
```
**Was:** Prototype

**Change:** none. A `prototype` exemption covering the two review-only destinations under it.

### S-015 · `app.js:171-183` · rail item labels, in order
```
Home
Sections
Choose
Run
History
Reports
Account
Settings
Admin
Contents
Components
```
**Was:** the same eleven.

**Change:** none. "Choose" is the right label for the picker, because choosing item by item is precisely
what those four sections require of a person and what no flag can do on their behalf.

### S-016 · `app.js:747-758` · rail foot readout
```
Reclaimable
across {n} sections
```
**Was:** the same.

**Change:** none.

### S-017 · `app.js:782, 785, 788` · appearance panel, heading and close
```
Appearance
Close appearance panel
```
**Was:** the same.

**Change:** none.

### S-018 · `app.js:73-94` · the ten axis labels
```
Appearance
Colour treatment
Corner radius
Density
Text size
Typeface
Panel background
Custom cursor
Motion
Sound
```
**Was:** the same ten.

**Change:** none. "Colour" is already en-GB, and every label names the thing being changed rather than the
effect it produces.

### S-019 · `app.js:73-94` · the axis values
```
Light · Dark · System
Lime · Sky · Plum
None · Small · Medium · Large · Full
Compact · Comfortable · Spacious
Small · Medium · Large
Archivo · Segoe
Solid · Translucent
On · Off
System · Full · Reduced
On · Off
```
**Was:** the same.

**Change:** none.

### S-020 · `app.js:326-327` · appearance panel footnote
```
Saved to this machine. Add ?palette=plum&theme=light to any link to show a look without saving it.
```
**Was:** identical.

**Change:** none in the dummy. The second sentence describes a review affordance rather than a product
feature, so if the app declines to ship the URL override it drops that sentence under the `prototype`
exemption and keeps the first, which is a true statement about where preferences live.

### S-021 · `app.js:457` · toast undo control
```
Undo
```
**Was:** Undo

**Change:** none. Every destructive-looking action in this app offers undo instead of a confirmation, and
this one word is the whole affordance.

### S-022 · every screen · `nav.rail` `aria-label`
```
Main
```
**Was:** Main

**Change:** none.

---

## §B `index.html` — Home

### S-023 · index.html:6 · `<title>`
```
windowsweep - Home
```
**Was:** identical.

**Change:** none.

### S-024 · index.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - direction 02 'Reclaim'. The app's primary screen.
```
**Was:** identical.

**Change:** none. A `prototype` exemption, as on every screen in the dummy.

### S-025 · index.html:44 · `p.caps.ink-3`
```
Reclaimable now
```
**Was:** Reclaimable now

**Change:** none. Two words. The first beat of the map row's structure is the number itself, before anything
is said about what produces it.

### S-026 · index.html:45-47 · `.hero-num`
```
{value}{unit}
```
**Was:** the same, from `fmt.bytesParts`.

**Change:** none. A `live-number`; the seeded value is demo data and the app reads it from `--scan`.

### S-027 · index.html:48-53 · `.hero-sub`
```
measured {n} minutes ago across {n} targets in {n} sections
```
**Was:** identical.

**Change:** none. Every noun in it is countable and every count is shown, which is what lets the headline
number above stand without an adjective propping it up.

### S-028 · index.html:52 · `button.link-q`
```
re-scan
```
**Was:** re-scan

**Change:** none.

### S-029 · index.html:56 · `button[data-ws-action="scan"]`
```
Scan again
```
**Was:** Scan again

**Change:** none.

### S-030 · index.html:57 · `button[data-ws-action="preview"]`
```
Dry-run first
```
**Was:** Preview a safe run

**Change:** rewritten. The glossary names this the dry-run, always hyphenated, and rules out "preview" as a
synonym; the new label is also two words against its two neighbours, so the three buttons read as one ladder
from measuring to rehearsing to acting.

### S-031 · index.html:58-60 · `button[data-ws-action="clean"]`
```
Reclaim {value}
```
**Was:** Clean {value}

**Change:** rewritten. "Clean" is the glossary's banned verb and this is the most-pressed control in the
app, so it is the worst place to leave it. Mechanical note for the transcriber: the action name
`data-ws-action="clean"` and the text key `cleanBtn` rename to `reclaim` and `reclaimBtn` with it, and the
rail foot at S-016 reads the same key.

### S-032 · `wire.js:169-171` · capacity ring `aria-label`
```
Capacity: {bytes} reclaimable, {pct} per cent of {bytes} across {n} drives. The same figures are in the Drives panel below.
```
**Was:** identical.

**Change:** none. The last sentence points a screen-reader user at the table that carries the same data,
which is the accessible path rather than an apology for the graphic.

### S-033 · `wire.js:157, 166` · ring centre
```
{pct}%
OF ALL DISKS
```
**Was:** the same.

**Change:** none.

### S-034 · `wire.js:143-144` · ring per-drive `<title>`
```
{letter}  {bytes} free of {bytes}  ·  {bytes} reclaimable
```
**Was:** identical.

**Change:** none.

### S-035 · index.html:73 · zone label
```
The reclaim map
```
**Was:** The reclaim map

**Change:** none.

### S-036 · index.html:74 · zone label, right
```
Bigger tile, more space. Click one to keep it.
```
**Was:** identical.

**Change:** none. Six words teaching the encoding and five teaching the interaction, and "keep" is the
glossary's word for what excluding a target actually does.

### S-037 · `reclaim-map.js:215-217` · tile `aria-label`
```
{name}, {bytes}, excluded. Activate to toggle.
```
**Was:** identical, with "included" as the other branch.

**Change:** none.

### S-038 · `reclaim-map.js:294-296` · map `aria-label`
```
Reclaim map: {n} targets across {n} sections, {bytes} reclaimable in total. The equivalent data is in the table below.
```
**Was:** identical.

**Change:** none.

### S-039 · `reclaim-map.js:111-118` · tile tooltip
```
{path}
{bytes}  ·  idle {n} days  ·  section {n}  ·  {tier}  ·  EXCLUDED
```
**Was:** identical.

**Change:** none. The path comes first, which is the motif this product is built on: name the path before
anything is said about touching it.

### S-040 · `reclaim-map.js:377` · empty map, heading
```
Nothing to reclaim.
```
**Was:** Nothing to sweep.

**Change:** rewritten. The Bible keeps the sweep as a picture and bans it as a verb, because "sweep" carries
the triumphal register the whole voice avoids; "reclaim" is the glossary's verb and the same length.

### S-041 · `reclaim-map.js:381` · empty map, body
```
Every location behind these tiles is protected or in use. There is nothing here the scan is willing to touch.
```
**Was:** Every location behind these tiles is protected or in use. Your disk is cleaner than most.

**Change:** the second sentence is replaced. "Cleaner than most" compares the reader's disk against other
people's, which this tool has no way to measure and never will, and an unmeasurable comparison in the empty
state undercuts every measured number elsewhere on the screen. The replacement says the same reassuring
thing using a fact the product owns.

### S-042 · `reclaim-map.js:369-371` · empty map `aria-label`
```
Reclaim map, empty: nothing is reclaimable. The tiles show the {n} protected locations the scan refused to touch.
```
**Was:** identical.

**Change:** none.

### S-043 · `seed.js:19-24` · tier labels and legend blurbs
```
config      changes a setting; deletes nothing
report      reports only; deletes nothing
rebuilds    regenerates on next use
slow        regenerates, but slowly
recycle     goes to the Recycle Bin
permanent   gone for good
```
**Was:** the same six pairs.

**Change:** none. These six blurbs are the dummy's own words rather than the engine's, and they carry the
safety rule on their own: the two irreversible tiers say so plainly, and "goes to the Recycle Bin" is kept
distinct from "gone for good" everywhere the pair appears.

### S-044 · `wire.js:90` · map legend, second channel
```
faded = used recently, solid = long idle
```
**Was:** identical.

**Change:** none.

### S-045 · index.html:82 and `wire.js:443-444` · exclusion note
```
nothing excluded
{n} target kept out of the run
{n} targets kept out of the run
```
**Was:** the same three states.

**Change:** none.

### S-046 · index.html:83 · `button[data-ws-action="clearExclusions"]`
```
Include everything
```
**Was:** Reset choices

**Change:** rewritten. "Reset choices" names the mechanism from the code's point of view; the button puts
every excluded target back into the run, and the toast at S-048 already says so in those words.

### S-047 · `wire.js:59-60` · toast on toggling a tile
```
Keeping {name} ({bytes})
Including {name} ({bytes})
```
**Was:** identical.

**Change:** none.

### S-048 · `wire.js:502` · toast after including everything
```
Every target is back in the run.
```
**Was:** identical.

**Change:** none.

### S-049 · index.html:88 · disclosure summary
```
The same data as a table
```
**Was:** The same data as a table

**Change:** none.

### S-050 · `reclaim-map.js:408` · map table headers
```
Section · Target · Path · Size · Idle (days)
```
**Was:** the same five.

**Change:** none.

### S-051 · index.html:99 · zone label
```
Drives
```
**Was:** Drives

**Change:** none.

### S-052 · `wire.js:208` · drive legend
```
in use · reclaimable · free
```
**Was:** the same three.

**Change:** none.

### S-053 · `wire.js:196-197` · drive row, right column
```
{bytes} free
+{bytes}
```
**Was:** the same.

**Change:** none.

### S-054 · `wire.js:189` · reclaimable segment `title`
```
{bytes} reclaimable on {letter}
```
**Was:** identical.

**Change:** none.

### S-055 · index.html:108 · zone label
```
Developer mode
```
**Was:** Developer mode

**Change:** none. The glossary fixes this term against "dev mode" and "pro mode".

### S-056 · `wire.js:432-434` · developer mode state line
```
On - keeping anything used in the last {n} days
Off - every cache is offered in full
```
**Was:** On – keeping anything used in the last {n} days / Off – every cache is fair game

**Change:** the off state is rewritten. "Fair game" turns deletion into sport, which is the triumphal
register the Bible bans, and it sits one line above a control that decides how much gets deleted. The
replacement is the wording Settings already uses for the same state, so the two screens now agree.

### S-057 · index.html:114-116 · developer mode description
```
Caches you have used recently are left alone, so your next build is not a cold one.
```
**Was:** identical.

**Change:** none. Band R: the reassurance is a specific refusal with the consequence attached.

### S-058 · index.html:121-124 · held-back readout
```
Held back right now
{bytes}
{n} caches used in the last {n} days
```
**Was:** the same.

**Change:** none. It puts a number on the thing the tool declined to do, which is the clearest possible
statement of what the idle gate is for.

### S-059 · index.html:127 · slider label
```
Idle window
```
**Was:** Idle window

**Change:** none.

### S-060 · index.html:129 · slider hint
```
Lower it to include more caches.
```
**Was:** Lower it to sweep more.

**Change:** rewritten. "Sweep" as a verb is banned, and the replacement is also more accurate: lowering the
window does not delete anything by itself, it widens what the next run is allowed to offer.

### S-061 · index.html:136 · zone label
```
A safe run, step by step
```
**Was:** A safe run, step by step

**Change:** none.

### S-062 · `wire.js:242` · ladder rung, target count
```
{n} target
{n} targets
```
**Was:** the same pair.

**Change:** none. Both forms already exist, so nothing has to be invented when this reaches a catalogue.

### S-063 · `wire.js:261` · ladder overflow
```
and {n} more
```
**Was:** and {n} more

**Change:** none.

### S-064 · `wire.js:274` · ladder empty state
```
Nothing in the safe batch right now.
```
**Was:** identical.

**Change:** none.

### S-065 · index.html:140 · ladder total
```
Total a safe run would free
```
**Was:** Total a safe run would free

**Change:** none. The conditional is correct: nothing has run yet.

### S-066 · index.html:153 · zone label
```
These need a person
```
**Was:** These need a person

**Change:** none.

### S-067 · index.html:154 · zone label, right
```
A safe run never touches these - you pick, item by item.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 8, verbatim.

### S-068 · `wire.js:300` · needs-a-person card
```
{n} item waiting
{n} items waiting
```
**Was:** the same pair.

**Change:** none.

### S-069 · `wire.js:307-309` · card action and its toast
```
Choose items
```
**Was:** Choose items, with the toast "The picker for section {n} is in the next batch of this dummy."

**Change:** the label stays. The toast is stale and should be deleted rather than reworded: `picker.html`
now exists and covers sections 17, 18, 19 and 23, so this button should navigate to it. That is a wiring
change in `wire.js` and outside this draft's scope, so it is reported at the end rather than made.

### S-070 · index.html:171-172 · assurance line
```
Your documents, photos, keys and saved passwords are never touched - whatever you click here.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 3, with the clause that matters most on a screen full of
buttons kept at the end where it lands hardest.

### S-071 · index.html:177 · disclosure summary
```
How that is enforced
```
**Was:** How that is guaranteed

**Change:** rewritten. What follows is a mechanism, one function with a declared root, and "enforced" names
a mechanism where "guaranteed" names a promise; this audience has been promised safety by a cleaner before
and the word costs more than it earns.

### S-072 · index.html:181-183 · disclosure body
```
Every deletion in the product goes through one function, and that function is given a folder it is allowed to work inside. There is no second route, so a path outside that folder cannot be reached even by mistake.
```
**Was:** identical.

**Change:** none. The chokepoint motif in two sentences, with the second one closing the door the first one
described.

### S-073 · index.html:186-197 · chokepoint outcome rows
```
Refused        Protected, or outside the allowed folder
Recycle Bin    Anything personal, so you can get it back
Deleted        Caches that rebuild themselves next time you need them
```
**Was:** the same three rows.

**Change:** none. The middle row is the Bible's reversibility rule in eight words, and the third is
voice-fingerprint sentence 4.

### S-074 · index.html:201 and `wire.js:324` · protected chips
```
Never touched
Refused regardless of any flag
```
**Was:** the same heading and the same chip tooltip.

**Change:** none.

### S-075 · index.html:214 · zone label
```
The last eight runs
```
**Was:** The last eight runs

**Change:** none.

### S-076 · `wire.js:386` · last run summary
```
{relative date} · {n} sections · {mode}
```
**Was:** identical.

**Change:** none to the format. The `{mode}` values themselves are seeded in `seed.js` and are rewritten at
`desktop-cockpit.md` S-076, where the same values fill the History table's Mode column.

### S-077 · index.html:221 and `wire.js:520` · report link and its toast
```
Open the report
That screen is in the next batch of this dummy.
```
**Was:** the same.

**Change:** none. A `prototype` exemption; `report.html` exists, so this link can be pointed at it in the
same wiring pass as S-069.

### S-078 · `wire.js:355-356, 378` · sparkline labels
```
Space freed by the last {n} runs, oldest first: {list}
{relative date} · freed {bytes} · {mode}
```
**Was:** the same.

**Change:** none.

### S-079 · index.html:225 and `wire.js:440` · schedule state
```
Schedule
On - Sundays at 03:00
Off
```
**Was:** the same three.

**Change:** none.

### S-080 · index.html:230-231 · schedule description
```
Runs the safe batch once a week and tells you what it freed. Never the sections that need you.
```
**Was:** Runs the safe sweep once a week and tells you what it freed. Never the ones that need you.

**Change:** two fixes. "Safe sweep" becomes "safe batch", which is the engine's own name for that set and
the name Settings and the toast at S-081 already use; "the ones" becomes "the sections", because this
product has one word for a numbered unit of work and uses it everywhere.

### S-081 · `wire.js:514-515` · schedule toasts
```
Weekly task registered. It runs the safe batch only.
Weekly task removed.
```
**Was:** the same pair.

**Change:** none.

### S-082 · index.html:245 · admin disclosure summary
```
Six sections need Windows to ask your permission first.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 5.

### S-083 · index.html:249-250 · admin disclosure body
```
Starting one opens a second window with its own log, because this window cannot answer a Windows permission prompt for you. It then follows that run and shows you the result.
```
**Was:** identical.

**Change:** none.

### S-084 · index.html:252-257 · admin section badges
```
Windows Update · Disk Cleanup · Component store · Hibernation file · Event logs · WSL disk images
```
**Was:** the same six.

**Change:** none. "Disk Cleanup" is Microsoft's product name rather than our verb, so the glossary does not
touch it.

### S-085 · index.html:259-260 · admin disclosure, closing paragraph

**NEEDS DECISION:** the current line reads *"The installer is not signed yet, so Windows will warn you the
first time you open it. Saying so here costs less than letting you find out."* That repeats the signing
claim raised at `desktop-safety.md` S-058, and the answer given there governs this line too. If the
installer ships unsigned, keep both sentences as written; if a certificate is bought, delete the paragraph
here as well as on the Elevation screen; if the decision is open, ship neither claim.

### S-086 · index.html:266 · privacy disclosure summary
```
Nothing leaves this machine unless you turn it on.
```
**Was:** identical.

**Change:** none. Voice-fingerprint sentence 9, and the same sentence heads the consent screen, which is
deliberate.

### S-087 · index.html:270-271 · privacy disclosure body
```
The cleanup engine makes no network calls at all - its own tests check that. This app can send usage and crash reports, and all four are off until you say yes:
```
**Was:** identical.

**Change:** none. "Cleanup engine" names the bundled CLI component rather than the act of reclaiming space,
which is what the glossary rules on, and the status bar calls the same component "engine".

### S-088 · `wire.js:394-395` · Home's inline consent rows
```
Product analytics       Google Analytics 4
Behaviour analytics     Amplitude
Session replay          Microsoft Clarity
Crash reports           Sentry
```
**Was:** GA4 / page and feature usage · Amplitude / funnels · Clarity / session replay · Sentry / crash reports

**Change:** rewritten. Home currently leads with the vendor and describes it in
a fragment, while `consent.html` leads with the purpose and puts the vendor on a badge; one product cannot
name the same four switches two ways, and the consent screen's order is the correct one because the reader
is choosing a purpose rather than a supplier. "Funnels" also went, as jargon that describes our interest
rather than their data.

### S-089 · `wire.js:405` · Home consent toggle toast
```
Product analytics is on. Nothing is sent in this dummy.
Product analytics is off, from now.
```
**Was:** "{vendor} enabled - nothing is sent in this dummy." / "{vendor} disabled - nothing is sent in this dummy."

**Change:** rewritten to the wording Settings already uses at `desktop-cockpit.md` S-119, with the prototype
clause kept on the "on" branch only, where it is doing real work.

### S-090 · index.html:273-274 · privacy disclosure, closing paragraph

**NEEDS DECISION:** the current line reads *"Signing in is optional and only syncs your settings and
history. Runs are never limited and there is nothing to pay for."* The same claim appears in the Account
lede at S-147. A standing fleet rule forbids writing that a product has no paid tier, because that sentence
outlives the decision it describes, and no plan set is recorded for the desktop app anywhere in this
repository. Confirm one of: (a) the desktop app ships a plan set, in which case both lines are rewritten to
say what the free tier includes and sign-in stops implying that everything is free forever; (b) the app is
free with no plan and the copy states only what is true of sign-in today, for example "Signing in is
optional. It syncs your settings and a summary of each run, and nothing else."; (c) the sentence stays as
written and the rule is waived for this product in the decision log. Option (b) is recommended, because it
keeps the reassurance without making a claim about pricing that a later release could falsify.

### S-091 · index.html:288-291 · status bar
```
engine {version}
app {version}
%USERPROFILE%\.windowsweep\logs
storage: {backend}
```
**Was:** the same four.

**Change:** none.

### S-092 · `wire.js:470` · scan toast
```
Read-only scan finished. Nothing was deleted.
```
**Was:** identical.

**Change:** none.

### S-093 · `wire.js:472` · re-scan fallback toast
```
Re-scanning…
```
**Was:** Re-scanning...

**Change:** the three dots become one ellipsis character, matching every other pending string in the app.
The ASCII-only rule applies to the engine's console output rather than to the window.

### S-094 · `wire.js:477-478` · dry-run toast
```
Dry-run: {bytes} across {n} sections. Nothing was deleted.
```
**Was:** Dry run: {bytes} across {n} sections. Nothing was deleted.

**Change:** hyphenated, per the glossary. This toast is what the button at S-030 produces, so the two now
use one word for one idea.

### S-095 · `wire.js:492` · reclaim toast
```
Freed {bytes}. A real run would have written a report.
```
**Was:** identical.

**Change:** none. A `prototype` exemption on the second sentence.

### S-096 · `wire.js:469` · freshness value after a scan
```
0
```
**Was:** the same, feeding "measured {n} minutes ago" at S-027.

**Change:** none.

---

## §C `run.html` — a run in progress

### S-097 · run.html:6 · `<title>`
```
windowsweep - Run
```
**Was:** identical.

**Change:** none.

### S-098 · run.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - a run in progress. Per-section progress from the engine's own ##windowsweep lines.
```
**Was:** identical.

**Change:** none. A `prototype` exemption.

### S-099 · run.html:27 and `page-run.js:80, 136` · run state
```
Ready to run
Running
Finished
Cancelled
```
**Was:** the same four.

**Change:** none.

### S-100 · run.html:31-35 · run sub-line
```
{n} of {n} sections · {n}s elapsed
not started
```
**Was:** the same.

**Change:** none.

### S-101 · run.html:38 · cancel button
```
Cancel
```
**Was:** Cancel

**Change:** none.

### S-102 · run.html:39 · start button
```
Start the safe run
```
**Was:** Start the safe run

**Change:** none. The verb is "start" and the object is named, so a reader who has read the ladder on Home
knows which sections that phrase covers before pressing anything, which is the whole reason the label is
four words rather than one.

### S-103 · run.html:48-49 · zone label
```
What is going
Tiles leave as each section finishes
```
**Was:** the same pair.

**Change:** none. Three words that say exactly what the map is showing while it drains, in the present tense
this voice uses for anything happening now.

### S-104 · run.html:59 · zone label
```
Per section
```
**Was:** Per section

**Change:** none.

### S-105 · `page-run.js:45, 154, 160` · per-section status
```
queued
running
done
```
**Was:** the same three.

**Change:** none.

### S-106 · run.html:65-66 · log zone label
```
Log
never animates - this is the surface you watch while something irreversible happens
```
**Was:** identical.

**Change:** none. It states a design rule as a fact about the screen, and the reason given is the reader's
rather than ours.

### S-107 · `page-run.js:137` · log, run header
```
windowsweep {version} - safe batch, {n} sections
```
**Was:** windowsweep {version} – safe batch, {n} sections

**Change:** the en dash becomes a hyphen. The log pane reproduces engine output, the engine is ASCII-only by
IRON rule, and a typographic dash there implies the engine emits characters it cannot emit.

### S-108 · `page-run.js:138` · log, mode line
```
mode=all dry_run=false developer={bool} idle_days={n}
```
**Was:** identical.

**Change:** none.

### S-109 · `page-run.js:152, 163` · log, machine-readable progress
```
##windowsweep section={n} event=start
##windowsweep section={n} event=end status=ran freed_bytes={n}
```
**Was:** the same.

**Change:** none. These are the engine's own lines, quoted; row 10 owns them.

### S-110 · `page-run.js:153` · log, per-section start
```
> {key}: walking {n} target
> {key}: walking {n} targets
```
**Was:** `'> ' + key + ': walking ' + item.count + ' target(s)'`

**Change:** the bracketed plural is replaced by two forms. A catalogue cannot pluralise "target(s)" in
another language, the app is built with the mechanism from day one, and the ladder at S-062 already carries
both forms.

### S-111 · `page-run.js:165` · log, per-section end
```
+ {key}: freed {bytes}
```
**Was:** identical.

**Change:** none.

### S-112 · `page-run.js:94` · log, terminal lines
```
+ done
! run cancelled by the user
```
**Was:** the same pair.

**Change:** none.

### S-113 · `page-run.js:202` · log, idle line
```
idle - press "Start the safe run"
```
**Was:** idle – press “Start the safe run”

**Change:** the dash and the curly quotes become ASCII, for the reason given at S-107.

### S-114 · `page-run.js:210` · log, cancel line
```
> cancel requested - finishing the section in flight
```
**Was:** > cancel requested – finishing the section in flight

**Change:** ASCII hyphen, as above. The wording is right: a cancel does not abandon a section mid-delete,
and saying which one is still running is what stops a reader pulling the plug on the window.

### S-115 · run.html:71 · disclosure summary
```
Where these numbers come from
```
**Was:** Where these numbers come from

**Change:** none.

### S-116 · run.html:75-76 · disclosure body
```
The progress you see is reported by the cleanup engine itself as it works. This window displays it and does none of the deleting.
```
**Was:** identical.

**Change:** none.

### S-117 · run.html:87, 91 · finish zone labels
```
Drives after the run
Report
```
**Was:** the same pair.

**Change:** none.

### S-118 · `page-run.js:85-86` · finish line
```
Freed {bytes} across {n} sections in {n} seconds.
```
**Was:** identical.

**Change:** none.

### S-119 · run.html:94-95 · report path
```
%USERPROFILE%\.windowsweep\reports\run-{stamp}.json
```
**Was:** identical.

**Change:** none.

### S-120 · run.html:97-99 · finish actions
```
Open report
Export HTML
Back to home
```
**Was:** the same three.

**Change:** none.

### S-121 · `page-run.js:95-97` · finish toasts
```
Freed {bytes}. Report written.
Run cancelled. {bytes} had already been freed.
```
**Was:** the same pair.

**Change:** none. The cancel branch reports what was already gone rather than implying the run undid itself,
which is the reversibility rule applied to a message nobody plans to read.

### S-122 · `page-run.js:125` · empty safe batch
```
Nothing in the safe batch to run.
```
**Was:** identical.

**Change:** none.

### S-123 · `page-run.js:114-115` · drive rows after the run
```
{bytes} free
was {bytes}
```
**Was:** the same pair.

**Change:** none.

### S-124 · run.html:113 · status bar, command
```
windowsweep --all --yes --json
```
**Was:** the same, with `--developer` or `--not-developer` appended.

**Change:** none. Showing the equivalent command on the screen that runs it is the strongest thing this app
does for a sceptical reader, because it makes the window inspectable rather than asking to be trusted.

---

## §D `splash.html` — boot and update

### S-125 · splash.html:6 · `<title>`
```
windowsweep - Starting
```
**Was:** identical.

**Change:** none.

### S-126 · splash.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - the boot and update gate.
```
**Was:** identical.

**Change:** none. A `prototype` exemption.

### S-127 · splash.html:27-28 · wordmark
```
windowsweep
Reclaim
```
**Was:** the same pair.

**Change:** none.

### S-128 · `page-splash.js:8-11` · boot steps
```
Starting the engine…
Reading the catalogue - 26 sections
Checking for a newer build…
Ready
```
**Was:** the same four, with an en dash in step two.

**Change:** the dash in step two becomes a hyphen, matching the log convention at S-107; the words are
unchanged. Each step names the thing being done rather than saying "Loading", which is what makes a boot
screen honest.

### S-129 · `page-splash.js:77` · boot step, offline branch
```
Checking for a newer build… no answer
```
**Was:** identical.

**Change:** none.

### S-130 · splash.html:38 · disclosure summary
```
What happens while this is on screen
```
**Was:** What happens while this is on screen

**Change:** none.

### S-131 · splash.html:42-44 · disclosure body, paragraph 1
```
Three things, none of which touch your disk: the bundled engine reports its version, the catalogue is read from --list --json so a new section appears without an app update, and the updater checks whether a newer build exists.
```
**Was:** identical.

**Change:** none.

### S-132 · splash.html:45-46 · disclosure body, paragraph 2
```
Nothing is scanned and nothing is deleted until you ask. If the update check cannot reach the network it is skipped silently - reclaiming space has never needed it.
```
**Was:** …it is skipped silently – cleaning has never needed it.

**Change:** "cleaning" becomes "reclaiming space", per the glossary; the dash becomes a hyphen for
consistency with the rest of the screen. The claim itself is correct and worth keeping, because a boot
screen that admits it does not need the network is doing the argument's work early.

### S-133 · splash.html:58 · update panel heading
```
Version {version} is ready
```
**Was:** Version 1.2.0 is ready

**Change:** none to the wording. The version is `demo-data`; the app interpolates whatever the updater
found.

### S-134 · splash.html:59-60 · update panel body
```
It installs when you close the app, or now if you prefer. Your settings and history are untouched either way.
```
**Was:** identical.

**Change:** none.

### S-135 · splash.html:66-67 · update panel actions
```
Later
Install and restart
```
**Was:** the same pair.

**Change:** none.

### S-136 · splash.html:78-80 · offline note
```
The update check could not reach the network. Skipped - nothing else in windowsweep needs it.
```
**Was:** identical, with an en dash.

**Change:** the dash only.

### S-137 · splash.html:79-80 · offline retry
```
Try again
```
**Was:** Try again

**Change:** none.

### S-138 · `page-splash.js:49` · toast, update deferred
```
It will install the next time you close windowsweep.
```
**Was:** identical.

**Change:** none.

### S-139 · `page-splash.js:64` · toast, update downloaded
```
Downloaded and verified. This is a design prototype, so nothing restarts.
```
**Was:** identical.

**Change:** none. A `prototype` exemption on the second sentence.

### S-140 · `page-splash.js:70` · toast, retry offline
```
Checked again - still offline. Carrying on without it.
```
**Was:** Checked again – still offline. Carrying on without it.

**Change:** the dash only. "Carrying on without it" is the one place on this screen where the workshop band
is audible, and it is allowed here because nothing has been deleted and nothing is at risk.

### S-141 · splash.html:34 · boot step live region
```
(role="status", aria-live="polite" — announces S-128 as it changes)
```
**Was:** the same.

**Change:** none.

### S-142 · splash.html:92 · status bar, page text
```
boot + update gate
```
**Was:** boot + update gate

**Change:** none.

### S-143 · splash.html · absent rail
```
(no rail on this screen, by design)
```
**Was:** the same.

**Change:** none, recorded so nobody adds one. Offering navigation before the app is ready would be a claim
the screen cannot honour.

---

## §E `account.html` — identity and sync

### S-144 · account.html:6 · `<title>`
```
windowsweep - Account
```
**Was:** identical.

**Change:** none.

### S-145 · account.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - optional Google sign-in for sync only.
```
**Was:** identical.

**Change:** none. A `prototype` exemption.

### S-146 · account.html:25-26 · eyebrow and heading
```
Optional
Sign in only if you want your settings on another machine.
```
**Was:** the same pair.

**Change:** none. The heading is a complete answer to the question the screen raises, which is why the eye
does not have to travel further to learn whether this matters.

### S-147 · account.html:27-29 · lede

**NEEDS DECISION:** the current line reads *"Cleaning is never gated. There is no paid tier, no plan and
nothing to buy - signing in moves your settings and a summary of each run between your own machines, and
that is all it does."* Two problems. "Cleaning" is the glossary's banned verb and would be "Reclaiming space
is never gated" in any version of this line. The pricing claim is the same one raised at S-090 and is
answered there; whichever option is chosen applies here first, because this is the screen that states it
most plainly. If option (b) is chosen, the line reads: "Reclaiming space is never gated. Signing in moves
your settings and a summary of each run between your own machines, and that is all it does."

### S-148 · `page-account.js:14-15` · signed-out card
```
Not signed in
Everything works as it is.
```
**Was:** the same pair.

**Change:** none.

### S-149 · `page-account.js:17-18` · signed-out card body
```
You are using every feature windowsweep has. Signing in adds one thing: your settings and a summary of each run follow you to another machine.
```
**Was:** identical.

**Change:** none.

### S-150 · `page-account.js:22` · sign-in button
```
Sign in with Google
```
**Was:** Sign in with Google

**Change:** none.

### S-151 · `page-account.js:36-37` · sign-in note
```
It opens your normal browser, not a window inside this app - so you can see the address bar and windowsweep never sees your password.
```
**Was:** identical.

**Change:** none. Band R again, and the mechanism is the reassurance: a reader who watches the system
browser open can see that no password was ever typed into this window.

### S-152 · `page-account.js:45-46` · signed-in card
```
Signed in
{email}
```
**Was:** the same.

**Change:** none.

### S-153 · `page-account.js:54, 62` · account actions
```
Sign out
Delete the cloud copy
```
**Was:** the same pair.

**Change:** none. The destructive button names what it deletes and where, so nobody presses it thinking it
clears local history.

### S-154 · `page-account.js:58` · toast on sign-out
```
Signed out. Everything on this machine stays exactly as it is.
```
**Was:** identical.

**Change:** none.

### S-155 · `page-account.js:29` · toast on sign-in
```
Signed in. Your settings will sync from now on.
```
**Was:** identical.

**Change:** none.

### S-156 · `page-account.js:64` · toast on deleting the cloud copy
```
This would delete your synced settings and run summaries. Local history is untouched.
```
**Was:** identical.

**Change:** none. It states the boundary of a deletion before the deletion, which is the rule this whole
product is built around.

### S-157 · account.html:41 · panel heading
```
What is stored, exactly
```
**Was:** What is stored, exactly

**Change:** none.

### S-158 · account.html:44 · table headers
```
Field · Why
```
**Was:** the same pair.

**Change:** none.

### S-159 · account.html:46-49 · table rows
```
Email address     It is the account.
Display name      Shown in this window.
Your settings     So a second machine starts where you left off.
Run summaries     Date, bytes freed, section count. Nothing else.
```
**Was:** the same four rows.

**Change:** none. The last cell ends on a two-word refusal, which is this voice's habit and also the most
load-bearing thing in the table, because a reader weighing up sign-in is really deciding what leaves the
machine.

### S-160 · account.html:53-57 · never-stored note
```
Never stored: a file path, a folder name, a drive label, your machine name or your Windows user name. A cloud run row is labelled summary only in History for exactly that reason - the detail stays on the machine that made it.
```
**Was:** identical.

**Change:** none.

### S-161 · account.html:66 · zone heading
```
Sync
```
**Was:** Sync

**Change:** none.

### S-162 · `page-account.js:77-79` · sync rows
```
Settings                                    Synced {n} minutes ago | Local only
Run summaries                               {n} of {n} runs uploaded - date, bytes, section count | Local only
Paths, drive labels, machine name           Never uploaded, signed in or not
```
**Was:** the same three rows.

**Change:** none. The third row has no state and no switch, and that is the point of listing it beside two
that do.

### S-163 · `page-account.js:89` · sync badges
```
syncing
local
```
**Was:** the same pair.

**Change:** none.

### S-164 · account.html:70 · disclosure summary
```
What happens when two machines disagree
```
**Was:** What happens when two machines disagree

**Change:** none.

### S-165 · account.html:74-76 · disclosure body, paragraph 1
```
The newer change wins, and you are told which one it was with an Undo that puts the other back. Settings are small and rarely edited on two machines at once, so a silent merge would be more surprising than a visible choice.
```
**Was:** identical.

**Change:** none.

### S-166 · account.html:77-78 · disclosure body, paragraph 2
```
Run history never conflicts: a run belongs to the machine that made it and is only ever added or removed, never edited.
```
**Was:** identical.

**Change:** none.

### S-167 · account.html:91 · status bar, page text
```
sync is optional - runs are never gated
```
**Was:** sync is optional - runs are never gated

**Change:** none, subject to the decision at S-090 and S-147. "Never gated" is a statement about runs rather
than about pricing, so it survives every option on the table.

### S-168 · `page-account.js:6` · demo identity
```
you@example.com
```
**Was:** you@example.com

**Change:** none. A `demo-data` exemption, and a reserved example domain rather than a real address.

---

## Found in the dummy, reported rather than fixed

Three of these are wiring rather than wording, and none may be changed from this draft.

The card action at S-069 still says the picker is in a later batch, though `picker.html` shipped with the A4
screens; the same is true of "Open the report" at S-077, which `report.html` can now satisfy. Both should
navigate rather than apologise. Separately, the `data-ws-consent` list on Home renders through
`wire.js:390`, while `consent.html` renders its own richer list through `page-consent.js`, so the two lists
of the same four switches are built by different code and have already drifted apart in wording, which is
what S-088 records.

---

## Self-check

**Palette.** Band P dominates, as row 11 asks: the readout, the ladder, the log and the report path all
state exact quantities with their units. Band R carries S-057, S-067, S-070, S-073, S-074, S-086 and S-151.
Band W appears three times and no more, at S-036, S-057 and S-140, and never within reach of a destructive
control.

**Rhythm.** Shortest shipping string that is a sentence: "Ready" at S-128. Shortest full sentence: "Nothing
to reclaim." at three words, S-040. Longest: S-131 at forty words, which is a list of three mechanisms and
earns its length. The range is wide on purpose.

**Length.** Home carries about 394 words of visible HTML copy plus the strings `wire.js` injects, `run.html`
about 97, `splash.html` about 135 and `account.html` about 217. All four sit inside row 11's "a screen" cap,
and the rewrites are one for one or shorter in every case except S-041, which gains four words to remove an
unmeasurable comparison.

**Unsure.** Three `NEEDS DECISION` entries: S-085 on the installer signing claim, which defers to
`desktop-safety.md` S-058; S-090 on the pricing claim in Home's privacy disclosure; and S-147 on the same
claim in the Account lede, which is where a reader meets it first.
