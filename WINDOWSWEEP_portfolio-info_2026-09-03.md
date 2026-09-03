# windowsweep — Portfolio Info

Reference Date: 2026-09-03
Project Type: CLI utility — safe, developer-aware Windows disk and cache cleanup (Windows PowerShell 5.1 engine + zero-dependency Node.js launcher, published to npm)
Project Slug: windowsweep
Primary Email Reference: aoneahsan@gmail.com
Current Version Reviewed: `1.0.1` (npm + git, same tree)
Last Portfolio Update: 2026-09-03
Next Eligible Update After: 2026-09-10

---

## Identity & Distribution (Authoritative)

| Field | Value |
| --- | --- |
| Project Slug | `windowsweep` |
| Public Brand Name | windowsweep |
| Public URL (Live) | not applicable (CLI tool — no web app) |
| Main Project Link | https://www.npmjs.com/package/windowsweep |
| Repository | https://github.com/aoneahsan/windowsweep (public) |
| NPM Package | `windowsweep` — https://www.npmjs.com/package/windowsweep |
| Install / CTA | `npx windowsweep` (zero-install) or `npm install -g windowsweep` |
| Binary | `windowsweep` (`bin/windowsweep.js` → routes to `windowsweep.ps1`) |
| OS Support | `win32` only (declared `os` in `package.json`); Windows 10 1809+ and Windows 11 |
| Node Engine | `>=14` (launcher only; `windowsweep.cmd` needs no Node) |
| Android Application ID | N/A |
| iOS Bundle ID / Scheme | N/A |
| Chrome Extension ID | N/A |
| PyPI Package | N/A |
| Docs URL | `windowsweep-docs.aoneahsan.com` — repository and GitHub Pages deployment exist and are green; the domain does not resolve yet (DNS CNAME is an owner task), so it is **not yet a live link** |
| License | MIT (standard `LICENSE` file; `package.json` declares `MIT`) |
| Author | Ahsan Mahmood — aoneahsan@gmail.com — https://aoneahsan.com |
| Payment / Support URL | https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep |
| Agent-Readable Pricing | N/A (free CLI tool; no paid tiers) |

> **Asks for next refresh:** record the docs URL as live once the DNS CNAME `windowsweep-docs → aoneahsan.github.io` is in place and the domain answers 200. Everything else — repo, npm link, license, contact — is recorded and verified.

---

## Brand Assets

### Logo (SVG — inline)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="windowsweep logo">
  <title>windowsweep</title>
  <defs>
    <linearGradient id="wsBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#38bdf8" />
      <stop offset="1" stop-color="#1e3a8a" />
    </linearGradient>
    <linearGradient id="wsClean" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.98" />
    </linearGradient>
    <clipPath id="wsPane">
      <rect x="22" y="30" width="84" height="68" rx="10" />
    </clipPath>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#wsBg)" />
  <rect x="22" y="30" width="84" height="68" rx="10" fill="#ffffff" opacity="0.14" />
  <g clip-path="url(#wsPane)">
    <path d="M6 112 L54 20 L98 20 L50 112 Z" fill="url(#wsClean)" />
    <path d="M62 20 L102 20 L54 112 L14 112 Z" fill="#ffffff" opacity="0.08" />
  </g>
  <rect x="22" y="30" width="84" height="68" rx="10" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.92" />
  <g transform="rotate(-62 84 42)">
    <rect x="66" y="38" width="36" height="8" rx="4" fill="#ffffff" />
    <rect x="80" y="46" width="8" height="18" rx="3" fill="#dbeafe" />
  </g>
  <g fill="#ffffff">
    <circle cx="104" cy="26" r="4.5" opacity="0.9" />
    <circle cx="114" cy="16" r="3" opacity="0.7" />
    <circle cx="99" cy="12" r="2.2" opacity="0.5" />
    <circle cx="116" cy="34" r="2" opacity="0.45" />
  </g>
