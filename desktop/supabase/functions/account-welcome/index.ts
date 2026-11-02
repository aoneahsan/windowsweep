import {
  answer,
  ApiError,
  bodyObject,
  requireMethod,
  serve,
} from "../_shared/http.ts";
import { sendTemplate, website } from "../_shared/email.ts";
import { referralRewardLine } from "../_shared/referral-email.ts";
import { caller, rpc, serviceClient } from "../_shared/supabase.ts";

serve(async (request) => {
  requireMethod(request, "POST");
  const body = await bodyObject(request);
  let code: string | null = null;
  if (
    body.referral_code !== undefined && body.referral_code !== null &&
    body.referral_code !== ""
  ) {
    if (
      typeof body.referral_code !== "string" ||
      !/^[a-z0-9]{10}$/i.test(body.referral_code)
    ) {
      throw new ApiError(422, "invalid_request", "referral_code is invalid");
    }
    code = body.referral_code.toUpperCase();
  }
  const { client, user } = await caller(request, true);
  const referral = code
    ? await rpc<string>(client, "referral_claim", { p_code: code })
    : null;
  const service = serviceClient();
  let welcomeSent = false;
  const welcome = await rpc<{ email: string; claim_token: string } | null>(
    service,
    "email_claim_welcome",
    { p_user: user.id },
  );
  if (welcome) {
    const { data: config, error } = await service.from("app_config").select(
      "key,value",
    )
      .in("key", [
        "device_real_runs_per_month",
        "account_extra_real_runs_per_month",
      ]).limit(2);
    const values = Object.fromEntries(
      (config ?? []).map((row) => [row.key, row.value]),
    );
    const outcome = error
      ? "refused"
      : await sendTemplate(welcome.email, "windowsweep-welcome", {
        device_runs: String(values.device_real_runs_per_month ?? ""),
        account_runs: String(values.account_extra_real_runs_per_month ?? ""),
        app_url: website("/account"),
      });
    if (outcome === "accepted") {
      welcomeSent = await rpc<boolean>(service, "email_mark_welcome_sent", {
        p_user: user.id,
        p_token: welcome.claim_token,
      }) === true;
    } else if (outcome === "uncertain") {
      await rpc(service, "email_mark_welcome_uncertain", {
        p_user: user.id,
        p_token: welcome.claim_token,
      });
    } else {
      await rpc(service, "email_release_welcome", {
        p_user: user.id,
        p_token: welcome.claim_token,
      });
    }
  }
  const notification = await rpc<
    {
      referral_id: string;
      claim_token: string;
      email: string;
      points: number;
      total_points: number;
      confirmed: number;
      threshold: number;
      reward_plan: string;
      reward_months: number;
      rewarded: boolean;
    } | null
  >(service, "email_claim_referral_notification", { p_invitee: user.id });
  if (notification) {
    const outcome = await sendTemplate(
      notification.email,
      "windowsweep-referral-confirmed",
      {
        points: String(notification.points),
        total_points: String(notification.total_points),
        confirmed: String(notification.confirmed),
        threshold: String(notification.threshold),
        reward_plan: String(notification.reward_plan),
        reward_months: String(notification.reward_months),
        rewarded: notification.rewarded ? "yes" : "no",
        reward_line: referralRewardLine(
          notification.rewarded,
          notification.reward_months,
          notification.reward_plan,
        ),
        account_url: website("/account"),
      },
    );
    if (outcome === "accepted") {
      await rpc(service, "email_mark_referral_notified", {
        p_referral: notification.referral_id,
        p_token: notification.claim_token,
      });
    } else if (outcome === "uncertain") {
      await rpc(service, "email_mark_referral_uncertain", {
        p_referral: notification.referral_id,
        p_token: notification.claim_token,
      });
    } else {
      await rpc(service, "email_release_referral_notification", {
        p_referral: notification.referral_id,
        p_token: notification.claim_token,
      });
    }
  }
  return answer({ ok: true, welcome_sent: welcomeSent, referral });
});
