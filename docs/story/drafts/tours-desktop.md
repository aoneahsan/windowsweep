# Desktop tours and walkthrough: draft

Look before acting. These keys give each desktop screen a precise tour, with stable landmarks for the implementer and enough context for the reader to choose what to inspect next. Nothing runs here.

| Contract | Detail |
|---|---|
| Source | Content-map row 25; framework: one landmark, one action it enables; first draft for the review panel. |
| Values | English source values for `t()`; anchors are proposed stable `data-tour` values. |
| Boundary | A missing or hidden landmark skips its step; a tour changes no setting, starts no run, signs in to no account, buys no plan and deletes nothing. |

## Shared controls

| i18n key | English value | Use |
|---|---|---|
| `tour.open` | Tour this page | One header button on eligible screens. |
| `tour.hint` | New here? Take the {{count}}-step tour. | Once per page per browser and account, for eight seconds; never over a task. |
| `tour.hintAction` | Show me | Hint action. |
| `tour.next` | Next | Advance. |
| `tour.back` | Back | Previous step. |
| `tour.skip` | Skip tour | Leave without changing anything. |
| `tour.close` | Close tour | Close control label. |
| `tour.finish` | Finish | Last step. |
| `tour.progress` | Step {{current}} of {{total}} | Visible progress and accessible announcement. |
| `tour.jump` | Jump to step | Opens the numbered step list. |
| `tour.jumpItem` | Step {{step}} | One item in the jump-to-step list. |
| `tour.walkthrough.open` | Walk through windowsweep | Entry to the separate walkthrough. |
| `tour.walkthrough.next` | Next screen | Walkthrough advance. |
| `tour.walkthrough.finish` | Open Home | Last walkthrough action. |

## Page tours

| Page-tour rule | Detail |
|---|---|
| Spoken body | Each body is one complete sentence. |
| Exit | Each tour ends with `tour.next` or `tour.finish`; its first action never performs the highlighted screen action. |
| Anchor | Names identify landmarks, never selectors tied to display text. |

### Home: `/`

| Anchor | i18n key | Body |
|---|---|---|
| `home-scan` | `tour.home.scan` | Scan to measure reclaimable space before choosing a run. |
| `home-dry-run` | `tour.home.dryRun` | Dry-run shows what the engine would remove without deleting your files. |
| `home-safety` | `tour.home.safety` | Open the safety detail to see which personal paths windowsweep refuses. |

### Sections: `/sections`

| Anchor | i18n key | Body |
|---|---|---|
| `sections-filter` | `tour.sections.filter` | Filter the section list by what needs your attention. |
| `sections-table` | `tour.sections.table` | Expand a section to read what it covers and whether it needs you or an administrator. |
| `sections-selection` | `tour.sections.selection` | Review the selection bar before rehearsing the chosen sections. |

**With a selection:** The third step appears after the reader has selected something; without a selection, the tour finishes after the table. Nothing is selected for them.

### Choose: `/picker`

| Anchor | i18n key | Body |
|---|---|---|
| `choose-filter` | `tour.choose.filter` | Filter the listed items before making a choice. |
| `choose-table` | `tour.choose.table` | Select an item only after reading its path and size. |
| `choose-consequence` | `tour.choose.consequence` | Read the removal method and consequence before continuing. |

**When the selection bar appears:** The last step can point to it; without a selection, the tour finishes after the table. It selects nothing.

### Run: `/run`, before an active run only

| Anchor | i18n key | Body |
|---|---|---|
| `run-prepared` | `tour.run.prepared` | Check the prepared sections and mode before starting. |
| `run-start` | `tour.run.start` | After checking the dry-run, use Start to run the prepared action. |
| `run-log` | `tour.run.log` | The log shows each section's result when the run finishes. |

**Before a run:** Show the header button and once-only hint only in the idle, prepared state, then close an open tour before the run starts so overlays stay off progress, cancellation, failure and completion. No tour during a run.

### History: `/history`

| Anchor | i18n key | Body |
|---|---|---|
| `history-filter` | `tour.history.filter` | Use Show to narrow the run list to those you need. |
| `history-table` | `tour.history.table` | Open a row to inspect that run's report. |
| `history-total` | `tour.history.total` | The total counts space freed by real runs in the current view. |

**Empty list:** Omit the row step. When no real runs are in view, omit the total step too.

### Report: `/report`

| Anchor | i18n key | Body |
|---|---|---|
| `report-summary` | `tour.report.summary` | Read the heading to distinguish a dry-run estimate from space reclaimed. |
| `report-sections` | `tour.report.sections` | Inspect the section results to see where the figure came from. |
| `report-export` | `tour.report.export` | Export this report if you need a copy outside the app. |

**Readable report:** Show Export only when the report file can be read; if it cannot, show the report's own error state without a tour overlay. No tour over errors.

### Account: `/account`

| Anchor | i18n key | Body |
|---|---|---|
| `account-sign-in` | `tour.account.signIn` | Sign in to connect eligible run summaries across your machines. |
| `account-stored` | `tour.account.stored` | Read the stored-data list to see what belongs to your account. |
| `account-delete` | `tour.account.delete` | The deletion section names what goes and what stays before you confirm anything. |

