# Adopting the standard in a project that already has migrations

## 🔴 STOP — establish which of three states this project is in

A session told *"finish the Drizzle migration"* on an **already-adopted** project, that then re-runs this
recipe from step 1, is the worst outcome available: it re-introspects with the defective `pull`, re-archives
files a contract test imports, and can talk itself into executing SQL. Two commands decide it:

```bash
ls src/db/schema/ 2>/dev/null
grep -h '^### \(TASK\|DONE\)-' PENDING-TASKS.md docs/DONE-TASKS.md 2>/dev/null | grep -i drizzle
```

| What you find | State | What "finish it" means |
|---|---|---|
| no `src/db/schema/`, an **open** `TASK-` | **not adopted** | run this recipe end to end |
| `src/db/schema/` **and** a `DONE-` entry | **adopted** | 🔴 **do not re-run step 1.** Open the evidence record named in that entry, work only the leftovers it names, close them |
| `src/db/schema/` and an open `TASK-` saying *steps N–M done* | **part-done** | resume at the named step. The record says which |

**No migrations at all** (`supabase/` holds only `config.toml`) → *Greenfield*, at the end of this file.
🔴 **An adopted project's leftovers are normal, not a failed adoption.** Some criteria are deliberately
carried — a non-admin probe on a project with zero users is vacuous, and a stated limitation with a written
reason is a closed decision, not an omission. Re-opening one needs the same evidence closing it did.

## 🔴 Rewriting the files is not re-running them

Adoption rewrites the **migration files and the history table**. It never re-executes DDL against the
database. Re-applying a rewritten chain means dropping and recreating every object — that is
`supabase db reset` wearing a different hat: banned, dev **is** prod, and there is no local copy
(`~/.claude/rules/supabase-provisioning.md`).

`supabase migration repair --status applied <version>` inserts a history row **without executing the SQL**.
That is the documented mechanism, and it is what makes the end state identical at zero risk.

**What replaces "the chain replays from scratch" as proof is the two-sided gate — structural parity
(step 7a) and policy parity against `pg_policies` (step 7b).** Do not go looking for a way to restore replay;
the hosted-only law already accepted its loss. 🔴 And do not collapse the two back into one: a single
"`generate` emits nothing" check is decorative on the policy half, because `pull` wrote both sides of it.

## The recipe

### 1. Pass the gate

Resolve the ref: `docs/PROJECT-CONTEXT.md` → the committed `.env` `VITE_SUPABASE_URL` → a name match
**confirmed once with the owner** → otherwise BLOCK. Verify `GET /supabase-projects/<ref>` returns 200, then
check **G2** — `has.db_password` **and** `has.db_url_session_pooler`. A project can pass G1 and fail G2
invisibly.

Missing → `aoneahsan-cccs-ask-the-owner`, `I NEED THIS FROM YOU:`, and **pause that project, not the pass**.

🔴 **ASSERT THE REF INSIDE THE PAYLOAD BEFORE USING ANY VALUE FROM IT — a failed probe does not look like
one.** On labflow 2026-08-21 the first vault call returned **`HTTP 000`** and the parser happily read a
**pre-existing scratch file left by an earlier session, holding a DIFFERENT project's record** (lifewell's
ref, endpoints and secrets). Nothing in the output looked wrong: it was a well-formed Supabase project.

```bash
OUT=$(mktemp)                                    # fresh file, every call
curl -s --fail-with-body -X POST -H "Authorization: Bearer $TOK" \
     "$B/supabase-projects/<ref>/reveal" -o "$OUT" -w '%{http_code}'
python3 - "$OUT" <<'EOF'
import json,sys
d=json.load(open(sys.argv[1]))['data']
assert d['ref'] == '<ref>', f"WRONG REF IN PAYLOAD: {d['ref']}"
assert d['config']['database']['host'] == f"db.{d['ref']}.supabase.co", "host disagrees with ref"
EOF
```

Three things, and all three are load-bearing: **`--fail-with-body`** so a non-2xx is not silently parsed, a
**fresh `mktemp`** so a stale file cannot stand in for a response, and the **ref asserted from inside the
body** so the answer is about the project you asked about. A wrong ref migrates someone else's database, and
this is the mechanism by which that actually happens — not by typing the wrong ref, but by reading the right
one from the wrong place.

### 2. Record the ground truth — before touching anything

Into the fleet tracker:

- a row count for every table in `public`;
- a dump of `supabase_migrations.schema_migrations`.

This is the recovery record for the history edit in step 10, and the evidence for the "nothing was executed"
claim at the end. 🔴 **A history edit with no prior dump is unreversible.**

### 3. Install — stable only

```bash
yarn add drizzle-orm postgres
yarn add -D drizzle-kit
```

🔴 Never `@rc`. Confirm: `yarn why drizzle-kit` must show a `0.31.x`, not a `1.0.0-beta`.

### 4. Configure

`drizzle.config.ts` per `schema-authoring.md` — `out: './supabase/migrations'`,
`migrations: { prefix: 'supabase' }`, `entities: { roles: { provider: 'supabase' } }`,
`schemaFilter: ['public']`.

### 5. Introspect into a scratch directory

```bash
# 🔴 out points at a SCRATCH dir, not supabase/migrations
SUPABASE_DB_URL='…' npx drizzle-kit pull --config drizzle.introspect.config.ts
```

🔴 **Never let `pull`'s baseline `.sql` land where the Supabase CLI reads it.** `pull` writes a full
`CREATE`-everything migration; dropped into `supabase/migrations/`, the next `db push` tries to re-create the
entire schema on top of itself. Use `supabase/.drizzle-introspect/`, and gitignore it.

### 6. Curate

Split the machine-generated output into `src/db/schema/<module>.ts` plus an `index.ts` barrel, named after
the project's own modules so a schema file and a feature tracker point at the same thing. Move **every**
policy into `pgPolicy`. Add `.enableRLS()` to every table that has no policy.

Introspection output is correct but shapeless — it is a starting point, not the deliverable. A `schema.ts`
nobody can read is a `schema.ts` nobody will maintain, and the whole benefit was reviewability.

#### 🔴 FIRST: transcribe every policy from `pg_policies`, NOT from `pull`

