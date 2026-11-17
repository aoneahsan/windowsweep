# RLS patterns

## The substrate

```sql
create table tenants (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  created_at  timestamptz not null default now()
);

create table tenant_members (
  user_id     uuid not null references auth.users(id) on delete cascade,
  tenant_id   uuid not null references tenants(id) on delete cascade,
  role        tenant_role not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, tenant_id)
);

create index on tenant_members (user_id, tenant_id);
```

The helper every policy uses. `stable` lets Postgres cache it within a statement, so it costs one lookup per
query rather than one per row:

```sql
create or replace function is_tenant_member(t uuid)
returns boolean
language sql
stable
security invoker          -- NOT definer. See the warning below
set search_path = public
as $$
  select exists (
    select 1 from tenant_members
    where user_id = auth.uid() and tenant_id = t
  );
$$;
```

🔴 **`security definer` on a helper like this is a hole**, not a convenience — it runs as the owner and
bypasses RLS on `tenant_members` itself. Use `security invoker` and give `tenant_members` its own policy
letting a user read their own memberships. Reserve `definer` for a narrowly-scoped function that genuinely
must cross a boundary, with `set search_path` pinned and its arguments validated.

## Deny by default, then one policy per table

```sql
alter table samples enable row level security;
alter table samples force row level security;   -- applies to the table owner too
```

**No catch-all.** A policy shaped `for all on all tables` means the next table anyone creates is readable the
moment it exists. Every table gets its own policy, and a table without one returns nothing — which is the
correct failure.

```sql
create policy samples_read on samples
  for select using ( is_tenant_member(tenant_id) );

create policy samples_write on samples
  for insert with check ( is_tenant_member(tenant_id) );

create policy samples_update on samples
  for update using ( is_tenant_member(tenant_id) )
      with check ( is_tenant_member(tenant_id) );
```

`using` controls which rows are visible to the operation; `with check` controls what the new row may look
like. **An update policy needs both** — `using` alone lets a caller move a row into another tenant.

## 🔴 Provable from the query's own filters

The policy is evaluated per candidate row, and **a list fails when any candidate fails**. So:

```sql
-- DENIED — nothing here proves the tenant
select * from samples where batch_id = $1;

-- ALLOWED
select * from samples where tenant_id = $1 and batch_id = $2;
```

This holds for **counts and aggregates too**, and it is the case most often missed:

```sql
-- DENIED
select count(*) from samples where status = 'pending';

-- ALLOWED
select count(*) from samples where tenant_id = $1 and status = 'pending';
```

**Index the aggregated column, not only the filtered ones.** A `sum(turnaround_minutes)` over
`(tenant_id, status)` still reads rows to get the value; the covering index needs the summed column.

## Cross-tenant admin — the branch that hides bugs

```sql
create policy samples_read on samples
  for select using (
    is_tenant_member(tenant_id)
    or (select platform_role from profiles where id = auth.uid()) = 'platform_admin'
  );
```

This is legitimate and it is also the **admin-branch trap**: from an admin session every ordinary-user
failure is invisible. Two consequences, both non-negotiable:

- **Verify as the least-privileged role that should succeed**, never as the admin.
- Every admin read of a patient record is **audited** — see `aoneahsan-cccs-phi-safe-engineering`.

## Patient self-access

A patient reads their own rows without being a tenant member. The policy dereferences one hop:

```sql
create policy results_patient_read on results
  for select using (
    exists (
      select 1 from patients p
      where p.id = results.patient_id
        and p.user_id = auth.uid()
    )
  );
```

A `get`-style lookup per returned row is fine when the looked-up path is **constant across the result set**;
it is cached. It is expensive when the path varies per row — that is when a denormalised owner column earns
its keep.

## The probe procedure

Reading the policy is not verifying it.

1. **Seed.** A `(200, 0)` result satisfies any policy vacuously. Create at least one row in the tenant under
   test and one in a different tenant.
2. **Probe three ways**, issuing the *real* query the application sends:

   | # | As | Query | Expect |
   |---|---|---|---|
   | 1 | a member, least-privileged role | with the tenant filter | **200, ≥1 row** |
   | 2 | a non-member | with the tenant filter | **403 / 0 rows** |
   | 3 | a member | **filter removed** | **403** |

   Probe 3 is the one that matters: it proves the policy is doing the work rather than the `where` clause.
3. **Repeat for writes.** `insert`, `update` and `delete` have separate policies and separate ways to be
   wrong — an `update` missing `with check` passes probe 1 and lets a row be moved between tenants.
4. **Record the result in the module's tracker**, with the status codes. "RLS verified" without codes is a
   claim, not evidence.

## 🔴 A policy cannot police a COLUMN, or a payload's shape

RLS decides **which rows** a caller may touch. It has nothing to say about which **columns** they may write or
whether the body was well formed, and both gaps are closed elsewhere:

- **A column the client must never write** — `role`, `plan`, `is_admin`, a trigger-maintained bucket — is
  protected by a **column-level `GRANT`**, checked before RLS. The rule and its traps (including that Postgres's
  own `HINT` tells you to grant every column) are law in `~/.claude/rules/data-fetch-budget.md`.
- **Request shape** is step 1 of the ordered gate, which runs *above* the database:
  `aoneahsan-cccs-data-contract`.

### The payload consequence worth knowing here

A `PATCH` writes **every key present in the body**, so a client sending `null` for a field the user simply left
blank **overwrites the stored value**. An absent key leaves the column alone. That is why the client-side rule is
to remove the key rather than send `null` — and why "the policy allowed it" and "the write was correct" are
different statements.

This compounds with the status-code behaviour above: a forbidden `UPDATE` is **200 with 0 rows affected**, so a
data-destroying update that RLS *did* permit and a forbidden one that it blocked look identical to any test
asserting 2xx. Assert affected-row counts, then re-read the row.

---

## Pitfalls — the ones already explained above, in one line each

Added 2026-07-30 when `SKILL.md` exceeded the size budget. The four costliest stay there (listing without the
filter the policy reads, verifying as an admin, a `(200, 0)` probe, and `SECURITY DEFINER` as an escape hatch).
These three each have a dedicated section in `SKILL.md` explaining the model; this is the failure each produces.

| Mistake | What happens | Instead |
|---|---|---|
| Tenant in a JWT claim | Revocation takes effect at the next refresh | Membership table, read at query time |
| Role on both the user and the membership | Two answers to one question | Membership row only |
| Permission array on a user-writable row | The client can grant itself capabilities | Role → capability registry, resolved server-side |

**The JWT one is a security bug with a delay fuse.** Removing someone from a tenant feels immediate — the
membership row is gone — while their existing token still carries the claim and keeps working until it expires.
Whatever the refresh interval is, that is how long a revoked user retains access. Reading membership at query
time has a cost and removes the window entirely.

**The permission array is privilege escalation, not untidiness.** If the client can write the row that lists
its own capabilities, the capability check is decoration. A column grant is the enforcement
(`~/.claude/rules/data-fetch-budget.md` — a privilege column is protected by a COLUMN grant, probed three ways),
because RLS decides which *rows* a caller may touch and never which *columns*.

## The admin-branch incident (moved from SKILL.md)

An `or platform_role = 'platform_admin'` branch in a policy silently passes, so every ordinary-user failure
is invisible from an admin session. A sibling project in this fleet reported PASS **twice** on a feature that
was 100% broken for every real user, because the only test run used the admin test identity.
