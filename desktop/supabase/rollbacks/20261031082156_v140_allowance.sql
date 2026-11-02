-- REVIEWED ROLLBACK; never run directly. Desktop 1.4.0 must stop claiming first.
drop function if exists public.device_handoff_complete(uuid, text);
drop function if exists public.device_handoff_begin(uuid);
drop function if exists public.claim_run(uuid, smallint[]);
drop function if exists public.get_allowance(uuid);
