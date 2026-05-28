import { paymentPlans } from "@/lib/payments/plans";
import { parsePaymentReference } from "@/lib/payments/references";
import type { CheckoutInput, CheckoutResult, PaymentWebhookResult } from "@/lib/payments/types";

export async function createPayUCheckout(_input: CheckoutInput): Promise<CheckoutResult> {
  throw new Error("PayU adapter is prepared but not enabled. Add merchant credentials and API mapping.");
}

export async function parsePayUWebhook(raw: unknown): Promise<PaymentWebhookResult> {
  const payload = raw as { reference_sale?: string; state_pol?: string };
  const reference = payload.reference_sale || "";
  const parsed = parsePaymentReference(reference);
  const plan = parsed ? paymentPlans[parsed.plan] : null;
  const approved = payload.state_pol === "4";

  return {
    provider: "payu",
    reference,
    businessId: parsed?.businessId ?? null,
    status: approved ? "approved" : "pending",
    creditsToAdd: approved ? plan?.credits ?? 0 : 0,
    priceUsd: plan?.priceUsd ?? null,
    raw
  };
}
