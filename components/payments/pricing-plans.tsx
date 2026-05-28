"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeDollarSign, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { CheckoutButton } from "@/components/payments/checkout-button";
import { Card } from "@/components/ui/card";
import { paymentPlans, type PaymentPlanKey } from "@/lib/payments/plans";

type CurrencyKey = "co" | "brpt" | "us";
type PlanKey = Extract<PaymentPlanKey, "starter" | "pro" | "agency">;

const planKeys: PlanKey[] = ["starter", "pro", "agency"];

const currencyOptions = [
  { key: "co", label: "Colombia", short: "COP" },
  { key: "brpt", label: "Brasil / Portugal", short: "BRL/EUR" },
  { key: "us", label: "USA", short: "USD" }
] as const;

const planDescriptions: Record<PlanKey, string> = {
  starter: "Para barberias que empiezan a convertir el diagnostico en servicio premium.",
  pro: "Para equipos que generan informes cada semana y hacen seguimiento comercial.",
  agency: "Para negocios con alto volumen, varias sillas o expansion de sedes."
};

export function PricingPlans({ buyLabel = "Comprar plan" }: { buyLabel?: string }) {
  const [currency, setCurrency] = useState<CurrencyKey>("co");

  return (
    <div>
      <div className="inline-flex rounded-full border border-white/10 bg-white/[0.035] p-1">
        {currencyOptions.map((option) => {
          const isActive = option.key === currency;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setCurrency(option.key)}
              className={
                isActive
                  ? "rounded-full bg-gold px-4 py-2 text-xs font-semibold text-noir shadow-gold"
                  : "rounded-full px-4 py-2 text-xs font-semibold text-cream/62 transition hover:text-gold-light"
              }
            >
              <span className="hidden sm:inline">{option.label}</span>
              <span className="sm:hidden">{option.short}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {planKeys.map((planKey, index) => {
          const plan = paymentPlans[planKey];
          const price = formatPrice(planKey, currency);

          return (
            <Card
              key={planKey}
              className="group relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-gold md:animate-[pb-float_7s_ease-in-out_infinite]"
              style={{ animationDelay: `${index * 0.45}s` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-cream">{plan.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-cream/62">{planDescriptions[planKey]}</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                  <BadgeDollarSign className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-7 min-h-24">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${planKey}-${currency}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <p className="font-display text-5xl text-gold">{price.main}</p>
                    <p className="mt-2 text-sm text-cream/54">{price.detail}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-cream/72">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  {plan.credits} creditos incluidos
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  PDF, link web y WhatsApp
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  Soporte para ES, EN y PT
                </span>
              </div>

              <CheckoutButton plan={planKey} label={buyLabel} className="mt-8 w-full gap-2" />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function formatPrice(planKey: PlanKey, currency: CurrencyKey) {
  const plan = paymentPlans[planKey];

  if (currency === "co") {
    return {
      main: `COP ${plan.priceCop.toLocaleString("es-CO")}`,
      detail: "Pago local recomendado para Colombia."
    };
  }

  if (currency === "brpt") {
    return {
      main: `BRL ${(plan.priceUsd * 4).toLocaleString("pt-BR")}`,
      detail: `Referencia internacional. Base USD ${plan.priceUsd}; EUR segun pasarela.`
    };
  }

  return {
    main: `USD ${plan.priceUsd}`,
    detail: "Precio base para Stripe y pagos internacionales."
  };
}
