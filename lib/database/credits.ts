import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CreditTransaction } from "@/lib/database/types";
import { hasSupabasePublicEnv } from "@/lib/validations/env";

export async function listCreditTransactions(businessId: string, limit = 25) {
  if (!hasSupabasePublicEnv()) {
    return [
      {
        id: "demo-credit-1",
        business_id: businessId,
        credits_delta: 25,
        price_usd: null,
        stripe_payment_intent_id: null,
        type: "demo_topup",
        note: "Demo credits for local testing",
        created_at: new Date().toISOString()
      },
      {
        id: "demo-credit-2",
        business_id: businessId,
        credits_delta: -1,
        price_usd: null,
        stripe_payment_intent_id: null,
        type: "generation_use",
        note: "Demo report generation",
        created_at: new Date().toISOString()
      }
    ].slice(0, limit);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Unable to load credit transactions.");
  }

  return data as CreditTransaction[];
}

export async function applyApprovedPaymentCredits(input: {
  businessId: string;
  creditsToAdd: number;
  reference: string;
  provider: string;
  priceUsd: number | null;
}) {
  if (!hasSupabasePublicEnv()) {
    return { applied: false, reason: "demo" as const };
  }

  if (!input.businessId || input.creditsToAdd <= 0 || !input.reference) {
    return { applied: false, reason: "invalid" as const };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("apply_payment_credits", {
    p_business_id: input.businessId,
    p_credits_to_add: input.creditsToAdd,
    p_reference: input.reference,
    p_provider: input.provider,
    p_price_usd: input.priceUsd
  });

  if (error) {
    throw new Error("Unable to apply payment credits.");
  }

  if (data === false) {
    return { applied: false, reason: "duplicate" as const };
  }

  return { applied: true, reason: "approved" as const };
}
