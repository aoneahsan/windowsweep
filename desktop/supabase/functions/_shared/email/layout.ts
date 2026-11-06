/**
 * The one email layout: the HTML shell, the brand colours, the escape and link helpers, the
 * bulletproof button, the facts card and the footer. It reproduces the approved specimens in
 * desktop/design/windowsweep-click-dummy/emails.html, markup and inline styles alike, and writes
 * each message's plain-text part from the same content, in the order page-emails.js reads it.
 * Nothing outside this module writes email HTML.
 */
import { website } from "../email.ts";
import { catalogue, fill, LANG, type Line, type Link } from "./catalogue.ts";

/** Thrown when a value cannot go into a message; the transport then sends nothing. */
export class EmailDataError extends Error {}

/* Brand colours: tokens.css lime tokens converted from OKLCH to hex once, because mail clients
 * do not read OKLCH. Light values are [data-palette='lime'][data-appearance='light'], dark ones
 * [data-palette='lime'][data-appearance='dark']. No colour is typed anywhere else. */
/** Canvas: --c-app, oklch(0.973 0.007 128). */
const CANVAS = "#f5f7f2";
/** Canvas, dark: --c-app, oklch(0.168 0.010 128). */
const CANVAS_DARK = "#0e100b";
/** Card: --c-panel, oklch(1 0 0). */
const CARD = "#ffffff";
/** Card, dark: --c-panel, oklch(0.222 0.012 128). */
const CARD_DARK = "#191c16";
/** Text: --c-ink, oklch(0.232 0.017 128). */
const INK = "#1b1f16";
/** Text, dark: --c-ink, oklch(0.962 0.008 128). */
const INK_DARK = "#f1f3ee";
/** Quiet text: --c-ink-2, oklch(0.462 0.015 128). */
const MUTED = "#565a51";
/** Quiet text, dark: --c-ink-2, oklch(0.775 0.012 128). */
const MUTED_DARK = "#b3b7af";
/** Eyebrow and links: --c-accent-ink, oklch(0.462 0.145 128). */
const ACCENT_INK = "#406600";
/** Eyebrow and links, dark: --c-accent-ink, oklch(0.845 0.175 128). */
const ACCENT_INK_DARK = "#abe158";
/** Button: --c-accent, oklch(0.512 0.145 128). */
const ACCENT = "#4e7500";
/** Button text: --c-on-accent, oklch(0.995 0.005 128); 5.35:1 on ACCENT. */
const ON_ACCENT = "#fcfefb";
/** Button, dark: --c-accent, oklch(0.820 0.185 128). */
const ACCENT_DARK = "#a1da44";
/** Button text, dark: --c-on-accent, oklch(0.185 0.030 128); 11.2:1 on ACCENT_DARK. */
const ON_ACCENT_DARK = "#0f1507";
/** Facts card: --c-well, oklch(0.941 0.010 128). */
const WELL = "#e9ede6";
/** Facts card, dark: the dummy draws dark --c-app here; dark --c-well itself converts to #070805. */
const WELL_DARK = CANVAS_DARK;
/** Rules: --c-line, oklch(0.886 0.011 128). */
const LINE = "#d7dbd3";
/** Rules, dark: --c-line, oklch(0.318 0.014 128). */
const LINE_DARK = "#30342c";
/** Logo tile: --c-accent-soft, oklch(0.930 0.055 128); the tile stays light in dark mode. */
const TILE = "#ddf0c9";
/** Panels, dark: --c-accent-soft, oklch(0.300 0.055 128). */
const PANEL_DARK = "#263313";

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const LOGO_PATH = "/email/windowsweep-logo@2x.png";
/** Pads the preheader so the body's first words stay out of the inbox preview. */
const PREHEADER_PAD = "&#847;&zwnj;&nbsp;".repeat(6);

/* The layout's one style block, the dummy's <style id="wsm-layout-style">: the phone rules and
 * the dark overrides. Every rule repeats an inline default, so a client that strips <style> keeps
 * the light design. */
