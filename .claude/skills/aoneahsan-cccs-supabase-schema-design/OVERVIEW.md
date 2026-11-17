# Supabase schema design — overview

## Purpose

Schemas drift when tables are added without asking whether one already fits. The owner asked (2026-10-21)
that every addition be reasoned and drawn, and that Firebase projects move to Supabase with a schema designed
fresh rather than copied from Firestore. This skill governs what the schema should be; Drizzle governs how it
is written.

## What this skill does

- Keeps `docs/database/SCHEMA.md`: a current Mermaid ERD, a line per table, a change log
- Runs the reuse-first questions before any table, column, enum or index is added
- Sets conventions: naming, keys, timestamps, owner columns, RLS, grants, indexes, server-side aggregation
- Defines the Firebase → Supabase migration: inventory, fresh design, import, switch, proof

## When it gets invoked

Adding or changing a table or column; planning a feature that stores data; reviewing a migration; drawing the
ERD; migrating off Firebase.

## References

- `references/change-record.md` — the change-log row format, with an example
- `references/design-checklist.md` — per-table checks, the Mermaid shape, the migration proof
- `references/firebase-migration.md` — the migration order and its traps
