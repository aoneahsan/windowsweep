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
| [Sections 0-21](./sections.md) | Every section: what it touches, which flags tune it, how it behaves in dry-run and batch mode |
| [CLI reference](./cli-reference.md) | Every mode, option, exit code, environment variable and config key |
| [Profiles](./profiles.md) | The named bundles: `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit` |
| [Admin sections and elevation](./admin-and-elevation.md) | What needs Administrator rights, how `--elevate` works, the hibernation decision |
| [Reports and logs](./reports-and-logs.md) | What a run writes under `~\.windowsweep`, the JSON schema, exports |
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
| [What the project consists of](../what-this-project-consists-of.md) | Every part of the project with its evidence, as audited on 2026-09-03 |
| [Remaining work](../remaining-work.md) | The specification of every open item: evidence, success criteria, acceptance points |
| [Remaining work, one page](../remaining-work-summary.md) | Percentages, the next ten actions, the owner-only rows |

## Quick contact

| | |
|---|---|
| **Issues** | https://github.com/aoneahsan/windowsweep/issues |
| **Author** | [Ahsan Mahmood](https://aoneahsan.com) - [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **Support the work** | https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep |

Last Updated: 2026-09-03 - tool version 1.0.1
