export const paymentPlans = {
  starter: { name: "Starter", priceCop: 119000, priceUsd: 29, credits: 100 },
  pro: { name: "Pro", priceCop: 199000, priceUsd: 49, credits: 200 },
  agency: { name: "Agency", priceCop: 399000, priceUsd: 99, credits: 500 },
  credits_100: { name: "100 Credits", priceCop: 99000, priceUsd: 25, credits: 100 },
  credits_250: { name: "250 Credits", priceCop: 219000, priceUsd: 55, credits: 250 }
} as const;

export type PaymentPlanKey = keyof typeof paymentPlans;
