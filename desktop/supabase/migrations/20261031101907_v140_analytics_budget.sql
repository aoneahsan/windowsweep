CREATE TABLE "analytics_daily_totals" (
	"day" date PRIMARY KEY NOT NULL,
	"event_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "analytics_daily_totals_count_bound" CHECK ("analytics_daily_totals"."event_count" between 0 and 10000)
);
--> statement-breakpoint
ALTER TABLE "analytics_daily_totals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "analytics_daily_usage" (
	"day" date NOT NULL,
	"user_id" uuid NOT NULL,
	"event_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "analytics_daily_usage_day_user_id_pk" PRIMARY KEY("day","user_id"),
	CONSTRAINT "analytics_daily_usage_count_bound" CHECK ("analytics_daily_usage"."event_count" between 0 and 200)
);
--> statement-breakpoint
ALTER TABLE "analytics_daily_usage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "analytics_daily_usage" ADD CONSTRAINT "analytics_daily_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Drizzle models the two tables and their RLS. It cannot model grants, functions
-- or the retention schedule. Close all direct access, including service_role.
revoke all on table public.analytics_daily_totals
  from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.analytics_daily_usage
  from public, anon, authenticated, service_role;
--> statement-breakpoint

-- One locked day row serializes concurrent claims. Both counters advance in the
-- same transaction, so a per-user refusal cannot consume global allowance.
create or replace function public.analytics_budget_claim(p_user uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_day date := (now() at time zone 'UTC')::date;
  v_total integer;
  v_user integer;
begin
  if p_user is null or not exists (select 1 from auth.users where id = p_user) then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  insert into public.analytics_daily_totals(day, event_count) values (v_day, 0)
    on conflict (day) do nothing;
  select event_count into v_total from public.analytics_daily_totals
    where day = v_day for update;
  if v_total >= 10000 then return false; end if;

  insert into public.analytics_daily_usage(day, user_id, event_count)
    values (v_day, p_user, 0)
    on conflict (day, user_id) do nothing;
  select event_count into v_user from public.analytics_daily_usage
    where day = v_day and user_id = p_user for update;
  if v_user >= 200 then return false; end if;

  update public.analytics_daily_totals set event_count = event_count + 1
    where day = v_day;
  update public.analytics_daily_usage set event_count = event_count + 1
    where day = v_day and user_id = p_user;
  return true;
end;
$$;
--> statement-breakpoint
revoke all on function public.analytics_budget_claim(uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.analytics_budget_claim(uuid) to service_role;
--> statement-breakpoint

-- Admin reads a bounded aggregate, never an event stream or a user list.
create or replace function public.admin_analytics_budget(p_user uuid default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_day date := (now() at time zone 'UTC')::date;
  v_global integer;
  v_user integer;
begin
  perform private.require_admin();
  if p_user is not null and
      not exists (select 1 from public.profiles where user_id = p_user) then
    raise exception 'not_found' using errcode = 'PT404';
  end if;
  select event_count into v_global from public.analytics_daily_totals
    where day = v_day;
  if p_user is not null then
    select event_count into v_user from public.analytics_daily_usage
      where day = v_day and user_id = p_user;
  end if;
  return jsonb_build_object('day', v_day, 'global_count', coalesce(v_global, 0),
    'global_cap', 10000, 'user_id', p_user,
    'user_count', case when p_user is null then null else coalesce(v_user, 0) end,
    'user_cap', 200);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_analytics_budget(uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_analytics_budget(uuid) to authenticated;
--> statement-breakpoint

-- No event data is stored. Delete counts older than 30 UTC days even if the app
-- stops sending events. The shared pg_cron extension is never dropped by rollback.
create extension if not exists pg_cron with schema extensions;
--> statement-breakpoint
create or replace function private.prune_analytics_daily_usage()
returns void language plpgsql security definer set search_path = '' as $$
begin
  delete from public.analytics_daily_usage
    where day < (now() at time zone 'UTC')::date - 30;
  delete from public.analytics_daily_totals
    where day < (now() at time zone 'UTC')::date - 30;
end;
$$;
--> statement-breakpoint
revoke all on function private.prune_analytics_daily_usage()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
select cron.schedule('windowsweep-analytics-retention', '15 2 * * *',
  'select private.prune_analytics_daily_usage()');
