# release-1.4.5 - the release words for windowsweep 1.4.5

Last Updated: 2026-11-08

Content-map row **27** (the changelogs and the release words around them), with (f) on row **1** · awareness
**evaluating or stuck** · structure **each 1.4.4 piece's own shape** · tone band **P and R, no W** · length **near each
1.4.4 piece** · CTA **none** · schema **none** · gate **GATE 4 pre-authorised under D59 for every piece, and row 1's
2026-09-07 pre-authorisation for (f)**. No piece here is a legal surface.

Round 1, 2026-11-08, lean panel under D59 (the main session wrote, then checked every claim against the code and the
banned list; finalizer's FACT-CONSISTENCY PASS below, no NEEDS DECISION). Two desktop fixes ship: ISSUE-003, a plan
cancelled in Polar's customer portal, and ISSUE-004, a close during the update download. Money is involved in the
first, so `story-craft/references/safety.md` came first: humour is off, nothing hurries, and no refund word appears.

**Framework: the neighbour's shape.** Each piece copies its 1.4.4 counterpart in `release-1.4.4.md` S1: Fixed bullets
that open on a bold lead, the shared summary first in the release notes, then detail, then the installer paragraph
word for word.

## Sources

| Source | What it gives |
|---|---|
| windowsweep `cd875bf` | `polar-webhook` records `subscription.canceled`, `.uncanceled` and `.revoked`; `my_plan()` returns `renews` (migrations `20261107193543`, `20261107193640`) |
| windowsweep `fab450b` | Plans draws `plans.paid.ends` when `renews` is false; the install-on-close hook is armed when the update is found; a close during the download hides the window and waits up to `CLOSE_WAIT_MS` = 60 s |
| `desktop-v1.4.4` `Plans.tsx:181`, `updater.ts` `stageForClose` | 1.4.4 drew `plans.paid.renews` for every paid period, and armed the close hook only after the download finished |
| `docs/REPORTED-ISSUES.md` ISSUE-003, ISSUE-004 | what a person saw; `site-evidence/updater-1.4.4/logs/run1-closed-mid-download.txt` |
| `release-1.4.4.md` S1 | every piece's shape, and (a)'s last paragraph, reused word for word |

## S1 · The release words for windowsweep 1.4.5

### (a) The desktop release notes, the GitHub release body for `desktop-v1.4.5`

```markdown
# windowsweep desktop 1.4.5

A plan cancelled in Polar's customer portal now shows the day it ends on the Plans screen, where 1.4.4 kept showing a renewal date. Closing the window while an update is still downloading now installs the update once the download finishes.

**A cancelled plan.** Plans reads "Ends on" with the last day of the period that was paid for. If the cancellation is withdrawn, "Renews on" comes back. Nothing else about the plan changes: Polar stops charging a cancelled subscription, and the plan runs to the end of its period.

**An update on close.** In 1.4.4 the install on close took effect only once the download had finished, so a window closed straight after start closed without installing, and the update came one start late. Now a close during the download hides the window, lets the download finish, then runs the installer. If the download has not finished within a minute, the app closes without installing and the next start downloads the update again.

The installers are signed for the app's updater but are not Windows code signed, so SmartScreen may show a warning. The `SHA256SUMS` asset lists hashes for both installers, `latest.json` and the stable `windowsweep-setup.exe` download.
```

### (b) The CLI release notes for `v1.4.5`

```markdown
# windowsweep CLI 1.4.5

The command-line tool is unchanged. The 30 sections, their targets and their safety checks are the same as in 1.4.4. It moves to 1.4.5 so the CLI and the desktop app stay on one version; the desktop changes are in the `desktop-v1.4.5` release.

Run `npx windowsweep@1.4.5 --list` to see the sections. Start with `--dry-run` to review candidates before selecting anything.
```

### (c) The root `CHANGELOG.md` entry, under `## [Unreleased]`

```markdown
## [1.4.5] - 2026-11-08

### Fixed

- **A plan cancelled in Polar's customer portal reads its end on Plans.** The desktop app said "Renews on" until the
  paid period ran out, because the cancellation never reached the account. It does now, and Plans reads "Ends on"
  with the period's last day; if the cancellation is withdrawn, "Renews on" comes back. Polar stops charging a
  cancelled subscription, and the plan runs to the end of its period either way.
- **Closing the window during an update download installs the update.** The install on close took effect only once
  the download had finished, so a window closed straight after start closed without installing, and the update came
  one start late. A close during the download now hides the window, lets the download finish for up to a minute,
  then runs the installer. Past that minute the app closes, and the next start downloads the update again.
- The command-line tool is unchanged in this release. It moves to 1.4.5 so the CLI and the desktop app stay on one
  version.
```

### (d) The docs site's `docs/changelog.md` entry

The same entry as (c), word for word, in the same place under `## [Unreleased]`, as the 1.4.4 entry is.

### (e) The website's `changelog.json`, inside `changelog.entry`

```json
"v145": {
  "fixed": {
    "i1": "A plan cancelled in Polar’s customer portal now reads “Ends on” with its last day on the desktop Plans screen; 1.4.4 kept saying “Renews on” until the period ran out.",
    "i2": "Closing the desktop window while an update is still downloading now installs the update once the download finishes; 1.4.4 closed without it, and the update came one start late.",
    "i3": "The command-line tool is unchanged. It moves to 1.4.5 so the CLI and the desktop app stay on one version."
  }
}
```

### (f) The README's "Latest release:" sentence

```markdown
Latest release: **`1.4.5`** - the desktop app's Plans screen shows the day a cancelled plan ends, and an update found
at start installs even when the window closes before its download finishes. The 1.4 scanner searches Downloads and
folders you add for large or old files; you choose individual files for the Recycle Bin. The uninstall and
leftover-folder sections require explicit selection.
```

### (g) One summary in three places: the `latest.json` `notes`, the feed's newest item, and (a)'s first paragraph

```text
A plan cancelled in Polar's customer portal now shows the day it ends on the Plans screen, where 1.4.4 kept showing a renewal date. Closing the window while an update is still downloading now installs the update once the download finishes.
```

The feed carries it in the site's `pages.json`, inside `feed.items`, beside its CLI pair:

```json
"desktop145": {
  "title": "Desktop app 1.4.5",
  "body": "A plan cancelled in Polar's customer portal now shows the day it ends on the Plans screen, where 1.4.4 kept showing a renewal date. Closing the window while an update is still downloading now installs the update once the download finishes."
},
"cli145": {
  "title": "windowsweep 1.4.5",
  "body": "The command-line tool is unchanged. It moves to 1.4.5 so the CLI and the desktop app stay on one version."
}
```

| Element | Note |
|---|---|
| Fixed only | Both changes repair something 1.4.4 got wrong, so there is no Changed group. `src/content/changelog.ts` gains `v145`: version `1.4.5`, date `2026-11-08`, one `fixed` group of three |
| *Ends on*, *Renews on* | Quoted, because they are the screen's own words (`plans.paid.ends`, `plans.paid.renews`); the line's second sentence is not quoted, since a list of changes names the state, not the whole string |
| *Polar stops charging* | Band R. The webhook moves no paid period (`billing_record_subscription_state` writes only the state and `cancelled_at`), and Polar does not renew a subscription cancelled at the period's end |
| *one start late* | ISSUE-004's own finding: the next start downloads again and the next close installs it. Delayed, not lost |
| *within a minute* | `CLOSE_WAIT_MS` = 60 000. The ceiling is told because a person who closes the window should know the app may have closed without the update |
| (a), last paragraph | 1.4.4's, word for word. It names no version |
| (b) | 1.4.4's with the versions moved |
| (f) | The version and one clause per fix, then the two standing 1.4 scanner sentences, untouched |
| Apostrophes | (e) takes the catalogue's curly ’ and “ ”, as `v144` does; (g) keeps the straight ', because it must match `latest.json` and the release body byte for byte |
| The feed registry | `feed.json` gains `desktop145` (date `2026-11-08`, link `/download`, `downloadIt`) and `cli145` (link `/changelog`, `readEntry`), in 1.4.4's order |
| Left out | The website's own fixes the same day (replay kept off account, admin and contact pages; the account plan block's *until* line): they are site changes, not the product release. The removed `data-clarity-mask` markup: nothing a person sees |

