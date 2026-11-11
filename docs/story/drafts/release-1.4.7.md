# release-1.4.7 — release words

Last Updated: 2026-11-11

Content-map row 27 (release words) and row 1 (README version sentence). The existing 1.4.7 changelog names the changes. These are the sources. The release kit carries the desktop and CLI notes; after publication, the same desktop summary must appear in the GitHub release, the updater manifest and the website feed, so an installed copy and a reader on the site see the same change.

## Sources and checks

- Product commit `b874432`: the desktop version, About cards, ecosystem names and updater build.
- `CHANGELOG.md` 1.4.7 entry: the card behaviour, ad note, Trizlink correction and unchanged CLI.
- `desktop/src/components/settings/SettingsAbout.tsx` and `desktop/src/lib/ecosystem.ts`: card action, external URL handling, self exclusion and Trizlink spelling.
- CLI `git diff v1.4.6 b874432`: version change only in the engine and package metadata. Extracted 1.4.7 tarball self-test: 223 checks passed.
- Existing 1.4.6 release notes: installer signature and SmartScreen wording.

## Release text

### Shared desktop summary

Settings → About now opens the team's other tools in your browser. The cards are ads for those tools, with no ad network or click tracking. Trizlink's name is corrected.

### Desktop detail

Each card under *More from the same team* opens that tool's page in your browser. The note above the cards identifies them as ads for the team's own tools. The list excludes windowsweep, and a card press is not counted. The Trizlink card now spells its name correctly.

This release includes Tauri 2.12. The command-line cleanup engine is unchanged.

### CLI detail

The command-line tool is unchanged. The 30 sections, their targets and their safety checks are the same as in 1.4.6. It moves to 1.4.7 so the CLI and the desktop app stay on one version; the desktop changes are in the `desktop-v1.4.7` release.

Run `npx windowsweep@1.4.7 --list` to see the sections. Start with `--dry-run` to review candidates before selecting anything.

## Review, round 1

Structure: summary, one desktop detail paragraph, dependency fact, installer limit and CLI path follow the preceding release's shape. Line and copy checks: short declaratives, no claim about space reclaimed, no plan-row value and no invented measurement. Fact check: every named change is supported by the sources above; the installers' updater signatures are verified separately. No safety claim or unanswered decision. The shared summary uses the same bytes in all three release surfaces.

Finalizer: READY. FACT-CONSISTENCY PASS. Zero NEEDS DECISION. The release words follow the changelog's named changes, the installed card action and the tested package version, while the installer statement follows the previous release's measured signature check. GATE 4 applies under D59's recorded pre-authorisation for row 27 and the earlier row 1 grant.
