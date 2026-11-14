/**
 * Every word windowsweep's account mail carries, keyed by meaning, with named {placeholders}.
 * The words are the approved click dummy's (desktop/design/windowsweep-click-dummy/emails.html),
 * written from docs/story/drafts/emails-1.4.0.md. A second language is a second file of this
 * shape and nothing else.
 */

/** The language every message is written in; also the locale its counts are written in. */
export const LANG = "en-GB";

/** A count's wording per plural category; `other` is the form every locale has. */
export type PluralForms = Readonly<
  Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }
>;

/** A link inside a sentence: an anchor in the HTML part, its URL written out in the text part. */
export type Link = { readonly label: string; readonly href: string };

/** One run of a filled sentence: catalogue text, a cleaned value, or a link. */
export type Segment = string | Link;

/** A catalogue sentence with its named values filled in, ready for the layout. */
export type Line = readonly Segment[];

export const catalogue = {
  productName: "windowsweep",
  signoff: "The windowsweep team",
  contactLink: "site contact form",
  footerSite: "{product} · {site}",
  payTerms: "By continuing, you agree to our {terms} and {privacy}.",
  termsLink: "Terms of Service",
  privacyLink: "Privacy Policy",
  interval: { month: "monthly", year: "yearly" },
  counts: {
    deviceRuns: {
      one: "{count} real run each month",
      other: "{count} real runs each month",
    },
    accountRuns: {
      one: "{count} more real run each month",
      other: "{count} more real runs each month",
    },
    points: { one: "{count} point", other: "{count} points" },
    friends: {
      one: "{count} confirmed friend",
      other: "{count} confirmed friends",
    },
    months: { one: "{count} month", other: "{count} months" },
  },
  welcome: {
    subject: "Your windowsweep account is ready",
    preheader: "See how your machine and account run allowances work.",
    eyebrow: "Account ready",
    heading: "Your account is ready.",
    intro:
      "This machine's allowance goes first: {deviceAllowance}. Sign in and your account adds {accountRuns} more across the machines you use. Dry-runs, scans and reports do not count.",
    facts: { machine: "This machine", account: "Your account" },
    button: "Open your account",
    body: {
      remaining:
        "Your account shows what remains. Cleanup in the command-line engine still never touches the network; the desktop window checks your allowance and updates separately.",
      dryRun:
        "Before a real run, read the target list in a dry-run. Protected folders stay refused. The dry-run removes none of your files.",
    },
    footer:
      "You received this because your windowsweep account was created. This account message cannot be turned off; use the {contact} for help.",
  },
  planConfirmed: {
    subject: "Your windowsweep plan is active",
    preheader: "The paid period and seat count are recorded below.",
    eyebrow: "Plan confirmed",
    heading: "Your {plan} plan is active.",
    intro:
      "Your paid period runs from {start} to {end}. The account shows which machines or Team seats the plan covers. The subtotal below is before discounts and tax; your Polar receipt shows the final charge.",
    facts: {
      plan: "Plan",
      interval: "Interval",
      subtotal: "Subtotal before discounts and tax",
      seats: "Seats",
      period: "Period",
    },
    period: "{start} to {end}",
    button: "View your plan",
    body:
      "The plan is recorded on your account. If the subtotal or period above differs from your Polar order, use the site contact form and include the plan and period. Do not send a payment card number.",
    footer:
      "You received this because a payment activated your windowsweep plan. This transaction message cannot be turned off; use the {contact} for billing help.",
  },
  referralConfirmed: {
    subject: "Your windowsweep referral was confirmed",
    preheader: "The points and confirmed-friend count have changed.",
    eyebrow: "Referral confirmed",
    heading: "Your referral counted.",
    intro:
      "This friend added {points}. Your total is now {totalPoints} from {confirmed}. A reward takes {threshold}.",
    rewardEarned:
      "This confirmation earned {months} of {plan}. Your account shows when that time can be used.",
    rewardNone:
      "No reward month was added with this confirmation. Your account shows your points and any reward time already earned.",
    facts: {
      points: "Points from this referral",
      totalPoints: "Total points",
      confirmed: "Confirmed friends",
      threshold: "Reward threshold",
    },
    button: "View your referrals",
    footer:
      "You received this because a friend joined with your windowsweep referral code and confirmed their account. This account message cannot be turned off; use the {contact} for help.",
  },
  paymentReturned: {
    subject: "A windowsweep payment was returned",
    preheader: "Your current plan is recorded below.",
    eyebrow: "Payment returned",
    heading: "A payment was returned.",
    intro:
      "The returned amount is {amount}. Your current plan is {planNow}. Check it before your next real run; a returned payment can change what it includes.",
    facts: {
      plan: "Plan on the returned order",
      amount: "Amount returned",
      planNow: "Current plan",
    },
    button: "See current plans",
    body:
      "If the returned amount does not match your payment record, use the site contact form and include the date and amount shown by your payment provider. Do not send a card number.",
    footer:
      "You received this because the payment provider reported a returned windowsweep payment. This transaction message cannot be turned off; use the {contact} for billing help.",
  },
  planGranted: {
    subject: "A windowsweep plan grant was recorded",
    preheader: "See its plan, seats and end date.",
    eyebrow: "Plan grant",
    heading: "A {plan} grant was recorded.",
    intro:
      "Seats covered: {seats}. Your account shows when this grant applies alongside any paid period or Team membership. Those records are kept separately.",
    facts: { plan: "Plan", seats: "Seats", endsAt: "End date" },
    button: "View your plan",
    body:
      "If this grant is unexpected, use the site contact form. Include the plan name, not a payment card number.",
    footer:
      "You received this because an administrator recorded a windowsweep plan grant for your account. This account message cannot be turned off; use the {contact} for help.",
  },
  planRequestOpen: {
    subject: "Your windowsweep plan link is ready",
    preheader: "Your earlier plan request did not start a paid plan.",
    eyebrow: "Plan request",
    heading: "Your plan link is ready.",
    intro:
      "You asked for {plan} on the {interval} interval. The request did not start a paid plan. Open the link to review the plan and continue to checkout; the plan begins only after payment is confirmed.",
    facts: { plan: "Requested plan", interval: "Interval" },
    button: "Review your plan",
    body:
      "You can compare the current plans at {pricing}. The checkout page shows the amount before you pay.",
    footer:
      "You received this because you asked windowsweep to send a plan link when checkout opened. This request message cannot be turned off; use the {contact} for help.",
  },
  teamInvite: {
    subject: "A windowsweep Team invitation",
    preheader: "Review who invited you before joining.",
    eyebrow: "Team invitation",
    heading: "You were invited to {team}.",
    intro:
      "{inviter} invited this address to join their windowsweep Team. Open the link to review and accept the invitation. Joining adds your account as a Team member; it does not start a purchase in your name.",
    facts: { team: "Team", invitedBy: "Invited by" },
    button: "Review the invitation",
    body:
      "If you did not expect this invitation, leave it alone. Your account does not join until you accept.",
    footer:
      "You received this because a Team owner invited this address to windowsweep. This invitation message cannot be turned off; use the {contact} for help.",
  },
  /** docs/story/drafts/d91-strings.md S7: FilesHub stores this as the release list's confirmation. */
  releaseConfirm: {
    subject: "Confirm this address for windowsweep",
    preheader: "No release email reaches this address until you do.",
    eyebrow: "Release notes signup",
    heading: "Confirm this address.",
    intro:
      "This address was entered in the windowsweep release notes signup. It joins the list only after you confirm it on the page linked below.",
    facts: {
      releaseNotes: "Release notes",
      releaseNotesValue: "One email when a windowsweep release is ready",
      leaving: "Leaving the list",
      leavingValue: "In one click, from any release email",
    },
    button: "Open the confirmation page",
    body:
      "If you did not ask for release emails, leave this message alone. The address stays off the list until someone confirms it on that page. A mail filter that opens links cannot do that.",
    footer:
      "You received this because this address was entered in the release notes signup, on {changelog} or in the footer of {docs}. Use the {contact} for help.",
  },
} as const;

