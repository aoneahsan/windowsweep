-- REVIEWED ROLLBACK; never run directly. Team UI and billing RPCs must stop first.
drop function if exists public.team_invite_mark_uncertain(uuid, uuid);
drop function if exists public.team_fleet(integer, integer);
drop function if exists public.team_remove(uuid, uuid);
drop function if exists public.team_accept(uuid);
drop function if exists public.team_my_invites(integer, integer);
drop function if exists public.team_invite_release_send(uuid, uuid);
drop function if exists public.team_invite_mark_sent(uuid, uuid);
drop function if exists public.team_invite_prepare(text);
drop function if exists public.team_create(text);
drop function if exists private.ensure_owned_team(uuid, text);
