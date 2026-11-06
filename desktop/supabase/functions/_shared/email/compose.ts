/**
 * One composer per email: `(data) → { subject, html, text }`. Each takes the values its sender
 * passes, already formatted for a reader (display names, website() links, dateLabel() dates,
 * money() amounts), and refuses a missing or malformed one with EmailDataError rather than
 * sending a message with a blank in it. The specimens in emails.html are drawn from this data.
 */
import {
  catalogue,
  cleanValue,
  fill,
  formatCount,
  plural,
  say,
} from "./catalogue.ts";
import {
  EmailDataError,
  type EmailMessage,
  renderEmail,
  safeHref,
  siteLink,
} from "./layout.ts";

/** account-welcome: the two monthly allowances from app_config, and the account page. */
export type WelcomeData = {
  device_runs: string;
  account_runs: string;
  app_url: string;
};

/** billing-email: a verified order.paid, from the committed subscription. */
export type PlanConfirmedData = {
  plan_name: string;
  interval_label: string;
  amount: string;
  seats: string;
  period_start: string;
  period_end: string;
  account_url: string;
};

/** account-welcome: a confirmed referral; reward_line comes from referralRewardLine(). */
export type ReferralConfirmedData = {
  points: string;
  total_points: string;
  confirmed: string;
  threshold: string;
  reward_line: string;
  account_url: string;
};

/** billing-email: a verified order.refunded, after the webhook ended that period. */
export type PaymentReturnedData = {
  plan_name: string;
  amount_returned: string;
  plan_now: string;
  pricing_url: string;
};

/** admin grant-email: the committed grant and plan rows. */
export type PlanGrantedData = {
  plan_name: string;
  seats: string;
  ends_at: string;
  account_url: string;
};

/** admin requests.notify_open: an active, priced plan once checkout is open. */
export type PlanRequestOpenData = {
  plan_name: string;
  interval_label: string;
  pay_url: string;
  pricing_url: string;
};

/** team invite: the owner's team name and email; null when the owner has no email. */
export type TeamInviteData = {
  team_name: string;
  invited_by: string | null;
  accept_url: string;
};

/** A value the sender passed, cleaned; a missing or blank one refuses the message. */
function required(value: unknown, field: string): string {
  const text = typeof value === "string" ? cleanValue(value) : "";
  if (!text) throw new EmailDataError(`${field} is missing`);
  return text;
}

/** A whole number the sender passed as text, such as "15". */
function count(value: unknown, field: string): number {
  const text = required(value, field);
  const number = Number(text);
  if (!/^\d+$/.test(text) || !Number.isSafeInteger(number)) {
    throw new EmailDataError(`${field} is not a count`);
  }
  return number;
}

/** A link the sender built with website(); anything but https is refused. */
function url(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new EmailDataError(`${field} is missing`);
  }
  return safeHref(value);
}

/** The reader's word for a billing interval key: "year" reads yearly, anything else monthly. */
export function intervalLabel(interval: string): string {
  return interval === "year"
    ? catalogue.interval.year
    : catalogue.interval.month;
}

/** Welcome: once, after the first account-welcome for an account with an email. */
export function composeWelcome(data: WelcomeData): EmailMessage {
  const words = catalogue.welcome;
  const device = count(data.device_runs, "device_runs");
  const account = count(data.account_runs, "account_runs");
  const deviceAllowance = plural(catalogue.counts.deviceRuns, device);
  return renderEmail({
    subject: words.subject,
    preheader: words.preheader,
    eyebrow: words.eyebrow,
    heading: fill(words.heading),
    intro: [
      fill(words.intro, { deviceAllowance, accountRuns: formatCount(account) }),
    ],
    facts: [
      [words.facts.machine, deviceAllowance],
      [words.facts.account, plural(catalogue.counts.accountRuns, account)],
    ],
    button: { label: words.button, href: url(data.app_url, "app_url") },
    body: [fill(words.body.remaining), fill(words.body.dryRun)],
    footer: words.footer,
  });
}

/** Plan confirmed: a verified order.paid granted a plan. */
export function composePlanConfirmed(data: PlanConfirmedData): EmailMessage {
  const words = catalogue.planConfirmed;
  const plan = required(data.plan_name, "plan_name");
  const start = required(data.period_start, "period_start");
  const end = required(data.period_end, "period_end");
  return renderEmail({
    subject: words.subject,
    preheader: words.preheader,
    eyebrow: words.eyebrow,
    heading: fill(words.heading, { plan }),
    intro: [fill(words.intro, { start, end })],
    facts: [
      [words.facts.plan, plan],
      [words.facts.interval, required(data.interval_label, "interval_label")],
      [words.facts.subtotal, required(data.amount, "amount")],
      [words.facts.seats, formatCount(count(data.seats, "seats"))],
      [words.facts.period, say(words.period, { start, end })],
    ],
    button: { label: words.button, href: url(data.account_url, "account_url") },
    body: [fill(words.body)],
    footer: words.footer,
  });
}