</svg>
```

The mark is a hazy window pane being wiped clean along a diagonal sweep, with the squeegee at the leading edge and dust swept off the corner. It reads at 16px because the sweep is a single high-contrast diagonal.

### Color Palette

| Role | Token | Hex | Usage |
| --- | --- | --- | --- |
| Mark — gradient start | Sky | `#38bdf8` | Logo mark only |
| Mark — gradient end | Navy | `#1e3a8a` | Logo mark depth |
| UI accent — light | Lime 700 | `#4d7c0f` | Registered primary hue 128; docs-site links, headings, buttons on light |
| UI accent — dark | Lime 400 | `#a3e635` | Same hue on dark surfaces; **carries dark text, never white** |
| Success | Reclaim Green | `#0a7d54` | "ran" badges and reclaimed totals in the HTML report (hue 158, moved off the brand so the two stay distinguishable) |
| Warning | Warn Gold | `#b8860b` | Skipped / refused badges |
| Danger | Brick Red | `#c0392b` | Failed steps |
| Surface — Light | Near-white | `#fafafa` | Light-mode report background |
| Surface — Dark | Ink | `#16161a` | Dark-mode report background |
| Text — Light | Near-black | `#1c1c1f` | Light-mode body text |
| Muted | Slate-grey | `#7a7a85` | Secondary labels and meta |

> The report colours are taken from the self-contained HTML session-report theme in `modules/reports.ps1` (CSS custom properties under `:root` and the `prefers-color-scheme: dark` block). The CLI itself uses PowerShell console colours and honours `NO_COLOR` / `--no-color`. The UI accent is windowsweep's entry in the global palette registry; the mark deliberately keeps its own sky-blue identity.

---

## Update History (max 10 records)

| Date | Type | Notes |
| --- | --- | --- |
| 2026-09-03 | Portfolio file created | First dated portfolio profile, written at version 1.0.1. Facts sourced from `README.md`, `package.json`, `CHANGELOG.md`, `LICENSE`, `docs/`, and the running tool. |
| 2026-09-03 | Release `1.0.1` | Every P0 defect from the launch-day audit: `--yes` no longer selects anything in the personal and project sections, the `recycle` tier, the typed `--purge-all` confirmation, the VSIX cache split out from the running-editor guard, the npx installer refusal, engine exit 130, `--uninstall-data` always asking. Self-test grew from 108 to 124 checks. Tagged `v1.0.1` with a GitHub Release. |
| 2026-09-03 | Release `1.0.0` | First release: 22 numbered sections, developer mode, the deletion chokepoint, a real dry-run, JSON session reports with Markdown and HTML export, the self-test, crash bundles, the Node and `.cmd` launchers, CI on both PowerShell hosts. |

---

## One-Line Summary

windowsweep is a safe, developer-aware Windows cleanup CLI (PowerShell engine, Node launcher, shipped on npm) that reclaims disk space from regenerable caches — package managers, build tools, browsers, editors, Docker, Windows temp and update leftovers, stale `node_modules` — behind a single deletion chokepoint, an idle gate that keeps anything used recently, and a dry-run that writes nothing.

## Elevator Pitch

A Windows machine that is also a development machine fills up in places Disk Cleanup has never heard of: the Yarn and npm caches, Gradle, Cypress and Playwright browsers, Android emulator images, Docker's virtual disk, `node_modules` for a project finished in spring, editor caches, a browser profile per client. The usual answers are a wipe-everything cleaner, which costs you an afternoon of re-downloads, or a private list of paths you maintain by hand. windowsweep takes the narrower path: it asks once whether you are a developer, then keeps every cache used in the last 100 days and prunes the rest. Every deletion passes one function that refuses drive roots, Windows, Program Files, your profile root, personal folders, credentials, toolchains and browser or editor state, and asserts the path sits inside the target root the section declared. It never follows a junction. Personal files are listed, never auto-selected, and go to the Recycle Bin. It makes no network calls at all — no telemetry, no update check — and the self-test proves that on your own machine along with the junction handling, the long-path handling and the dry-run guarantee. `npx windowsweep --scan` runs the whole thing with nothing installed.

