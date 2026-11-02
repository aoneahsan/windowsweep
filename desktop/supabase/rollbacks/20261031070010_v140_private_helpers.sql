-- REVIEWED ROLLBACK; never run directly. Copy into a new forward migration only
-- after owner approval. Apply after every later 1.4.0 rollback: policies use is_anon().
drop function if exists private.is_anon();
-- Keep the private schema; other products or future migrations may use it.
