import {
  isPlanEvent,
  isSubscriptionEvent,
  subscriptionStateArgs,
} from "./polar-event.ts";

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

Deno.test("the three subscription events are recorded, nothing else", () => {
  for (
    const type of [
      "subscription.canceled",
      "subscription.uncanceled",
      "subscription.revoked",
    ]
  ) {
    if (!isSubscriptionEvent(type)) throw new Error(`${type} was refused`);
  }
  for (
    const type of ["subscription.updated", "subscription.active", "order.paid"]
  ) {
    if (isSubscriptionEvent(type)) throw new Error(`${type} was accepted`);
  }
});

const canceled = {
  id: "sub_1",
  status: "active",
  cancel_at_period_end: true,
  canceled_at: "2026-11-08T10:00:00Z",
  ended_at: null,
  modified_at: "2026-11-08T10:00:01Z",
};

Deno.test("a portal cancellation keeps the subscription's own order key", () => {
  const args = subscriptionStateArgs(
    "evt_1",
    "subscription.canceled",
    canceled,
    "2026-11-08T10:00:05Z",
  );
  if (
    !args || args.p_subscription_id !== "sub_1" ||
    args.p_cancel_at_period_end !== true ||
    args.p_modified_at !== "2026-11-08T10:00:01Z" ||
    args.p_canceled_at !== "2026-11-08T10:00:00Z" || args.p_ended_at !== null
  ) throw new Error(`wrong arguments: ${JSON.stringify(args)}`);
});

Deno.test("no modified_at falls back to the delivery time", () => {
  const args = subscriptionStateArgs(
    "evt_2",
    "subscription.uncanceled",
    {
      ...canceled,
      cancel_at_period_end: false,
      canceled_at: null,
      modified_at: null,
    },
    "2026-11-08T10:00:05Z",
  );
  if (args?.p_modified_at !== "2026-11-08T10:00:05Z") {
    throw new Error(`wrong order key: ${JSON.stringify(args)}`);
  }
});

Deno.test("a payload that cannot be ordered or read is refused", () => {
  const bad = [
    { ...canceled, modified_at: null },
    { ...canceled, canceled_at: "not a date" },
    { ...canceled, cancel_at_period_end: "yes" as unknown as boolean },
    { ...canceled, id: "" },
  ];
  bad.forEach((data, index) => {
    const deliveredAt = index === 0 ? "" : "2026-11-08T10:00:05Z";
    if (
      subscriptionStateArgs("evt_3", "subscription.canceled", data, deliveredAt)
    ) {
      throw new Error(`payload ${index} was accepted`);
    }
  });
});