## What This Project Is About

windowsweep is the Windows member of a three-tool family with `linux-cleanup` (Bash) and `macleanup` (Bash). The architecture is a Windows PowerShell 5.1-compatible engine (`windowsweep.ps1` dot-sourcing `lib/` primitives and one module per section group) wrapped by a ~100-line zero-dependency Node.js launcher so it can be distributed through npm and run with `npx`; a `.cmd` launcher covers machines without Node. Both launchers start PowerShell with `-ExecutionPolicy Bypass`, so the machine's script policy never blocks a run, and all three paths write logs and reports to `%USERPROFILE%\.windowsweep\` so history survives npx cache eviction.

Safety is the design constraint rather than a feature. Every byte removed passes `Remove-PathSafe` or `Send-ToRecycleBin` with a declared `-Within` root; the chokepoint refuses relative segments, UNC paths, drive roots, an explicit list of protected subtrees and patterns, and anything outside the declared root. Since 1.0.1 no flag combination selects a personal or project file: sections 17, 18 and 19 show their prompt even under `--yes` and default to none. The idle gate reads the newest of write, access and creation time, because Windows disables last-access tracking on most volumes — a rule that can only make a file look fresher than it is, so a mistake keeps a cache rather than removing one.

Honest framing: this is Windows-only (`os: ["win32"]`), it deletes rather than archives, there is no undo for caches, and correctness rests on a 124-check self-test plus dry-runs and real runs rather than a conventional unit-test suite. Sections that need Administrator rights are skipped with the exact command when the console is not elevated, and the admin, Windows 11 and Scheduled Task paths are still on the verification list.

## Vision

Give Windows developers a trustworthy, scriptable way to reclaim disk space — one that treats deletion as a careful, reviewable, chokepointed operation instead of a one-button gamble, and that keeps a verifiable record of exactly what it did.

## Mission

Know modern developer caches better than a generic cleaner does; refuse to touch anything irreplaceable; keep recent work fast by pruning on an idle gate instead of wiping; put every personal-file decision in the user's hands; produce schema-versioned JSON reports with Markdown and HTML export; and make zero network calls, so the tool can be trusted on any machine — distributed through a single `npx` command.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Core engine | Windows PowerShell 5.1-compatible script (`windowsweep.ps1`), also runs on PowerShell 7 |
| Library | `lib/` — constants and the section catalogue, UI and prompts, logging and the JSON report, a long-path-safe filesystem walker, the safety chokepoint, config, the read-only scanners, the target-list engine |
| Modules | 21 single-responsibility `modules/*.ps1` (one per section group, plus walkthrough, menu, runner, reports, crash trap, release helpers and the extra self-test groups) |
| Distribution | npm package `windowsweep` — zero-dependency Node.js launcher `bin/windowsweep.js` (`preferGlobal`, `engines.node >=14`, `os: ["win32"]`), plus `windowsweep.cmd` for machines without Node |
| Reports | Schema-versioned JSON (schema 1); Markdown and self-contained dark-mode HTML export, generated in PowerShell with no external tools |
| Documentation | In-repo `docs/` (12 pages) plus a Docusaurus site on GitHub Pages |
| Scheduling | Weekly Scheduled Task installer (Sunday 03:00, safe batch) and a PowerShell profile alias |
| Privacy | Zero network calls — no telemetry, no analytics, no update check; feedback is a user-initiated browser page and local zip bundles |
| Verification | `--self-test` (124 checks: syntax, ASCII-only source, the protection lists, a real junction fixture, a 400-character path, the dry-run guarantee, keep-newest, prompt asymmetry, pure helpers and export fixtures); CI on both PowerShell hosts; PSScriptAnalyzer |
| Versioning | Semantic Versioning; Keep a Changelog; a plain-text `VERSION` file; annotated tags and GitHub Releases |
| License | MIT (permissive, OSI-approved) |

