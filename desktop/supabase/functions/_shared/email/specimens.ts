/**
 * Test support for parity_test.ts and escaping_test.ts: reads the click dummy's emails.html and a
 * composed message into the same small tree, and pairs each specimen with its composer. The
 * reader knows the HTML these two sources use (void, raw-text and RCDATA elements, the entities
 * emails.html carries) and throws on anything it does not know rather than guessing.
 */
import * as composers from "./compose.ts";
import type { EmailMessage } from "./layout.ts";

export type MarkupText = { readonly kind: "text"; value: string };
export type MarkupElement = {
  readonly kind: "element";
  readonly tag: string;
  readonly attributes: ReadonlyMap<string, string>;
  readonly children: MarkupNode[];
};
export type MarkupNode = MarkupText | MarkupElement;

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);
const RAW_TEXT = new Set(["script", "style"]);
const RCDATA = new Set(["textarea", "title"]);
const NAMED = new Map([
  ["amp", "&"],
  ["apos", "'"],
  ["gt", ">"],
  ["lt", "<"],
  ["nbsp", " "],
  ["quot", '"'],
  ["zwnj", "‌"],
]);

/** Decodes character references; a named entity outside the known set throws. */
export function decode(value: string): string {
  return value.replace(
    /&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,
    (_, reference: string) => {
      if (reference.startsWith("#")) {
        const hex = reference[1] === "x" || reference[1] === "X";
        return String.fromCodePoint(
          hex ? parseInt(reference.slice(2), 16) : Number(reference.slice(1)),
        );
      }
      const named = NAMED.get(reference);
      if (named === undefined) throw new Error(`Unknown entity &${reference};`);
      return named;
    },
  );
}

const END_TAG = /<\/([a-zA-Z][\w-]*)\s*>/y;
const START_TAG = /<([a-zA-Z][\w-]*)/y;
const TAG_END = /\s*(\/?)>/y;
const ATTRIBUTE =
  /\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y;

function element(tag: string, attributes = new Map<string, string>()) {
  const node: MarkupElement = {
    kind: "element",
    tag,
    attributes,
    children: [],
  };
  return node;
}

function addText(parent: MarkupElement, value: string): void {
  const last = parent.children[parent.children.length - 1];
  if (last?.kind === "text") last.value += value;
  else parent.children.push({ kind: "text", value });
}

/** Parses markup into a root element holding its top-level nodes. */
export function readMarkup(source: string): MarkupElement {
  const root = element("#root");
  const open: MarkupElement[] = [root];
  let at = 0;
  while (at < source.length) {
    const parent = open[open.length - 1];
    if (source.startsWith("<!--", at)) {
      const close = source.indexOf("-->", at + 4);
      at = close === -1 ? source.length : close + 3;
      continue;
    }
    if (source.startsWith("<!", at)) {
      const close = source.indexOf(">", at);
      at = close === -1 ? source.length : close + 1;
      continue;
    }
    END_TAG.lastIndex = at;
    const end = END_TAG.exec(source);
    if (end) {
      const tag = end[1].toLowerCase();
      const index = open.findLastIndex((node) => node.tag === tag);
      if (index > 0) open.length = index;
      at = END_TAG.lastIndex;
      continue;
    }
    START_TAG.lastIndex = at;
    const start = START_TAG.exec(source);
    if (!start) {
      const next = source.indexOf("<", at + 1);
      const stop = next === -1 ? source.length : next;
      addText(parent, decode(source.slice(at, stop)));
      at = stop;
      continue;
    }
    const tag = start[1].toLowerCase();
    const attributes = new Map<string, string>();
    at = START_TAG.lastIndex;
    let selfClosing = false;
    for (;;) {
      TAG_END.lastIndex = at;
      const close = TAG_END.exec(source);
      if (close) {
        selfClosing = close[1] === "/";
        at = TAG_END.lastIndex;
        break;
      }
      ATTRIBUTE.lastIndex = at;
      const attribute = ATTRIBUTE.exec(source);
      if (!attribute) throw new Error(`Unreadable <${tag}> at offset ${at}`);
      attributes.set(
        attribute[1].toLowerCase(),
        decode(attribute[2] ?? attribute[3] ?? attribute[4] ?? ""),
      );
      at = ATTRIBUTE.lastIndex;
    }
    const node = element(tag, attributes);
    parent.children.push(node);
    if (RAW_TEXT.has(tag) || RCDATA.has(tag)) {
      const closing = new RegExp(`</${tag}\\s*>`, "gi");
      closing.lastIndex = at;
      const match = closing.exec(source);
      if (!match) throw new Error(`<${tag}> is never closed`);
      const content = source.slice(at, match.index);
      if (content) addText(node, RCDATA.has(tag) ? decode(content) : content);
      at = closing.lastIndex;
      continue;
    }
    if (!VOID.has(tag) && !selfClosing) open.push(node);
  }
  return root;
}

