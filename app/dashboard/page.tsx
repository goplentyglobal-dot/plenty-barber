import Link from "next/link";
import { Coins, FileText, Plus, Sparkles, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CreditHealthCard } from "@/components/dashboard/credit-health-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBusinessById } from "@/lib/database/businesses";
import { countClients } from "@/lib/database/clients";
import { countReportsThisMonth, listReports } from "@/lib/database/reports";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { formatShortDate } from "@/lib/utils/date";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const copyByLocale = {
  es: {
    eyebrow: "Dashboard",
    title: "Centro de control del negocio",
    description: "Mide clientes, creditos e informes premium desde un espacio elegante.",
    newReport: "Nuevo informe",
    rechargeCredits: "Recargar creditos",
    creditsRemaining: "Creditos disponibles",
    alertThreshold: "Umbral de alerta",
    reportsThisMonth: "Informes este mes",
    realData: "Datos reales de Supabase",
    registeredClients: "Clientes registrados",
    viewCredits: "Ver creditos",
    creditHealthyTitle: "Saldo saludable",
    creditHealthyText: "Tu negocio puede seguir generando informes con comodidad.",
    creditAttentionTitle: "Credito en observacion",
    creditAttentionText: "Todavia puedes operar, pero conviene programar una recarga para no frenar el equipo.",
    creditCriticalTitle: "Credito critico",
    creditCriticalText: "Quedan pocos informes disponibles. Recarga antes de iniciar una jornada con clientes.",
    creditExhaustedTitle: "Credito agotado o por agotarse",
    creditExhaustedText: "Recarga ahora para evitar que el flujo de nuevos informes quede bloqueado.",
    latestReports: "Ultimos informes",
    viewAll: "Ver todo",
    noClient: "Cliente no conectado",
    reportType: "Informe de visagismo",
    noReports: "Aun no hay informes",
    noReportsText: "Crea el primer informe del cliente cuando el flujo este listo."
  },
  en: {
    eyebrow: "Dashboard",
    title: "Business command center",
    description: "Track clients, credits and premium reports from one elegant workspace.",
    newReport: "New report",
    rechargeCredits: "Add credits",
    creditsRemaining: "Credits remaining",
    alertThreshold: "Alert threshold",
    reportsThisMonth: "Reports this month",
    realData: "Real Supabase data",
    registeredClients: "Registered clients",
    viewCredits: "View credits",
    creditHealthyTitle: "Healthy balance",
    creditHealthyText: "Your business can keep generating reports comfortably.",
    creditAttentionTitle: "Credit needs attention",
    creditAttentionText: "You can still operate, but it is smart to plan a recharge before the team slows down.",
    creditCriticalTitle: "Critical credit balance",
    creditCriticalText: "Only a few reports remain. Add credits before starting a client-heavy day.",
    creditExhaustedTitle: "Credits exhausted or almost gone",
    creditExhaustedText: "Add credits now to avoid blocking new report generation.",
    latestReports: "Latest reports",
    viewAll: "View all",
    noClient: "Client not attached",
    reportType: "Visagism report",
    noReports: "No reports yet",
    noReportsText: "Create the first client report when the flow is ready."
  },
  pt: {
    eyebrow: "Dashboard",
    title: "Centro de controle do negocio",
    description: "Acompanhe clientes, creditos e relatorios premium em um espaco elegante.",
    newReport: "Novo relatorio",
    rechargeCredits: "Recarregar creditos",
    creditsRemaining: "Creditos disponiveis",
    alertThreshold: "Limite de alerta",
    reportsThisMonth: "Relatorios este mes",
    realData: "Dados reais do Supabase",
    registeredClients: "Clientes cadastrados",
    viewCredits: "Ver creditos",
    creditHealthyTitle: "Saldo saudavel",
    creditHealthyText: "Seu negocio pode continuar gerando relatorios com tranquilidade.",
    creditAttentionTitle: "Credito em observacao",
    creditAttentionText: "Voce ainda pode operar, mas vale programar uma recarga para nao frear a equipe.",
    creditCriticalTitle: "Credito critico",
    creditCriticalText: "Restam poucos relatorios disponiveis. Recarregue antes de uma agenda cheia.",
    creditExhaustedTitle: "Credito esgotado ou quase no fim",
    creditExhaustedText: "Recarregue agora para evitar bloqueio na geracao de novos relatorios.",
    latestReports: "Ultimos relatorios",
    viewAll: "Ver tudo",
    noClient: "Cliente nao conectado",
    reportType: "Relatorio de visagismo",
    noReports: "Ainda nao ha relatorios",
    noReportsText: "Crie o primeiro relatorio do cliente quando o fluxo estiver pronto."
  }
} satisfies Record<Locale, Record<string, string>>;

export default async function DashboardPage() {
  const locale = getLocale();
  const copy = copyByLocale[locale];
  const businessUser = await requireCurrentBusinessUser();
  const [business, reportsThisMonth, registeredClients, recentReports] = await Promise.all([
    getBusinessById(businessUser.business_id),
    countReportsThisMonth(businessUser.business_id),
    countClients(businessUser.business_id),
    listReports(businessUser.business_id, 5)
  ]);

  const hasCredits = business.credits_remaining > 0;

  return (
    <DashboardShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={
        <Link href={hasCredits ? "/dashboard/reports/new" : "/dashboard/credits"}>
          <Button className="gap-2" variant={hasCredits ? "gold" : "outline"}>
            <Plus className="h-4 w-4" /> {hasCredits ? copy.newReport : copy.rechargeCredits}
          </Button>
        </Link>
        }
      />

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <MetricCard
          label={copy.creditsRemaining}
          value={String(business.credits_remaining)}
          detail={`${copy.alertThreshold}: ${business.credits_alert_threshold}`}
          icon={<Coins className="h-5 w-5" />}
        />
        <MetricCard
          label={copy.reportsThisMonth}
          value={String(reportsThisMonth)}
          detail={copy.realData}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <MetricCard
          label={copy.registeredClients}
          value={String(registeredClients)}
          detail={business.name}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <CreditHealthCard
        credits={business.credits_remaining}
        labels={{
          healthy: {
            title: copy.creditHealthyTitle,
            text: copy.creditHealthyText
          },
          attention: {
            title: copy.creditAttentionTitle,
            text: copy.creditAttentionText
          },
          critical: {
            title: copy.creditCriticalTitle,
            text: copy.creditCriticalText
          },
          exhausted: {
            title: copy.creditExhaustedTitle,
            text: copy.creditExhaustedText
          },
          cta: copy.viewCredits
        }}
      />

      <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl text-cream">{copy.latestReports}</h2>
          <Link href="/dashboard/reports" className="text-sm text-gold-light hover:text-gold">
            {copy.viewAll}
          </Link>
        </div>
        {recentReports.length ? (
          <div className="grid gap-3">
            {recentReports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-cream">
                      {report.end_clients?.full_name || copy.noClient}
                    </p>
                    <p className="mt-1 text-sm text-cream/54">{copy.reportType}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-cream/60">
                    <span>{formatShortDate(report.created_at, locale)}</span>
                    <span className="rounded-full border border-gold/30 px-3 py-1 capitalize text-gold-light">
                      {report.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="grid min-h-52 place-items-center text-center">
            <div>
              <FileText className="mx-auto h-9 w-9 text-gold" />
              <h3 className="mt-4 font-display text-2xl text-cream">{copy.noReports}</h3>
              <p className="mt-2 text-sm text-cream/62">{copy.noReportsText}</p>
            </div>
          </Card>
        )}
      </section>
    </DashboardShell>
  );
}
