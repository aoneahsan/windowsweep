# report-bodies - the Markdown and HTML a run exports

Content-map row **15** · surface `modules/reports.ps1`, the two export functions · awareness **reading a
record after the fact** · structure **headings and labels only; every number keeps the console's own
vocabulary** · tone band **P only, no W** · length **about thirty strings** · CTA **none** · schema none.

Two functions write every word a reader keeps. `Convert-ReportToMarkdown` at `reports.ps1:36` and
`Convert-ReportToHtml` at `:68` read one JSON file and emit the same run twice, and nothing has ever held
them to the same words. They drifted.

The drift is measurable rather than stylistic. The Markdown heads its per-section block `## Steps`; the HTML
heads the same block `Sections`. The Markdown's drive columns read `Before free` and `After free`; the
HTML's read `Free before` and `Free after`, in a different column order. The HTML's `<title>` says
`windowsweep report` while its own `<h1>`, twenty lines further down the same document, says `windowsweep
session report`. And both exports still carry `Would free`, the verb the `cli-strings` pass moves off the
console - which is why row 15 was added on 2026-09-07 rather than left for later.

**Scope, stated because this file is shared**. Row 15 owns what lands **inside the exported document**:
`reports.ps1:41-62` for the Markdown and `:73-127` for the HTML. The console strings in the same file - the
reports manager, the export errors, `--stats` - belong to row 10 and are already slotted as **C-097 to
C-116** in `cli-strings.md`. Two of those sit physically inside the export functions (`Write-Err` at
`:39,71` is C-100; `Write-Ok` at `:64,131` is C-101) and are **not** re-slotted here. The per-section status
words - `ran`, `dry-run`, `skipped`, `refused`, `failed` - are data written by `runner.ps1`, not literals in
this file, so this surface does not own them either.

| File | Slot range | Count |
|---|---|---|
| §A `Convert-ReportToMarkdown` - `reports.ps1:41-62` | S-001 - S-018 | 18 |
| §B `Convert-ReportToHtml` - `reports.ps1:73-127` | S-019 - S-033 | 15 |
| **Total** | | **33** |

Ten slots change. Twenty-three are already right and are kept as numbered slots so the applier can see they
were read rather than missed.

## Conventions in this file

- **`Was:` quotes the literal fragment exactly as it stands in `modules/reports.ps1`**, in its PowerShell
  quoting, so every one can be checked with a fixed-string search. The surrounding code is untouched.
- The fenced block below it holds the **shipping fragment** in the same form. Substitute the fragment; leave
  the line around it alone.
- Where a slot changes nothing, `Was:` reads `identical` and the single fence is the verbatim current text.
- 🔴 **Every byte inside every fence is ASCII**. `release_helpers.ps1:67-73` is self-test check [4], which
  counts non-ASCII bytes per engine file and fails the build with `PowerShell 5.1 would misread this file`.
  No en dash, no curly quote, no ellipsis character - straight quotes, `-` and `...` only. The 🔴 and `·`
  marks in this commentary are house signals and reach no engine file.
- These strings ship with the **1.2.0** cascade, alongside `cli-strings`, because they edit the same engine.
  The published version is 1.1.0.

---

## §A `Convert-ReportToMarkdown` - `reports.ps1:41-62`

### S-001 · `reports.ps1:44` · the document heading
**Was:** identical.
```text
"# $Script:WS_NAME session report"
```
**Change:** none. It already matches the HTML `<h1>` at `:113` word for word, which is the one thing this
surface most has to protect.

### S-002 · `reports.ps1:45` · the provenance line
**Was:** identical.
```text
"_Generated from ``$([IO.Path]::GetFileName($Json))``_"
```
**Change:** none. `Generated from` is the same phrase the HTML footer uses at `:127`; only its position in
the document differs, and neither export says it twice.

### S-003 · `reports.ps1:46` · the run-facts heading
**Was:** `'## Overview'`
```text
'## Run'
```
**Change:** the word, to the one the HTML already ships at `:117`. `Overview` promises a summary of the
whole document and delivers eleven fields of run metadata; `Run` names exactly what is under it, and it is
the product's own noun - `--stats` prints the box `Run history` at `:197`. Two alternatives were considered
and rejected. Moving the HTML to `Overview` instead spends the same edit on the weaker word. And
`## This run` dodges a possible imperative reading, but it breaks the one-word parallel with `Result`,
`Drives` and `Sections` and introduces a word neither export ships today. That imperative reading is a real
risk and a small one: the heading sits between an H1 and `## Result`, above a two-column table.

