import { PremiumReportView } from "@/components/reports/premium-report-view";
import { getCurrentBusinessUser } from "@/lib/auth/current-user";
import { getReportById, getReportForBusiness } from "@/lib/database/reports";
import { getLocale } from "@/lib/i18n/server";
import { verifyPrintToken } from "@/lib/reports/print-token";

export const dynamic = "force-dynamic";

export default async function PrintableReportPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { token?: string };
}) {
  const hasValidToken = verifyPrintToken(params.id, searchParams?.token);
  const locale = getLocale();
  const businessUser = hasValidToken ? null : await getCurrentBusinessUser();
  const report = hasValidToken
    ? await getReportById(params.id)
    : businessUser
      ? await getReportForBusiness(params.id, businessUser.business_id)
      : null;

  if (!report) {
    const message =
      locale === "en"
        ? "Report not found."
        : locale === "pt"
          ? "Relatorio nao encontrado."
          : "Informe no encontrado.";

    return <main className="p-10 text-cream">{message}</main>;
  }

  return (
    <main className="min-h-screen bg-noir p-6 print:bg-white print:p-0">
      <PremiumReportView report={report} locale={locale} />
      <script dangerouslySetInnerHTML={{ __html: "window.addEventListener('load',()=>setTimeout(()=>window.print(),400));" }} />
    </main>
  );
}
