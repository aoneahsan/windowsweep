# windowsweep — Portfolio Info

Reference Date: 2026-11-12
Project Type: Windows desktop app and cleanup CLI, with a product website
Project Slug: windowsweep
Primary Email Reference: aoneahsan@gmail.com
Current Version Reviewed: CLI and desktop 1.4.8, published and installed 2026-11-12
Last Portfolio Update: 2026-11-12
Next Eligible Update After: 2026-11-19

## Identity & Distribution (Authoritative)

| Field | Value |
| --- | --- |
| Public Brand Name | windowsweep |
| Public URL (Live) | https://windowsweep.aoneahsan.com — Cloudflare Pages; 1.4.8 rendered at 390 and 1440 px, 156 served files matched the final build |
| Main Project Link | https://www.npmjs.com/package/windowsweep |
| Repository | https://github.com/aoneahsan/windowsweep (public, MIT) |
| NPM Package | windowsweep 1.4.8; 53 packed files; registry tarball matches the verified candidate |
| Install / CTA | `npx windowsweep --scan`, or download the desktop app from the product site |
| Binary | `bin/windowsweep.js` launches `windowsweep.ps1`; `windowsweep.cmd` works without Node |
| OS Support | Windows 10 1809+ and Windows 11; the Node launcher declares win32 only |
| Node Engine | >=14 for the launcher |
| Desktop App | Tauri 2; identifier com.aoneahsan.windowsweep; desktop-v1.4.8 is GitHub Latest. NSIS 3,964,693 bytes; MSI 4,743,168 bytes; updater signatures, latest.json, checksums and stable setup supplied. Installed 1.4.7 updated to 1.4.8 and restarted successfully |
| Android Application ID | Not applicable to this desktop-app-cli category |
| iOS Bundle ID / Scheme | Not applicable |
| Chrome Extension ID | Not applicable |
| PyPI Package | Not applicable |
| Docs URL | https://windowsweep-docs.aoneahsan.com — Docusaurus on GitHub Pages; 271 served files matched the final 1.4.8 build |
| Author | Ahsan Mahmood; aoneahsan@gmail.com; https://aoneahsan.com. Product copy speaks as the windowsweep team; legal attribution remains on the licence, copyright and operator facts |
| Pricing | https://windowsweep.aoneahsan.com/pricing — Free, Pro and Team; current plan rows are the authority. Pro $4/month or $36/year; Team $3/seat/month or $30/seat/year, minimum three seats, checked 2026-11-12 |
| Agent-Readable Pricing | https://windowsweep.aoneahsan.com/pricing.md |

## Brand Assets