### S-004 · `reports.ps1:46` · the run-facts column labels
**Was:** identical. Shares line 46 with S-003.
```text
'| Field | Value |'
```
**Change:** none. The HTML renders the same pairs as a `<dl>`, which needs no column labels, so this string
has no counterpart to diverge from.

### S-005 · `reports.ps1:47` · the run boundaries
**Was:** identical.
```text
"| Started | $($r.meta.started_at) |"; $l += "| Finished | $($r.meta.finished_at) |"
```
**Change:** none. The HTML carries the same two instants in its subtitle at `:114`, joined by `to` rather
than labelled, which is the grammar that position needs.

### S-006 · `reports.ps1:47` · the duration unit
**Was:** `"| Duration | $($r.meta.duration_seconds) s |"`
```text
"| Duration | $($r.meta.duration_seconds)s |"
```
**Change:** one space. The HTML prints the same value with no space at `:114`, and `Format-Duration` - what
the console prints after every run - emits `2m 14s`, also with no space. One number, one spelling. See
finding **F-5**: both exports print raw seconds where the console prints `2m 14s`, and closing that is a
code change rather than a label change.

### S-007 · `reports.ps1:48` · the machine facts
**Was:** identical.
```text
"| Host | $($r.meta.host) |"; $l += "| User | $($r.meta.user) |"; $l += "| Windows | $($r.meta.os) |"; $l += "| Mode | $($r.meta.mode) |"
```
**Change:** none. `Windows` and `Mode` are identical to the HTML terms at `:118-119`. `Host` has no HTML
label; its value sits unlabelled in the subtitle, S-023. `User` has no HTML counterpart at all, and
finding **F-3** recommends keeping it that way.

### S-008 · `reports.ps1:49` · the run settings
**Was:** identical.
```text
"| Dry-run | $dry |"; $l += "| Elevated | $($r.meta.elevated) |"; $l += "| Developer mode | $($r.meta.developer_mode) |"; $l += "| Idle window | $($r.meta.idle_days) days |"
```
**Change:** none. All four labels, and the `days` unit, already match the HTML terms at `:118-119` character
for character. Their **values** do not - finding **F-2**.

### S-009 · `reports.ps1:41-42` · the dry-run answer
**Was:** identical.
```text
$dry = 'no'
$dry = 'yes'
```
**Change:** none. `yes` and `no` are the reader's words for this question and they are correct here. The
defect is that the same document answers `Elevated` and `Developer mode` with PowerShell's `True` and
`False`, and the HTML answers all three that way - finding **F-2**, which is a code change and is flagged
rather than slotted.

### S-010 · `reports.ps1:50` · the outcome heading
**Was:** identical.
```text
'## Result'
```
**Change:** none. The HTML has no matching heading, deliberately - finding **F-4**.

### S-011 · `reports.ps1:51` · the dry-run headline 🔴 the reclaim verb, place one of two
**Was:** `"**Would free (estimate): $($r.totals.total_estimated_human)**  "`
```text
"**Would reclaim (est.): $($r.totals.total_estimated_human)**  "
```
**Change:** the verb and the abbreviation, to the exact string the console ships. `reclaim` is the
glossary's verb for what this tool does to space, and `free up` sits in its Never column. `cli-strings`
C-088 moved `runner.ps1:182` to `Would reclaim (est.):` and C-074 moved the per-section line with it, so
leaving this one behind is the divergence row 15 exists to end. `(est.)` rather than `(estimate)` because
the console's abbreviation was forced by a measured constraint - `Write-Kv` pads its key to 24 characters -
and matching it exactly is worth more here than re-deriving a longer word that would then differ again.
🔴 **The two spaces before the closing quote are a Markdown hard line break** - they must survive the edit.

### S-012 · `reports.ps1:51` · the real headline
**Was:** identical. Shares line 51 with S-011.
```text
"**Reclaimed: $($r.totals.total_reclaimed_human)** ($($r.totals.total_reclaimed_bytes) bytes)  "
```
**Change:** none. It is already the glossary's verb, it already matches `Write-Kv 'Reclaimed:'` at
`runner.ps1:184`, and it is why S-011 moves toward it. Same trailing two spaces, same reason.

