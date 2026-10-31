import {
  dateLabel,
  type EmailOutcome,
  money,
  sendTemplate,
  website,
} from "./email.ts";
import { rpc, serviceClient } from "./supabase.ts";

export type BillingTemplate =
  | "windowsweep-plan-confirmed"
  | "windowsweep-payment-returned";

export async function sendBillingEmail(
  eventId: string,
  template: BillingTemplate,
): Promise<EmailOutcome | "not_pending"> {
  const service = serviceClient();
  const claim = await rpc<
    {
      claim_token: string;
      email: string;
      plan_name: string;
      interval: string;
      amount_cents: number;
      returned_cents: number;
      seats: number;
      period_start: string;
      period_end: string;
      plan_now: string;
    } | null
  >(service, "billing_email_claim", {
    p_event_id: eventId,
    p_template: template,
  });
  if (!claim) return "not_pending";
  const variables: Record<string, string> =
    template === "windowsweep-plan-confirmed"
      ? {
        plan_name: claim.plan_name,
        interval_label: claim.interval === "year" ? "yearly" : "monthly",
        amount: money(claim.amount_cents),
        seats: String(claim.seats),
        period_start: dateLabel(claim.period_start),
        period_end: dateLabel(claim.period_end),
        account_url: website("/account"),
      }
      : {
        plan_name: claim.plan_name,
        amount_returned: money(claim.returned_cents),
        plan_now: claim.plan_now,
        pricing_url: website("/pricing"),
      };
  const outcome = await sendTemplate(claim.email, template, variables);
  const args = {
    p_event_id: eventId,
    p_template: template,
    p_token: claim.claim_token,
  };
  if (outcome === "accepted") {
    await rpc(service, "billing_email_mark_sent", args);
  } else if (outcome === "uncertain") {
    await rpc(service, "billing_email_mark_uncertain", args);
  } else await rpc(service, "billing_email_release_claim", args);
  return outcome;
}
