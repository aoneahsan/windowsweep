/**
 * Mirror the command-line engine into the Tauri bundle's resources, when a dev server or a build
 * starts.
 *
 * The desktop app ships the engine rather than depending on a global install: a person who
 * installs the app has not necessarily installed Node, and an app that silently needs `npx` is an
 * app that fails on a machine with no network.
 *
 * 🔴 The copy is one-directional and the app never edits it. What lands here is what the published
 * npm tarball carries for the engine, so a bug reproduced in the desktop app reproduces on the
 * command line with the same file.
 *
 * It moved here from `scripts/sync-cli.mjs` (TASK-019, 2026-09-26: the house rules forbid a scripts
 * folder). The selection is unchanged - 41 files for the 1.3.x engine, byte-identical to what that
 * script produced - with three differences, each for a reason:
 *   - it MIRRORS: a file is written only when its bytes differ, and a file the engine no longer has
 *     is removed. `tauri dev` starts this on every run, and rewriting 41 files each time would
 *     re-run cargo's build script for nothing;
 *   - a declared entry that is missing is an error, where the script skipped it silently;
 *   - the bundle is checked after the copy: the script, its VERSION and its file count.
 * `tauri build` runs `beforeBuildCommand` (`yarn build`) before cargo, so the release workflow's
 * installers carry the engine this writes.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import type { Logger, Plugin } from 'vite';

/** What one mirror pass found and did. */
export interface EngineBundle {
  /** The engine's `VERSION`, read from the CLI and from the bundle alike. */
  version: string;
  /** The files the bundle holds - equal to the files the source declares. */
  files: number;
  /** Files copied because they were missing or their bytes differed. */
  written: number;
  /** Files deleted because the engine no longer has them. */
  removed: number;
}

const toPosix = (path: string): string => path.split(sep).join('/');

/** Every file under `dir`, as paths relative to `base` with forward slashes. */
function filesUnder(dir: string, base: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(path, base));
    else if (entry.isFile()) out.push(toPosix(relative(base, path)));
  }
  return out;
}

/** Remove every directory under `dir` that is left empty, deepest first. */
function removeEmptyDirs(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    removeEmptyDirs(path);
    if (readdirSync(path).length === 0) rmdirSync(path);
  }
}

/**
 * Mirror the engine into `src-tauri/resources/windowsweep/` and verify the result.
 *
 * @param desktopRoot - the desktop app's root; the CLI is its parent folder.
 * @throws when a declared entry is missing, or the bundle is not what the source declares.
 */
export function syncEngine(desktopRoot: string): EngineBundle {
  const cli = join(desktopRoot, '..');
  const dest = join(desktopRoot, 'src-tauri', 'resources', 'windowsweep');

  // The `files` array in the CLI's package.json is the authority on what ships.
  const pkg = JSON.parse(readFileSync(join(cli, 'package.json'), 'utf8')) as { files?: unknown };
  const files = pkg.files;
  if (!Array.isArray(files) || !files.every((f): f is string => typeof f === 'string')) {
    throw new Error(
      "the CLI's package.json has no `files` array - it is the authority on what ships"
    );
  }

  // 🔴 `package.json` is listed EXPLICITLY because npm puts it in every tarball regardless of the
  // `files` array, so it never appears in that array and a files-driven copy silently omits the
  // one file npm always ships. Two things depended on it and both were wrong until 2026-09-07:
  //
  //   bin/windowsweep.js reads it for the version, inside a try/catch that falls back to the
  //   literal in lib/constants.ps1 - so the bundled launcher took a code path no npm user ever
  //   takes, and reported the right number for the wrong reason.
  //
  //   The self-test's version-parity check compares VERSION, package.json and lib/constants.ps1.
  //   With the file absent it read '' and FAILED - 150 of 151 from the installed app while the
  //   repository copy passed 151/151.
  const entries = [
    'windowsweep.ps1',
    'VERSION',
    'LICENSE',
    'package.json',
    ...files.filter((f) => f.endsWith('/')),
  ];

  /** Every file the bundle must hold: its path inside the bundle -> its source. */
  const wanted = new Map<string, string>();
  for (const entry of entries) {
    const from = join(cli, entry);
    if (!existsSync(from)) {
      throw new Error(
        `the engine entry ${entry} is missing from the CLI - the bundle would ship without it`
      );
    }
    if (statSync(from).isDirectory()) {
      for (const rel of filesUnder(from, cli)) wanted.set(rel, join(cli, rel));
    } else {
      wanted.set(toPosix(entry), from);
    }
  }

  mkdirSync(dest, { recursive: true });
  let written = 0;
  for (const [rel, from] of wanted) {
    const to = join(dest, rel);
    if (existsSync(to) && readFileSync(to).equals(readFileSync(from))) continue;
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    written += 1;
  }
  let removed = 0;
  for (const rel of filesUnder(dest, dest)) {
    if (wanted.has(rel)) continue;
    unlinkSync(join(dest, rel));
    removed += 1;
  }
  removeEmptyDirs(dest);

  // Check the bundle itself, never the loop above: this is what the installers will carry.
  if (!existsSync(join(dest, 'windowsweep.ps1'))) {
    throw new Error('windowsweep.ps1 did not reach the bundle - the app would ship with no engine');
  }
  const version = readFileSync(join(cli, 'VERSION'), 'utf8').trim();
  const bundled = readFileSync(join(dest, 'VERSION'), 'utf8').trim();
  if (bundled !== version) {
    throw new Error(`the bundled engine reads ${bundled} but VERSION reads ${version}`);
  }
  const count = filesUnder(dest, dest).length;
  if (count !== wanted.size) {
    throw new Error(
      `the bundle holds ${String(count)} files but the engine declares ${String(wanted.size)}`
    );
  }
  return { version, files: count, written, removed };
}

/**
 * The Vite plugin: mirror the engine when `yarn dev` or `yarn build` starts, and stop on any fault.
 *
 * @param desktopRoot - the desktop app's root.
 */
export function engineBundlePlugin(desktopRoot: string): Plugin {
  let logger: Logger | undefined;
  return {
    name: 'windowsweep-desktop:engine-bundle',
    configResolved(config) {
      logger = config.logger;
    },
    buildStart() {
      try {
        const bundle = syncEngine(desktopRoot);
        logger?.info(
          `[engine-bundle] the ${bundle.version} engine: ${String(bundle.files)} files in src-tauri/resources/windowsweep/ (${String(bundle.written)} written, ${String(bundle.removed)} removed)`
        );
      } catch (error) {
        this.error(`[engine-bundle] ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  };
}
