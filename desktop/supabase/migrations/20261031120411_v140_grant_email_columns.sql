ALTER TABLE "plan_grants" ADD COLUMN "email_claimed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "plan_grants" ADD COLUMN "email_claim_token" uuid;--> statement-breakpoint
ALTER TABLE "plan_grants" ADD COLUMN "email_uncertain_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "plan_grants" ADD COLUMN "email_sent_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "plan_grants_email_review_idx" ON "plan_grants" USING btree ("created_at","id") WHERE "plan_grants"."source" = 'admin' and "plan_grants"."email_sent_at" is null and "plan_grants"."revoked_at" is null;--> statement-breakpoint
ALTER TABLE "plan_grants" ADD CONSTRAINT "plan_grants_email_claim_pair" CHECK (("plan_grants"."email_claimed_at" is null) = ("plan_grants"."email_claim_token" is null));--> statement-breakpoint
ALTER TABLE "plan_grants" ADD CONSTRAINT "plan_grants_email_not_sent_uncertain" CHECK ("plan_grants"."email_sent_at" is null or "plan_grants"."email_uncertain_at" is null);