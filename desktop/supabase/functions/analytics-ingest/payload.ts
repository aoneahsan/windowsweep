import { ApiError } from "../_shared/http.ts";

export const EVENT_PARAMS = {
  screen_view: ["route"],
  control_press: ["control", "route"],
  update_check_available: ["version"],
  update_check_skipped: ["reason"],
  update_install_failed: ["reason"],
} as const;

const ROUTES = new Set([
  "/",
  "/splash",
  "/run",
  "/sections",
  "/picker",
  "/history",
  "/report",
  "/account",
  "/settings",
  "/elevation",
  "/plans",
  "/team",
]);
export const CONTROLS = new Set([
  "home.scan",
  "home.dryRun",
  "home.reclaim",
  "run.start",
  "sections.runSelected",
  "picker.remove",
  "picker.removePermanently",
  "consent.continue",
  "account.signIn",
  "elevation.askAndRun",
  "splash.updateNow",
]);

export type AnalyticsPayload = {
  event: keyof typeof EVENT_PARAMS;
  clientId: string;
  sessionId: string;
  engagementTimeMsec: number;
  appVersion: string;
  params: Record<string, string>;
};

function invalid(field: string): never {
  throw new ApiError(422, "invalid_request", `${field} is invalid`);
}

/** Rejects unknown dimensions and reduces error text to a non-personal category. */
export function parseAnalyticsPayload(
  body: Record<string, unknown>,
): AnalyticsPayload {
  const fields = [
    "event",
    "client_id",
    "session_id",
    "engagement_time_msec",
    "app_version",
    "params",
  ];
  if (Object.keys(body).some((field) => !fields.includes(field))) {
    invalid("body");
  }
  const event = body.event;
  if (typeof event !== "string" || !(event in EVENT_PARAMS)) invalid("event");
  const eventName = event as keyof typeof EVENT_PARAMS;
  const clientId = body.client_id;
  if (
    typeof clientId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(clientId)
  ) invalid("client_id");
  const sessionId = body.session_id;
  if (typeof sessionId !== "string" || !/^[1-9][0-9]{0,15}$/.test(sessionId)) {
    invalid("session_id");
  }
  const engagement = body.engagement_time_msec;
  if (
    !Number.isInteger(engagement) || (engagement as number) < 0 ||
    (engagement as number) > 3_600_000
  ) invalid("engagement_time_msec");
  const appVersion = body.app_version;
  if (
    typeof appVersion !== "string" || appVersion.length > 30 ||
    !/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(appVersion)
  ) invalid("app_version");
  const rawParams = body.params;
  if (!rawParams || typeof rawParams !== "object" || Array.isArray(rawParams)) {
    invalid("params");
  }
  const params = rawParams as Record<string, unknown>;
  const expected: readonly string[] = EVENT_PARAMS[eventName];
  if (
    Object.keys(params).length !== expected.length ||
    Object.keys(params).some((key) => !expected.includes(key))
  ) invalid("params");
  const safeParams: Record<string, string> = {};
  for (const key of expected) {
    const value = params[key];
    if (typeof value !== "string" || value.length < 1 || value.length > 100) {
      invalid(key);
    }
    if (key === "route") {
      if (!ROUTES.has(value)) invalid(key);
      safeParams.route = value;
    } else if (key === "control") {
      if (!CONTROLS.has(value)) invalid(key);
      safeParams.control = value;
    } else if (key === "version") {
      if (!/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(value)) {
        invalid(key);
      }
      safeParams.version = value;
    } else {
      safeParams.reason = value === "deadline" ? "deadline" : "other";
    }
  }
  return {
    event: eventName,
    clientId: clientId.toLowerCase(),
    sessionId,
    engagementTimeMsec: engagement as number,
    appVersion,
    params: safeParams,
  };
}