## NEEDS DECISION

None.

## Every fact, with its source

| Claim | Source |
|---|---|
| A portal cancellation now reaches the account | `polar-webhook` v8 (`cd875bf`), deployed 2026-11-07; the signed live proof in root `site-evidence/subscription-cancel-v145/webhook-proof.txt` |
| Plans reads *Ends on* with the period's last day | `Plans.tsx` (`fab450b`): `plans.paid.ends` with `ends_at` when `renews` is false |
| A withdrawn cancellation brings *Renews on* back | the live proof's step 5: a newer `subscription.uncanceled` turned `renews` true |
| 1.4.4 kept saying *Renews on* | `desktop-v1.4.4` `Plans.tsx:181` drew `plans.paid.renews` for every payment |
| The plan runs to the end of its period | no period moves: the migration's function writes the state and `cancelled_at` only |
| 1.4.4 armed install on close after the download | `desktop-v1.4.4` `updater.ts` `stageForClose`: `await download()` before `armCloseInstall()` |
| A close during the download now installs once it finishes | `updater.ts` (`fab450b`): hook armed at discovery; `win.hide()`, then the download under `withDeadline`, then `install` |
| *within a minute*, then the next start downloads again | `CLOSE_WAIT_MS` = 60 000; past it the window is destroyed and the next start's check stages the update again |
| The CLI is unchanged | `git diff --stat v1.4.4 <release> -- lib modules windowsweep.ps1 bin package.json` shows only the version lines |

## Banned words and tells

Checked by eye and by search against the Bible's banned list and the humanize floor: none of the listed words
appears in the shipping strings, and they carry no exclamation mark, no em dash and no "not X but Y".

## Self-check

- Voice: plain facts in the order a person meets them, the same register as 1.4.4's pieces. Confidence: high.
- Every number is a code constant or a version. No price, no count of users, no promise about timing beyond the
  one-minute ceiling the code enforces.
- FACT-CONSISTENCY PASS: (g) is identical in (a)'s first paragraph, the feed body and `latest.json`; (c) = (d); every
  claim above maps to a commit, a file or a live proof. GATE 4 is pre-authorised under D59 for all of S1.
