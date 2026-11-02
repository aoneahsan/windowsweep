-- REVIEWED ROLLBACK; never run directly. Disable export/report buttons first.
drop function if exists public.export_my_history(text, integer);
drop function if exists public.my_machines_report(integer, integer, integer);