/** Referral confirmed: once, when a referred friend's account is confirmed. */
export function composeReferralConfirmed(
  data: ReferralConfirmedData,
): EmailMessage {
  const words = catalogue.referralConfirmed;
  const points = count(data.points, "points");
  const total = count(data.total_points, "total_points");
  const confirmed = count(data.confirmed, "confirmed");
  const threshold = plural(
    catalogue.counts.friends,
    count(data.threshold, "threshold"),
  );
  return renderEmail({
    subject: words.subject,
    preheader: words.preheader,
    eyebrow: words.eyebrow,
    heading: fill(words.heading),
    intro: [
      fill(words.intro, {
        points: plural(catalogue.counts.points, points),
        totalPoints: plural(catalogue.counts.points, total),
        confirmed: plural(catalogue.counts.friends, confirmed),
        threshold,
      }),
      [required(data.reward_line, "reward_line")],
    ],
    facts: [
      [words.facts.points, formatCount(points)],
      [words.facts.totalPoints, formatCount(total)],
      [words.facts.confirmed, formatCount(confirmed)],
      [words.facts.threshold, threshold],
    ],
    button: { label: words.button, href: url(data.account_url, "account_url") },
    body: [],
    footer: words.footer,
  });
}

/** Payment returned: a verified order.refunded, after the plan period it paid for ended. */
export function composePaymentReturned(
  data: PaymentReturnedData,
): EmailMessage {
  const words = catalogue.paymentReturned;
  const amount = required(data.amount_returned, "amount_returned");
  const planNow = required(data.plan_now, "plan_now");
  return renderEmail({
    subject: words.subject,
    preheader: words.preheader,
    eyebrow: words.eyebrow,
    heading: fill(words.heading),
    intro: [fill(words.intro, { amount, planNow })],
    facts: [
      [words.facts.plan, required(data.plan_name, "plan_name")],
      [words.facts.amount, amount],
      [words.facts.planNow, planNow],
    ],
    button: { label: words.button, href: url(data.pricing_url, "pricing_url") },
    body: [fill(words.body)],
    footer: words.footer,
  });
}

/** Plan granted: an audited grants.create, or an audited emails.grant_send. */
export function composePlanGranted(data: PlanGrantedData): EmailMessage {
  const words = catalogue.planGranted;
  const plan = required(data.plan_name, "plan_name");
  const seats = formatCount(count(data.seats, "seats"));
  return renderEmail({
    subject: words.subject,
    preheader: words.preheader,
    eyebrow: words.eyebrow,
    heading: fill(words.heading, { plan }),
    intro: [fill(words.intro, { seats })],
    facts: [
      [words.facts.plan, plan],
      [words.facts.seats, seats],
      [words.facts.endsAt, required(data.ends_at, "ends_at")],
    ],
    button: { label: words.button, href: url(data.account_url, "account_url") },
    body: [fill(words.body)],
    footer: words.footer,
  });
}

/** Plan request: requests.notify_open, once checkout is open, for an active priced plan. */
export function composePlanRequestOpen(
  data: PlanRequestOpenData,
): EmailMessage {
  const words = catalogue.planRequestOpen;
  const plan = required(data.plan_name, "plan_name");
  const interval = required(data.interval_label, "interval_label");
  const pricing = url(data.pricing_url, "pricing_url");
  return renderEmail({
    subject: words.subject,
    preheader: words.preheader,
    eyebrow: words.eyebrow,
    heading: fill(words.heading),
    intro: [fill(words.intro, { plan, interval })],
    facts: [
      [words.facts.plan, plan],
      [words.facts.interval, interval],
    ],
    button: { label: words.button, href: url(data.pay_url, "pay_url") },
    terms: fill(catalogue.payTerms, {
      terms: siteLink(catalogue.termsLink, "/terms"),
      privacy: siteLink(catalogue.privacyLink, "/privacy"),
    }),
    body: [fill(words.body, { pricing: { label: pricing, href: pricing } })],
    footer: words.footer,
  });
}

/** Team invitation: a Team owner invited this address. */
export function composeTeamInvite(data: TeamInviteData): EmailMessage {
  const words = catalogue.teamInvite;
  const team = required(data.team_name, "team_name");
  const inviter = data.invited_by === null
    ? catalogue.productName
    : required(data.invited_by, "invited_by");
  return renderEmail({
    subject: words.subject,
    preheader: words.preheader,
    eyebrow: words.eyebrow,
    heading: fill(words.heading, { team }),
    intro: [fill(words.intro, { inviter })],
    facts: [
      [words.facts.team, team],
      [words.facts.invitedBy, inviter],
    ],
    button: { label: words.button, href: url(data.accept_url, "accept_url") },
    body: [fill(words.body)],
    footer: words.footer,
  });
}