### S-013 · `reports.ps1:52` · the section counts
**Was:** `"Sections run: $($r.totals.steps_run) - skipped/refused: $($r.totals.steps_skipped)"`
```text
"Sections run: $($r.totals.steps_run) - skipped: $($r.totals.steps_skipped)"
```
**Change:** `skipped/refused` becomes `skipped`, which is the console's word at `runner.ps1:190` and the
HTML's at `:116`. Dropping `refused` loses nothing the reader cannot see: the Status column six lines below
names every section's real outcome, one row each. Nor does it trade an accurate label for a vague one.
`steps_skipped` counts **skipped, refused and failed** alike, so `skipped/refused` was already incomplete.
Whether the underlying label should name all three is row 10's question, not this surface's - finding
**F-6**.

### S-014 · `reports.ps1:53` · the drives heading
**Was:** identical.
```text
'## Drives'
```
**Change:** none. Identical to the HTML at `:124`.

### S-015 · `reports.ps1:53` · the drive columns
**Was:** `'| Drive | Before free | After free | Size |'`
```text
'| Drive | Free before | Free after | Size |'
```
**Change:** two labels, to the HTML's wording at `:125`. `Free before` keeps the console's own noun in the
head position - `Show-DriveTable` prints `DRIVE SIZE USED FREE USE%` at `log.ps1:68` - and it reads as
English, which `Before free` does not. **Column order is left alone on purpose**. The HTML shows `Size`
second and the Markdown shows it fourth. Moving it here would also require reordering the data row at
`:58`, so a half-applied slot would print headers over the wrong cells. That is finding **F-1**, with the
second line named.

### S-016 · `reports.ps1:60` · the per-section heading
**Was:** `'## Steps'`
```text
'## Sections'
```
**Change:** the word, to the HTML's at `:121` and to the glossary's. A numbered unit of work is a
**section** in this product - 0 to 25, a frozen public contract - and the table's own second column already
says `Section`. `steps` stays the JSON key, which no reader sees.

### S-017 · `reports.ps1:60` · the per-section columns 🔴 the same glossary rule, a third place
**Was:** `'| # | Section | Title | Status | Freed |'`
```text
'| # | Section | Title | Status | Reclaimed |'
```
**Change:** the last label. This goes beyond the two places row 15 named, and it is the same rule: `Freed`
is the past tense of the verb the glossary bans for space, and C-075 already moved `runner.ps1:130` from
`this section freed` to `this section reclaimed`. The console's own column header for this quantity is
`RECLAIMED`, one function above in this file at `:17`. On a dry-run report the column holds estimates
under a header reading `Reclaimed` - exactly as true as `Freed` is today, no worse, with the `Status` cell
immediately to its left reading `dry-run` on every row. The product already answered this at `:25`, where
the console keeps the `RECLAIMED` header and marks the cell as a dry figure; mirroring that into the export
cells is a code change and is not ordered here. **Flagged for the owner's veto**, since it widens the brief
by one label in each output.

### S-018 · `reports.ps1:62` · the Markdown footer
**Was:** identical.
```text
"_${Script:WS_NAME} v$($r.meta.tool_version) by $($r.credits.author.name) - $($r.credits.tool_homepage)_"
```
**Change:** none. Every token it shares with the HTML footer - the product name, `v` before the version, the
author's name - is already identical. The word `by` does different work in the two documents - here it means
authored by, there it means generated by. That was considered and kept: rewriting one of them buys a shade
of precision and costs a dash-separated third clause in a one-line credit.

---

## §B `Convert-ReportToHtml` - `reports.ps1:73-127`

### S-019 · `reports.ps1:73` · the totals label, a real run
**Was:** identical.
```text
$headline = "Reclaimed"
```
**Change:** none. Matches S-012 and the console's `Reclaimed:` row.

### S-020 · `reports.ps1:74` · the totals label, a dry-run 🔴 the reclaim verb, place two of two
**Was:** `$headline = 'Would free (dry-run estimate)'`
```text
$headline = 'Would reclaim (est.)'
```
**Change:** the whole label, to the string S-011 and the console both ship. `dry-run` is dropped from it,
and that was the argument worth having: this is the biggest number in the document, and naming the mode
beside it is a real safeguard. Three things already carry that safeguard in the same document - `Would` and
`(est.)` in the label itself, `Dry-run` in the Run block eight lines below, and a `dry-run` badge on every
row of the Sections table. Nothing is lost, and one number now reads the same in the console, the Markdown
and the HTML. The alternative - `Would reclaim (dry-run estimate)`, keeping the verb and the parenthetical -
is **flagged for the owner's veto**; it is one edit either way.

