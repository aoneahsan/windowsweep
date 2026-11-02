import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { ApiError, logEvent } from "./http.ts";

function environment(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    logEvent(`config.${name}.missing`);
    throw new ApiError(500, "internal_error", `${name} is missing`);
  }
  return value;
}

function key(name: string): string {
  try {
    const keys = JSON.parse(environment(name));
    if (typeof keys.default === "string" && keys.default) return keys.default;
  } catch { /* invalid platform configuration */ }
  logEvent(`config.${name}.invalid`);
  throw new ApiError(500, "internal_error", `${name} is invalid`);
}

export type Session = {
  client: SupabaseClient;
  user: { id: string; email?: string; is_anonymous?: boolean };
};

export async function caller(
  request: Request,
  accountRequired = false,
): Promise<Session> {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)
    ?.[1];
  if (!token) throw new ApiError(401, "not_authenticated");
  const client = createClient(
    environment("SUPABASE_URL"),
    key("SUPABASE_PUBLISHABLE_KEYS"),
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) throw new ApiError(401, "not_authenticated");
  if (accountRequired && data.user.is_anonymous) {
    throw new ApiError(403, "signed_in_required");
  }
  return { client, user: data.user };
}

export function serviceClient(): SupabaseClient {
  return createClient(
    environment("SUPABASE_URL"),
    key("SUPABASE_SECRET_KEYS"),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

const statusByCode: Record<string, number> = {
  not_authenticated: 401,
  unauthenticated: 401,
  signed_in_required: 403,
  forbidden: 403,
  plan_required: 403,
  device_owned: 403,
  handoff_invalid: 403,
  not_team_owner: 403,
  not_in_team: 403,
  invite_email_mismatch: 403,
  not_found: 404,
  invite_not_found: 404,
  limit_reached: 409,
  subscription_active: 409,
  price_changed: 409,
  already_in_team: 409,
  already_member: 409,
  no_seats: 409,
  owner_cannot_leave: 409,
  free_plan_required: 409,
  not_ready: 409,
  badge_exists: 409,
  invalid_plan: 422,
  invalid_badge: 422,
  not_purchasable: 422,
  seats_below_minimum: 422,
  invalid_override: 422,
  invalid_value: 422,
  out_of_bounds: 422,
  invalid_request: 422,
  referral_badge_unresolved: 503,
  referral_window_unconfigured: 503,
};

export function rpcError(
  error: { code?: string; message?: string } | null,
): never {
  if (!error) throw new ApiError(502, "upstream_error");
  const code = error.message?.trim() ?? "";
  if (code in statusByCode) throw new ApiError(statusByCode[code], code);
  if (error.code === "23505") throw new ApiError(409, "already_recorded");
  if (error.code?.startsWith("PT") && /^PT\d{3}$/.test(error.code)) {
    logEvent("database.unmapped_business_error");
    throw new ApiError(Number(error.code.slice(2)), "invalid_request");
  }
  logEvent("database.rpc_error");
  throw new ApiError(502, "upstream_error");
}

export async function rpc<T = unknown>(
  client: SupabaseClient,
  name: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const { data, error } = await client.rpc(name, args);
  if (error) rpcError(error);
  return data as T;
}
