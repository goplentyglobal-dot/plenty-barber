import Link from "next/link";
import { Download, ExternalLink, MessageCircle, Share2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VibrationFeedback } from "@/components/ui/vibration-feedback";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { PremiumReportView } from "@/components/reports/premium-report-view";
import { GenerateIllustrationsButton } from "@/components/reports/generate-illustrations-button";
import { UnpublishReportForm } from "@/components/reports/unpublish-report-form";
import { reportSchema } from "@/lib/ai/validators/report-schema";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { getReportForBusiness } from "@/lib/database/reports";
import { getLocale } from "@/lib/i18n/server";
import { env } from "@/lib/validations/env";
import { formatShortDate } from "@/lib/utils/date";
import { publishReportAction } from "@/app/report/[id]/actions";
import { publicReportUrl } from "@/lib/reports/public-url";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const pageCopy = {
  es: {
    unavailableTitle: "Informe no disponible",
    unavailableText: "No encontramos el informe o sus datos de analisis estan incompletos.",
    eyebrow: "Vista del informe",
    title: "Informe personal de visagismo",
    noClient: "Cliente sin asociar",
    publicActive: "El informe publico esta activo",
    publicMarked: "El informe esta marcado como publico",
    missingToken: "Falta generar el token del enlace publico. Puedes regenerarlo con el boton de abajo.",
    visits: "Visitas",
    openPublished: "Abrir informe publicado",
    unpublish: "Dar de baja",
    unpublishTitle: "Dar de baja informe publico",
    unpublishDescription: "El enlace publico dejara de funcionar para el cliente. Podras publicarlo de nuevo cuando lo necesites.",
    unpublishConfirm: "Confirmar baja",
    unpublishPending: "Dando de baja...",
    viewPage: "Visualizar pagina",
    repairLink: "Regenerar enlace publico",
    publishLink: "Publicar enlace web",
    premiumPdf: "PDF premium",
    whatsappClient: "cliente",
    whatsappMessage: "Hola {name}, aqui tienes tu informe personalizado de visagismo: {url}",
    backHome: "Volver al inicio",
    modalTitle: "Aqui esta tu informe",
    close: "Cerrar"
  },
  en: {
    unavailableTitle: "Report unavailable",
    unavailableText: "We could not find the report or its analysis data is incomplete.",
    eyebrow: "Report view",
    title: "Personal visagism report",
    noClient: "Client not attached",
    publicActive: "The public report is active",
    publicMarked: "The report is marked as public",
    missingToken: "The public link token is missing. You can regenerate it with the button below.",
    visits: "Views",
    openPublished: "Open published report",
    unpublish: "Unpublish",
    unpublishTitle: "Unpublish public report",
    unpublishDescription: "The public link will stop working for the client. You can publish it again whenever needed.",
    unpublishConfirm: "Confirm unpublish",
    unpublishPending: "Unpublishing...",
    viewPage: "View page",
    repairLink: "Regenerate public link",
    publishLink: "Publish web link",
    premiumPdf: "Premium PDF",
    whatsappClient: "client",
    whatsappMessage: "Hi {name}, here is your personalized visagism report: {url}",
    backHome: "Back home",
    modalTitle: "Here is your report",
    close: "Close"
  },
  pt: {
    unavailableTitle: "Relatorio indisponivel",
    unavailableText: "Nao encontramos o relatorio ou seus dados de analise estao incompletos.",
    eyebrow: "Vista do relatorio",
    title: "Relatorio pessoal de visagismo",
    noClient: "Cliente nao conectado",
    publicActive: "O relatorio publico esta ativo",
    publicMarked: "O relatorio esta marcado como publico",
    missingToken: "Falta gerar o token do link publico. Voce pode regera-lo com o botao abaixo.",
    visits: "Visitas",
    openPublished: "Abrir relatorio publicado",
    unpublish: "Tirar do ar",
    unpublishTitle: "Tirar relatorio publico do ar",
    unpublishDescription: "O link publico deixara de funcionar para o cliente. Voce podera publica-lo novamente quando precisar.",
    unpublishConfirm: "Confirmar retirada",
    unpublishPending: "Tirando do ar...",
    viewPage: "Visualizar pagina",
    repairLink: "Regenerar link publico",
    publishLink: "Publicar link web",
    premiumPdf: "PDF premium",
    whatsappClient: "cliente",
    whatsappMessage: "Ola {name}, aqui esta seu relatorio personalizado de visagismo: {url}",
    backHome: "Voltar ao inicio",
    modalTitle: "Aqui esta seu relatorio",
    close: "Fechar"
  }
} satisfies Record<Locale, Record<string, string>>;

