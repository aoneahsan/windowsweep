import {
  deliverGrantEmail,
  type GrantEmailClaim,
  grantTemplateVariables,
} from "./grant-email.ts";

function assertEquals(actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, received ${
        JSON.stringify(actual)
      }`,
    );
  }
}

function assertThrows(fn: () => unknown, message: string): void {
  try {
    fn();
  } catch (error) {
    if ((error as Error).message === message) return;
    throw error;
  }
  throw new Error(`Expected: ${message}`);
}

const claim: GrantEmailClaim = {
  id: "00000000-0000-4000-8000-000000000001",
  claim_token: "00000000-0000-4000-8000-000000000002",
  email: "recipient@example.test",
  plan_name: "Team",
  seats: 3,
  ends_at: "2026-12-01T00:00:00Z",
};

Deno.test("grant mail uses the committed plan, seats and end date", () => {
  const variables = grantTemplateVariables(claim);
  assertEquals(variables.plan_name, "Team");
  assertEquals(variables.seats, "3");
  assertEquals(variables.ends_at, "1 December 2026");
});

Deno.test("grant mail refuses invalid committed end dates", () => {
  assertThrows(
    () => grantTemplateVariables({ ...claim, ends_at: "null" }),
    "Invalid committed grant email data",
  );
});

Deno.test("grant mail commits the provider outcome once", async () => {
  const marks: string[] = [];
  const result = await deliverGrantEmail(claim.id, {
    claim: () => claim,
    send: () => "accepted",
    mark: (_, outcome) => {
      marks.push(outcome);
      return true;
    },
  });
  assertEquals(result, "accepted");
  assertEquals(marks, ["accepted"]);
});

Deno.test("unknown sends remain blocked for reconciliation", async () => {
  const marks: string[] = [];
  const result = await deliverGrantEmail(claim.id, {
    claim: () => claim,
    send: () => {
      throw new Error("timeout");
    },
    mark: (_, outcome) => {
      marks.push(outcome);
      return true;
    },
  });
  assertEquals(result, "uncertain");
  assertEquals(marks, ["uncertain"]);
});

Deno.test("definitive refusal releases the claim for a deliberate retry", async () => {
  const marks: string[] = [];
  const result = await deliverGrantEmail(claim.id, {
    claim: () => claim,
    send: () => "refused",
    mark: (_, outcome) => {
      marks.push(outcome);
      return true;
    },
  });
  assertEquals(result, "refused");
  assertEquals(marks, ["refused"]);
});

Deno.test("a failed mark leaves the claim unresolved", async () => {
  const result = await deliverGrantEmail(claim.id, {
    claim: () => claim,
    send: () => "accepted",
    mark: () => false,
  });
  assertEquals(result, "uncertain");
});

Deno.test("claim failure leaves the business action pending", async () => {
  const result = await deliverGrantEmail(claim.id, {
    claim: () => {
      throw new Error("unavailable");
    },
    send: () => {
      throw new Error("must not send");
    },
    mark: () => {
      throw new Error("must not mark");
    },
  });
  assertEquals(result, "pending");
});

Deno.test("no available claim makes no provider call", async () => {
  const result = await deliverGrantEmail(claim.id, {
    claim: () => null,
    send: () => {
      throw new Error("must not send");
    },
    mark: () => {
      throw new Error("must not mark");
    },
  });
  assertEquals(result, "not_pending");
});
