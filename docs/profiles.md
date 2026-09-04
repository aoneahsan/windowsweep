# Profiles

A profile is a named list of sections, resolved exactly like `--only`. Subtract with `--exclude`. Preview any
profile with `--dry-run` the first time.

| Profile | Sections | When to use |
|---|---|---|
| `dev` | 1, 2, 3, 4, 5, 6, 17 | Reclaim developer caches, emulators, Docker and stale `node_modules` |
| `minimal` | 7, 8, 9, 10 | Quick weekly sweep of browser, app and Windows caches plus temp |
| `cache-only` | 1, 2, 3, 6, 7, 8, 9 | Every cache layer, nothing else - the "something is misbehaving" reset |
| `system` | 12, 13, 14 | The admin batch: Windows Update cache, Disk Cleanup engine, component store |
| `deep` | 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 21 | The monthly clean, everything except the deep-gated and interactive sections |
| `audit` | 0, 21, 22, 24, 25 | Read-only diagnostics: health, disk usage, global packages, idle programs, startup items |

```powershell
windowsweep --profile dev --dry-run
windowsweep --profile dev --yes
windowsweep --profile system --yes --elevate
windowsweep --profile deep --exclude 14 --yes
```

Notes:

- `dev` includes section 17, which is interactive-only: in a batch run it is refused and reported; run the
  profile from a console to select artefacts, or use `--dry-run` to list them.
- `dev` includes section 4 (AVDs), which needs `--yes` in batch mode and honours the per-AVD idle gate.
- `system` needs an elevated console; without `--elevate` every section in it is skipped with the command to run.
- No profile includes 11, 15, 16 or 20. Those are deep sections and need `--i-understand-deep` explicitly.

Last Updated: 2026-09-03
