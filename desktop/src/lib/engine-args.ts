/**
 * Every argument this window may hand the engine, built in one place.
 *
 * 🔴 Lifted out of `engine.ts` when that file crossed the project's 500-line
 * ceiling, the same move `reclaim-map-model.ts` records. Nothing changed in the
 * move: the builders, their reasoning and the `RunPreferences` contract are
 * verbatim, and `engine.ts` re-exports every one of them so no call site had to
 * learn a second import path.
 *
 * The rule the whole file exists for: NO SCREEN ASSEMBLES A FLAG OF ITS OWN. A
 * flag assembled at a call site is a flag that can disagree with the sentence
 * printed above the button that runs it.
 */

/**
 * The user's exclusions, as flags.
 *
 * 🔴 ONE place builds these and every argument builder below calls it, because
 * `--exclude-path` is the flag whose failure mode is a person believing a folder
 * is protected when it is not. It is repeatable, which the engine supports
 * (`windowsweep.ps1:170`) and the Rust validator walks rather than deduplicates
 * (`src-tauri/src/args.rs`), so one flag per path is correct.
 *
 * 🔴 It is passed on the read-only `--scan` too. Measured on this machine rather
 * than assumed: two full scans, one with `--exclude-path` and one without, both
 * reported the same 665 targets and an empty `excluded[]`, because a scan never
 * reaches the deletion chokepoint. So it is inert there - and passing it anyway
 * keeps the rule "every invocation carries the exclusions" with no exception for a
 * future call site to get wrong, and keeps the command line in the status bar the
 * whole invocation.
 */
function excludeArgs(excludedPaths: readonly string[]): string[] {
  return excludedPaths.flatMap((path) => ['--exclude-path', path]);
}

/**
 * Read-only. Measures every declared target and deletes nothing.
 *
 * 🔴 IT CARRIES THE THRESHOLDS TOO, and that is D-8's other half. The rule this
 * file already states for `safeBatchArgs` - "a control that sets a value the run
 * does not receive is a control that lies" - does not stop at the runs that delete:
 * without the flags the engine falls back to its own `config.json`, so a machine
 * where someone has run `windowsweep --days 30` once would be measured with 30
 * while the Settings screen showed 100. The status-bar command line is the whole
 * invocation for the same reason.
 */
export function scanArgs(
  options: { excludedPaths: readonly string[] } & RunPreferences,
): string[] {
  return [
    '--scan',
    options.developer ? '--developer' : '--not-developer',
    '--days',
    String(options.idleDays),
    '--temp-days',
    String(options.tempDays),
    '--large-file-mb',
    String(options.largeFileMb),
    ...excludeArgs(options.excludedPaths),
  ];
}

/**
 * Every preference the Settings screen can set, in one object.
 *
 * 🔴 All three are REQUIRED, deliberately. Optional fields would let a call site
 * forget one, and a forgotten flag means the engine silently falls back to its own
 * `config.json` - so the window would show one number beside a run that used
 * another. TypeScript refusing the call is the only reliable guard, because
 * nothing at runtime can tell a deliberate omission from a missed one.
 */
export interface RunPreferences {
  developer: boolean;
  idleDays: number;
  tempDays: number;
  largeFileMb: number;
}

/**
 * The safe batch, as the engine defines it. `--dry-run` makes it a rehearsal.
 *
 * 🔴 `--days` is passed on EVERY run, never only when it differs from the
 * engine's default of 100. The engine falls back to its own `config.json` when
 * the flag is absent, and a person who has run `windowsweep --days 30` once has
 * changed that file - so the window would be showing 100 beside a run that used
 * 30. Passing it always makes the number on the screen the number that runs.
 *
 * 🔴 `--temp-days` and `--large-file-mb` join it for exactly the same reason, now
 * that the Settings screen can set both. A control that sets a value the run does
 * not receive is a control that lies, and this is the one place that can be true
 * or false for all three at once. `--large-file-mb` governs section 19, which
 * `--yes` never auto-answers - so on a safe batch it is inert rather than wrong,
 * and it is still passed so the command line on screen is the whole invocation.
 */
export function safeBatchArgs(options: {
  dryRun: boolean;
  sections?: number[];
  /**
   * 🔴 REQUIRED, for the same reason the three preferences above are: a call site
   * that could omit the exclusions is a call site that will, and the result is a
   * person watching a folder they marked kept get deleted. TypeScript refusing the
   * call is the only reliable guard - nothing at runtime can tell an empty set
   * from a forgotten one.
   */
  excludedPaths: readonly string[];
} & RunPreferences): string[] {
  const args: string[] = [];
  if (options.sections && options.sections.length > 0) args.push('--only', options.sections.join(','));
  else args.push('--all');
  args.push('--yes');
  if (options.dryRun) args.push('--dry-run');
  args.push(options.developer ? '--developer' : '--not-developer');
  args.push('--days', String(options.idleDays));
  args.push('--temp-days', String(options.tempDays));
  args.push('--large-file-mb', String(options.largeFileMb));
  args.push(...excludeArgs(options.excludedPaths));
  return args;
}

