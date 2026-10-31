# WindowSweep product — active guide

**Last Updated:** 2026-10-20
**Context pass:** 2026-10-14; next routine optimization eligible 2026-11-13.

This public repository is the Windows PowerShell cleanup CLI, Node launcher, Tauri desktop app, shared schema, product docs and story records. It is nested inside `../windowsweep-root/`, an independent private Git checkout on `project-root`. The full September guide is preserved at `docs/context/product-guide-2026-09-28.md`; search it for a named invariant rather than loading it in full. The current state and every phase/subtask live in `docs/features/windowsweep-completion/00-tracker.json`. Start with the parent `../remaining-work-summary.md`; read exact rows of `../remaining-work.md` and `../completion-plan-v5-2026-09-24.md` only when working on them. The parent root and website use separate Git histories.

## Routing and release state

- CLI source: `windowsweep.ps1`, `lib/`, `modules/`, `bin/`. Windows PowerShell 5.1 behavior is binding. The package has no runtime dependencies or JS build. `node bin/windowsweep.js --self-test --no-color` requires Windows and must not be claimed passed from Linux. `desktop/` contains the Tauri 2 app, its approved click dummy, source, tests and Drizzle schema. `docs/story/` carries the approved Bible/map and gate state. The docs site is `../windowsweep-docs/`; its content mirrors this repo's `docs/`. The private marketing/web app is `../windowsweep-web/`.
- CLI 1.3.2 and desktop-v1.3.2 were the latest recorded releases on 2026-09-28. The remaining programme is owner/second-machine gated; consult the tracker before any next release. `../release-kit-1.3.2/` is the spent release record, not an automatic next release. The root summary and product tracker are the status authorities.
- The website and desktop share an owner-created Supabase project. Agent Supabase operations are DEV-only by default, with an explicit DEV ref. Production actions require exact current-session owner approval and a pinned target. No old Firebase backend work belongs to this maintenance pass. Firebase is website hosting/GA4 only.
- AI fallback task DONE-024 closed on 2026-10-31: source inventory found no AI model call in the CLI, desktop, website or docs; the fleet AI rules apply if a model call is added.

## Safety and build gates

Every user-data deletion goes through `Remove-PathSafe` or `Send-ToRecycleBin` with a declared `-Within` root; no bare `Remove-Item` on user data. Dry-run never changes data. Protected paths only grow. Section numbers are add-only and targets need real-machine evidence. No network call from the CLI. Preserve PowerShell 5.1 syntax and ASCII source. The public repo contains no secrets. Owner-created client packages, including `@perkforce/tool-kit`, are forbidden.

For CLI changes, use the Windows self-test, version parity, PSScriptAnalyzer and package allowlist gates in `docs/context/product-guide-2026-09-28.md`; run these gates locally on Windows before release. The desktop app uses `yarn gates` and `yarn typecheck:clean` after dependency changes. Never change signed releases, tags, npm publication or store assets as part of a context pass. CLI GitHub Releases use `--latest=false`; only a desktop release can be Latest because the updater reads its `latest.json`. The updater signing key, password and public key are backed up as FilesHub `general_files.bk_windowsweep_tauri_updater_key`, `_key_password` and `_key_pub`; the local, download and header checksums matched on 2026-10-31. Prove a restored-key signature against the shipped public key before release.

The click dummy owns desktop layout and words; amend it first and compare at 1440 and 760 px (the native minimum width). The product's story Bible/map and `run-state.json` govern prose. The owner pre-authorized Gate 4 publication only if final fact consistency passes and no `NEEDS DECISION` remains; read the actual approval record for each surface. Do not infer approval from elapsed time.

## Git and context

This repo's owner primary is `main` and remote `o`. Fetch and merge before editing and immediately before commit/push; never force-push or merge parent `project-root` here. Public docs and private website push to their own `main` branches. Keep root plans and evidence in the private parent checkout. The root's `RESTORE.md` recreates all four repositories. The 30-day context cadence is recorded in the workspace tracker; a feature/release work item may still be due before the next context pass.

## Stop-work Git gate

<!-- RULE:stop-work-git-gate v2026-10-20 -->

Before stopping, commit every legitimate change and work-progress checkpoint in this repository and each independent nested repository, fetch and merge the designated upstream, push the documented working branch, then verify an empty worktree and `0 0` ahead/behind. Never stash, discard, reset, rebase, or force-push. If synchronization is blocked, report the exact repository, branch, blocker, and next action instead of calling the work complete. The full workflow remains authoritative in `~/.claude/rules/git-workflow.md`.
