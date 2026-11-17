# Reveal envelope mechanics

> Moved out of `SKILL.md` on 2026-09-04 for the word cap. Verbatim.

- 🔴 **Use the `.env` block you are given; never hand-filter one.** `vite`/`next` carry only `client_safe`
  fields and a `secret` is forced non-client-safe. **Empty blocks are dropped**, so `env: {}` is normal.
- **`undecryptable[]`** = value exists, could not be decrypted (rotated `APP_KEY`): `has` stays `true`,
  value `null`. That means *re-enter it in Nova*, not *unset*.
- **Every reveal is recorded** and stamps `last_revealed_at`. Reveal deliberately.
- 🔴 **Not `vault_secrets` on the DATA plane (`/api/v1/vault*`)** — same word, different plane, opposite
  direction: consumer apps *write* that one with their own `fh_live_` key.
- 🔴 **Never echo a revealed value** into a transcript, log, commit or command line. A composed `db_url_*`
  may still carry the literal `[YOUR-PASSWORD]` on a row nobody re-saved — substitute the real password,
  percent-encoded, or you get `28P01` and blame the vault.

---

# Publishing credentials — `developer_accounts`

> Moved out of `SKILL.md` on 2026-09-04 to bring its body under the 1,100-word cap. Verbatim.

**The npm token is here**, with Hugging Face, Docker Hub, PyPI and 18 more
(`GET /developer-accounts/providers`). Own scope **`can_read_developer_accounts`** — 🔴 nothing else implies
it, not even `can_reveal_vault`. 🔴 **A reveal returns `config_files`: the finished `.npmrc` line — write
what you are given.** 🔴 **`~/.secrets/npm/` does not exist**; repopulate from the vault, verify with
`npm whoami`. 🔴 **`native_update` (`2026.09.04.1`, live 2026-09-05) is here too — the account-wide `nu_pat_`.**
⚠️ *Corrected:* an earlier version of this line said `~/.secrets/native-update/` does not exist. **It does** —
`management-access-token` was verified present 2026-09-04; the rule that claim came from was true for part of
that day and stopped being true the same day. **And the vault RECORD is not populated yet**, so `~/.secrets/`
is currently the only copy. Its vault twin holds the per-app `nu_app_` DEVICE key; sending the
wrong family fails on format, months later, looking like a revoked token. 🔴 **A write can be refused on
FORMAT — 422 `INVALID_DEVELOPER_ACCOUNT_CREDENTIAL`**, on both planes since that release. Everything else —
the recipe, the write rules, the seven names that collide with vault services:
`references/vault-endpoints.md`.

---

# Vault endpoints, payloads and recipes

Base `https://fileshub.zaions.com/api/public/v1` · `Authorization: Bearer fh_pat_…` · rate limit 120/min ·
envelope `{"data": …}` / `{"error": {"code","message","details?"}}` / lists `{data, meta, message}`.

> Read routes live-verified through `backend_version: 2026.08.04.2`; the WRITE routes ship in
> **`2026.08.20.1`** — probe `GET /api/version` before using them. The docs-site `openapi.json` is
> **hand-maintained**, so the live plane outranks it. Living registry: `~/.claude/rules/fileshub-api.md`.

## The 13 READ routes

| Route | Scope | Returns |
|---|---|---|
| `GET /vault/services` | **none** (any valid token) | the registry — **22 services, 102 fields** (probed live 2026-08-31; **103** once `play_console.encrypted_private_key_pepk`, the `.pepk` Play export, deploys). 🔴 Any count written down is a date-stamped observation, not a fact — the registry is `config/vault/*.php`, so it changes with a config-only release and a stale number here reads exactly like a failed `config:cache`. Count them off the response, each with `label`, `type` (`text`\|`textarea`\|`url`\|`file`), `secret`, `client_safe`, `env_key` |
| `GET /vault/projects` | `can_read_vault` | paginated summaries + `configured_services[]`; `?q=` name/slug/app_identifier, `?status=` |
| `GET /projects/{p}/vault` | `can_read_vault` | detail — non-secret values + `has.*`, never a secret |
| `GET /projects/{p}/vault/{service}` | `can_read_vault` | one service; unknown service → 404 naming the valid keys |
| `POST /projects/{p}/vault/reveal` | `can_reveal_vault` | detail **plus** `env` and `undecryptable[]` |
| `POST /projects/{p}/vault/{service}/reveal` | `can_reveal_vault` | one service's values |
| `GET /projects/{p}/vault-files/{file}` | `can_reveal_vault` | raw bytes; `{file}` = `service.key` |
| `GET /supabase-projects` · `GET /{idOrRef}` · `POST /{idOrRef}/reveal` | `can_manage_supabase` | hosted project credentials |
| `GET /supabase-accounts` · `GET /{idOrEmail}` · `POST /{idOrEmail}/reveal` | `can_read_supabase_tokens` | the `sbp_` PAT |

