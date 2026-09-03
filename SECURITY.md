# Security policy

windowsweep deletes files, stops and starts Windows services, runs `cleanmgr`, `Dism`, `powercfg`, `wevtutil`
and `diskpart` when elevated, and can move personal files to the Recycle Bin. Small bugs can have outsized
impact, so security reports are taken seriously.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security problems.**

Email <aoneahsan@gmail.com> with:

1. The problem class (a deletion outside a declared target, a way past `--dry-run`, a junction or symlink
   that is followed, command injection through a path or file name, personal data written into a log or
   report, an unintended elevated command).
2. Steps to reproduce: the command line, the folder layout, observed and expected behaviour.
3. Your impact assessment.
4. Whether you would like to be credited in the changelog.

You will normally receive an acknowledgement within 5 working days. This is a single-author project without a
formal SLA; critical issues are triaged ahead of feature work.

## In scope

- Anything in `windowsweep.ps1`, `lib/` or `modules/` that could delete outside the target its section
  declared, bypass the `--dry-run` guarantee, follow a reparse point, run an unintended elevated command, or
  leak personal data into a log, report or bundle that the user did not opt into.
- The Node launcher (`bin/windowsweep.js`) and the `.cmd` launcher.

## Out of scope

- Files the user selected and confirmed in sections 17, 18 or 19.
- Access-denied errors when running admin sections without elevation.
- Behaviour of the third-party tools the script invokes (`docker`, `npm`, `cleanmgr`, `Dism`, ...).
- A forked or edited copy of the script.

## Coordinated disclosure

If a fix needs non-trivial work, the author may ask you to hold public disclosure for up to 30 days while a
patch is released. Credit, if wanted, lands in the matching `CHANGELOG.md` entry.

## Defensive guidance for users

- Run `--self-test`, then `--scan`, then `--dry-run` before the first real run on any machine.
- Keep a backup before running any cleanup tool. Sections 11, 15, 16 and 20 are deliberately gated.
- Read the session log under `~\.windowsweep\logs\` when anything surprises you; every deletion is recorded.
