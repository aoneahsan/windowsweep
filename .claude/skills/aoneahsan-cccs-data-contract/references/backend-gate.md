# The server half — the ordered gate

Five steps, in order, before anything touches storage. The order is the point: each step assumes the previous
one passed, so running them out of order means one of them is decorating a decision already made.

```
1  request shape        -> 422
2  authentication       -> 401
3  authorization        -> 403
4  business validity    -> 409 / 422
5  the database
```

## Why the order is not stylistic

- **Shape first** because it is the cheapest check and needs no I/O. Validating shape after a lookup means a
  malformed anonymous request already cost a query.
- **Authentication before authorization** because "which permissions" is unanswerable until "who" is.
- **Authorization before business validity** because step 4 usually needs a read, and reading a row to validate
  it is a read the caller may not be entitled to. Checking ownership *after* fetching leaks existence — a 404
  and a 403 tell an attacker different things.
- **Everything before the write.** A permission check after the insert is an audit trail, not a boundary.

## Laravel

```php
// 1 — shape: FormRequest, resolved before the controller body runs
class UpdateMetricRequest extends FormRequest {
    public function rules(): array {
        return [
            'metric_key' => ['required', 'string', Rule::in(MetricKey::values())],
            'value'      => ['required', 'numeric', 'min:0'],
            'note'       => ['sometimes', 'string', 'max:2000'],   // absent is fine; present-and-null is not
        ];
    }
}

// 2 — authentication: route middleware
Route::middleware('auth:sanctum')->group(/* … */);

public function update(UpdateMetricRequest $request, Metric $metric): JsonResponse {
    $this->authorize('update', $metric);          // 3 — Policy: 403

    if ($metric->isLocked()) {                    // 4 — business validity: 409
        return response()->json(['message' => 'This entry is locked and cannot be edited.'], 409);
    }

    $metric->update($request->validated());       // 5
    return response()->json($metric);
}
```

🔴 **`sometimes` skips only ABSENT keys.** A payload carrying `"note": null` is validated as present, fails
`string`, and returns a confusing 422 about a field the user never touched — which is the client-side omission
rule showing up as a server-side symptom.

## An edge function or a Worker handler

Nothing frames the request for you, so the order is yours to write and easy to get wrong:

```ts
export default async function handler(req: Request) {
  const parsed = Schema.safeParse(await req.json());              // 1
  if (!parsed.success) return json(422, { errors: parsed.error.flatten() });

  const user = await authenticate(req);                            // 2
  if (!user) return json(401, { message: 'Sign in to continue.' });

  if (!can(user, 'metric.update', parsed.data.id)) {               // 3
    return json(403, { message: 'You do not have access to this entry.' });
  }

  const row = await find(parsed.data.id);                          // 4
  if (!row) return json(409, { message: 'That entry no longer exists.' });

  return json(200, await update(row, parsed.data));                // 5
}
```

🔴 **A function running with a service key IS the security boundary.** Passing the caller's token through keeps
row-level security applying; using a service key bypasses it entirely, so step 3 becomes yours alone and
skipping it is a total authorization bypass, not a lax check.

## Security rules are step 3 only

A rules engine or an RLS policy decides **which rows** a caller may touch. It does not validate shape, it
cannot produce a useful message, and it is not a substitute for steps 1 and 4.

🔴 **Two behaviours that make rule-based checks look like they passed:**

- **RLS filters rather than refuses.** A query with the owner filter removed returns **200 with fewer rows**,
  not 403. A missing filter is invisible to status codes and to any test asserting 2xx.
- **A forbidden UPDATE or DELETE is 200 with 0 rows affected**, while a forbidden INSERT is 403. **Assert
  affected-row counts, never status alone.**

Details and the provable-from-its-own-filters requirement: `~/.claude/rules/data-fetch-budget.md`,
`aoneahsan-cccs-postgres-multitenancy-rbac`, `aoneahsan-cccs-firestore`.

## 🔴 A database constraint is not a validator

A unique index, a check constraint and a foreign key protect **integrity**. They are not the user's error
message. When a violation surfaces as a 500:

- the user sees an opaque failure and cannot act;
- the log gets a stack trace instead of a fact;
- and the same request will fail identically forever.

Catch it at step 4 and answer with what the user needs to know: *"That email is already registered."*

Keep the constraint. It is the backstop for the race the check cannot close — two requests passing step 4 at the
same instant. Handle **that** narrow case by catching the violation and mapping it to the same message.

## Proving the order holds — two probes, not a code read

Reading the handler top to bottom proves the order you *wrote*, not the order that *runs* — middleware,
resolvers and decorators all reorder things.

1. **A shape-invalid request from an unauthenticated caller → 422**, never 401 and never a 500. If it returns
   401, authentication is running first; if it 500s, it reached the database.
2. **A well-formed request from an authenticated but unauthorized caller → 403 with nothing written.**
   Re-read the row afterwards to confirm.

Run both **as a non-admin account.** An admin passes step 3 by definition, so every step-3 defect is invisible
to it — the single most reliable way to certify a broken authorization model as working.

**Last updated:** 2026-07-30
