ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "tour_hinted" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_tour_hinted_bounded'
    AND conrelid = 'public.profiles'::regclass) THEN
    ALTER TABLE "profiles" ADD CONSTRAINT "profiles_tour_hinted_bounded"
      CHECK (jsonb_typeof("profiles"."tour_hinted") = 'object'
        AND octet_length("profiles"."tour_hinted"::text) <= 8192);
  END IF;
END $$;
