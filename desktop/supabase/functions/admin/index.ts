import {
  answer,
  ApiError,
  bodyObject,
  optionalText,
  pageLimit,
  pageNumber,
  requireMethod,
  serve,
  textField,
  uuid,
} from "../_shared/http.ts";
import { dateLabel, sendTemplate, website } from "../_shared/email.ts";
import {
  type BillingTemplate,
  sendBillingEmail,
} from "../_shared/billing-email.ts";
import { polarAvailable, polarProduct } from "../_shared/polar.ts";
import { caller, rpc, serviceClient } from "../_shared/supabase.ts";

type Body = Record<string, unknown>;

function reason(body: Body): string {
  return textField(body, "reason", 1, 500);
}
function cursor(body: Body): string | null {
  return optionalText(body, "cursor", 1000);
}
function pagination(body: Body, max = 50): Record<string, unknown> {
  return { p_cursor: cursor(body), p_limit: pageLimit(body.limit, max) };
}
function paged(body: Body): Record<string, unknown> {
  return { p_limit: pageLimit(body.limit), p_page: pageNumber(body.page) };
}
function optionalUuid(body: Body, name: string): string | null {
  return body[name] === undefined || body[name] === null
    ? null
    : uuid(body[name], name);
}
function optionalDate(body: Body, name: string): string | null {
  const value = optionalText(body, name, 50);
  if (value && Number.isNaN(Date.parse(value))) {
    throw new ApiError(422, "invalid_request", `${name} is invalid`);
  }
  return value;
}
function optionalSeats(body: Body): number | null {
  if (body.seats === undefined || body.seats === null) return null;
  if (
    !Number.isInteger(body.seats) || (body.seats as number) < 1 ||
    (body.seats as number) > 1000
  ) {
    throw new ApiError(422, "invalid_request", "seats is invalid");
  }
  return body.seats as number;
}

async function notifyRequests(
  client: Awaited<ReturnType<typeof caller>>["client"],
  body: Body,
) {
  if (!polarAvailable()) throw new ApiError(503, "billing_unavailable");
  const claimed = await rpc<
    {
      items: Array<
        {
          id: string;
          claim_token: string;
          user_email: string;
          plan_id: string;
          interval: string;
          seats: number;
        }
      >;
      next_cursor: string | null;
    }
  >(client, "admin_requests_claim", pagination(body, 20));
  let sent = 0;
  let failed = 0;
  for (const item of claimed.items ?? []) {
    const { data: plan, error } = await serviceClient().from("plans").select(
      "name,is_active,price_month_cents,price_year_cents",
    ).eq("id", item.plan_id).maybeSingle();
    let productReady = false;
    try {
      polarProduct(item.plan_id, item.interval);
      productReady = true;
    } catch { /* product mapping is not configured for this plan */ }
    const planName = !error && plan?.is_active && productReady &&
        (item.interval === "year"
            ? plan.price_year_cents
            : plan.price_month_cents) > 0
      ? plan.name
      : null;
    const payUrl = website(
      `/pricing?plan=${encodeURIComponent(item.plan_id)}&interval=${
        encodeURIComponent(item.interval)
      }&seats=${encodeURIComponent(item.seats)}`,
    );
    const outcome = planName
      ? await sendTemplate(item.user_email, "windowsweep-plan-request-open", {
        plan_name: planName,
        interval_label: item.interval === "year" ? "yearly" : "monthly",
        pay_url: payUrl,
        pricing_url: website("/pricing"),
      })
      : "refused";
    if (outcome === "accepted") {
      await rpc(client, "admin_request_mark_notified", {
        p_request_id: item.id,
        p_token: item.claim_token,
        p_reason: "Checkout opened; payment link emailed",
      });
      sent += 1;
    } else if (outcome === "uncertain") {
      await rpc(client, "admin_request_mark_uncertain", {
        p_request_id: item.id,
        p_token: item.claim_token,
      });
      failed += 1;
    } else {
      await rpc(client, "admin_request_release_claim", {
        p_request_id: item.id,
        p_token: item.claim_token,
      });
      failed += 1;
    }
  }
  return { sent, failed, next_cursor: claimed.next_cursor ?? null };
}

