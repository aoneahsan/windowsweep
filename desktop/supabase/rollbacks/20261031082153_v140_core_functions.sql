-- REVIEWED ROLLBACK; never run directly. Later RPCs and policies must go first.
drop trigger if exists plan_requests_validate_before_insert on public.plan_requests;
drop function if exists private.validate_plan_request();
drop function if exists public.mark_legal_notice_seen();
drop function if exists public.my_plan();
drop function if exists private.team_seats(uuid, timestamptz);
drop function if exists private.plan_for_user(uuid, timestamptz);
drop function if exists private.require_account();
