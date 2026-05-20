import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders, jsonResponse, requireEnv } from "../_shared/cors.ts";

type PaymentPayload = {
  provider?: "stripe" | "mercadopago" | "culqi" | "manual";
  event_id?: string;
  type?: string;
  user_id?: string;
  customer_id?: string;
  subscription_id?: string;
  status?: "inactive" | "trialing" | "active" | "past_due" | "cancelled";
  current_period_start?: string;
  current_period_end?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const expectedSecret = Deno.env.get("PAYMENT_WEBHOOK_SECRET");
    if (expectedSecret && req.headers.get("x-webhook-secret") !== expectedSecret) {
      return jsonResponse({ error: "Invalid webhook secret" }, 401);
    }

    const payload = (await req.json()) as PaymentPayload;
    const provider = payload.provider ?? "manual";
    const eventId = payload.event_id ?? crypto.randomUUID();

    if (!payload.user_id || !payload.subscription_id || !payload.status) {
      return jsonResponse({ error: "user_id, subscription_id and status are required" }, 400);
    }

    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false } },
    );

    const { data, error } = await supabase.rpc("process_subscription_payment", {
      target_provider: provider,
      target_provider_event_id: eventId,
      target_user_id: payload.user_id,
      target_provider_customer_id: payload.customer_id ?? null,
      target_provider_subscription_id: payload.subscription_id,
      target_status: payload.status,
      target_period_start: payload.current_period_start ?? null,
      target_period_end: payload.current_period_end ?? null,
      target_payload: payload,
    });

    if (error) {
      throw error;
    }

    return jsonResponse({ ok: true, subscription: data });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
