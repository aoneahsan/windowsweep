type Handler = (request: Request) => Promise<Response>;

Deno.test("protected functions return the shared 401 envelope without a bearer token", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(Deno, "serve");
  if (!descriptor) throw new Error("Deno.serve is unavailable");
  let handler: Handler | undefined;
  Object.defineProperty(Deno, "serve", {
    configurable: true,
    value: (next: Handler) => {
      handler = next;
    },
  });
  try {
    const cases = [
      {
        name: "allowance",
        method: "GET",
        path: "?device_id=550e8400-e29b-41d4-a716-446655440000",
      },
      { name: "account-welcome", method: "POST", body: {} },
      {
        name: "polar-checkout",
        method: "POST",
        body: { plan_id: "pro", interval: "month" },
      },
      { name: "admin", method: "POST", body: { action: "stats" } },
      { name: "team", method: "POST", body: { action: "invites" } },
      { name: "delete-account", method: "POST" },
    ];
    for (const fixture of cases) {
      handler = undefined;
      await import(`../${fixture.name}/index.ts`);
      const current = handler as Handler | undefined;
      if (!current) {
        throw new Error(`${fixture.name} did not register a handler`);
      }
      const request = new Request(
        `https://example.test/${fixture.name}${fixture.path ?? ""}`,
        {
          method: fixture.method,
          ...(fixture.body
            ? {
              body: JSON.stringify(fixture.body),
              headers: { "Content-Type": "application/json" },
            }
            : {}),
        },
      );
      const response = await current(request);
      const data = await response.json();
      if (
        response.status !== 401 || data?.ok !== false ||
        data?.error?.code !== "not_authenticated"
      ) {
        throw new Error(
          `${fixture.name} did not return the shared 401 envelope`,
        );
      }
    }
  } finally {
    Object.defineProperty(Deno, "serve", descriptor);
  }
});