## The 7 WRITE routes (`can_write_vault`, since `2026.08.20.1`)

| Route | Body | Notes |
|---|---|---|
| `PUT /projects/{p}/vault/{service}` | `{"values":{…},"secrets":{…}}` | Partial. **Absent key = leave alone; explicit `null` = DELETE that field.** `secrets` counts only on `general` |
| `POST /projects/{p}/vault` | `{"services":{…},"secrets":{…},"links":[…]}` | Many services in ONE transaction — the seeding call. `links` absent = untouched, `[]` = cleared |
| `DELETE /projects/{p}/vault/{service}` | `{"confirm":true}` | Clears the service. Accepts an **unregistered** service, which is how an orphan is removed |
| `POST /projects/{p}/vault-move` | `{"from","to","keys":{}}` | `from` may be unregistered, `to` may not. Validated whole before any write |
| `POST /projects/{p}/vault-files/{service}.{key}` | multipart `file` **or** `{"filename","content_base64"}` | Cap applies to DECODED bytes; base64 decoded strictly |
| `DELETE /projects/{p}/vault-files/{service}.{key}` | — | |
| `PUT /projects/{p}/links` | `{"links":[{"type","url","label?","notes?","sort_order?"}]}` | Full replace |

Every write returns the **whole read payload + `changes`** (`{created,updated,deleted}`, field names only),
so you verify without a second call and **without `can_reveal_vault`**.

**Refusals worth knowing before you call:** `422 UNKNOWN_VAULT_SERVICE` (free-text name on create) ·
`422 UNKNOWN_VAULT_FIELD` · `422 VAULT_FIELD_IS_A_FILE` / `VAULT_FIELD_IS_NOT_A_FILE` ·
`422 VAULT_SERVICE_NOT_WRITABLE` with `details.reason` `linked` (`supabase`) or `derived` (`fileshub`) ·
`422 CONFIRMATION_REQUIRED` · `409 PLAINTEXT_UNAVAILABLE` on a move whose source cannot be decrypted ·
`403 TOKEN_PERMISSION_DENIED` with `details.required_scope: can_write_vault`.

### Retiring the six live orphans

```bash
curl -X POST "$BASE/projects/<slug>/vault-move" -H "Authorization: Bearer $TOK" \
  -H 'Content-Type: application/json' -d '{
    "from":"google cloud firebase","to":"google_cloud",
    "keys":{"<slug>-client-id":"oauth_web_client_id",
            "<slug>-client-secret":"oauth_web_client_secret"}}'
```

`labflow` · `habitforge` · `lifewell` · `trizlink` · `aoneahsan-portfolio` · `clearhire`.

`{p}` resolves by numeric id, ULID `public_id`, or slug. `{idOrRef}` = id or the `<ref>` of
`<ref>.supabase.co`. `{idOrEmail}` = id or login email, matched case-insensitively.

## Cloudflare Turnstile — the one vault credential FilesHub SPENDS (`2026.08.24.1`)

Vault service **`turnstile`** (writable, not derived): `site_key` (client-safe, `TURNSTILE_SITE_KEY`),
`secret_key` (**secret**, `TURNSTILE_SECRET_KEY`), `widget_name`, `widget_mode`, `hostnames`,
`expected_action`. 🔴 **Separate from `cloudflare`** — Turnstile needs no API token, zone or R2, so merging
them would make `configured_services` report a Cloudflare account that does not exist.

`POST /api/v1/turnstile/verify` is on the **DATA plane** (app `fh_live_` key, `X-API-Key`, permission
`turnstile`, scoped `read`) — not this management plane. Body: `token` (or `response`, Cloudflare's own name,
accepted as an alias), optional `remoteip`, `idempotency_key`, `action`.

| Outcome | Status |
|---|---|
| Cloudflare answered — visitor passed / failed | **200**, `success: true` / `false` |
| No `secret_key` stored | **409** `status: "not_configured"` |
| Stored but undecryptable | **409** `status: "unreadable"` |
| Bad input | **422** |
| Cloudflare unreachable / unreadable | **502** `status: "upstream_failed"` |

🔴 **A failed challenge is a 200.** Branch on `success` for the verdict and on the STATUS for whether the
verdict means anything; an integration that cannot tell them apart rejects every real visitor during an
outage. 🔴 The two 409s are distinct because the fixes are: *store one* vs *re-enter it*.
⚠️ `expected_action` mismatch → `success: false` with **`fileshub-action-mismatch`**, our code not
Cloudflare's — hence the prefix. ⚠️ `remoteip` is forwarded only when supplied: from a proxying backend your
own IP is the server's, and the wrong one fails a challenge the visitor passed. Rate limit 60/min per key.

## AI accounts (`2026.08.21.1`)

