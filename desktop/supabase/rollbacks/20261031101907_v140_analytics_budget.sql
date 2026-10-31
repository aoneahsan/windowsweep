-- REVIEWED ROLLBACK; never run directly. The daily usage counts are lost.
-- Keep the shared pg_cron extension: another product may use it.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'windowsweep-analytics-retention') then
    perform cron.unschedule('windowsweep-analytics-retention');
  end if;
end;
$$;
drop function if exists private.prune_analytics_daily_usage();
drop function if exists public.admin_analytics_budget(uuid);
drop function if exists public.analytics_budget_claim(uuid);
drop table if exists public.analytics_daily_usage;
drop table if exists public.analytics_daily_totals;
