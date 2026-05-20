import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders, jsonResponse, requireEnv } from "../_shared/cors.ts";

type PushRequest = {
  notification_id?: string;
  user_id?: string;
  title?: string;
  body?: string;
  metadata?: Record<string, unknown>;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false } },
    );

    const payload = (await req.json()) as PushRequest;
    let notification = null;

    if (payload.notification_id) {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("id", payload.notification_id)
        .single();

      if (error) {
        throw error;
      }

      notification = data;
    } else {
      if (!payload.user_id || !payload.title || !payload.body) {
        return jsonResponse({ error: "notification_id or user_id/title/body is required" }, 400);
      }

      const { data, error } = await supabase
        .from("notifications")
        .insert({
          user_id: payload.user_id,
          type: "system",
          title: payload.title,
          body: payload.body,
          metadata: payload.metadata ?? {},
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      notification = data;
    }

    const { data: tokens, error: tokenError } = await supabase
      .from("push_tokens")
      .select("*")
      .eq("user_id", notification.user_id)
      .eq("enabled", true);

    if (tokenError) {
      throw tokenError;
    }

    const deliveries = [];
    for (const token of tokens ?? []) {
      let status = "queued";
      let providerResponse: Record<string, unknown> = {
        queued: true,
        platform: token.platform,
        token_tail: String(token.token).slice(-8),
      };

      if (Deno.env.get("PUSH_PROVIDER") === "expo") {
        const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(Deno.env.get("EXPO_ACCESS_TOKEN")
              ? { Authorization: `Bearer ${Deno.env.get("EXPO_ACCESS_TOKEN")}` }
              : {}),
          },
          body: JSON.stringify({
            to: token.token,
            title: notification.title,
            body: notification.body,
            data: notification.metadata ?? {},
          }),
        });

        providerResponse = await expoResponse.json().catch(() => ({
          status: expoResponse.status,
          statusText: expoResponse.statusText,
        }));
        status = expoResponse.ok ? "sent" : "failed";
      }

      const { data, error } = await supabase
        .from("notification_deliveries")
        .insert({
          notification_id: notification.id,
          push_token_id: token.id,
          status,
          provider_response: providerResponse,
          attempted_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      deliveries.push(data);
    }

    return jsonResponse({ ok: true, notification, deliveries });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
