# FilesHub credential vaults — overview

## Purpose

Fetching a project's credentials instead of hunting them across a `.env`, four consoles and another machine.
FilesHub's management plane carries three read-only vaults — every project's third-party credentials and config
files, hosted Supabase project credentials, and the account-level Supabase access token.

It exists as its own skill for two reasons. **Discoverability:** the questions it answers ("where is this
project's Firebase config?", "how do I deploy this edge function?") arise while wiring a project up, and the
sibling management skill's triggers are about rotating keys, so it never fired. **Budget:** that skill's
`SKILL.md` had reached 1039 words against `validate-system.py`'s 1100-word hard cap, so the account vault
could not be added to it at all.

🔴 **The honesty note this skill was built around has INVERTED, and the skill is written for the new state.**
The Project Vault now holds stored credentials for **52 of 55 projects** — the 2026-08-20 seeding run took it
from 7 of 55, and the still-earlier "0 of 54" was itself measured through a broken read path. So the guidance
is now *read the vault first*, where it used to be *expect nothing and fall back*.

What survives the inversion is the reason the caveat existed: **"not entered" and "not applicable" produce
byte-identical responses**, so an empty service must still be reported as "nothing is stored", never as "this
project doesn't use it". That holds at 52 of 55 exactly as it did at 7.

## What this skill does

- Names which of the three vaults answers a given question, and the scope each one needs.
- Enforces `GET /token` as the first call, since four of the five scopes are off by default and only the owner
  can grant one — so a 403 is a pause, not a fallback to guessing.
- Separates the two Supabase credential planes: the **project** vault drives migrations, the **account**
  vault's `sbp_` PAT is the only thing that drives `functions deploy` / `secrets set` / `link`.
- Carries the `.env`-block contract that makes "no server secret in a `VITE_` var" structural rather than
  remembered — and the rule against hand-filtering the block that guarantees it.
- Distinguishes `undecryptable[]` ("re-enter it in Nova") from unset, and `has.*` from a value.
- Keeps revealed values out of transcripts, logs, commits and command lines.

## When it gets invoked

- "wire up this project" · "where are the credentials for X" · "what's the Firebase config here"
- "I need the service-account JSON / `google-services.json` / the keystore"
- "deploy the edge functions" · "run the migrations against hosted Supabase"
- About to ask the owner to paste a credential — check here first.
- A `/api/public/v1` call returns **403 `TOKEN_PERMISSION_DENIED`**, or a vault read comes back empty.
- Resuming an unfamiliar project and needing its third-party wiring.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | any project of the owner's that consumes a third-party service — every stack |
| Environment | server, CLI or agent only. The `fh_pat_` token is account-wide and the plane sends no CORS, so **never** a browser or a repo |
| Stack override | none — this is the owner's own platform, not a stack choice |

## Sources

| Source | Record |
|---|---|
| `fileshub-docs.zaions.com/management-api/{project-vault,supabase-projects,supabase-accounts}` + live probes | `_source-understanding/urls/fileshub-management-api.md` |
| The files-hub Laravel repo (registry, services, controllers) | `_source-understanding/projects/files-hub-platform.md` |

## Related skills

- `aoneahsan-cccs-fileshub-management-api` — the same plane's administration half: token families, envelope,
  scoping model, projects/keys/origins.
- `aoneahsan-cccs-fileshub` — consuming storage and email with the data-plane key.
- `aoneahsan-cccs-supabase` — what to do with the credentials once you hold them.
- `aoneahsan-cccs-project-understanding` — the context gate that routes here.
- `aoneahsan-cccs-ask-the-owner` — a missing scope or an unpopulated vault is an owner question.

## Maintenance

- **Living registry this skill points at:** `~/.claude/rules/fileshub-api.md`.
- **Volatile.** The plane is actively developed — three releases changed it between 2026-07-30 and 2026-08-01.
  Probe `/api/version` and re-read the rules KB rather than trusting a remembered contract.
- 🔴 **Re-check the empty-vault claim before repeating it.** Once the owner populates the vault in Nova, the
  central caveat in `SKILL.md` becomes wrong in the opposite direction. `GET /vault/projects` and count rows
  with a non-empty `configured_services`.
- **Last reviewed:** 2026-08-04 (created; live-verified against `2026.08.04.1`).
