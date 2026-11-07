# Polar billing - setup record

Polar sells windowsweep's two paid plans, Pro and Team. Checkout and the webhook run as Supabase Edge Functions
on project `nlmetjyytgwaxcliusuo`; the website's `/pricing` and the desktop app's Plans screen call them. This file
names keys, never values. Standard: `aoneahsan-cccs-polar-payments`; decisions D61 (built dormant) and D87
(sandbox proof, then production), `docs/PROJECT-CONTEXT.md`.

## State on 2026-11-07: checkout is open

- **Polar approved the organization** (status `active`, details submitted 2026-11-06 12:40 UTC). `POLAR_PRODUCTS` was
  set from `~/.secrets/polar-windowsweep/production-products.json` at 06:57:52 UTC, and `GET polar-checkout` answered
  `available: true` five seconds later, with no redeploy. `POLAR_SERVER`, `POLAR_ACCESS_TOKEN` and
  `POLAR_WEBHOOK_SECRET` match the production values by digest; the production webhook targets `polar-webhook` with
  `order.paid` and `order.refunded`.
- **The website sells both plans.** `/pricing` draws *Subscribe to Pro / Team* (the served HTML carries the state since
  web `a51d724`, which reads it at build time), and as a non-admin test account one checkout opened Polar's hosted page
  at *windowsweep Pro (monthly), $4 / mo*. The quote row read 400 cents; Polar's checkout read `open`, 400 USD, for that
  account. No payment was made and no Polar customer was created; the account was deleted and its quote went with it.
  Evidence: root `site-evidence/payments-2026-11-07/`.
- **The desktop app sells both plans from 1.4.4** (`desktop-v1.4.4`, 2026-11-07): Subscribe opens Polar's hosted page in the
  browser for the signed-in account, and the plan reaches the window on the account's private `plans:<id>` signal
  (migration `20261107073129`), never a timer. Requests made while checkout was closed complete through an admin's
  *Email pay links*; the link now opens `/pricing` with the requested period and seats chosen (web `7cb7aad`).
- **After Polar's return**, the website's `/account` says "Polar has the payment. The plan shows on your account once
  Polar confirms it." until the webhook's row lands, then names the plan (web `7cb7aad`, live 2026-11-07).

## State on 2026-11-05 (superseded)

- **Production is configured and dormant.** The organization's status is `created`: Polar has not approved it yet.
  The function secrets hold the production token, server and webhook secret. `POLAR_PRODUCTS` is withheld, so
  `GET polar-checkout` answers `available: false` and the site and app keep their plan-request buttons.
- **Sandbox is proved end to end** (below). Its secrets are no longer set on the project.

## Organizations

| Environment | Organization id | Slug | Status (2026-11-05) |
|---|---|---|---|
| production | `61f0be1b-d74e-4541-ac13-d51ec7f367d3` | `windowsweep` | `created` |
| sandbox | `ffb743fb-a99c-44f4-bced-5154a2fb55f8` | `windowsweep` | `active` |

Tokens come from FilesHub payment account 13 (`windowsweep-polar`). Local copies are in `~/.secrets/polar-windowsweep/`
(`production-oat`, `sandbox-oat`, `<env>-products.json`, `<env>-webhook-id`, `<env>-webhook-secret`). The values made
here are backed up to the FilesHub project vault `general` as `bk_polar_windowsweep_<env>_{webhook_secret,webhook_id,products}`
and were read back identical.

## Products: one per plan and period, at the plan rows' prices

| Key | Production id | Sandbox id | Price |
|---|---|---|---|
| `pro_month` | `4bf48a89-6536-4370-94b9-a7d6e1cd91c9` | `08671d45-9fc9-485a-ab17-d925450fe155` | $4 a month |
| `pro_year` | `fc566a8e-abb7-4572-a78e-b514006c21f2` | `e1071583-019d-42e7-afa1-2b8933dbcca0` | $36 a year |
| `team_month` | `26c4b5d3-205c-4660-a3be-5a96850098fe` | `6703a6b3-8caa-421a-9208-2ba12512cbc3` | $3 a seat a month, from 3 seats (seat-based, volume) |
| `team_year` | `b69a7196-b1ad-4dd2-b7fe-2666cb39c3f0` | `a1009338-f139-4705-9b00-cd70cf9c49c6` | $30 a seat a year, from 3 seats |

The names on Polar's checkout are `windowsweep Pro (monthly)` and the like. Each description is the approved
plan line from the website's pricing catalogue. The database prices every order against the `plans` row, so a
price changed on Polar alone grants nothing.

## Webhook

`https://nlmetjyytgwaxcliusuo.supabase.co/functions/v1/polar-webhook`, format `raw`, events `order.paid` and
`order.refunded`. Endpoint ids: production `0516534b-fbd9-46ce-b7bf-96530a100780`, sandbox
`1f6a25a2-cef6-4f7d-9f95-20e8a3e841bf`. An unsigned delivery answers 403.

## Code and keys

- `desktop/supabase/functions/_shared/polar.ts`: one client on `@polar-sh/sdk@1.0.2/2026-10`, with the server from
  `POLAR_SERVER`.
- `polar-checkout/index.ts`: a signed-in caller asks for a plan, a period and seats. The server picks the product,
  sets `external_customer_id` to the account id and records the quote. The browser leaves for Polar's page in the
  same tab.
- `polar-webhook/index.ts`: `validateEvent` against `POLAR_WEBHOOK_SECRET`. `order.paid` prices and extends the plan;
  `order.refunded` ends the time it paid for.
- **Function secrets (names only):** `POLAR_ACCESS_TOKEN`, `POLAR_SERVER`, `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCTS`.
  Set them through the Management API from the files above, never printed.
- **Pay surfaces** carry only "By continuing, you agree to our Terms of Service and Privacy Policy." No refund
  wording appears on a pay surface. There is no customer-portal route: Polar hosts the portal and emails buyers the
  link.

## Sandbox proof, 2026-11-05

The test accounts were non-admin, the sandbox window was open 17:35-17:42 UTC, and the evidence is in the root
`site-evidence/polar-2026-11-05/`:

1. **Pro, monthly, as `t1+1`** (test card): `order.paid` delivered 200. The quote and the subscription read
   400 cents, and the subscription was active until 2026-12-05.
2. **Team, yearly, 3 seats, as `t1+2`**: `order.paid` delivered 200. The quote read 3 seats at 3000 cents,
   9000 total. The subscription was active until 2027-11-05, and the team was created with its owner.
3. **Returned payments:** both orders were refunded through Polar's API, and `order.refunded` was delivered 200.
   Both subscriptions read `returned` with their cents, and the paid time ended.
4. **Unsigned delivery:** 403.
5. **Free limit:** a Free account on a new device was allowed 30 real runs (15 for the device, 15 for the account).
   The 31st was refused with 409 `limit_reached`.

## When Polar approves the organization (done 2026-11-07, above)

1. `GET /v1/organizations/61f0be1b-d74e-4541-ac13-d51ec7f367d3` reads a status other than `created`.
2. Set `POLAR_PRODUCTS` from `~/.secrets/polar-windowsweep/production-products.json`. `GET polar-checkout` must
   then answer `available: true`.
3. As a non-admin test account, create one checkout and see `polar.sh/checkout/...` render the right plan and price.
   Stop there: no payment is made. The sandbox already proved the paid path, so no real charge is asked for
   (`~/.claude/rules/payment-validation.md`).

Last Updated: 2026-11-07 (checkout open after Polar's approval, D94). Earlier 2026-11-05
