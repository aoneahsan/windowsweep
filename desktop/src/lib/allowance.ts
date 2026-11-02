/** The server owns every real-run count. This module only reads its answer. */
import { z } from 'zod';

import { ensureDeviceSession, installationId } from './auth';

export { ensureDeviceSession, installationId } from './auth';

const pool = z.object({
  used: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});
const allowanceSchema = z.object({
  ok: z.literal(true),
  month: z.string(),
  resets_at: z.string(),
  device: pool,
  account: pool.nullable(),
  plan: z.object({ id: z.string(), name: z.string(), unlimited: z.boolean() }),
  runs_left: z.number().int().nonnegative().nullable(),
  is_anonymous: z.boolean(),
});

export type Allowance = z.infer<typeof allowanceSchema>;
/** Read the combined device/account allowance without estimating it locally. */
export async function getAllowance(): Promise<Allowance> {
  const client = await ensureDeviceSession();
  const result = await client.functions.invoke(
    `allowance?device_id=${encodeURIComponent(installationId())}`,
    { method: 'GET' }
  );
  if (result.error) throw result.error;
  const payload: unknown = result.data;
  return allowanceSchema.parse(payload);
}