| Route | Scope | Notes |
|---|---|---|
| `GET /ai-accounts` · `GET /ai-accounts/{a}` | `can_read_ai_accounts` | `{a}` = id, email, or `provider:email` |
| `POST /ai-accounts/{a}/reveal` | `can_read_ai_accounts` | the key + `env.node`. **Never** a `vite`/`next` block |
| `POST /ai-accounts` · `PATCH /ai-accounts/{a}` | `can_write_vault` | blank `api_key` is IGNORED; use `clear_api_key: true` |
| `GET\|PUT /projects/{p}/ai-accounts` | `can_write_vault` (PUT) / vault read (GET) | assign — a **pointer**, never a key |
| `GET\|PUT /ai-accounts/{a}/projects` | `can_write_vault` (PUT) / vault read (GET) | the INVERSE: one account → many projects. `{"project_ids":[…]}` replaces (`[]` detaches); `{"all_existing":true}` snapshots today's projects. 🔴 Both together = **422** |

🔴 **`can_reveal_vault` does NOT grant an AI key.** It is the strongest grant over *project* credentials and
🔴 **Two ways to make one account serve everything, and they differ.** `PATCH /ai-accounts/{a}
{"all_projects": true}` is a **standing rule** — every project, including ones created later. `PUT
/ai-accounts/{a}/projects {"all_existing": true}` is a **snapshot** of what exists now and covers no future
project. Each resolved entry reports `via: explicit | all_projects`, which tells you where to undo it: an
`all_projects` entry detaches from the *account*, never from the project. 🔴 Do not confuse either with
`access_tokens.all_projects` — that is which projects the **caller** may reach, and an account flagged for
every project never widens a scoped token.

still 403s on every `/ai-accounts` route — it exists to read one project's config, not to hand out billing
for a whole provider account.

⚠️ `openai` remains a declared vault service, superseded. The lift migration was **additive**, so a project
may show BOTH an `openai.*` row and an assigned account. Prefer the account; the row is a leftover the owner
deletes when he is ready.

## Payload shapes (verified)

**Project vault detail** — `id, public_id, name, slug, status, notes, description, app_identifier,
primary_url, repo, platforms, tech_stack, links, services, files, supabase, configured_services,
**unregistered_services**, created_at, last_revealed_at`. Reveal adds `env` and `undecryptable`. Each entry in
`services` is `{label, registered, has, values}` — and **all 18 registry services are always present**,
configured or not, **plus one entry for every service this project stores rows under that the registry does
not declare** (`registered: false`).

🔴 **`has` and `values` are MAPS. Empty ones encode as `{}` from `2026.08.19.1`; before that they were `[]`**
— which is what an empty PHP array serializes to, and it appeared exactly when a project held nothing. A
typed client reading `has.project_id` broke on it.

**`env` block keys** — `vite` · `next` · `node` · `laravel`. A line is emitted only when the field declares an
`env_key`, is not a file, and holds a readable non-blank value; `vite`/`next` additionally filter to
`client_safe`. **Empty blocks are dropped entirely**, so an unconfigured project returns `env: {}`.

**Vault file download** headers: `Content-Type`, `Content-Disposition`, `Content-Length`,
**`X-Checksum-Sha256`**. Undecryptable → 409 `PLAINTEXT_UNAVAILABLE`; a malformed `{file}` → 422
`VALIDATION_FAILED`.

**Supabase project reveal** — `endpoints.{api,rest,auth,storage,graphql,functions,realtime,`**`jwks`**`,dashboard}` ·
`config.{publishable_key,legacy_anon_key,`**`jwt.{signing_key_id,signing_algorithm,public_jwk}`**`,database.{host,port,database,user},storage_s3.*}` ·
`secrets.*` · eight `has.*` flags (`service_key`, `legacy_service_role_key`, `jwt_secret`, `db_password`,
`db_url_direct`, `db_url_session_pooler`, `db_url_transaction_pooler`, `s3_secret_access_key`) ·
`keepalive.{`**`enabled`**`,last_run_at,last_status}` · and an `account` pointer `{id, email, label,
has_personal_access_token, credentials_via, requires_scope}`. 🔴 **No `access_token` field, by design.**

**Added in `2026.08.23.1`** (deployed, probed 2026-08-24):

- **`keepalive.enabled`** — a DIFFERENT question from `is_active`. `is_active` says the registration is live
  and drives `?active=`; `enabled` says FilesHub may **write** to that database (the keep-alive inserts,
  counts and prunes). A **client** project is `active=1, keepalive=0`. 🔴 **A `last_status` that never moves
  is not a broken project when `enabled` is false** — a skip records no run row at all. List filter:
  **`?keepalive=true|false`**, mirroring `?active=`.
