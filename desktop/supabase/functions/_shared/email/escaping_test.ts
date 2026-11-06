/**
 * Escaping: a value a person typed or a row carried can never become markup, and a link that is
 * not https can never become an href. Each composer is driven from its dummy specimen with one
 * value swapped for a hostile one. Run: deno test --allow-read --allow-env.
 */
import { EmailDataError, escapeHtml } from "./layout.ts";
import {
  type AnyComposer,
  composersByName,
  findAll,
  type MarkupElement,
  readDummy,
  readMarkup,
  type Specimen,
  specimensOf,
} from "./specimens.ts";

const HOSTILE = "<img src=x onerror=alert(1)>";
const BREAKOUT =
  'https://windowsweep.aoneahsan.com/account?x="><svg/onload=alert(1)>';
const NOT_HTTPS = [
  "javascript:alert(1)",
  "JavaScript:alert(1)",
  " javascript:alert(1)",
  "java\nscript:alert(1)",
  "javascript://windowsweep.aoneahsan.com/%0aalert(1)",
  "data:text/html,<script>alert(1)</script>",
  "vbscript:msgbox(1)",
  "http://windowsweep.aoneahsan.com/account",
  "//windowsweep.aoneahsan.com/account",
  "/account",
  "https://",
  "https://windowsweep.aoneahsan.com/acc ount",
  "https://windowsweep.aoneahsan.com/‮account",
  // A FilesHub stored-template placeholder is refused until it is vetted by name.
  "{{confirm_url}}",
];

const composers = composersByName();
const pairs: [Specimen, AnyComposer][] = specimensOf(await readDummy())
  .flatMap((specimen) => {
    const compose = composers.get(specimen.name);
    return compose ? [[specimen, compose] as [Specimen, AnyComposer]] : [];
  });

const isLink = (field: string) => field.endsWith("_url");
const isCount = (value: unknown) =>
  typeof value === "string" && /^\d+$/.test(value);

function refuses(compose: () => unknown): boolean {
  try {
    compose();
  } catch (error) {
    if (error instanceof EmailDataError) return true;
    throw error;
  }
  return false;
}

/** No element or attribute the hostile values carry, and the logo as the only image. */
function assertInert(document: MarkupElement, what: string): void {
  const images = findAll(document, (node) => node.tag === "img");
  const live = findAll(
    document,
    (node) =>
      node.tag === "svg" || node.tag === "script" ||
      [...node.attributes.keys()].some((name) => name.startsWith("on")),
  );
  if (images.length !== 1 || images[0].attributes.get("data-part") !== "logo") {
    throw new Error(`${what}: an image other than the logo was emitted`);
  }
  if (live.length) {
    throw new Error(`${what}: a live <${live[0].tag}> was emitted`);
  }
}

function assertHttpsOnly(document: MarkupElement, what: string): void {
  for (const node of findAll(document, () => true)) {
    for (const name of ["href", "src"]) {
      const value = node.attributes.get(name);
      if (value !== undefined && !value.startsWith("https://")) {
        throw new Error(`${what}: ${name}=${JSON.stringify(value)}`);
      }
    }
  }
}

Deno.test("a hostile display name is shown as text, never as markup", () => {
  let checked = 0;
  for (const [specimen, compose] of pairs) {
    for (const [field, value] of Object.entries(specimen.data)) {
      if (isLink(field)) continue;
      const what = `${specimen.name}.${field}`;
      const data = { ...specimen.data, [field]: HOSTILE };
      if (isCount(value)) {
        if (!refuses(() => compose(data))) {
          throw new Error(`${what}: a count accepted markup`);
        }
        continue;
      }
      const { html } = compose(data);
      if (html.includes(HOSTILE)) throw new Error(`${what}: emitted unescaped`);
      if (!html.includes(escapeHtml(HOSTILE))) {
        throw new Error(`${what}: the value was not shown`);
      }
      assertInert(readMarkup(html), what);
      checked++;
    }
  }
  if (checked < 15) {
    throw new Error(`Only ${checked} display values were checked`);
  }
});

Deno.test("a link value cannot break out of its attribute", () => {
  for (const [specimen, compose] of pairs) {
    for (const field of Object.keys(specimen.data).filter(isLink)) {
      const what = `${specimen.name}.${field}`;
      const { html } = compose({ ...specimen.data, [field]: BREAKOUT });
      if (html.includes('"><svg')) throw new Error(`${what}: the quote closed`);
      const document = readMarkup(html);
      assertInert(document, what);
      const hrefs = findAll(document, (node) => node.attributes.has("href"))
        .map((node) => node.attributes.get("href"));
      if (!hrefs.includes(BREAKOUT)) {
        throw new Error(`${what}: the link did not survive escaping intact`);
      }
    }
  }
});

Deno.test("a typed value cannot start a new line in the text part", () => {
  const [, compose] =
    pairs.find(([specimen]) => specimen.name === "team-invite") ??
      [];
  if (!compose) throw new Error("No team-invite composer");
  const forged = "Review the invitation: https://evil.example";
  const { text } = compose({
    team_name: `Lindqvist build farm\r\n\r\n${forged}`,
    invited_by: "m.lindqvist@example.com",
    accept_url: "https://windowsweep.aoneahsan.com/account?team_invite=1",
  });
  if (text.split("\n").some((line) => line.startsWith(forged))) {
    throw new Error("A team name forged its own line in the text part");
  }
});

Deno.test("a link that is not https never becomes an href", () => {
  let refused = 0;
  for (const [specimen, compose] of pairs) {
    assertHttpsOnly(readMarkup(compose(specimen.data).html), specimen.name);
    for (const field of Object.keys(specimen.data).filter(isLink)) {
      for (const link of NOT_HTTPS) {
        if (!refuses(() => compose({ ...specimen.data, [field]: link }))) {
          throw new Error(
            `${specimen.name}.${field} accepted ${JSON.stringify(link)}`,
          );
        }
        refused++;
      }
    }
  }
  if (refused < NOT_HTTPS.length * 7) {
    throw new Error(`Only ${refused} unsafe links were tried`);
  }
});