const LAYOUT_STYLE = `@media (max-width: 480px) {
  .wsm-outer { padding: 0 !important; }
  .wsm-card { border-radius: 0 !important; border-left-width: 0 !important; border-right-width: 0 !important; }
  .wsm-px { padding-left: 20px !important; padding-right: 20px !important; }
  .wsm-h1 { font-size: 24px !important; line-height: 30px !important; }
  .wsm-btn { width: 100% !important; }
  .wsm-btn-a { display: block !important; text-align: center !important; }
  .wsm-facts th, .wsm-facts td { display: block !important; width: auto !important; }
  .wsm-facts th { padding-bottom: 0 !important; border-bottom-width: 0 !important; }
  .wsm-col { display: block !important; width: auto !important; padding-left: 0 !important; padding-right: 0 !important; }
}
@media (prefers-color-scheme: dark) {
  .wsm-canvas { background: ${CANVAS_DARK} !important; }
  .wsm-card { background: ${CARD_DARK} !important; border-color: ${LINE_DARK} !important; }
  .wsm-ink { color: ${INK_DARK} !important; }
  .wsm-muted { color: ${MUTED_DARK} !important; }
  .wsm-brand, .wsm-link { color: ${ACCENT_INK_DARK} !important; }
  .wsm-facts { background: ${WELL_DARK} !important; }
  .wsm-panel { background: ${PANEL_DARK} !important; }
  .wsm-rule { border-color: ${LINE_DARK} !important; }
  .wsm-btn-cell { background: ${ACCENT_DARK} !important; }
  .wsm-btn-a { color: ${ON_ACCENT_DARK} !important; }
  .wsm-tick { background: ${ACCENT_DARK} !important; color: ${ON_ACCENT_DARK} !important; }
}
[data-ogsc] .wsm-ink { color: ${INK_DARK} !important; }
[data-ogsc] .wsm-muted { color: ${MUTED_DARK} !important; }
[data-ogsc] .wsm-brand, [data-ogsc] .wsm-link { color: ${ACCENT_INK_DARK} !important; }`;

const ENTITIES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** The one escape helper: every value in a text node or an attribute goes through it. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ENTITIES[character]);
}

/**
 * FilesHub stored-template placeholders an href may carry as written, matched exactly, each one
 * vetted by name. FilesHub replaces such a token with its own https URL at send time. The set is
 * empty: every href in a composed message is an https URL.
 */
const VETTED_HREF_PLACEHOLDERS: ReadonlySet<string> = new Set<string>();
const UNSAFE_URL_CHARACTERS = /[\s\p{Cc}\p{Cf}]/u;

/**
 * The https-only link helper. Returns the URL unchanged when it is an https URL with a host and
 * holds no space, control or format character; refuses every other scheme (javascript:, data:,
 * http:, relative) with EmailDataError, so it is never emitted.
 */
export function safeHref(url: string): string {
  if (VETTED_HREF_PLACEHOLDERS.has(url)) return url;
  if (
    typeof url !== "string" || !url.startsWith("https://") ||
    UNSAFE_URL_CHARACTERS.test(url)
  ) throw new EmailDataError("A link is not an https URL");
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new EmailDataError("A link is not a URL");
  }
  if (parsed.protocol !== "https:" || !parsed.hostname) {
    throw new EmailDataError("A link is not an https URL");
  }
  return url;
}

/** A link to a page of the product's live site. */
export function siteLink(label: string, path: string): Link {
  return { label, href: website(path) };
}

/** The message a composer returns, and what the transport posts to FilesHub. */
export type EmailMessage = {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
};

/** One email's parts in reading order; the layout adds the header, sign-off and footer links. */
export type EmailContent = {
  readonly subject: string;
  readonly preheader: string;
  readonly eyebrow: string;
  readonly heading: Line;
  /** One or more paragraphs; the last sits further from the facts card. */
  readonly intro: readonly Line[];
  readonly facts: readonly (readonly [label: string, value: string])[];
  readonly button: Link;
  /** The pay-surface sentence, set close under the button's raw URL. */
  readonly terms?: Line;
  readonly body: readonly Line[];
  /** Why the reader got it and whether it can be stopped; {contact} becomes the contact link. */
  readonly footer: string;
};

type Parts = EmailContent & { readonly footerLine: Line; readonly site: Line };

