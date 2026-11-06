/**
 * Parity with the approved click dummy: every <template id="email-*"> in emails.html, rendered by
 * its composer from the template's own data-specimen, ships the template's words, look and
 * plain-text part. A composer without a template, or a template without a composer, fails.
 * Run: deno test --allow-read --allow-env (from supabase/functions).
 */
import {
  composersByName,
  findAll,
  findOne,
  type MarkupElement,
  type MarkupNode,
  readDummy,
  readMarkup,
  specimensOf,
  textOf,
} from "./specimens.ts";

/** Drawn in the dummy but sent later as a FilesHub marketing template, not by a composer. */
const NOT_COMPOSED = new Set(["release-140"]);
const MAX_HTML_BYTES = 30 * 1024;

const page = await readDummy();
const specimens = specimensOf(page);
const composers = composersByName();

function assertSame(actual: unknown, expected: unknown, what: string): void {
  if (actual !== expected) {
    throw new Error(
      `${what} differs\n  expected: ${JSON.stringify(expected)}\n  actual:   ${
        JSON.stringify(actual)
      }`,
    );
  }
}

function assertSameLines(
  actual: readonly string[],
  expected: readonly string[],
  what: string,
): void {
  const length = Math.max(actual.length, expected.length);
  for (let index = 0; index < length; index++) {
    if (actual[index] !== expected[index]) {
      throw new Error(
        `${what} differs at line ${index + 1}\n  expected: ${
          expected[index] ?? "(nothing)"
        }\n  actual:   ${actual[index] ?? "(nothing)"}`,
      );
    }
  }
}

const isPreheader = (node: MarkupNode) =>
  node.kind === "element" && node.attributes.get("data-part") === "preheader";

/** What a reader sees: every text node outside the hidden preheader, whitespace-normalised. */
function visibleText(nodes: readonly MarkupNode[]): string {
  const walk = (node: MarkupNode): string => {
    if (node.kind === "text") return node.value;
    if (isPreheader(node)) return "";
    if (node.tag === "br") return " ";
    return node.children.map(walk).join("");
  };
  return nodes.map(walk).join("").replace(/\s+/g, " ").trim();
}

/** The markup as a list of lines: tags, attributes in name order, decoded text. */
function canonical(nodes: readonly MarkupNode[], depth = 0): string[] {
  const indent = "  ".repeat(depth);
  const lines: string[] = [];
  for (const node of nodes) {
    if (node.kind === "text") {
      const text = node.value.replace(/\s+/g, " ");
      if (text.trim()) lines.push(`${indent}${JSON.stringify(text)}`);
      continue;
    }
    const attributes = [...node.attributes]
      .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
      .map(([name, value]) => ` ${name}=${JSON.stringify(value)}`)
      .join("");
    lines.push(`${indent}<${node.tag}${attributes}>`);
    lines.push(...canonical(node.children, depth + 1));
  }
  return lines;
}