### Logo (SVG — inline)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 1.5 34 34" width="1024" height="1024"><g fill="none" stroke="#4E7500" stroke-width="1.8" stroke-linecap="round"><path d="M2 22C7 22 8 9 14 9s7 9 16 3"/><path d="M2 28C8 28 9 17 15 17s7 7 15 2"/></g></svg>
```

The mark is the two curved strokes used in the product header. The canonical SVG masters, screen exports and print set live in brand-kit/. The old window-pane drawing is retired.

### Color Palette

| Role | Light | Dark |
| --- | --- | --- |
| Accent | #4E7500 | #A1DA44 |
| Main text | #1B1F16 | #F1F3EE |
| Secondary text | #565A51 | #B3B7AF |
| Page | #F5F7F2 | #0E100B |

## Update History (max 10 records)

| Date | Change | Evidence |
| --- | --- | --- |
| 2026-11-12 | Refreshed distribution, plans, hosting, current mark and verification facts. 1.4.8 fixes the desktop unmeasured readout layout and keeps the plan editor Save action visible while fields scroll | Product 93de163; website 546c300; docs 67e99ca; private release kit and live captures |
| 2026-09-25 | Earlier sign-in and cross-machine sync release | Historical desktop-v1.3.0 release |

## One-Line Summary

Windows cleanup that names every path first, with a desktop window and a command-line engine.

## Elevator Pitch

windowsweep lists what a cleanup section will touch before it removes anything. Scan first, rehearse with a dry-run, then choose what runs. The desktop window uses the same PowerShell engine as the command line.

## What This Project Is About

A Windows PowerShell 5.1 engine handles the cleanup rules, reports and path checks. A zero-dependency Node launcher distributes it through npm. The Tauri desktop app consumes its JSON contract, while the website provides accounts, plans, downloads and support. The command-line engine makes no network calls; the desktop window and website disclose their analytics and crash reporting.

## Vision

Make the cleanup decision visible: name the paths, show the measured estimate and refuse protected targets. The recorded owner vision is docs/OWNER-VISION.md in the private workspace root.

## Mission

Keep the cleanup rules inspectable and shared between the desktop app and command line. Personal-file selection stays explicit.

## Tech Stack

| Layer | Implementation |
| --- | --- |
| Cleanup engine | Windows PowerShell 5.1; lib/ and modules/; ASCII source |
| Distribution | Zero-runtime-dependency Node launcher, npm and Windows command launcher |
| Desktop | Tauri 2.12, Rust, React and TypeScript; signed updater payloads |
| Website | React, TypeScript, Vite, TanStack Router and Cloudflare Pages |
| Backend | Hosted Supabase; Google sign-in, access controls and server-enforced entitlements |
| Payments | Polar checkout and Free, Pro, Team plan rows |
| Files and email | FilesHub |
| Documentation | Docusaurus on GitHub Pages |
| Verification | CLI self-test 223 checks; desktop gates 52 tests; website gates 109 tests; docs release gates 7 tests, with live rendering and served-file comparisons |

## Feature Catalog

- Thirty numbered cleanup and audit sections; numbers keep their meaning across releases.
- Read-only scans, list-targets and a dry-run that removes no user data. A dry-run still writes its own log and report.
- Protected-path checks at both removal paths, declared target roots, exclusions and reparse-point guards.
- Developer cache idle gates and running-app checks.
- Explicit personal-file selection; selected section 19 files go to the Recycle Bin even with permanent mode set.
- JSON session reports, Markdown and self-contained HTML exports, history and the machine-readable engine contract.
- A desktop Reclaim Map, per-section progress, interactive picker, scheduling controls and one appearance panel.
- Optional Google sign-in and settings/run-summary sync; account deletion.
- Signature-checked desktop updates and release-record notices for normal and urgent updates.
- Website account and plan screens, referrals, Team seats, contact requests and an audited administration surface.
- Page tours and product walkthroughs; readable sitemap/feed pages and their machine-readable counterparts.
- Comparison hubs with 13 sourced competitors, last researched 2026-11-07.
- Disclosed ads for other products from the team; windowsweep excludes itself from that roster.

## Hidden Facts & Unique Angles

- The desktop app delegates cleanup to the same engine used by the CLI.
- The engine self-test checks the no-network guarantee, dry-run behavior and path protections.
- PowerShell 5.1 compatibility requires ASCII source; the checks enforce that constraint.
- The installed updater was exercised through 1.4.6 to 1.4.7 and then 1.4.7 to 1.4.8.
- The 2026-11-12 desktop dry-run completed 12 sections, estimated 15,357,483,749 bytes and removed zero bytes. That estimate describes one machine, not a promised saving.

## Benefits for Users

Developers can inspect regenerable cache targets before clearing them. People who prefer a window get the same engine and reports. Scripts can consume the JSON contract without interpreting terminal prose. Optional account sync keeps settings and run summaries available across machines.

## Value & Potential

The project demonstrates a shared PowerShell/Rust/React boundary, conservative filesystem operations, npm distribution, signed desktop updates and a hosted account system. Further targets need evidence from a machine that has the relevant software installed.

## Resume / CV Bullets

- Built a PowerShell cleanup engine with a zero-dependency npm launcher and a Tauri desktop app using one JSON contract.
- Implemented path protections, explicit personal-file selection, dry-run reporting and local export formats.
- Shipped signature-checked desktop updates and verified an installed 1.4.7 to 1.4.8 update.
- Delivered Supabase account and plan flows, a Cloudflare Pages website and a GitHub Pages documentation site.

## LinkedIn / Portfolio Paragraph

windowsweep is a Windows cleanup tool with a PowerShell engine, a desktop window and an npm launcher. It names targets before removal, refuses protected paths and leaves personal-file selection explicit. The desktop app uses the engine's JSON contract and checks update signatures before installing a release. The website carries accounts, plans, downloads and documentation links.

## Social Content Angles (for the content project)

Path refusal at the removal boundary; personal-file selection; a dry-run's own report files; one engine serving a desktop app and CLI; proving an installed updater rather than only building an installer.

## Top 20 Hashtags

#Windows #PowerShell #WindowsCleanup #DiskCleanup #DeveloperTools #Tauri #Rust #React #TypeScript #NodeJS #npm #OpenSource #SoftwareEngineering #DesktopApp #Supabase #CloudflarePages #GitHubPages #CacheCleanup #CommandLine #windowsweep

## SEO / AEO Metadata

Suggested title: windowsweep — Windows cleanup that names every path first

Suggested description: Inspect Windows cleanup targets, rehearse with a dry-run and select personal files explicitly. Desktop app and CLI share one PowerShell engine.

Primary topics: Windows cleanup, developer caches, dry-run cleanup, PowerShell, desktop update verification.

## Known Constraints (honest framing)

Windows only. Reclaimable space depends on the disk. Admin sections require Windows permission. The installer has no Windows code-signing certificate; updater signatures and SHA-256 checksums serve different purposes. The desktop window and website send disclosed usage analytics and crash reports. The command-line engine sends nothing. Final controlled website performance measurement remains open in the current audit; no 100-percent completion claim follows from these release checks.

## Generic Hashtags (always include in posts)

#Aoneahsan #AhsanMahmood #Zaions #BestOpenSourceCommunityProject #TopFree #SaaSApp

## File Usage Rule

Refresh at least once per week. Do not refresh more than once per three days. Keep only the ten most recent history records. Filename carries the last-updated date. Final destination: ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/apps/WINDOWSWEEP_portfolio-info_<YYYY-MM-DD>.md.