`drizzle-kit pull` 0.31.10 **keeps `using`/`withCheck` only for the FIRST policy on each table and silently
drops both clauses from every one after it** — [drizzle-orm#4078](https://github.com/drizzle-team/drizzle-orm/issues/4078).
Measured on two projects: **15 of 26** policies lost their restriction on one, **14 of 52** on the other.
The emitted SQL reads `CREATE POLICY "x" ON "t" AS PERMISSIVE FOR SELECT TO "authenticated";` — and a SELECT
policy with no `USING` is **`USING (true)`**.

🔴 **All three artifacts `pull` writes carry the identical loss** — `schema.ts`, the `meta/` snapshot, and the
baseline `.sql`. So no gate built from them can see it (step 7a). Read the truth straight from the catalog:

```bash
psql "$SUPABASE_DB_URL" -Atc "select json_agg(row_to_json(t)) from (
  select tablename, policyname, cmd, roles, permissive, qual, with_check
  from pg_policies where schemaname='public') t;"
```

and render each into `pgPolicy(...)` with `using:` ← `qual` and `withCheck:` ← `with_check`.

⚠️ **Strip leftovers when you replace them.** A `pull`-emitted policy that spans several lines survives a
single-line delete, leaving two `pgPolicy` calls with one name — and drizzle-kit's duplicate-name branch
crashes on its own TDZ bug (`Cannot access 'tableKey2' before initialization`) instead of printing the
message. That error means a **duplicate policy name**, not a broken schema.

#### 🔴 Nine things that break here, every time — all measured on real adoptions

| Symptom | Cause | Fix |
|---|---|---|
| `ReferenceError: unknown is not defined`, and `generate` produces **no diff at all** | introspection cannot parse a type (`tsvector`) and emits `unknown("col")` — a call to a function that does not exist — above a generated placeholder comment that also trips a no-placeholders lint gate | a `customType` (see `schema-authoring.md` → full-text search) |
| `ReferenceError: users is not defined` | `schemaFilter: ['public']` excludes `auth.users`, but every FK to it still references a bare `users` — 40 of them here | `authUsers` from `drizzle-orm/supabase` |
| `ReferenceError: <table> is not defined` | splitting one file into module files breaks cross-module references (`baby`→`people`, `sharing`→`connections`) | add the cross-module imports; then prune the now-unused ones or a strict typecheck fails |
| `Warning: duplicated view name across public schema` | `schema:` points at the **folder** and the recipe's own `index.ts` barrel sits inside it, so every declaration registers twice | point `schema` at `./src/db/schema/index.ts` |
| a permanent, unfixable gate residual naming a foreign object's **sequence** | `tablesFilter` excludes a foreign TABLE but **not its sequence** | document it as a deliberate residual; do not chase it |
| `Cannot read properties of undefined (reading 'value')`, and **no diff at all** | a view whose definition Drizzle cannot serialise (here: `(array_agg(… ORDER BY …))[1]`) | `.existing()` — keeps the shape, emits no DDL; the real definition goes in the raw-SQL baseline |
| `.default(')` — an unbalanced quote that does not parse | an empty-string default `''::text` is emitted with one quote eaten. **25 of them** on one project | `.default('')` |
| 🔴 `.default([""])` on an array column | an empty-array default `'{}'` is emitted as a **one-element array holding an empty string**. **15 of them** on one project | `.default([])`. **Loud on `enum[]` (type error), SILENT on `text[]`** — the silent half is the one that ships |
| 🔴 **A composite FK's column order is SCRAMBLED** — `columns: [table.userId, table.personId]` against `foreignColumns: [people.id, people.userId]` | `pull` hoists `user_id` to the front. **8 of 8** composite FKs on one project. The FK then maps `user_id`→`id`: it rejects valid rows and accepts invalid ones | swap `columns` to match `foreignColumns` positionally. 🔴 **It APPLIES CLEANLY on empty tables**, so a rebuild does not catch it — diff against `pg_get_constraintdef` |
| 🔴 **A check constraint emitted as `CHECK (CHECK (…`** | `pull` puts the full constraint definition inside a `check()` helper that adds its own keyword. Two of the three were **also truncated** | strip the leading `CHECK (` and its matching `)` |
| 🔴 **A DEFAULT expression truncated mid-parenthesis** — `((now() AT TIME ZONE 'utc'` | the `'utc'` string literal confuses the parser; it cuts the expression short and leaves unbalanced parens. Same family as the unbalanced-quote row above | take the truth from `pg_dump --schema-only` and paste it. **Sweep for it:** strip string literals, then count parens in every `sql\`\`` template |
| `ZodError: expected boolean, received string` at `views.…with.securityInvoker` | `securityInvoker` is emitted as the string `"on"` | `.with({ securityInvoker: true })` |

#### 🔴 And two REAL defects introspection introduces, which only the gate catches

- **A backslash in a `sql` template is eaten by JavaScript.** A check constraint round-tripped as
  ``sql`… ~ '…+\.[^@…'` `` — and in a template literal `\.` evaluates to a bare `.`, which in a regex matches
  **any character**. The constraint silently weakened from "contains a literal dot" to "contains anything".
  Write `\\.`. The database stays correct, so this only bites the day somebody recreates the constraint —
  which is precisely why nothing but the gate finds it.
- 🔴 **`.enableRLS()` is not added for you, and POLICY PARITY STRUCTURALLY CANNOT CATCH IT.** Drizzle
  enables RLS implicitly only when a `pgPolicy` exists, so a table that is `relrowsecurity = t` with **zero
  policies** — the deny-all case, reached only through a definer function — comes back claiming RLS is off.
  There are no policies to compare, so gate 7b is blind to it by construction. Hit on three of four
  retrofits: `contact_messages`, `email_deliveries`, and `google_drive_connections` + `rate_limits` — the
  third holding Google OAuth refresh tokens.

  **The gate:** in the **`export`** output, `grep -c '^CREATE TABLE'` must equal
  `grep -c 'ENABLE ROW LEVEL SECURITY'`. 🔴 **Run it on `export`, never on `pull`'s SQL** — pull's SQL is
  generated from the live database and therefore looks correct while `schema.ts` is wrong. Also assert zero
  grants for each deny-all name: a "helpful" regeneration adding one is the whole risk.

### 7a. 🔴 The structural gate — everything EXCEPT policies

🔴 **`generate` into an empty scratch directory does NOT do this.** `generate` diffs `schema.ts` against the
snapshot in its own `out/meta/`; an empty scratch dir means an empty snapshot, so it emits a full
CREATE-everything script (914 lines on the first real adoption) that reads as total drift and proves nothing.

**The gate that works — diff two serialisations of the same shape, one from each side:**

```bash
# A · the LIVE database, as drizzle sees it   (step 5 already produced this)
LIVE=$(ls supabase/.drizzle-introspect/*.sql | head -1)

# B · schema.ts, serialised by the same tool
rm -rf supabase/.drizzle-verify
npx drizzle-kit generate --config drizzle.verify.config.ts
MINE=$(ls supabase/.drizzle-verify/*.sql | head -1)

norm(){ grep -v '^--> statement-breakpoint' "$1" | tr -d '\t' \
        | sed 's/[[:space:]]\+/ /g;s/^ //;s/ $//' | grep -v '^$\|^--\|^/\*$\|^\*/$' | sort; }
diff <(norm "$LIVE") <(norm "$MINE")
```

Same serialiser on both sides, so a residual line is a real difference rather than a formatting artifact.

🔴 **Assert the run SUCCEEDED before reading its output.** Checking "was a `.sql` file emitted" reports
agreement when the run died before writing one — the first adoption printed
*"NO STATEMENT EMITTED — they agree"* over a crashed gate, twice. Grep the output for `malformed|cannot
read|error` and treat a hit as **un-run**, never as pass (`~/.claude/rules/build-test-quality.md`).

🔴 **`migrations.prefix` must be IDENTICAL in the introspect config and the verify config.** Mismatched, the
gate rejects the snapshot as `data is malformed` — which reads like a schema fault and is not one.

**The output must contain no statement that would change the database.** Every residual line is one of two
things:

- a **`schema.ts` defect** — fix `schema.ts`, never the database;
- a **documented lossless difference** — recorded in the tracker with its reasoning (round-tripping is not
  always perfectly faithful: check constraints, some default expressions and comments can re-emit).

🔴 **Nothing proceeds past a diff nobody has explained.** "It's probably fine" is how a `drop column` reaches
a live database. Paste the gate's output into the tracker — a gate result recorded without its input is not
evidence (`~/.claude/rules/build-test-quality.md`).

🔴 **EXCLUDE `CREATE POLICY` lines from this diff — add `| grep -v '^CREATE POLICY'` to `norm()`.** Side A is
`pull`'s output, which carries the clause loss above; once step 6 has transcribed the policies correctly,
side B is *right* and side A is *wrong*, so every corrected policy shows as a difference and the gate argues
you should re-break your schema. This gate covers tables, columns, indexes, enums, views, sequences and
constraints. **Policies are covered by 7b, and only by 7b.**

### 7b. 🔴 The policy-parity gate — against `pg_policies`, the one source `pull` did not write

Render `src/db/schema` with `drizzle-kit export` (offline) and compare every policy — command, roles,
`USING`, `WITH CHECK` — against `pg_policies`. **Pass is 0 missing · 0 mismatched.** Both directions are
failures: a policy only in the database is one the schema would drop; one only in the schema is a restriction
nobody is enforcing.

Ship it as a test so it keeps holding after adoption — this is a pre-approved test class (a parity assertion
parsing an approved artefact). Working reference implementation, with the normalisation and the
balanced-paren clause parser that a greedy regex gets wrong: **`trizlink/src/db/policy-parity.test.ts`**.

### 🔴 Do NOT normalise the clause text by hand — canonicalise it through Postgres

`pg_policies` stores **Postgres's own rendering**, which is not what the schema wrote. A schema saying
`array['lab_owner','lab_manager']::tenant_role[]` is stored as
`ARRAY['lab_owner'::tenant_role, 'lab_manager'::tenant_role]`; table qualifiers vanish, sub-selects gain
`AS <alias>`, keywords change case. A regex normaliser bridging that gap **reports a mismatch on a policy
that is already correct**, and the natural next move is to "fix" the right answer — the same failure shape a
sibling project's text-parity gate hit twice.

**Feed the schema's expression through the same parser instead.** A temp view is session-local, auto-dropped,
and writes nothing:

```sql
create temp view _pp as select (<the schema's USING/WITH CHECK text>) as v from public."<table>";
select pg_get_viewdef('_pp'::regclass);   -- " SELECT (<canonical expr>) AS v\n   FROM <table>;"
drop view _pp;
```

Unwrap `SELECT … AS v` and compare **verbatim** to `qual` / `with_check`. Same parser on both sides, no
normaliser to get wrong. Built and proved on labflow 2026-08-21, where all 8 policies matched byte-for-byte
and a policy weakened to `USING (true)` went red naming itself.
⚠️ Needs the **session** pooler (`:5432`). On the transaction pooler (`:6543`) a temp object does not survive
between statements.

🔴 **Open ONE connection for the whole live describe**, in `beforeAll`. A pool per test exhausted a free-tier
session pooler mid-run and the suite died with `CONNECT_TIMEOUT` — a gate that fails on connections is a gate
whose red says nothing about the schema, which is the same class of lie as a gate that crashes and reads as a
pass.
Gate it on `SUPABASE_DB_URL` with `describe.skipIf`, and 🔴 remember a plain `yarn test` therefore **skips**
it — run it deliberately, and never record a skip as a pass.

🔴 **Prove it non-vacuous, twice, and record both:**
1. against `pull`'s raw baseline `.sql` — it must report the mismatches (15 and 14 on the two real runs);
2. against one deliberately weakened policy — it must go **red naming that policy**, and green on revert.

🔴 **A gate that CRASHES reads as a gate that passed** whenever the check is "was output produced". Assert
the run succeeded before reading it.

### 8. Archive the old files

🔴 **Find the readers FIRST, and do not grep for the joined path.** A test that does
`join(APP, 'supabase', 'migrations', '<file>.sql')` contains no such string, so
`grep -r "supabase/migrations"` reports **clean** and the move breaks it anyway. That false clean happened
on a real adoption. Grep the **filename** and the bare segment:

```bash
grep -rn "migrations" --include="*.ts" --include="*.tsx" src tests | grep -v node_modules
grep -rn "\.sql" --include="*.ts" src tests | grep -v node_modules
```

🔴 **Do not pipe that sweep through `head`.** One real adoption missed a sixth reader because its own search
output was truncated at ten lines — the search lied, not the code, and the miss only surfaced as a failing
suite much later. Read the whole list, and re-run the sweep at the end asserting **zero** remaining literal
references outside the resolver.

🔴 **Some readers take the DIRECTORY, and those are the dangerous ones.** A named-file reader throws and the
suite disappears; a directory reader **keeps working and keeps passing**, having silently narrowed from the
whole history to the baselines. Three of six readers on one project were of that kind.

🔴 **A suite that throws at module scope DISAPPEARS — it does not fail.** The run stays green with fewer
tests in it, which reads exactly like a pass (74 green with 13 missing, on the adoption that found this).
Compare the test COUNT before and after the move, not just the pass/fail.

Resolve readers through a by-name-across-both-folders helper that **refuses** when a block resolves only
from the archive without having survived into a baseline — reference implementation:
`aoneahsan-portfolio/src/db/migration-source.ts`. Prove both branches of that guard.

```bash
mkdir -p supabase/migrations-archive
git mv supabase/migrations/*.sql supabase/migrations-archive/
```

🔴 **Kept in git forever.** They are the record of how the database actually got here, and the source for
step 9. Never deleted — moving is not deleting.

🔴 **AND THEY MAY BE PARSED, NOT JUST READ.** Parity tests import migrations with `?raw` to assert a
constant matches its DDL — the pre-approved test class in `~/.claude/rules/01-authorizations.md`. The first
adoption broke two test files and 16 tests with this `git mv`. **Before moving, grep and repoint:**

```bash
grep -rn "supabase/migrations/" src/ scripts/ --include=*.ts --include=*.tsx
```

### 9. Write the baseline

**THREE** files, all new, none executed:

| File | Content | From |
|---|---|---|
| `<ts>_baseline_schema.sql` | every table, column, index, enum, view and policy | `drizzle-kit export` |
| `<ts+1>_baseline_functions_triggers_grants.sql` | every function, trigger, event trigger, grant/revoke and comment | extracted from the live catalog |
| `<ts+2>_baseline_reference_data.sql` | 🔴 **every seeded ROW** | reproduced **verbatim** from `migrations-archive/` |

🔴 **The third file is the one the recipe used to omit, and omitting it is silent.** Drizzle models no rows
and the raw-SQL baseline models none either, so every seeded row would exist in the database and in **no
file** — invisible until somebody rebuilt from the chain, with every gate green, `migration list` correct and
row counts unchanged. On one project that was 78 rows including the role×capability matrix a `security
definer` function reads: empty, it fails **closed**, and the rebuilt app denies every action. On another it
was 72 projects, 111 images and the published price set.

🔴 **INSERTS ARE NOT ENOUGH — later `update`/`jsonb_set` statements mutate what was seeded.** The archive
is *statements ever written*; the database is *current state*; only replaying **both, in original order**
turns one into the other. On one project 21 archive files issued updates against rows they had seeded, and a
baseline carrying only the INSERTs silently reverted every later correction — caught in one run by a plan
registry test, whose `alerts`/`exportsPerMonth`/`letters` limits vanished.

🔴 **And extracting statements needs a real parser, not a heuristic.** "Read to the first line ending in
`;`" **truncates any statement whose content contains a `;` at end of line** — long prose bodies do. That
produced a page at 590 words against a floor it had passed. **A silently truncated copy of the data is worse
than no copy**, because it looks authoritative. If you cannot split SQL correctly, do not copy it: declare
the archive the data source of record, state the limitation (the chain alone will not reproduce the data),
and record what closing it would take.

**Reproduce those blocks VERBATIM; do not re-serialise them from the database.** Contract tests parse a
specific tuple shape, and a regenerated `INSERT` breaks them while looking equivalent — and verbatim keeps
the reasoning in the comments. **But verify each block against live before freezing it, key by key rather
than by row count**: the archive is *statements ever written*, the database is *current state*. If they
diverge, the database wins and the divergence is the finding.

Drizzle's `meta/` lands in `supabase/migrations/meta/` — the Supabase CLI reads only top-level `*.sql` and
ignores subdirectories.

🔴 **The second file is where adoption is actually won or lost** — and the safest way to build it is
**not** hand-work. Over a real archive (50 files, 10,890 lines on the first adoption) "anything missed is an
object that exists in the database and in no file" is the likely outcome, not the edge case.

**Extract it from the live database instead**, which structurally cannot omit anything:
`pg_get_functiondef` · `pg_get_triggerdef` · `pg_get_viewdef` (for any `.existing()` view) ·
`information_schema.role_table_grants` + `column_privileges` · `pg_proc.proacl` · `pg_description`.
Emit `revoke all … from anon, authenticated, service_role;` per table before its grants, so the end state is
reproduced rather than assumed.

🔴 **State the trade-off in the file's own header: extraction reproduces WHAT is true, not WHY.** The
reasoning stays in `migrations-archive/`, which is exactly why that folder is kept forever.

⚠️ Expect the counts to differ from a `grep` of the archive, and say so rather than "fixing" it — the archive
counts statements ever written, the database holds current state. First adoption: archive 38 `create trigger`
→ 35 live; archive 172 `comment on` → 163 live.

### 10. Reconcile the history

```bash
npx supabase migration repair --status reverted <each archived version> --linked
npx supabase migration repair --status applied  <each baseline version>  --linked
```

🔴 Executes nothing — it only edits `supabase_migrations.schema_migrations`. Verify afterwards:
`npx supabase migration list --linked` shows the two baseline versions and nothing else.

⚠️ **The project may have no history at all.** Check first — `select 1 from pg_namespace where
nspname='supabase_migrations'`. On one real adoption the schema did not exist: those migrations had been
applied through the SQL editor, which records nothing. Then there is nothing to mark `reverted` and only the
baselines are marked `applied`. That absence is itself worth recording — it is a large part of why this
standard exists.

### 11. Regenerate the client types

```bash
npx supabase gen types typescript --linked > src/<path>/database.types.ts
```

Still generated from the **live database**, not from `schema.ts` — that is what makes the two type surfaces
un-driftable.

### 12. Probe

Non-admin (`t1+1`, password read at runtime from `~/.secrets/test-accounts/`, never echoed), against seeded
rows, 403/200 per `raw-sql-boundary.md`. Nothing was applied, so this confirms the **live** behaviour matches
what `pgPolicy` now claims. A policy whose declaration and behaviour disagree is a `schema.ts` defect found
before it could ship.

🔴 **Two questions, two instruments — swapping them yields a confident wrong answer either way**
(`~/.claude/rules/build-test-quality.md`). *What is declared* comes from the **catalogs over the pooler**
(`pg_policies`, `information_schema.column_privileges`, `relrowsecurity`); *how it behaves for a caller*
comes from an **RLS-bearing client**. `postgres` holds `rolbypassrls`, so `psql` proves nothing about whether
a policy stands — and a check read through the `anon` key is measured with the very policy in question.

### 13. Close it

```bash
npx drizzle-kit check                       # migration collisions
yarn typecheck && yarn lint && yarn build   # zero warnings
npx vitest run                              # 🔴 compare the test COUNT to before the archive move
```

🔴 **Four ways this step reports a pass it did not earn**, all measured:

- **`tsc -b` is incremental.** It reported success against a stale `.tsbuildinfo` over a module containing an
  undefined identifier. Plant a deliberate type error once, watch it fail, remove it — then trust the green.
- **`drizzle.config.ts` is in no tsconfig project by default**, so neither `tsc` nor eslint ever reads it —
  the file whose three load-bearing settings decide whether `generate` drops your roles. Add it to the
  node/tooling tsconfig's `include`.
- **The parity gate itself can vanish.** Resolving the baseline path at module scope throws when no baseline
  exists yet, and a test file that throws at import disappears rather than fails. Resolve it **inside** the
  test. A gate must not be capable of vanishing.
- **The parity gate passes alone and times out in the suite.** Its offline half spawns `drizzle-kit export`,
  a whole build tool, so the default 5000ms measures nothing under a loaded run. Give it an explicit long
  timeout and say why — "passes alone, fails in the suite" is a **real** result whose isolated green is the
  misleading half.

⚠️ **Two housekeeping items that cost a red gate each:** add `.drizzle-scratch/**` to the **eslint** ignores
as well as `.gitignore` (it holds `pull`'s raw output, which contains the unbalanced-quote defect and is not
yours to lint), and expect `skipLibCheck` to be needed on a DOM-free tooling tsconfig — drizzle-kit hoists
esbuild 0.18 (`~/.claude/rules/package-version-known-issues.md`).

Re-take the step-2 row counts — **identical**, which is the evidence that nothing was executed. Then:
`docs/PROJECT-CONTEXT.md` records the ref and the standard, `docs/PACKAGES.md` gets the two dependencies, the
`PENDING-TASKS.md` row is renamed `TASK-` → `DONE-` **and moved** to `docs/DONE-TASKS.md`, the fleet tracker
row flips, and it is **one commit** pushed to that repo's decided primary branch. No PR
(`~/.claude/rules/01-authorizations.md`).

## 🔴 Definition of Done — the 14 criteria

The recipe says what to do. **This says how to know you are finished**, which is the half that was missing
when the first adoption was left half-complete mid-session.

Copy these fourteen rows into the project's `PENDING-TASKS.md` entry with an empty Evidence column and fill it
in as you go. An interrupted session is then resumable from the row it reached instead of re-planned.

| # | Criterion | Proven by | Pass condition | Evidence |
|---|---|---|---|---|
| 1 | Right database | `GET /supabase-projects/<ref>` | 200, and `ref` agrees with `config.database.host` | |
| 2 | Gate for the step | the G2 fields | `has.db_password` ∧ `has.db_url_session_pooler` | |
| 3 | Ground truth captured | exact `count(*)` per public table, + the history dump | recorded **before** any change | |
| 4 | Stable versions | `yarn why drizzle-kit` | `0.31.x` — never `1.0.0-beta` | |
| 5 | Config correct | read `drizzle.config.ts` | `schema` → the **barrel**; `entities.roles.provider` + `schemaFilter` + `migrations.prefix` all present | |
| 5b | 🔴 **RLS on every table** | the rendered SQL | `CREATE TABLE` count **==** `ENABLE ROW LEVEL SECURITY` count. 🔴 Count **statements** (`^ALTER TABLE … ENABLE ROW LEVEL SECURITY`), never string matches — a comment stating the check inflates a naive `grep -c` and reads as a failure | |
| 6 | Every object placed | live census vs `schema.ts` | tables · enums · views · policies equal; **nothing unplaced OR undeclared** — see the exclusion note below | |
| 7a | Structural parity | the step-7a diff, **policies excluded** | no statement that would change the database | |
| 7b | 🔴 **Policy parity** | the parity test vs `pg_policies` | **0 missing · 0 mismatched**, clauses included | |
| 8 | 🔴 **Gate proved non-vacuous** | vs `pull`'s raw output, **and** vs one weakened policy | red both times, **naming the policy**; green on revert | |
| 9 | Privilege boundary intact | `information_schema.column_privileges` before/after | narrow `UPDATE` column lists unchanged | |
| 10 | Raw-SQL half complete | live counts vs the baseline file — functions · triggers · event triggers · grants · comments | equal, or the difference explained | |
| 11 | 🔴 **Nothing executed** *(or **REPLAYED** — see below)* | re-take criterion 3's counts | **identical**; `migration list` shows only the baselines | |
| 12 | Project builds | `drizzle-kit check` + `yarn typecheck && yarn lint && yarn build` | zero errors, zero warnings — 🔴 and the typecheck proved honest against a planted error, not merely green | |
| 13 | 🔴 **Reference data carried** | every seeded block, live vs the data baseline | present and verified key-by-key; nothing seeded exists in the database and in no file. 🔴 **Name jsonb payload columns explicitly** — one project compared `plans` on *(key, rank, monthly_usd)* and never looked at `limits`, the column carrying every entitlement | |
| 14 | 🔴 **No suite vanished** | `vitest run` test COUNT **per file**, before vs after the archive move | 🔴 **Compare the INTERSECTION file by file, not the aggregate** — test files added in the same range mask a vanished suite. Measured on vitest 4.1.10: a broken import goes red **but the count silently drops** (226 → 216). State three numbers: before · after · final | |

🔴 **Criterion 6 needs a DECLARED-EXCLUSION list, not a clean census.** Some tables in `public` are not
yours and must be neither modelled nor dropped. Every project with the FilesHub keep-alive enabled carries
**`public."fileshub-project-status-check"`** — FilesHub writes it on a schedule to stop a free-tier project
auto-pausing at ~7 days idle, so dropping it breaks the keep-alive, not just the row. With no way to say
"known, not ours", it reads as unplaced drift on every project forever — and the drift that *matters* then
hides among the noise.

So the gate carries a named map, `{ table: reason }`, and asserts that every live table is **either modelled
or explained**. A new unexplained table is a hard failure; adding one to the map is a deliberate, reviewable
act. Reference: `labflow/src/db/policy-parity.test.ts` → `UNMODELLED_PUBLIC_TABLES`.

🔴 **Do the same for FUNCTIONS, and census TRIGGERS across every schema — a census only measures what it
queries, and its silence reads as a zero.** On labflow the census covered tables, policies, enums, indexes,
constraints, privileges and `private` functions — and criterion 10 still reported trigger and comment counts
that **no query in it had produced**. The answers were right; the method was not.

- **Functions.** Drizzle models none, so nothing in the repo notices one appearing. An unaccounted
  `SECURITY DEFINER` function in a PostgREST-exposed schema is a **second call plane** at
  `POST /rest/v1/rpc/<fn>` that skips a route's step-up, rate limit and audit row
  (`~/.claude/rules/data-fetch-budget.md`, trap 7). Same shape: `UNMODELLED_FUNCTIONS`, `{ qname: reason }`.
- 🔴 **Triggers, across ALL schemas.** A trigger on **`auth.users`** — the usual `handle_new_user` shape — is
  invisible to a `public`-bounded census, so live and file "agree" for the wrong reason and a replay leaves
  every future signup without a profile row.

⚠️ **One platform function is worth knowing by name: `public.rls_auto_enable()`**, wired to Supabase's
`ensure_rls` event trigger. It enables RLS on **every newly created table**, which means a **live**
`relrowsecurity` check can *never* catch a missing `.enableRLS()` — the database looks correct while
`schema.ts` claims RLS is off. That is why criterion 5b reads the **`drizzle-kit export` output**, not the
database. If your deny-all gate queries `pg_class.relrowsecurity`, it is measuring the platform, not you.

### 🔴 Criterion 11 has a second form: REPLAY — and it is the only one that finds a broken chain

The default form ("nothing executed") is right whenever the database must not be touched. But **when the
owner explicitly authorises clearing the database**, criterion 11 upgrades to the strongest proof available:

    take a verified dump → census everything → clear → `supabase db push` → re-census → diff

**Do this if you can get authorisation.** Measured on the trizlink pilot, 2026-08-21: the project read as
*adopted, 12/14 criteria evidenced* — and the chain **could not apply at all**. Three blocking defects and
one silent catastrophe, none of which any gate could see, because a chain written into history by
`migration repair` has never been asked to run:

1. 🔴 **A trigger on `auth.users` was in no file.** The object census was bounded to `public`, so live said
   8 triggers and the file said 8 and they agreed **for the wrong reason**. Replaying would have recreated
   `handle_new_user()` but not `on_auth_user_created`, leaving **every future signup with an auth row and no
   profile row** — silently, forever. 🔴 **Census triggers across ALL schemas.**
2. 🔴 **`drizzle-kit pull` scrambles opclasses on composite indexes** — a third defect class beside the known
   RLS clause loss. 6 of 14 indexes carried wrong opclasses (`uuid` columns marked `timestamptz_ops`, one
   pair swapped outright) → `operator class "text_ops" does not accept data type timestamp with time zone`.
   Strip every `.op()` unless a non-default opclass is genuinely intended.
3. 🔴 **The two-file split is not a valid dependency order** — see the section below.
4. `comment on table` aimed at a **view**; the extractor never read `pg_class.relkind`.

🔴 **Two things a replay must protect, or it becomes the incident it was meant to prevent:**

- **Never `drop schema public cascade` on Supabase.** Schema `public` carries `pg_default_acl` entries owned
  by **`supabase_admin`**, and the pooler connects as `postgres`, which is **not** superuser there — so those
  entries cannot be recreated. **Drop the objects instead** (loop `pg_tables`, `pg_proc`, `pg_sequences`,
  `information_schema.views`, enum types); the schema, its ACL and its default privileges all survive. Verify
  `pg_namespace.nspacl` and `pg_default_acl` byte-identical afterwards.
- **Anything in `public` the chain does not own must be dumped and restored explicitly.** On trizlink that is
  FilesHub's keepalive table — the sweep that stops a free project auto-pausing at ~7 days. Losing it fails
  **nothing today** and pauses the project next week, which reads as an outage, not as a migration error.
  Watch for an identity column: `pull` introspects its sequence as a standalone `CREATE SEQUENCE`, so the
  chain creates the sequence and not the table, and the restore must drop that orphan first.

🔴 **The CLI dump excludes the `auth` schema.** `supabase db dump` will not contain a trigger on `auth.users`,
so the dump alone is not a complete restore path. Say so in the record rather than discovering it later.

### 🔴 Confirmed a second time on clearhire — and five things trizlink did not hit

**clearhire, 2026-08-21.** Same authorisation, same procedure, independently. It read as *adopted, 14/14 with
one stated limitation* — and the chain **could not apply**. Trizlink's three findings all reproduced here
(the `auth.users` trigger; scrambled opclasses; policies-before-functions). Five more did not:

1. 🔴 **`export` also DROPS `DESC` FROM INDEX DEFINITIONS.** Not only the opclasses. All **31** index
   statements differed from live; **8** silently lost a descending ordering (`created_at DESC` →
   `created_at`). The opclass errors abort loudly, so they get fixed; the lost `DESC` is **green forever**.
   **Replace index DDL wholesale from `pg_indexes.indexdef`** rather than fixing the opclasses in place.

2. 🔴 **A public-schema rebuild destroys `public.profiles` while `auth.users` SURVIVES**, and every
   pre-existing account comes back broken. Any plan/limit trigger that joins `profiles` then refuses — here,
   *"A user with no plan is not an unlimited user"* — so the account exists and the product denies it. The
   chain needs a **backfill migration mirroring `handle_new_user()`**, idempotent, a no-op on an empty
   `auth.users`. Without it the push itself aborts on the first fixture that seeds a user-owned row.

3. 🔴 **That forces the data half into TWO files, ordered `plans → profiles → fixtures`.** Reference data
   cannot carry statements that seed rows OWNED BY A USER, because those fire ownership/limit triggers that
   need the profile shadow to exist. Splitting is only safe once you have **checked** that no reference
   statement touches a fixture row or fixture user — check it, do not assume it.

4. 🔴 **A ROW COUNT IS NOT A VALUE, and this is where it bites hardest.** After the backfill, `profiles` came
   back **4 of 4** and looked correct. `handle_new_user()` writes the id and nothing else, so two `is_public`
   flags, one `full_name`, one `plan = 'team'` and an entire fixture team with both memberships were gone —
   every one of them load-bearing for a probe that would then have passed vacuously. **Criterion 13 means
   key-by-key, and the profile table is the one people check by count.**

5. 🔴 **Fingerprint timestamps as EPOCHS, never `::text`.** Rendering a `timestamptz` depends on the session
   `TimeZone`, so the same instant hashes differently in two sessions and reads as 15 differing rows that do
   not differ. That is measuring the instrument.

**Two seeded sets existed in the database and in NO file** — found only by replaying and diffing: an
unpublished `tools` row that is the only thing an anon read must not return, and the fixture team above.
🔴 **Expect ad-hoc probe fixtures to be missing from the chain.** They are created in a SQL editor during
verification, they are exactly the rows that stop a `(200, 0)` being vacuous, and nothing else looks for them.

#### 🔴 COUNT THE COMMENTS. The raw-SQL baseline is where they go missing, and criterion 10 hides it

**clearhire, 2026-08-21, found after the replay had already happened.** The database held **22 comments on
public objects** — 7 on functions, 10 on columns, 5 on tables. The functions/triggers/grants baseline had
carried only the **5 TABLE** comments. Replaying the chain left 5 and **destroyed 17**, and nothing failed.

🔴 **The criterion-10 evidence is what let it through.** It read *"functions live=21 file=21 · triggers
23=23 · 29 revokes, 88 grants, 34 column-grants"* — five measures, all matching, and **comments are named in
criterion 10's own definition and absent from that list.** A criterion the runner never executed reads
exactly like one that passed. Extraction that walks `pg_description` for TABLES only will look complete,
because table comments are the ones people write by hand.

**Take all three counts, live vs the chain, before and after:**

```sql
select case when p.oid is not null then 'FUNCTION'
            when d.objsubid > 0    then 'COLUMN' else 'TABLE' end as kind, count(*)
from pg_description d
left join pg_class c on c.oid = d.objoid and c.relnamespace = 'public'::regnamespace
left join pg_proc  p on p.oid = d.objoid and p.pronamespace = 'public'::regnamespace
where c.oid is not null or p.oid is not null group by 1;
```

⚠️ **Recover them from the dump with a real splitter, not a regex.** The first attempt here read to the next
`;` and found **14 of 22** — a comment whose TEXT contains a semicolon gets cut, which is the same defect the
data baseline exists to avoid. `COMMENT ON` is idempotent, so restoring is a plain forward migration.

#### The baseline `.sql` can drift from `schema.ts`, and clearhire measured zero

`export --sql` vs the committed baseline, statement set to statement set: **205 == 205**, and the only
differences were the 31 index statements deliberately replaced from `pg_indexes`. Worth running — nothing
joins those two by default (`generate` diffs `schema.ts` against `meta/`; `db push` applies the `.sql`) —
but note that on any project which corrected the export's broken index DDL, that check reports the
correction as drift. **Compare non-index statements, or the gate cries wolf on the fix.**

#### If you write a SQL statement splitter, know what the round-trip proves

Carrying reference data verbatim needs statement extraction, and a heuristic will truncate prose containing
`;`. A tokenizer handling `''`, `$tag$`, `--`, `/* */`, `"…"` and `E'…'` fixes that — and its chunks should
**tile the input**, so `join(chunks) === source` is byte-identical *by construction*.

🔴 **But that round-trip proves only that nothing was DROPPED. It does not prove the BOUNDARIES are right.**
A splitter that cuts a statement in half at a `;` inside a string still tiles the input perfectly. Planting
exactly that left the round-trip green; what caught it was **classifying every statement and treating an
unknown leading keyword as a hard failure** — `unknown leading keyword "never"` on a fragment of prose. Keep
both checks; neither is sufficient.

🔴 **And build the gate LAZILY.** Calling the builder at module scope means a throw happens at import, and a
suite that throws at import **vanishes from the run instead of failing** — `Tests: no tests`, which reads
like a pass. Deferring the call turned the same plant into four named failing assertions.

### 🔴 The two-file split is NOT replayable when a policy calls a function

`drizzle-kit` emits the enum, the tables **and the policies** as one file; the recipe then adds one raw-SQL
file for functions/triggers/grants. That ordering is circular the moment RLS uses helper functions, which on
a multi-tenant schema is the normal case:

- policies **call** `workspace_can()` / `is_workspace_member()` → policies must come **after** functions;
- one of those functions **returns an enum** declared in the tables file → functions must come **after** the enum.

So split the schema baseline and use **five** files in this order:

| order | file | contents |
|---|---|---|
| 0 | `…_baseline_schema_tables.sql` | types · sequences · tables · indexes · FKs · `ENABLE ROW LEVEL SECURITY` · views |
| 1 | `…_baseline_functions.sql` | functions + function privileges, headed by `set check_function_bodies = off;` |
| 2 | `…_baseline_policies.sql` | the `CREATE POLICY` statements, moved **verbatim** out of drizzle's output |
| 3 | `…_baseline_triggers_grants.sql` | event triggers · triggers · table + column grants · comments · default privileges |
| 4 | `…_baseline_reference_data.sql` | the seeded rows |

`set check_function_bodies = off` is required because **`LANGUAGE sql` bodies are validated at CREATE time**
while `plpgsql` bodies are not — `pg_dump` sets the same flag for the same reason. Keep the `meta/` snapshot
describing the whole schema (tables *and* policies) and point the journal tag at the tables file;
`drizzle-kit generate` then still reports *"No schema changes, nothing to migrate"*.

🔴 **Extracting seeded tuples needs a real parser.** Strip `--` comments **outside string literals** first: an
apostrophe inside an explanatory comment between tuples ("inside Free's own limits") reads as the start of a
string and silently swallows every row after it. Two of nine rows vanished that way, and under-reading the
FILE makes a genuine divergence look like a clean run.

⚠️ **Do not blanket-regenerate the project's database types.** Some projects hand-author
`src/types/database.ts` with load-bearing decisions. Check `git diff` after any `supabase gen types`.

### 🔴 Five more defect classes, from three adoptions run the same day (2026-08-21)

trizlink, clearhire and aoneahsan-portfolio each replayed a chain against a cleared database on the same
day and compared notes. Every class below was found by **executing** a chain that static gates called clean.
Check all five; they are cheap.

**1. 🔴 `drizzle-kit` STRIPS BACKSLASH ESCAPES in `` sql`` `` template literals — and the silent half is the
dangerous half.** `pull` writes a regex into a JS template literal without escaping the backslash, so
`\d` is a JS escape and becomes plain `d`. **The file greps correct and the runtime value is wrong**, so
you cannot find this by reading. On one project: 3 check constraints `'^\d{4}-\d{2}$'` became
`'^d{4}-d{2}$'` (loud — the replay aborted), and **one generated column** had
`regexp_replace(..., '\s+', ' ', 'g')` become `'s+'` — **silent**, computing reading time
by splitting prose on the letter *s*, forever, with every gate green.

```bash
grep -rn -P '(?<!\\)\\(?![\\`])' src/db/schema/    # any hit is a bug
```

Compare each hit against `pg_get_constraintdef()` or the live generation expression — **never against the
file**. 🔴 Verify that command by *running* it: writing this section mangled its own backslashes twice, in
two different languages, and both times the broken version read perfectly plausibly.

**2. A whole SCHEMA can be missing, not just an object.** One chain referenced `private.is_admin()` **65
times in policies alone** and created the `private` schema and its 13 functions **nowhere**. Its first
"successful" replay was a **false pass**: the teardown was scoped to `public`, so `private` survived and the
policies resolved against leftovers. Against a genuinely empty project it dies on the first policy.

```bash
psql -c "select n.nspname, count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
         where pg_get_userbyid(n.nspowner)='postgres' and n.nspname <> 'public' group by 1"
