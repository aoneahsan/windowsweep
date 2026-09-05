# Reports and logs

Every run writes under `%USERPROFILE%\.windowsweep`, never inside the npm cache or the repository, so history
survives every `npx` invocation.

```text
%USERPROFILE%\.windowsweep\
  config.json                          the developer answer and default windows
  logs\windowsweep-<stamp>.log         one log per run, every action recorded
  reports\report-<stamp>.json          one canonical report per run (schema 1)
  reports\report-<stamp>.md|.html      exports, on demand
  reports\stale-builds-<stamp>.txt     section 17 candidate list (also in dry-run)
  reports\disk-usage-<stamp>.txt       section 21 output
  feedback\debug-bundle-<stamp>.zip    --debug-bundle
  feedback\crash-<stamp>.zip           written on an unexpected exit
```

`<stamp>` is `yyyy-MM-dd_HHmmss-<pid>`, so concurrent runs never share a file.

## The log

Plain text, one timestamped line per event: every path removed with its size, every path skipped as in use,
every refusal with its reason, every external command with its exit code, and a credit header naming the tool
version, mode, host, user, elevation and dry-run state. `--cleanup-logs` deletes this run's log at exit;
`--prune-history N` removes logs, reports and bundles older than N days.

## The JSON report

```json
{
  "schema_version": 1,
  "credits": { "tool": "windowsweep", "tool_version": "1.1.0", "author": { "name": "...", "email": "...", "website": "...", "linkedin": "..." } },
  "meta": { "started_at": "...", "finished_at": "...", "duration_seconds": 217, "host": "...", "user": "...",
            "os": "...", "powershell": "5.1.19041.7663", "mode": "all", "dry_run": false, "elevated": false,
            "developer_mode": true, "idle_days": 100, "temp_days": 3, "log_file": "...", "launcher": "node", "via_npx": true },
  "disk": { "before": [ { "drive": "C:", "size_bytes": 0, "free_bytes": 0 } ], "after": [ ] },
  "steps": [ { "n": 1, "section": 1, "title": "...", "status": "ran", "freed_bytes": 0, "note": "" } ],
  "totals": { "total_reclaimed_bytes": 0, "total_reclaimed_human": "0 B", "total_estimated_bytes": 0,
              "total_estimated_human": "0 B", "steps_run": 0, "steps_skipped": 0 }
}
```

`status` is one of `ran`, `dry-run`, `skipped`, `refused`, `failed`. In a dry-run the estimate lives in
`total_estimated_bytes` and `total_reclaimed_bytes` stays 0.

## Exports and history

```powershell
windowsweep --reports                # list, then: cm N | ch N | cb N | all | v N | o N | d N | q
windowsweep --export both latest     # Markdown + HTML next to the JSON
windowsweep --export html all
windowsweep --stats                  # runs, dry-runs, total reclaimed, latest report
windowsweep --json --all --yes       # one JSON line on stdout for scripts; human output on stderr
```

The HTML export is a single self-contained file that follows the system light/dark preference. No external
tool is needed for any conversion.

## Privacy

Logs and reports contain paths from your machine and a snapshot of cache sizes. Nothing is transmitted:
windowsweep makes no network calls. Review a bundle before attaching it to an issue.

Last Updated: 2026-09-03
