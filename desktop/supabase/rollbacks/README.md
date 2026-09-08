# Rollbacks — reviewed, never auto-applied

Neither `drizzle-kit` nor the Supabase CLI generates a `down` migration, and this project runs **one hosted
database that serves development and production both**. So a rollback here is not an undo: it is a
**destructive statement against live data**, and it is an owner decision every single time.

Rules:

1. **Nothing in this folder is ever applied automatically.** `supabase db push` reads
   `supabase/migrations/` only and never looks here.
2. **Using one is a NEW FORWARD MIGRATION.** Copy the statement into a fresh
   `drizzle-kit generate --custom` file, have it reviewed, and push that. Never run a file from here
   directly against the database.
3. **Ask the owner first.** Every statement below drops a table, a function or a trigger. There is no local
   copy to restore from.

One file per migration, named identically. The two migrations from 2026-09-05 predate this folder and have
no companion; that is a known gap, not an oversight discovered here.