grep -ci '^create schema' supabase/migrations/*.sql
```

(`extensions` is Supabase's own and is expected; anything else that is yours must be in the chain.)

**3. 🔴 `drop … cascade` is NOT scoped to the schema you name.** CASCADE follows dependencies across schema
boundaries, so `drop function public.handle_new_user() cascade` destroys a trigger on `auth.users`. A
"public-only" teardown is not public-only — which is *why* the missing-`auth`-trigger class is so damaging.

**4. A public-schema rebuild orphans `profiles` while `auth.users` survives.** If accounts already exist,
the wipe destroys their profile rows and the trigger never re-fires for them, so every pre-existing account
comes back profile-less and the first ownership/limit trigger refuses. **Ship an idempotent backfill
migration mirroring `handle_new_user()`, no-op on an empty `auth.users`.** This also forces the data half
into two files — reference data, then profiles, then fixtures — because fixture rows fire ownership triggers
that need the profile shadow to exist. (Projects that seed users *after* the replay avoid this entirely.)

**5. 🔴 A ROW COUNT IS NOT A VALUE — and this is where it bit hardest.** After one backfill `profiles` read
**4 of 4** and looked correct. `handle_new_user()` writes the id and nothing else, so two `is_public` flags,
a `full_name`, a `plan = 'team'` and an entire fixture team with both memberships were gone — every one of
them load-bearing for a probe that would then have passed **vacuously**. Verify restored rows **by value**.

**Also worth knowing, each measured:**

- **`export` drops `DESC` from index definitions** (8 of 31 on one project) — the quiet twin of the opclass
  scrambling, which at least aborts loudly. If you fix opclasses, **re-render the DDL wholesale from
  `schema.ts` rather than patching in place**, then diff against `pg_indexes.indexdef`.
- 🔴 **The baseline `.sql` can drift from `schema.ts` and nothing compares them** — `generate` diffs
  `schema.ts` against `meta/`, `db push` applies the `.sql`, and no gate joins the two. One project carried
  40 lines of drift: four `pull` defects fixed in the TypeScript and never re-rendered.
  **Check: `drizzle-kit export --sql` vs the baseline, statement set against statement set.**
- **`maxValue: 9223372036854775807` as a bare numeric literal** is unrepresentable as a double and emits
  `9223372036854776000` → `out of range for bigint`. The **string** form is safe; or omit it, since it is
  the Postgres default. `grep -rn '9223372036854775807' src/db/schema/`.
- **Generate the privilege section from `pg_proc.proacl`, never by hand** — 13 functions had 9 distinct
  privilege shapes on one project, 4 deliberately keeping default PUBLIC EXECUTE. Trap:
  `(aclexplode(acl)).grantee::regrole::text` renders PUBLIC as **`-`**, not `''` — map it or you emit
  `grant … to "-"`.
- **`supabase db dump` DOES carry the `auth` trigger — with `--schema public,auth,storage`.** The default
  schema list is the limitation, not the tool. 🔴 **No `--schema` list carries an EVENT trigger**, which is
  database-scoped; the chain is the more complete restore path for those.
- **Fingerprint timestamps as EPOCHS, never `::text`** — rendering a `timestamptz` depends on session
  `TimeZone`, so identical instants hash differently and rows read as differing when nothing does.
- **Expect ad-hoc probe fixtures to be missing from the chain.** They get created in a SQL editor during
  verification, they are exactly the rows that stop a `(200, 0)` being vacuous, and nothing looks for them.

🔴 **Three rules stop this being decoration** (`~/.claude/rules/build-test-quality.md`):

- **A row with no pasted evidence is a FAIL, not a skip.** "N/A" needs a reason beside it.
- **Every result names its input** — the ref probed, the base ref, the counts compared. A gate result recorded
  without its input is not evidence.
- **Never report a bare ratio.** State three numbers: **executed · declared-unexecutable · unlocatable.** A
  criterion the runner cannot locate is one that never ran, and it reads exactly like a pass.

**Stopping early is allowed; stopping silently is not.** Write `PART DONE — resume at step N` into the entry
with the evidence you have and what remains, and commit rather than leaving the tree dirty. One real session
ended mid-adoption and a second recovered it purely because that record existed.

### 🔴 A sixth class: an UNQUALIFIED TYPE inside a `search_path = ''` function — found only by creating a user

*(aoneahsan-portfolio, 2026-08-21. This one was live in production, not merely in the chain.)*

`security definer set search_path = ''` is the correct hardening — it is what stops search-path capture. But
an empty `search_path` means **every** unqualified name must be schema-qualified, and **that applies to TYPES,
not just tables**:

```sql
-- looks hardened, IS hardened for tables, and can never insert a row
create function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, role)          -- ✅ qualified
  values (new.id, new.email, 'user'::app_role);          -- 🔴 NOT qualified -> 42704 at RUNTIME
end; $$;
```

**Why every static check misses it.** The table references are correctly qualified, so the function *looks*
right. `create function` does **not** resolve identifiers in a plpgsql body, so it is created without
complaint. `pg_get_functiondef` returns it happily, so a baseline extracted from the live catalog reproduces
the bug faithfully. Typecheck, lint, build, `drizzle-kit check`, the structural gate and the policy gate are
all blind to it. **The only thing that finds it is creating a user**, which returns the uninformative
`{"code":500,"msg":"Database error creating new user"}` — reproduce the insert directly against `auth.users`
in a rolled-back transaction to get the real `42704 / type "app_role" does not exist`.

🔴 **It had been fixed once already and a later migration silently reverted it.** The archive held a
migration whose entire purpose was this fix, with the same diagnosis in its header — and a subsequent
migration re-created the function without the qualification. The pre-wipe dump proved **live** was carrying
the broken form, so signup had been failing on the production site since its cutover, with every gate green.
*A migration file is not database state; a correct fix that is later overwritten reads exactly like a
fix that is still in force.*

**The sweep, which is cheap and should run on every adoption** — it finds the class, not the one instance:

```sql
-- every search_path='' function casting to an UNQUALIFIED public enum
with enums as (select t.typname from pg_type t join pg_namespace n on n.oid=t.typnamespace
               where n.nspname='public' and t.typtype='e'),
f as (select p.oid, n.nspname||'.'||p.proname fn, pg_get_functiondef(p.oid) def,
             array_to_string(p.proconfig,',') cfg
      from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname in ('public','private') and p.prokind<>'a')
select f.fn, e.typname from f join enums e on f.def ~ ('::'||e.typname||'\M')
where f.cfg like '%search_path=%'
  and f.def !~ ('::public\.'||e.typname||'\M')
  and f.def ~ ('(?<!public\.)::'||e.typname||'\M');
```

Run the same shape for unqualified **table** references (`~ '\minsert into (?!public\.|private\.|auth\.)'`).
Both must return zero rows.

🔴 **And this is why criterion 12's probe is "create a real user", not "the function exists".** An adoption
that never creates one will reproduce a broken authentication trigger into the baseline and call it parity —
because it *is* parity. The database and the file agree perfectly, and both are wrong.

## 🔴 The third mode: a REPLAY-PROVEN adoption (habitforge, 2026-08-21)

Greenfield and files-only are not the only two shapes. When the owner authorizes clearing the database —
and **only then**, one task at a time, never inferred — the adoption can be *measured* instead of argued:
dump everything, drop it, replay the chain from zero, and diff the rebuilt database against the dump.

**Do it whenever the authorization is available. It is the only mode that can catch a chain that does not
reproduce**, and on the first project to run it the chain did not reproduce, six ways over, with every
static gate green. Criterion 11 inverts: *nothing executed* becomes **the chain was executed from zero and
reproduced the database**, which is the only form of that claim worth having.

**The order that works** — it is the order `pg_dump` emits, and each step is load-bearing:

1. `extensions` — every extension the schema needs. Drizzle models none.
2. **`pre_schema`** — `set check_function_bodies = false;`, non-public schemas, then **all functions**.
3. `schema` — Drizzle's output: tables, indexes, policies.
4. **`post_schema`** — tables Drizzle does not model, triggers (including any on `auth.users`), comments,
   **function privileges**, late revokes, cron registrations.
5. `reference_data`.

Functions must precede the schema because **policies call them**, and `check_function_bodies = false` is
required because a `LANGUAGE sql` body IS name-resolved at CREATE while `plpgsql` is not — so the SQL ones
reference tables that do not exist yet.

### Phase 0 is not optional, and it is also the oracle

Before anything is dropped: `supabase db dump --role-only`, `-s public,auth,storage`, and
`--data-only --use-copy`, plus a catalog census. **Verify the dump row-for-row against a live count before
trusting it.** 🔴 If `auth` cannot be dumped, **stop and say so** — authorization without a recovery path is
not a reason to proceed. Use `supabase db dump` rather than a local `pg_dump`: the server is Postgres 17 and
a 16.x client refuses outright.

Afterwards the same dump is what the rebuilt database is diffed against, across **12 dimensions**: policies ·
columns · column privileges · table grants · RLS **and FORCE** · triggers · views · indexes · function bodies
· **function ACLs** · comments · sequences.

### 🔴 The six defect classes it found, none visible to any file-reading gate

1. **A hand-assembled baseline can be syntactically invalid** and nobody notices, because
   `migration repair` marks it applied without Postgres ever parsing it. A "verbatim reproduction" spliced 7
   lines of a `create table` body in after an INSERT.
2. **A bigint in a JS number literal is already corrupt.** `maxValue: 9223372036854775807` in a schema file
   is `9223372036854776000` by the time drizzle serialises it — *out of range for type bigint*. Prefer
   omitting min/max and letting Postgres default; check any large integer literal against
   `Number.MAX_SAFE_INTEGER`.
3. **`drizzle-kit pull` scrambles operator classes on composite indexes**, not just RLS clauses — a `uuid`
   column annotated `timestamptz_ops`. **Strip every `.op()`** unless a non-default opclass is genuinely
   intended; live schemas almost never use one. Separately, `generate` **does not render `DESC`/`NULLS`** on
   an index at all, so restate those indexes in raw SQL.
4. **Ordering** — see above.
5. 🔴 **An extraction that inherits the filter it is correcting for reports clean and is not.** The raw-SQL
   extraction filtered `nspname = 'public'` — the same blind spot as `schemaFilter` — so it missed an entire
   `private` schema, **both triggers on `auth.users`** (without which a signup creates no profile), and every
   `cron.job` row. **Sweep by what the database contains, never by the scope the tool was configured with.**
   Concretely: `select nspname from pg_namespace`, and check `pg_trigger` across *all* schemas.
6. 🔴 **Function grants are not optional and the default privileges will not save you.** Postgres grants
   EXECUTE to `PUBLIC` on every new function; `alter default privileges` governs only objects created
   **after** it runs, and a collapsed baseline creates the functions first. Emit an explicit
   `REVOKE ALL ON FUNCTION … FROM PUBLIC, anon, authenticated, service_role` **per function**, then grant
   back exactly what the live ACL showed. Revoking only `PUBLIC` leaves the default's `service_role` grant
   in place.

### Confirmed and extended — lifewell, 2026-08-21 (the second project to replay)

Same mode, same day, a different tree: **ten attempts, twelve defects**, and it **independently reproduced
classes 3, 4 and 5 above** — opclass scrambling (114 of 115 annotations spurious *and* mis-assigned, a `uuid`
column tagged `date_ops`), both ordering faults, and the filter-inheritance blind spot including
`on_auth_user_created` on `auth.users`. Two sessions finding the same three classes on unrelated schemas is
what makes them classes rather than anecdotes.

**Four defect classes this project added, all already in the introspection table above:**

- 🔴 **Composite FK column order is scrambled** — `(user_id, person_id) REFERENCES people(id, user_id)`,
  `user_id` hoisted to the front on **8 of 8**. It maps `user_id`→`id`, so it rejects valid rows and accepts
  invalid ones. 🔴 **It applies cleanly against empty tables**, so the replay does *not* catch it — only a
  diff against `pg_get_constraintdef` does.
- 🔴 **`CHECK (CHECK (…`** — the constraint definition placed inside a `check()` helper that adds its own
  keyword; two of three also truncated.
- 🔴 **A DEFAULT truncated mid-parenthesis** by a string literal inside it (`((now() AT TIME ZONE 'utc'`).
- **`comment on table` emitted for a VIEW** — Postgres refuses outright.

**Three method corrections:**

- 🔴 **Criterion 13's comparison must exclude volatile columns BY NAME** (`created_at`, `updated_at`,
  `gen_random_uuid()` ids). A rebuild necessarily rewrites them, so comparing whole rows guarantees a false
  failure. Fingerprint `to_jsonb(t) - 'created_at' - 'updated_at' - 'id'`, state the exclusions beside the
  number, and compare key-by-key as well.
- 🔴 **Prove the SQL splitter against a fixture the naive heuristic gets WRONG.** The first fixture written
  here was **vacuous** — both splitters returned 4, because no line in it actually *ended* with a `;` inside
  a string. It became evidence only once rewritten to carry exactly that.
- **A `pg_dump` from a 16.x client against the PG17 server refuses**, as class-3's note says. Where
  `supabase db dump` is slow through the pooler, `docker run --rm -e SUPABASE_DB_URL postgres:17 pg_dump …`
  works and keeps the credential out of the process list (`-e VAR` with no value inherits it).

🔴 **Compare `proacl` as a SET, not a string** — it is an array whose order is not semantic, and a string
compare invents differences. 🔴 And expect one benign difference: `ordinal_position` shifts wherever the old
table carried a dropped-column attnum gap. Same columns, same types — physical history, not schema.

## Greenfield — a project with no migrations yet

Steps 1, 3, 4, then author `src/db/schema/` directly and `drizzle-kit generate`. No introspection, no
archive, no repair — and **the `pull` policy defect cannot reach you**, because `pull` never runs. That is
why a greenfield project came through clean while both retrofits did not.

Step **7a** does not apply (there is no prior database to diff against); the first `db push` is the baseline.
🔴 **Step 7b still applies from the first push onward** — it is what keeps `schema.ts` and the database
honest with each other for the life of the project, not just at adoption. Criteria 1–5 and 9–12 apply
unchanged.

## Feeding back

🔴 **A correction found while adopting goes into this skill, not into the project's copy.** A fix made only
in an instance dies with that project — the same rule the rebuild skill carries. Every project after the
first should be cheaper than the one before it, and it only is if the recipe absorbs what each one taught.

## Rollbacks (moved verbatim from SKILL.md, 2026-11-02)

Neither tool generates `down` migrations, and under one database serving dev and prod a rollback that drops a
column destroys live data. Every migration ships a **reviewed** companion at
`supabase/rollbacks/<same-name>.sql`, **never auto-applied** — using one is a **new forward migration**, and
a destructive one is an owner decision every time. `drizzle-kit check` catches snapshot collisions early.

## The pipeline and why not Prisma (moved verbatim from SKILL.md, 2026-11-02)

`src/db/schema/*.ts` is the single source of truth. `drizzle-kit generate` diffs it against the `meta/`
snapshot and writes flat timestamped SQL into `supabase/migrations/`, where `supabase db push` — and nothing
else — applies it. **Why not Prisma:** its `migrate dev` needs a shadow database, and hosted-only means there
is none; `drizzle-kit generate` needs **no connection at all**. Full comparison: `OVERVIEW.md`.
