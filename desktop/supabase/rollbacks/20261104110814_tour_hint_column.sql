-- Reviewed companion only. Apply as a new forward migration if needed.
-- First remove the dependent marker function, then the private hint record.
drop function if exists public.mark_tour_hint(text);
alter table public.profiles drop column if exists tour_hinted;
