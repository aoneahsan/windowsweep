import { webhooks } from "@polar-sh/sdk/2026-10";
import { answer, ApiError, requireMethod, serve } from "../_shared/http.ts";
import { sendBillingEmail } from "../_shared/billing-email.ts";
import {
  isPlanEvent,
  isSubscriptionEvent,
  type PolarSubscriptionState,
  subscriptionStateArgs,
} from "../_shared/polar-event.ts";
import { rpc, serviceClient } from "../_shared/supabase.ts";

type Order = {
  id: string;
  checkout_id: string | null;
  subscription_id: string | null;
  customer_id: string;
  subtotal_amount: number;
  refunded_amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
};

serve(async (request) => {
  requireMethod(request, "POST");
  const secret = Deno.env.get("POLAR_WEBHOOK_SECRET");
  if (!secret) throw new ApiError(503, "billing_unavailable");
  const raw = await request.text();
  if (!raw || raw.length > 1024 * 1024) {
    throw new ApiError(400, "invalid_request");
  }
  let event;
  try {
    event = await webhooks.validateEvent(
      raw,
      Object.fromEntries(request.headers),
      secret,
    );
  } catch (error) {
    if (error instanceof webhooks.PolarWebhookUnknownTypeError) {
      return answer({ ok: true, ignored: true }, 202);
    }
    if (error instanceof webhooks.PolarWebhookVerificationError) {
      throw new ApiError(403, "forbidden");
    }
    throw new ApiError(400, "invalid_request");
  }
  // ISSUE-003: a cancellation made in Polar's customer portal, its withdrawal, or an
  // ended subscription. Recorded as the subscription's state, which decides whether
  // my_plan() says "renewing on" or "until"; no paid period moves.
  if (isSubscriptionEvent(event.type)) {
    const data = event.data as PolarSubscriptionState;
    if (!isPlanEvent(data.metadata)) {
      return answer({ ok: true, ignored: true }, 202);
    }
    const deliveryId = request.headers.get("webhook-id");
    const args = deliveryId && deliveryId.length <= 200
      ? subscriptionStateArgs(deliveryId, event.type, data, event.timestamp)
      : null;
    if (!args) throw new ApiError(400, "invalid_request");
    await rpc(serviceClient(), "billing_record_subscription_state", args);
    return answer({ ok: true });
  }
  if (event.type !== "order.paid" && event.type !== "order.refunded") {
    return answer({ ok: true, ignored: true }, 202);
  }
  const order = event.data as Order;
  if (!isPlanEvent(order.metadata)) {
    return answer({ ok: true, ignored: true }, 202);
  }
  const deliveryId = request.headers.get("webhook-id");
  if (
    !deliveryId || deliveryId.length > 200 || !order.id ||
    !Number.isInteger(order.subtotal_amount) ||
    !Number.isInteger(order.refunded_amount)
  ) throw new ApiError(400, "invalid_request");
  const service = serviceClient();
  if (event.type === "order.paid") {
    await rpc(
      service,
      "billing_record_paid",
      {
        p_event_id: deliveryId,
        p_order_id: order.id,
        p_checkout_id: order.checkout_id,
        p_subscription_id: order.subscription_id,
        p_customer_id: order.customer_id,
        p_amount: order.subtotal_amount,
        p_currency: order.currency.toLowerCase(),
      },
    );
    await sendBillingEmail(deliveryId, "windowsweep-plan-confirmed");
  } else {
    await rpc(
      service,
      "billing_record_returned",
      {
        p_event_id: deliveryId,
        p_order_id: order.id,
        p_returned_cents: order.refunded_amount,
        p_checkout_id: order.checkout_id,
        p_subscription_id: order.subscription_id,
      },
    );
    await sendBillingEmail(deliveryId, "windowsweep-payment-returned");
  }
  return answer({ ok: true });
});
