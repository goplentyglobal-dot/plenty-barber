"use client";

import { animate } from "framer-motion";
import { BadgeDollarSign, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CheckoutButton } from "@/components/payments/checkout-button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { paymentPlans, type PaymentPlanKey } from "@/lib/payments/plans";

type CurrencyKey = "co" | "brpt" | "us";
type PlanKey = Extract<PaymentPlanKey, "starter" | "pro" | "agency">;

const planKeys: PlanKey[] = ["starter", "pro", "agency"];
const popularPlan: PlanKey = "pro";

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

function PriceCounter({ value, locale }: { value: number; locale: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const controls = animate(prevRef.current, value, {
      duration: 0.7,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = formatter.format(Math.round(latest));
      }
    });
    prevRef.current = value;

    return () => controls.stop();
  }, [value, locale]);

  return <span ref={nodeRef} />;
}

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
          const isPopular = planKey === popularPlan;

          return (
            <Card
              key={planKey}
              className={cn(
                "group relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-gold md:animate-[pb-float_7s_ease-in-out_infinite]",
                isPopular && "border-gold/45 shadow-gold ring-1 ring-gold/30"
              )}
              style={{ animationDelay: `${index * 0.45}s` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              {isPopular ? (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-light">
                  <Sparkles className="h-3 w-3" />
                  Popular
                </span>
              ) : null}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-cream">{plan.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-cream/62">{planDescriptions[planKey]}</p>
                </div>
                {!isPopular ? (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                    <BadgeDollarSign className="h-5 w-5" />
                  </span>
                ) : null}
              </div>

              <div className="mt-7 min-h-24">
                <p className="font-display text-5xl text-gold">
                  <span className="text-2xl align-top text-gold/70">{price.prefix}</span>
                  <PriceCounter value={price.value} locale={price.numberLocale} />
                </p>
                <p className="mt-2 text-sm text-cream/54">{price.detail}</p>
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
      prefix: "COP ",
      value: plan.priceCop,
      numberLocale: "es-CO",
      detail: "Pago local recomendado para Colombia."
    };
  }

  if (currency === "brpt") {
    return {
      prefix: "BRL ",
      value: plan.priceUsd * 4,
      numberLocale: "pt-BR",
      detail: `Referencia internacional. Base USD ${plan.priceUsd}; EUR segun pasarela.`
    };
  }

  return {
    prefix: "USD ",
    value: plan.priceUsd,
    numberLocale: "en-US",
    detail: "Precio base para Stripe y pagos internacionales."
  };
}
