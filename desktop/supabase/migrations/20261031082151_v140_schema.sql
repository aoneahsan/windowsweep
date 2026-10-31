CREATE TYPE "public"."billing_interval" AS ENUM('month', 'year');--> statement-breakpoint
CREATE TYPE "public"."grant_source" AS ENUM('admin', 'referral');--> statement-breakpoint
CREATE TYPE "public"."plan_request_status" AS ENUM('pending', 'notified', 'closed');--> statement-breakpoint
CREATE TYPE "public"."referral_status" AS ENUM('pending', 'confirmed');--> statement-breakpoint
CREATE TYPE "public"."release_channel" AS ENUM('production', 'test');--> statement-breakpoint
CREATE TYPE "public"."release_platform" AS ENUM('desktop', 'web', 'docs');--> statement-breakpoint
CREATE TYPE "public"."release_severity" AS ENUM('urgent', 'normal');--> statement-breakpoint
CREATE TYPE "public"."run_pool" AS ENUM('device', 'account', 'plan');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'returned');--> statement-breakpoint
CREATE TYPE "public"."team_role" AS ENUM('owner', 'member');--> statement-breakpoint
CREATE TABLE "checkout_quotes" (
	"polar_checkout_id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" text NOT NULL,
	"interval" "billing_interval" NOT NULL,
	"seats" smallint NOT NULL,
	"unit_cents" integer NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"used_order_id" text,
	CONSTRAINT "checkout_quotes_used_order_id_unique" UNIQUE("used_order_id"),
	CONSTRAINT "checkout_quotes_seats_range" CHECK ("checkout_quotes"."seats" between 1 and 1000),
	CONSTRAINT "checkout_quotes_amount" CHECK ("checkout_quotes"."unit_cents" > 0 and "checkout_quotes"."amount_cents" = "checkout_quotes"."unit_cents" * "checkout_quotes"."seats"),
	CONSTRAINT "checkout_quotes_currency_format" CHECK ("checkout_quotes"."currency" ~ '^[a-z]{3}$')
);
--> statement-breakpoint
ALTER TABLE "checkout_quotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" text NOT NULL,
	"team_id" uuid,
	"interval" "billing_interval" NOT NULL,
	"seats" smallint DEFAULT 1 NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"polar_order_id" text NOT NULL,
	"polar_subscription_id" text,
	"polar_customer_id" text,
	"returned_at" timestamp with time zone,
	"returned_cents" integer,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_polar_order_id_unique" UNIQUE("polar_order_id"),
	CONSTRAINT "subscriptions_period" CHECK ("subscriptions"."period_end" > "subscriptions"."period_start"),
	CONSTRAINT "subscriptions_seats_range" CHECK ("subscriptions"."seats" between 1 and 1000),
	CONSTRAINT "subscriptions_amount_nonneg" CHECK ("subscriptions"."amount_cents" >= 0),
	CONSTRAINT "subscriptions_currency_format" CHECK ("subscriptions"."currency" ~ '^[a-z]{3}$'),
	CONSTRAINT "subscriptions_returned_pair" CHECK (("subscriptions"."status" = 'returned') = ("subscriptions"."returned_at" is not null))
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"order_id" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"result" text,
	CONSTRAINT "webhook_events_id_len" CHECK (char_length("webhook_events"."id") between 1 and 200)
);
--> statement-breakpoint
ALTER TABLE "webhook_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"handoff_code_hash" text,
	"handoff_expires_at" timestamp with time zone,
	CONSTRAINT "devices_handoff_pair" CHECK (("devices"."handoff_code_hash" is null) = ("devices"."handoff_expires_at" is null)),
	CONSTRAINT "devices_handoff_hash_format" CHECK ("devices"."handoff_code_hash" is null or "devices"."handoff_code_hash" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
ALTER TABLE "devices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "run_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" uuid NOT NULL,
	"user_id" uuid,
	"month" text NOT NULL,
	"pool" "run_pool" NOT NULL,
	"sections" smallint[] NOT NULL,
	CONSTRAINT "run_claims_month_format" CHECK ("run_claims"."month" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
	CONSTRAINT "run_claims_sections_valid" CHECK (cardinality("run_claims"."sections") between 1 and 64 and array_position("run_claims"."sections", null) is null and 0 <= all ("run_claims"."sections") and 99 >= all ("run_claims"."sections"))
);
--> statement-breakpoint
ALTER TABLE "run_claims" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"min_value" numeric,
	"max_value" numeric,
	"description" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "app_config_key_format" CHECK ("app_config"."key" ~ '^[a-z][a-z0-9_]{1,63}$'),
	CONSTRAINT "app_config_description_len" CHECK (char_length("app_config"."description") <= 300),
	CONSTRAINT "app_config_bounds" CHECK (jsonb_typeof("app_config"."value") <> 'number' or (("app_config"."min_value" is null or ("app_config"."value" #>> '{}')::numeric >= "app_config"."min_value") and ("app_config"."max_value" is null or ("app_config"."value" #>> '{}')::numeric <= "app_config"."max_value")))
);
--> statement-breakpoint
ALTER TABLE "app_config" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plan_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" text NOT NULL,
	"source" "grant_source" NOT NULL,
	"seats" smallint DEFAULT 1 NOT NULL,
	"months" smallint,
	"granted_by" uuid,
	"reason" text NOT NULL,
	"starts_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plan_grants_window" CHECK ("plan_grants"."ends_at" > "plan_grants"."starts_at"),
	CONSTRAINT "plan_grants_reason_len" CHECK (char_length("plan_grants"."reason") between 1 and 500),
	CONSTRAINT "plan_grants_seats_range" CHECK ("plan_grants"."seats" between 1 and 1000),
	CONSTRAINT "plan_grants_months_range" CHECK ("plan_grants"."months" is null or "plan_grants"."months" between 1 and 12)
);
--> statement-breakpoint
ALTER TABLE "plan_grants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plan_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"plan_id" text NOT NULL,
	"interval" "billing_interval" NOT NULL,
	"seats" smallint DEFAULT 1 NOT NULL,
	"note" text,
	"status" "plan_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notify_claimed_at" timestamp with time zone,
	"notified_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"closed_by" uuid,
	CONSTRAINT "plan_requests_seats_range" CHECK ("plan_requests"."seats" between 1 and 1000),
	CONSTRAINT "plan_requests_note_len" CHECK ("plan_requests"."note" is null or char_length("plan_requests"."note") between 1 and 1000)
);
--> statement-breakpoint
ALTER TABLE "plan_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"rank" smallint NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"price_month_cents" integer DEFAULT 0 NOT NULL,
	"price_year_cents" integer DEFAULT 0 NOT NULL,
	"per_seat" boolean DEFAULT false NOT NULL,
	"min_seats" smallint DEFAULT 1 NOT NULL,
	"real_runs_unlimited" boolean DEFAULT false NOT NULL,
	"device_real_runs_per_month" integer,
	"account_extra_real_runs_per_month" integer,
	"report_machines" smallint DEFAULT 0 NOT NULL,
	"schedules" boolean DEFAULT false NOT NULL,
	"history_export" boolean DEFAULT false NOT NULL,
	"fleet_reports" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plans_id_format" CHECK ("plans"."id" ~ '^[a-z][a-z0-9_]{1,31}$'),
	CONSTRAINT "plans_name_len" CHECK (char_length("plans"."name") between 1 and 40),
	CONSTRAINT "plans_description_len" CHECK (char_length("plans"."description") <= 300),
	CONSTRAINT "plans_rank_range" CHECK ("plans"."rank" between 0 and 1000),
	CONSTRAINT "plans_prices_range" CHECK ("plans"."price_month_cents" between 0 and 1000000 and "plans"."price_year_cents" between 0 and 10000000),
	CONSTRAINT "plans_min_seats_range" CHECK ("plans"."min_seats" between 1 and 1000),
	CONSTRAINT "plans_run_limits_range" CHECK (coalesce("plans"."device_real_runs_per_month", 0) between 0 and 100000 and coalesce("plans"."account_extra_real_runs_per_month", 0) between 0 and 100000),
	CONSTRAINT "plans_report_machines_range" CHECK ("plans"."report_machines" between 0 and 1000)
);
--> statement-breakpoint
ALTER TABLE "plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_id" uuid NOT NULL,
	"invitee_id" uuid NOT NULL,
	"status" "referral_status" DEFAULT 'pending' NOT NULL,
	"points_awarded" integer DEFAULT 0 NOT NULL,
	"reward_grant_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"notified_at" timestamp with time zone,
	CONSTRAINT "referrals_invitee_id_unique" UNIQUE("invitee_id"),
	CONSTRAINT "referrals_not_self" CHECK ("referrals"."referrer_id" <> "referrals"."invitee_id"),
	CONSTRAINT "referrals_points_nonneg" CHECK ("referrals"."points_awarded" >= 0),
	CONSTRAINT "referrals_confirmed_pair" CHECK (("referrals"."status" = 'confirmed') = ("referrals"."confirmed_at" is not null))
);
--> statement-breakpoint
ALTER TABLE "referrals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" "release_platform" NOT NULL,
	"channel" "release_channel" NOT NULL,
	"version" text NOT NULL,
	"severity" "release_severity" NOT NULL,
	"reason" text NOT NULL,
	"min_native_version" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	CONSTRAINT "app_releases_version_format" CHECK ("app_releases"."version" ~ '^(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})$'),
	CONSTRAINT "app_releases_min_native_format" CHECK ("app_releases"."min_native_version" is null or "app_releases"."min_native_version" ~ '^(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})$'),
	CONSTRAINT "app_releases_reason_len" CHECK (char_length("app_releases"."reason") between 1 and 280)
);
--> statement-breakpoint
ALTER TABLE "app_releases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "team_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"email" text NOT NULL,
	"invited_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone DEFAULT now() + interval '14 days' NOT NULL,
	"accepted_at" timestamp with time zone,
	"accepted_by" uuid,
	"last_sent_at" timestamp with time zone,
	CONSTRAINT "team_invites_email_format" CHECK ("team_invites"."email" = lower("team_invites"."email") and char_length("team_invites"."email") between 3 and 254 and position('@' in "team_invites"."email") > 1)
);
--> statement-breakpoint
ALTER TABLE "team_invites" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "team_members" (
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "team_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_members_team_id_user_id_pk" PRIMARY KEY("team_id","user_id"),
	CONSTRAINT "team_members_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "team_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teams_owner_id_unique" UNIQUE("owner_id"),
	CONSTRAINT "teams_name_len" CHECK (char_length("teams"."name") between 1 and 80)
);
--> statement-breakpoint
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "referral_code" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "limits_override" jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "welcome_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "legal_notice_seen_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "runs" ADD COLUMN "device_id" uuid;--> statement-breakpoint
ALTER TABLE "checkout_quotes" ADD CONSTRAINT "checkout_quotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkout_quotes" ADD CONSTRAINT "checkout_quotes_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "run_claims" ADD CONSTRAINT "run_claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_grants" ADD CONSTRAINT "plan_grants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_grants" ADD CONSTRAINT "plan_grants_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_requests" ADD CONSTRAINT "plan_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_requests" ADD CONSTRAINT "plan_requests_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_invitee_id_users_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_reward_grant_id_plan_grants_id_fk" FOREIGN KEY ("reward_grant_id") REFERENCES "public"."plan_grants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "checkout_quotes_user_created_idx" ON "checkout_quotes" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "checkout_quotes_plan_idx" ON "checkout_quotes" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_period_idx" ON "subscriptions" USING btree ("user_id","period_end");--> statement-breakpoint
CREATE INDEX "subscriptions_team_period_idx" ON "subscriptions" USING btree ("team_id","period_end");--> statement-breakpoint
CREATE INDEX "subscriptions_polar_sub_idx" ON "subscriptions" USING btree ("polar_subscription_id","period_start");--> statement-breakpoint
CREATE INDEX "subscriptions_plan_idx" ON "subscriptions" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "webhook_events_received_idx" ON "webhook_events" USING btree ("received_at");--> statement-breakpoint
CREATE INDEX "webhook_events_order_idx" ON "webhook_events" USING btree ("order_id","type");--> statement-breakpoint
CREATE INDEX "devices_user_seen_idx" ON "devices" USING btree ("user_id","last_seen_at");--> statement-breakpoint
CREATE INDEX "run_claims_device_month_idx" ON "run_claims" USING btree ("device_id","month","pool");--> statement-breakpoint
CREATE INDEX "run_claims_user_month_idx" ON "run_claims" USING btree ("user_id","month","pool");--> statement-breakpoint
CREATE INDEX "plan_grants_user_ends_idx" ON "plan_grants" USING btree ("user_id","ends_at");--> statement-breakpoint
CREATE INDEX "plan_grants_created_idx" ON "plan_grants" USING btree ("created_at","id");--> statement-breakpoint
CREATE INDEX "plan_grants_plan_idx" ON "plan_grants" USING btree ("plan_id");--> statement-breakpoint
CREATE UNIQUE INDEX "plan_requests_one_pending_idx" ON "plan_requests" USING btree ("user_id") WHERE "plan_requests"."status" = 'pending';--> statement-breakpoint
CREATE INDEX "plan_requests_status_created_idx" ON "plan_requests" USING btree ("status","created_at","id");--> statement-breakpoint
CREATE INDEX "plan_requests_user_created_idx" ON "plan_requests" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "plan_requests_plan_idx" ON "plan_requests" USING btree ("plan_id");--> statement-breakpoint
CREATE UNIQUE INDEX "plans_rank_unique" ON "plans" USING btree ("rank");--> statement-breakpoint
CREATE INDEX "referrals_referrer_idx" ON "referrals" USING btree ("referrer_id","status","confirmed_at");--> statement-breakpoint
CREATE INDEX "referrals_reward_grant_idx" ON "referrals" USING btree ("reward_grant_id");--> statement-breakpoint
CREATE INDEX "app_releases_latest_idx" ON "app_releases" USING btree ("platform","channel","published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "team_invites_open_unique" ON "team_invites" USING btree ("team_id","email") WHERE "team_invites"."accepted_at" is null;--> statement-breakpoint
CREATE INDEX "team_invites_email_idx" ON "team_invites" USING btree ("email");--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profiles_created_idx" ON "profiles" USING btree ("created_at","user_id");--> statement-breakpoint
CREATE INDEX "runs_device_id_idx" ON "runs" USING btree ("device_id");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_referral_code_unique" UNIQUE("referral_code");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_referral_code_format" CHECK ("profiles"."referral_code" ~ '^[A-Z0-9]{10}$');--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_limits_override_object" CHECK ("profiles"."limits_override" is null or jsonb_typeof("profiles"."limits_override") = 'object');--> statement-breakpoint
CREATE VIEW "public"."latest_app_releases" WITH (security_invoker = false) AS (select distinct on (r.platform, r.channel) r.id, r.platform, r.channel, r.version, r.severity, r.reason, r.min_native_version, r.published_at from public.app_releases r order by r.platform, r.channel, r.published_at desc, r.id desc);--> statement-breakpoint
CREATE POLICY "devices_select_own" ON "devices" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "devices"."user_id");--> statement-breakpoint
CREATE POLICY "devices_delete_own" ON "devices" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "devices"."user_id");--> statement-breakpoint
CREATE POLICY "app_config_select_public" ON "app_config" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ("app_config"."is_public");--> statement-breakpoint
CREATE POLICY "plan_requests_insert_own" ON "plan_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "plan_requests"."user_id" and (select private.is_anon()) is false);--> statement-breakpoint
CREATE POLICY "plan_requests_select_own" ON "plan_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "plan_requests"."user_id" and (select private.is_anon()) is false);--> statement-breakpoint
CREATE POLICY "plans_select_active" ON "plans" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ("plans"."is_active");--> statement-breakpoint
ALTER POLICY "contact_requests_insert_own" ON "contact_requests" TO authenticated WITH CHECK ((select auth.uid()) = "contact_requests"."user_id" and (select private.is_anon()) is false);--> statement-breakpoint
ALTER POLICY "runs_insert_own" ON "runs" TO authenticated WITH CHECK ((select auth.uid()) = "runs"."user_id" and (select private.is_anon()) is false and ("runs"."device_id" is null or exists (select 1 from public.devices d where d.id = "runs"."device_id" and d.user_id = (select auth.uid()))));--> statement-breakpoint
ALTER POLICY "user_settings_insert_own" ON "user_settings" TO authenticated WITH CHECK ((select auth.uid()) = "user_settings"."user_id" and (select private.is_anon()) is false);--> statement-breakpoint
ALTER POLICY "user_settings_update_own" ON "user_settings" TO authenticated USING ((select auth.uid()) = "user_settings"."user_id" and (select private.is_anon()) is false) WITH CHECK ((select auth.uid()) = "user_settings"."user_id" and (select private.is_anon()) is false);