/* page-emails.js's plain(), ported line for line: the dummy's own plain-text part. */
function inline(node: MarkupElement): string {
  let out = "";
  for (const child of node.children) {
    if (child.kind === "text") {
      out += child.value;
      continue;
    }
    if (child.tag === "br") {
      out += "\n";
      continue;
    }
    if (child.tag === "a") {
      const label = textOf(child).trim();
      const href = child.attributes.get("href") ?? "";
      const bare = href.replace(/^https:\/\//, "").replace(/\/$/, "");
      out += label === href || label === bare ? href : `${label} (${href})`;
      continue;
    }
    out += inline(child);
  }
  return out.replace(/[ \t]+/g, " ");
}

function dummyTextPart(root: MarkupElement): string {
  const lines: string[] = [];
  for (
    const part of findAll(root, (node) => node.attributes.has("data-part"))
  ) {
    const kind = part.attributes.get("data-part");
    if (
      kind === "preheader" || kind === "fallback" || kind === "logo" ||
      kind === "image"
    ) continue;
    if (kind === "facts") {
      for (const row of findAll(part, (node) => node.tag === "tr")) {
        const cells = findAll(
          row,
          (node) => node.tag === "th" || node.tag === "td",
        );
        if (cells.length > 1) {
          lines.push(`${textOf(cells[0]).trim()}: ${textOf(cells[1]).trim()}`);
        }
      }
      lines.push("");
      continue;
    }
    if (kind === "button") {
      const anchor = findOne(part, (node) => node.tag === "a", "button link");
      lines.push(
        `${textOf(anchor).trim()}: ${anchor.attributes.get("href")}`,
        "",
      );
      continue;
    }
    if (kind === "bullet") {
      lines.push(`- ${inline(part).trim()}`);
      continue;
    }
    if (kind === "footer") lines.push("--");
    lines.push(inline(part).trim(), "");
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

const layoutStyle = textOf(
  findOne(
    page,
    (node) =>
      node.tag === "style" && node.attributes.get("id") === "wsm-layout-style",
    "the layout's style block",
  ),
).replace(/\s+/g, " ").trim();

Deno.test("every transactional specimen has a composer, and every composer a specimen", () => {
  const drawn = specimens.map((specimen) => specimen.name)
    .filter((name) => !NOT_COMPOSED.has(name)).sort();
  const composed = [...composers.keys()].sort();
  assertSame(composed.join(", "), drawn.join(", "), "The composer list");
  if (!specimens.some((specimen) => NOT_COMPOSED.has(specimen.name))) {
    throw new Error("release-140 is no longer drawn; update NOT_COMPOSED");
  }
});

for (const specimen of specimens) {
  if (NOT_COMPOSED.has(specimen.name)) continue;
  Deno.test(`${specimen.name}: the dummy's words, look and text part`, () => {
    const compose = composers.get(specimen.name);
    if (!compose) throw new Error(`No composer for email-${specimen.name}`);
    const message = compose(specimen.data);
    const shipped = readMarkup(message.html);
    const body = findOne(shipped, (node) => node.tag === "body", "<body>");
    const template = specimen.template.children;

    assertSame(
      visibleText(body.children),
      visibleText(template),
      "Visible text",
    );
    assertSame(message.subject, specimen.subject, "The subject");
    assertSame(message.text, dummyTextPart(specimen.template), "The text part");

    const preheader = findOne(body, isPreheader, "preheader");
    assertSame(
      textOf(preheader).replace(/[͏‌\s]+$/u, ""),
      specimen.preheader,
      "The preheader",
    );
    assertSameLines(
      canonical(body.children),
      canonical(template),
      "The markup",
    );

    const html = findOne(shipped, (node) => node.tag === "html", "<html>");
    assertSame(html.attributes.get("lang"), "en-GB", "<html lang>");
    const title = findOne(shipped, (node) => node.tag === "title", "<title>");
    assertSame(textOf(title), specimen.subject, "The <title>");
    for (const name of ["color-scheme", "supported-color-schemes"]) {
      const meta = findOne(
        shipped,
        (node) => node.tag === "meta" && node.attributes.get("name") === name,
        `meta ${name}`,
      );
      assertSame(meta.attributes.get("content"), "light dark", `meta ${name}`);
    }
    const style = findAll(shipped, (node) => node.tag === "style");
    assertSame(style.length, 1, "The number of style blocks");
    assertSame(
      textOf(style[0]).replace(/\s+/g, " ").trim(),
      layoutStyle,
      "The style block",
    );
    const banned = findAll(
      shipped,
      (node) => ["script", "link", "form", "iframe"].includes(node.tag),
    );
    assertSame(
      banned.map((node) => node.tag).join(", "),
      "",
      "Banned elements",
    );
    const bytes = new TextEncoder().encode(message.html).length;
    if (bytes >= MAX_HTML_BYTES) {
      throw new Error(`The HTML is ${bytes} bytes; the ceiling is 30 KB`);
    }
  });
}
