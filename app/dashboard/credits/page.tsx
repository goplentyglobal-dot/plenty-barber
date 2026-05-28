import { CreditCard, WalletCards } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";
import { CheckoutButton } from "@/components/payments/checkout-button";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { getBusinessById } from "@/lib/database/businesses";
import { listCreditTransactions } from "@/lib/database/credits";
import { formatShortDate } from "@/lib/utils/date";
import { paymentPlans } from "@/lib/payments/plans";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const copyByLocale = {
  es: {
    eyebrow: "Creditos",
    title: "Saldo de creditos",
    description: "Monitorea creditos, historial de transacciones y recargas.",
    availableCredits: "Creditos disponibles",
    alertThreshold: "Umbral de alerta",
    recharge100: "Recargar 100 creditos",
    history: "Historial de transacciones",
    movement: "Movimiento de creditos",
    emptyHistory: "Aun no hay transacciones de creditos. Los pagos y ajustes administrativos apareceran aqui.",
    packages: "Paquetes de recarga",
    creditsForReports: "creditos para informes",
    buyPackage: "Comprar paquete",
    checkoutSuccessTitle: "Pago recibido por la pasarela",
    checkoutSuccessText: "Estamos esperando la confirmacion segura del webhook para sumar tus creditos automaticamente.",
    checkoutCancelledTitle: "Pago cancelado",
    checkoutCancelledText: "No se hizo ningun cargo. Puedes intentar de nuevo cuando quieras.",
    notEnoughCreditsTitle: "Necesitas creditos para generar informes",
    notEnoughCreditsText: "Elige un paquete de recarga para continuar usando la IA."
  },
  en: {
    eyebrow: "Credits",
    title: "Credit balance",
    description: "Monitor report credits, transaction history and recharge activity.",
    availableCredits: "Available credits",
    alertThreshold: "Alert threshold",
    recharge100: "Recharge 100 credits",
    history: "Transaction history",
    movement: "Credit movement",
    emptyHistory: "No credit transactions yet. Payments and admin adjustments will populate this ledger.",
    packages: "Recharge packages",
    creditsForReports: "credits for reports",
    buyPackage: "Buy package",
    checkoutSuccessTitle: "Payment received by provider",
    checkoutSuccessText: "We are waiting for the secure webhook confirmation to add your credits automatically.",
    checkoutCancelledTitle: "Payment cancelled",
    checkoutCancelledText: "No charge was made. You can try again whenever you want.",
    notEnoughCreditsTitle: "You need credits to generate reports",
    notEnoughCreditsText: "Choose a recharge package to keep using AI."
  },
  pt: {
    eyebrow: "Creditos",
    title: "Saldo de creditos",
    description: "Monitore creditos, historico de transacoes e recargas.",
    availableCredits: "Creditos disponiveis",
    alertThreshold: "Limite de alerta",
    recharge100: "Recarregar 100 creditos",
    history: "Historico de transacoes",
    movement: "Movimento de creditos",
    emptyHistory: "Ainda nao ha transacoes de creditos. Pagamentos e ajustes administrativos aparecerao aqui.",
    packages: "Pacotes de recarga",
    creditsForReports: "creditos para relatorios",
    buyPackage: "Comprar pacote",
    checkoutSuccessTitle: "Pagamento recebido pela passarela",
    checkoutSuccessText: "Estamos aguardando a confirmacao segura do webhook para somar seus creditos automaticamente.",
    checkoutCancelledTitle: "Pagamento cancelado",
    checkoutCancelledText: "Nenhuma cobranca foi feita. Voce pode tentar novamente quando quiser.",
    notEnoughCreditsTitle: "Voce precisa de creditos para gerar relatorios",
    notEnoughCreditsText: "Escolha um pacote de recarga para continuar usando a IA."
  }
} satisfies Record<Locale, Record<string, string>>;

export default async function CreditsPage({
  searchParams
}: {
  searchParams?: { checkout?: string; error?: string };
}) {
  const locale = getLocale();
  const copy = copyByLocale[locale];
  const businessUser = await requireCurrentBusinessUser();
  const [business, transactions] = await Promise.all([
    getBusinessById(businessUser.business_id),
    listCreditTransactions(businessUser.business_id)
  ]);

  return (
    <DashboardShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      {searchParams?.checkout === "success" ? (
        <Card className="mt-8 border-emerald-400/25 bg-emerald-500/10">
          <h2 className="font-display text-2xl text-emerald-100">{copy.checkoutSuccessTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-emerald-50/76">{copy.checkoutSuccessText}</p>
        </Card>
      ) : null}
      {searchParams?.checkout === "cancelled" ? (
        <Card className="mt-8 border-gold/25 bg-gold/10">
          <h2 className="font-display text-2xl text-cream">{copy.checkoutCancelledTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-cream/66">{copy.checkoutCancelledText}</p>
        </Card>
      ) : null}
      {searchParams?.error === "not_enough_credits" ? (
        <Card className="mt-8 border-red-400/30 bg-red-500/10">
          <h2 className="font-display text-2xl text-red-100">{copy.notEnoughCreditsTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-red-50/76">{copy.notEnoughCreditsText}</p>
        </Card>
      ) : null}
      <div className="mt-8 grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-gold/10" />
          <div className="relative grid h-14 w-14 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            <CreditCard className="h-7 w-7" />
          </div>
          <p className="mt-6 text-sm text-cream/58">{copy.availableCredits}</p>
          <p className="mt-2 font-display text-5xl text-cream">{business.credits_remaining}</p>
          <p className="mt-2 text-sm text-cream/58">{copy.alertThreshold}: {business.credits_alert_threshold}</p>
          <CheckoutButton plan="credits_100" label={copy.recharge100} className="mt-6 w-full gap-2" />
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
              <WalletCards className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl">{copy.history}</h2>
          </div>
          {transactions.length ? (
            <div className="mt-5 grid gap-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-2 rounded-lg border border-white/10 bg-noir/70 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-cream">{transaction.type || copy.movement}</p>
                    <p className="mt-1 text-sm text-cream/52">
                      {transaction.note || formatShortDate(transaction.created_at, locale)}
                    </p>
                  </div>
                  <span className={transaction.credits_delta >= 0 ? "text-emerald-100" : "text-red-100"}>
                    {transaction.credits_delta > 0 ? "+" : ""}
                    {transaction.credits_delta}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-cream/62">
              {copy.emptyHistory}
            </p>
          )}
        </Card>
      </div>
      <section className="mt-8">
        <h2 className="font-display text-2xl text-cream">{copy.packages}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {(["credits_100", "credits_250"] as const).map((planKey) => {
            const plan = paymentPlans[planKey];

            return (
              <Card key={planKey} className="p-5">
                <p className="text-sm uppercase text-gold-light">{plan.name}</p>
                <p className="mt-3 font-display text-4xl text-cream">COP {plan.priceCop.toLocaleString("es-CO")}</p>
                <p className="mt-2 text-sm text-cream/58">{plan.credits} {copy.creditsForReports}</p>
                <CheckoutButton plan={planKey} label={copy.buyPackage} variant="outline" className="mt-5 w-full gap-2" />
              </Card>
            );
          })}
        </div>
      </section>
    </DashboardShell>
  );
}