- **`endpoints.jwks`** — derived like every other endpoint, `<url>/auth/v1/.well-known/jwks.json`. 🔴 **Verify
  tokens against it, not against a stored copy**: it is the self-updating answer to which keys are valid now,
  and a stored copy goes stale silently on the first rotation outside FilesHub.
- **`config.jwt`** — `{signing_key_id, signing_algorithm, public_jwk}`, Supabase's current per-project
  asymmetric keys superseding the shared `jwt_secret`. **All three are NON-secret**, so the `has` map is
  unchanged; a signing key's public half is served unauthenticated from the JWKS endpoint anyway. All three
  read `null` until someone records them, which is "not recorded", not "not migrated".

**Supabase account** list rows — `id, email, label, organization, is_active, has.personal_access_token,
projects_count, last_revealed_at, created_at`. Detail adds `dashboard.{account,tokens,organizations}`, `notes`
and `projects[]` (each `{id, name, ref, url, is_active, credentials_via}`). Reveal adds
`secrets.personal_access_token` and **`env.cli`**.

⚠️ The list reports `projects_count` but omits `projects[]` — only detail and reveal carry the array. Counting
a missing array as zero misreads a populated account as empty.

## Recipes

🔴 **Check the file's SHAPE before reading it — `~/.secrets/` holds both kinds.** Some entries are a bare
string; others are a small **markdown record** (heading, provenance, then the value). Measured on this machine
2026-08-13: `fileshub/management-access-token` is **12 lines**, `fileshub/callvault-api-key` is **4**, and
`fileshub/custos-api-key` is **1**. So neither `cat` nor extraction is universally right — but extraction is
right for **both**, which is why every recipe here uses it.

`TOKEN="$(cat …)"` against a record sends the whole document as the bearer value and returns **401** — which
reads as a revoked or mistyped token and sends you to Nova to fix something that was never broken. Measured:
`cat` → **401**, the `grep -oE` form below → **200**.

🔴 **Match the character class to the token's documented format.** `fh_pat_` is a flat 64-char suffix, so
`fh_pat_[A-Za-z0-9]+` is complete. **`nu_pat_` is `nu_pat_{64hex}_{crc32}`** — it contains an underscore, so
the same class silently truncates it to 71 of 80 characters and the backend answers `401
INVALID_ACCESS_TOKEN_FORMAT`: the identical misdiagnosis, reintroduced by the fix. Use
`nu_pat_[A-Za-z0-9_]+` there.

```bash
TOKEN="$(grep -oE 'fh_pat_[A-Za-z0-9]+' ~/.secrets/fileshub/management-access-token | head -1)"
B=https://fileshub.zaions.com/api/public/v1
H() { curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$@"; }

# 0) scopes first — four of five are off by default
H "$B/token"

# 1) what fields exist? (no scope needed) — read this before guessing a field name
H "$B/vault/services"

# 2) what does this project actually have? has.* flags only, no values
H "$B/projects/<idOrSlug>/vault"

# 3) values + ready-to-paste env blocks. NEVER echo the response; write it where it belongs
H -X POST "$B/projects/<idOrSlug>/vault/reveal" > .env.fromvault   # then move the block you need
H -X POST "$B/projects/<idOrSlug>/vault/firebase/reveal"           # narrowed to one service

# 4) the file itself — verify the checksum the response advertises
H -D /tmp/h.txt "$B/projects/<idOrSlug>/vault-files/firebase.google_services_json" -o google-services.json
grep -i x-checksum-sha256 /tmp/h.txt; shasum -a 256 google-services.json

# 5) hosted Supabase: migrations need the project vault…
H -X POST "$B/supabase-projects/<ref>/reveal"
# …and functions/secrets/link need the ACCOUNT PAT. Feed it via env, never a --flag (process list)
export SUPABASE_ACCESS_TOKEN="$(H -X POST "$B/supabase-accounts/<idOrEmail>/reveal" \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["secrets"]["personal_access_token"])')"
supabase functions deploy <name> --project-ref <ref>
```

## Traps

🔴 **A credential could be STORED and UNREPORTABLE before `2026.08.19.1` — the vault's worst trap.** Every
read path iterated the *registry* rather than the project's rows, so a value entered under a `service` string
outside the 18 keys (Nova's standalone `Service` field was free text, so `Google Cloud` instead of
`google_cloud` was accepted and stored) was absent from `has`, `configured_services`, `values` **and**
`reveal` — three clean 200s over live credentials. A row under a real service but an undeclared key surfaced
only in a full reveal. ✅ Fixed both ends in `2026.08.19.1` (files-hub ISSUE-09): presence is declared fields
∪ every stored row, service blocks carry `registered`, `unregistered_services[]` names orphans, and the Nova
field is a validated `Select`. **On an older deploy, never report a vault as empty without saying which
marker you probed.**

