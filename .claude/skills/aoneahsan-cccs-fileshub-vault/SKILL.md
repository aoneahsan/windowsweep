---
name: aoneahsan-cccs-fileshub-vault
description: 'The credential vaults on FilesHub''s management plane: a project''s third-party credentials and identifiers (Firebase, Google Cloud, Sentry, OneSignal, Turnstile, signing, store consoles, SMTP), the account-wide PUBLISHING tokens (npm, Hugging Face, Docker Hub, PyPI, extension stores, hosting), each machine''s Android debug keystore, and hosted Supabase credentials. Read, reveal and WRITE them. Use before asking the owner for any key, before an npm or package publish, or when seeding a project''s credentials.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/urls/fileshub-management-api.md + projects/files-hub-platform.md
---

# FilesHub credential vaults

Several vaults on `/api/public/v1/*`, authenticated with the account-wide `fh_pat_` token at
`~/.secrets/fileshub/management-access-token`.

**The standard:** check the vault before asking the owner for a credential — and report what it actually
returned, never what it was supposed to contain.

## 🔴 The vaults are POPULATED. Read the vault FIRST, for every project.

**This skill said the opposite until 2026-08-24, and acting on it wasted work.** Check the vault before a
console, a checkout or `~/.secrets/`. A few projects hold nothing and some fields are blank **by decision,
not oversight**; the counts, the seeding-run history and the blank-by-decision inventory are in
`references/vault-state-and-history.md`. 🔴 **`cloudflare` being blank says nothing about `turnstile`** —
separate services.

🔴 **An empty service means NOT ENTERED — never "this project doesn't use Firebase."** The skeleton is
identical either way; treat absence as unknown and say so in those words.
🔴 **Presence is not readiness** — read the specific `has.*` field the *next step* needs.
🔴 **Read `registered` and `unregistered_services[]` on every response** — a row under an undeclared
service is real but invisible everywhere else (ISSUE-09).
🔴 **Android signing fingerprints are NON-SECRET and need no reveal; a keystore FILE without its PASSWORD is an
unopenable blob** — read `references/vault-endpoints.md` → "Android signing fingerprints and keystores" first.

## Which vault answers which question

| Question | Call |
|---|---|
| What fields exist at all? | `GET /vault/services` — the registry, **no scope needed**. 🔴 Count services/fields off the response, never off a written number. |
| Which projects have anything? | `GET /vault/projects` — `configured_services` per row |
| What does this project have? | `GET /projects/{p}/vault` — `has.*` flags, no values |
| Give me the values | `POST /projects/{p}/vault/reveal` (add `/{service}` to narrow) |
| A stored config file itself | `GET /projects/{p}/vault-files/{service}.{key}` — 🔴 `vault-files/…`, never `vault/files/…` |
| **A token that PUBLISHES or DEPLOYS** — npm, HF, Docker, PyPI, a store, a host, an OTA release | `GET /developer-accounts` · `POST /developer-accounts/{account}/reveal` — own scope `can_read_developer_accounts` |
| A build machine's Android debug fingerprints | `GET /debug-keystores` — non-secret, no reveal needed |

🔴 A reveal response's `env.*` lines contain credential values. Read only the single field needed for the
current step, directly into its protected destination; never print, log or dump the enclosing `env` object.

🔴 **`configured_services` is not "someone entered data"** — it includes the DERIVED `fileshub` service,
true for ~50 of 55 projects. A sweep skipping "already configured" projects skips every one. Subtract it.

## The scope gate — `GET /token` first, always

`can_read_vault` presence flags · `can_reveal_vault` values + `.env` + file bytes (implies read) ·
`can_write_vault` create/change/delete (implies read, **not** reveal) · `can_read_ai_accounts` AI keys ·
`can_manage_supabase` the project vault · `can_read_supabase_tokens` the account vault.
🔴 **Neither `can_reveal_vault` nor `can_manage_supabase` implies the two it sits beside** — AI keys and the
Supabase PAT each need their own.

