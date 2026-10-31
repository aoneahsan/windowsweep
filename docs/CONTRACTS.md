# windowsweep 1.4.0 - backend contracts

Last Updated: 2026-10-31

The one agreement between the desktop app (`desktop/src`), the website (`windowsweep-web`) and the backend
(`desktop/src/db/schema/*.ts`, `desktop/supabase/migrations/`, `desktop/supabase/functions/`). The main session
owns this file: a writer proposes a change in its report, the change lands here, then in code. Tables, policies
and the diagram: [`database/SCHEMA.md`](database/SCHEMA.md). Owner decisions D55-D74:
[`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md).

**Status (2026-10-31): designed, not applied.** One hosted project, `nlmetjyytgwaxcliusuo`, is development and
production. The main session rehearses each migration in `BEGIN ... ROLLBACK`, applies it, then changes the Auth
settings, sets the secrets and deploys the functions, in the order in `desktop/supabase/README.md`.

## 1. Rules every surface follows

- **Keys.** Clients hold `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` only. RLS, column grants and the
  definer functions below are the boundary. The secret key exists only inside the Edge Functions.
- **Nothing that names a place leaves the machine.** No path, folder, drive label, machine name, Windows user name
  or file content in any request, column or email. A PC is represented by a random install id; `devices` stores
  no label, host name or Windows version.
- **Payloads.** Validate before sending. Omit an optional key the person left blank; send `null` only to clear a
  stored value. Never `.upsert()` any table: a column-scoped UPDATE grant refuses it at plan time
  (`permission denied for table ...`, naming the table). Insert, and handle `23505`.
- **Lists.** Default 20, maximum 50, including export pages. A list uses either a keyset
  `{ items, next_cursor }` or a bounded `{ items, page, limit, next_page }` contract; a null next value is the end.
  Counts, totals and reports are computed by the server.
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
| `profiles` | own row; admins all (existing) | + `referral_code`, `limits_override`, `welcome_sent_at`, `verified_at`, `referral_eligible_at`, `legal_notice_seen_at` | `display_name` (existing); the legal flag only through `mark_legal_notice_seen()` |
| `user_settings` | own row, signed-in accounts | existing columns | existing columns |
| `runs` | own rows, signed-in accounts | + `device_id` | insert: today's nine fields + `device_id` |
| `devices` | own rows, device sessions too | `id, created_at, last_seen_at` | delete |
| `plan_requests` | own rows, signed-in accounts | all columns | insert `plan_id, interval, seats, note` |
| `contact_requests`, `admin_audit` | existing | existing | existing |

Every other new table (`run_claims`, `subscriptions`, `plan_grants`, `teams`, `team_members`, `team_invites`,
`referrals`, `badge_catalogue`, `referral_badge_awards`, `webhook_events`, `app_releases`) has no client grant; it is reached through the RPCs and functions
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
| `referral_badge_key` | `"referral_confirmed"` | an active referral badge in `badge_catalogue` |
| `referral_reward_threshold` | 3 | 1-100 |
| `referral_reward_plan` | `"pro"` | an active paid plan id |
| `referral_reward_months` | 1 | 1-12 |
| `referral_reward_months_cap_per_year` | 4 | 0-12, rolling 365 days; 0 or at least `referral_reward_months` |
| `referral_claim_window_days` | 30 | 1-365 |
| `referral_signup_window_minutes` | 60 | 1-1440; attach a referral code only this soon after first email-bearing account conversion |

**The plan a person is on is resolved on read** and never stored: the highest-rank plan among their active paid
periods, their active grants and their team's entitlement. No job expires anything.

`my_plan()` (RPC, any session):

```
{ is_anonymous,
  plan: { id, name, rank, real_runs_unlimited, report_machines, schedules, history_export, fleet_reports },
  source: 'free' | 'payment' | 'admin' | 'referral' | 'team',
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

`devices`, own rows (device sessions too): select `id, created_at, last_seen_at`; delete ("Forget this PC";
its claims keep counting). Rows are created only by `get_allowance` and `claim_run`. A device belongs to one
user at a time. The client may label rows by position for display; no label is stored or synced.

- `device_handoff_begin(p_device_id uuid)` returns `{ device_id, code, expires_in_seconds: 900 }`. The current
  owner only; the code is single-use and only its SHA-256 is stored.
- `device_handoff_complete(p_device_id uuid, p_code text)` returns `{ device_id }`. A wrong, used or expired code is
  403 `handoff_invalid`.

`runs` (existing; own rows, signed-in accounts) gains **`device_id uuid`**, nullable. 1.4.0 sends it once
`allowance` has registered the device; it must be a device the caller owns, or the insert is refused (`42501`).
Rows synced before 1.4.0 have none.

`my_machines_report(p_days integer default 30, p_limit integer default 20, p_page integer default 0)`:
signed-in; `plan_required` when the effective `report_machines` is 0; days 1-365, limit 1-50, page 0-1000.

```
{ days, since, machine_limit, total_machines, page, limit, next_page,
  machines: [ { device_id, last_seen_at, runs, real_runs, freed_bytes, estimated_bytes, last_run_at } ],
  other_machines,     -- registered beyond machine_limit: counted, not itemised
  unattributed: { runs, real_runs, freed_bytes, estimated_bytes },   -- runs with no device_id
  totals: { runs, real_runs, freed_bytes, estimated_bytes } }
```

`machines` pages the eligible machines, most recently seen first, without exceeding `machine_limit` or 50 per call.
`export_my_history(p_cursor text default null, p_limit integer default 20)`: signed-in; `plan_required` without
`history_export`; `p_limit` 1-50; returns
`{ items: [ { run_id, started_at, mode, dry_run, elevated, sections, freed_bytes, estimated_bytes, duration_ms,
device_id } ], next_cursor }`, newest first. The desktop writes the CSV or JSON file locally.

## 7. Payments: Polar, dormant until the organization exists (D61)

`polar-checkout` Edge Function (gateway JWT check off; the function runs its own gate):

| Call | Who | Body | 200 | Refusals |
|---|---|---|---|---|
| `GET` | anyone | - | `{ ok: true, available }` | - |
| `POST` | a signed-in account | `{ plan_id, interval: 'month'\|'year', seats? }` | `{ ok: true, url }` | 401; 403 `signed_in_required`; 404 `not_found`; 409 `already_in_team`; 422 `not_purchasable`, `seats_below_minimum`; 503 `billing_unavailable`; 502 `upstream_error` |

`available` is true only when `POLAR_ACCESS_TOKEN`, `POLAR_SERVER`, `POLAR_WEBHOOK_SECRET` and `POLAR_PRODUCTS`
are all set. **While it is false, every pay button is replaced by "Request this plan"** (below). Send `seats` for a
per-seat plan only (default: its minimum). The amount comes from the plan row through `billing_quote`, never from
the client. The website redirects the same tab to Polar's hosted checkout; the desktop opens it in the system
browser. Polar returns to a website page that confirms the purchase against the server. Access arrives only
through the webhook, so the client re-reads `my_plan()` on return. A pay surface carries one line of terms text:
"By continuing, you agree to our Terms of Service and Privacy Policy."

`billing_quote(p_plan_id text, p_interval text, p_seats integer default null)` (RPC, signed-in) returns
`{ plan_id, plan_name, interval, seats, unit_cents, amount_cents, currency: 'usd' }`, with the same refusals.

`polar-webhook` (Polar only): the signature is verified over the raw body (403 wrong, 400 malformed, 503 while the
secret is unset); idempotent on the `webhook-id` delivery and the order id.

- `order.paid`: the first order is checked against the checkout price quoted from the plan row. A renewal is
  checked against that subscription's first paid period, so a later admin price change does not alter a running
  subscription (D67). A valid paid period **extends** the buyer's time on that plan and sends the confirmation
  email. A mismatch grants nothing and is audited.
- `order.refunded` (a payment the bank or Polar returned): that period ends now and is marked returned, so no later
  delivery can restore it, even one that arrives out of order; a "payment returned" email.
- Every other event type, and `metadata.kind` other than `plan`: 202, nothing done.

**Plan requests**, `plan_requests`, own rows, signed-in accounts:

- Insert `{ plan_id, interval, seats?, note? }`; `user_id` defaults to the caller; `note` 1-1000 characters. The plan
  must be active and paid; `seats` is at least the plan's minimum on a per-seat plan and 1 otherwise. Refusals:
  422 (`PT422`) `invalid_plan`, `not_purchasable`, `seats_below_minimum`; **409 `23505`: a request is already
  pending** (one pending per person).
- Select: `id, plan_id, interval, seats, note, status ('pending' | 'notified' | 'closed'), created_at,
  notified_at, closed_at`.
- When checkout opens, `requests.notify_open` emails each pending requester a pay link and marks the request
  `notified` only after a successful send. `requests.close` then closes it. A failed email leaves the request
  pending for retry. Neither action grants access; an admin grant uses `grants.create` separately (D68).

## 8. Team

`team` Edge Function, signed-in accounts:

| action | body | answer |
|---|---|---|
| `create` | `{ name }` (1-80) | `{ team_id, name, seats }`. Needs a plan with `fleet_reports`; renames the team the caller already owns |
| `invite` | `{ email }` | `{ invite_id, email_sent }`. Owner only; members + open invites must fit the seats; one email per invite per 24 h |
| `invites` | `{ limit?: 1..50, page?: 0..1000 }` | `{ items: [ { invite_id, team_name, invited_by, expires_at } ], page, limit, next_page }`: open invites to the caller's verified email, paged 20 by default |
| `accept` | `{ invite_id }` | `{ team_id }`. The invited, verified email only |
| `remove` | `{ user_id }` or `{ invite_id }` | `{ removed }`. The owner removes a member or an invite; a member removes themself |
| `fleet` | `{ limit?: 1..50, page?: 0..1000 }` | see below; defaults to 20 rows from page 0 |

`fleet` answers `{ team: { id, name, seats, role, machine_limit }, members: [ { user_id, email, display_name, role,
machines, last_run_at, real_runs_30d, freed_bytes_30d } ], runs: [ { member_id, device_id, started_at, mode,
sections, freed_bytes } ], invites: [ { id, email, created_at, expires_at } ], totals: { members, machines,
real_runs_30d, freed_bytes_30d, quiet_machines }, page, limit, next_page }`, aggregated and paged in SQL from synced runs.
`next_page` is null when members, runs and invites are exhausted. No path,
file name, machine name or Windows user name is returned (D69). `invites` is empty for members;
`machine_limit` is seats times `report_machines`. `seats` is derived from the active subscription or grant,
never stored on `teams`. Refusals: 403
`plan_required`, `not_team_owner`, `not_in_team`, `invite_email_mismatch`; 404 `invite_not_found`; 409
`already_in_team`, `already_member`, `no_seats`, `owner_cannot_leave`. A Team purchase or grant creates the
buyer's team with its seats; members have Team while the team's entitlement is active; one team per account.

## 9. Referral and the welcome

`account-welcome` (signed-in accounts; idempotent; called after the first Google sign-in on each client):

- Body `{ referral_code? }`: 10 letters or digits, any case.
- Answer `{ ok: true, welcome_sent, referral }`, where `referral` is `'pending' | 'confirmed' | 'invalid_code' |
  'already_recorded' | 'too_late' | 'disabled' | null`.
- It records who invited a fresh account (once, within `referral_signup_window_minutes` of
  immutable `profiles.referral_eligible_at`, never yourself), sends the welcome email once, and emails the referrer once when the friend is
  confirmed. Refusals: 401; 403 `signed_in_required`; 422.

**Confirmed means the invitee's account exists and its email is verified**, decided in the database from
`auth.users.email_confirmed_at` (the `auth.users` triggers, and the recording call itself), never by a click.
Verification must occur within `referral_claim_window_days` from that conversion; an expired pending referral
earns nothing. Each valid confirmation earns `referral_points_per_confirmed` points and one dated,
stacking award of the active `referral_badge_key`; an unresolved badge key fails the transaction before
confirmation. Every `referral_reward_threshold` confirmations add
`referral_reward_months` of `referral_reward_plan`, at most `referral_reward_months_cap_per_year` months in a
rolling year. Over the cap, points and the badge still land. The reward starts after the referrer's currently recorded
time on that plan or a higher one, including an active Team seat. Later paid or Team coverage moves a fully banked
reward, or pauses an already-started reward so only uncovered time uses it. `referral_enabled = false` stops new
confirmations, points and rewards. Clearing the rolling cap alone
does not award a month: a later confirmation must complete another threshold.

`my_referral_status()` (signed-in) gives the settings beside the counts, and never who joined:

```
{ enabled, code, points, confirmed, pending, expired,
  stamps: [timestamptz],     -- legacy confirmation dates, newest 20
  badges: [ { key, name, family: 'referral', awarded_at } ],  -- newest 20
  rule: { points_per_confirmed, threshold, reward_plan: { id, name }, reward_months, cap_months_per_year,
          claim_window_days, signup_window_minutes, badge: { key, name } },
  months_granted_last_year, months_earned_total,  -- active, nonvoid referral grant months across all years
  next_reward_in,            -- confirmations still needed; null when off or capped
  rewards: [ { starts_at, ends_at, banked, paused } ] }   -- newest 10; banked = future start; paused = started but currently covered by paid/Team time
```

The share link is `https://windowsweep.aoneahsan.com/?ref=<code>`. The website keeps the code until sign-in.
Fully banked referral grants move with later paid or Team coverage and retain their full calendar-month duration.
Once a grant starts, only elapsed time outside that coverage consumes its remaining balance; a renewal pauses it
and moves the unspent portion after the covered time. `months_earned_total` and the rolling yearly cap use the
original earned `months` and `created_at`, regardless of shifts or pauses.

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
the GitHub Releases page. A verification uses a `test` row, never a production row.

`app_releases` has no client policy and no client grant. A release is never edited; a mistake is corrected by
publishing a newer row.

`publish_app_release(p_platform text, p_channel text, p_version text, p_severity text, p_reason text,
p_min_native_version text default null)` (admins) returns `{ release: { id, platform, channel, version, severity,
reason, min_native_version, published_at }, previous_version }`. Platform `desktop | web | docs`; channel
`production | test`; versions strict `x.y.z`; severity `urgent | normal`; reason 1-280 characters, written for the
person who will read it. It writes the row and its `admin_audit` row in one transaction. `previous_version` lets
the admin page warn, without blocking, when the entered version is above the deployed build: that record would
block every installed build. Refusals: 401, 403 `forbidden`, 422
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
| `plans.list` | `{ limit?: 1..50, page?: 0..1000 }` | `{ items, page, limit, total, next_page }`: inactive plans included; 20 per page by default |
| `plans.upsert` | `{ plan: { id, ...columns }, reason }` | `{ plan }`. A new id creates (`name`, `rank` required); an existing id changes only the keys sent, and `null` clears a nullable limit; `free` cannot be deactivated. `rank` and `fleet_reports` are locked when changing them would move active or banked referral time; create a new tier or wait until that time is used |
| `badges.list` | `{ limit?: 1..50, page?: 0..1000 }` | `{ items: [ { key, name, family, is_active } ], page, limit, total, next_page }`; referral catalogue, 20 per page by default |
| `badges.create` | `{ key, name, reason }` | `{ key, name, family: 'referral' }`; audited, duplicate key refused |
| `grants.list` | `{ user_id?, active_only?, cursor?, limit? }` | provenance: `{ id, user_id, user_email, plan_id, source, seats, granted_by, reason, starts_at, ends_at, revoked_at, revoked_by, created_at }`; `granted_by` is an admin's email or `system` |
| `grants.create` | `{ user_id, plan_id, starts_at?, ends_at, seats?, reason }` | `{ id }`; a per-seat plan creates or resizes the person's team |
| `grants.revoke` | `{ grant_id, reason }` | `{ id, revoked_at }` |
| `config.get` | `{ limit?: 1..50, page?: 0..1000 }` | `{ items: [ { key, value, is_public, min_value, max_value, description, updated_at, updated_by } ], page, limit, total, next_page }`; 20 per page by default |
| `config.set` | `{ key, value, reason }` | `{ key, value }`. Existing keys only; the value keeps its JSON type; bounds and plan ids are checked in SQL |
| `requests.list` | `{ status?, cursor?, limit? }` | `{ id, user_id, user_email, plan_id, interval, seats, note, status, created_at, notified_at, closed_at, closed_by }`, newest first |
| `requests.notify_open` | `{ cursor?, limit? }` | `{ sent, failed, next_cursor }`; after checkout opens, send the pay link to pending requesters through the approved FilesHub template, with a bounded page of 20 |
| `requests.close` | `{ request_id, reason }` | `{ id, status: 'closed' }`; closes a notified request, with no plan grant |
| `referrals.void` | `{ referral_id, reason }` | `{ id, status: 'void' }`; revokes that referral's points, badge and any surplus referral reward grants, newest/future first; never a paid or admin grant |
| `emails.uncertain` | `{ kind: 'welcome' \| 'referral' \| 'team_invite' \| 'plan_request', limit?, page? }` | `{ items, page, limit, total, next_page }`; claims whose send outcome is unknown |
| `emails.reconcile` | `{ kind, id, outcome: 'sent' \| 'retry', reason }` | an audited resolution; `retry` releases a claim for one deliberate resend |
| `emails.billing_list` | `{ limit?: 1..50, page?: 0..1000 }` | `{ items: [ { event_id, template, created_at, claimed_at, uncertain_at, sent_at, email, state } ], page, limit, total, next_page }` |
| `emails.billing_reconcile` | `{ event_id, template, outcome: 'sent' \| 'retry', reason }` | `{ event_id, template, outcome }`; audited |
| `emails.billing_send` | `{ event_id, template, reason }` | `{ outcome: 'accepted' \| 'refused' \| 'uncertain' \| 'not_pending' }`; audited retry of pending mail, without replaying billing |
| `releases.list` | `{ platform?, channel?, cursor?, limit? }` | newest first, `created_by` as an email |
| `releases.publish` | as section 10 | as section 10 |
| `audit.list` | `{ filter_action?, cursor?, limit? }` | `admin_audit` rows, newest first, `actor` as an email or `system` |

Refusals: 401; 403 `forbidden`; 404 `not_found`; 409 `free_plan_required`,
`referral_rewards_block_plan_shape_change`; 422 `invalid_request`, `invalid_plan`,
`invalid_override`, `invalid_value`, `out_of_bounds`.

The five plan-administration capabilities: create a plan and edit its limits (`plans.upsert`), change a person's
plan (`users.set_plan`), override one person's limits (`users.override_limits`), show a grant's provenance
(`grants.list`, `users.view`). The site's existing direct reads stay (`profiles`, `contact_requests`,
`admin_audit`). New `admin_audit.action` values: `plan.create`, `plan.update`, `user.plan`, `user.limits`,
`grant.create`, `grant.revoke`, `config.update`, `badges.create`, `plan_request.notify_open`,
`plan_request.close`, `release.publish`, `billing.paid`,
`billing.returned`, `billing.mismatch`, `billing.unknown_user`, `billing.team_conflict`, `referral.reward`,
`referral.reward_unresolved`, `device.handoff`. A null `actor` means the system (a payment, a referral).

## 12. Account

- `mark_legal_notice_seen()` (signed-in) returns `{ legal_notice_seen_at }`. One-way: the first call stamps the
  server's time on `profiles`; later calls return it unchanged; no client can clear it. A device session keeps
  the flag locally only. The flag never participates in the newest-wins settings merge.
- `delete-account` Edge Function authenticates the caller, repeatedly fetches up to 20 active Polar subscription
  ids and cancels and marks each on the server until none remain, then calls `delete_my_account()`. It always reads
  the first page again after a cancellation so mutating rows cannot skip another subscription. A cancellation
  failure leaves the account intact. Checkout is dormant
  while Polar credentials are unset. `delete_my_account()` refuses an active subscription with 409
  `subscription_active`, so a direct RPC call cannot bypass cancellation (D70).
- After deletion, cascades take `profiles`, `user_settings`, `runs`, `contact_requests`, `devices`, subscriptions,
  grants, requests, an owned team, team memberships, invite codes and every referral where the person was either
  party. `run_claims` keep only the random install id, month, pool and section numbers, with `user_id` cleared
  (D71). Anonymous referral-void event counts remain without an account id, referral id, code, email or free text.
  `admin_audit`, `app_releases` and `webhook_events` remain without the person's words.

## 13. Environment

Clients (unchanged): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.

Edge Function secrets, names only:

| Name | Used by | When absent |
|---|---|---|
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEYS`, `SUPABASE_SECRET_KEYS` | all; provided by the platform | 500 `internal_error`, naming the variable |
| `POLAR_ACCESS_TOKEN`, `POLAR_SERVER` (`sandbox` or `production`), `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCTS` (JSON: `pro_month`, `pro_year`, `team_month`, `team_year` to product ids) | `polar-checkout`, `polar-webhook` | checkout dormant: `available: false`, 503 `billing_unavailable` |
| `FILESHUB_API_KEY` (server-side key; no Origin is sent) | `account-welcome`, `polar-webhook`, `team`, `admin` | the email remains pending for an audited later send; the business action still succeeds |
| `GA4_MEASUREMENT_ID`, `GA4_MP_API_SECRET` | `analytics-ingest` only | telemetry is skipped; desktop behavior continues |
| `APP_WEBSITE_URL` | email links, `return_url` | `https://windowsweep.aoneahsan.com` |

Auth settings the backend assumes, sent by the main session after the migrations: `external_anonymous_users_enabled:
true`, `security_manual_linking_enabled: true` (`linkIdentity` needs it), `hook_before_user_created_enabled: true`,
`hook_before_user_created_uri: "pg-functions://postgres/public/hook_before_user_created"`. The email provider stays
on for the test aliases' password grant; the hook refuses every other email sign-up.

## 14. Emails, as FilesHub templates

Every email is a FilesHub template, sent as `template` + `variables` (strings only), never raw HTML. The website
session supplies the branded templates (one layout); the slugs and variables are fixed here. A definitive provider
refusal releases the mail claim for an audited retry. A network outcome that might have been accepted stays
`uncertain` until an admin records `sent` or explicitly allows one retry. No automatic retry can duplicate a message,
and nothing falls back to a raw email. Mail failure does not reverse the business action.

| slug | to | when | variables |
|---|---|---|---|
| `windowsweep-welcome` | the account | its first `account-welcome` | `device_runs`, `account_runs`, `app_url` |
| `windowsweep-referral-confirmed` | the referrer | the friend is confirmed (once) | `points`, `total_points`, `confirmed`, `threshold`, `reward_plan`, `reward_months`, `rewarded` (`yes` or `no`), `reward_line` (server-derived, outcome-specific sentence), `account_url` |
| `windowsweep-plan-confirmed` | the buyer | `order.paid` granted | `plan_name`, `interval_label`, `amount` (Polar plan subtotal before discounts and tax, not the total charged), `seats`, `period_start`, `period_end`, `account_url` |
| `windowsweep-payment-returned` | the buyer | `order.refunded` | `plan_name`, `amount_returned`, `plan_now`, `pricing_url` |
| `windowsweep-plan-granted` | the person | `grants.create` | `plan_name`, `seats`, `ends_at`, `account_url` |
| `windowsweep-plan-request-open` | the requester | `requests.notify_open`, only after checkout is live | `plan_name`, `interval_label`, `pay_url`, `pricing_url` |
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
| `subscription_active` | 409 | direct account deletion must wait for server-side Polar cancellation |
| `price_changed` | 409 | checkout price changed before payment; no grant is made |
| `already_in_team`, `already_member`, `no_seats`, `owner_cannot_leave`, `free_plan_required`, `badge_exists` | 409 | |
| `referral_rewards_block_plan_shape_change` | 409 | tier rank or Team status is locked while it would move active or banked referral rewards; create a new tier or wait |
| `invalid_plan`, `invalid_badge`, `not_purchasable`, `seats_below_minimum`, `invalid_override`, `invalid_value`, `out_of_bounds` | 422 | business validity |
| `billing_unavailable` | 503 | checkout is not open |
| `referral_badge_unresolved`, `referral_window_unconfigured` | 503 | referral award configuration needs an admin correction; no partial award is saved |
| `upstream_error` | 502 | the database or Polar refused unexpectedly |
| `internal_error` | 500 | logged with an event name, never a value |

## 16. What the privacy page must add (website writer)

1.4.0 uploads, beyond 1.3.2: a random install id and when that PC was last seen; for each synced run, which
random install id it used; a monthly count of real runs per PC and per account, with section numbers; and the
person's plan, payments through Polar, plan requests, team membership and referral records. No machine name,
host name, Windows version, path, folder or file name is sent.

## 17. Decisions settled after the first draft

D70 makes server-side Polar cancellation a prerequisite for account deletion. D71 keeps anonymous monthly
claims after deletion, with the account reference cleared. D73 permits the legal misuse clause; its final
wording remains under the owner's legal GATE 4.

## 18. Desktop analytics relay

`POST analytics-ingest` requires a Supabase bearer JWT, including a device session after D72 is enabled. The
desktop sends one event per call: `screen_view(route)`, `control_press(control, route)`,
`update_check_available(version)`, `update_check_skipped(reason)`, or `update_install_failed(reason)`. The client
passes a random UUID client id, numeric session id, engagement time and app version. `route` and `control` are
closed server allowlists; `reason` becomes `deadline` or `other`. No path, filename, email or machine label is
accepted. Unknown fields are 422 `invalid_request`.

The function alone holds the GA4 Measurement Protocol API secret. It atomically claims one event from
`analytics_daily_usage` and `analytics_daily_totals` before sending. The limits are 200 per auth id
and 10,000 total per UTC day; refusal returns `{ ok: true, accepted: false }` and never blocks the app. User
count rows cascade on account deletion, and both count tables prune rows older than 30 UTC days. The public
desktop flag `VITE_GA4_INGEST_ENABLED` is set only after the server settings and endpoint pass live checks.