### S-021 · `reports.ps1:93` · the browser tab title
**Was:** `<title>$Script:WS_NAME report - $(ConvertTo-HtmlText $r.meta.started_at)</title>`
```text
<title>$Script:WS_NAME session report - $(ConvertTo-HtmlText $r.meta.started_at)</title>
```
**Change:** one word. The document calls itself `windowsweep session report` in its own `<h1>` twenty lines
below, and in the Markdown's H1; the tab said `windowsweep report`. That is a document disagreeing with
itself, which is the smaller cousin of two documents disagreeing.

### S-022 · `reports.ps1:113` · the document heading
**Was:** identical.
```text
<h1>$Script:WS_NAME session report</h1>
```
**Change:** none. Identical to S-001.

### S-023 · `reports.ps1:114` · the subtitle
**Was:** identical.
```text
$(ConvertTo-HtmlText $r.meta.started_at) to $(ConvertTo-HtmlText $r.meta.finished_at) - $($r.meta.duration_seconds)s - $(ConvertTo-HtmlText $r.meta.host)
```
**Change:** none. It holds the same four facts the Markdown labels at `:47-48`; S-006 moves the Markdown's
duration unit to this spelling rather than the reverse.

### S-024 · `reports.ps1:116` · the section counts
**Was:** identical.
```text
<strong>$($r.totals.steps_run)</strong> sections run</div><div><strong>$($r.totals.steps_skipped)</strong> skipped
```
**Change:** none. Already the console's vocabulary, and S-013 moves the Markdown to it. The lower case is
grammar rather than a different word: the number precedes the label here and follows it there.

### S-025 · `reports.ps1:117` · the run-facts heading
**Was:** identical.
```text
<h2>Run</h2>
```
**Change:** none. S-003 moves the Markdown to this word.

### S-026 · `reports.ps1:118` · the first three run settings
**Was:** identical.
```text
<dt>Mode</dt> ... <dt>Dry-run</dt> ... <dt>Elevated</dt>
```
**Change:** none as labels; all three match S-008. Their values do not - finding **F-2**.

### S-027 · `reports.ps1:119` · the remaining run settings
**Was:** identical.
```text
<dt>Developer mode</dt> ... <dt>Idle window</dt><dd>$($r.meta.idle_days) days</dd> ... <dt>Windows</dt>
```
**Change:** none. Labels and the `days` unit match S-008 exactly.

### S-028 · `reports.ps1:120` · the log path
**Was:** identical.
```text
<dt>Log file</dt>
```
**Change:** none, and it stays HTML-only - finding **F-3**.

### S-029 · `reports.ps1:121` · the per-section heading
**Was:** identical.
```text
<h2>Sections</h2>
```
**Change:** none. S-016 moves the Markdown to this word.

### S-030 · `reports.ps1:122` · the per-section columns
**Was:** `<th>#</th><th>Section</th><th>Title</th><th>Status</th><th class="num">Freed</th>`
```text
<th>#</th><th>Section</th><th>Title</th><th>Status</th><th class="num">Reclaimed</th>
```
**Change:** the last label, paired with S-017 and carrying the same reasoning and the same veto flag; the
first four already match the Markdown exactly.

### S-031 · `reports.ps1:124` · the drives heading
**Was:** identical.
```text
<h2>Drives</h2>
```
**Change:** none. Identical to S-014.

### S-032 · `reports.ps1:125` · the drive columns
**Was:** identical.
```text
<th>Drive</th><th class="num">Size</th><th class="num">Free before</th><th class="num">Free after</th>
```
**Change:** none. S-015 moves the Markdown's wording to these four labels. The order still differs - finding
**F-1**.

### S-033 · `reports.ps1:127` · the HTML footer
**Was:** identical.
```text
Generated from <code>$(ConvertTo-HtmlText ([IO.Path]::GetFileName($Json)))</code> by <a href="$Script:WS_REPO">$Script:WS_NAME</a> v$(ConvertTo-HtmlText $r.meta.tool_version) - $(ConvertTo-HtmlText $r.credits.author.name)
```
**Change:** none. `Generated from` matches S-002; the product name, the `v` prefix and the author's name
match S-018. See S-018 for the one word that does different work in each.

