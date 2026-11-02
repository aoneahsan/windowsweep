/** Typed client boundary for the plan, request, referral and team contracts. */
import { z } from 'zod';

import { ensureDeviceSession } from './allowance';

const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  price_month_cents: z.number().int(),
  price_year_cents: z.number().int(),
  per_seat: z.boolean(),
  min_seats: z.number().int(),
  is_active: z.boolean(),
  report_machines: z.number().int(),
  account_extra_real_runs_per_month: z.number().int().nullable(),
});
export type Plan = z.infer<typeof planSchema>;

const myPlanSchema = z.object({
  is_anonymous: z.boolean(),
  plan: z.object({
    id: z.string(),
    name: z.string(),
    real_runs_unlimited: z.boolean(),
    fleet_reports: z.boolean(),
  }),
  source: z.string(),
  ends_at: z.string().nullable(),
  team: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      role: z.enum(['owner', 'member']),
      seats: z.number().int(),
    })
    .nullable(),
  pending_request: z
    .object({
      id: z.string().uuid(),
      plan_id: z.string(),
      interval: z.enum(['month', 'year']),
      seats: z.number().int(),
      created_at: z.string(),
    })
    .nullable(),
});
export type MyPlan = z.infer<typeof myPlanSchema>;

const requestSchema = z.object({
  id: z.string().uuid(),
  plan_id: z.string(),
  interval: z.enum(['month', 'year']),
  seats: z.number().int(),
  status: z.enum(['pending', 'notified', 'closed']),
  created_at: z.string(),
  notified_at: z.string().nullable(),
});
export type PlanRequest = z.infer<typeof requestSchema>;

const referralSchema = z.object({
  enabled: z.boolean(),
  code: z.string().nullable(),
  points: z.number().int(),
  confirmed: z.number().int(),
  pending: z.number().int(),
  expired: z.number().int(),
  months_earned_total: z.number().int(),
  next_reward_in: z.number().int().nullable(),
  rule: z.object({
    points_per_confirmed: z.number().int(),
    threshold: z.number().int(),
    reward_months: z.number().int(),
    cap_months_per_year: z.number().int(),
    reward_plan: z.object({ id: z.string(), name: z.string() }),
  }),
});
export type Referral = z.infer<typeof referralSchema>;

const fleetSchema = z.object({
  team: z.object({
    id: z.string().uuid(),
    name: z.string(),
    seats: z.number().int(),
    role: z.enum(['owner', 'member']),
  }),
  members: z.array(
    z.object({
      user_id: z.string().uuid(),
      email: z.string().nullable(),
      display_name: z.string().nullable(),
      role: z.string(),
      machines: z.number().int(),
      real_runs_30d: z.number().int(),
      freed_bytes_30d: z.number(),
    })
  ),
  runs: z.array(
    z.object({
      member_id: z.string().uuid(),
      device_id: z.string().uuid().nullable(),
      started_at: z.string(),
      mode: z.string(),
      sections: z.array(z.number().int()),
      freed_bytes: z.number(),
    })
  ),
  invites: z.array(
    z.object({
      id: z.string().uuid(),
      email: z.string(),
      created_at: z.string(),
      expires_at: z.string(),
    })
  ),
  totals: z.object({
    members: z.number().int(),
    machines: z.number().int(),
    real_runs_30d: z.number().int(),
    freed_bytes_30d: z.number(),
  }),
  next_page: z.number().int().nullable(),
});
export type Fleet = z.infer<typeof fleetSchema>;

/** Public registry, ordered server-side; the screen renders its current numbers. */
export async function getPlans(): Promise<Plan[]> {
  const client = await ensureDeviceSession();
  const { data, error } = await client
    .from('plans')
    .select(
      'id,name,price_month_cents,price_year_cents,per_seat,min_seats,is_active,report_machines,account_extra_real_runs_per_month'
    )
    .order('rank')
    .limit(20);
  if (error) throw error;
  return z.array(planSchema).parse(data);
}

/** The signed-out account pool is public config when the Free plan inherits it. */
export async function getAccountPoolLimit(): Promise<number> {
  const client = await ensureDeviceSession();
  const result = await client
    .from('app_config')
    .select('value')
    .eq('key', 'account_extra_real_runs_per_month')
    .limit(1)
    .single();
  if (result.error) throw result.error;
  return z.number().int().nonnegative().parse(result.data.value);
}

/** The server resolves the entitlement from active payment, grant and team time. */
export async function getMyPlan(): Promise<MyPlan> {
  const client = await ensureDeviceSession();
  const result = await client.rpc('my_plan');
  if (result.error) throw result.error;
  const payload: unknown = result.data;
  return myPlanSchema.parse(payload);
}

/** One most recent request; status stays visible after it is notified. */
export async function getRecentRequest(): Promise<PlanRequest | null> {
  const client = await ensureDeviceSession();
  const result = await client
    .from('plan_requests')
    .select('id,plan_id,interval,seats,status,created_at,notified_at')
    .order('created_at', { ascending: false })
    .limit(1);
  if (result.error) throw result.error;
  const items = z.array(requestSchema).parse(result.data);
  return items[0] ?? null;
}

/** The owner can file one pending request; this action never charges or grants. */
export async function requestPlan(input: {
  planId: string;
  interval: 'month' | 'year';
  seats: number;
}): Promise<void> {
  const client = await ensureDeviceSession();
  const { data: auth, error: authError } = await client.auth.getUser();
  if (authError) throw authError;
  if (!auth.user || auth.user.is_anonymous) throw new Error('signed_in_required');
  const { error } = await client.from('plan_requests').insert({
    plan_id: input.planId,
    interval: input.interval,
    seats: input.seats,
  });
  if (error) throw error;
}

/** Private aggregate: never fetch invitee rows to count them in the window. */
export async function getReferral(): Promise<Referral> {
  const client = await ensureDeviceSession();
  const result = await client.rpc('my_referral_status');
  if (result.error) throw result.error;
  const payload: unknown = result.data;
  return referralSchema.parse(payload);
}

async function teamAction(action: string, payload: Record<string, unknown> = {}): Promise<unknown> {
  const client = await ensureDeviceSession();
  const result = await client.functions.invoke('team', { body: { action, ...payload } });
  if (result.error) {
    const failure: unknown = result.error;
    const context: unknown =
      failure && typeof failure === 'object' && 'context' in failure ? failure.context : null;
    if (context instanceof Response) {
      let body: unknown = null;
      try {
        body = await context.clone().json();
      } catch {
        /* A non-JSON upstream failure keeps the original error. */
      }
      const parsed = z.object({ error: z.object({ code: z.string() }) }).safeParse(body);
      if (parsed.success) throw new Error(parsed.data.error.code);
    }
    throw result.error;
  }
  const answer: unknown = result.data;
  return answer;
}

export async function getFleet(page = 0): Promise<Fleet> {
  const result = await teamAction('fleet', { page, limit: 20 });
  return fleetSchema.parse(result);
}

export async function createTeam(name: string): Promise<void> {
  await teamAction('create', { name: name.trim() });
}

export async function inviteToTeam(email: string): Promise<{ email_sent: boolean }> {
  const result = await teamAction('invite', { email: email.trim().toLowerCase() });
  return z.object({ email_sent: z.boolean() }).parse(result);
}

export async function removeTeamInvite(inviteId: string): Promise<void> {
  await teamAction('remove', { invite_id: inviteId });
}

export async function removeTeamMember(userId: string): Promise<void> {
  await teamAction('remove', { user_id: userId });
}