🔴 **The `supabase` field on a Project Vault payload is `null` for every project** — verified 2026-08-06
against callvault, custos, polymath and trialith, three of which *do* own a registered Supabase project, and
still true on 2026-08-19. It is null because **nothing has been linked yet**, not because the platform cannot
answer: `projects.supabase_project_id` exists, and since `2026.08.19.1` it is **writable** —
`PATCH /api/public/v1/projects/{project} {"supabase_project_id": <id>}` (needs `can_manage_supabase`, and the
target must be one the token could already see). **Never read `supabase: null` as "this app has no
Supabase"** — resolve the ref (order in `aoneahsan-cccs-supabase`) and then **write it back**, so the next
session reads a fact instead of re-deriving one.

✅ **Project scope now constrains BOTH Supabase vaults** (`2026.08.19.1`, ISSUE-08) — an `all_projects` token
is unchanged, a scoped token sees the Supabase projects **linked from a FilesHub project it can manage plus
every unlinked row**, and out-of-scope answers 404. Accounts are filtered the same way;
`can_read_supabase_tokens` is still required, a second gate rather than an alternative. ⚠️ **Unlinked rows
remain visible until they are linked** — that is what makes the link write above worth doing.

🔴 **The historical behaviour, on any deploy before `2026.08.19.1`.** Proven live 2026-08-04 with an
eight-token matrix:

| Token | `GET /projects` | `GET /supabase-projects` | reveal |
|---|---|---|---|
| `projects:[2fa-studio]`, `can_manage_supabase` | 1 (scoped ✅) | **6** (unscoped) | **200** — returned *clearhire's* `api`/`database`/`storage_s3` secrets |
| `projects:[]`, `can_read_supabase_tokens` | 0 | — | **200** on the account `sbp_` PAT |
| `projects:[]`, `can_reveal_vault` | 0 | — | Project Vault: **0** rows, `404` on a specific project ✅ |

The Project Vault resolved through `PublicApiController::resolveProject()` → `$token->projectsQuery()`, while
`supabase_projects` had **no relation to `projects`** — so there was nothing to scope by. `SupabaseProject::projects()`
now supplies it and `App\Support\SupabaseProjectScope` is the single definition, read by the vault reads
*and* by the link write. Against an older deploy, still treat `can_manage_supabase` and
`can_read_supabase_tokens` as **whole-vault** grants.

⚠️ **`supabase_projects.account_email` is legacy free text and has disagreed with the FK in production**
(row 10 `trizlink`; files-hub ISSUE-10). **Act on `account.email`.** A PAT for the wrong account answers 403
on `functions deploy` while every presence flag reads true — which reads as a broken CLI, not a wrong account.
Since `2026.08.19.1` the top-level `account_email` is derived from the FK and
`account.legacy_account_email_conflict` flags a stale row.

✅ Nova converts and labels its configured operator timezone since `2026.08.04.2` (ISSUE-07 resolved), while
storage/API remain UTC. Old stored instants are not rewritten; re-save a pre-fix value to change its instant.

| Trap | Consequence |
|---|---|
| Reading an empty service as "not applicable" | You conclude a project has no Firebase when nobody entered it. Read `has.*`; absence is unknown |
| Hand-filtering an `env` block | You leak a server secret into a `VITE_` var, undoing the one guarantee the generator provides |
| `vault/files/…` | 404 — the path is `vault-files/…`; the other shape was ambiguous with `vault/{service}/reveal` and was renamed before shipping |
| Using a stored `db_url_*` as-is | Its password segment is the literal `[YOUR-PASSWORD]`; substitute `secrets.database.password`, **percent-encoded**, or `db push` dies with `28P01` and looks like a stale vault entry |
| `db.<ref>.supabase.co` from an IPv4 network | Does not resolve — direct connection is IPv6-only. Use the **session pooler** (`aws-0-<region>.pooler.supabase.com:5432`, user `postgres.<ref>`) for migrations |
| Treating a 403 as a data problem | It is a scope problem, and only the owner can grant a scope in Nova |
| Treating a 404 as "deleted" | Out-of-scope projects 404 by design (anti-enumeration). Check `GET /token` first |
| Echoing a reveal into the transcript | Publishes a live credential. Pipe it; never print it |


## Moved out of SKILL.md on 2026-08-31 for the 1,100-word body cap

Nothing here is new law — it is the full text of two blocks the skill body now points at. The house rule is
that depth moves to a sub-file and the pointer stays; a clause is never dropped to fit a budget.

### ~~The REPEATABLE service~~ — WITHDRAWN in `2026.08.31.2`, superseded by /debug-keystores below

> Kept so a reader who saw `android_debug_keys` in a payload or a 422 knows where it went. It existed for
> one day; zero projects ever held a row.

