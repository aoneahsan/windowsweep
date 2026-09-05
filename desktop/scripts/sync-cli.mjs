/**
 * Copy the CLI engine into the Tauri bundle's resources.
 *
 * The desktop app ships the engine rather than depending on a global install: a
 * person who installs the app has not necessarily installed Node, and an app that
 * silently needs `npx` is an app that fails on a machine with no network.
 *
 * 🔴 The copy is one-directional and the app never edits it. What lands here is
 * exactly what the published npm tarball contains, so a bug reproduced in the
 * desktop app reproduces on the command line with the same file.
 */
import { cpSync, mkdirSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const desktop = join(here, '..');
const cli = join(desktop, '..');
const dest = join(desktop, 'src-tauri', 'resources', 'windowsweep');

// The `files` array in the CLI's package.json is the authority on what ships.
const pkg = JSON.parse(readFileSync(join(cli, 'package.json'), 'utf8'));
const entries = ['windowsweep.ps1', 'VERSION', 'LICENSE', ...pkg.files.filter((f) => f.endsWith('/'))];

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

let copied = 0;
for (const entry of entries) {
  const from = join(cli, entry);
  if (!existsSync(from)) continue;
  cpSync(from, join(dest, entry), { recursive: true });
  copied += 1;
}

const script = join(dest, 'windowsweep.ps1');
if (!existsSync(script)) {
  console.error('windowsweep.ps1 did not reach the bundle - the app would ship with no engine');
  process.exit(1);
}
const version = readFileSync(join(cli, 'VERSION'), 'utf8').trim();
console.log(`bundled the ${version} engine: ${copied} entries -> src-tauri/resources/windowsweep/`);
