# Reported issues — windowsweep

Open defects found while using or documenting windowsweep, one `### ISSUE-NNN` each. A fixed entry moves to
`docs/RESOLVED-ISSUES.md` with its date and version; ids are never reused.

## ⏳ Open

### ISSUE-007 — `--help` says `--permanent` makes section 19 delete, and leaves out 27

**Status:** OPEN · **Reported:** 2026-11-21 from LinkedIn Posts Automation (social cards for windowsweep) · **Affects:**
`windowsweep.ps1:91` (usage text), against `modules/data_scanner.ps1:147`

**Symptom.** The usage text reads "--permanent  Sections 18, 19 and 23 delete instead of using the Recycle Bin".
Section 19 always recycles: `Send-ToRecycleBin … -AlwaysRecycle`, even with `--permanent`. Section 27 also honours
`--permanent` and is not named. The safety paragraph likewise leaves 27 out of the Recycle Bin sections.

**Suggested fix.** "--permanent  Sections 18, 23 and 27 delete instead of using the Recycle Bin (19 always recycles)",
and the same correction in the safety paragraph and anywhere the README repeats it.

### ISSUE-008 — The website's desktop screenshots show 1.1.0, one with a local path

**Status:** OPEN · **Reported:** 2026-11-21 from LinkedIn Posts Automation · **Affects:** `windowsweep-web`
`public/app-shots/*.png` (used by `src/content/home.ts:238-249`), last changed 2026-09-08

**Symptom.** The six app shots show desktop 1.1.0: "Sections 26", no Plans in the rail, "Cancel is not built". The live
desktop app is 1.5.0. `app-run-dark.png` also shows a local run path under `C:Users…AppDataLocal…uns…`.

**Suggested fix.** Recapture the six shots from desktop 1.5.0 in light and dark, with the run folder path cropped or
set to a neutral example.

### ISSUE-009 — npm is at 1.5.1 while the desktop app is 1.5.0; the status bar prints empty flags

**Status:** OPEN · **Reported:** 2026-11-21 from LinkedIn Posts Automation · **Priority:** low

**Symptom.** Releases 1.4.5 to 1.4.8 kept one version across npm and the desktop app; 1.5.1 shipped on npm only. The
desktop status bar shows the engine command with flags that have empty values (the engine reads them as empty
lists, so this is display only).

**Suggested fix.** Ship desktop 1.5.1, or record in the release notes that a CLI-only patch keeps the desktop on
1.5.0; hide flags with no value in the status bar.

None open (ISSUE-006, the last one, was resolved on 2026-11-08 in 1.4.6).
