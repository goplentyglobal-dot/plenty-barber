import { paymentPlans } from "@/lib/payments/plans";
import { createPaymentReference, parsePaymentReference } from "@/lib/payments/references";
import type { CheckoutInput, CheckoutResult, PaymentWebhookResult } from "@/lib/payments/types";

export async function createStripeCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe key is not configured.");
  }

  const plan = paymentPlans[input.plan];
  const reference = createPaymentReference(input.businessId, input.plan);
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", input.successUrl);
  body.set("cancel_url", input.cancelUrl);
  body.set("client_reference_id", reference);
  body.set("line_items[0][price_data][currency]", "usd");
  body.set("line_items[0][price_data][product_data][name]", `Plenty Barber ${plan.name}`);
  body.set("line_items[0][price_data][unit_amount]", String(plan.priceUsd * 100));
  body.set("line_items[0][quantity]", "1");

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    throw new Error("Unable to create Stripe checkout.");
  }

  const payload = (await response.json()) as { url?: string };

  if (!payload.url) {
    throw new Error("Stripe did not return checkout URL.");
  }

  return {
    provider: "stripe",
    checkoutUrl: payload.url,
    reference
  };
}

export async function parseStripeWebhook(raw: unknown): Promise<PaymentWebhookResult> {
  const event = raw as {
    type?: string;
    data?: {
      object?: {
        client_reference_id?: string;
        payment_status?: string;
      };
    };
  };
  const reference = event.data?.object?.client_reference_id || "";
  const parsed = parsePaymentReference(reference);
  const plan = parsed ? paymentPlans[parsed.plan] : null;
  const approved = event.type === "checkout.session.completed" && event.data?.object?.payment_status === "paid";

  return {
    provider: "stripe",
    reference,
    businessId: parsed?.businessId ?? null,
    status: approved ? "approved" : "pending",
    creditsToAdd: approved ? plan?.credits ?? 0 : 0,
    priceUsd: plan?.priceUsd ?? null,
    raw
  };
}
