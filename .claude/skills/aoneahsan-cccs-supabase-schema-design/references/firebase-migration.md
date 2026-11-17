# Firebase → Supabase migration

**Last Updated:** 2026-10-30 (quota and hook traps from SMS App). Earlier 2026-10-21.

## Order

1. **Inventory** — list every Firestore collection, Storage path, Auth provider, Function and rule the app
   uses, and what each feature reads and writes. This is input to the design, not its template.
2. **Design** — the relational schema for today's features (`SKILL.md` §2), drawn in `SCHEMA.md`. Files move to
   FilesHub, never Supabase Storage unless the project records why (`services-integrations.md`).
3. **Provision** — the hosted Supabase project is the owner's to create (`supabase-provisioning.md`); its
   credentials come from the FilesHub vault (`aoneahsan-cccs-fileshub-vault`). Blocked without one.
4. **Schema** — Drizzle schema, generated migrations, RLS and grants, applied to the dev project ref.
5. **Auth** — Google sign-in through `capacitor-auth-manager` against Supabase Auth. Users are matched to their
   old records by verified email at import.
6. **Import** — export Firestore (`gcloud firestore export` or the Admin SDK, read-only), then one-off import
   commands that transform each document into rows, idempotent on a natural key (a re-run inserts 0). Record
   counts in and out per entity in the migration's feature tracker.
7. **Switch** — the app reads and writes only Supabase; Firebase SDKs and config removed; Edge Functions replace
   Cloud Functions (`aoneahsan-cccs-supabase-edge-functions`).
8. **Prove** — `design-checklist.md` §Migration proof, then deploy per `deploy-verification.md`.

## Traps

- Firestore document ids are not uuids: keep the old id in a `legacy_id text unique` column only while the
  import runs, and drop it (owner decision) once nothing reads it.
- Firestore timestamps arrive as `{seconds, nanoseconds}`; convert to `timestamptz` in UTC.
- Denormalised copies in Firestore (a user's name on every post) become one foreign key; never import the copy.
- A Firestore rule's `isAdmin` short-circuit hides missing owner filters: re-test as a non-admin.
- Bigints lose precision as JavaScript numbers (`package-version-known-issues.md`): import them as strings.
- 🔴 **The Firestore free tier's 50,000 reads a day is shared with production** (SMS App, 2026-10-30): two full
  import runs over ~34k documents plus one analysis read exhausted it, and the live app could not read Firestore
  until the daily reset. Export ONCE to a local file (Admin SDK → JSON in the scratchpad, chmod 600, deleted after),
  run every import, re-run and analysis from that file, and count the reads before starting.
- Admin-created import users are `email` sign-ups, so a Google-only `before_user_created` hook refuses them: switch
  the hook off for the import window only, then back on and re-run the 403 probe (SMS App, 2026-10-30).
