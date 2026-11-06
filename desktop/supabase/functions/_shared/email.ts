import { logEvent } from "./http.ts";
import { catalogue } from "./email/catalogue.ts";
import type { EmailMessage } from "./email/layout.ts";

export function website(path = ""): string {
  const base = Deno.env.get("APP_WEBSITE_URL") ||
    "https://windowsweep.aoneahsan.com";
  return `${base.replace(/\/$/, "")}${path}`;
}

export function dateLabel(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export type EmailOutcome = "accepted" | "refused" | "uncertain";

/**
 * Sends one message composed by `_shared/email/compose.ts` through FilesHub raw mode; FilesHub
 * only carries the rendered result. The message is composed after the key and recipient check,
 * and a composer that refuses its data sends nothing and returns "refused", as a missing key does.
 * "accepted" is a 202 or 201 with success:true; another 2xx, a network error or the 15 s timeout
 * is "uncertain"; any other answer is "refused".
 */
export async function sendEmail(
  to: string | null | undefined,
  compose: () => EmailMessage,
): Promise<EmailOutcome> {
  const apiKey = Deno.env.get("FILESHUB_API_KEY");
  if (!apiKey || !to) {
    logEvent("email.skipped");
    return "refused";
  }
  let message: EmailMessage;
  try {
    message = compose();
  } catch {
    logEvent("email.compose_refused");
    return "refused";
  }
  try {
    const response = await fetch(
      "https://fileshub.zaions.com/api/v1/emails/send",
      {
        method: "POST",
        headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          from_name: catalogue.productName,
          subject: message.subject,
          body_html: message.html,
          body_text: message.text,
          queue: true,
        }),
        signal: AbortSignal.timeout(15000),
      },
    );
    const body = await response.json().catch(() => null);
    if (
      (response.status === 202 || response.status === 201) &&
      body?.success === true
    ) return "accepted";
    if (response.ok) {
      logEvent("email.uncertain");
      return "uncertain";
    }
  } catch {
    logEvent("email.uncertain");
    return "uncertain";
  }
  logEvent("email.skipped");
  return "refused";
}
