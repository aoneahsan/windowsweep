# Admin surface — windowsweep

> Derived from the 1.4.0 schema and Edge action registry on 2026-10-31. The new backend is source only until migrations, functions and the website admin pages are deployed and checked as a non-admin.

## Role model

`superadmin > admin > user` is the platform ladder in `desktop/src/db/schema/site.ts`. The two owner addresses receive `superadmin` from the Auth trigger; the client has no grant on `profiles.platform_role`. Team `owner` and `member` live on `team_members`, separate from the platform role. The backend checks `private.require_admin()` inside each admin RPC, in addition to the Edge guard.

## Capabilities

| Capability owed by | Screen or action | Server enforcement and persistence | Status |
|---|---|---|---|
| `profiles`, `devices`, `runs` | `/admin/users`, `users.list`, `users.view` | `admin_users_list`, `admin_users_view`; source in `v140_admin_part1.sql` | Source ready; live probe pending |
| `profiles.platform_role` | `/admin/users` shows roles; elevation is out of band | Auth trigger and column grant deny client role edits | Grant/revoke interface open |
| `profiles` and account deletion | `/admin/users` | User-owned `delete-account` exists; admin suspension and deletion controls are open | Open |
| `plans`, `app_config`, `plan_grants` | `plans.list/upsert`, `config.get/set`, `users.set_plan/override_limits`, `grants.list/create/revoke` | 1.4 admin RPCs; writes add `admin_audit` rows | Source ready; website and live probes pending |
| `subscriptions`, `checkout_quotes`, `webhook_events` | User detail and audit | Polar webhook RPCs record periods, returns and mismatches; no refund action | Source ready; transaction view pending |
| `plan_requests` | `requests.list/notify_open/close` | Claim and transition RPCs, audited writes | Source ready; website and live probes pending |
| `referrals`, `badge_catalogue`, `referral_voids` | `badges.list/create`, `referrals.void` | Referral/admin RPCs; void revokes unearned rewards | Source ready; website and live probes pending |
| `team_members`, `team_invites` | User detail and Team owner actions | Team RPCs enforce ownership and seat limits | Source ready; admin Team overview pending |
| `billing_email_deliveries` and other email claims | `emails.uncertain/reconcile`, `emails.billing_list/reconcile/send` | Token-checked mail RPCs; unknown outcomes require staff resolution | Source ready; website and live probes pending |
| `app_releases` | `releases.list/publish` | Immutable release RPC and `admin_audit` write | Source ready; website and test-channel proof pending |
| `analytics_daily_usage`, `analytics_daily_totals` | `analytics.budget` with optional `user_id` | `admin_analytics_budget` checks `private.require_admin()`; returns one UTC day, global count/cap and one selected user count/cap. No event payload or unbounded list. | Source ready; website and live probes pending |
| `contact_requests` | `/admin` inbox | Existing triage actions and `admin_audit` | Live source; repeat non-admin probe after release |
| `admin_audit` | `/admin/audit` | Admin-only read; append-only server writes | Live source; repeat non-admin probe after release |

## Merge decisions and open work

User list, plan provenance and per-user analytics budget belong on one user detail page. Global budget belongs with admin statistics. Email claims use one queue with type and status filters; a billing email can be resent without replaying a payment. The desktop engine never sends telemetry; only its window can call `analytics-ingest`.

The status cells above are release gates, not accepted omissions. The website needs to expose the 1.4.0 capabilities and prove each write persists and each refusal occurs for an ordinary account. Role grant/revoke, account suspension, a transaction view and a Team overview remain open findings for the completion run.

## Sweeps

- **A — unmanaged data:** The two analytics budget tables have an aggregate RPC; they have no direct read grant. Payment, Team and email ledgers still need complete admin views.
- **B — dead vocabulary:** `superadmin`, `admin` and `user` are checked by the current server role gate. Team `owner` and `member` are checked by the Team RPCs. Recheck the website after its admin pages land.
- **C — console dependence:** The owner must not need SQL to inspect a daily telemetry cap; `analytics.budget` supplies that read. Platform role changes and account suspension still depend on out-of-band action.

## Non-admin proof

After deployment, call `analytics.budget` and every admin write with an ordinary account and assert 403. Then call as a seeded superadmin, verify the bounded result and an audited write. No live database or Edge Function was called while this source was authored.
