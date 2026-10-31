import {
  answer,
  ApiError,
  bodyObject,
  pageLimit,
  pageNumber,
  requireMethod,
  serve,
  textField,
  uuid,
} from "../_shared/http.ts";
import { sendTemplate, website } from "../_shared/email.ts";
import { caller, rpc, serviceClient } from "../_shared/supabase.ts";

serve(async (request) => {
  requireMethod(request, "POST");
  const body = await bodyObject(request);
  const action = textField(body, "action", 1, 30);
  if (
    !["create", "invite", "invites", "accept", "remove", "fleet"].includes(
      action,
    )
  ) {
    throw new ApiError(422, "invalid_request", "action is invalid");
  }
  const args: Record<string, unknown> = {};
  if (action === "create") args.p_name = textField(body, "name", 1, 80);
  if (action === "invite") {
    const email = textField(body, "email", 3, 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(422, "invalid_request", "email is invalid");
    }
    args.p_email = email;
  }
  if (action === "accept") args.p_invite_id = uuid(body.invite_id, "invite_id");
  if (action === "remove") {
    if (Boolean(body.user_id) === Boolean(body.invite_id)) {
      throw new ApiError(
        422,
        "invalid_request",
        "user_id or invite_id is required",
      );
    }
    args.p_user_id = body.user_id ? uuid(body.user_id, "user_id") : null;
    args.p_invite_id = body.invite_id
      ? uuid(body.invite_id, "invite_id")
      : null;
  }
  if (action === "invites" || action === "fleet") {
    args.p_limit = pageLimit(body.limit);
    args.p_page = pageNumber(body.page);
  }
  const { client, user } = await caller(request, true);
  if (action === "invite") {
    const prepared = await rpc<
      { invite_id: string; should_send: boolean; claim_token: string | null }
    >(client, "team_invite_prepare", args);
    let sent = false;
    if (prepared.should_send) {
      let fleet: { team: { name: string } };
      try {
        fleet = await rpc<{ team: { name: string } }>(
          client,
          "team_fleet",
          { p_limit: 1, p_page: 0 },
        );
      } catch (error) {
        await rpc(serviceClient(), "team_invite_release_send", {
          p_invite_id: prepared.invite_id,
          p_token: prepared.claim_token,
        });
        throw error;
      }
      const outcome = await sendTemplate(
        args.p_email as string,
        "windowsweep-team-invite",
        {
          team_name: fleet.team.name,
          invited_by: user.email ?? "windowsweep",
          accept_url: website(
            `/account?team_invite=${encodeURIComponent(prepared.invite_id)}`,
          ),
        },
      );
      if (outcome === "accepted") {
        await rpc(serviceClient(), "team_invite_mark_sent", {
          p_invite_id: prepared.invite_id,
          p_token: prepared.claim_token,
        });
        sent = true;
      } else if (outcome === "uncertain") {
        await rpc(serviceClient(), "team_invite_mark_uncertain", {
          p_invite_id: prepared.invite_id,
          p_token: prepared.claim_token,
        });
      } else {
        await rpc(serviceClient(), "team_invite_release_send", {
          p_invite_id: prepared.invite_id,
          p_token: prepared.claim_token,
        });
      }
    }
    return answer({
      ok: true,
      invite_id: prepared.invite_id,
      email_sent: sent,
    });
  }
  const names: Record<string, string> = {
    create: "team_create",
    invites: "team_my_invites",
    accept: "team_accept",
    remove: "team_remove",
    fleet: "team_fleet",
  };
  const result = await rpc<Record<string, unknown>>(
    client,
    names[action],
    args,
  );
  return answer({ ok: true, ...result });
});
