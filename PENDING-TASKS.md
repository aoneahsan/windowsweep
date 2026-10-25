# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-28 (latest: TASK-023 closed as DONE-023 - a development build reports no analytics (D54), so no task is open. Earlier the same day: TASK-023 filed from the 1.3.2 proofs - a development build reports its analytics too; TASK-020 closed as DONE-020 with desktop-v1.3.2, and DONE-021 (the desktop sign-in) and DONE-022 (empty run folders) recorded beside it in docs/DONE-TASKS.md. Earlier 2026-09-26: TASK-020 filed from the `desktop-v1.3.1` updater proof - the desktop window's CSP blocks Clarity - and its fix chosen by the owner the same day, D52: widen the CSP. Earlier the same day: TASK-019 closed as DONE-019 - the three `desktop/scripts/*.mjs` generators became Vite plugins in `desktop/vite/`, and the tag run proved it. Earlier 2026-09-25: TASK-017 closed as DONE-018 - applied on D48 and verified both ways. Earlier: TASK-018 closed to `docs/DONE-TASKS.md` as DONE-017 - no new words were needed. Earlier: TASK-019 filed - the three `desktop/scripts/*.mjs` generators, found while preparing D37's desktop half. Earlier: TASK-013 closed to `docs/DONE-TASKS.md` as DONE-016 after its live verification; TASK-017 filed from RW-116: the admin's browser writes the handled fields; TASK-018 filed from TASK-013's run: the zero-count History header. Earlier 2026-09-17: TASK-014, TASK-015 and TASK-016 closed to `docs/DONE-TASKS.md` as DONE-013, DONE-014 and DONE-015 by the v4 run. TASK-013 is the only one left open, and it is blocked on owner row 15 - Google sign-in was re-probed on 2026-09-17 and still reads false)

No task is open (2026-09-28).

### TASK-024 — AI: account 3 via the hourly lease, the cheapest paid fallback, and economy in a grant's last 24 h

<!-- fleet:ai-cheapest-fallback-v1 -->
- **Source:** owner, 2026-10-25 (LifeWell OD-115): *"when we do not have usable credits we use most lowest model … so we
  will ensure longest use value from paid plans … go to lowest automatically when it's like 24h remaining with remaining
  credits"*; *"credits added in fileshub … ai-accounts/3 … enabled it for "all projects" so use that for all projects"*.
  Standard: `aoneahsan-cccs-fileshub-ai` → `references/fallback-and-expiry.md` — never ask the owner these again.
- **Applies when:** the project calls an AI model (now, or when it adds AI). No AI → close it as not applicable, one line why.
- **LEFT:** (1) free credit through FilesHub's hourly lease (`POST …/ai/lease`; account 3 serves all projects; the call
  ledger) — still on `GET …/ai/route`? move it (`ai-credit-lease` tracker); (2) cap every call at economy when
  `credits.expires_at` is within 24 h (pure function + test watched failing); (3) the paid fallback on the cheapest live
  model from the secret `<PROVIDER>_FALLBACK_MODEL` — today `gpt-6-luna` ($0.10/$0.50) or `claude-haiku-5-5`, checked
  with `GET /v1/models`, reasoning-model request shape, unset = pause; (4) one live call proving each path.
- **Reference:** LifeWell `supabase/functions/_shared/{ai-broker,ai-lease,ai-ledger,ai-lease-math,ai-openai-shape}.ts`.
  Platform half: FilesHub TASK-010.
- **Priority:** high · **Added:** 2026-10-25 · **Close:** rename `DONE-`, move to `docs/DONE-TASKS.md`; tracker row
  `done` (`~/Documents/01-code/docs/tracking/ai-cheapest-fallback-tracker.json`); one line in root CLAUDE.md + AGENTS.md.
