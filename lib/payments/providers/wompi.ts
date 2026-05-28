import crypto from "crypto";
import { paymentPlans } from "@/lib/payments/plans";
import { createPaymentReference, parsePaymentReference } from "@/lib/payments/references";
import type { CheckoutInput, CheckoutResult, PaymentWebhookResult } from "@/lib/payments/types";

export async function createWompiCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  if (!publicKey || !integritySecret) {
    throw new Error("Wompi keys are not configured.");
  }

  const plan = paymentPlans[input.plan];
  const amountInCents = plan.priceCop * 100;
  const reference = createPaymentReference(input.businessId, input.plan);
  const signature = crypto
    .createHash("sha256")
    .update(`${reference}${amountInCents}COP${integritySecret}`)
    .digest("hex");
  const checkoutUrl = new URL("https://checkout.wompi.co/p/");
  checkoutUrl.searchParams.set("public-key", publicKey);
  checkoutUrl.searchParams.set("currency", "COP");
  checkoutUrl.searchParams.set("amount-in-cents", String(amountInCents));
  checkoutUrl.searchParams.set("reference", reference);
  checkoutUrl.searchParams.set("signature:integrity", signature);
  checkoutUrl.searchParams.set("redirect-url", input.successUrl);

  return {
    provider: "wompi",
    checkoutUrl: checkoutUrl.toString(),
    reference
  };
}

export async function parseWompiWebhook(raw: unknown): Promise<PaymentWebhookResult> {
  const event = raw as {
    data?: {
      transaction?: {
        reference?: string;
        status?: string;
      };
    };
  };
  const reference = event.data?.transaction?.reference || "";
  const parsed = parsePaymentReference(reference);
  const plan = parsed ? paymentPlans[parsed.plan] : null;
  const credits = plan?.credits ?? 0;
  const status = event.data?.transaction?.status === "APPROVED" ? "approved" : "pending";

  return {
    provider: "wompi",
    reference,
    businessId: parsed?.businessId ?? null,
    status,
    creditsToAdd: status === "approved" ? credits : 0,
    priceUsd: plan?.priceUsd ?? null,
    raw
  };
}
