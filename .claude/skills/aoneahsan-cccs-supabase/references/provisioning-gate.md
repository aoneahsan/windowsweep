# The provisioning gate — exact calls, blocking template, live registry

Everything here reads the **FilesHub management plane**. Token families, scopes and the envelope are owned by
`aoneahsan-cccs-fileshub-vault`; this file is only what a Supabase task does with them.

```bash
TOKEN="$(grep -oE 'fh_pat_[A-Za-z0-9]+' ~/.secrets/fileshub/management-access-token | head -1)"
B=https://fileshub.zaions.com/api/public/v1
H() { curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$@"; }
```

🔴 **`grep -oE`, not `cat` — the secrets store holds a markdown record, not a bare string.** `$(cat …)` sends
the whole document as the bearer value and returns **401**, which looks exactly like a revoked token and
sends you to Nova to fix nothing. Measured 2026-08-13: `cat` → 401, the form above → 200. Full note:
`../../aoneahsan-cccs-fileshub-vault/references/vault-endpoints.md` § Recipes.

## Step 0 — scopes, once per session

```bash
H "$B/token"
```

Needs `can_manage_supabase` (the project vault) and, for G3, `can_read_supabase_tokens` — 🔴 the first does
**not** imply the second. A **403** is a missing scope only the owner can grant in Nova, so it is a pause, not
a fallback. A **404** on a project you believe exists means out-of-scope, not deleted.

## Step 1 — resolve the ref

🔴 **FilesHub has no project→Supabase link.** `GET /projects/{slug}/vault` returns `supabase: null` for all 54
projects, including callvault, custos and trialith, which all have registered Supabase projects. So:

1. **`docs/PROJECT-CONTEXT.md`** — the canonical home, written by us:
   ```markdown
   ## Supabase
   - ref: `qxxrsejihsaewttmsetr`
   - account: aoneahsan@gmail.com
   - registered in FilesHub: yes (verified YYYY-MM-DD)
   ```
2. **The committed `.env`** — `VITE_SUPABASE_URL=https://<ref>.supabase.co`. Verify, then write it into
   `PROJECT-CONTEXT.md` so the next session skips this.
3. **Name match** on `GET /supabase-projects` — exactly one candidate → confirm with the owner **once** →
   record. Zero or 2+ → BLOCK.

Always verify: `H "$B/supabase-projects/<ref>"` must return **200**. A recorded ref that 404s is a stale
record — re-resolve rather than trusting it.

## Step 2 — the gate for the step you are about to run

```bash
# G1 — runtime. Needs endpoints.api + config.publishable_key
H "$B/supabase-projects/<ref>" | python3 -c "
import json,sys; d=json.load(sys.stdin)['data']
print('api:', bool((d.get('endpoints') or {}).get('api')),
      '| publishable:', bool((d.get('config') or {}).get('publishable_key')),
      '| keepalive:', d.get('keepalive'))"

# G2 — schema. Needs has.db_password AND has.db_url_session_pooler
H "$B/supabase-projects/<ref>" | python3 -c "
import json,sys; h=json.load(sys.stdin)['data']['has']
print('db_password:', h['db_password'], '| session_pooler:', h['db_url_session_pooler'])"

# G3 — platform. The PAT lives on the ACCOUNT, never the project
H "$B/supabase-accounts" | python3 -c "
import json,sys
for r in json.load(sys.stdin)['data']:
    print(r['email'], '| pat:', r['has']['personal_access_token'], '| projects:', r['projects_count'])"
```

Only when a gate passes do you reveal, and only what that step needs:

```bash
H -X POST "$B/supabase-projects/<ref>/reveal" > /dev/null   # pipe it; never to the transcript
export SUPABASE_ACCESS_TOKEN="$(H -X POST "$B/supabase-accounts/<idOrEmail>/reveal" \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["secrets"]["personal_access_token"])')"
```

🔴 **Never echo a revealed value** into the transcript, a log, a commit or a command line. Feed the PAT via
the environment, never a `--flag` — flags land in the process list.

## The blocking message

```
I NEED THIS FROM YOU:
<project> needs a Supabase project and FilesHub cannot supply it.

What blocks:   <G1 no registered project | G2 db_password + session pooler missing | G3 account holds no PAT>
Evidence:      <the exact call> returned <the exact response fact>
Why it blocks: <the specific next step that cannot run>

Please: 1) create the Supabase project   2) enter <the exact missing fields> in FilesHub Nova
        3) tell me the ref.

Options: A) create it under <an account with free capacity>
         B) reuse the existing <ref> already registered for <name>
         C) this project should use Firebase instead
Recommendation: A.
```

Then **PAUSE**. *"Continue"* / *"finish the rest"* is not an answer — re-state the ask and hold. Record the
answer in `docs/PROJECT-CONTEXT.md` so it is never asked twice.

## Applying schema once G2 passes

```bash
supabase migration new <name>   # scaffold, review, then:
supabase db push                # forward-only, against the hosted project
```

- Connect through the **session pooler** (`aws-0-<region>.pooler.supabase.com:5432`, user `postgres.<ref>`).
  `db.<ref>.supabase.co` is IPv6-only and will not resolve on an IPv4 network.
- A stored `db_url_*` carries the literal `[YOUR-PASSWORD]` placeholder — substitute the real password,
  **percent-encoded**, or you get `28P01` and blame the vault.
- 🔴 No `db reset`, ever. A mistake is corrected by a **new** migration.

## 🔴 The shared TEST project (owner, 2026-11-05) — never ask for one

FilesHub `supabase-projects` **30**, `test-supabase-use-for-any-project`, ref `jisblczrxduhnxtcdzfd`
(`ap-southeast-2`, account 15 `ahsantester.d2.g@gmail.com` with a PAT; G1–G3 pass). Every production project uses
it for restore rehearsals, trial migrations, trial Edge Functions and any test that does not need the live product:
take the `fleet_ops.lease`, do the work, wipe back to the baseline, read back, release. 🔴 A lease lasts **one hour at
most**, and the project wipes and releases **the moment its work ends**, logging both in `projects-finalization-record`
→ `shared-test-supabase/LEASE.md` (owner, 2026-11-07). The lease SQL, the baseline, the proven wipe and the restore
recipe: `~/.claude/rules-detail/supabase-provisioning.md` → first section.

## Live registry — probed 2026-08-06

Six projects across three accounts. Re-probe rather than trusting this; it is a snapshot.

| Project | ref | Gate status |
|---|---|---|
| clearhire | `lxvdadoeyghxqyanpyla` | |
| custos | `qxxrsejihsaewttmsetr` | was on the retired local stack |
| linkedin-automation | `iyrbcoswnbsckiuimazx` | 🔴 FilesHub slug is `linkedin-automation-app` |
| lifewell | `mednqghfhaazsikbmtiz` | |
| trialith | `jvkwawjoxmdgzkjxsbxq` | |
| callvault | `bnlxrjjwawyampjbfqnu` | 🔴 **fails G2** — no `db_password`, no pooler URL |

| Account | PAT | Projects |
|---|---|---|
| aoneahsan@gmail.com | ✅ | 2 |
| aoneahsan.firebase.p2@gmail.com | ✅ | 2 |
| aoneahsan.firebase.p1@gmail.com | 🔴 none | 2 — **fails G3** |

🔴 **polymath and doornest are not registered at all** and block on first contact.

Full law and forensics: `~/.claude/rules/supabase-provisioning.md` →
`~/.claude/rules-detail/supabase-provisioning.md`.
