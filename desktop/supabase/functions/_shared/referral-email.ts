import { catalogue, plural, say } from "./email/catalogue.ts";
import { EmailDataError } from "./email/layout.ts";

/**
 * The referral email's reward sentence, built before the composer runs: the months of the reward
 * plan this confirmation earned, or that none was added (also true at the rolling cap).
 */
export function referralRewardLine(
  rewarded: boolean,
  rewardMonths: number,
  rewardPlanDisplayName: string,
): string {
  const words = catalogue.referralConfirmed;
  if (!rewarded) return words.rewardNone;
  if (
    !Number.isSafeInteger(rewardMonths) || rewardMonths < 1 ||
    typeof rewardPlanDisplayName !== "string" || !rewardPlanDisplayName.trim()
  ) throw new EmailDataError("The reward months or plan is missing");
  return say(words.rewardEarned, {
    months: plural(catalogue.counts.months, rewardMonths),
    plan: rewardPlanDisplayName,
  });
}