## Feature Catalog

- **22 numbered sections (0–21)** — package-manager caches, build-tool caches, test-runner browsers, Android emulators, Docker, editor caches and extension leftovers, browser caches, desktop-app caches, Windows user caches, user temp, the Recycle Bin, Windows Update and system temp, the Disk Cleanup engine, DISM component store, the hibernation file, event logs, stale project build artefacts, partial downloads, large stale personal files, disk-image compaction, and a disk-usage report. Numbers are a public contract.
- **Developer mode** — one question on the first run decides whether package, build and test-runner caches are pruned on the 100-day idle gate (keeping the newest version of every versioned tool) or cleared completely.
- **One deletion chokepoint** — refuses drive roots, Windows, Program Files, the profile root, personal folders, credentials, toolchains, browser and editor state; asserts every deletion sits inside its declared target root; never follows a junction or symlink; handles paths beyond 260 characters; skips files another program holds open.
- **A dry-run that writes nothing** — short-circuits every deletion helper and every destructive external command, reporting an exact estimate. `--scan` and `--list-targets` are read-only.
- **Personal files are never auto-selected** — sections 17, 18 and 19 are interactive by design; `--yes` shows the prompt and selects nothing, and selected files go to the Recycle Bin.
- **Batch policy** — `--all` runs the safe batch; deep sections (Recycle Bin, hibernation, event logs, disk-image compaction) need `--i-understand-deep`; interactive sections never run unattended.
- **Admin awareness** — admin sections skip with the exact command when the console is not elevated; `--elevate` relaunches through a UAC prompt into a new window with its own log and report.
- **Running-app guard** — an open browser, editor or app keeps its caches, and the tool names which to close.
- **Session reports** — schema-versioned JSON, a reports manager, Markdown and self-contained HTML export, run history and `--json` for scripting.
- **Self-test** — 124 checks that prove the guards on the user's own machine before they trust it.
- **Crash bundles** — captured locally on an unexpected exit; nothing is ever transmitted.
- **Setup helpers** — a weekly Scheduled Task and a `cleanup` profile alias, both of which refuse to install from an npx cache that npm will evict.
- **An AI integration guide** — the machine-readable contract (`--json` shape, exit codes, guarantees) for agents and scripts.

## Hidden Facts & Unique Angles

- **One chokepoint, not a scattering of `Remove-Item` calls** — every deletion in 22 sections passes through a single function with a declared root, and the self-test asserts no declared target sits inside a protected path.
- **The idle gate reads the newest of three timestamps** (write, access, creation) because Windows disables last-access updates on most volumes. The rule can only make a file look fresher than it is, so its failure mode is keeping a cache rather than deleting one.
- **`--yes` cannot reach personal or project data.** That was not true at 1.0.0 — the launch-day audit found that auto-yes pre-selected every item in the interactive sections — and 1.0.1 fixed it with a `-NoAutoYes` switch plus a self-test that reads the module ASTs and fails if any picker call omits it.
- **Zero network code, verified mechanically** — the self-test greps the source for HTTP and socket calls and fails the run if it finds one.
- **ASCII-only source by necessity** — PowerShell 5.1 reads a BOM-less UTF-8 file as ANSI, so every glyph is a `[char]` code and the self-test enforces the rule byte by byte.
- **The hot path was rewritten after measurement, not guesswork** — the first real run showed the per-file protection check costing 10.6 ms because it resolved paths and compiled wildcards per call; pre-normalised prefixes and precompiled patterns took it to 0.58 ms with identical verdicts on 35 probe paths.
- **Layout-aware cache clearing with a second guard** — browser, Electron and editor targets expand to concrete folders, and a leaf whose name is not a declared cache name is refused even though the target matched.
- **Every gate in the project has been watched failing.** Each new self-test check was proved red against a planted defect before it was kept.

## Benefits for Users

