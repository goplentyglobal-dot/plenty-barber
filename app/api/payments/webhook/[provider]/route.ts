import { NextResponse } from "next/server";
import { applyApprovedPaymentCredits } from "@/lib/database/credits";
import { parsePaymentWebhook } from "@/lib/payments/payment-provider";
import { verifyPaymentWebhook } from "@/lib/payments/webhook-security";
import type { PaymentProviderName } from "@/lib/payments/types";

export async function POST(request: Request, { params }: { params: { provider: PaymentProviderName } }) {
  if (!isPaymentProvider(params.provider)) {
    return NextResponse.json({ error: "Unsupported payment provider." }, { status: 404 });
  }

  const rawBody = await request.text();
  const raw = parseJsonBody(rawBody);

  if (!raw) {
    return NextResponse.json({ error: "Invalid webhook body." }, { status: 400 });
  }

  if (!verifyPaymentWebhook({ provider: params.provider, rawBody, payload: raw, headers: request.headers })) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const event = await parsePaymentWebhook(params.provider, raw);
  const creditUpdate =
    event.status === "approved" && event.businessId
      ? await applyApprovedPaymentCredits({
          businessId: event.businessId,
          creditsToAdd: event.creditsToAdd,
          reference: event.reference,
          provider: event.provider,
          priceUsd: event.priceUsd
        })
      : { applied: false, reason: "not_approved" as const };

  return NextResponse.json({
    received: true,
    provider: event.provider,
    status: event.status,
    reference: event.reference,
    creditsToAdd: event.creditsToAdd,
    creditUpdate
  });
}

function isPaymentProvider(provider: string): provider is PaymentProviderName {
  return ["wompi", "mercadopago", "stripe", "payu", "demo"].includes(provider);
}

function parseJsonBody(rawBody: string) {
  try {
    return JSON.parse(rawBody || "null") as unknown;
  } catch {
    return null;
  }
}
