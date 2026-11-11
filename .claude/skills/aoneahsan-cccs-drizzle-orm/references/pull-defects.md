# The `drizzle-kit pull` defects and the parity gate — full forensics

> Moved verbatim from `SKILL.md` on 2026-08-25 (context pass: body over the 1,100-word hard cap).
> The body keeps the bans and the gate's law; this file carries the measured evidence and the worked detail.

## 🔴 NEVER trust `drizzle-kit pull` for policies

`pull` (0.31.10, the stable line) **silently drops `using` and `withCheck` from every policy after the FIRST
one on a table** — [drizzle-orm#4078](https://github.com/drizzle-team/drizzle-orm/issues/4078). Measured on
two projects by two sessions: **15 of 26** policies on one, **14 of 52** on the other. It emits

```sql
CREATE POLICY "profiles_select_own" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated";
```

and **a SELECT policy with no `USING` is `USING (true)`** — every authenticated user reads every row.

So: **transcribe every policy from `pg_policies`, never from `pull`'s output.** Greenfield projects are
unaffected; this is a *retrofit* defect.

🔴 **…and policies are not the only thing it corrupts. It also SCRAMBLES OPCLASSES on composite indexes.**
Measured on trizlink 2026-08-21: 19 `.op()` annotations, **6 of 14 indexes wrong** — `uuid` columns
annotated `timestamptz_ops`, and one index's two opclasses **swapped outright**. The result is not a subtle
drift, it is a chain that **cannot apply at all**:

```
ERROR: operator class "text_ops" does not accept data type timestamp with time zone
```

Nothing catches it, because `pull` writes `schema.ts` *and* the snapshot `generate` diffs against, and the
chain is normally never executed. **Strip every `.op()` unless a non-default opclass is genuinely
intended** — introspected ones almost never are.

## 🔴 The gate: policy parity against `pg_policies`

**The one check that works, and the one that cannot.**

An "equivalence gate" — `drizzle-kit generate` emitting no change — **structurally cannot catch the above**:
`pull` wrote `schema.ts` *and* the snapshot `generate` diffs against, with the identical loss, so it compares
two derivations of one broken source and agrees. **A gate comparing two derivations of the same source proves
nothing.**

The gate that works renders `src/db/schema` with `drizzle-kit export` (offline) and diffs every policy —
command, roles, `USING`, `WITH CHECK` — against **`pg_policies`**, the only source that does not come from
`pull`. Pass is **0 missing · 0 mismatched**.

🔴 **Compare the clauses by canonicalising through Postgres, never by normalising text by hand.**
`pg_policies` stores Postgres's rendering (`ARRAY['a'::enum, …]` where the schema wrote
`array['a',…]::enum[]`), so a regex normaliser reports a mismatch on a policy that is **already correct** —
and the natural next move is to "fix" the right answer. Round-trip the schema's own expression through a temp
view + `pg_get_viewdef` and compare verbatim: same parser both sides. `references/adoption.md` → step 7b.

🔴 **Prove it non-vacuous, twice:** run it against `pull`'s raw output (must report the mismatches) and
against one deliberately weakened policy (must go red **naming** it). A gate that **crashes** reads as a gate
that passed whenever the check is "was a file emitted" — assert the run *succeeded* before reading it.

The full 14-row Definition of Done, and the test itself: `references/adoption.md`.

## Body sections compressed in place on 2026-08-25 — originals, verbatim

> The SKILL.md body was over the 1,100-word hard cap; these paragraphs were shortened there. The
> originals are preserved here so nothing is lost.

**Why not Prisma:** `migrate dev` needs a **shadow database**, and hosted-only means there is no local
Postgres and no throwaway project. `drizzle-kit generate` needs **no connection at all**, so schema is
authored before the G2 credential gate passes. Full comparison: `OVERVIEW.md`.

| Banned | Why |
|---|---|
| `drizzle-kit push` | applies directly with no reviewable SQL, and reconciles against objects it does not model — it proposes dropping your functions' dependencies |
| `drizzle-kit migrate` | a **second** history table. The Supabase CLI is the only applier |
| `drizzle-orm@rc` · `drizzle-kit@rc` | the 1.0.0-beta line emits a **directory** per migration, which the Supabase CLI cannot read. 🔴 Supabase's own "existing project" guide tells you to install `@rc` — **do not.** Stable only: `~/.claude/rules/package-version-known-issues.md` |
| `supabase db reset` | unchanged — dev **is** prod |

Two type surfaces, one origin: `database.types.ts` keeps coming from `supabase gen types typescript`, read
from the live database. **Regenerating it is a required step of every migration**, which is what stops the
two diverging.

A chain written into history by `migration repair` has **never run**. If a policy calls a function, the
recipe's file order is circular and the chain cannot apply — measured on the trizlink pilot, which read as
*adopted, 12/14* while being unable to execute a single migration. The order that works is
**tables → functions → policies → triggers/grants → data**, with `set check_function_bodies = off` in the
functions file. Details and the replay form of criterion 11: `references/adoption.md`.

🔴 **Census triggers across ALL schemas, never just `public`** — a trigger on `auth.users` is invisible to a
public-bounded census, so live and file "agree" for the wrong reason, and replaying without it leaves every
future signup without a profile row.

Neither Drizzle nor the Supabase CLI generates `down` migrations, and under one database serving dev and
prod a rollback that drops a column destroys live data. So every migration ships a **reviewed** companion at
`supabase/rollbacks/<same-name>.sql`, **never auto-applied** — using one is a **new forward migration**, and
if it is destructive it is an owner decision every time. `meta/` snapshots are the per-migration history;
`drizzle-kit check` catches collisions before they reach the database.

## SKILL.md summary of the pull defects and the parity gate (moved verbatim, 2026-11-02)

Stable 0.31.10 **silently drops `using`/`withCheck` from every policy after the FIRST on a table**
(drizzle-orm#4078; **15 of 26** and **14 of 52** lost on two real retrofits) — and a SELECT policy with no
`USING` is `USING (true)`: every authenticated user reads every row. It **also scrambles opclasses on
composite indexes** (trizlink: 6 of 14 wrong, one pair swapped), leaving a chain that cannot apply at all.
**Transcribe policies from `pg_policies`, never from `pull`; strip every `.op()`** unless a non-default
opclass is genuinely intended. Full forensics: `references/pull-defects.md`.

An equivalence gate (`generate` emitting no change) **structurally cannot catch the above** — it compares two
derivations of the same broken source. The gate that works diffs `drizzle-kit export` (offline) against
**`pg_policies`**: command, roles, `USING`, `WITH CHECK` — pass is **0 missing · 0 mismatched**.
🔴 **Canonicalise both sides through Postgres** (temp view + `pg_get_viewdef`), never a hand regex — the
regex path "fixes" policies that were already right. 🔴 **Prove the gate non-vacuous twice**: against
`pull`'s raw output and against one deliberately weakened policy, and assert the run *succeeded* before
reading it. The worked test and the canonicalisation: `references/pull-defects.md` · step 7b in
`references/adoption.md`.
