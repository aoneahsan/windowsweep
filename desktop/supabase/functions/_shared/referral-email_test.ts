import { referralRewardLine } from "./referral-email.ts";

Deno.test("referral email names an earned month", () => {
  const line = referralRewardLine(true, 1, "Pro");
  if (
    line !==
      "This confirmation earned 1 month of Pro. Your account shows when that time can be used."
  ) throw new Error("Earned reward line changed");
});

Deno.test("referral email does not invent a reward at the cap", () => {
  const line = referralRewardLine(false, 1, "Pro");
  if (
    line !==
      "No reward month was added with this confirmation. Your account shows your points and any reward time already earned."
  ) throw new Error("Points-only line invented a reward");
});
