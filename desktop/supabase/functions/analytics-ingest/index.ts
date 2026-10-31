import {
  answer,
  bodyObject,
  logEvent,
  requireMethod,
  serve,
} from "../_shared/http.ts";
import { caller, rpc, serviceClient } from "../_shared/supabase.ts";
import { parseAnalyticsPayload } from "./payload.ts";

serve(async (request) => {
  requireMethod(request, "POST");
  const payload = parseAnalyticsPayload(await bodyObject(request));
  const { user } = await caller(request);

  // This is optional telemetry. A missing server secret cannot block the app,
  // and it must never be placed in a VITE_ variable or returned to the caller.
  const measurementId = Deno.env.get("GA4_MEASUREMENT_ID");
  const apiSecret = Deno.env.get("GA4_MP_API_SECRET");
  if (!measurementId || !apiSecret) {
    return answer({ ok: true, accepted: false });
  }
  if (!/^G-[A-Z0-9]{4,20}$/.test(measurementId)) {
    logEvent("analytics.config_invalid");
    return answer({ ok: true, accepted: false });
  }

  // The SQL function atomically enforces both 200/user and 10,000/global per
  // UTC day. It sees only an auth id, never an event name or payload.
  const admitted = await rpc<boolean>(
    serviceClient(),
    "analytics_budget_claim",
    { p_user: user.id },
  );
  if (!admitted) return answer({ ok: true, accepted: false });

  const url = new URL("https://www.google-analytics.com/mp/collect");
  url.searchParams.set("measurement_id", measurementId);
  url.searchParams.set("api_secret", apiSecret);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: payload.clientId,
        consent: { ad_user_data: "DENIED", ad_personalization: "DENIED" },
        events: [{
          name: payload.event,
          params: {
            ...payload.params,
            session_id: payload.sessionId,
            engagement_time_msec: Math.max(1, payload.engagementTimeMsec),
            app_version: payload.appVersion,
          },
        }],
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) logEvent("analytics.provider_refused");
    return answer({ ok: true, accepted: response.ok });
  } catch {
    // An unknown transport outcome is not retried: Google may have received it.
    logEvent("analytics.provider_unknown");
    return answer({ ok: true, accepted: false });
  }
});