- **Windows developers** — reclaim tens of gigabytes the tool actually understands (npm, Yarn, pnpm, bun, deno, NuGet, Cargo, Go, Gradle, Android, Docker, Cypress, Playwright, editors) without losing the caches that make tomorrow's install fast.
- **Cautious users** — a read-only scan, a real dry-run, `--list-targets`, and a self-test that proves the guards on their own machine before anything is deleted.
- **Privacy-conscious users** — zero network calls, verifiable in source and enforced by the self-test; nothing leaves the machine.
- **Automation users** — a safe batch, profiles, a weekly Scheduled Task, one-line `--json` output and documented exit codes.
- **Agents and scripts** — a written integration contract rather than a README to guess from.
- **Zero-install users** — `npx windowsweep` runs the whole tool with nothing to install, and history persists across npx cache evictions.

## Value & Potential

windowsweep pairs a concrete recurring pain — a development machine filling up with regenerable caches — with an unusually disciplined safety and reporting model: a single chokepoint, an idle gate, layout-aware cache expansion with a second guard, schema-versioned reports, and a verifiable no-network stance. As a portfolio piece it demonstrates systems engineering in PowerShell against a hostile target (long paths, reparse points, locked files, an ANSI-reading host), pragmatic distribution (a zero-dependency Node launcher to reach npm users), and evidence-driven quality: a 124-check self-test where every check was proved to fail before it was trusted, and a launch-day audit that found and fixed a real safety defect within the day. Growth paths: the 1.1 family-parity features (a globals audit, orphaned app-data, installed-programs and startup reports, driver leftovers, toast notifications), and a Tauri desktop wrapper over the same script. Monetization is intentionally absent — MIT, free — with support routed through aoneahsan.com/payment.

## Resume / CV Bullets

- Built windowsweep, a safe-by-default Windows disk and cache cleanup CLI (Windows PowerShell 5.1 engine, 21 single-responsibility modules, zero-dependency Node.js launcher) published on npm and runnable with one `npx` command.
- Designed a single deletion chokepoint through which all 22 sections delete: it refuses drive roots, system directories, the profile root, personal folders, credentials, toolchains and browser or editor state, asserts every path lies inside the root its section declared, and never follows a junction or symlink.
- Shipped an idle-gate model that prunes only caches untouched for 100+ days and keeps the newest version of every versioned tool, reading the newest of write, access and creation time because Windows disables last-access tracking.
- Wrote a 124-check self-test (script syntax, ASCII-only source, protection lists, a real junction fixture, a 400-character path, the dry-run guarantee, AST checks on prompt call sites, pure-helper and export fixtures) and proved every check red against a planted defect before trusting it.
- Diagnosed and fixed a hot-path performance defect found in a real run — a per-file protection check costing 10.6 ms — by pre-normalising path prefixes and precompiling wildcard patterns, reaching 0.58 ms per call with identical verdicts across 35 probe paths.
- Found and fixed a launch-day safety defect where auto-confirm pre-selected every item in the interactive personal and project sections, adding a switch plus an AST-based self-test check that fails if any picker call omits it.
- Delivered schema-versioned JSON session reports with Markdown and self-contained HTML export generated without external tools, plus CI on both PowerShell hosts and a documentation site on GitHub Pages.

## LinkedIn / Portfolio Paragraph

windowsweep is a safe, developer-aware Windows cleanup CLI I built and published on npm. Its PowerShell engine reclaims the disk space that quietly disappears on a development machine — npm, Yarn, pnpm, bun, NuGet, Cargo, Go, Gradle and Android caches, Docker layers, browser and editor caches, Windows Update leftovers, stale `node_modules`, half-finished downloads — while treating deletion as a reviewable operation. Every byte removed passes one chokepoint that refuses protected paths and asserts the target sits inside the root its section declared; junctions are never followed; personal files are listed for you to pick and go to the Recycle Bin. It asks once whether you are a developer and then keeps every cache used in the last 100 days, so the next install is still fast. It makes zero network calls — no telemetry, no update check — and a 124-check self-test proves the guards on your own machine, including a real junction and a 400-character path. A zero-dependency Node launcher means there is nothing to install: `npx windowsweep --scan`. MIT licensed, Windows 10 and 11, with a documentation site and an integration guide for agents and scripts.