🔴 **One service is REPEATABLE and an empty `fields` list does NOT mean "nothing can be stored here."**
`android_debug_keys` (since `2026.08.31.1`) holds one entry per build machine, keyed `<machine>.sha1` /
`<machine>.sha256`, because Android generates a debug keystore per machine. Read **`repeatable`**,
**`entry_key_format`** (`<machine>.<sha1|sha256>`) and **`entry_fields`** instead — a write to a key that
does not match answers **422 `UNKNOWN_VAULT_FIELD`** with `details.entry_key_format`, and stores nothing.
Reads of that service also carry **`entries`**, the same values grouped by machine.
🔴 **A project has THREE Android signing fingerprints and they are different keys** — Play App Signing
(`play_console.app_signing_{sha1,sha256}`), the upload keystore (`capacitor.upload_{sha1,sha256}`) and each
machine's debug key. All are declared **non-secret**, so `assetlinks.json` and an OAuth Android client can
be filled from an ordinary read with **no reveal**. Confusing them is the usual cause of a silent App-Links
or Google-sign-in failure that reads like an app bug.

### Cloudflare Turnstile — stored here, and VERIFIED here (`2026.08.24.1`)

Service **`turnstile`**: `site_key` (client-safe), `secret_key` (the only secret), `widget_name`,
`widget_mode`, `hostnames`, `expected_action`. 🔴 **Not part of `cloudflare`** — it needs no API token,
zone or R2.

🔴 **`POST /api/v1/turnstile/verify` spends the stored secret for the caller** (app `fh_live_` key,
permission `turnstile`, scoped `read`), so **no project needs a Cloudflare Worker for a captcha**.
🔴 **A failed challenge is `200` with `success: false`.** Branch on `success` for the verdict, on the
**status** for whether the verdict means anything: `409` nothing stored · a **different** `409`
stored-but-undecryptable · `502` unreachable. Treating a failed captcha as an error status is how an outage
rejects every real visitor.
⚠️ Set `expected_action`, or a signup-form token is valid on the login form; a mismatch answers
**`fileshub-action-mismatch`** — *our* code, hence the prefix. ⚠️ `remoteip` is sent only if you send it.


## Machine debug keystores — the account-level record (`2026.08.31.2`)

**One row per BUILD MACHINE, shared by every project.** Android generates `~/.android/debug.keystore` once
per machine, so one fingerprint is what Firebase, an OAuth Android client and `assetlinks.json` must accept
for every app built there. It replaced a per-project vault service that lived for a single day.

| Call | Gate |
|---|---|
| `GET /debug-keystores` · `GET /debug-keystores/{machine}` | vault read — **fingerprints inline** |
| `POST /debug-keystores` (idempotent on `machine_id`) · `PATCH` · `DELETE /debug-keystores/{machine}` | `can_write_vault` |
| `POST /debug-keystores/{machine}/file` | `can_write_vault` |
| `GET /debug-keystores/{machine}/file` · `POST /debug-keystores/{machine}/reveal` | `can_reveal_vault` |

🔴 **The FINGERPRINTS are not behind reveal** — unique on this plane. They ship in `assetlinks.json` and
authorise nothing alone, so an ordinary read returns them; only the bytes and the two passwords need
`can_reveal_vault`. 🔴 **It reuses the vault scopes**, so no new checkbox to enable.

🔴 **`machine_id` is the fleet id** from `global-config/browser-automation/machines.json` — `linux-ahsan`,
`darwin-x64-pc`, `windows-p52` (+ pending `darwin-arm64-pc`, `windows-pcs`). One naming authority.
⚠️ A `sha1` with 32 hex pairs is refused: both fields are colon-hex strings, so swapping them is the easy
mistake and the result matches nothing with no error anywhere.
⚠️ A blank password does NOT clear one — `""` ≡ null, so send `clear_passwords: true`. Same trap as
`clear_api_key`.
⚠️ Storing the FILE matters: a rebuilt machine generates a NEW debug key and every fingerprint already
registered in Firebase silently stops matching.

Every project's vault payload carries `data.debug_keystores` — machine id, label, alias, both fingerprints,
`has_file`, `valid_until`. Derived at read time; never a password, never the bytes.

---

## Developer accounts — the publishing credential vault (`2026.09.01.1`)

**The npm token is here.** So are Hugging Face, GitHub, Docker Hub, PyPI, crates.io, RubyGems, Packagist,
NuGet, Maven Central, Homebrew, the five extension stores, Cloudflare, Vercel, Netlify, Expo, Sentry — and
since `2026.09.04.1` **`native_update`**, the account-wide `nu_pat_` that administers every OTA app —
22 providers; `GET /developer-accounts/providers` returns the live list, so never trust a written count.

Own scope **`can_read_developer_accounts`** (default false). 🔴 **Neither `can_reveal_vault` nor
`can_read_ai_accounts` implies it** — those read one project's config and spend an AI balance; neither is a
reason to publish under the owner's name. Assigning rides on `can_write_vault` (a pointer, no value).

