import { paymentPlans } from "@/lib/payments/plans";
import { createPaymentReference, parsePaymentReference } from "@/lib/payments/references";
import type { CheckoutInput, CheckoutResult, PaymentWebhookResult } from "@/lib/payments/types";

export async function createMercadoPagoCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Mercado Pago token is not configured.");
  }

  const plan = paymentPlans[input.plan];
  const reference = createPaymentReference(input.businessId, input.plan);
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      external_reference: reference,
      items: [
        {
          title: `Plenty Barber ${plan.name}`,
          quantity: 1,
          unit_price: plan.priceCop,
          currency_id: "COP"
        }
      ],
      back_urls: {
        success: input.successUrl,
        failure: input.cancelUrl,
        pending: input.successUrl
      },
      auto_return: "approved"
    })
  });

  if (!response.ok) {
    throw new Error("Unable to create Mercado Pago checkout.");
  }

  const payload = (await response.json()) as { init_point?: string };

  if (!payload.init_point) {
    throw new Error("Mercado Pago did not return checkout URL.");
  }

  return {
    provider: "mercadopago",
    checkoutUrl: payload.init_point,
    reference
  };
}

export async function parseMercadoPagoWebhook(raw: unknown): Promise<PaymentWebhookResult> {
  const payload = raw as { external_reference?: string; status?: string };
  const reference = payload.external_reference || "";
  const parsed = parsePaymentReference(reference);
  const plan = parsed ? paymentPlans[parsed.plan] : null;
  const approved = payload.status === "approved";

  return {
    provider: "mercadopago",
    reference,
    businessId: parsed?.businessId ?? null,
    status: approved ? "approved" : "pending",
    creditsToAdd: approved ? plan?.credits ?? 0 : 0,
    priceUsd: plan?.priceUsd ?? null,
    raw
  };
}
