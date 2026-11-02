import { logEvent } from "./http.ts";

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

export async function sendTemplate(
  to: string | null | undefined,
  template: string,
  variables: Record<string, string>,
): Promise<EmailOutcome> {
  const apiKey = Deno.env.get("FILESHUB_API_KEY");
  if (!apiKey || !to) {
    logEvent("email.skipped");
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
          from_name: "windowsweep",
          queue: true,
          template,
          variables,
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
