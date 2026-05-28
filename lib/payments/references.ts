import type { PaymentPlanKey } from "@/lib/payments/plans";

const planKeys = ["starter", "pro", "agency", "credits_100", "credits_250"] as const;

export function createPaymentReference(businessId: string, plan: PaymentPlanKey) {
  return `pb_${businessId}_${plan}_${Date.now()}`;
}

export function parsePaymentReference(reference: string) {
  const match = reference.match(/^pb_(.+)_(starter|pro|agency|credits_100|credits_250)_([0-9]+)$/);

  if (!match) {
    return null;
  }

  const plan = match[2] as PaymentPlanKey;

  if (!planKeys.includes(plan)) {
    return null;
  }

  return {
    businessId: match[1],
    plan,
    timestamp: Number(match[3])
  };
}