const PLACEHOLDER = /\{(\w+)\}/g;
const DIRECTION_OVERRIDES = /[‪-‮⁦-⁩]/g;
const SPACE_AND_CONTROL_RUNS = /[\s\p{Cc}]+/gu;

/**
 * A value as a reader should see it: on one line, with no control characters and no direction
 * overrides, so a typed team name cannot start a new line in the text part or reverse its text.
 */
export function cleanValue(value: string): string {
  return value.replace(DIRECTION_OVERRIDES, "")
    .replace(SPACE_AND_CONTROL_RUNS, " ")
    .trim();
}

/**
 * Fills a catalogue sentence's named {placeholders}. String values are cleaned; links stay whole
 * for the layout to build. A placeholder with no value is a composer bug and throws.
 */
export function fill(
  template: string,
  values: Readonly<Record<string, string | Link>> = {},
): Line {
  const line: Segment[] = [];
  let from = 0;
  for (const match of template.matchAll(PLACEHOLDER)) {
    const value = values[match[1]];
    if (value === undefined) {
      throw new Error(`The catalogue sentence needs {${match[1]}}`);
    }
    if (match.index > from) line.push(template.slice(from, match.index));
    line.push(typeof value === "string" ? cleanValue(value) : value);
    from = match.index + match[0].length;
  }
  if (from < template.length) line.push(template.slice(from));
  return line;
}

/** Fills a sentence that holds no links and returns it as plain text. */
export function say(
  template: string,
  values: Readonly<Record<string, string>> = {},
): string {
  return fill(template, values).join("");
}

const counts = new Intl.NumberFormat(LANG);
const plurals = new Intl.PluralRules(LANG);

/** A whole number as the catalogue's locale writes it. */
export function formatCount(value: number): string {
  return counts.format(value);
}

/** The wording for a count's plural category, with {count} filled in. */
export function plural(forms: PluralForms, value: number): string {
  return say(forms[plurals.select(value)] ?? forms.other, {
    count: formatCount(value),
  });
}
