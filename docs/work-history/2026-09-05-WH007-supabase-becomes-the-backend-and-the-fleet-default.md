# WH007 - Supabase becomes the backend, and the fleet default

| | |
|---|---|
| Date | 2026-09-05 (continuing the same day as WH006) |
| Task | The owner's standing backend directive, recorded fleet-wide; then RW-079 rebuilt on Supabase |
| Status | Complete for everything that does not need a Supabase project. 🔴 Blocked on owner rows 22, 23 and 15 |
| Project | windowsweep, `D:\work\windows-cleanup-root\windows-cleanup` |
| Developer | Ahsan Mahmood (aoneahsan) |
| Model | Opus 5 |

## Executive summary

A standing directive arrived mid-session: **Supabase is the backend for every new
project, never Firebase, unless he names Firebase for that project.** It was
recorded fleet-wide, and then applied to this project's desktop app — which had
been wired to Firebase earlier the same day.

The switch cost code and no data, which is the whole reason it was worth asking
about immediately: nothing had been created on Firebase, so there was nothing to
migrate. After a release there would have been.

## The rule, and where it lives

Recorded in four places, additively. Firebase loses its **default** status and
keeps every other clause, per the union-merge rule — no unique clause was dropped
to make room.

| File | What it now says |
|---|---|
| `rules/services-integrations.md` | The choice itself, in the always-loaded tier. Also: 🔴 never RE-DERIVE a decision to use Firebase because a project looks small or a sibling uses it; and ⚠️ existing Firebase projects are not migrated by this |
| `rules/firebase-cli-automation.md` | A banner: no longer a default. Nothing in it is retired |
| `rules/zero-cost.md` | Supabase leads the allowed list; Firebase stays allowed for projects already on it |
| `rules-detail/supabase-provisioning.md` | 🔴 The blocking template's "use Firebase instead" is now a question only he answers, **not a fallback a blocked session may reach for** — that is exactly how "unless I ask otherwise" becomes "whenever a credential was slow to arrive" |

`rules/` measured 147,809 B afterwards, under the 150,000 warn line.

## What changed in the app

- **`src/db/schema/sync.ts`** — the schema is TypeScript. Two tables, seven
  policies, RLS on both.
- **Two migrations.** The generated DDL, and a hand-written **paired privilege
  block** — because Drizzle emits no `revoke` at all, so a generated
  `create table` lands with Postgres's default grants, and on Supabase the
  default ACL names `anon`, `authenticated` and `service_role` explicitly.
  `revoke … from public` alone removes a grant they never used. `anon` ends up
  holding nothing on either table.
- **`auth.ts`** — Identity Toolkit REST becomes Supabase Auth PKCE. 🔴 **The Rust
  loopback listener was reused unchanged**: Supabase's PKCE flow needs exactly
  the same redirect, so only the exchange differed.
- **`sync.ts`** — Firestore REST becomes PostgREST. Limit 20, keyset by
  `started_at`, every query filtered on the column its policy reads.
- 🔴 **No `.upsert()` on `user_settings`.** PostgREST builds
  `ON CONFLICT DO UPDATE SET` from every payload key and Postgres checks the
  privilege at **plan** time; `user_id` is outside the column-scoped UPDATE
  grant, so an upsert carrying it is refused with a message naming the *table*,
  not the column — which reads exactly like a broken policy. It inserts and
  handles `23505`.
- CSP narrowed from four Google hosts to `*.supabase.co`. `desktop/firebase/`
  deleted.

## 🔴 Blocked on something the code could not reveal

Measured against the FilesHub registry: **all 7 registered Supabase accounts hold
2 projects each** — the free-tier limit, **14 of 14 slots used**, every one a real
named project (growthify, netcage, shortlists ×2, trizlink, labflow,
aoneahsan-portfolio, habitforge, clearhire, custos, linkedin-automation, lifewell,
trialith, callvault).

So windowsweep needs a **new account** before it can have a project, and creating
either is owner-only. Row 23 is now two steps and says so.

