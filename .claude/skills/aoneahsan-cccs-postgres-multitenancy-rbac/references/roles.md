# Roles and capabilities

## Two levels, kept apart

```sql
create type platform_role as enum ('user', 'platform_admin');
create type tenant_role   as enum (
  'owner', 'admin', 'manager', 'technician', 'phlebotomist',
  'pathologist', 'billing', 'front_desk', 'clinician', 'patient'
);
```

`platform_role` sits on the profile and answers "is this person staff of *our company*". `tenant_role` sits
on `tenant_members` and answers "what is this person *within this organisation*".

A user can be a manager in one tenant and a technician in another. That is only expressible when the role
lives on the membership — which is the reason for the split, not tidiness.

🔴 **Never mirror the tenant role onto the user row.** Two writers for one value is the most damaging bug
class there is: the answer depends on which code path wrote last, and a policy reading the stale copy grants
or denies wrongly with no visible error.

## The capability registry

Roles are data. **Capabilities are code.**

```ts
export const CAPABILITIES = [
  'patient.read', 'patient.write',
  'sample.receive', 'sample.reject',
  'result.enter', 'result.validate', 'result.approve', 'result.amend',
  'report.sign', 'billing.manage', 'inventory.manage', 'tenant.manage',
] as const;
export type Capability = typeof CAPABILITIES[number];

export const ROLE_CAPABILITIES: Record<TenantRole, readonly Capability[]> = {
  technician:   ['patient.read', 'sample.receive', 'sample.reject', 'result.enter'],
  pathologist:  ['patient.read', 'result.enter', 'result.validate', 'result.approve',
                 'result.amend', 'report.sign'],
  // ...
};
```

**One file.** Changing what a role can do is a deploy; it is not a migration across every user row, and
"who can approve a result" is answered by reading one map.

### Enforcing it

The client reads the registry to decide what to **show**. The refusal lives in the database — either in the
policy directly, or in a helper the policy calls:

```sql
create or replace function has_capability(t uuid, cap text)
returns boolean language sql stable security invoker as $$
  select exists (
    select 1
    from tenant_members m
    join role_capabilities rc on rc.role = m.role
    where m.user_id = auth.uid() and m.tenant_id = t and rc.capability = cap
  );
$$;
```

`role_capabilities` is a small table **generated from the TypeScript registry by a migration**, so the two
cannot disagree. The registry stays the single source; the table is its projection.

## Why not a permission array on the user

The shape LabFlow shipped — 252 keys in an array on the user document — fails three ways:

1. **It sat on a row the user could write.** Self-write on the profile meant the grant list was
   client-modifiable. Integrity looked stronger than it was.
2. **It drifted.** Derived from roles at creation time, then never recomputed when the role definition
   changed. Two users with the same role had different grants depending on when they signed up.
3. **It was unanswerable.** "Who can approve results" required scanning every user.

A role plus a registry has none of those properties.

## Role explosion — the thing to resist

Eleven roles is already a lot. The pressure to add a twelfth usually comes from one customer wanting one
person to do one extra thing.

Resist it. The alternatives, in order of preference:

1. **Widen an existing role** if the capability genuinely belongs to it.
2. **A per-membership capability override** — a small `extra_capabilities` array on `tenant_members`,
   additive only, never subtractive. This handles the one-off without a new role.
3. **A new role**, only when a genuinely distinct job exists across multiple tenants.

Subtractive overrides are excluded deliberately: once a capability can be removed per user, the role no
longer tells you what someone can do, and the model is back to per-user permissions with extra steps.

---

## The capability registry, in code

Moved out of `SKILL.md` 2026-07-30 (size budget). The rule — roles are data, capabilities are code — stays there.

```ts
// ONE registry. The only place a capability maps to a role.
export const ROLE_CAPABILITIES = {
  lab_technician: ['result.enter', 'sample.receive', 'sample.reject'],
  pathologist:    ['result.enter', 'result.validate', 'result.approve', 'report.sign'],
  // ...
} as const;
```

The user carries a **role**; the server derives capabilities from the registry at check time. Changing what a
role can do is a deploy, not a data migration across every user row. The client may read the registry to decide
what to *show* — but the refusal lives in the database.

### Why a stored permission list fails

It fails three ways at once: the list is **stored on a row the user can often write**, it drifts from the roles
it was derived from, and nobody can answer "who can do X" without scanning every user row.
