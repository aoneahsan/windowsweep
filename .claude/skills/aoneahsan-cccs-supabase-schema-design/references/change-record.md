# The schema change record

**Last Updated:** 2026-10-21. One row per change in `docs/database/SCHEMA.md` → Change log, newest first.

```markdown
### 2026-10-21 — user_tour_state: one column on profiles, not a table

- **Need:** remember which pages' tour hint a person has already seen, across devices.
- **Existing home checked:** `profiles` (one row per person, owner = `id`) — yes; `user_settings` jsonb — no,
  the settings form rewrites that whole object.
- **Decision:** `profiles.tour_seen_pages text[] not null default '{}'`.
- **Why not a table:** at most ~40 short keys per person, always read and written together, never queried
  across people.
- **RLS:** unchanged (the owner reads and updates their own profile); the column added to the UPDATE grant.
- **Index:** none; read by primary key.
- **Deletion:** goes with the profile row.
- **Migration:** `supabase/migrations/20261021…_tour_seen_pages.sql` · diagram updated: yes.
```

Rules:

- **Need** is the product reason in one sentence, not the code change.
- **Existing home checked** names every candidate considered and why each was refused.
- **Why not a table / why not a column** is answered whenever the choice could go either way.
- A change that alters a grant says so, and the grants gate is re-run (`data-fetch-budget.md`: a column grant
  layered on the default ACL is a silent no-op; revoke the default first).
- A removed or renamed column is a destructive change: the owner's decision (`supabase-provisioning.md`).
