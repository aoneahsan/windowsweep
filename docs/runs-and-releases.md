# Runs and releases - windowsweep

Split out of `docs/PROJECT-CONTEXT.md`, the always-read file, which points here: both sections moved verbatim on 2026-09-25 under RW-132.

## Verified runs

### 2026-09-03 - safe batch, developer mode, not elevated (build machine, Windows 10 Pro for Workstations 19045)
- Drive C: free space 2,033,340,416 -> 25,746,153,472 bytes (+22.08 GB); the run's own report counted
  21,319,077,118 bytes in 11m 31s over 11 sections, plus about 1.5 GB removed by an interrupted first pass.
- Per section: 1 package caches 12.16 GB (yarn v1 alone 10.8 GB in 340,734 files idle 100+ days), 6 editors
  4.30 GB (incl. two uninstalled `openai.chatgpt` extension leftovers, 1.95 GB), 10 user temp 3.35 GB, 8 apps
  0.92 GB, 7 browsers 0.46 GB (Edge + Brave), 9 Windows caches 87 MB, 2 build tools 40 MB, 3 and 21 nothing.
- Skipped by design and left to the owner: Chrome (open), Slack and Granola (open), Docker (daemon not running),
  every admin section (not elevated), hibernation (15.9 GB, admin) - rows in `docs/MANUAL-TASKS.md`.
- Protected spot-check before/after: `.ssh` (4 files, newest mtime), Documents (90 files, newest mtime),
  Desktop, AVDs (2), Gradle wrapper dists (2), Android SDK, installed VS Code extensions (16) all unchanged;
  extension folders went 18 -> 16, exactly the two leftovers.
- The first real pass exposed a hot-path defect: the per-file protection check cost 10.6 ms (path resolution
  for ~70 subtrees plus 50 wildcard compiles per call), so 400k yarn files would have taken over four hours.
  The pass was stopped (every deletion is atomic), `Get-ProtectionReason` was rewritten over pre-normalized
  prefixes and precompiled `WildcardPattern` objects (0.58 ms/call, identical verdicts on 35 probe paths,
  self-test guards green), and the run restarted. Keep the guard table-driven; never reintroduce per-call
  path resolution there.

### 2026-09-07 - safe batch, developer mode, not elevated, THROUGH THE INSTALLED DESKTOP APP (build machine)
- Authorised by the owner on 2026-09-07 ("Yes, the unelevated safe batch"); dry-run first, then one real
  `--all --yes` developer-mode run from the installed `desktop-v1.1.0` build.
- Freed 3,924,712,402 bytes across 11 sections with zero refusals; drive C: 5.84 -> 9.85 GB free. The first
  real cleanup driven through the window; recorded in `desktop/design/gate4/GATE4-REPORT.md`.
- No interactive section, no admin section, never elevated.

### 2026-09-17 - the in-app updater proved 1.1.0 -> 1.2.0 on this machine, and the first beacons

The only end-to-end proof that the release chain works: that a shipped build finds its successor, verifies
its minisign signature and replaces itself. **No cleanup ran** - this is an update and a first boot.

- Installed 1.1.0 launched with a WebView2 DevTools port. It found the release **by itself**, drew the update
  band, and the line named the version in the product's own words: *"Version 1.2.0 is ready"*. On the press
  it installed and restarted; HKCU `DisplayVersion` moved **1.1.0 -> 1.2.0 after 10 s**.
- `latest.json` resolves to 1.2.0 with `windows-x86_64`, `-msi` and `-nsis`; an NSIS-installed app resolves
  the `-nsis` entry, and its signature is present. The platform key was read from the request, not inferred.
- **First-boot beacons from the installed 1.2.0**: Google Analytics 4 one request, 204, `screen.view`;
  Amplitude three requests, 200, `screen.view`; Clarity two requests, 200. **Sentry received nothing, which
  is correct** - it reports on an error and there was none; its DSN is a repository variable the workflow
  passes, so it is configured and idle.
- 🔴 **The capture reported "personal-data matches: 7" and every one was its own instrument.** Its needle was
  `/[A-Za-z]:\|[A-Za-z]://`, and the second half matches the `s:/` inside every `https://`, so it flagged
  7 of 7 requests against their own URLs. Re-checked with honest patterns - a drive letter followed by a real
  system directory, a `/Users/<name>` segment, a UNC path, the machine name, an email, the user name as a path
  segment - and every one returned **0**. The needle is fixed in `release-kit/updater-proof.mjs` and proved
  7/7 both ways. A matcher that flags everything is indistinguishable from one that works until someone reads
  what it matched.
