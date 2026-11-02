-- REVIEWED ROLLBACK; never run directly. No automatic data deletion is safe:
-- a plan/config row may have been edited by an admin or referenced by paid
-- periods and grants. Keep rows through a code rollback. Deleting them requires
-- a separate owner-approved migration after checking live references.
select 'Seed rows retained; no automatic rollback' as review_result;
