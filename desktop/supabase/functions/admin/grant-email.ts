import {
  dateLabel,
  type EmailOutcome,
  sendTemplate,
  website,
} from "../_shared/email.ts";
import { logEvent } from "../_shared/http.ts";
import { rpc, serviceClient } from "../_shared/supabase.ts";

export type GrantEmailClaim = {
  id: string;
  claim_token: string;
  email: string;
  plan_name: string;
  seats: number;
  ends_at: string;
};

export type GrantEmailResult = EmailOutcome | "pending" | "not_pending";

type GrantEmailPort = {
  claim: (
    id: string,
  ) => GrantEmailClaim | null | Promise<GrantEmailClaim | null>;
  send: (claim: GrantEmailClaim) => EmailOutcome | Promise<EmailOutcome>;
  mark: (
    claim: GrantEmailClaim,
    outcome: EmailOutcome,
  ) => boolean | Promise<boolean>;
};

/** The claim is committed before the provider call, so a second caller cannot send. */
export async function deliverGrantEmail(
  id: string,
  port: GrantEmailPort,
): Promise<GrantEmailResult> {
  let claim: GrantEmailClaim | null;
  try {
    claim = await port.claim(id);
  } catch {
    logEvent("email.grant_claim_failed");
    return "pending";
  }
  if (!claim) return "not_pending";

  let outcome: EmailOutcome;
  try {
    outcome = await port.send(claim);
  } catch {
    outcome = "uncertain";
  }
  try {
    if (!await port.mark(claim, outcome)) {
      logEvent("email.grant_mark_failed");
      return "uncertain";
    }
  } catch {
    logEvent("email.grant_mark_failed");
    return "uncertain";
  }
  return outcome;
}

export function grantTemplateVariables(
  claim: GrantEmailClaim,
): Record<string, string> {
  if (
    !claim.plan_name?.trim() || !Number.isInteger(claim.seats) ||
    claim.seats < 1 ||
    !claim.ends_at || Number.isNaN(Date.parse(claim.ends_at))
  ) throw new Error("Invalid committed grant email data");
  return {
    plan_name: claim.plan_name,
    seats: String(claim.seats),
    ends_at: dateLabel(claim.ends_at),
    account_url: website("/account"),
  };
}

/** Provider refusal releases the claim; an unknown response stays blocked for review. */
export async function sendGrantEmail(id: string): Promise<GrantEmailResult> {
  let service: ReturnType<typeof serviceClient>;
  try {
    service = serviceClient();
  } catch {
    logEvent("email.grant_service_unavailable");
    return "pending";
  }
  return await deliverGrantEmail(id, {
    claim: (grantId) =>
      rpc<GrantEmailClaim | null>(service, "grant_email_claim", {
        p_grant: grantId,
      }),
    send: (claim) => {
      try {
        return sendTemplate(
          claim.email,
          "windowsweep-plan-granted",
          grantTemplateVariables(claim),
        );
      } catch {
        logEvent("email.grant_invalid_data");
        return Promise.resolve("refused");
      }
    },
    mark: (claim, outcome) => {
      const action = outcome === "accepted"
        ? "grant_email_mark_sent"
        : outcome === "refused"
        ? "grant_email_release_claim"
        : "grant_email_mark_uncertain";
      return rpc<boolean>(service, action, {
        p_grant: claim.id,
        p_token: claim.claim_token,
      });
    },
  });
}
