#!/usr/bin/env node
/*
 * windowsweep - Node.js launcher for npx and global installs.
 *
 *   npx windowsweep              (zero install)
 *   npm i -g windowsweep         (then: windowsweep)
 *
 * A thin shim, nothing more. It:
 *   1. refuses to run anywhere but Windows;
 *   2. locates windowsweep.ps1 inside the package;
 *   3. starts Windows PowerShell with -ExecutionPolicy Bypass so the machine's script policy
 *      cannot block the run (WINDOWSWEEP_SHELL=pwsh or --pwsh selects PowerShell 7 instead);
 *   4. passes the package version and launcher facts through environment variables;
 *   5. forwards every argument, stdin/stdout/stderr, Ctrl-C and the exit code unchanged.
 *
 * Author:  Ahsan Mahmood <aoneahsan@gmail.com>  https://aoneahsan.com
 * License: MIT (see LICENSE)
 */
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

if (process.platform !== 'win32') {
  process.stderr.write(
    '\nwindowsweep runs on Windows only. Detected platform: ' + process.platform + '\n' +
    'Linux:  npx linux-cleanup     macOS:  npx macleanup\n\n'
  );
  process.exit(2);
}

const PKG_DIR = path.resolve(__dirname, '..');
const SCRIPT = path.join(PKG_DIR, 'windowsweep.ps1');
if (!fs.existsSync(SCRIPT)) {
  process.stderr.write('windowsweep: cannot find ' + SCRIPT + ' - the package may be corrupted. Try: npx --yes windowsweep@latest\n');
  process.exit(2);
}

let pkgVersion = '';
try { pkgVersion = require(path.join(PKG_DIR, 'package.json')).version || ''; } catch (_) { /* fall back to the literal in lib/constants.ps1 */ }

const rawArgs = process.argv.slice(2);
const wantPwsh = rawArgs.includes('--pwsh') || (process.env.WINDOWSWEEP_SHELL || '').toLowerCase() === 'pwsh';
const args = rawArgs.filter((a) => a !== '--pwsh');

const systemRoot = process.env.SystemRoot || 'C:\\Windows';
const windowsPowerShell = path.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
const shell = wantPwsh ? 'pwsh' : (fs.existsSync(windowsPowerShell) ? windowsPowerShell : 'powershell.exe');

const isNpx = /[\\/]_npx[\\/]/.test(PKG_DIR) || /npx/i.test(process.env.npm_config_user_agent || '');

const env = Object.assign({}, process.env, {
  WINDOWSWEEP_VERSION: pkgVersion,
  WINDOWSWEEP_LAUNCHER: 'node',
  WINDOWSWEEP_NPX: isNpx ? '1' : '0',
});

const child = spawn(shell, ['-NoProfile', '-NoLogo', '-ExecutionPolicy', 'Bypass', '-File', SCRIPT].concat(args), {
  stdio: 'inherit',
  env: env,
  windowsHide: false,
});

child.on('error', (err) => {
  if (err.code === 'ENOENT') {
    process.stderr.write('\nwindowsweep: ' + shell + ' was not found. Windows PowerShell 5.1 ships with Windows 10/11;' +
      (wantPwsh ? ' install PowerShell 7 or drop --pwsh.\n\n' : ' check that %SystemRoot%\\System32\\WindowsPowerShell exists.\n\n'));
  } else {
    process.stderr.write('windowsweep: failed to start PowerShell: ' + err.message + '\n');
  }
  process.exit(2);
});

child.on('exit', (code, signal) => {
  if (signal) { process.exit(128 + (os.constants.signals[signal] || 0)); }
  process.exit(code === null ? 0 : code);
});

['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
  process.on(sig, () => { if (!child.killed) { child.kill(sig); } });
});
