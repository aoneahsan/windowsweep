import { ApiError } from "../_shared/http.ts";
import { CONTROL_IDS, EVENTS } from "../../../src/lib/events.ts";
import { CONTROLS, EVENT_PARAMS, parseAnalyticsPayload } from "./payload.ts";

const valid = {
  event: "control_press",
  client_id: "550e8400-e29b-41d4-a716-446655440000",
  session_id: "1793441947",
  engagement_time_msec: 250,
  app_version: "1.4.0",
  params: { control: "home.scan", route: "/" },
};

Deno.test("broker accepts only the desktop registry and discards error text", () => {
  const parsed = parseAnalyticsPayload(valid);
  if (
    parsed.event !== "control_press" || parsed.params.control !== "home.scan"
  ) {
    throw new Error("registered event was rejected");
  }
  const failure = parseAnalyticsPayload({
    ...valid,
    event: "update_install_failed",
    params: { reason: "C:\\Users\\Someone\\Desktop\\private.txt" },
  });
  if (failure.params.reason !== "other") {
    throw new Error("free text escaped into the provider payload");
  }
});

Deno.test("broker allowlists match the desktop event and control registries", () => {
  const desktopEvents = Object.entries(EVENTS).map(([name, params]) => [
    name.replaceAll(".", "_"),
    Object.keys(params).sort().join(","),
  ]).sort((a, b) => a[0].localeCompare(b[0]));
  const brokerEvents = Object.entries(EVENT_PARAMS).map(([name, params]) => [
    name,
    [...params].sort().join(","),
  ]).sort((a, b) => a[0].localeCompare(b[0]));
  if (JSON.stringify(desktopEvents) !== JSON.stringify(brokerEvents)) {
    throw new Error("desktop events and broker event parameters differ");
  }
  const desktopControls = [...CONTROL_IDS].sort();
  const brokerControls = [...CONTROLS].sort();
  if (JSON.stringify(desktopControls) !== JSON.stringify(brokerControls)) {
    throw new Error("desktop controls and broker controls differ");
  }
});

Deno.test("broker rejects unregistered events, paths, dimensions and ids", () => {
  const cases = [
    { ...valid, event: "arbitrary_event" },
    { ...valid, params: { control: "home.scan", route: "C:\\Users\\Person" } },
    { ...valid, params: { control: "new.control", route: "/" } },
    { ...valid, params: { ...valid.params, email: "a@example.test" } },
    { ...valid, client_id: "not-a-uuid" },
    { ...valid, session_id: "not-a-number" },
  ];
  for (const body of cases) {
    try {
      parseAnalyticsPayload(body);
      throw new Error("unsafe payload was accepted");
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 422) throw error;
    }
  }
});

Deno.test("broker returns the shared 401 envelope before database access", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(Deno, "serve");
  if (!descriptor) throw new Error("Deno.serve is unavailable");
  let handler: ((request: Request) => Promise<Response>) | undefined;
  Object.defineProperty(Deno, "serve", {
    configurable: true,
    value: (next: (request: Request) => Promise<Response>) => {
      handler = next;
    },
  });
  try {
    await import("./index.ts");
    if (!handler) throw new Error("broker did not register a handler");
    const response = await handler(
      new Request("https://example.test/analytics-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valid),
      }),
    );
    const result = await response.json();
    if (
      response.status !== 401 || result?.error?.code !== "not_authenticated"
    ) {
      throw new Error("missing bearer token did not return 401 envelope");
    }
    const invalidResponse = await handler(
      new Request("https://example.test/analytics-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...valid, event: "unregistered" }),
      }),
    );
    const invalidResult = await invalidResponse.json();
    if (
      invalidResponse.status !== 422 ||
      invalidResult?.error?.code !== "invalid_request"
    ) {
      throw new Error("invalid shape did not fail before authentication");
    }
  } finally {
    Object.defineProperty(Deno, "serve", descriptor);
  }
});