/**
 * The same invocation as a line a person could type, for the status bar.
 *
 * 🔴 Built from the argument list that actually runs, never from a sentence: a
 * hand-written string is free to drift from the flags, and the whole point of the
 * line is that it is what this window does.
 *
 * Two honest omissions, both plumbing the Rust side adds per run and neither of
 * them a mode: `--no-color`, and the `--reports-dir` / `--logs-dir` pair pointing
 * at that run's own folder (`src-tauri/src/engine.rs` -> `run_clean`). `--json`
 * is included because it is what makes the summary readable, and it is prepended
 * there in exactly this position.
 */
export function commandLine(args: string[]): string {
  return ['windowsweep', '--json', ...args].join(' ');
}

/**
 * An interactive section, answered in advance by a person who picked the rows.
 * The selection travels as a file of paths rather than as indexes - see
 * `writeSelectFile` above for why.
 *
 * 🔴 EVERY FIELD IS REQUIRED, and the shape is an object rather than four
 * positional arguments for the reason `safeBatchArgs` already records: a call site
 * that CAN omit a flag is a call site that will, and here the omissions are
 * `--permanent` (the difference between the Recycle Bin and no undo) and the
 * exclusions (a folder a person marked kept). Four positional parameters, two of
 * them booleans, also transpose silently. TypeScript refusing the call is the only
 * guard that holds, because nothing at runtime can tell a deliberate `false` from
 * a forgotten one.
 *
 * 🔴 NO `--yes`. `--yes` never answers an interactive section by design
 * (`lib/ui.ps1` -> `Read-MultiSelect` passes `-NoAutoYes` from those pickers), and
 * it is not needed: matching the select file marks the choice as scripted
 * (`LastSelectionScripted`), and the confirmation that follows is the one prompt
 * `-ScriptedOk` answers. So the person's own selection is what confirms the
 * deletion, which is exactly the claim the Picker screen makes.
 */
export function selectionArgs(options: {
  selectFilePath: string;
  sections: number[];
  /**
   * The segmented control on the Picker: `false` sends what it can to the Recycle
   * Bin, `true` passes `--permanent`.
   *
   * ⚠️ It governs the `recycle`-tier sections only - 18, 19 and 23. Section 17 is
   * tier `rebuilds` and removes build artefacts through the chokepoint outright,
   * with or without this flag (`modules/projects.ps1:157` calls `Remove-PathSafe`
   * directly, never `Send-ToRecycleBin`). The engine's own help was corrected to
   * "18, 19 and 23" for the same reason.
   */
  permanent: boolean;
  excludedPaths: readonly string[];
} & RunPreferences): string[] {
  const args = [
    '--only',
    options.sections.join(','),
    '--select-file',
    options.selectFilePath,
    options.developer ? '--developer' : '--not-developer',
  ];
  /* 🔴 THE THREE THRESHOLDS ARE PASSED HERE TOO, and leaving them out is not the
     harmless omission it looks like. The engine does not act on the file's paths
     directly: it re-derives each section's candidate list on THIS run and matches
     the file's lines against it (`lib/ui.ps1` -> `Resolve-SelectedPaths`). So the
     thresholds decide what is offered, and a run that used different ones would
     offer a different list - a picked row would match nothing and would silently
     not be deleted, while the screen had shown it ticked.
     Section 19 is the concrete case: `--large-file-mb` is what makes a file large
     enough to be offered, the Settings screen can change it, and section 19 is one
     of the four this screen exists for. Section 17 is developer-gated, so `--days`
     decides its list the same way. `--temp-days` reaches no interactive section and
     is inert here - it is passed for the reason `safeBatchArgs` records, so the
     command line on screen is the whole invocation and no future call site has to
     rediscover which of the three matter. */
  args.push('--days', String(options.idleDays));
  args.push('--temp-days', String(options.tempDays));
  args.push('--large-file-mb', String(options.largeFileMb));
  if (options.permanent) args.push('--permanent');
  args.push(...excludeArgs(options.excludedPaths));
  return args;
}

