-- REVIEWED ROLLBACK; never run directly. Run before the schema rollback.
-- New tables disappear with the schema rollback, so only the existing table's
-- added column privilege needs an explicit reversal.
revoke insert (device_id) on table public.runs from authenticated;
