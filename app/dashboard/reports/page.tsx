import Link from "next/link";
import { Eye, FileText, Plus } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { listReports } from "@/lib/database/reports";
import { formatShortDate } from "@/lib/utils/date";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const copyByLocale = {
  es: {
    eyebrow: "Informes",
    title: "Historial de informes",
    description: "Revisa informes de visagismo generados, links publicos, PDF y estado de entrega.",
    newReport: "Nuevo informe",
    noClient: "Cliente no conectado",
    providerPending: "Proveedor pendiente",
    viewReport: "Ver informe",
    noReports: "Aun no hay informes",
    noReportsText: "Los informes creados por el flujo de generacion apareceran aqui con sus estados."
  },
  en: {
    eyebrow: "Reports",
    title: "Report history",
    description: "Review generated visagism reports, public links, PDF exports and delivery status.",
    newReport: "New report",
    noClient: "Client not attached",
    providerPending: "Provider pending",
    viewReport: "View report",
    noReports: "No reports yet",
    noReportsText: "Reports created by the generation flow will appear here with their status."
  },
  pt: {
    eyebrow: "Relatorios",
    title: "Historico de relatorios",
    description: "Revise relatorios de visagismo gerados, links publicos, PDF e status de entrega.",
    newReport: "Novo relatorio",
    noClient: "Cliente nao conectado",
    providerPending: "Provedor pendente",
    viewReport: "Ver relatorio",
    noReports: "Ainda nao ha relatorios",
    noReportsText: "Os relatorios criados pelo fluxo de geracao aparecerao aqui com seus status."
  }
} satisfies Record<Locale, Record<string, string>>;

export default async function ReportsPage() {
  const locale = getLocale();
  const copy = copyByLocale[locale];
  const businessUser = await requireCurrentBusinessUser();
  const reports = await listReports(businessUser.business_id);

  return (
    <DashboardShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={
        <Link href="/dashboard/reports/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> {copy.newReport}
          </Button>
        </Link>
        }
      />
      {reports.length ? (
        <div className="mt-8 grid gap-3">
          {reports.map((report) => (
            <Card key={report.id} className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-cream">
                    {report.end_clients?.full_name || copy.noClient}
                  </p>
                  <p className="mt-1 text-sm text-cream/54">
                    {report.ai_provider || copy.providerPending} - {formatShortDate(report.created_at, locale)}
                  </p>
                  {report.error_message ? (
                    <p className="mt-2 text-sm text-red-100/80">{report.error_message}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ReportStatusBadge status={report.status} locale={locale} />
                  <Link href={`/report/${report.id}`}>
                    <Button variant="outline" className="gap-2">
                      <Eye className="h-4 w-4" /> {copy.viewReport}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-8 grid min-h-80 place-items-center text-center">
          <div>
            <FileText className="mx-auto h-10 w-10 text-gold" />
            <h2 className="mt-5 font-display text-2xl text-cream">{copy.noReports}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-cream/62">
              {copy.noReportsText}
            </p>
          </div>
        </Card>
      )}
    </DashboardShell>
  );
}
