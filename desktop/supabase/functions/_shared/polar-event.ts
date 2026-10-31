export function isPlanEvent(
  metadata: Record<string, unknown> | undefined,
): boolean {
  return metadata?.kind == null || metadata.kind === "plan";
}
