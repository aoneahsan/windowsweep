# `docs/story/run-state.json` — the contract the hooks read

One small JSON file per project, rewritten at every transition by the main session (or by the bible-keeper
when its dispatch says `Tracker ownership: yes` — never both in one wave). It is machine state, not a
record: the prose record is `decision-log.md`. Template: `aoneahsan-cccs-story-bible` →
`assets/run-state.template.json`.

## Schema (`story-run-state/1`)

```json
{
  "schema": "story-run-state/1",
  "project": "steady-habits",
  "bibleApproved": true,
  "surface": "onboarding",
  "phase": "review",
  "status": "disputed",
  "round": 2,
  "gate": null,
  "openDecisions": ["Is the 3-day gentle reminder on by default? (writer, round 1)"],
  "approvedAt": null,
  "escalatedAt": null,
  "registryUpdatedAt": "2026-08-27T10:12:00Z",
  "updatedAt": "2026-08-27T11:40:00Z",
  "history": [
    {"at": "2026-08-27T10:12:00Z", "phase": "bible", "status": "approved", "note": "GATE 1 yes"},
    {"at": "2026-08-27T11:40:00Z", "phase": "review", "status": "disputed", "note": "dev-editor vs hook-engagement on the opening line"}
  ]
}
```

| Field | Values | Meaning |
|---|---|---|
| `bibleApproved` | boolean | GATE 1 answered yes; false blocks every write |
| `surface` | string or null | the surface this run is about; null between runs |
| `phase` | `discover` · `bible` · `map` · `write` · `review` · `finalize` · `record` · `idle` | where the run is |
| `status` | `draft` · `awaiting-approval` · `approved` · `in-progress` · `disputed` · `needs-decision` · `finalized` · `recorded` | the state inside the phase |
| `round` | 0, 1, 2 | review rounds completed for this surface |
| `gate` | null · 1 · 2 · 3 · 4 | the gate currently waiting for the owner |
| `openDecisions` | string[] | `NEEDS DECISION` lines not yet answered — must be empty before the turn ends |
| `approvedAt` | ISO or null | GATE 4 timestamp for this surface |
| `escalatedAt` | ISO or null | GATE 3 raised (both positions logged) |
| `registryUpdatedAt` | ISO or null | last time the keeper wrote the registry entry |
| `history` | array | append-only; the last entry is what the SessionStart banner prints |

## Transitions

| From | Event | To |
|---|---|---|
| (none) | `/story-init` starts | `discover` / `in-progress` |
| `discover` | Bible drafted | `bible` / `awaiting-approval`, `gate: 1` |
| `bible` | GATE 1 yes | `map` / `in-progress`, `bibleApproved: true` |
| `map` | rows drafted | `map` / `awaiting-approval`, `gate: 2` |
| `map` | GATE 2 yes | `idle` / `approved` |
| `idle` | `/story-write <surface>` | `write` / `in-progress`, `round: 0` |
| `write` | draft returned with NEEDS DECISION | `write` / `needs-decision`, `openDecisions` filled |
| `write` | draft clean | `review` / `in-progress` |
| `review` | keeper: agreed | `finalize` / `in-progress` |
| `review` | keeper: disagreement, round < 2 | `review` / `in-progress`, `round + 1` |
| `review` | keeper: disagreement, round = 2 | `review` / `disputed`, `escalatedAt` set once the owner is asked, `gate: 3` |
| `finalize` | finalizer done | `finalize` / `awaiting-approval`, `gate: 4` |
| `finalize` | GATE 4 yes | `finalize` / `approved`, `approvedAt` set |
| `finalize` | keeper recorded Bible + log + registry | `record` / `recorded`, `registryUpdatedAt` set, then `idle` |

## What the hooks do with it

- `session-start-story.sh` prints one banner: project, `bibleApproved`, surface, phase, round, the count of
  `openDecisions`, and the next command.
- `stop-story-gate.sh` refuses to end the turn (exit 2, once per distinct state per session) when:
  `status = disputed` and `round ≥ 2` and `escalatedAt` is null → "GATE 3: write both positions, ask";
  `status = needs-decision` or `openDecisions` non-empty → "surface the decision via AskUserQuestion";
  `phase = finalize`, `status = approved`, and `registryUpdatedAt` is null or older than `approvedAt` →
  "record: Bible, decision log, registry".
- A malformed file is ignored by both hooks (fail open) — so a run that cannot be parsed is a run the
  gate cannot protect; keep the file valid.