🔴 **The reveal returns `config_files` — the finished `.npmrc` line. WRITE WHAT YOU ARE GIVEN.** Re-deriving
`//registry.npmjs.org/:_authToken=` gets it subtly wrong once and then cannot publish, while the error blames
auth. `env.node` only, never `vite`/`next`: every field here authenticates a publish.

🔴 **`~/.secrets/npm/` DOES NOT EXIST** — a fleet rule named that path for months and its `cat` recovery was a
`No such file or directory`. Repopulate and check in one step:

```bash
npm config set //registry.npmjs.org/:_authToken "$(curl -s -H "Authorization: Bearer $TOK" \
  -X POST "$B/developer-accounts/npm:aoneahsan@gmail.com/reveal" | jq -r '.data.credentials.token')"
npm whoami   # prints aoneahsan, or 401 — the whole test
```

🔴 A blank credential value means **leave alone**; removing one needs `clear_credentials: ["token"]`.
`all_projects` is a standing rule, `{"all_existing":true}` a snapshot, both together a 422 — same shape as
the AI accounts above, and `access_tokens.all_projects` still means the opposite thing.

⚠️ Seven provider names also exist as project-vault services (`github`, `cloudflare`, `sentry`,
`native_update`, `chrome_web_store`, `firefox_addons`, `edge_addons`). **Not duplicates:** the vault row is
that project's config (a DSN, an extension id, an OTA app id + its `nu_app_` device key), this is the
account-wide credential that administers all of them.

🔴 **`native_update` is where the `nu_pat_` lives, and it is the ONE that must not be confused with its
vault twin.** Project vault → `nu_app_…`, per app, client-shippable once restricted. Developer account →
`nu_pat_…`, every app on the account, **server/CI only** (no origin restrictions exist for it and the
management plane sends no CORS headers). Reveal gives `env.node` = `NATIVE_UPDATE_TOKEN=…`. Its non-secret
`scope` and `permissions` fields are readable WITHOUT a reveal, on purpose: out-of-scope on that platform is
**404, never 403**, and a missing opt-in permission is **403 `TOKEN_PERMISSION_DENIED`** — both diagnosable
from the record. 🔴 **There is no copy of this token at `~/.secrets/native-update/`** — that path does not
exist; the vault or the native-update dashboard is the source.

🔴 **A write can be refused on FORMAT — 422 `INVALID_DEVELOPER_ACCOUNT_CREDENTIAL` (`2026.09.04.1`).** A
provider may declare the shape its own backend requires, and BOTH write planes enforce it (Nova had since
day one; the API did not until this release). `native_update.token` is the first: `nu_pat_` + 64 hex + a
4-hex checksum. `details` names the provider and field, **never the value**.

---

## The Supabase split decides what you can automate (moved from SKILL.md 2026-09-01 for the 1,100-word cap)

**Migrations** (`db push --db-url`) need the DB password + session pooler → the **project** vault.
**`functions deploy` / `secrets set` / `link`** need an **`sbp_` PAT** → the **account** vault, which is why
the project vault has no `access_token` field and never will. `POST /supabase-accounts/{id}/reveal` returns
it plus **`env.cli` = `SUPABASE_ACCESS_TOKEN=…`**.

🔴 **Act on `account.email`, never the legacy `account_email`** (ISSUE-10). A PAT for the wrong account
answers **403** on the target and **200** on one it owns — that pair is the diagnosis.
🔴 **`keepalive.enabled` is a different question from `is_active`.** A **client** project is
`active=1, keepalive=0`: credentials readable, no row ever written there. A `last_status` that never moves is
not broken when `enabled` is false. Filter with `?keepalive=`.
🔴 **`supabase: null` = no link RECORDED, not "no project exists"** — resolve it, then
`PATCH /projects/{p} {"supabase_project_id": <id>}`, so nobody re-derives it.
⚠️ Verify tokens against **`endpoints.jwks`** (derived), not a stored `config.jwt` copy.

## Credential checks + Google OAuth clients (`2026.09.11.1`, live 2026-09-11)

Two per-project switches on `projects`, **both off by default** — `test_events_enabled` and
`google_oauth_keepalive_enabled` — set with `PATCH /projects/{p}` (needs `can_write_vault`). 🔴 Never switch
one on for a project the owner has not confirmed is his own: client projects live here too.
🔴 **`is_client_project` (`2026.09.11.3`) outranks both switches and the Supabase keep-alive**: a send or a
keep-alive on a client project is `409 CLIENT_PROJECT`, and the daily runs never select it. Same `PATCH`,
same scope. A Supabase registration has its own flag and inherits a linked project's
(`keepalive.client_project` on its payload).

