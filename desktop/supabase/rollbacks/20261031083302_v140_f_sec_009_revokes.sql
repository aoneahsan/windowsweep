-- REVIEWED ROLLBACK; never run directly. Reopening F-SEC-009 is undesirable.
-- If a platform update proves that the event trigger requires its old EXECUTE
-- ACL, review this exact grant in a new forward migration:
-- grant execute on function public.rls_auto_enable() to public, anon, authenticated, service_role;
-- Restoring broad sequence defaults is deliberately omitted. FilesHub keeps
-- its explicit service_role grant on the existing keepalive sequence.
select 'Security revokes retained; no automatic rollback' as review_result;
