import { isPlanEvent } from "./polar-event.ts";

Deno.test("plan checkout order is accepted", () => {
  const event = {
    type: "order.paid",
    data: { checkout_id: "checkout-1", metadata: { kind: "plan" } },
  };
  if (!isPlanEvent(event.data.metadata)) {
    throw new Error("plan event was refused");
  }
});

Deno.test("renewal and refund without copied metadata reach SQL linkage check", () => {
  const renewal = {
    type: "order.paid",
    data: { subscription_id: "subscription-1", metadata: undefined },
  };
  const refund = {
    type: "order.refunded",
    data: { checkout_id: "checkout-1", metadata: {} },
  };
  if (
    !isPlanEvent(renewal.data.metadata) || !isPlanEvent(refund.data.metadata)
  ) {
    throw new Error("linked event was refused");
  }
});

Deno.test("explicitly unrelated order is ignored", () => {
  const event = { type: "order.paid", data: { metadata: { kind: "other" } } };
  if (isPlanEvent(event.data.metadata)) {
    throw new Error("unrelated event was accepted");
  }
});
