import { createDemoCheckout, parseDemoWebhook } from "@/lib/payments/providers/demo";
import { createMercadoPagoCheckout, parseMercadoPagoWebhook } from "@/lib/payments/providers/mercadopago";
import { createPayUCheckout, parsePayUWebhook } from "@/lib/payments/providers/payu";
import { createStripeCheckout, parseStripeWebhook } from "@/lib/payments/providers/stripe";
import { createWompiCheckout, parseWompiWebhook } from "@/lib/payments/providers/wompi";
import type { CheckoutInput, PaymentProviderName } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProviderName {
  const provider = process.env.PAYMENT_PROVIDER as PaymentProviderName | undefined;
  return provider || "wompi";
}

export async function createCheckout(input: CheckoutInput) {
  const provider = getPaymentProvider();

  if (provider === "wompi") return createWompiCheckout(input);
  if (provider === "mercadopago") return createMercadoPagoCheckout(input);
  if (provider === "stripe") return createStripeCheckout(input);
  if (provider === "payu") return createPayUCheckout(input);
  return createDemoCheckout(input);
}

export async function parsePaymentWebhook(provider: PaymentProviderName, raw: unknown) {
  if (provider === "wompi") return parseWompiWebhook(raw);
  if (provider === "mercadopago") return parseMercadoPagoWebhook(raw);
  if (provider === "stripe") return parseStripeWebhook(raw);
  if (provider === "payu") return parsePayUWebhook(raw);
  return parseDemoWebhook(raw);
}