## Social Content Angles (for the content project)

- The caches a Windows dev machine hoards, and which of them are actually safe to delete.
- One chokepoint, 22 sections: how a cleanup tool should be structured so a new section cannot invent its own delete.
- Why the idle gate reads three timestamps on Windows, and why that bias is deliberate.
- The launch-day audit that found `--yes` pre-selecting personal files — and the AST-based test that makes the fix permanent.
- Watching a gate fail before trusting it: six planted defects and what each one proved.
- A 10.6 ms per-file check that would have taken four hours on 400k files, and the two changes that fixed it.
- Zero network calls, enforced by a test rather than promised in a README.
- Shipping a PowerShell tool on npm: why a zero-dependency Node launcher is the shortest path to `npx`.
- Long paths, reparse points and locked files: what a Windows filesystem walker has to survive.
- Why personal files never get an auto-confirm flag, in any tool that deletes.

## Top 20 Hashtags

#windowsweep #Windows #DiskCleanup #DevTools #CLI #PowerShell #OpenSourceSoftware #DiskSpace #CacheCleanup #npm #npx #SysAdmin #DeveloperTools #Windows11 #Productivity #CommandLine #WindowsTips #BuildInPublic #SystemUtility #DotNet

## SEO / AEO Metadata

- Meta description (150–160 chars): windowsweep is a safe Windows cleanup CLI on npm that reclaims disk space from developer caches behind one deletion chokepoint, an idle gate and a real dry-run.
- Primary keywords: windows disk cleanup, free disk space windows, clear npm cache windows, clear yarn cache, delete node_modules, windows temp cleanup, powershell cleanup script, developer disk cleanup tool.
- Long-tail / GEO keywords (AI-search): "safe command-line tool to free disk space on Windows", "delete stale node_modules across projects on Windows", "clean npm yarn pnpm gradle docker caches on Windows", "Windows cleanup tool that makes no network calls", "npx windows disk cleanup with JSON report".
- Suggested og:title: windowsweep — Safe, Developer-Aware Windows Cleanup CLI
- Suggested og:description: Reclaim disk space from developer caches behind one deletion chokepoint, a 100-day idle gate and a dry-run that writes nothing. Zero network calls. Run it with `npx windowsweep`.

## Known Constraints (honest framing)

- **Windows only.** `package.json` declares `os: ["win32"]` and the launcher exits 2 on any other platform. Use `linux-cleanup` or `macleanup` elsewhere.
- **It deletes; it never archives.** Not a backup tool and not a security scanner. Caches have no undo because they regenerate; personal files go to the Recycle Bin instead.
- **It cannot promise a number.** How much comes back depends on the disk; `--scan` measures it and the README refuses to guess.
- **The idle gate is conservative by design** and will leave old caches behind; `--days` and `--purge-all` exist for that.
- **Admin sections need an elevated console** and a UAC click, so a Scheduled Task runs the safe batch only. The admin path, a Windows 11 run and the Scheduled Task have not yet been exercised for real — they are on the verification list.
- **Disk Cleanup (section 13) cannot preview** how much it will free; its dry-run lists the handlers only.
- **No automated test suite beyond `--self-test`.** Correctness rests on 124 fixture-based checks, dry-runs, and real runs on Windows 10.
- **The documentation site is deployed but its domain does not resolve yet** — the DNS record is an owner task.

## Generic Hashtags (always include in posts)

#Aoneahsan #AhsanMahmood #Zaions #BestOpenSourceCommunityProject #TopFree #SaaSApp

---

## File Usage Rule

Refresh at least once per week (MANDATORY). Do not refresh more than once per 3 days. Keep only the 10 most recent history records. Filename always carries the last-updated date. Final destination: `ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/apps/WINDOWSWEEP_portfolio-info_<YYYY-MM-DD>.md`.