---

## The both-outputs audit

Row 15's hard constraint is that a reader comparing two exports of one run must not see two products, so
these are the strings that reach **both** documents, with the single wording each now carries.

| The thing named | Markdown | HTML | One string |
|---|---|---|---|
| the document's own name | S-001 | S-021, S-022 | `windowsweep session report` |
| the run-facts block | S-003 | S-025 | `Run` |
| the dry-run total | S-011 | S-020 | `Would reclaim (est.)` |
| the real total | S-012 | S-019 | `Reclaimed` |
| the section counts | S-013 | S-024 | `Sections run` and `skipped` |
| the drives block | S-014 | S-031 | `Drives` |
| the drive columns | S-015 | S-032 | `Drive`, `Size`, `Free before`, `Free after` |
| the per-section block | S-016 | S-029 | `Sections` |
| the per-section columns | S-017 | S-030 | `#`, `Section`, `Title`, `Status`, `Reclaimed` |
| the run settings | S-008 | S-026, S-027 | `Mode`, `Dry-run`, `Elevated`, `Developer mode`, `Idle window`, `days`, `Windows` |
| the duration | S-006 | S-023 | seconds, suffixed `s`, no space |
| provenance and credit | S-002, S-018 | S-033 | `Generated from`, the `v` prefix, the author's name |

**Markdown only:** `Field`, `Value`, `Started`, `Finished`, `Host`, `User`, `yes`, `no`, `Result`.
**HTML only:** `Log file`.

Every one of those is accounted for in a slot above or a finding below; none is a silent difference.

## Findings - real, and outside this surface's mandate

Row 15 says headings and labels only. Each of these needs code changed, so each is reported and none is
slotted.

**F-1 - the drive columns are in two orders**. The Markdown prints `Drive, Free before, Free after, Size`;
the HTML prints `Drive, Size, Free before, Free after`. S-015 aligns the wording, then stops. The Markdown's
header order is set by its data row at `reports.ps1:58`, so to align the order both `:53` and `:58` move
together in one commit; applying either alone prints headers over the wrong cells.

**F-2 - one kind of fact answers three ways**. In the Markdown, `Dry-run` reads `yes` or `no` (from `$dry`
at `:41-42`) while `Elevated` and `Developer mode` read `True` or `False` straight from the JSON. In the
HTML, all three read `True` or `False`. So the same question is answered two ways inside one document and a
third way across the pair. The direction is not in doubt - a report a person reads should answer `yes` or
`no` - but it needs the `$dry` pattern extended to two more Markdown fields and introduced into three HTML
value cells. Recommended, not ordered.

**F-3 - `User` is Markdown-only, `Log file` is HTML-only, and both should stay that way**. Adding `Log file`
to the Markdown puts a full local path into the export most often pasted into an issue; adding `User` to the
HTML widens the same exposure in the export most often shared as a file. Neither absence is a vocabulary
divergence, and `docs/reports-and-logs.md` already tells the reader to review a bundle before attaching it.

**F-4 - the HTML has no `Result` heading, deliberately**. Its totals card labels itself with the headline
variable, so the label is the heading. Adding a second-level heading there would change the layout rather
than the words, and the words are what row 15 governs.

**F-5 - both exports print raw seconds; the console prints `2m 14s`**. `Format-Duration` is what
`runner.ps1:187` uses. S-006 makes the two exports agree with each other; making them agree with the console
means calling `Format-Duration` in both, which is a code change.

**F-6 - `steps_skipped` counts skipped, refused and failed**. `runner.ps1:189` counts every step whose
status is not `ran` or `dry-run`. So the console's `Sections run / skipped:` and the Markdown's
`skipped/refused` are each incomplete in their own way. S-013 aligns to the console because row 15 says the
number keeps the console's vocabulary; whether that label should name all three outcomes is row 10's
decision, recorded here so it is not lost.

**F-7 - two line numbers in `cli-strings.md` do not match the file**. Its NEEDS DECISION 2 and C-117 cite
`reports.ps1:104` and `:75` for the two `Would free` strings. Measured on disk today they are at **`:51`**
(Markdown) and **`:74`** (HTML); line 104 is a stylesheet rule and line 75 initialises the rows variable. An
applier following those references would patch neither string. Reported, not edited. That draft is another
agent's file.

