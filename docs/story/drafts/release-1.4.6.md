# release-1.4.6 - the release words for windowsweep 1.4.6

Last Updated: 2026-11-08

Content-map row **27** (the changelogs and the release words around them), with (f) on row **1** · awareness
**evaluating or stuck** · structure **each 1.4.5 piece's own shape, with 1.4.4's Changed-then-Fixed order** · tone
band **P and R, no W** · length **near each 1.4.5 piece** · CTA **none** · schema **none** · gate **GATE 4
pre-authorised under D59 for every piece, and row 1's 2026-09-07 pre-authorisation for (f)**. No piece here is a
legal surface.

Round 1, 2026-11-08, lean panel under D59 (the main session wrote, then checked every claim against the code and the
banned list; finalizer's FACT-CONSISTENCY PASS below, no NEEDS DECISION). Two desktop changes ship: ISSUE-006, the
update checks held to the splash's 4 seconds, and the root's TASK-001, the app icon redrawn as the website header's
mark. Neither touches money, health or data, so the safety rules ask nothing beyond the floor.

**Framework: the neighbour's shape.** Each piece copies its 1.4.5 counterpart in `release-1.4.5.md` S1, with the
Changed group first and the Fixed group second as in 1.4.4: bullets that open on a bold lead, the shared summary
first in the release notes, then detail, then the installer paragraph word for word.

## Sources

| Source | What it gives |
|---|---|
| windowsweep `e1a3308` | `LATER_CHECK_TIMEOUT_MS` = 20 000 for the focus, view and network checks (`watchForUpdates`) and for a press on the release gate's **Update** or **Update now**; the splash keeps `UPDATE_CHECK_TIMEOUT_MS` = 4000, and a caller that joins a check under way waits no longer than its own deadline. `icon.svg` is the brand kit's `favicon.svg` at 512 |
| `desktop-v1.4.5` `updater.ts` | every check went through `checkForUpdate()` with 4000 ms and a 5-second deadline |
| `desktop-v1.1.0` to `desktop-v1.4.5` `icons/icon.svg` | three strokes of falling weight (52, 24, 11) on a gradient tile |
| `docs/REPORTED-ISSUES.md` ISSUE-006 | the 4 to 12 seconds, measured 2026-11-08 in root `site-evidence/updater-1.4.5/logs/installed.txt` |
| `shell.json` `release.update`, `release.updateNow` | the gate's own button words |
| `release-1.4.5.md` S1 | every piece's shape, and (a)'s last paragraph, reused word for word |

## S1 · The release words for windowsweep 1.4.6

### (a) The desktop release notes, the GitHub release body for `desktop-v1.4.6`

```markdown
# windowsweep desktop 1.4.6

Update checks made after the app starts now wait up to 20 seconds for a slow server, where 1.4.5 gave up on every check after 4 seconds. The app's icon is now the website header's mark: two sweep curves on a dark tile.

**Update checks.** The app looks for a newer version on its start screen, again when the window comes back into focus or into view or the network comes back, and when Update or Update now is pressed on a required release. In 1.4.5 every one of those checks gave up after 4 seconds. On 2026-11-08 the address that serves updates took 4 to 12 seconds to answer for over an hour, so installed apps skipped check after check until one answer came back in time. Every check after the start screen now waits up to 20 seconds. The start screen's own check keeps its 4 seconds, so starting the app takes no longer than before.

**The icon.** The taskbar and the Start menu now show the mark from the website's header: two sweep curves at full strength on the dark tile, where every desktop release from 1.1.0 to 1.4.5 drew three strokes of falling weight on a gradient. The installer, which showed its build tool's stock icon and pictures, now shows the same icon, and the mark and the name on its Welcome and Finish pages.

The installers are signed for the app's updater but are not Windows code signed, so SmartScreen may show a warning. The `SHA256SUMS` asset lists hashes for both installers, `latest.json` and the stable `windowsweep-setup.exe` download.
```

### (b) The CLI release notes for `v1.4.6`

```markdown
# windowsweep CLI 1.4.6

The command-line tool is unchanged. The 30 sections, their targets and their safety checks are the same as in 1.4.5. It moves to 1.4.6 so the CLI and the desktop app stay on one version; the desktop changes are in the `desktop-v1.4.6` release.

Run `npx windowsweep@1.4.6 --list` to see the sections. Start with `--dry-run` to review candidates before selecting anything.
```

### (c) The root `CHANGELOG.md` entry, under `## [Unreleased]`

```markdown
## [1.4.6] - 2026-11-08

### Changed

- **The desktop app's icon is the website header's mark.** The taskbar and the Start menu show two sweep curves at
  full strength on the dark tile, where every desktop release from 1.1.0 to 1.4.5 drew three strokes of falling
  weight on a gradient. The installer, which showed its build tool's stock icon and pictures, now shows the same
  icon, and the mark and the name on its Welcome and Finish pages.

### Fixed

- **Update checks after the start screen wait for a slow server.** In 1.4.5 every check gave up after 4 seconds, so
  while the address that serves updates took 4 to 12 seconds to answer, installed apps skipped check after check.
  The checks made when the window comes back into focus or into view, when the network comes back, and when Update
  or Update now is pressed on a required release now wait up to 20 seconds. The start screen's own check keeps its
  4 seconds, so starting the app takes no longer than before.
- The command-line tool is unchanged in this release. It moves to 1.4.6 so the CLI and the desktop app stay on one
  version.
```

### (d) The docs site's `docs/changelog.md` entry

The same entry as (c), word for word, in the same place under `## [Unreleased]`, as the 1.4.5 entry is.

### (e) The website's `changelog.json`, inside `changelog.entry`

```json
"v146": {
  "changed": {
    "i1": "The desktop app’s icon is now the website header’s mark: two sweep curves on a dark tile, in the taskbar and the Start menu. The installer shows the same icon, and the mark and the name on its Welcome and Finish pages."
  },
  "fixed": {
    "i1": "Desktop update checks made after the start screen now wait up to 20 seconds for a slow server; 1.4.5 gave up on every check after 4 seconds. The start screen’s own check still takes 4 at most.",
    "i2": "The command-line tool is unchanged. It moves to 1.4.6 so the CLI and the desktop app stay on one version."
  }
}
```

### (f) The README's "Latest release:" sentence

```markdown
Latest release: **`1.4.6`** - the desktop app's update checks after the start screen wait up to 20 seconds for a
slow server, and its icon is the website header's mark. The 1.4 scanner searches Downloads and folders you add for
large or old files; you choose individual files for the Recycle Bin. The uninstall and leftover-folder sections
require explicit selection.
```

### (g) One summary in three places: the `latest.json` `notes`, the feed's newest item, and (a)'s first paragraph

```text
Update checks made after the app starts now wait up to 20 seconds for a slow server, where 1.4.5 gave up on every check after 4 seconds. The app's icon is now the website header's mark: two sweep curves on a dark tile.
```

The feed carries it in the site's `pages.json`, inside `feed.items`, beside its CLI pair:

```json
"desktop146": {
  "title": "Desktop app 1.4.6",
  "body": "Update checks made after the app starts now wait up to 20 seconds for a slow server, where 1.4.5 gave up on every check after 4 seconds. The app's icon is now the website header's mark: two sweep curves on a dark tile."
},
"cli146": {
  "title": "windowsweep 1.4.6",
  "body": "The command-line tool is unchanged. It moves to 1.4.6 so the CLI and the desktop app stay on one version."
}
```

| Element | Note |
|---|---|
| Changed, then Fixed | The icon is a change, not a repair, so 1.4.4's two-group order returns. `src/content/changelog.ts` gains `v146`: version `1.4.6`, date `2026-11-08`, `changed` 1 then `fixed` 2 |
| *Update*, *Update now* | The release gate's own button words (`release.update` on a block, `release.updateNow` on a notice); *a required release* is the gate's own word (`release.block.title`, `release.notice.title`) |
| *focus or into view*, *the network comes back* | `watchForUpdates` listens for `focus`, `visibilitychange` to visible and `online`; the first two at most once a minute |
| *4 to 12 seconds*, *for over an hour* | ISSUE-006's measurement on 2026-11-08. The address is not named: the person needs the effect, and (a) already says what serves updates |
| *takes no longer than before* | The splash keeps 4000 ms, and joining a longer check under way it still waits 5 seconds at most (`waitAtMost`), the same ceiling as 1.4.5's deadline |
| *the installer*, *its build tool's stock icon and pictures* | Until 1.4.5 `bundle.windows.nsis` set no `installerIcon` and no `sidebarImage`, so the setup showed NSIS's own icon and Welcome picture (seen on the first 1.4.6 build, before the fix). 1.4.6 sets `installerIcon` and `uninstallerIcon` to `icons/icon.ico` and `sidebarImage` to `installer/sidebar.bmp`, the kit's stacked lockup on the dark ground; both checked on the built `windowsweep_1.4.6_x64-setup.exe` (its extracted icon, and its Welcome page captured, then cancelled) |
| (a), last paragraph | 1.4.5's, word for word. It names no version |
| (b) | 1.4.5's with the versions moved |
| (f) | The version and one clause per change, then the two standing 1.4 scanner sentences, untouched |
| Apostrophes | (e) takes the catalogue's curly ’, as `v145` does; (g) keeps the straight ', because it must match `latest.json` and the release body byte for byte |
| The feed registry | `feed.json` gains `desktop146` (date `2026-11-08`, link `/download`, `downloadIt`) and `cli146` (link `/changelog`, `readEntry`), in 1.4.5's order |
| Left out | The website's own changes the same day (its favicon, touch icon and `.ico` from the brand kit, and the email logo, which is the app's new `64x64.png`): they are site changes, not the product release |

