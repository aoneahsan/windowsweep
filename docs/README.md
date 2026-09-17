# windowsweep

windowsweep reclaims disk space on a Windows machine by deleting only caches that rebuild themselves: package managers, build tools, browsers, editors, desktop apps, Windows temp and update leftovers, stale project artefacts. It names every path before it touches one. Your documents, credentials and browser state are refused outright, and no flag changes that.

Start with `npx windowsweep --scan`. It measures every target and deletes nothing.

The [README](https://github.com/aoneahsan/windowsweep#readme) is the short version; this folder is the manual.

## What people ask before they run it

**How do I free up disk space on Windows without deleting anything important?**
windowsweep removes only regenerable caches, and refuses your documents, credentials and browser state outright. Start with `npx windowsweep --scan`, which deletes nothing and measures what is reclaimable. Then read the [safety model](./safety-model.md).

**Does this cleanup tool send my data anywhere?**
No. The command-line tool makes no network calls at all, and self-test check [9] greps its own source for HTTP and socket calls and fails the run if it finds any. The desktop application is a separate program: it sends usage and crash reports. There is no switch. In 1.1.0 no destination was configured in the build; from 1.2.0 all four are.

| The question | Where it is answered |
|---|---|
| How do I delete `node_modules` from old projects? | [Sections 0-25](./sections.md), section 17 |
| How do I clear the yarn or npm cache safely? | [Sections 0-25](./sections.md), sections 1 and 3 |
| Is it safe to use a Windows cleaner - will it delete my files? | [Safety model](./safety-model.md) |
| How do I see what it will delete before it deletes it? | [Quick start](./quick-start.md) |
| Windows Update / SoftwareDistribution is taking up space | [Admin sections and elevation](./admin-and-elevation.md) |
| How do I run a cleanup on a schedule? | [CLI reference](./cli-reference.md), `--install-task` |

## Start here

| If you want to... | Read |
|---|---|
| Install it in under a minute | [Installation](./installation.md) |
| Run your first cleanup | [Quick start](./quick-start.md) |
| Read every guarantee before deleting anything | [Safety model](./safety-model.md) |
| Know what the developer question changes | [Developer mode](./developer-mode.md) |

## Reference

| Page | What it covers |
|---|---|
| [Sections 0-25](./sections.md) | Every section: what it touches, which flags tune it, how it behaves in dry-run and batch mode |
| [CLI reference](./cli-reference.md) | Every mode, option, exit code, environment variable and config key |
| [Profiles](./profiles.md) | The named bundles: `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit` |
| [Admin sections and elevation](./admin-and-elevation.md) | What needs Administrator rights, how `--elevate` works, the hibernation decision |
| [Reports and logs](./reports-and-logs.md) | What a run writes under `%USERPROFILE%\.windowsweep`, the JSON schema, exports |
| [Desktop app](./desktop.md) | The window over the same engine: what it adds, what it collects, the SmartScreen note, where it writes |
| [AI integration guide](../AI-INTEGRATION-GUIDE.md) | The contract for an agent or a script: `--json`, exit codes, guarantees |

## When something is off

| Page | What it covers |
|---|---|
| [Troubleshooting](./troubleshooting.md) | Symptom, cause, fix |
| [FAQ](./faq.md) | The questions people ask first |

## Meta

| Page | What it covers |
|---|---|
| [Author](./author.md) | Who built this, the sibling tools, how to support the work |
| [Packages](./PACKAGES.md) | The dependency and manifest record (there are no dependencies) |
| [Project status](./features/windowsweep-completion/00-tracker.json) | Every phase and sub-task with its state, its evidence and its commit |

🔴 **The three planning files are no longer in this repository.** Since 2026-09-07 (owner decision)
`remaining-work.md` (the specification of every open item), `remaining-work-summary.md` (the one-page view
with the percentage) and `what-this-project-consists-of.md` (what exists today) live one level above the
repository, in the workspace folder that holds it - **outside version control**. A `git clone` does not carry
them; the whole `windowsweep-root` folder has to be copied. The status record above stays here.

## Quick contact

| | |
|---|---|
| **Issues** | https://github.com/aoneahsan/windowsweep/issues |
| **Author** | [Ahsan Mahmood](https://aoneahsan.com) - [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **Support the work** | https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep |

Last Updated: 2026-09-17 - tool version 1.3.0