/** Renders one email's HTML and plain-text parts from the same content. */
export function renderEmail(content: EmailContent): EmailMessage {
  const home = website();
  const parts: Parts = {
    ...content,
    button: {
      label: content.button.label,
      href: safeHref(content.button.href),
    },
    footerLine: fill(content.footer, {
      contact: siteLink(catalogue.contactLink, "/contact"),
    }),
    site: fill(catalogue.footerSite, {
      product: catalogue.productName,
      site: { label: new URL(safeHref(home)).host, href: home },
    }),
  };
  return {
    subject: content.subject,
    html: htmlPart(parts),
    text: textPart(parts),
  };
}

function anchorHtml(link: Link): string {
  return `<a class="wsm-link" href="${
    escapeHtml(safeHref(link.href))
  }" style="color:${ACCENT_INK};">${escapeHtml(link.label)}</a>`;
}

function lineHtml(line: Line): string {
  return line.map((segment) =>
    typeof segment === "string" ? escapeHtml(segment) : anchorHtml(segment)
  ).join("");
}

function factsHtml(facts: Parts["facts"]): string {
  const rows = facts.map(([label, value], index) => {
    const ruled = index < facts.length - 1;
    const rule = ruled ? ` wsm-rule` : "";
    const border = ruled ? `border-bottom:1px solid ${LINE};` : "";
    return `<tr><th align="left" class="wsm-muted${rule}" style="width:42%;padding:12px 16px;${border}font-size:14px;line-height:20px;font-weight:400;color:${MUTED};">${
      escapeHtml(label)
    }</th><td class="wsm-ink${rule}" style="padding:12px 16px;${border}font-size:15px;line-height:20px;font-weight:600;color:${INK};">${
      escapeHtml(value)
    }</td></tr>`;
  });
  return `<table data-part="facts" role="presentation" class="wsm-facts" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${WELL}" style="width:100%;background:${WELL};border-radius:8px;margin:0 0 24px 0;">${
    rows.join("")
  }</table>`;
}

/** The bulletproof button: the cell carries the colour, the anchor the padding. */
function buttonHtml(button: Link): string {
  return `<table data-part="button" role="presentation" class="wsm-btn" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px 0;"><tr><td class="wsm-btn-cell" bgcolor="${ACCENT}" style="background:${ACCENT};border-radius:8px;"><a class="wsm-btn-a" href="${
    escapeHtml(button.href)
  }" style="display:inline-block;padding:14px 24px;font-size:16px;line-height:20px;font-weight:600;color:${ON_ACCENT};text-decoration:none;border-radius:8px;">${
    escapeHtml(button.label)
  }</a></td></tr></table>`;
}

function paragraphHtml(part: string, margin: string, line: Line): string {
  return `  <p data-part="${part}" class="wsm-ink" style="margin:${margin};font-size:16px;line-height:25px;color:${INK};">${
    lineHtml(line)
  }</p>`;
}

