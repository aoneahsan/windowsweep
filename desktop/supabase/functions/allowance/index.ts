import {
  answer,
  ApiError,
  bodyObject,
  requireMethod,
  serve,
  uuid,
} from "../_shared/http.ts";
import { caller, rpc } from "../_shared/supabase.ts";

serve(async (request) => {
  if (request.method === "GET") {
    const deviceId = uuid(
      new URL(request.url).searchParams.get("device_id"),
      "device_id",
    );
    const { client } = await caller(request);
    return answer({
      ok: true,
      ...await rpc<Record<string, unknown>>(client, "get_allowance", {
        p_device_id: deviceId,
      }),
    });
  }
  requireMethod(request, "POST");
  const body = await bodyObject(request);
  const deviceId = uuid(body.device_id, "device_id");
  if (
    !Array.isArray(body.sections) || body.sections.length < 1 ||
    body.sections.length > 64 ||
    body.sections.some((section) =>
      !Number.isInteger(section) || section < 0 || section > 99
    )
  ) {
    throw new ApiError(422, "invalid_request", "sections is invalid");
  }
  const { client } = await caller(request);
  const result = await rpc<
    {
      ok: boolean;
      reason?: string;
      allowance?: unknown;
      claim_id?: string;
      pool?: string;
    }
  >(client, "claim_run", { p_device_id: deviceId, p_sections: body.sections });
  if (result?.ok === false && result.reason === "limit_reached") {
    return answer({
      ok: false,
      error: { code: "limit_reached", message: "limit_reached" },
      allowance: result.allowance,
    }, 409);
  }
  return answer({ ...result, ok: true });
});
