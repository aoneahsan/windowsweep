-- REVIEWED ROLLBACK; never run directly. First detach the Before User Created
-- hook in Auth configuration, or every new signup fails after this drop.
drop function if exists public.windowsweep_before_user_created(jsonb);
