export function referralRewardLine(
  rewarded: boolean,
  rewardMonths: number,
  rewardPlanDisplayName: string,
): string {
  if (!rewarded) {
    return "No reward month was added with this confirmation. Your account shows your points and any reward time already earned.";
  }
  const unit = rewardMonths === 1 ? "month" : "months";
  return `This confirmation earned ${rewardMonths} ${unit} of ${rewardPlanDisplayName}. Your account shows when that time can be used.`;
}
