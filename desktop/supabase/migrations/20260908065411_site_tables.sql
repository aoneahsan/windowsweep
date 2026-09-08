CREATE TABLE "admin_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor" uuid,
	"action" text NOT NULL,
	"subject_table" text NOT NULL,
	"subject_id" text NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_audit" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"handled_at" timestamp with time zone,
	"handled_by" uuid,
	CONSTRAINT "contact_requests_subject_len_check" CHECK (char_length("contact_requests"."subject") <= 120),
	CONSTRAINT "contact_requests_message_len_check" CHECK (char_length("contact_requests"."message") between 10 and 4000),
	CONSTRAINT "contact_requests_status_check" CHECK ("contact_requests"."status" in ('new', 'handled', 'archived'))
);
--> statement-breakpoint
ALTER TABLE "contact_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"display_name" text,
	"platform_role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_platform_role_check" CHECK ("profiles"."platform_role" in ('superadmin', 'admin', 'user'))
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_audit_at_idx" ON "admin_audit" USING btree ("at");--> statement-breakpoint
CREATE INDEX "admin_audit_subject_idx" ON "admin_audit" USING btree ("subject_table","subject_id");--> statement-breakpoint
CREATE INDEX "contact_requests_user_created_idx" ON "contact_requests" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "contact_requests_status_created_idx" ON "contact_requests" USING btree ("status","created_at");--> statement-breakpoint
CREATE POLICY "admin_audit_select_admin" ON "admin_audit" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select public.is_platform_admin()));--> statement-breakpoint
CREATE POLICY "contact_requests_insert_own" ON "contact_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "contact_requests"."user_id");--> statement-breakpoint
CREATE POLICY "contact_requests_select_own" ON "contact_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "contact_requests"."user_id");--> statement-breakpoint
CREATE POLICY "contact_requests_select_admin" ON "contact_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select public.is_platform_admin()));--> statement-breakpoint
CREATE POLICY "contact_requests_update_admin" ON "contact_requests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select public.is_platform_admin())) WITH CHECK ((select public.is_platform_admin()));--> statement-breakpoint
CREATE POLICY "profiles_select_own" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "profiles"."user_id");--> statement-breakpoint
CREATE POLICY "profiles_select_admin" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select public.is_platform_admin()));--> statement-breakpoint
CREATE POLICY "profiles_update_own" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles"."user_id") WITH CHECK ((select auth.uid()) = "profiles"."user_id");