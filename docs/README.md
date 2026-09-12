# windowsweep - Documentation

> **windowsweep** reclaims disk space on a Windows machine without putting your data at risk: package-manager
> and build caches, browser and app caches, Windows temp and update leftovers, stale project artefacts and
> more, behind one deletion chokepoint, a real dry-run and a developer mode that keeps recent work fast.

The [README](https://github.com/aoneahsan/windowsweep#readme) is the elevator pitch; this folder is the manual.

## Start here

| If you want to... | Read |
|---|---|
| Install it in under a minute | [Installation](./installation.md) |
| Run your first cleanup safely | [Quick start](./quick-start.md) |
| Understand every guarantee before deleting anything | [Safety model](./safety-model.md) |
| Know what the developer question changes | [Developer mode](./developer-mode.md) |

## Reference

| Page | What it covers |
|---|---|
| [Sections 0-25](./sections.md) | Every section: what it touches, which flags tune it, how it behaves in dry-run and batch mode |
| [CLI reference](./cli-reference.md) | Every mode, option, exit code, environment variable and config key |
| [Profiles](./profiles.md) | The named bundles: `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit` |
| [Admin sections and elevation](./admin-and-elevation.md) | What needs Administrator rights, how `--elevate` works, the hibernation decision |
| [Reports and logs](./reports-and-logs.md) | What a run writes under `~\.windowsweep`, the JSON schema, exports |
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

Last Updated: 2026-09-05 - tool version 1.1.0