### 2026-09-25 - the in-app updater proved 1.2.0 -> 1.3.0 on this machine, and the first boot of the first release with sign-in

`../release-kit-1.3.0/updater-proof-source.txt`, evidence in `../gate4-evidence/updater-1.3.0/`. The installed 1.2.0
found `desktop-v1.3.0` by itself, drew *"Version 1.3.0 is ready"*, installed on the press and restarted; HKCU
(`Get-ItemProperty`, never `reg query`) read 1.3.0 three seconds after the press, and the proof stopped only the
instance it had started. (Its runtime probe ran on the window's first `about:blank` document and printed
`no-tauri`; the band was read from the loaded page 3.5 s later - an instrument timing line, not a finding.)

The first-boot requests, signed out, 60 s: `www.googletagmanager.com` 1, `www.google-analytics.com` 1
(`screen.view`, 204), `api2.amplitude.com` 3 (`screen.view`, 200), `www.clarity.ms` and `scripts.clarity.ms` 1
each. **Undisclosed hosts: 0 - no Supabase call from a signed-out window. Personal-data matches: 0.** Sentry sent
nothing because nothing errored; the update check runs in the Rust updater, outside the page's network log, and
is disclosed. No engine run beyond startup's `--list --json`.

### 2026-09-14 - 🔴 AN UNINTENDED REAL RUN, started by a GATE 4 guard that reported success and did nothing

Found on 2026-09-17 while auditing, not on the day. **It was not authorised**: the owner's 2026-09-07 grant
was for one real safe batch and that had been spent. Nothing was harmed, and it is recorded here because it
is his machine and because the cause is reusable.

- `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\r11-guard-probe\` - `Mode: all`, `Dry-run: no`,
  `Elevated: no`, `Launcher: desktop`, windowsweep 1.2.0 on PowerShell 5.1.19041.7663.
- `meta`: 2026-09-14T16:40:12+05:00 to 16:41:53, 101 s, `developer_mode: true`, `idle_days: 100`,
  `temp_days: 3`. Sections 0,1,2,3,5,6,7,8,9,10,21 - "Sections run / skipped: 11 / 0".
- **"Reclaimed: 1.8 GB"**; the closing drive table reads C: 9.5 GB free of 272.9 GB. No interactive section,
  no admin section, never elevated - the same safe batch the two authorised runs used.
- 🔴 **Cause, and the rule it produces:** GATE 4 round 11 installed an IPC guard by assigning a wrapper to
  `window.__TAURI_INTERNALS__.invoke` so that Reclaim could be timed without deleting anything. That property
  is **non-writable and non-configurable**, so the assignment was a **silent no-op while the guard reported
  "installed"** - and the next press started a real run. Recorded in the surviving driver
  `gate4-evidence/round11/drivers/16-focusplants-ack.mjs`. **Never guard Tauri IPC by assigning to
  `invoke`.** Guard at the CDP transport (`Fetch` on `http://ipc.localhost/*`) and prove it fail-closed with
  a probe call before the first press. This is the second instance of the class here; the first is the
  recorded postMessage-IPC blind spot. Ask of any guard: *what did I read back to prove it is installed?*
- 🔴 **A 28-folder sweep missed it** because that sweep filtered on the `YYYY-MM-DD` folder prefix and this
  folder is named `r11-guard-probe`. List the whole directory, then filter.
- It is also why **D-63** (a rehearsal going stale when the disk changes under it) was observable at all: the
  run removed roughly what the stored rehearsal had estimated, leaving the app's own newest measurement
  contradicting the figures it was still printing.

### 2026-09-13 - the marketing site's telemetry, on the wire from the deployed origin

After web `07aa763`, three clean first loads of `/` in Chrome for Testing on its own profile, anonymous: GA4,
Amplitude, Clarity and Sentry each received the landing `screen.view` exactly once; the route change and a
control press reached GA4 and Amplitude; Clarity's uploads carried no readable page text (0 of 258 phrases, 0 of
14 labels); 212 requests and 22 bodies carried no drive path, user name, machine name or email; blocking a
destination turned it red. The first capture of the same day had found Clarity never started (no queue stub)
and the landing view lost for GA4 and Amplitude (sent before they registered) - both fixed first. Evidence:
`site-evidence/wire/` in the workspace root, outside git.

