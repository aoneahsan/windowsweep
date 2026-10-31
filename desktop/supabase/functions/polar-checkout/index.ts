import {
  answer,
  ApiError,
  bodyObject,
  requireMethod,
  serve,
  textField,
} from "../_shared/http.ts";
import { website } from "../_shared/email.ts";
import { polarAvailable, polarClient, polarProduct } from "../_shared/polar.ts";
import { caller, rpc, serviceClient } from "../_shared/supabase.ts";

serve(async (request) => {
  if (request.method === "GET") {
    return answer({ ok: true, available: polarAvailable() });
  }
  requireMethod(request, "POST");
  const body = await bodyObject(request);
  const plan = textField(body, "plan_id", 1, 40);
  const interval = textField(body, "interval", 4, 5);
  if (interval !== "month" && interval !== "year") {
    throw new ApiError(422, "invalid_request", "interval is invalid");
  }
  if (
    body.seats !== undefined &&
    (!Number.isInteger(body.seats) || (body.seats as number) < 1 ||
      (body.seats as number) > 1000)
  ) {
    throw new ApiError(422, "invalid_request", "seats is invalid");
  }
  const { client, user } = await caller(request, true);
  if (!polarAvailable()) throw new ApiError(503, "billing_unavailable");
  const quote = await rpc<
    {
      plan_id: string;
      interval: string;
      seats: number;
      unit_cents: number;
      amount_cents: number;
    }
  >(client, "billing_quote", {
    p_plan_id: plan,
    p_interval: interval,
    p_seats: body.seats ?? null,
  });
  const { data: planRow, error: planError } = await client.from("plans")
    .select("per_seat").eq("id", quote.plan_id).maybeSingle();
  if (planError || !planRow) throw new ApiError(502, "upstream_error");
  const product = polarProduct(quote.plan_id, quote.interval);
  let checkout;
  try {
    checkout = await polarClient().checkouts.create({
      products: [product],
      external_customer_id: user.id,
      ...(planRow.per_seat ? { seats: quote.seats } : {}),
      metadata: {
        kind: "plan",
        plan_id: quote.plan_id,
        interval: quote.interval,
        seats: quote.seats,
      },
      success_url: website("/account?checkout_id={CHECKOUT_ID}"),
      return_url: website("/pricing"),
    });
  } catch {
    throw new ApiError(502, "upstream_error");
  }
  if (!checkout?.id || !checkout?.url) {
    throw new ApiError(502, "upstream_error");
  }
  await rpc(serviceClient(), "billing_record_quote", {
    p_checkout_id: checkout.id,
    p_user: user.id,
    p_plan_id: quote.plan_id,
    p_interval: quote.interval,
    p_seats: quote.seats,
    p_unit: quote.unit_cents,
    p_amount: quote.amount_cents,
  });
  return answer({ ok: true, url: checkout.url });
});
