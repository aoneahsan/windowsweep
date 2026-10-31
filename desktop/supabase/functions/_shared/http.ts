export class ApiError extends Error {
  constructor(public status: number, public code: string, message = code) {
    super(message);
  }
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info, webhook-id, webhook-timestamp, webhook-signature",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function answer(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function fail(
  status: number,
  code: string,
  message = code,
  extra: Record<string, unknown> = {},
): Response {
  return answer({ ok: false, error: { code, message }, ...extra }, status);
}

export function logEvent(name: string): void {
  Deno.stderr.writeSync(
    new TextEncoder().encode(JSON.stringify({ event: name }) + "\n"),
  );
}

export function serve(handler: (request: Request) => Promise<Response>): void {
  Deno.serve(async (request) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof ApiError) {
        return fail(error.status, error.code, error.message);
      }
      logEvent("function.unexpected_error");
      return fail(500, "internal_error");
    }
  });
}

export async function bodyObject(
  request: Request,
): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 16384) {
    throw new ApiError(422, "invalid_request", "body is too large");
  }
  let value: unknown;
  const raw = await request.text();
  if (raw.length > 16384) {
    throw new ApiError(422, "invalid_request", "body is too large");
  }
  try {
    value = JSON.parse(raw);
  } catch {
    throw new ApiError(422, "invalid_request", "body must be JSON");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(422, "invalid_request", "body must be an object");
  }
  return value as Record<string, unknown>;
}

export function textField(
  body: Record<string, unknown>,
  key: string,
  min = 1,
  max = 500,
): string {
  const value = body[key];
  if (
    typeof value !== "string" || value.trim().length < min || value.length > max
  ) {
    throw new ApiError(422, "invalid_request", `${key} is invalid`);
  }
  return value.trim();
}

export function optionalText(
  body: Record<string, unknown>,
  key: string,
  max = 500,
): string | null {
  const value = body[key];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > max) {
    throw new ApiError(422, "invalid_request", `${key} is invalid`);
  }
  return value;
}

export function uuid(value: unknown, field: string): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(value)
  ) {
    throw new ApiError(422, "invalid_request", `${field} must be a UUID`);
  }
  return value;
}

export function pageLimit(value: unknown, max = 50): number {
  if (value === undefined || value === null) return Math.min(20, max);
  if (
    !Number.isInteger(value) || (value as number) < 1 || (value as number) > max
  ) {
    throw new ApiError(422, "invalid_request", "limit is invalid");
  }
  return value as number;
}

export function pageNumber(value: unknown): number {
  if (value === undefined || value === null) return 0;
  if (
    !Number.isInteger(value) || (value as number) < 0 ||
    (value as number) > 1000
  ) {
    throw new ApiError(422, "invalid_request", "page is invalid");
  }
  return value as number;
}

export function requireMethod(request: Request, method: string): void {
  if (request.method !== method) {
    throw new ApiError(405, "invalid_request", "method is invalid");
  }
}