### Not yet run for real (P1 in `remaining-work.md`)
Sections 12-16 and 20 (elevation), `--elevate` itself, section 4 (no idle AVD), 5 (daemon off), 7 for Chrome,
8 for Slack and Granola, 17-19 (interactive), the weekly Scheduled Task, any Windows 11 machine, the `--pwsh`
path on a machine with PowerShell 7. Record each here with numbers when it happens.

## Release record
- 2026-09-03: `ac72188` (first commit, 72 files) and `70c6738` pushed to `main`; repo created public with
  `gh repo create`, Issues enabled, ruleset 22181256 "Protect main (PR + approval; owner bypass)" active
  (deletion, non-fast-forward, PR with 1 approval, required check `ci`; bypass = Repository admin). Direct
  owner pushes report `Bypassed rule violations for refs/heads/main` - expected, never `--force`/`--admin`.
- 2026-09-03T09:15:18Z: `windowsweep@1.0.0` published to npm by `aoneahsan` (37 files, 263,214 bytes
  unpacked; built from `70c6738`); verified with `npm view` and `npx -y windowsweep@1.0.0 --version` from a
  fresh cache.
- 2026-09-03: `5109557` (tracker close-out, real-run and publish records, WH001) and `84c732f` (the
  `Write-LogLine` rename that made CI green) pushed to `main`; not yet on npm.
- 2026-09-03T17:00Z: `windowsweep@1.0.1` published to npm by `aoneahsan` (38 files, 81.4 kB packed,
  273.1 kB unpacked; built from `edaa5cf`). The publish gate ran in full: clean pushed tree, CI green on both
  PowerShell hosts, registry at 1.0.0, tarball allowlist verified, a content-regression diff against the 1.0.0
  tarball (no file lost, `modules/self_test_extra.ps1` added), a smoke-install of the packed tarball into a
  temporary prefix (`--version`, `--list`, `--self-test` 114/114), then `npm view` = 1.0.1 and
  `npx -y windowsweep@1.0.1 --version` from `%TEMP%`.
- 2026-09-03: annotated tags `v1.0.0` (on `70c6738`, the commit the 1.0.0 tarball was built from) and `v1.0.1`
  (on `edaa5cf`) pushed, with a GitHub Release for each carrying its changelog entry. Every release from here
  on gets both.
- 2026-09-04T09:12Z: `windowsweep@1.1.0` published to npm by `aoneahsan` (44 files, 109.0 kB packed,
  365.6 kB unpacked; built from `3c4d54e`). The publish gate ran in full: clean pushed tree, CI run
  33856301415 green on both PowerShell hosts, registry at 1.0.1, tarball allowlist verified, a
  content-regression diff against the 1.0.1 tarball (**no file lost**; six added - the AI guide and the five
  new modules), a smoke-install of the packed tarball into a temporary prefix (`--version` 1.1.0, `--list`
  26 sections, `--self-test` 151/151), then `npm view --prefer-online` = 1.1.0 and
  `npx -y windowsweep@1.1.0 --version` from `%TEMP%`. Annotated tag `v1.1.0` on `3c4d54e` with a GitHub
  Release. 🔴 The `tar` on PATH here is Git Bash's, which reads `C:\...` as a remote host - the diff step
  uses `%SystemRoot%\System32\tar.exe` explicitly and refuses to compare fewer than 30 extracted files, so a
  failed extraction can never read as "nothing disappeared".
- 2026-09-07T17:55Z: **`desktop-v1.1.0`** published on GitHub Releases (created `--latest`, so the updater
  endpoint went from 404 to 200): `windowsweep_1.1.0_x64-setup.exe`, `windowsweep_1.1.0_x64-setup.exe.sig`,
  `windowsweep_1.1.0_x64_en-US.msi`, `windowsweep_1.1.0_x64_en-US.msi.sig`, `latest.json`, `SHA256SUMS.txt`
  (the last attached by hand after the workflow lost a consistency race; the workflow now retries). Sign-in
  and telemetry dormant in this build. Installed on this machine (HKCU `windowsweep 1.1.0`).