## NEEDS DECISION

None.

## Every fact, with its source

| Claim | Source |
|---|---|
| Checks after start wait up to 20 seconds | `updater.ts` (`e1a3308`): `watchForUpdates` calls `checkForUpdate(LATER_CHECK_TIMEOUT_MS)`, 20 000 ms, deadline 21 s |
| A press on Update or Update now waits as long | `ReleaseGate.tsx` (`e1a3308`): `checkForUpdate(LATER_CHECK_TIMEOUT_MS)` in `onUpdate` |
| 1.4.5 gave up on every check after 4 seconds | `desktop-v1.4.5` `updater.ts`: one `UPDATE_CHECK_TIMEOUT_MS` = 4000 for every caller |
| The start screen keeps 4 seconds | `Splash.tsx` calls `checkForUpdate()` with the 4000 default; the joiner's cap is the test *lets the splash in on time when it joins a longer check already under way* |
| 4 to 12 seconds for over an hour, 2026-11-08 | ISSUE-006 and `site-evidence/updater-1.4.5/logs/installed.txt` |
| The icon is the header's mark on the dark tile | `icon.svg` (`e1a3308`): the kit's `favicon.svg` geometry at 512, `#a1da44` on `#0e100b` |
| The installer shows the same icon, and the mark and name on its Welcome and Finish pages | `tauri.conf.json` `bundle.windows.nsis` (1.4.6); the generated `installer.nsi` defines `INSTALLERICON` and `SIDEBARIMAGE`; root `site-evidence/updater-1.4.6/installer-welcome.png` |
| 1.1.0 to 1.4.5 drew three strokes on a gradient | `git show desktop-v1.1.0:desktop/src-tauri/icons/icon.svg` and `desktop-v1.4.5`: strokes 52, 24, 11 over `linearGradient id="depth"` |
| The CLI is unchanged | `git diff --stat v1.4.5 <release> -- lib modules windowsweep.ps1 bin package.json` shows only the version lines |

## Banned words and tells

Checked by eye and by search against the Bible's banned list and the humanize floor: none of the listed words
appears in the shipping strings, and they carry no exclamation mark, no em dash and no "not X but Y".

## Self-check

- Voice: plain facts in the order a person meets them, the same register as 1.4.5's pieces. Confidence: high.
- Every number is a code constant, a measurement already on record or a version. No price, no count of users.
- FACT-CONSISTENCY PASS: (g) is identical in (a)'s first paragraph, the feed body and `latest.json`; (c) = (d); every
  claim above maps to a commit, a file or a recorded measurement. GATE 4 is pre-authorised under D59 for all of S1.