| Route | Scope | Does |
|---|---|---|
| `POST /projects/{p}/credential-checks {"mode":"verify"}` | `can_read_vault` | Read-only probes of every stored analytics / error / push credential — nothing is sent. Works on any project |
| `POST /projects/{p}/credential-checks {"mode":"send","services":[…]}` | `can_write_vault` | A real "Test Analytics" event per tool; 409 `TEST_EVENTS_DISABLED` while the switch is off |
| `POST /credential-checks {"mode":…,"projects":[…]\|"all_enabled"}` | as above | Queued fleet run → 202 · poll `GET /credential-checks/{run}` and `…/{run}/results` |
| `GET /projects/{p}/google-oauth-clients` | `can_read_vault` | The OAuth-client inventory — never a secret |
| `POST /projects/{p}/google-oauth-clients/import` | `can_write_vault` | Reads clients from Firebase Auth, each Android app's google-services.json, the stored one, a linked Supabase project (ids only — its secret is a hash), and since `2026.09.11.2` the ids stored on `google_cloud`; fills only BLANK `google_cloud` fields, reports conflicts |
| `POST /projects/{p}/google-oauth-clients/keepalive` | `can_write_vault` | Refresh-token exchange / probe now; 409 while the switch is off |

Verdicts: `passed` (acknowledged/proven) · `sent` (no verdict exists — GA4) · `warning` · `failed` ·
`skipped`. What each provider can prove, and the Google unused-client policy: `rules-detail/fileshub-api.md`
→ "Credential checks …". New vault services: `google_analytics` (`measurement_id`, `property_id`) and
`yandex_metrica` (`counter_id`, `counter_key` — the app-identifier tag, **not** the counter number).

## Moved verbatim from SKILL.md (2026-11-02)

### Backup of ~/.secrets

Every credential on a machine is mirrored into its project's vault **the day it is created**; one machine is
not a copy. 🔴 **A write you have not read back is not a backup.** 🔴 **Never restrict a file type**, and never
encode a secret in a filename or key — both are plaintext beside the encrypted bytes. 🔴 **Machine-wide
secrets go to project `global-secrets`** (id 62), not to an account-level vault, because none exists.
Always-loaded law: `~/.claude/rules/project-config.md`. Services, limits, key shape, the checksum check and
the 66-file 2026-09-16 run: `references/vault-state-and-history.md`.

### AI keys on accounts

A provider key authorises a whole *account*, so it lives on an `ai_accounts` record, many-to-many with
projects. 🔴 **`can_reveal_vault` does NOT reach it** — that scope reads one project's config; an AI key
spends an account's balance. **Assigning** needs only `can_write_vault`.
🔴 **Clearing a key is `clear_api_key: true`, never a blank value.** 🔴 **An account's `all_projects` is a
standing rule; `{"all_existing": true}` is a snapshot; both in one body is a 422** — and
`access_tokens.all_projects` means the opposite. Routes and the superseded `openai` service:
`references/vault-endpoints.md`.

### Other services — the bans in full

- **Turnstile** is service **`turnstile`**, 🔴 **not part of `cloudflare`**, and
  `POST /api/v1/turnstile/verify` spends the stored secret — **no project needs a Worker for a captcha**.
  🔴 A failed challenge is `200` with `success: false`. Always-loaded: `~/.claude/rules/fileshub-api.md`.
- **Supabase** splits by credential: **migrations** need the DB password + session pooler (**project** vault);
  **`functions deploy` / `secrets set` / `link`** need an **`sbp_` PAT** (**account** vault) — which is why the
  project vault has no `access_token` field and never will. 🔴 Four traps live in the reference.
- **Test events + Google OAuth keep-alive** (`2026.09.11.1`): 🔴 **per-project switches, default OFF** — never
  flip one on a project the owner has not confirmed is his; 🔴 **`is_client_project` outranks them**
  (`409 CLIENT_PROJECT`).
- **Reading a response:** 🔴 **use the `.env` block you are given, never hand-filter one** (empty blocks are
  dropped, so `env: {}` is normal). 🔴 **`undecryptable[]` = the value exists but could not be decrypted**
  (a rotated `APP_KEY`) — not absence.

### Android signing fingerprints and keystores

🔴 **Three Android signing fingerprints, all NON-SECRET, all readable with NO reveal** —
`play_console.app_signing_*`, `capacitor.upload_*`, and each build machine's debug key on its own
account-level record (`GET /debug-keystores`, also on every project payload as `debug_keystores`).
🔴 **A keystore FILE without its PASSWORD is an unopenable blob** — check `has.keystore_password`, not just
`has.keystore_file`. Both: `references/vault-endpoints.md`.

Payloads, endpoints and curl for all four: `references/vault-endpoints.md`.

### Scope refusals

Missing scope → **403 `TOKEN_PERMISSION_DENIED`** (`details.required_scope` names the Nova toggle);
out-of-scope project → **404**. Only the owner grants one, so a 403 is an `aoneahsan-cccs-ask-the-owner`
pause, not a fallback to guessing.
