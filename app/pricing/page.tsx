import { SiteHeader } from "@/components/layout/site-header";
import { PricingPlans } from "@/components/payments/pricing-plans";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

const copyByLocale = {
  es: {
    eyebrow: "Precios",
    title: "Planes honestos para negocios de belleza que quieren crecer.",
    subtitle:
      "Elige una moneda de referencia, compra creditos y empieza a entregar informes premium sin contratos largos ni presion comercial.",
    buy: "Comprar plan"
  },
  en: {
    eyebrow: "Pricing",
    title: "Honest plans for growing beauty businesses.",
    subtitle:
      "Choose a reference currency, buy credits and start delivering premium reports without long contracts or sales pressure.",
    buy: "Buy plan"
  },
  pt: {
    eyebrow: "Precos",
    title: "Planos honestos para negocios de beleza que querem crescer.",
    subtitle:
      "Escolha uma moeda de referencia, compre creditos e comece a entregar relatorios premium sem contratos longos ou pressao comercial.",
    buy: "Comprar plano"
  }
} satisfies Record<Locale, Record<string, string>>;

export default function PricingPage() {
  const locale = getLocale();
  const copy = copyByLocale[locale];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase text-gold-light">{copy.eyebrow}</p>
          <h1 className="mt-3 font-display text-5xl leading-tight text-cream">{copy.title}</h1>
          <p className="mt-5 text-lg leading-8 text-cream/68">{copy.subtitle}</p>
        </div>
        <div className="mt-10">
          <PricingPlans buyLabel={copy.buy} />
        </div>
      </section>
    </main>
  );
}
