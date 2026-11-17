# Multi-tenancy and RLS common mistakes

What each recurring tenant or policy mistake causes and what to do instead.

| Mistake | What happens | Instead |
|---|---|---|
| Listing without the filter the policy reads | Denied at runtime while looking correct in review | Filter on the column the policy reads |
| Verifying as an admin | The admin branch passes; the real bug is invisible | Verify as the least-privileged role |
| A `(200, 0)` probe | Proves nothing | Seed, then probe |
| A catch-all policy covering every table | Not deny-by-default; a new table is silently readable | Explicit policy per table |
| `SECURITY DEFINER` to "make it work" | Bypasses RLS — the hole is now permanent | Only for a narrowly-scoped helper; never to escape a policy |

Three more in `references/rls-patterns.md`: a tenant in a JWT claim (**revocation with a delay fuse** — the
membership row is gone while the token keeps working), role stored in two places, and a permission array on a
user-writable row (**privilege escalation**, fixed by a column grant, not a policy).
