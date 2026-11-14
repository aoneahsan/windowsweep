# windowsweep

windowsweep reclaims disk space on a Windows machine from caches, temp files, superseded tool releases and
items you choose. It names paths before it touches them. Documents, credentials and browser state are
protected. Section 19 can offer large or old files in Downloads and folders you add; it selects nothing for you.

Start with `npx windowsweep --scan`. It measures every target and deletes nothing.

The [README](https://github.com/aoneahsan/windowsweep#readme) is the short version; this folder is the manual.

## What people ask before they run it

**How do I free up disk space on Windows without deleting anything important?**
Start with `npx windowsweep --scan`, which deletes nothing and measures what is present. The safe batch
clears caches and temp files; personal files require you to choose them. Read the [safety model](./safety-model.md)
before a real run.

**Does this cleanup tool send my data anywhere?**
No. Cleanup never touches the network, and the engine's own code holds no network call: self-test check [9] greps its own source for HTTP and socket calls and fails the build if it finds any. Only sections 30, 31 and 32, for the rows you pick, ask Windows Update or winget to download; windowsweep itself sends nothing. The desktop application is a separate program: it sends usage and crash reports. There is no switch. In 1.1.0 no destination was configured in the build; from 1.2.0 all four are.

| The question | Where it is answered |
|---|---|
| How do I delete `node_modules` from old projects? | [Sections 0-32](./sections.md), section 17 |
| How do I clear the yarn or npm cache safely? | [Sections 0-32](./sections.md), sections 1 and 3 |
| How do I uninstall programs and Store apps, and what they leave behind? | [Sections 0-32](./sections.md), sections 26 and 27 |
| How do I pick Windows, driver and app updates one at a time? | [Sections 0-32](./sections.md), sections 30-32 |
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
| [Sections 0-32](./sections.md) | Every section: what it touches, which flags tune it, how it behaves in dry-run and batch mode |
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
| [The windowsweep team](./author.md) | Its channels, the sibling tools, how to support the work |
| [Packages](./PACKAGES.md) | The dependency and manifest record (there are no dependencies) |
| [Project status](./features/windowsweep-completion/00-tracker.json) | Every phase and sub-task with its state, its evidence and its commit |

## Quick contact

| Channel | Where |
|---|---|
| **Issues** | https://github.com/aoneahsan/windowsweep/issues |
| **Author** | [The windowsweep team](./author.md) - [contact form](https://windowsweep.aoneahsan.com/contact), after signing in |
| **Support the work** | https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep |

Last Updated: 2026-11-14 - tool version 1.5.0
