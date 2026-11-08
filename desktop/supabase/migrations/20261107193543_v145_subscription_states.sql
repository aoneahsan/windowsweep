CREATE TABLE "billing_subscription_states" (
	"polar_subscription_id" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"cancel_at_period_end" boolean NOT NULL,
	"canceled_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"modified_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_subscription_states_id_len" CHECK (char_length("billing_subscription_states"."polar_subscription_id") between 1 and 200),
	CONSTRAINT "billing_subscription_states_status_len" CHECK (char_length("billing_subscription_states"."status") between 1 and 40)
);
--> statement-breakpoint
ALTER TABLE "billing_subscription_states" ENABLE ROW LEVEL SECURITY;