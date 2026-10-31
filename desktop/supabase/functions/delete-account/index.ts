import { answer, ApiError, requireMethod, serve } from "../_shared/http.ts";
import { polarClient } from "../_shared/polar.ts";
import { caller, rpc, serviceClient } from "../_shared/supabase.ts";

serve(async (request) => {
  requireMethod(request, "POST");
  const { client, user } = await caller(request, true);
  for (let batch = 0; batch < 100; batch += 1) {
    const result = await rpc<{ items: string[] }>(
      client,
      "my_active_polar_subscription_ids",
      { p_limit: 20 },
    );
    const ids = result?.items;
    if (!Array.isArray(ids)) throw new ApiError(502, "upstream_error");
    if (ids.length === 0) {
      await rpc(client, "delete_my_account");
      return answer({ ok: true });
    }
    let polar;
    try {
      polar = polarClient();
    } catch {
      throw new ApiError(503, "billing_unavailable");
    }
    for (const item of ids) {
      const id = item;
      if (typeof id !== "string" || !id) {
        throw new ApiError(502, "upstream_error");
      }
      try {
        await polar.subscriptions.revoke(id);
      } catch {
        throw new ApiError(502, "upstream_error");
      }
      const marked = await rpc<number>(
        serviceClient(),
        "billing_mark_cancelled",
        { p_user: user.id, p_subscription_id: id },
      );
      if (typeof marked !== "number" || marked < 1) {
        throw new ApiError(502, "upstream_error");
      }
    }
  }
  throw new ApiError(502, "upstream_error");
});