/**
 * Register or remove the weekly Scheduled Task.
 *
 * 🔴 `--yes` IS REQUIRED HERE, and it is the whole reason this is a builder rather
 * than a literal at the call site. `Install-WeeklyTask` asks
 * `Confirm-Ui -Prompt 'Register this task for your user account?'`
 * (`modules/release_helpers.ps1:350`), and this window spawns PowerShell with a
 * NULL stdin - so without `--yes` the engine takes the non-interactive branch,
 * answers its own question **no**, and exits 0 having done nothing. A switch that
 * reported success over a task that was never created is precisely the failure
 * that kept this control disabled.
 *
 * 🔴 Neither mode produces a `--json` summary: both end in their own function and
 * never reach `Write-JsonSummary`. That is handled once, by name, in
 * `src-tauri/src/args.rs` -> `NO_SUMMARY_FLAGS`; without it the task is registered
 * and the window still reports the engine as broken.
 */
export function scheduleArgs(install: boolean): string[] {
  return [install ? '--install-task' : '--uninstall-task', '--yes'];
}

/**
 * Sections that need an elevated window.
 *
 * 🔴 `--elevate` is the ENGINE's flag. It opens the second window and Windows
 * shows the prompt. This application never requests elevation for itself, which
 * is what the Elevation screen tells the reader, and this is the line that makes
 * it true.
 */
export function elevatedArgs(
  options: {
    /** The sections a person actually ticked - never "every admin section". */
    sections: number[];
    /**
     * 🔴 `--i-understand-deep`, and it is passed ONLY after an explicit
     * confirmation naming what it authorises.
     *
     * `modules/runner.ps1:89-92` refuses every `Batch = 'deep'` section in batch
     * mode without it - 15, 16 and 20 of the six this screen offers - so until it
     * existed the screen listed six sections and could run three. The refusals
     * reached the report, so nobody was misled; half the screen simply did
     * nothing.
     *
     * 🔴 It is NOT a default this window may add on somebody's behalf. It
     * authorises clearing every Windows Event Log permanently, removing
     * `hiberfil.sys` (and with it Hibernate and Fast Startup), and stopping Docker
     * Desktop and every WSL distro to compact their disk images. That is a
     * decision, so the Elevation screen names those three consequences and asks,
     * and this flag is the answer rather than a convenience.
     */
    deep: boolean;
    /**
     * Section 15's own value, or `null` when it was not chosen.
     *
     * 🔴 WITHOUT IT SECTION 15 IS A SILENT NO-OP. `modules/system_admin.ps1:171`:
     * with no `--hiberfil` and no person at the keyboard the engine prints "pass
     * --hiberfil off|reduced|keep to run this section unattended" and returns - so
     * a ticked section 15 behind a UAC prompt would do nothing at all. `keep` is
     * not sent: it means "leave it alone", which is what not choosing the section
     * already means.
     */
    hiberfil: 'off' | 'reduced' | null;
    excludedPaths: readonly string[];
  } & RunPreferences,
): string[] {
  const args = ['--only', options.sections.join(','), '--elevate'];
  const { developer, excludedPaths } = options;
  /* 🔴 No `--dry-run` option, on purpose. A rehearsal of an elevated run would still
     pass `--elevate`, and the engine raises a UAC prompt on `--elevate` whatever the
     mode (`windowsweep.ps1:294`) - so a "measure first" built here would ask for
     administrator rights to look. Measuring is `scanArgs`, which never elevates. */
  args.push('--yes');
  if (options.deep) args.push('--i-understand-deep');
  if (options.hiberfil !== null) args.push('--hiberfil', options.hiberfil);
  /* 🔴 This was the one run path of four that did NOT carry the answer, so the
     engine fell back to its own saved config while the window showed a switch. It
     matters here specifically: the Elevation screen can include section 20, which
     carries `Dev = $true`, so an elevated run really can include a dev-flagged
     section - and it would have used a different answer from the one on screen.
     Found by a docs writer checking a sentence I had asserted, not by a gate;
     scanArgs, safeBatchArgs and selectionArgs always passed it. */
  args.push(developer ? '--developer' : '--not-developer');
  /* 🔴 THE THREE THRESHOLDS, for the reason the other three builders already give:
     absent, the engine reads its own `config.json` and the window is showing one
     number beside a run that used another. `--days` is the one that bites here -
     it decides a dev target's prune window, and section 20 is dev-flagged - while
     `--temp-days` and `--large-file-mb` reach no admin section and are inert. They
     are passed anyway so the invocation on screen is the whole invocation and no
     future call site has to rediscover which of the three matter. (D-8.) */
  args.push('--days', String(options.idleDays));
  args.push('--temp-days', String(options.tempDays));
  args.push('--large-file-mb', String(options.largeFileMb));
  /* 🔴 The elevated run is the one that matters most for this flag: it runs as
     administrator over Windows Update, the component store and the event logs, so
     a forgotten exclusion here is the largest blast radius of the four paths. It is
     also the path the `--developer` defect above lived on, for exactly the same
     reason - a builder nobody looks at twice. */
  args.push(...excludeArgs(excludedPaths));
  return args;
}

