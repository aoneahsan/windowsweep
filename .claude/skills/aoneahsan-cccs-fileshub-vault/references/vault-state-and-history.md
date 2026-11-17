# FilesHub vaults — depth, forensics and history

> Split out of `SKILL.md` on **2026-08-24**, when that file measured **2,419 body words against
> `validate-system.py`'s 1,100 hard cap** — more than double, and it had been over since before this
> session. **Everything below is the previous SKILL.md verbatim**; `SKILL.md` now carries the decisions and
> points here for the reasoning. Nothing was reworded and nothing was dropped.
>
> Endpoint shapes and curl recipes are the *other* reference: `vault-endpoints.md`.

## The previous SKILL.md body, in full


# FilesHub credential vaults

Three vaults on `/api/public/v1/*`, authenticated with the account-wide `fh_pat_` token at
`~/.secrets/fileshub/management-access-token`. They exist so a project's credentials are fetched instead of
hunted across a `.env`, four consoles and another machine.

**The standard:** check the vault before asking the owner for a credential — and report what it actually
returned, never what it was supposed to contain.

🔴 **The Project Vault became WRITABLE in `2026.08.20.1`.** The two Supabase vaults remain read-only.

## 🔴 An empty `has` used to mean two different things. Since `2026.08.19.1` it means one.

**Before that deploy a credential could be stored and unreportable.** FilesHub's read paths iterated the
registry — the *capability* set — instead of the project's own rows, so a row whose `service` string was
outside the 18 registry keys was absent from `has`, from `configured_services`, from `values` **and** from
`reveal`. Three clean 200s over live, encrypted credentials, and the honest-looking conclusion — "this project
has nothing" — was false. It cost the aoneahsan-portfolio rebuild two weeks and a wrong diagnosis
(files-hub ISSUE-09).

Two keys make it visible now, and both are worth reading on every response:

| Key | Says |
|---|---|
| `services.<name>.registered` | `false` = the registry does not declare this service; the rows are real, but no `env_key`, `client_safe` flag or field help exists for them |
| `unregistered_services[]` | top level of the detail payload **and (since `2026.08.19.2`) of every `GET /vault/projects` list row** — every service the project holds rows under that the registry has never heard of. 🔴 Read it: on 2026-08-19 six of the seven non-empty projects were orphans under ONE free-text string |

🔴 **On an old deploy, or against any similar vault: never conclude "nothing is stored" from `has` alone.**
Ask the owner to look at the entry surface. An orphan is addressable at `GET|POST /projects/{p}/vault/{service}`
once you know its name.

## 🔴 BOTH vaults are POPULATED. Read the vault FIRST, for every project.

