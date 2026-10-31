import { createPolar } from "npm:@polar-sh/sdk@1.0.2/2026-10";
import { ApiError } from "./http.ts";

export function polarAvailable(): boolean {
  if (
    !Deno.env.get("POLAR_ACCESS_TOKEN") ||
    !Deno.env.get("POLAR_WEBHOOK_SECRET") ||
    !["sandbox", "production"].includes(Deno.env.get("POLAR_SERVER") ?? "")
  ) return false;
  try {
    const products = JSON.parse(Deno.env.get("POLAR_PRODUCTS") ?? "null");
    return products !== null && typeof products === "object" &&
      ["pro_month", "pro_year", "team_month", "team_year"]
        .every((name) =>
          typeof products[name] === "string" && products[name].length > 0
        );
  } catch {
    return false;
  }
}

export function polarClient() {
  const token = Deno.env.get("POLAR_ACCESS_TOKEN");
  const server = Deno.env.get("POLAR_SERVER");
  if (!token || !server || !["sandbox", "production"].includes(server)) {
    throw new ApiError(503, "billing_unavailable");
  }
  return createPolar({
    accessToken: token,
    environment: server as "sandbox" | "production",
    timeout: 15,
  });
}

export function polarProduct(plan: string, interval: string): string {
  try {
    const products = JSON.parse(Deno.env.get("POLAR_PRODUCTS") ?? "{}");
    const product = products[`${plan}_${interval}`];
    if (typeof product === "string" && product) return product;
  } catch { /* malformed configuration */ }
  throw new ApiError(503, "billing_unavailable");
}
