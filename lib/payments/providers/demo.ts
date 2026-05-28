import { paymentPlans } from "@/lib/payments/plans";
import { createPaymentReference, parsePaymentReference } from "@/lib/payments/references";
import type { CheckoutInput, CheckoutResult, PaymentWebhookResult } from "@/lib/payments/types";

export async function createDemoCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const reference = createPaymentReference(input.businessId, input.plan);

  return {
    provider: "demo",
    checkoutUrl: input.successUrl,
    reference
  };
}

export async function parseDemoWebhook(raw: unknown): Promise<PaymentWebhookResult> {
  const payload = raw as { reference?: string };
  const reference = payload.reference || "";
  const parsed = parsePaymentReference(reference);
  const plan = parsed ? paymentPlans[parsed.plan] : null;

  return {
    provider: "demo",
    reference,
    businessId: parsed?.businessId ?? null,
    status: "approved",
    creditsToAdd: plan?.credits ?? 0,
    priceUsd: plan?.priceUsd ?? null,
    raw
  };
}