**Row 15 changed shape with the backend**, and the old wording would have sent him
to create the wrong credential: Supabase owns the OAuth redirect, so Google
sign-in needs a **Web** client at `https://<ref>.supabase.co/auth/v1/callback`,
not the **Desktop** client the Firebase flow wanted.

⚠️ **This ceiling is not windowsweep-specific.** Under the new directive every new
project will want Supabase, and the next one hits the same wall. Worth deciding
once — more accounts, or a paid tier — rather than per project.

## Gates

`yarn typecheck` 0 · `yarn lint` 0 · `yarn build` zero warnings, no source maps ·
`yarn check:tauri-config` validates against the installed CLI schema ·
`yarn check:prepaint` matches · `drizzle-kit check` clean · 🔴 **the equivalence
gate reports "No schema changes, nothing to migrate"**, so schema and migrations
agree · the dev-surface gate still absent from `dist/` with its control found ·
`anon` granted nothing · CLI self-test **all 151 checks passed** · version parity
`1.1.0` · `npm pack` shows no `desktop/`, `supabase/` or `drizzle` in the listing.

Both CI workflows green on `62a3c5b`.

## A correction made at the close

Every record written during this session dated the directive **2026-09-06**. The
real date is **2026-09-05** — 26 instances across 16 files in both repositories,
corrected before committing.

🔴 **And the first correction pass silently missed six of them.** It walked
`/d/ahsan-notebook/...`, which bash resolves and Python on Windows does not, so
`os.walk` yielded nothing for the notebook tree while the output said "all
corrected". **A path the shell understands is not automatically a path the
interpreter understands** — and the label asserted a result the command had not
produced. The second pass used a Windows path and reported a **count** with a
control, rather than a label.

## Current status

Whole project **78.07%**. The CLI engine has not been touched since 1.1.0, so npm
still equals `main`. All three repositories clean and pushed; `PENDING-TASKS.md`
has no open entries.

## Next steps

1. 🔴 **Row 23** — a new Google account, then a Supabase project under it.
2. 🔴 **Row 22** — the Build Tools UAC click.
3. **Row 15** — follows 23; a **Web** OAuth client.
4. **GATE 4** on ten drafted story surfaces, and the author-page wording question.
5. Then, agent-side: `supabase db push`, RW-081's WebView2 pass and GATE 4 parity,
   RW-082's release, and `cli-strings` — deliberately last, because it changes
   engine source and so belongs with a 1.2.0 version cascade.

## Continuation prompt

> Read `D:\work\windows-cleanup-root\windows-cleanup\CLAUDE.md`, then
> `remaining-work.md` and `docs/features/windowsweep-completion/00-tracker.json`.
> The backend is **Supabase** (owner directive 2026-09-05, fleet-wide in
> `~/.claude/rules/services-integrations.md`); the desktop app was switched the
> same day and its schema, migrations, auth and sync are written, self-consistent
> and CI-green. **Do not re-plan and do not re-derive the backend choice.**
>
> Check first whether owner rows 22, 23 and 15 have landed. If row 23 has:
> resolve the ref from the FilesHub vault (`GET /projects/windowsweep/vault` →
> `supabase`), record it in `docs/PROJECT-CONTEXT.md`, `PATCH` the
> `supabase_project_id` link, then `supabase db push --linked` and verify grants
> from `information_schema.role_table_grants` and policies from `pg_policies` —
> never from the migration text. If row 22 has: RW-081's WebView2 run-to-verify
> and GATE 4 parity pairs at 1440 and 760 (390 is below the product's 760
> minimum and is deliberately not measured).
>
> If neither has landed, the agent-doable work left is P7: seven surfaces
> unwritten plus `cli-strings`, and ten drafted awaiting his GATE 4. Run each
> item's gates, flip its tracker sub-task in the same commit, append a
> `runHistory` row, one commit per repo, push to `o main` and quote the bypass
> line.

## Document history

| Date | Change |
|---|---|
| 2026-09-05 | Created at the close of session 9 |
