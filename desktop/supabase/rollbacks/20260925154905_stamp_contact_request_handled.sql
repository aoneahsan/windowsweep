-- ROLLBACK for 20260925154905_stamp_contact_request_handled.sql - REVIEWED, NEVER AUTO-APPLIED.
--
-- It destroys no data: the stamps already stored stay exactly as they are. What it gives back is the defect
-- TASK-017 closed - the admin's browser writing `handled_at` and `handled_by` itself, from its own clock and
-- with any id it likes. 🔴 It also needs the SITE to send both stamps again: the site since TASK-017 writes
-- `status` alone, so with the trigger gone and the old grant back, every triage would leave both stamps as they
-- were. Roll the site back in the same change, or leave the trigger in place.
--
-- Using it is a NEW forward migration, never a hand-run of this file, and an owner decision.

grant update (handled_at, handled_by) on table public.contact_requests to authenticated;
--> statement-breakpoint

drop trigger if exists contact_requests_stamp_handled on public.contact_requests;
--> statement-breakpoint

drop function if exists public.stamp_contact_request_handled();