Missing scope → **403**, out-of-scope project → **404**; a 403 is an `aoneahsan-cccs-ask-the-owner` pause
(`references/vault-endpoints.md` → "Scope refusals").

## Writing — `can_write_vault`

Seven routes — the list is in `references/vault-endpoints.md`. **Absent key = leave alone, explicit `null`
= delete.** `POST /projects/{p}/vault` writes many services in ONE transaction — the seeding call. Every write returns the whole read payload plus `changes`, so you confirm what landed **without**
`can_reveal_vault`.

🔴 **You cannot mark a declared field public** — the registry decides `is_secret`. A `secrets` map counts only on freeform `general`, absent defaulting to secret.
🔴 **A free-text service name is refused on create** (`422 UNKNOWN_VAULT_SERVICE`); an existing orphan stays deletable and movable.
🔴 **`fileshub` is DERIVED and `supabase` is a LINK; both refuse writes.** Read `writable`/`derived` from `GET /vault/services`, not from a 422.
🔴 **Never upload a file whose FILENAME encodes a secret** — `filename` is plaintext beside the encrypted
value.

## 🔴 The vault is also the BACKUP of `~/.secrets` — owner directive 2026-09-16

Mirror every machine credential into its project's vault **the day it is created**. 🔴 **A write you have not
read back is not a backup.** 🔴 **Never restrict a file type**, never encode a secret in a filename or key. 🔴
**Machine-wide secrets go to project `global-secrets`** (id 62). Read `references/vault-endpoints.md` → "Backup of
~/.secrets" before a backup run.

## AI keys live on ACCOUNTS, not in a project's vault

🔴 **`can_reveal_vault` does NOT reach an `ai_accounts` key**; 🔴 clearing is `clear_api_key: true`, never blank; 🔴
`all_projects` is standing, `all_existing` a snapshot. Read `references/vault-endpoints.md` → "AI keys on
accounts" before touching one.

## 🔴 PUBLISHING TOKENS LIVE ON `developer_accounts` — CHECK BEFORE ANY PUBLISH (`2026.09.01.1`)

**Publishing tokens (npm, Hugging Face, Docker Hub, PyPI, extension stores, hosting — 22 providers) live on
`developer_accounts`**, account-level, behind its own scope **`can_read_developer_accounts`** — 🔴 nothing
else implies it, not even `can_reveal_vault`. 🔴 **A reveal returns `config_files` — the finished `.npmrc`
line: write what you are given, never re-derive the format.** 🔴 **`~/.secrets/npm/` DOES NOT EXIST** —
repopulate `~/.npmrc` from the vault, then check `npm whoami`. Providers, fields, endpoints and the format
refusal (422 `INVALID_DEVELOPER_ACCOUNT_CREDENTIAL`): `references/vault-endpoints.md`.

## Other services — the bans that hold without the reference

- **Turnstile** is service **`turnstile`**, 🔴 **not part of `cloudflare`**; FilesHub verifies it, so no Worker.
- **Supabase**: migrations need the **project** vault; `functions deploy` / `secrets set` / `link` need the
  account `sbp_` PAT. 🔴 Four traps live in the reference.
- **Test events + Google OAuth keep-alive**: 🔴 per-project switches, default OFF; `is_client_project` outranks them.
- 🔴 **Use the `.env` block you are given**; 🔴 **`undecryptable[]` is not absence.**

Read `references/vault-endpoints.md` → "Other services — the bans in full" before using any of these.

## References and related skills

`references/vault-endpoints.md` (endpoints, payloads, curl) · `references/vault-state-and-history.md` (the
forensics behind every 🔴 above — ISSUE-08/09/10 and why each rule exists) ·
`aoneahsan-cccs-fileshub-management-api` · `-fileshub` · `-supabase` · `-project-understanding` ·
`-ask-the-owner` (a missing scope is a pause, not a workaround).

<!-- Living registry (link, never copy): ~/.claude/rules/fileshub-api.md -->
