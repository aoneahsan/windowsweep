# windowsweep 1.4.0 - backend contracts

Last Updated: 2026-10-31

The one agreement between the desktop app (`desktop/src`), the website (`windowsweep-web`) and the backend
(`desktop/src/db/schema/*.ts`, `desktop/supabase/migrations/`, `desktop/supabase/functions/`). The main session
owns this file: a writer proposes a change in its report, the change lands here, then in code. Tables, policies
and the diagram: [`database/SCHEMA.md`](database/SCHEMA.md). Owner decisions D55-D63:
[`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md).

**Status (2026-10-31): designed, not applied.** One hosted project, `nlmetjyytgwaxcliusuo`, is development and
production. The main session rehearses each migration in `BEGIN ... ROLLBACK`, applies it, then changes the Auth
settings, sets the secrets and deploys the functions, in the order in `desktop/supabase/README.md`.

## 1. Rules every surface follows

- **Keys.** Clients hold `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` only. RLS, column grants and the
  definer functions below are the boundary. The secret key exists only inside the Edge Functions.
- **Nothing that names a place leaves the machine.** No path, folder, drive label, machine name, Windows user name
  or file content in any request, column or email. A PC is a random install id plus an optional label the person
  types; the app never pre-fills the label from the computer name.
- **Payloads.** Validate before sending. Omit an optional key the person left blank; send `null` only to clear a
  stored value. Never `.upsert()` any table: a column-scoped UPDATE grant refuses it at plan time
  (`permission denied for table ...`, naming the table). Insert, and handle `23505`.
- **Lists.** Default 20, maximum 50 (an export page: 500), keyset cursors, `{ items, next_cursor }`;
  `next_cursor: null` is the end. Counts, totals and reports are computed by the server.
- **Time.** UTC. An allowance month is `YYYY-MM` in UTC and resets at 00:00 UTC on the 1st.
- **The ordered gate** in every function and RPC: shape (422), authentication (401), authorization (403), business
  validity (409/422), then the database.
- **Errors.** Edge Functions answer `{ ok: true, ...shape }` or `{ ok: false, error: { code, message } }`. An RPC
  raises with `message` = a code from section 15 and SQLSTATE `PT<status>`, so PostgREST answers that HTTP status;
  read `error.message` for the code. A refused RLS check is `42501` (403).

## 2. Identity: the device session and the Google link

Anonymous sign-ins are turned on for the project (D58). Every desktop install has a session from its first launch.
The website keeps today's Google sign-in and never signs in anonymously.

Desktop, in order:

1. First launch: create `device_id`, a random UUID v4, once, and keep it in the app's data directory. Never derive
   it from hardware, the machine name or the user name.
2. No stored session: `supabase.auth.signInAnonymously()`. The JWT carries `role: authenticated` and
   `is_anonymous: true`. The server treats it as a **device session**: the allowance and its own device row, and
   no account data (no settings sync, no run sync, no contact request, no plan request).
3. `GET /functions/v1/allowance?device_id=<id>` registers the device to the session (section 4).
4. **"Sign in with Google" links.** With the device session active: `supabase.auth.linkIdentity({ provider:
   'google', options: { redirectTo: <loopback>, skipBrowserRedirect: true } })`, open `data.url` in the system
   browser, receive `code` on the loopback listener, `exchangeCodeForSession(code)`. The user id does not change,
   so the device, its claims and its allowance carry over. The `auth.users` trigger mirrors the email, stamps
   `profiles.verified_at`, gives the two fixed owner emails `superadmin`, and confirms a pending referral.
5. **The Google account already exists** (the loopback receives `error_code=identity_already_exists` instead of
   `code`): call `device_handoff_begin(device_id)` with the device session and keep the code in memory only, run
   today's `signInWithOAuth` flow, then call `device_handoff_complete(device_id, code)` with the new session. If the
   hand-over fails, create a new `device_id`.
6. After step 4 or 5: `POST /functions/v1/account-welcome` (section 9).
7. **Sign out:** `device_handoff_begin` (account session), `signOut()`, `signInAnonymously()`,
   `device_handoff_complete`.
8. **`403 device_owned`** from `allowance`: this PC is registered to another account. Offer "Sign in to that
   account" (step 4 or 5) or "Use this PC as new" (a new `device_id`).

Website: Google sign-in as today. After the first sign-in in a browser it calls `account-welcome`, with the
`?ref=` code it kept from the landing URL when there is one.

The `before_user_created` Auth hook allows Google sign-ups, anonymous sign-ins and email sign-ups for
`aoneahsan.apps.t1@gmail.com` and `aoneahsan.apps.t1+<n>@gmail.com` only. Everyone else gets 403 "windowsweep
accounts sign in with Google." Linking Google onto a device session is not a sign-up, so the hook never sees it.
Users created through the Admin API do not pass through the hook (observed across the fleet), which is how the
test aliases are made.

## 3. What clients read and write directly

| Object | Who | Read | Write |
|---|---|---|---|
| `plans` | anyone | active rows | - |
| `app_config` | anyone | rows with `is_public` (`key`, `value`) | - |
| `latest_app_releases` (view) | anyone | one row per platform and channel | - |
| `profiles` | own row; admins all (existing) | + `referral_code`, `limits_override`, `welcome_sent_at`, `verified_at` | `display_name` (existing) |
| `user_settings` | own row, signed-in accounts | + `legal_notice_seen_at` | existing columns; the flag only through `mark_legal_notice_seen()` |
| `runs` | own rows, signed-in accounts | + `device_id` | insert: today's nine fields + `device_id` |
| `devices` | own rows, device sessions too | `id, label, created_at, last_seen_at` | `label`; delete |
| `plan_requests` | own rows, signed-in accounts | all columns | insert `plan_id, interval, seats, note` |
| `contact_requests`, `admin_audit` | existing | existing | existing |

Every other new table (`run_claims`, `subscriptions`, `plan_grants`, `teams`, `team_members`, `team_invites`,
`referrals`, `webhook_events`, `app_releases`) has no client grant; it is reached through the RPCs and functions
below. `profiles` now also holds one row per device session (`email` null): **every account list filters
`email is not null`.** The anonymous change tightens the existing insert and update policies on `user_settings`,
`runs` and `contact_requests` to signed-in accounts; Google sessions (every 1.3.2 client) are unaffected.

## 4. Real-run allowance

Only a **real** desktop run claims. Dry runs, scans, reports (a run whose sections are all report-only: 0, 24 and 25
today) and every CLI run never claim. The npm CLI is never metered.

Pool order, enforced in `public.claim_run()`: an unlimited plan uses pool `plan`; else the **device** pool
(`device_real_runs_per_month` per PC per month, whoever is signed in on it); else the **account** pool
(`account_extra_real_runs_per_month` per signed-in account per month, never for a device session); else refused.
Each limit is the person's override, else the plan row, else `app_config`.

`allowance` Edge Function (JWT verified; device sessions included):

| Call | Input | 200 | Refusals |
|---|---|---|---|
| `GET /allowance?device_id=` | `device_id` uuid | `{ ok, month, resets_at, device: {used, limit}, account: {used, limit} \| null, plan: {id, name, unlimited}, runs_left, is_anonymous }` | 401; 403 `device_owned`; 422 |
| `POST /allowance` | `{ device_id, sections: int[] }`, 1-64 items, each 0-99 | `{ ok: true, claim_id, pool: 'device'\|'account'\|'plan', allowance }` | **409 `limit_reached`**, with `allowance` beside `error`; 401; 403 `device_owned`; 422 |

`runs_left` is `null` when the plan is unlimited. The section bound is generous because section numbers are
add-only: a new section needs no migration. The same answers come from the RPCs `get_allowance(p_device_id uuid)`
and `claim_run(p_device_id uuid, p_sections smallint[])`, which the function calls as the caller; the RPC returns
`{ ok: false, reason: 'limit_reached', allowance }` rather than raising.

Client rules (as macleanup):

- Claim immediately before a real run starts, and start only on `ok: true`. Keep `claim_id` with the run.
- **Offline, timeout or 5xx:** the real run waits, with "The account server did not answer. Try again when you are
  online; dry runs stay free." Nothing else is blocked.
- A build without the two Supabase variables meters nothing; the Account screen says sign-in is not configured.
- 1.3.2 never claims. Its updater brings it to 1.4.0.

## 5. Plans and entitlements

`plans` is the registry: one row per tier, every number an admin field (section 11). Render prices and limits from
it and the words from the approved copy.

| id | rank | cents month / year | per seat (min) | real runs | report machines | schedules | history export | fleet report |
|---|---|---|---|---|---|---|---|---|
| `free` | 0 | 0 / 0 | no | 15 per PC + 15 signed in | 0 | no | no | no |
| `pro` | 10 | 400 / 3600 | no | unlimited | 5 | yes | yes | no |
| `team` | 20 | 300 / 3000 | yes (3) | unlimited | 5 per seat | yes | yes | yes |

Columns: `id, name, description, rank, is_active, price_month_cents, price_year_cents, per_seat, min_seats,
real_runs_unlimited, device_real_runs_per_month, account_extra_real_runs_per_month, report_machines, schedules,
history_export, fleet_reports`. A null run limit means the `app_config` default. Free keeps run-summary sync,
History across machines and the per-run report export (D62); those are not plan fields.

`app_config`, all public:

| key | default | bounds, checked in SQL |
|---|---|---|
| `device_real_runs_per_month` | 15 | 0-100000 |
| `account_extra_real_runs_per_month` | 15 | 0-100000 |
| `referral_enabled` | `true` | the off switch |
| `referral_points_per_confirmed` | 10 | 0-1000 |
| `referral_reward_threshold` | 3 | 1-100 |
| `referral_reward_plan` | `"pro"` | an active paid plan id |
| `referral_reward_months` | 1 | 1-12 |
| `referral_reward_months_cap_per_year` | 4 | 0-12, rolling 365 days; 0 or at least `referral_reward_months` |
| `referral_claim_window_days` | 30 | 1-365 |

**The plan a person is on is resolved on read** and never stored: the highest-rank plan among their active paid
periods, their active grants and their team's entitlement. No job expires anything.

`my_plan()` (RPC, any session):

```
{ is_anonymous,
  plan: { id, name, rank, real_runs_unlimited, report_machines, schedules, history_export, fleet_reports },
  source: 'free' | 'payment' | 'admin' | 'referral' | 'plan_request' | 'team',
  ends_at,          -- end of the current unbroken stretch of this plan; null on free
  downgrades_to,    -- { id, name } of the plan from ends_at; null on free
  upcoming: [ { plan_id, plan_name, source, starts_at, ends_at } ],   -- banked time, at most 10
  limits_override,  -- object or null
  team: { id, name, role: 'owner' | 'member', seats } | null,
  pending_request: { id, plan_id, interval, seats, created_at } | null }
```

Where each paid feature is refused: real runs in `claim_run`; the multi-machine report in `my_machines_report`;
the history export in `export_my_history`; the fleet report, team creation and invites in `team`. Schedules are the
desktop's alone: the weekly task is a local Task Scheduler entry and the CLI keeps `--install-task` free (D62), so
the switch reads `my_plan().plan.schedules` and no server call exists to refuse.

## 6. Devices, the machine report and the history export

`devices`, own rows (device sessions too): select `id, label, created_at, last_seen_at`; update `{ label }` (1-40
characters, or `null` to clear); delete ("Forget this PC"; its claims keep counting). Rows are created only by
`get_allowance` and `claim_run`. A device belongs to one user at a time.

- `device_handoff_begin(p_device_id uuid)` returns `{ device_id, code, expires_in_seconds: 900 }`. The current
  owner only; the code is single-use and only its SHA-256 is stored.
- `device_handoff_complete(p_device_id uuid, p_code text)` returns `{ device_id }`. A wrong, used or expired code is
  403 `handoff_invalid`.

`runs` (existing; own rows, signed-in accounts) gains **`device_id uuid`**, nullable. 1.4.0 sends it once
`allowance` has registered the device; it must be a device the caller owns, or the insert is refused (`42501`).
Rows synced before 1.4.0 have none.

`my_machines_report(p_days integer default 30)`: signed-in; `plan_required` when the effective `report_machines`
is 0; `p_days` 1-365.

```
{ days, since, machine_limit,
  machines: [ { device_id, label, last_seen_at, runs, real_runs, freed_bytes, estimated_bytes, last_run_at } ],
  other_machines,     -- registered beyond machine_limit: counted, not itemised
  unattributed: { runs, real_runs, freed_bytes, estimated_bytes },   -- runs with no device_id
  totals: { runs, real_runs, freed_bytes, estimated_bytes } }
```

`machines` lists the most recently seen first, at most `machine_limit`. `export_my_history(p_cursor text default
null, p_limit integer default 500)`: signed-in; `plan_required` without `history_export`; `p_limit` 1-500; returns
`{ items: [ { run_id, started_at, mode, dry_run, elevated, sections, freed_bytes, estimated_bytes, duration_ms,
device_id, device_label } ], next_cursor }`, newest first. The desktop writes the CSV or JSON file locally.

## 7. Payments: Polar, dormant until the organization exists (D61)

`polar-checkout` Edge Function (gateway JWT check off; the function runs its own gate):

| Call | Who | Body | 200 | Refusals |
|---|---|---|---|---|
| `GET` | anyone | - | `{ ok: true, available }` | - |
| `POST` | a signed-in account | `{ plan_id, interval: 'month'\|'year', seats? }` | `{ ok: true, url }` | 401; 403 `signed_in_required`; 404 `not_found`; 409 `already_in_team`; 422 `not_purchasable`, `seats_below_minimum`; 503 `billing_unavailable`; 502 `upstream_error` |

`available` is true only when `POLAR_ACCESS_TOKEN`, `POLAR_SERVER`, `POLAR_WEBHOOK_SECRET` and `POLAR_PRODUCTS`
are all set. **While it is false, every pay button is replaced by "Request this plan"** (below). Send `seats` for a
per-seat plan only (default: its minimum). The amount comes from the plan row through `billing_quote`, never from
the client. Open `url` in the system browser. Polar's hosted confirmation is the last page (`return_url` is the
website's `/pricing`); access arrives only through the webhook, so the client re-reads `my_plan()` when the person
comes back. A pay surface carries one line of terms text: "By continuing, you agree to our Terms of Service and
Privacy Policy."

`billing_quote(p_plan_id text, p_interval text, p_seats integer default null)` (RPC, signed-in) returns
`{ plan_id, plan_name, interval, seats, unit_cents, amount_cents, currency: 'usd' }`, with the same refusals.

`polar-webhook` (Polar only): the signature is verified over the raw body (403 wrong, 400 malformed, 503 while the
secret is unset); idempotent on the `webhook-id` delivery and the order id.

- `order.paid`: priced against the plan row times the seats (a renewal against its own subscription's first
  price), then a paid period that **extends** the buyer's time on that plan, and the plan confirmation email. A
  price mismatch grants nothing and is audited.
- `order.refunded` (a payment the bank or Polar returned): that period ends now and is marked returned, so no later
  delivery can restore it, even one that arrives out of order; a "payment returned" email.
- Every other event type, and `metadata.kind` other than `plan`: 202, nothing done.

**Plan requests**, `plan_requests`, own rows, signed-in accounts:

- Insert `{ plan_id, interval, seats?, note? }`; `user_id` defaults to the caller; `note` 1-1000 characters. The plan
  must be active and paid; `seats` is at least the plan's minimum on a per-seat plan and 1 otherwise. Refusals:
  422 (`PT422`) `invalid_plan`, `not_purchasable`, `seats_below_minimum`; **409 `23505`: a request is already
  pending** (one pending per person).
- Select: `id, plan_id, interval, seats, note, status ('pending' | 'granted' | 'declined'), created_at,
  resolved_at`.
- Admins list and resolve them through `admin` (section 11). Granting creates an audited plan grant and emails the
  person.

## 8. Team

`team` Edge Function, signed-in accounts:

| action | body | answer |
|---|---|---|
| `create` | `{ name }` (1-80) | `{ team_id, name, seats }`. Needs a plan with `fleet_reports`; renames the team the caller already owns |
| `invite` | `{ email }` | `{ invite_id, email_sent }`. Owner only; members + open invites must fit the seats; one email per invite per 24 h |
| `invites` | `{}` | `{ items: [ { invite_id, team_name, invited_by, expires_at } ] }`: open invites to the caller's verified email |
| `accept` | `{ invite_id }` | `{ team_id }`. The invited, verified email only |
| `remove` | `{ user_id }` or `{ invite_id }` | `{ removed }`. The owner removes a member or an invite; a member removes themself |
| `fleet` | `{}` | see below |

`fleet` answers `{ team: { id, name, seats, role, machine_limit }, members: [ { user_id, email, display_name, role,
machines, last_run_at, real_runs_30d, freed_bytes_30d } ], invites: [ { id, email, created_at, expires_at } ],
totals: { members, machines, real_runs_30d, freed_bytes_30d, quiet_machines } }`, aggregated in SQL from synced
runs. `invites` is empty for members; `machine_limit` is seats times `report_machines`. Refusals: 403
`plan_required`, `not_team_owner`, `not_in_team`, `invite_email_mismatch`; 404 `invite_not_found`; 409
`already_in_team`, `already_member`, `no_seats`, `owner_cannot_leave`. A Team purchase or grant creates the
buyer's team with its seats; members have Team while the team's entitlement is active; one team per account.

## 9. Referral and the welcome

`account-welcome` (signed-in accounts; idempotent; called after the first Google sign-in on each client):

- Body `{ referral_code? }`: 10 letters or digits, any case.
- Answer `{ ok: true, welcome_sent, referral }`, where `referral` is `'pending' | 'confirmed' | 'invalid_code' |
  'already_recorded' | 'not_verified' | 'too_late' | 'disabled' | null`.
- It records who invited the account (once, within `referral_claim_window_days` of the account becoming a Google
  account, never yourself), sends the welcome email once, and emails the referrer once when the friend is
  confirmed. Refusals: 401; 403 `signed_in_required`; 422.

**Confirmed means the invitee's account exists and its email is verified**, decided in the database from
`auth.users.email_confirmed_at` (the `auth.users` triggers, and the recording call itself), never by a click. Each
confirmation earns `referral_points_per_confirmed` points; every `referral_reward_threshold` confirmations add
`referral_reward_months` of `referral_reward_plan`, at most `referral_reward_months_cap_per_year` months in a
rolling year. Over the cap, points still land. The reward **extends**: it starts when the referrer's current time on
that plan, or a higher one, ends. `referral_enabled = false` stops new confirmations, points and rewards.

`my_referral_status()` (signed-in) gives the settings beside the counts, and never who joined:

```
{ enabled, code, points, confirmed, pending,
  stamps: [timestamptz],     -- confirmation dates, newest 20: the dated, stacking badge
  rule: { points_per_confirmed, threshold, reward_plan: { id, name }, reward_months, cap_months_per_year,
          claim_window_days },
  months_granted_last_year,
  next_reward_in,            -- confirmations still needed; null when off or capped
  rewards: [ { starts_at, ends_at, banked } ] }   -- newest 10; banked = starts in the future
```

The share link is `https://windowsweep.aoneahsan.com/?ref=<code>`. The website keeps the code until sign-in.

## 10. Update flow, layer 2: the release record

Read: anyone, with the publishable key, one row.

```ts
supabase.from('latest_app_releases')
  .select('version, severity, reason, min_native_version, published_at')
  .eq('platform', 'desktop')      // 'web' on the website, 'docs' on the docs site
  .eq('channel', BUILD_CHANNEL)   // 'production', or 'test' in a verification build
  .limit(1)
```

No row, or a failed read: nothing happens (fail open). Compare the running version with `compareSemver` and act on
the table in `aoneahsan-cccs-update-flow` `references/contract.md`: urgent and older blocks now; normal and older
shows the notice now and blocks from the next start. Check after the first paint, every 15 minutes, and when the
window becomes visible (at most once a minute). On the desktop, **Update** runs the Tauri updater and falls back to
the website's download page. A verification uses a `test` row, never a production row.

`app_releases` has no client policy and no client grant. A release is never edited; a mistake is corrected by
publishing a newer row.

`publish_app_release(p_platform text, p_channel text, p_version text, p_severity text, p_reason text,
p_min_native_version text default null)` (admins) returns `{ release: { id, platform, channel, version, severity,
reason, min_native_version, published_at }, previous_version }`. Platform `desktop | web | docs`; channel
`production | test`; versions strict `x.y.z`; severity `urgent | normal`; reason 1-280 characters, written for the
person who will read it. It writes the row and its `admin_audit` row in one transaction. `previous_version` lets
the admin page warn, never block, when the new version is not higher. Refusals: 401, 403 `forbidden`, 422
`invalid_request`. The same call is `admin { action: 'releases.publish', ... }`.

## 11. Admin, for the website's `/admin`

`admin` Edge Function: `POST { action, ... }`, platform role `admin` or `superadmin` (checked with
`is_platform_admin()` and re-checked inside every SQL function). Every write takes `reason` (1-500) and writes its
`admin_audit` row in the same transaction. Lists answer `{ items, next_cursor }`, `limit` 1-50, default 20.

| action | body | answer |
|---|---|---|
| `stats` | - | `{ month, accounts, device_sessions, devices, paying_accounts, active_grants, pending_requests, real_runs_this_month, runs_by_pool, synced_runs_30d, confirmed_referrals }` |
| `users.list` | `{ query?, cursor?, limit? }` | `{ id, email, display_name, role, plan_id, devices, real_runs_this_month, joined_at, verified }`; accounts only; `query` matches email or name as plain text |
| `users.view` | `{ user_id }` | `{ profile, plan (the my_plan shape), devices (50), subscriptions (20), grants (20), real_runs_this_month: { device, account, plan }, referrals: { confirmed, pending, points }, requests (10) }` |
| `users.set_plan` | `{ user_id, plan_id, ends_at?, reason }` | `{ plan_id }` after the change. A grant from now to `ends_at` (required unless `free`); `free` ends the person's active admin and plan-request grants, while paid periods and referral rewards stay |
| `users.override_limits` | `{ user_id, overrides: { real_runs_unlimited?, device_real_runs_per_month?, account_extra_real_runs_per_month?, report_machines? } \| null, reason }` | `{ limits_override }`; `null` clears it |
| `plans.list` | - | `{ items }`: every plan, inactive included |
| `plans.upsert` | `{ plan: { id, ...columns }, reason }` | `{ plan }`. A new id creates (`name`, `rank` required); an existing id changes only the keys sent, and `null` clears a nullable limit; `free` cannot be deactivated |
| `grants.list` | `{ user_id?, active_only?, cursor?, limit? }` | provenance: `{ id, user_id, user_email, plan_id, source, seats, granted_by, reason, starts_at, ends_at, revoked_at, revoked_by, request_id, created_at }`; `granted_by` is an admin's email or `system` |
| `grants.create` | `{ user_id, plan_id, starts_at?, ends_at, seats?, reason }` | `{ id }`; a per-seat plan creates or resizes the person's team |
| `grants.revoke` | `{ grant_id, reason }` | `{ id, revoked_at }` |
| `config.get` | - | `{ items: [ { key, value, is_public, min_value, max_value, description, updated_at, updated_by } ] }` |
| `config.set` | `{ key, value, reason }` | `{ key, value }`. Existing keys only; the value keeps its JSON type; bounds and plan ids are checked in SQL |
| `requests.list` | `{ status?, cursor?, limit? }` | `{ id, user_id, user_email, plan_id, interval, seats, note, status, created_at, resolved_at, resolved_by, grant_id }`, newest first |
| `requests.resolve` | `{ request_id, decision: 'grant'\|'decline', ends_at?, note? }` | grant: a `plan_request` grant (default one month or one year by the request's interval, after the person's current time on that plan) and an email; decline: the status only |
| `releases.list` | `{ platform?, channel?, cursor?, limit? }` | newest first, `created_by` as an email |
| `releases.publish` | as section 10 | as section 10 |
| `audit.list` | `{ filter_action?, cursor?, limit? }` | `admin_audit` rows, newest first, `actor` as an email or `system` |

Refusals: 401; 403 `forbidden`; 404 `not_found`; 409 `free_plan_required`; 422 `invalid_request`, `invalid_plan`,
`invalid_override`, `invalid_value`, `out_of_bounds`.

The five plan-administration capabilities: create a plan and edit its limits (`plans.upsert`), change a person's
plan (`users.set_plan`), override one person's limits (`users.override_limits`), show a grant's provenance
(`grants.list`, `users.view`). The site's existing direct reads stay (`profiles`, `contact_requests`,
`admin_audit`). New `admin_audit.action` values: `plan.create`, `plan.update`, `user.plan`, `user.limits`,
`grant.create`, `grant.revoke`, `config.update`, `plan_request.resolve`, `release.publish`, `billing.paid`,
`billing.returned`, `billing.mismatch`, `billing.unknown_user`, `billing.team_conflict`, `referral.reward`,
`referral.reward_unresolved`, `device.handoff`. A null `actor` means the system (a payment, a referral).

