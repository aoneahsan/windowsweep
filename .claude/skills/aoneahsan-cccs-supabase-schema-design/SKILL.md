---
name: aoneahsan-cccs-supabase-schema-design
description: 'Designing a Postgres schema on Supabase: a reasoned record for every new table, column, enum or index, docs/database/SCHEMA.md with a current Mermaid ERD, reuse before adding, server-side data processing, and moving a Firebase project to Supabase by designing fresh and importing the data. Use when adding or changing a table or column, asked whether a new table is needed, updating the ERD, reviewing a migration, or migrating off Firebase.'
metadata:
  source: 'Owner request 2026-10-21 (LifeWell root, finalize-production-projects-1-at-a-time.md): Firebase projects move to Supabase as a completion gate; every schema addition is reasoned with a Mermaid diagram.'
---

# Supabase schema design

## Overview

The schema is designed, not accumulated. Before anything is added, the existing tables are checked for a home
for it; what is added is written down with its reason; and the diagram always shows the schema as it is.
Drizzle authors the schema and generates migrations (`aoneahsan-cccs-drizzle-orm`); this skill decides
**what** the schema should be.

## 1. The record: `docs/database/SCHEMA.md`

Every Supabase project carries it. Sections, in order:

1. **Diagram** — one Mermaid `erDiagram` of every public table with its key columns, primary and foreign keys
   and cardinality. Split into one diagram per domain when one exceeds ~25 tables, with a top-level map.
2. **Tables** — one line each: purpose, owner column, RLS shape, row-count expectation.
3. **Change log** — one row per schema change, newest first, in the format of `references/change-record.md`.

🔴 The diagram is updated **in the same commit** as the migration. A migration without a matching change-log
row and diagram edit is incomplete.

## 2. Before adding anything — reuse first

Answer in the change record, in this order:

1. Can an existing table carry it (a new value in an existing enum, an existing JSON settings column, an
   existing relation)? If yes, use it.
2. Is it a property of one row (→ column) or a list of things (→ table)? A list in a column is refused.
3. Who owns each row (→ the RLS predicate), and can every list query prove that from its own filters
   (`data-fetch-budget.md`)?
4. What reads it, how often, and in what order (→ the index)? Filtering, sorting, grouping and counting happen
   in the database, then the backend; the client gets only what is shown.
5. What happens on account deletion (→ `on delete cascade` or a kept, anonymised row)?

Conventions: `snake_case`, plural table names, `uuid` keys, `timestamptz` with `created_at` / `updated_at`, an
enum for a closed set, `jsonb` only for genuinely open-ended data. Full checklist:
`references/design-checklist.md`.

## 3. Firebase → Supabase (a completion gate)

A Firestore project is not complete until it runs on Supabase (`aoneahsan-cccs-project-completion`).

1. Design the **best** relational schema for the product as it is today, from its features, not its
   collections. Never mirror document nesting, duplicated denormalised fields or subcollection paths.
2. Draw it in `SCHEMA.md`, write the Drizzle schema, generate and apply the migrations to the project's
   hosted Supabase (`aoneahsan-cccs-supabase`; project creation is the owner's).
3. Import the data with one-off import commands from a Firestore export: map each document to its new rows,
   re-key Firebase uids to Supabase auth users by email, and record counts in and out. The owner allows import
   scripts for this migration (2026-10-21) — they live in the project's migration folder and are deleted after
   the import is verified.
4. Switch the app, remove every Firebase SDK and config, and prove gate 2 with `references/design-checklist.md`
   §Migration proof.

Procedure detail: `references/firebase-migration.md`.

**Related:** `aoneahsan-cccs-drizzle-orm` · `-supabase` · `-postgres-multitenancy-rbac` · `-data-contract` ·
`supabase:supabase-postgres-best-practices` · rule `data-fetch-budget.md`
