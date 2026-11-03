/** Paths supplied by a person, encoded as semicolon-separated CLI values. */
export function usableRoots(input: readonly string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of input) {
    if (typeof raw !== 'string') continue;
    const path = raw.trim();
    if (!/^[A-Za-z]:\\/.test(path) || /[;\r\n\0]/.test(path)) continue;
    const key = path.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(path);
  }
  return out;
}
