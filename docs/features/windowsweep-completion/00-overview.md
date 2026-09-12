# windowsweep completion - overview

Last Updated: 2026-09-12 (the audit: 1.2.0 shipped, the marketing site live, the desktop app released at 1.1.0;
the v3 completion plan is the method)

## What

Everything between the published CLI and a project the owner can close. Shipped so far: 1.0.1 (the audit-day
defects), 1.1.0 (sections 22-25, `--select` / `--select-file`, `--notify`, the `--json` contract) and 1.2.0
(`--exclude-path` at the chokepoint for every section, `newest_write_utc`, `protected`, `excluded[]`, the
story-approved console and report strings, 156 self-test checks), each tagged and released; the documentation
site live on GitHub Pages (HTTP; HTTPS waits on GitHub's certificate); the desktop app released as
`desktop-v1.1.0` and installed on this machine; the marketing site live at `windowsweep.aoneahsan.com`; the
portfolio, master-links and ORCID records written. What remains is in `../remaining-work.md`:

- **P1** - the verification runs only the owner can do (elevated sections, Windows 11, the Scheduled Task,
  sections 4/5/7/8/17-19, `--notify` on both hosts) - second machine.
- **P3 residue** - the docs certificate (the agent re-adds the domain, D18) and the one-pass link write-back;
  the navbar `Website` item; the `site-front` surface applied and mirrored.
- **P4 residue** - the write-back half of the records; the owner's review of the master-links entry and the
  ORCID import.
- **P5 residue** - the 1.3.0 cascade debt (`WS_DOCS`, two engine files over 500 lines, the README rows in the
  published tarball) and the candidate target rows that wait on the owner's read-only probe (RW-064, RW-065,
  RW-066); section 26 is still free.
- **P6** - the desktop app's residue: account deletion (D14), the filed tasks, the round-7 confirmation of
  D-8/D-21, the capture of the four RW-105 surfaces, `desktop-v1.2.0` with telemetry live and the updater
  proved 1.1.0 -> 1.2.0.
- **P7** - the storytelling residue: five surfaces (four for the site, one for the docs front door) and the
  keeper batch.
- **P8** - the marketing site's residue: prerendered routes and a real 404, `llms.txt`, JSON-LD, the OG card,
  search-engine submission, telemetry live, the flows verified as a person once Google sign-in exists, GATE 4
  parity against its dummy, a CI workflow, the records write-back.

## Why

The 1.0.0 build session shipped a complete engine in one day; the audit that followed found one broken safety
promise and several doc-versus-code mismatches, all fixed in 1.0.1. The owner then decided that
"feature-complete" includes the sibling features that make sense on Windows (1.1.0), a docs site like the two
siblings have, the desktop app and the storytelling retrofit (2026-09-05), the marketing site (2026-09-07),
and - on 2026-09-12 - account deletion built on both apps, with Android explicitly out of scope.

## Acceptance criteria

`../remaining-work.md` section 13 is the checkable list. In one paragraph: npm equals the last tag and every
engine file is under 500 lines; every CLI release not Latest and the newest desktop release Latest with six
artefacts, reached on this machine through the in-app updater; GATE 4 closed on every desktop screen and every
site page; telemetry on the wire from both apps and the CLI still offline; `delete_my_account()` proved; every
story surface recorded; the docs site over HTTPS and linked everywhere; the site prerendered with real 404s,
verified as a non-admin and as the admin; the owner rows open by name only.

## Phases

`00-tracker.json` holds the status of every phase and sub-task; `../remaining-work.md` holds the
specification of every `RW-` item (evidence, success criteria, acceptance points, what not to do). 🔴 **Since
2026-09-07 that file lives at the workspace root `D:\work\windowsweep-root\`, one level above this repository,
and is outside version control** - a clone does not carry it. The method for finishing the work is
`../completion-plan-v3-2026-09-12.md` beside it (the 2026-09-07 plans are history).