**This section said the opposite until 2026-08-24, and acting on it wasted work.** The seeding run of
2026-08-20 took the Project Vault from **7 of 55 projects to 52 of 55** — 1,208 fields, 50 files, 73 links,
all 10 Supabase projects linked. The old stance ("it is all but empty, `~/.secrets/` is the working source of
truth") is **retired**: check the vault before opening a console, a checkout or `~/.secrets/`.

The **Supabase** vaults hold **10 projects** across **5 accounts, all five holding a `sbp_` PAT**. For
Supabase the vault is the authority and a missing entry **blocks the work**
(`~/.claude/rules/supabase-provisioning.md`).

Only three projects hold nothing — `a1fp1-vps1`, `test-project`, `whatsapp-automation` — and that is a
**finding, not a gap**: none has a repo or any derivable evidence. Blank **by decision** elsewhere: the whole
`cloudflare` service (no API token exists on any machine), `play_console.app_signing_sha256`, the Sentry
org/project/token, and 4 keystore passwords no filename encodes. 🔴 **`cloudflare` being blank says nothing
about `turnstile`** — they are separate services precisely because a project uses one without the other.

🔴 **Presence is not readiness.** callvault is registered and still unusable for schema work —
`has.db_password: false`, no session-pooler URL. Read the specific `has.*` field the next step needs, never a
row's existence.

Two consequences that matter more than the endpoints:

- **An empty service means NOT ENTERED — never "this project doesn't use Firebase."** The skeleton is
  identical either way. Read presence from `has.*`, and treat absence as unknown.
- 🔴 **Populating it is NO LONGER Nova-only — that decision was REVERSED on 2026-08-20**, one day after
  being reaffirmed. Around sixty projects × ~95 declared fields is not a dashboard workload, and the values
  already sit in a checkout, a git remote or a console CLI. **A missing credential you can derive is now
  something you WRITE, not a `MANUAL-TASKS.md` row.** Nova keeps its per-field help text and is still the
  right place for the owner to type one value by hand. See "Writing" below.

State this plainly when you report. "The vault has no Firebase config for this project" is honest; "this
project has no Firebase" is a fabrication built from the same response.

## Writing — `can_write_vault`, since `2026.08.20.1`

⚠️ **Check `GET /api/version` first.** On an older deploy none of this exists and the vault is read-only.

| Call | Does |
|---|---|
| `PUT /projects/{p}/vault/{service}` | `{"values": {...}}` — **absent key = leave alone, explicit `null` = delete that field** |
| `POST /projects/{p}/vault` | Many services (+ optionally `links`) in ONE transaction. **The call a seeding run uses** |
| `DELETE /projects/{p}/vault/{service}` | Clears a service; needs `{"confirm": true}` |
| `POST /projects/{p}/vault-move` | `{"from","to","keys":{}}` — retire an orphan onto declared fields, atomically |
| `POST\|DELETE /projects/{p}/vault-files/{service}.{key}` | Multipart `file` **or** `{"filename","content_base64"}` |
| `PUT /projects/{p}/links` | Full replace (a link has no stable id) |

Every write returns the **whole read payload plus `changes`** — so you confirm what landed without a second
call and **without `can_reveal_vault`**.

🔴 **You cannot mark a declared field public.** For anything the registry declares, the registry decides
`is_secret`; a `secrets` map counts only on freeform `general`, where **absent defaults to secret**. Do not
try to route around it — publishing a credential in a non-reveal 200 is the failure that rule prevents.

🔴 **A free-text service name is refused on create** (`422 UNKNOWN_VAULT_SERVICE`) — that is the entry-side
half of ISSUE-09. An **existing** orphan is still deletable and movable, which is how the six live ones get
cleaned up: `vault-move` from `google cloud firebase` to `google_cloud`, mapping `<slug>-client-id` →
`oauth_web_client_id` and `<slug>-client-secret` → `oauth_web_client_secret`. It validates the whole move
before writing any of it.

🔴 **`fileshub` is DERIVED and refuses writes** — its slug, API base, `fh_live_` key and origins are computed
from the project's own records. Change those instead (`POST /projects/{p}/api-keys`, the origins endpoints).
`supabase` refuses writes too; it is a link. **Read `writable` and `derived` from `GET /vault/services`
rather than discovering it from a 422.**

Registry is **22 services / 102 fields** (probed live 2026-08-31; 103 pending the `.pepk` field) (`firefox_addons` + `edge_addons` joined 2026-08-20, the linked `ai`
tab 2026-08-21).

## AI keys live on ACCOUNTS, not in a project's vault — `2026.08.21.1`

An OpenAI/Anthropic key authorises a whole **account**: it spends that account's balance and reaches every
model on it, and two or three accounts serve the fleet. So it sits on an `ai_accounts` record and projects
point at it **many-to-many** (an app routinely uses OpenAI for embeddings AND Anthropic for chat).

| Call | Scope |
|---|---|
| `GET\|POST /ai-accounts` · `GET\|PATCH /ai-accounts/{a}` · `POST /ai-accounts/{a}/reveal` | **`can_read_ai_accounts`** (writes need `can_write_vault`) |
| `GET\|PUT /projects/{p}/ai-accounts` — assign | **`can_write_vault`** |

🔴 **`can_reveal_vault` does NOT grant an AI key.** It is the strongest grant over *project* credentials and
still 403s here — it is given to read one project's config, not to hand out billing. **Assigning** is safe at
the weaker scope because it is a pointer: those responses never contain a key.

🔴 **Reveal emits `env.node` ONLY** — the real SDK variable (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, …). There
is no `vite`/`next` block and never will be.
🔴 **Clearing a key is `clear_api_key: true`, never a blank value** — Laravel's `ConvertEmptyStringsToNull`
makes `""` and null identical to the controller, so "null clears" would wipe the key on any empty string.
⚠️ `openai` is still a declared vault service, marked superseded; the lift migration was **additive**, so a
project may legitimately show BOTH an `openai.*` row and an assigned account. Prefer the account.

## Cloudflare Turnstile — stored here, and VERIFIED here (`2026.08.24.1`)

Vault service **`turnstile`**: `site_key` (client-safe), `secret_key` (the only secret), `widget_name`,
`widget_mode`, `hostnames`, `expected_action`.

🔴 **It is NOT part of `cloudflare`.** A project uses Turnstile with no API token, no zone and no R2, so the
fleet-wide "the cloudflare service is blank by decision" note does **not** mean a project has no captcha.
Merging them would make `configured_services` report an account that does not exist.

🔴 **`POST /api/v1/turnstile/verify` spends the stored secret for the caller** — app `fh_live_` key,
permission `turnstile`, scoped `read`. So **no project needs a Cloudflare Worker for a captcha**, which is
what the zero-backend Firebase projects previously required. Reach for this before proposing a Worker.

🔴 **A failed challenge is `200` with `success: false`.** Branch on `success` for the verdict and on the
**status** for whether the verdict means anything: `409` nothing stored · a **different** `409`
stored-but-undecryptable · `422` bad input · `502` Cloudflare unreachable. Treating a failed captcha as an
error status is how an outage rejects every real visitor.

⚠️ Set `expected_action`, or a token minted on the signup form is valid on the login form; a mismatch answers
**`fileshub-action-mismatch`**, which is *our* code — the prefix is what tells it apart from Cloudflare's.
⚠️ `remoteip` is forwarded only if you send it: from a proxying backend your own IP is the server's, and the
wrong one fails a challenge the visitor passed.

## The scope gate — `GET /token` first, always

Six booleans, five of them **off by default**:

| Scope | Opens |
|---|---|
| `can_read_vault` | project-vault metadata + `has.*` presence flags — never a value |
| `can_reveal_vault` | values, `.env` blocks, file bytes (implies read) |
| `can_write_vault` | creating, changing, deleting credentials, files and links. **Implies read, NOT reveal** |
| `can_manage_supabase` | the Supabase **project** vault |
| `can_read_supabase_tokens` | the Supabase **account** vault. 🔴 `can_manage_supabase` does **not** imply it |

A missing scope is **403 `TOKEN_PERMISSION_DENIED`**; an out-of-scope project is **404**. Only the owner can
grant a scope, in Nova — so a 403 here is an `aoneahsan-cccs-ask-the-owner` pause, not a fallback to guessing.

✅ **Project scope now reaches BOTH Supabase vaults** (files-hub `2026.08.19.1`, ISSUE-08). It previously did
not: a token scoped to one project revealed a *different* project's Supabase database password, because
`supabase_projects` had no relation to `projects` to scope by. The rule now — **link and filter** — is that an
`all_projects` token is unchanged, and a scoped token sees the Supabase projects linked from a FilesHub
project it can manage **plus every unlinked row**; out-of-scope 404s. Accounts are filtered the same way.

⚠️ **Unlinked rows are still visible to any scoped token holding the scope**, deliberately: nothing linked
them when the fix shipped, so filtering them out would have emptied the vault. **The link is what closes it**,
and it is now recordable — `PATCH /api/public/v1/projects/{project} {"supabase_project_id": <id>}`, gated by
`can_manage_supabase` and by the same scope rule (linking widens a read). **Record the link the first time you
resolve one**; it is the durable fix for "which Supabase project belongs to this app?" as well.

⚠️ **On a deploy older than `2026.08.19.1`, the old behaviour still applies** — check `GET /api/version`
before relying on containment.

✅ `details.required_scope` names the real column at every gate since **`2026.08.04.1`** — so the 403 tells
you exactly which Nova toggle to ask for. (Before that the two Supabase gates returned labels matching no
field, which is why an older record may tell you not to trust it.)

## Which vault answers which question

| Question | Call |
|---|---|
| What fields exist at all? | `GET /vault/services` — the registry, **no scope needed**. Read it before guessing a field name |
| Which projects have anything? | `GET /vault/projects` — paginated, `configured_services` per row |
| What does this project have? | `GET /projects/{p}/vault` — `has.*` flags, no values |
| Give me the values | `POST /projects/{p}/vault/reveal` — add `/{service}` before `/reveal` to narrow it |
| The `google-services.json` / plist / keystore itself | `GET /projects/{p}/vault-files/{service}.{key}` — raw bytes + `X-Checksum-Sha256`. 🔴 `vault-files/…`, never `vault/files/…` |

## The Supabase split decides what you can automate

| Task | Needs | From |
|---|---|---|
| App runtime, **migrations** (`db push --db-url`) | DB password + session pooler | the **project** vault |
| `functions deploy`, `secrets set`, `link` | an **`sbp_` access token** | the **account** vault |

The project vault has **no** `access_token` field and never will — a PAT authorises a whole supabase.com
*account*, including projects that do not exist yet, so it lives on the account record. A project payload
carries only an `account` **pointer**. `POST /supabase-accounts/{idOrEmail}/reveal` returns the token plus
**`env.cli` = `SUPABASE_ACCESS_TOKEN=…`**, which is the variable the CLI reads — no interactive login.

⚠️ **One** of three registered accounts (`aoneahsan.firebase.p1@gmail.com`) holds **no PAT** while owning 2
projects, so those projects cannot be CLI-deployed (re-probed 2026-08-06; it was two of three on 2026-08-04).
And a valid token for the *wrong* account answers **403** on the target project while returning **200** on one
it owns — that pair is the diagnosis.

🔴 **The Project Vault DOES tell you which Supabase project belongs to an app — for the ones that have been
linked. READ IT FIRST.**

⚠️ **This paragraph said the opposite until 2026-08-28** — *"returns `supabase: null` for every project,
because nothing has been linked yet"* — and it was written when that was true. It stopped being true as the
fleet was linked, and nothing expired it. A session trusting it skips the vault and re-derives the ref by
hand: exactly the per-session re-derivation the link was built to end.

**Measured 2026-08-28** (`GET /projects?per_page=100`, `GET /supabase-projects`, `GET /supabase-accounts`):
**10 of 50 FilesHub projects carry `supabase_project_id`**, against **14 registered Supabase projects across
7 accounts, all 7 holding a PAT**. Since `2026.08.28.1` the block also carries **`account_id` +
`account_email`**, so one call answers *which project* **and** *whose PAT* — derived through the FK-wins rule
(`SupabaseProjectVaultService::accountEmail()`), so it cannot disagree with `/supabase-projects`.

```json
"supabase": {"id": 10, "name": "trizlink", "ref": "xmzckrjqhjnydhgrtqgd",
             "url": "https://xmzckrjqhjnydhgrtqgd.supabase.co",
             "account_id": 5, "account_email": "aoneahsan.firebase.p3@gmail.com",
             "credentials_via": "/api/public/v1/supabase-projects/xmzckrjqhjnydhgrtqgd"}
```

🔴 **`supabase: null` means NO LINK RECORDED — never "no Supabase project exists."** For those, resolve the
ref from `docs/PROJECT-CONTEXT.md` → the committed `.env` → a name match confirmed once with the owner, then
**write it back**: `PATCH /api/public/v1/projects/{project} {"supabase_project_id": <id>}`. That turns a
per-session re-derivation into a stored fact, and it is what narrows ISSUE-08's residual exposure. The
resolution order and the gate that consumes it belong to `aoneahsan-cccs-supabase`.

⚠️ **The PAT presence flag is spelled differently in the two payloads**, and the wrong one fails silently:
the embedded `account` block on `/supabase-projects` uses flat `has_personal_access_token`, while
`GET /supabase-accounts` nests it as `has.personal_access_token`. A probe reading the flat name against the
accounts endpoint returns `null` for all 7 and reports *nobody has a PAT* — measured, and corrected, on
2026-08-28.

⚠️ **`supabase_projects.account_email` is legacy free text and has disagreed with the FK in production**
(ISSUE-10, row 10 `trizlink`). Act on **`account.email`**; since `2026.08.19.1` the top-level `account_email`
is derived from the FK and `account.legacy_account_email_conflict` flags a stale row. A PAT for the wrong
account answers 403 on `functions deploy` while every presence flag reads true.

## Handling what you get back

- 🔴 **Use the `.env` block you are given; never hand-filter one.** `vite` and `next` contain only
  `client_safe` fields, and a `secret` field is forced non-client-safe — that is what makes "no server secret
  in a `VITE_` var" structural instead of remembered. **Empty blocks are dropped**, so `env: {}` is normal.
- **`undecryptable[]`** lists `service.field` whose value exists but could not be decrypted (rotated
  `APP_KEY`): `has` stays `true`, the value is `null`. That means *re-enter it in Nova*, not *unset*.
- **Every reveal is recorded** (field names only) and stamps `last_revealed_at`. Reveal deliberately.
- 🔴 **Not to be confused with `vault_secrets` on the DATA plane (`/api/v1/vault*`)** — a versioned, expiring
  store that consumer apps *write* with their own `fh_live_` key. Same word, different plane, different token,
  opposite direction. This skill is read-only administration; that one is application storage.
- 🔴 **Never echo a revealed value** into the transcript, a log, a commit, or a command line. Pipe it
  straight where it belongs. A stored URL's password segment is a literal `[YOUR-PASSWORD]` placeholder —
  substitute the real password, percent-encoded, or you get `28P01` and blame the vault.

Endpoint map, payload shapes and curl recipes: `references/vault-endpoints.md`.

## Related skills

`aoneahsan-cccs-fileshub-management-api` (same plane — the token families, envelope and scoping model, plus
projects/keys/origins administration) · `aoneahsan-cccs-fileshub` (consuming storage + email) ·
`aoneahsan-cccs-supabase` (what to do with the credentials once you have them) ·
`aoneahsan-cccs-project-understanding` (the context gate that sends you here) ·
`aoneahsan-cccs-ask-the-owner` (a missing scope or an empty vault is a pause, not a workaround).

<!-- Living registry (link, never copy): ~/.claude/rules/fileshub-api.md -->

---

## The Supabase split — the fuller text, condensed out of SKILL.md on 2026-08-24

## The Supabase split decides what you can automate

| Task | Needs | From |
|---|---|---|
| App runtime, **migrations** (`db push --db-url`) | DB password + session pooler | the **project** vault |
| `functions deploy`, `secrets set`, `link` | an **`sbp_` access token** | the **account** vault |

The project vault has **no** `access_token` field and never will — a PAT authorises a whole account.
`POST /supabase-accounts/{idOrEmail}/reveal` returns it plus **`env.cli` = `SUPABASE_ACCESS_TOKEN=…`**.

🔴 **Act on `account.email`, never the legacy `account_email`** (ISSUE-10). A PAT for the wrong account
answers **403** on the target and **200** on one it owns — that pair is the diagnosis, while every presence
flag reads true throughout.
🔴 **Record the Supabase↔project link the first time you resolve one** —
`PATCH /projects/{p} {"supabase_project_id": <id>}`.
🔴 **`keepalive.enabled` is a different question from `is_active`.** A **client** project is
`active=1, keepalive=0`: credentials readable, no row ever written there. A `last_status` that never moves is
not broken when `enabled` is false. Filter with `?keepalive=`.
⚠️ Verify tokens against **`endpoints.jwks`** (derived), not a stored `config.jwt` copy.

---

## Passages condensed out of SKILL.md on 2026-08-24 (kept verbatim)

Only `a1fp1-vps1`, `test-project` and `whatsapp-automation` hold nothing — a **finding, not a gap**: no repo,
no derivable evidence. Blank **by decision**: the whole `cloudflare` service (no API token on any machine),
`play_console.app_signing_sha256`, Sentry org/project/token, 4 keystore passwords. 🔴 **`cloudflare` being
blank says nothing about `turnstile`** — separate services.

**This skill said the opposite until 2026-08-24, and acting on it wasted work.** The 2026-08-20 seeding run
took the Project Vault from **7 of 55 projects to 52 of 55** (1,208 fields, 50 files, 73 links, all 10
Supabase projects linked); the Supabase vaults hold **10 projects across 5 accounts, all five with a `sbp_`
PAT**. Check the vault before a console, a checkout or `~/.secrets/`.

`PUT /projects/{p}/vault/{service}` (**absent key = leave alone, explicit `null` = delete**) ·
`POST /projects/{p}/vault` (many services + `links`, ONE transaction — the seeding call) ·
`DELETE …/vault/{service}` (needs `{"confirm": true}`) · `POST …/vault-move` (retire an orphan, atomically) ·
`POST|DELETE …/vault-files/{service}.{key}` · `PUT …/links` (full replace — a link has no stable id).

Every write returns the whole read payload plus `changes`, so you confirm what landed **without**
`can_reveal_vault`.

- 🔴 **Use the `.env` block you are given; never hand-filter one.** `vite` and `next` carry only
  `client_safe` fields, and a `secret` field is forced non-client-safe — that is what makes "no server secret
  in a `VITE_` var" structural instead of remembered. **Empty blocks are dropped**, so `env: {}` is normal.

---

## AI accounts — the fuller text, condensed out of SKILL.md on 2026-08-24

## AI keys live on ACCOUNTS, not in a project's vault

A provider key authorises a whole *account*, so it lives on an `ai_accounts` record and projects point at
it, many-to-many. `GET|POST /ai-accounts` · `GET|PATCH|POST …/reveal` (`can_read_ai_accounts`) ·
`GET|PUT /projects/{p}/ai-accounts` (assign — only `can_write_vault`; a pointer never returns a key).

🔴 **Reveal emits `env.node` ONLY.** 🔴 **Clearing a key is `clear_api_key: true`, never a blank value** —
`ConvertEmptyStringsToNull` makes `""` and null identical.
🔴 **`all_projects` on an ACCOUNT is a standing rule** (covers future projects); `{"all_existing": true}` is
a **snapshot**; both in one body is a **422**. ⚠️ `access_tokens.all_projects` shares the name and means the
opposite. ⚠️ `openai` survives as a superseded vault service — prefer the account.

## Depth moved out of SKILL.md on 2026-09-17 (1,349 words -> under the 1,100 hard cap)

Reproduced VERBATIM. The SKILL.md body keeps every red ban from these sections as a one-liner; what
follows is the explanation and the mechanics behind them.

## 🔴 The vault is also the BACKUP of `~/.secrets` — owner directive 2026-09-16

*"for any secret make sure you must backup that in fileshub for that project using management api"*. Every
credential on a machine is mirrored into its project's vault the day it is created; one machine is not a copy.
Law: `~/.claude/rules/project-config.md`. Measured against the live API on 2026-09-16, 66 files backed up:

- **Dedicated field if the registry declares one**, otherwise the freeform **`general`** service, keyed
  `bk_<relative path with every non-alphanumeric turned into `_`>`.
- **Read it back before calling it done.** `POST /projects/{id}/vault/{service}/reveal` returns the WHOLE
  project — the values are at `data.services.<service>.values`, which is the shape that catches people out.
- **A freeform row caps at 20,000 characters** (422 above it) and **`general` refuses files**
  (`VAULT_FIELD_IS_NOT_A_FILE`). A file goes to its declared file field, or to the freeform **`general_files`**
  service (backend `2026.09.16.1`, any key, any format — never restrict it), via
  `POST /projects/{p}/vault-files/{service}.{key}`; a read returns raw bytes plus `X-Checksum-Sha256` —
  compare that, the download and the local file, all three.
- **OTA bundle-signing private keys** have their own field, `native_update.signing_private_key`. Prove a
  restore by signing with the downloaded key and verifying with the shipped public key.
- **Trailing whitespace is trimmed on store** — compare with `.strip()` or a verification lies.
- **Machine-wide secrets** (a VM password, an account-wide token, the PAT itself) have no account-level
  freeform vault: they live in the project **`global-secrets`** (id 62).
- Never print a value, a prefix of one, or a diff of two — print the path, the target key, and match/mismatch.

## Cloudflare Turnstile — stored here, and VERIFIED here (`2026.08.24.1`)

Service **`turnstile`** — 🔴 **not part of `cloudflare`**, and **`POST /api/v1/turnstile/verify` spends the
stored secret for you, so no project needs a Worker for a captcha**. 🔴 A failed challenge is `200` with
`success: false`; the STATUS says whether the verdict means anything. The field list, the status ladder and
the `expected_action` trap: `references/vault-endpoints.md`, and in full in the always-loaded
`~/.claude/rules/fileshub-api.md`.

## The Supabase split decides what you can automate

**Migrations** need the DB password + session pooler → the **project** vault. **`functions deploy` /
`secrets set` / `link`** need an **`sbp_` PAT** → the **account** vault, which is why the project vault has
no `access_token` field and never will. 🔴 Four traps live with the detail — acting on `account.email` not
the legacy column (ISSUE-10), `keepalive.enabled` vs `is_active`, `supabase: null` meaning *no link
recorded*, and verifying against derived `endpoints.jwks`: `references/vault-endpoints.md`.

## Test events + Google OAuth keep-alive (`2026.09.11.1`, live 2026-09-11)

`…/credential-checks` sends a real "Test Analytics" event (or `verify` probes read-only);
`…/google-oauth-clients/import|keepalive` stops Google deleting unused OAuth clients. 🔴 **Per-project
switches, default OFF** — never flip one on a project the owner has not confirmed is his; 🔴
**`is_client_project` outranks them** (`409 CLIENT_PROJECT`). Detail: `references/vault-endpoints.md`.

## Handling what you get back

- 🔴 **Use the `.env` block you are given; never hand-filter one.** Empty blocks are dropped, so
  `env: {}` is normal. **`undecryptable[]`** = the value exists but could not be decrypted (rotated
  `APP_KEY`) — not absence. Full envelope, per-framework filtering and the reveal trail:
  `references/vault-endpoints.md`.