function htmlPart(parts: Parts): string {
  const name = escapeHtml(catalogue.productName);
  const rows = [
    `<div data-part="preheader" style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${CANVAS};opacity:0;">${
      escapeHtml(parts.preheader)
    }${PREHEADER_PAD}</div>`,
    `<table role="presentation" class="wsm-canvas" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CANVAS}" style="width:100%;background:${CANVAS};"><tr><td class="wsm-outer" align="center" style="padding:24px 12px;">`,
    `<table role="presentation" class="wsm-card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="width:100%;max-width:600px;background:${CARD};border:1px solid ${LINE};border-radius:12px;">`,
    `<tr><td class="wsm-px" style="padding:28px 32px 8px 32px;text-align:left;font-family:${FONT};color:${INK};">`,
    `  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${TILE}" style="background:${TILE};border-radius:8px;padding:6px;"><img data-part="logo" src="${
      escapeHtml(safeHref(website(LOGO_PATH)))
    }" width="32" height="32" alt="${name}" style="display:block;width:32px;height:32px;border:0;"></td><td data-part="brand" class="wsm-ink" style="padding-left:10px;font-size:18px;line-height:24px;font-weight:700;color:${INK};">${name}</td></tr></table>`,
    `  <p data-part="eyebrow" class="wsm-brand" style="margin:28px 0 8px 0;font-size:12px;line-height:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${ACCENT_INK};">${
      escapeHtml(parts.eyebrow)
    }</p>`,
    `  <h1 data-part="heading" class="wsm-h1 wsm-ink" style="margin:0 0 14px 0;font-size:28px;line-height:34px;font-weight:700;letter-spacing:-0.3px;color:${INK};">${
      lineHtml(parts.heading)
    }</h1>`,
    ...parts.intro.map((line, index) =>
      paragraphHtml(
        "intro",
        index < parts.intro.length - 1 ? "0 0 12px 0" : "0 0 20px 0",
        line,
      )
    ),
    ...(parts.facts.length ? [`  ${factsHtml(parts.facts)}`] : []),
    `  ${buttonHtml(parts.button)}`,
    `  <p data-part="fallback" class="wsm-muted" style="margin:${
      parts.terms ? "0 0 8px 0" : "0 0 24px 0"
    };font-size:13px;line-height:19px;color:${MUTED};word-break:break-all;">${
      escapeHtml(parts.button.href)
    }</p>`,
    ...(parts.terms
      ? [
        `  <p data-part="body" class="wsm-muted" style="margin:0 0 22px 0;font-size:13px;line-height:19px;color:${MUTED};">${
          lineHtml(parts.terms)
        }</p>`,
      ]
      : []),
    ...parts.body.map((line) => paragraphHtml("body", "0 0 16px 0", line)),
    `  <p data-part="signoff" class="wsm-ink" style="margin:0 0 24px 0;font-size:16px;line-height:25px;color:${INK};">${
      escapeHtml(catalogue.signoff)
    }</p>`,
    `</td></tr>`,
    `<tr><td data-part="footer" class="wsm-px wsm-muted wsm-rule" style="padding:18px 32px 24px 32px;border-top:1px solid ${LINE};text-align:left;font-family:${FONT};font-size:13px;line-height:20px;color:${MUTED};">${
      lineHtml(parts.footerLine)
    }<br>${lineHtml(parts.site)}</td></tr>`,
    `</table></td></tr></table>`,
  ];
  return [
    `<!doctype html>`,
    `<html lang="${LANG}">`,
    `<head>`,
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    `<meta name="color-scheme" content="light dark">`,
    `<meta name="supported-color-schemes" content="light dark">`,
    `<title>${escapeHtml(parts.subject)}</title>`,
    `<style>`,
    LAYOUT_STYLE,
    `</style>`,
    `</head>`,
    `<body style="margin:0;padding:0;">`,
    ...rows,
    `</body>`,
    `</html>`,
  ].join("\n");
}

/** A link as the text part writes it: the bare URL when the label is the URL, else both. */
function linkText(link: Link): string {
  const href = safeHref(link.href);
  const bare = href.replace(/^https:\/\//, "").replace(/\/$/, "");
  return link.label === href || link.label === bare
    ? href
    : `${link.label} (${href})`;
}

function lineText(line: Line): string {
  return line.map((segment) =>
    typeof segment === "string" ? segment : linkText(segment)
  ).join("");
}

/**
 * The plain-text part, in the HTML's reading order: name, eyebrow, heading, intro, facts as
 * "Label: value", the button as "Label: URL", the rest, the sign-off, then "--" and the footer
 * with every URL written out. The preheader and the raw URL line are left out, as the dummy does.
 */
function textPart(parts: Parts): string {
  const lines: string[] = [];
  const paragraph = (text: string) =>
    lines.push(text.replace(/[ \t]+/g, " ").trim(), "");
  paragraph(catalogue.productName);
  paragraph(parts.eyebrow);
  paragraph(lineText(parts.heading));
  parts.intro.forEach((line) => paragraph(lineText(line)));
  if (parts.facts.length) {
    for (const [label, value] of parts.facts) {
      lines.push(`${label.trim()}: ${value.trim()}`);
    }
    lines.push("");
  }
  lines.push(`${parts.button.label.trim()}: ${parts.button.href}`, "");
  if (parts.terms) paragraph(lineText(parts.terms));
  parts.body.forEach((line) => paragraph(lineText(line)));
  paragraph(catalogue.signoff);
  lines.push("--");
  paragraph(`${lineText(parts.footerLine)}\n${lineText(parts.site)}`);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