export default async function PublicReportPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { published?: string; generated?: string };
}) {
  const businessUser = await requireCurrentBusinessUser();
  const locale = getLocale();
  const copy = pageCopy[locale];
  const report = await getReportForBusiness(params.id, businessUser.business_id);
  const parsedReport = report ? reportSchema.safeParse(report.report_json) : null;

  if (!report || !parsedReport?.success) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto max-w-5xl px-5 py-12">
          <Card className="grid min-h-80 place-items-center text-center">
            <div>
              <h1 className="font-display text-3xl text-cream">{copy.unavailableTitle}</h1>
              <p className="mt-3 text-sm text-cream/62">
                {copy.unavailableText}
              </p>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  const internalReportUrl = `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/report/${report.id}`;
  const publicToken = report.public_token || searchParams?.published || null;
  const publicReportPath = report.is_public && publicToken ? `/r/${publicToken}` : null;
  const publishedUrl = report.is_public && publicToken ? publicReportUrl(publicToken) : null;
  const showPublishedModal = Boolean(searchParams?.published && publicReportPath && publishedUrl);
  const showGeneratedFeedback = searchParams?.generated === "1";
  const needsPublicLinkRepair = Boolean(report.is_public && !publicToken);
  const shareUrl = publishedUrl || internalReportUrl;
  const whatsappName = report.end_clients?.full_name || copy.whatsappClient;
  const whatsappMessage = copy.whatsappMessage.replace("{name}", whatsappName).replace("{url}", shareUrl);

  return (
    <main className="min-h-screen">
      {showGeneratedFeedback ? <VibrationFeedback type="complete" /> : null}
      {showPublishedModal ? <VibrationFeedback type="success" /> : null}
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-12">
        <p className="text-sm uppercase text-gold-light">{copy.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl text-cream">{copy.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-cream/58">
          <span>{report.end_clients?.full_name || copy.noClient}</span>
          <span>{formatShortDate(report.created_at, parsedReport.data.idioma || locale)}</span>
          <ReportStatusBadge status={report.status} locale={parsedReport.data.idioma || locale} />
        </div>

        {publishedUrl || needsPublicLinkRepair ? (
          <Card className="mt-8 border-gold/30 bg-gold/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl text-cream">
                  {publishedUrl ? copy.publicActive : copy.publicMarked}
                </h2>
                <p className="mt-2 break-all text-sm text-gold-light">
                  {publishedUrl || copy.missingToken}
                </p>
                <p className="mt-1 text-xs text-cream/52">{copy.visits}: {report.views_count ?? 0}</p>
              </div>
              {publishedUrl ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={publicReportPath ?? "#"} target="_blank">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="h-4 w-4" /> {copy.openPublished}
                    </Button>
                  </Link>
                  <UnpublishReportForm
                    reportId={report.id}
                    labels={{
                      trigger: copy.unpublish,
                      title: copy.unpublishTitle,
                      description: copy.unpublishDescription,
                      cancel: copy.close,
                      confirm: copy.unpublishConfirm,
                      pending: copy.unpublishPending
                    }}
                  />
                </div>
              ) : null}
            </div>
          </Card>
        ) : null}

        <div className="mt-8">
          <PremiumReportView report={report} locale={locale} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {publicReportPath ? (
            <Link href={publicReportPath} target="_blank">
              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                <ExternalLink className="h-4 w-4" /> {copy.viewPage}
              </Button>
            </Link>
          ) : (
          <form action={publishReportAction}>
            <input type="hidden" name="report_id" value={report.id} />
            <Button variant="outline" className="w-full gap-2 sm:w-auto" type="submit">
              <Share2 className="h-4 w-4" />
              {needsPublicLinkRepair ? copy.repairLink : copy.publishLink}
            </Button>
          </form>
          )}
          <GenerateIllustrationsButton
            reportId={report.id}
            hasIllustrations={Boolean(report.illustration_urls?.length)}
          />
          <a href={`/api/pdf/premium?reportId=${report.id}`}>
            <Button className="w-full gap-2 sm:w-auto">
              <Download className="h-4 w-4" /> {copy.premiumPdf}
            </Button>
          </a>
          <a href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
          </a>
          <Link href="/">
            <Button variant="ghost">{copy.backHome}</Button>
          </Link>
        </div>
      </section>
      {showPublishedModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-gold/30 bg-noir">
            <h2 className="font-display text-3xl text-cream">{copy.modalTitle}</h2>
            <p className="mt-3 break-all text-sm leading-6 text-gold-light">{publishedUrl}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={publicReportPath ?? "#"} target="_blank">
                <Button className="w-full gap-2 sm:w-auto">
                  <ExternalLink className="h-4 w-4" /> {copy.viewPage}
                </Button>
              </Link>
              <UnpublishReportForm
                reportId={report.id}
                variant="outline"
                labels={{
                  trigger: copy.unpublish,
                  title: copy.unpublishTitle,
                  description: copy.unpublishDescription,
                  cancel: copy.close,
                  confirm: copy.unpublishConfirm,
                  pending: copy.unpublishPending
                }}
              />
              <Link href={`/report/${report.id}`}>
                <Button variant="ghost" className="w-full sm:w-auto">{copy.close}</Button>
              </Link>
            </div>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
