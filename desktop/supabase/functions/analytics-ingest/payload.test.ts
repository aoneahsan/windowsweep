import { parseAnalyticsPayload } from "./payload.ts";

const base = {
  event: "control_press",
  client_id: "db980731-d312-4b6e-929d-d8f7e8384fab",
  session_id: "12345",
  engagement_time_msec: 100,
  app_version: "1.4.0",
  params: { control: "home.reclaim", route: "/" },
};

Deno.test("analytics broker rejects paths and invented dimensions", () => {
  const badPayloads = [
    { ...base, params: { ...base.params, route: "C:\\Users\\Ada" } },
    { ...base, params: { ...base.params, control: "Delete Ada's files" } },
    { ...base, params: { ...base.params, machine_name: "Ada-PC" } },
    { ...base, user_email: "ada@example.com" },
  ];
  for (const payload of badPayloads) {
    let rejected = false;
    try {
      parseAnalyticsPayload(payload);
    } catch {
      rejected = true;
    }
    if (!rejected) throw new Error("Personal or unapproved dimension passed validation");
  }
});

Deno.test("analytics broker reduces free-form failure text to one category", () => {
  const safe = parseAnalyticsPayload({
    ...base,
    event: "update_install_failed",
    params: { reason: "C:\\Users\\Ada\\private-file.txt" },
  });
  if (safe.params.reason !== "other") {
    throw new Error("Failure detail escaped the closed category set");
  }
});