---

## Self-check

**Palette** - band **P only**, as row 15 requires. Every shipping string is a bare noun or a labelled
figure: `Run`, `Result`, `Drives`, `Sections`, `Reclaimed`, `Free before`. No band W anywhere. No aside, no
joke, no adjective doing a number's work, and nothing that reads as reassurance rather than as a label; band
R would be as wrong here as W, because a label makes no promise. Nothing in the set sits near a destructive
action: these thirty-three strings are written **after** the run, into a file.

**Rhythm** - the shipping strings are labels, so burstiness is measurable only on this commentary, where it is
deliberate. **Scope and method, written down so a re-measure can match**: the whole finished file with fences,
table rows and headings removed, split on `(?<=[.!?])\s+`, a word counted as `[A-Za-z0-9][A-Za-z0-9'._:/-]*`.
On that basis - 230 sentences, mean 14.0 words, standard deviation 10.5, **burstiness 0.75** against the
fingerprint's floor of 0.45. Shortest sentence: **2 words**. Longest: **42 words**, twice, and neither is a
sentence. One is the header's field list; the other is S-030's `Was:` fragment, which the split rule glues
to the `Change:` line after it because a code-quoted `Was:` has no full stop. The longest real sentence is
**41 words**, S-017's glossary reasoning. Both ends of the fingerprint's range appear many times over, and
14 sentences sit above its 34-word ceiling, every one of them commentary rather than shipping prose. Zero
em dashes and zero exclamation marks in the prose; the only exclamation mark in this file sits inside the
split regex quoted above. Zero `not X but Y`. Shipping strings themselves run from one word (`Drives`,
`Sections`) to six, the section-counts line.

**Length** - **33 slots** against the row's cap of *about thirty strings*. Inside it. **211 words ship in
total** across the 33 fences. Counted with `str.split()` over the fence contents, each `$(...)`
interpolation counting as one word. The visible text a reader sees in either export is far less, because
most fences are a single label wrapped in PowerShell quoting. Ten slots change; twenty-three are kept
unchanged and numbered so the applier can see they were considered.

**Unsure spots - zero `NEEDS DECISION`**. Nothing here needed a fact, number, name or quote I did not have;
the one substantive verb came from the approved `cli-strings` C-088 rather than being re-derived. Two calls
are **flagged for the owner's veto**, each reversible in one edit. The first drops `dry-run` from the
HTML's dry-run headline (S-020). The second extends the same glossary rule to the `Freed` column in both
outputs (S-017 and S-030), which widens the brief's *two places* to four.

### Verification run on this file

**ASCII** - all 33 fences were extracted and scanned for bytes outside printable ASCII with
`LC_ALL=C grep '[^ -~]'`; result reported with this draft. The gate that matters at build time is
`release_helpers.ps1:67-73`, self-test check [4], which runs the same test per engine file and fails with
`PowerShell 5.1 would misread this file`.

**`Was:` lines** - each was checked against `modules/reports.ps1` with a fixed-string search rather than by
eye, per the brief's stop rule.

**Banned phrases** - the list at `aoneahsan-cccs-story-craft/assets/banned-phrases.txt` was matched against
the commentary and against the fence contents separately. Zero hits in either. The fingerprint's own Never
list was matched against the fences: zero hits. No allow marker is used, so none needs a reason.

🔴 **This draft is slot-shaped, so the project's lint hook cannot see the copy that ships**.
`posttooluse-story-lint.sh:61` strips every fenced block before it counts anything, and on this file every
shipping string sits inside a fence. The hook therefore measures this commentary and none of the
thirty-three strings a reader will actually read, so a green hook here is not evidence about the surface.
The real gates are the both-outputs audit above, the `Was:` verification, and a person opening one run's
two exports side by side.

**Confidence** - high on the slot inventory, the two reclaim-verb corrections and the both-outputs audit - all
three were read off the file rather than recalled. Medium on two judgement calls, which is why both carry a
veto flag. One is whether the HTML's hero label may lose the word `dry-run` (S-020). The other is whether
`Freed` should follow the glossary to `Reclaimed`, when a dry-run report's column then holds estimates under a
past-tense header (S-017, S-030). Low-risk but worth naming: `## Run` as a Markdown heading can be read as an
imperative for a second, which is the cost of taking the HTML's existing word instead of inventing a third.

Last Updated: 2026-09-08