- 2026-09-08T12:27Z: `windowsweep@1.2.0` published to npm by `aoneahsan` (44 files, 117.4 kB packed,
  395.7 kB unpacked; built from `727d3a6`). The publish gate ran in full: version above the registry, a
  content-regression diff against 1.1.0 showing an **identical 44-file set**, a secret sweep over the shipped
  files, a smoke-install into a temp prefix (`--version`, `--list`, `--list --json`, `--self-test` 156), then
  `npx windowsweep@1.2.0` from the registry. Annotated tag `v1.2.0`; **GitHub Release created with
  `--latest=false`**, and `desktop-v1.1.0` verified still Latest with `latest.json` resolving.
- Verify a published version from a directory OUTSIDE this repo: inside it, npx resolves the same-named local
  package and reports `'windowsweep' is not recognized` (`docs/troubleshooting.md`).

- 2026-09-17T14:41Z: **`desktop-v1.2.0`** published on GitHub Releases, created `--latest` (IRON rule 13), on
  commit `3c0c889` - the commit GATE 4 round 12 blessed with the first clean verdict since round 6. Six
  assets plus `SHA256SUMS.txt`: `windowsweep_1.2.0_x64-setup.exe` (2,615,532 B, sha256
  `bb389f9f…63b8`), `windowsweep_1.2.0_x64_en-US.msi` (3,346,432 B, sha256 `c6374d34…2f0e`), a `.sig` for
  each, and `latest.json`. The `desktop-release` workflow built both installers in 4m42s with every step
  green. The stale draft built from `9735c7a` was deleted with its tag first; `desktop-v1.1.0` held Latest
  until the moment this published, so the updater endpoint never stopped resolving.
  🔴 **This is the first build that carries the four telemetry ids** (repository variables the workflow
  passes) and the first with the Report export. Sign-in ships **dormant**: the Supabase build-variable step
  was skipped because `external.google` still reads false, exactly as ordering rule O6 says it should.
  It bundles the **1.2.0** engine; CLI 1.3.0 follows the same day and the desktop moves to it next release.

- 2026-09-25T14:06Z: `windowsweep@1.3.1` published to npm by `aoneahsan` (46 files, 119.7 kB packed, 401.4 kB
  unpacked, shasum `e32f50dc…dd31`; built from `25ee559`). The publish gate ran in full: a clean pushed tree, `ci`
  green on that merge, the registry at 1.3.0, the README's anchors and links (npmjs.com answers 403 to any script;
  the registry confirmed the page's package), the packed tarball grepped for `1.3.0` (five hits, every one history:
  four source comments dating the 1.3.0 split and the README's "Before it" line), a content-regression diff against
  1.3.0 (**no file lost or added**; the seven changed files are the cascade's), a secret sweep, a smoke-install of
  the packed tarball (`--version`, `--list --json` 26 sections, `--self-test` 160), then from the registry: `latest`
  = 1.3.1 and the installed package **byte-identical** to the candidate, `--self-test` 160 again. Annotated tag
  `v1.3.1`; GitHub Release created `--latest=false`, with `desktop-v1.2.0` verified still Latest. `VERSION` ships LF
  as 1.3.0's did (this checkout writes CRLF; the blob is unchanged).
- 2026-09-25T14:12Z: **`desktop-v1.3.0`** published on GitHub Releases, created `--latest` (IRON rule 13), on
  `5934008` - the commit GATE 4 round 15 blessed. The `desktop-release` workflow printed *"Google sign-in is enabled
  on the project"* and *"Supabase build variables exported for the rest of this job"*: **the first build with sign-in
  live**. Six assets plus `SHA256SUMS.txt`: `windowsweep_1.3.0_x64-setup.exe` (2,625,221 B, sha256 `c1c1c88b…b800`),
  `windowsweep_1.3.0_x64_en-US.msi` (3,358,720 B, sha256 `5208dfcd…69ba`), a `.sig` for each, and `latest.json`
  (1.3.0, its NSIS entry signed). The MSI's File table holds 42 rows: 41 engine files and the app. It bundles the
  **1.3.0** engine byte-identical - CLI 1.3.1 was merged after the tag. The site's download page and the docs
  followed within the hour (O3'), and the updater proof above ran the same afternoon.

Last Updated: 2026-09-25 (RW-132: created from `docs/PROJECT-CONTEXT.md`, every line moved verbatim; later the same day `windowsweep@1.3.1`, `desktop-v1.3.0` and the updater proof 1.2.0 -> 1.3.0)