serve(async (request) => {
  requireMethod(request, "POST");
  const body = await bodyObject(request);
  const action = textField(body, "action", 1, 40);
  const actions = [
    "stats",
    "analytics.budget",
    "users.list",
    "users.view",
    "users.set_plan",
    "users.override_limits",
    "plans.list",
    "plans.upsert",
    "badges.list",
    "badges.create",
    "grants.list",
    "grants.create",
    "grants.revoke",
    "config.get",
    "config.set",
    "requests.list",
    "requests.notify_open",
    "requests.close",
    "emails.uncertain",
    "emails.reconcile",
    "emails.billing_list",
    "emails.billing_reconcile",
    "emails.billing_send",
    "referrals.void",
    "releases.list",
    "releases.publish",
    "audit.list",
  ];
  if (!actions.includes(action)) {
    throw new ApiError(422, "invalid_request", "action is invalid");
  }

  let functionName = "";
  let args: Record<string, unknown> = {};
  switch (action) {
    case "stats":
      functionName = "admin_stats";
      break;
    case "analytics.budget":
      functionName = "admin_analytics_budget";
      args = { p_user: optionalUuid(body, "user_id") };
      break;
    case "users.list":
      functionName = "admin_users_list";
      args = { p_query: optionalText(body, "query", 120), ...pagination(body) };
      break;
    case "users.view":
      functionName = "admin_users_view";
      args = { p_user: uuid(body.user_id, "user_id") };
      break;
    case "users.set_plan":
      functionName = "admin_set_plan";
      args = {
        p_user: uuid(body.user_id, "user_id"),
        p_plan: textField(body, "plan_id", 1, 40),
        p_ends_at: optionalDate(body, "ends_at"),
        p_seats: optionalSeats(body),
        p_reason: reason(body),
      };
      break;
    case "users.override_limits":
      if (
        body.overrides !== null &&
        (!body.overrides || typeof body.overrides !== "object" ||
          Array.isArray(body.overrides))
      ) throw new ApiError(422, "invalid_request", "overrides is invalid");
      functionName = "admin_override_limits";
      args = {
        p_user: uuid(body.user_id, "user_id"),
        p_overrides: body.overrides,
        p_reason: reason(body),
      };
      break;
    case "plans.list":
      functionName = "admin_plans_list";
      args = paged(body);
      break;
    case "plans.upsert":
      if (
        !body.plan || typeof body.plan !== "object" || Array.isArray(body.plan)
      ) throw new ApiError(422, "invalid_request", "plan is invalid");
      functionName = "admin_plan_upsert";
      args = { p_plan: body.plan, p_reason: reason(body) };
      break;
    case "badges.list":
      functionName = "admin_badges_list";
      args = paged(body);
      break;
    case "badges.create":
      functionName = "admin_badges_create";
      args = {
        p_key: textField(body, "key", 1, 40),
        p_name: textField(body, "name", 1, 80),
        p_reason: reason(body),
      };
      break;
    case "grants.list":
      if (
        body.active_only !== undefined && typeof body.active_only !== "boolean"
      ) throw new ApiError(422, "invalid_request", "active_only is invalid");
      functionName = "admin_grants_list";
      args = {
        p_user: optionalUuid(body, "user_id"),
        p_active_only: body.active_only ?? false,
        ...pagination(body),
      };
      break;
    case "grants.create":
      functionName = "admin_grant_create";
      args = {
        p_user: uuid(body.user_id, "user_id"),
        p_plan: textField(body, "plan_id", 1, 40),
        p_starts_at: optionalDate(body, "starts_at"),
        p_ends_at: optionalDate(body, "ends_at"),
        p_seats: optionalSeats(body),
        p_reason: reason(body),
      };
      break;
    case "grants.revoke":
      functionName = "admin_grant_revoke";
      args = {
        p_grant_id: uuid(body.grant_id, "grant_id"),
        p_reason: reason(body),
      };
      break;
    case "config.get":
      functionName = "admin_config_get";
      args = paged(body);
      break;
    case "config.set":
      if (!("value" in body)) {
        throw new ApiError(422, "invalid_request", "value is required");
      }
      functionName = "admin_config_set";
      args = {
        p_key: textField(body, "key", 1, 80),
        p_value: body.value,
        p_reason: reason(body),
      };
      break;
    case "requests.list":
      functionName = "admin_requests_list";
      args = {
        p_status: optionalText(body, "status", 20),
        ...pagination(body),
      };
      break;
    case "requests.notify_open":
      args = pagination(body, 20);
      break;
    case "requests.close":
      functionName = "admin_request_close";
      args = {
        p_request_id: uuid(body.request_id, "request_id"),
        p_reason: reason(body),
      };
      break;
    case "emails.uncertain":
      functionName = "admin_email_uncertain_list";
      args = { p_kind: textField(body, "kind", 4, 20), ...paged(body) };
      break;
    case "emails.reconcile":
      functionName = "admin_email_reconcile";
      args = {
        p_kind: textField(body, "kind", 4, 20),
        p_id: uuid(body.id, "id"),
        p_outcome: textField(body, "outcome", 4, 5),
        p_reason: reason(body),
      };
      break;
    case "emails.billing_list":
      functionName = "admin_billing_email_list";
      args = paged(body);
      break;
    case "emails.billing_reconcile":
      functionName = "admin_billing_email_reconcile";
      args = {
        p_event_id: textField(body, "event_id", 1, 200),
        p_template: textField(body, "template", 1, 80),
        p_outcome: textField(body, "outcome", 4, 11),
        p_reason: reason(body),
      };
      break;
    case "emails.billing_send":
      args = {
        event_id: textField(body, "event_id", 1, 200),
        template: textField(body, "template", 1, 80),
        reason: reason(body),
      };
      if (
        !["windowsweep-plan-confirmed", "windowsweep-payment-returned"]
          .includes(args.template as string)
      ) {
        throw new ApiError(422, "invalid_request", "template is invalid");
      }
      break;
    case "referrals.void":
      functionName = "admin_referral_void";
      args = {
        p_referral: uuid(body.referral_id, "referral_id"),
        p_reason: reason(body),
      };
      break;
    case "releases.list":
      functionName = "admin_releases_list";
      args = {
        p_platform: optionalText(body, "platform", 20),
        p_channel: optionalText(body, "channel", 20),
        ...pagination(body),
      };
      break;
    case "releases.publish":
      functionName = "publish_app_release";
      args = {
        p_platform: textField(body, "platform", 3, 20),
        p_channel: textField(body, "channel", 3, 20),
        p_version: textField(body, "version", 5, 30),
        p_severity: textField(body, "severity", 6, 10),
        p_reason: textField(body, "reason", 1, 280),
        p_min_native_version: optionalText(body, "min_native_version", 30),
      };
      break;
    case "audit.list":
      functionName = "admin_audit_list";
      args = {
        p_action: optionalText(body, "filter_action", 80),
        ...pagination(body),
      };
      break;
  }

  const { client } = await caller(request, true);
  const isAdmin = await rpc<boolean>(client, "is_platform_admin");
  if (isAdmin !== true) throw new ApiError(403, "forbidden");
  if (action === "requests.notify_open") {
    return answer({ ok: true, ...await notifyRequests(client, body) });
  }
  if (action === "emails.billing_send") {
    await rpc(client, "admin_billing_email_retry", {
      p_event_id: args.event_id,
      p_template: args.template,
      p_reason: args.reason,
    });
    const outcome = await sendBillingEmail(
      args.event_id as string,
      args.template as BillingTemplate,
    );
    return answer({ ok: true, outcome });
  }
  const result = await rpc<Record<string, unknown>>(client, functionName, args);
  if (action === "grants.create") {
    const service = serviceClient();
    const [{ data: profile }, { data: plan }] = await Promise.all([
      service.from("profiles").select("email").eq("user_id", args.p_user)
        .maybeSingle(),
      service.from("plans").select("name").eq("id", args.p_plan).maybeSingle(),
    ]);
    await sendTemplate(profile?.email, "windowsweep-plan-granted", {
      plan_name: plan?.name ?? String(args.p_plan),
      seats: String(args.p_seats ?? 1),
      ends_at: dateLabel(String(args.p_ends_at)),
      account_url: website("/account"),
    });
  }
  return answer({ ok: true, ...result });
});