## 12. Account

- `mark_legal_notice_seen()` (signed-in) returns `{ legal_notice_seen_at }`. One-way: the first call stamps the
  server's time; later calls return it unchanged; no client can clear it. Read it from this answer or from
  `user_settings.legal_notice_seen_at`. A device session keeps the flag locally only. When no `user_settings` row
  exists yet, this RPC creates one whose `settings_updated_at` is the epoch, so it never wins the desktop's
  newest-wins settings merge.
- `delete_my_account()` (unchanged) deletes the auth user, and the cascades take `profiles`, `user_settings`,
  `runs`, `contact_requests`, `devices`, `subscriptions`, `plan_grants`, `plan_requests`, an owned team (members
  lose the seat), team memberships and the referrals the person made. What stays, with nothing that names the
  person: `run_claims` rows with `user_id` cleared (so deleting an account does not reset a PC's monthly count), a
  referral where the person was the invitee (invitee cleared; a pending one becomes `void`), `admin_audit`,
  `app_releases` and `webhook_events`.

## 13. Environment

Clients (unchanged): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.

Edge Function secrets, names only:

| Name | Used by | When absent |
|---|---|---|
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEYS`, `SUPABASE_SECRET_KEYS` | all; provided by the platform | 500 `internal_error`, naming the variable |
| `POLAR_ACCESS_TOKEN`, `POLAR_SERVER` (`sandbox` or `production`), `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCTS` (JSON: `pro_month`, `pro_year`, `team_month`, `team_year` to product ids) | `polar-checkout`, `polar-webhook` | checkout dormant: `available: false`, 503 `billing_unavailable` |
| `FILESHUB_API_KEY` (server-side key; no Origin is sent) | `account-welcome`, `polar-webhook`, `team`, `admin` | the email is skipped and logged as `email.skipped`; the request still succeeds |
| `APP_WEBSITE_URL` | email links, `return_url` | `https://windowsweep.aoneahsan.com` |

Auth settings the backend assumes, sent by the main session after the migrations: `external_anonymous_users_enabled:
true`, `security_manual_linking_enabled: true` (`linkIdentity` needs it), `hook_before_user_created_enabled: true`,
`hook_before_user_created_uri: "pg-functions://postgres/public/hook_before_user_created"`. The email provider stays
on for the test aliases' password grant; the hook refuses every other email sign-up.

## 14. Emails, as FilesHub templates

Every email is a FilesHub template, sent as `template` + `variables` (strings only), never raw HTML. The website
session supplies the branded templates (one layout); the slugs and variables are fixed here. A missing key, a
missing template or a refusal is logged and skipped: it never fails the request, and nothing falls back to a raw
email.

| slug | to | when | variables |
|---|---|---|---|
| `windowsweep-welcome` | the account | its first `account-welcome` | `device_runs`, `account_runs`, `app_url` |
| `windowsweep-referral-confirmed` | the referrer | the friend is confirmed (once) | `points`, `total_points`, `confirmed`, `threshold`, `reward_plan`, `reward_months`, `rewarded` (`yes` or `no`), `account_url` |
| `windowsweep-plan-confirmed` | the buyer | `order.paid` granted | `plan_name`, `interval_label`, `amount`, `seats`, `period_start`, `period_end`, `account_url` |
| `windowsweep-payment-returned` | the buyer | `order.refunded` | `plan_name`, `amount_returned`, `plan_now`, `pricing_url` |
| `windowsweep-plan-granted` | the person | `requests.resolve` grant | `plan_name`, `seats`, `ends_at`, `account_url` |
| `windowsweep-team-invite` | the invitee | `team invite` | `team_name`, `invited_by`, `accept_url` (`/account?team_invite=<id>`) |

Dates are `en-GB` long dates in UTC ("1 December 2026"); amounts read `$4.00`. The sender name is `windowsweep`.

## 15. Error codes

| code | HTTP | meaning |
|---|---|---|
| `invalid_request` | 422 | the shape is wrong; the message names the field, never echoes a value |
| `not_authenticated` | 401 | no session, or it expired |
| `signed_in_required` | 403 | a device session where an account is needed |
| `forbidden` | 403 | not an admin |
| `plan_required` | 403 | the person's plan does not include this |
| `device_owned`, `handoff_invalid` | 403 | the device belongs to another account; the hand-over code is wrong, used or expired |
| `not_team_owner`, `not_in_team`, `invite_email_mismatch` | 403 | team ownership or membership |
| `not_found`, `invite_not_found` | 404 | |
| `limit_reached` | 409 | no real runs left this month; `allowance` comes with it |
| `already_in_team`, `already_member`, `no_seats`, `owner_cannot_leave`, `free_plan_required` | 409 | |
| `invalid_plan`, `not_purchasable`, `seats_below_minimum`, `invalid_override`, `invalid_value`, `out_of_bounds` | 422 | business validity |
| `billing_unavailable` | 503 | checkout is not open |
| `upstream_error` | 502 | the database or Polar refused unexpectedly |
| `internal_error` | 500 | logged with an event name, never a value |

## 16. What the privacy page must add (website writer)

1.4.0 uploads, beyond 1.3.2: a random install id and an optional label the person types, and when that PC was last
seen; for each synced run, which of the person's PCs it ran on; a monthly count of real runs per PC and per
account, with the section numbers; and the person's plan, payments through Polar, plan requests, team membership
and referral records. None of it names a path, a machine or a user.

## 17. Open for the owner (not blocking 1.4.0)

- Deleting an account while a Polar subscription still renews: Polar would keep charging an account that no
  longer exists. Checkout is dormant, so nothing can happen before he decides; the options are in the backend
  report of run `2026-10-30-2224`.
- `run_claims` survive account deletion with `user_id` cleared (section 12), as macleanup does, so deleting an
  account cannot reset a PC's monthly count. Confirm, or the cascade deletes them too.