**Account state:** Use Sign in only while signed out and configured, and show Stored data only while its panel is visible. The deletion step never focuses its confirmation control.

### Settings: `/settings`

| Anchor | i18n key | Body |
|---|---|---|
| `settings-tabs` | `tour.settings.tabs` | Choose a tab to inspect its settings. |
| `settings-thresholds` | `tour.settings.thresholds` | Review the thresholds before changing what a scan includes. |
| `settings-privacy` | `tour.settings.privacy` | Open Privacy to see what the app sends and what it refuses to send. |
| `settings-version` | `tour.settings.version` | Open About to check the installed app and engine versions. |

**Tabs:** The tour may change tabs to reveal a landmark, but it never changes a setting. General holds `settings-thresholds`; when Privacy or About is closed, its tab control is the target.

### Plans: proposed `/plans`, after approval and implementation

| Anchor | i18n key | Body |
|---|---|---|
| `plans-allowance` | `tour.plans.allowance` | Check how many real runs remain this month; scans and dry-runs do not count. |
| `plans-options` | `tour.plans.options` | Compare Pro and Team before choosing a billing period. |
| `plans-referrals` | `tour.plans.referrals` | Open your referrals to see confirmed friends, points and earned Pro months. |

**After approval:** Ship when Plans and its copy have passed review. The tour never opens checkout or submits a plan request.

### Team: Plans page `#team`, after approval and implementation

| Anchor | i18n key | Body |
|---|---|---|
| `team-status` | `tour.team.status` | Read Team status to see whether this account has a seat. |
| `team-members` | `tour.team.members` | Inspect the member list before changing a seat. |
| `team-report` | `tour.team.report` | Open the fleet report for run totals without paths or file names. |

**Team controls:** Show the last two steps only when those controls are present, and ship the tour after the Team surface and copy pass approval. No hidden target is shown.

## Walkthrough: proposed `/walkthrough`

| Walkthrough rule | Detail |
|---|---|
| Surface | Separate, skippable learning screen; proposed route `/walkthrough`. |
| Evidence | Slots below request real app or approved dummy captures after they are made; no image is claimed to exist. |
| Sizes | Capture the same seven steps at 1440 px and the desktop minimum of 760 px; check light and dark. |
| Privacy | Captures contain no personal paths, file names, machine names, account identifiers or real payment details. |
| Alt text | Use the step body plus the screen name. |

| Step | Capture slot | i18n key | Body |
|---|---|---|---|
| 1 | Home, unmeasured | `tour.walkthrough.scan` | Scan first to measure the sections windowsweep can inspect. |
| 2 | Sections, measured | `tour.walkthrough.sections` | Open Sections to inspect what each section covers. |
| 3 | Choose, sample items with non-personal fixture paths | `tour.walkthrough.choose` | Choose an item only after checking its path and removal method. |
| 4 | Home, protected categories expanded with no personal paths visible | `tour.walkthrough.protected` | Open the protected-path list to see which personal paths windowsweep refuses to remove. |
| 5 | Home, measured, dry-run control | `tour.walkthrough.rehearse` | Use a dry-run to see the expected result before any deletion. |
| 6 | Run, completed dry-run | `tour.walkthrough.result` | Read the completed dry-run to check what the engine would have done. |
| 7 | History and report entry, fixture data | `tour.walkthrough.report` | Open a run's report from History to see its recorded result. |

**Behaviour:** Advance one step at a time; trigger no scan, selection, dry-run or real run; use the next-step CTA, then `tour.walkthrough.finish`.

## Implementation notes for copy placement

| Concern | Rule |
|---|---|
| Analytics | Fixed IDs: `home`, `sections`, `choose`, `run`, `history`, `report`, `account`, `settings`, `plans`, `team`; record an ID and step number, never a path, file name, selection, account value or screen text. |
| Access | Preserve keyboard focus; offer Back, Next, Skip, Close and a jump-to-step list at every step; persist hint dismissal once per page per browser and account, and keep the hint absent while Run is active. |
| Empty targets | Skip a missing target; an empty state still offers the header button when at least one target is visible. |
| Naming | The CLI guided walkthrough is separate; label this route the desktop walkthrough in navigation and instrumentation. |
| Plans and Team | The one header button opens `plans` on `/plans` and `team` on `/plans#team` when each context is approved and has visible targets. |

SELF-CHECK: Palette: precision in every step; refusal on Home, Settings, Team and walkthrough step 4; no humour on deletion, payment, account or run controls.
SELF-CHECK: Rhythm: shortest step 7 words; longest step 16 words; short controls beside longer explanatory steps.
SELF-CHECK: Length: page tours 2–4 one-sentence steps each; walkthrough 7 one-sentence steps; controls 1–3 words except the timed hint and progress announcement.
SELF-CHECK: Unsure spots: the proposed `/walkthrough` route and anchors still need implementation mapping, the seven capture slots still need real app or approved dummy images at 1440 and 760, and Plans and Team wait for their own approved screen and copy. No capture is claimed.
