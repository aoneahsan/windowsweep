# Contributing to windowsweep

Thanks for your interest. **windowsweep is free and open source under the [MIT License](./LICENSE)**, so forks,
pull requests and feature requests are all welcome.

---

## Ways to contribute

- **Report a bug** or **suggest a section** -> open a [GitHub issue](https://github.com/aoneahsan/windowsweep/issues).
  `windowsweep --report-issue` opens a pre-filled one; `windowsweep --debug-bundle` packages the log to attach.
- **Fix or improve the code** -> fork the repo and open a pull request.
- **Improve the docs** -> pull requests against `docs/` are as valuable as code.

You do not need any special access to contribute. Anyone can fork and open a PR.

---

## Governance - how changes land

- **`main` is protected.** Every change lands through a **pull request** with one approving review and a green
  `ci` check. Direct pushes to `main` are restricted to the maintainer.
- The maintainer (**Ahsan Mahmood** - [@aoneahsan](https://github.com/aoneahsan)) is the only one who pushes to
  `main` directly. Write access does **not** bypass review on `main`.

### Requesting contributor / write access

Fork + PR needs no access at all. For ongoing work, open a **"Contributor access request"** issue or email the
maintainer; access is granted at the maintainer's discretion and still cannot bypass review on `main`.

---

## Development setup

There is no build step. The engine is Windows PowerShell 5.1-compatible script; the Node launcher is a shim.

```powershell
git clone https://github.com/aoneahsan/windowsweep.git
cd windowsweep
node bin\windowsweep.js --self-test      # syntax, ASCII, safety guards, junction + dry-run fixtures
node bin\windowsweep.js --dry-run --all --yes   # what a safe batch would do on your machine
.\windowsweep.cmd --scan                 # the same engine without Node
```

**Requirements:** Windows 10 or 11, Windows PowerShell 5.1 (built in) or PowerShell 7. Node 14+ only for the
`npx` path. `Install-Module PSScriptAnalyzer` lets you run the same lint CI runs:
`Invoke-ScriptAnalyzer -Recurse -Path . -Settings PSScriptAnalyzerSettings.psd1`.

---

## Coding standards

- **PowerShell 5.1 first.** No ternary operator, no `??`, no `&&`/`||` chains, no `param()` block on the entry
  script (flags come from `$args`). Test on 5.1; CI also runs 7.
- **ASCII-only source.** Every `.ps1` and `.js` file contains only bytes below 0x80; glyphs come from
  `[char]` codes in `lib/ui.ps1`. The self-test fails otherwise.
- **Safety first, no exceptions.** Every deletion goes through `Remove-PathSafe` or `Send-ToRecycleBin` with a
  declared `-Within` root. A new target is a `New-Target` row in its section's `Get-TargetsNN`; run
  `--self-test`, which asserts no declared target sits inside a protected path. Never add a `Remove-Item`.
- **Everything honours `--dry-run`.** Destructive external commands go through `Invoke-External -Destructive`.
- **Section numbers are frozen.** Retire a section as a no-op that says so; never reuse its number.
- **Files stay under 500 lines**; functions carry a `.SYNOPSIS`; no network code of any kind.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`), one concern per PR.

---

## Pull request checklist

1. `node bin\windowsweep.js --self-test` passes on your machine.
2. `--dry-run` of the section you touched shows exactly what you expect, and nothing else.
3. `docs/sections.md`, `docs/cli-reference.md` and the README's section table reflect any flag or target you
   added or changed.
4. `CHANGELOG.md` has an entry under the next version.

---

## Support

If windowsweep saved you time, you can support its maintenance at
[aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep).
