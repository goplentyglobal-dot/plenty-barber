export type PaymentProviderName = "wompi" | "mercadopago" | "stripe" | "payu" | "demo";

export type CheckoutInput = {
  businessId: string;
  plan: "starter" | "pro" | "agency" | "credits_100" | "credits_250";
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutResult = {
  provider: PaymentProviderName;
  checkoutUrl: string;
  reference: string;
};

export type PaymentWebhookResult = {
  provider: PaymentProviderName;
  reference: string;
  businessId: string | null;
  status: "approved" | "declined" | "pending";
  creditsToAdd: number;
  priceUsd: number | null;
  raw: unknown;
};
