export function isPlanEvent(
  metadata: Record<string, unknown> | undefined,
): boolean {
  return metadata?.kind == null || metadata.kind === "plan";
}

/**
 * The three subscription events `polar-webhook` records (ISSUE-003): a cancellation
 * made in Polar's customer portal, its withdrawal, and an ended subscription. Each
 * one says only whether the plan renews; none moves a paid period.
 */
export const SUBSCRIPTION_EVENTS = [
  "subscription.canceled",
  "subscription.uncanceled",
  "subscription.revoked",
] as const;

export type SubscriptionEventType = (typeof SUBSCRIPTION_EVENTS)[number];

export function isSubscriptionEvent(
  type: string,
): type is SubscriptionEventType {
  return (SUBSCRIPTION_EVENTS as readonly string[]).includes(type);
}

/** The fields of Polar's Subscription that decide whether it renews. */
export type PolarSubscriptionState = {
  id: string;
  status: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  ended_at: string | null;
  modified_at: string | null;
  metadata?: Record<string, unknown>;
};

/**
 * The arguments for `billing_record_subscription_state`, or null when the payload
 * cannot be recorded safely.
 *
 * 🔴 The order key is the subscription's own `modified_at`, falling back to the
 * delivery's `timestamp` only when Polar sent none: the SQL keeps the newest state,
 * so a retried, older delivery can never undo a newer change.
 */
export function subscriptionStateArgs(
  eventId: string,
  type: SubscriptionEventType,
  data: PolarSubscriptionState,
  deliveredAt: string,
): Record<string, string | boolean | null> | null {
  const when = (value: unknown): string | null | undefined => {
    if (value == null) return null;
    if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
      return undefined;
    }
    return value;
  };
  const canceledAt = when(data.canceled_at);
  const endedAt = when(data.ended_at);
  const modifiedAt = when(data.modified_at) ?? when(deliveredAt);
  if (
    typeof data.id !== "string" || data.id.length < 1 || data.id.length > 200 ||
    typeof data.status !== "string" || data.status.length < 1 ||
    data.status.length > 40 || typeof data.cancel_at_period_end !== "boolean" ||
    canceledAt === undefined || endedAt === undefined || !modifiedAt
  ) return null;
  return {
    p_event_id: eventId,
    p_event_type: type,
    p_subscription_id: data.id,
    p_status: data.status,
    p_cancel_at_period_end: data.cancel_at_period_end,
    p_canceled_at: canceledAt,
    p_ended_at: endedAt,
    p_modified_at: modifiedAt,
  };
}
