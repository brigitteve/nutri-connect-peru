import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders, jsonResponse, requireEnv } from "../_shared/cors.ts";

type ScalePayload = {
  device_id?: string;
  gross_weight_g?: number;
  tare_weight_g?: number;
  reservation_id?: string;
  dish_id?: string;
  macros?: {
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    calories?: number;
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const expectedSecret = Deno.env.get("SCALE_INGEST_SECRET");
    if (expectedSecret && req.headers.get("x-webhook-secret") !== expectedSecret) {
      return jsonResponse({ error: "Invalid ingest secret" }, 401);
    }

    const payload = (await req.json()) as ScalePayload;
    if (!payload.device_id || typeof payload.gross_weight_g !== "number") {
      return jsonResponse({ error: "device_id and gross_weight_g are required" }, 400);
    }

    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false } },
    );

    const { data, error } = await supabase.rpc("ingest_scale_measurement", {
      target_device_id: payload.device_id,
      target_gross_weight_g: payload.gross_weight_g,
      target_tare_weight_g: payload.tare_weight_g ?? 0,
      target_reservation_id: payload.reservation_id ?? null,
      target_dish_id: payload.dish_id ?? null,
      target_macros: {
        protein_g: payload.macros?.protein_g ?? 0,
        carbs_g: payload.macros?.carbs_g ?? 0,
        fat_g: payload.macros?.fat_g ?? 0,
        calories: payload.macros?.calories ?? 0,
      },
      target_raw_payload: payload,
    });

    if (error) {
      throw error;
    }

    return jsonResponse({ ok: true, measurement: data });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