/** Every element under `node`, in document order, that passes the test. */
export function findAll(
  node: MarkupElement,
  test: (element: MarkupElement) => boolean,
): MarkupElement[] {
  const found: MarkupElement[] = [];
  for (const child of node.children) {
    if (child.kind !== "element") continue;
    if (test(child)) found.push(child);
    found.push(...findAll(child, test));
  }
  return found;
}

/** The first element under `node` that passes the test; throws when there is none. */
export function findOne(
  node: MarkupElement,
  test: (element: MarkupElement) => boolean,
  what: string,
): MarkupElement {
  const [first] = findAll(node, test);
  if (!first) throw new Error(`No ${what} found`);
  return first;
}

/** The text a DOM's textContent would give. */
export function textOf(node: MarkupNode): string {
  return node.kind === "text" ? node.value : node.children.map(textOf).join("");
}

/** One <template id="email-*"> from emails.html, with its specimen data. */
export type Specimen = {
  readonly name: string;
  readonly data: Readonly<Record<string, unknown>>;
  readonly subject: string;
  readonly preheader: string;
  readonly template: MarkupElement;
};

const DUMMY = new URL(
  "../../../../design/windowsweep-click-dummy/emails.html",
  import.meta.url,
);

/** The dummy page, parsed. */
export async function readDummy(): Promise<MarkupElement> {
  return readMarkup(await Deno.readTextFile(DUMMY));
}

/** Every email specimen the dummy draws, by name (email-welcome → welcome). */
export function specimensOf(page: MarkupElement): Specimen[] {
  return findAll(
    page,
    (node) =>
      node.tag === "template" &&
      (node.attributes.get("id") ?? "").startsWith("email-"),
  ).map((template) => {
    const read = (name: string) => {
      const value = template.attributes.get(name);
      if (value === undefined) throw new Error(`A specimen lacks ${name}`);
      return value;
    };
    return {
      name: read("id").slice("email-".length),
      data: JSON.parse(read("data-specimen")),
      subject: read("data-subject"),
      preheader: read("data-preheader"),
      template,
    };
  });
}

/** A composer as the tests call it, with a specimen's data. */
export type AnyComposer = (
  data: Readonly<Record<string, unknown>>,
) => EmailMessage;

/** Every composer compose.ts exports, keyed like the dummy (composePlanGranted → plan-granted). */
export function composersByName(): Map<string, AnyComposer> {
  const byName = new Map<string, AnyComposer>();
  for (const [name, value] of Object.entries(composers)) {
    if (!name.startsWith("compose") || typeof value !== "function") continue;
    const key = name.slice("compose".length)
      .replace(
        /[A-Z]/g,
        (letter, index) => `${index ? "-" : ""}${letter.toLowerCase()}`,
      );
    // Each composer checks its own data at run time (a missing or wrong value throws), so a
    // specimen with the wrong shape fails its test instead of slipping past this widening.
    byName.set(key, value as unknown as AnyComposer);
  }
  return byName;
}
