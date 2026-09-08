-- ROLLBACK for 20260908070246_close_trigger_function_execute.sql — REVIEWED, NEVER AUTO-APPLIED.
--
-- 🔴 THERE IS NO LEGITIMATE REASON TO RUN THIS. It re-grants EXECUTE on four
-- SECURITY DEFINER trigger functions to anon and authenticated, restoring exactly the
-- state that migration was written to close. It is recorded only so the folder is
-- complete and so the statement is written down rather than reconstructed from memory
-- by somebody in a hurry.
--
-- If a browser genuinely needs to call one of these, that is a new function with a
-- named caller and its own gate — not a widened grant on a trigger's internals.
grant execute on function public.set_updated_at() to authenticated;
grant execute on function public.handle_new_user() to authenticated;
grant execute on function public.enforce_contact_request_rate_limit() to authenticated;
grant execute on function public.audit_contact_request_status() to authenticated;
