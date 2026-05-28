import { Download, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { PremiumReportView } from "@/components/reports/premium-report-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getReportByPublicToken } from "@/lib/database/reports";
import type { Locale } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import { env } from "@/lib/validations/env";

export const dynamic = "force-dynamic";

const pageCopy = {
  es: {
    unavailableTitle: "Informe no disponible",
    unavailableText: "Este enlace publico esta inactivo o expiro.",
    pdf: "PDF",
    whatsappClient: "cliente",
    whatsappMessage: "Hola {name}, aqui tienes tu informe personalizado de visagismo: {url}",
    footer: "Creado con Plenty Barber"
  },
  en: {
    unavailableTitle: "Report unavailable",
    unavailableText: "This public link is inactive or has expired.",
    pdf: "PDF",
    whatsappClient: "client",
    whatsappMessage: "Hi {name}, here is your personalized visagism report: {url}",
    footer: "Created with Plenty Barber"
  },
  pt: {
    unavailableTitle: "Relatorio indisponivel",
    unavailableText: "Este link publico esta inativo ou expirou.",
    pdf: "PDF",
    whatsappClient: "cliente",
    whatsappMessage: "Ola {name}, aqui esta seu relatorio personalizado de visagismo: {url}",
    footer: "Criado com Plenty Barber"
  }
} satisfies Record<Locale, Record<string, string>>;

export default async function PublicTokenReportPage({ params }: { params: { token: string } }) {
  const locale = getLocale();
  const copy = pageCopy[locale];
  const report = await getReportByPublicToken(params.token);

  if (!report) {
    return (
      <main className="min-h-screen px-5 py-10">
        <div className="mx-auto mb-8 max-w-5xl">
          <BrandLogo />
        </div>
        <Card className="mx-auto grid min-h-80 max-w-5xl place-items-center text-center">
          <div>
            <h1 className="font-display text-3xl text-cream">{copy.unavailableTitle}</h1>
            <p className="mt-3 text-sm text-cream/62">{copy.unavailableText}</p>
          </div>
        </Card>
      </main>
    );
  }

  const publicUrl = `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/r/${params.token}`;
  const whatsappName = report.end_clients?.full_name || copy.whatsappClient;
  const whatsappMessage = copy.whatsappMessage.replace("{name}", whatsappName).replace("{url}", publicUrl);

  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <BrandLogo />
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={`/api/pdf/premium?reportId=${report.id}`}>
            <Button className="w-full gap-2 sm:w-auto">
              <Download className="h-4 w-4" /> {copy.pdf}
            </Button>
          </a>
          <a href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
          </a>
        </div>
      </div>
      <section className="mx-auto max-w-6xl">
        <PremiumReportView report={report} locale={locale} />
      </section>
      <footer className="mx-auto max-w-6xl py-8 text-center text-xs text-cream/42">
        {copy.footer}
      </footer>
    </main>
  );
}
