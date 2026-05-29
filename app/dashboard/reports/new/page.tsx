import { ImagePlus, UserPlus } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { GenerateReportSubmit } from "@/components/reports/generate-report-submit";
import { NewReportForm } from "@/components/reports/new-report-form";
import { PhotoUploader } from "@/components/reports/photo-uploader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createReport } from "@/app/dashboard/reports/new/actions";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { listClients } from "@/lib/database/clients";
import { getBusinessById } from "@/lib/database/businesses";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

const copyByLocale = {
  es: {
    eyebrow: "Nuevo informe",
    title: "Crear informe de visagismo",
    description:
      "Selecciona o crea un cliente, sube una foto clara y genera un informe premium listo para web, PDF y WhatsApp.",
    noCreditsTitle: "No tienes creditos suficientes",
    noCreditsText: "Recarga creditos antes de generar un nuevo informe.",
    client: "Cliente",
    existingClient: "Cliente existente",
    createNewClient: "Crear cliente nuevo aqui",
    newClientName: "Nombre del nuevo cliente",
    phone: "Telefono o WhatsApp",
    email: "Correo",
    photos: "Fotos",
    uploadPhoto: "Subir foto",
    uploadHelp: "Sube de 1 a 3 fotos claras en JPG, PNG o WebP.",
    takePhoto: "Tomar foto",
    takePhotoHelp: "Camara del celular o selector en PC.",
    galleryHelp: "Galeria o archivos, maximo 3."
  },
  en: {
    eyebrow: "New report",
    title: "Create a visagism report",
    description:
      "Select or create a client, upload a clear photo and generate a premium report ready for web, PDF and WhatsApp delivery.",
    noCreditsTitle: "Not enough credits",
    noCreditsText: "Add credits before generating a new report.",
    client: "Client",
    existingClient: "Existing client",
    createNewClient: "Create new client inline",
    newClientName: "New client name",
    phone: "Phone or WhatsApp",
    email: "Email",
    photos: "Photos",
    uploadPhoto: "Upload photo",
    uploadHelp: "Upload 1 to 3 clear JPG, PNG or WebP photos.",
    takePhoto: "Take photo",
    takePhotoHelp: "Phone camera or desktop picker.",
    galleryHelp: "Gallery or files, maximum 3."
  },
  pt: {
    eyebrow: "Novo relatorio",
    title: "Criar relatorio de visagismo",
    description:
      "Selecione ou crie um cliente, envie uma foto clara e gere um relatorio premium pronto para web, PDF e WhatsApp.",
    noCreditsTitle: "Creditos insuficientes",
    noCreditsText: "Recarregue creditos antes de gerar um novo relatorio.",
    client: "Cliente",
    existingClient: "Cliente existente",
    createNewClient: "Criar novo cliente aqui",
    newClientName: "Nome do novo cliente",
    phone: "Telefone ou WhatsApp",
    email: "Email",
    photos: "Fotos",
    uploadPhoto: "Enviar foto",
    uploadHelp: "Envie de 1 a 3 fotos claras em JPG, PNG ou WebP.",
    takePhoto: "Tirar foto",
    takePhotoHelp: "Camera do celular ou seletor no computador.",
    galleryHelp: "Galeria ou arquivos, maximo 3."
  }
} satisfies Record<Locale, Record<string, string>>;

export const dynamic = "force-dynamic";

export default async function NewReportPage() {
  const businessUser = await requireCurrentBusinessUser();
  const locale = getLocale();
  const [clients, business] = await Promise.all([
    listClients(businessUser.business_id),
    getBusinessById(businessUser.business_id)
  ]);
  const hasCredits = business.credits_remaining > 0;
  const maxUploadMb = Number(process.env.MAX_UPLOAD_IMAGE_MB || 10);
  const copy = copyByLocale[locale];

  return (
    <DashboardShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      {!hasCredits ? (
        <Card className="mt-8 border-red-400/30 bg-red-500/10">
          <h2 className="font-display text-2xl text-red-100">{copy.noCreditsTitle}</h2>
          <p className="mt-3 text-sm text-red-100/78">
            {copy.noCreditsText}
          </p>
        </Card>
      ) : null}

      <NewReportForm action={createReport} locale={locale} maxUploadMb={maxUploadMb}>
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                <UserPlus className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl text-cream">{copy.client}</h2>
            </div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm text-cream/72">
                {copy.existingClient}
                <select
                  name="client_id"
                  className="min-h-12 rounded-full border border-white/10 bg-noir px-4 text-cream outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/15"
                  defaultValue=""
                >
                  <option value="">{copy.createNewClient}</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                name="full_name"
                placeholder={copy.newClientName}
              />
              <Input
                name="phone"
                placeholder={copy.phone}
              />
              <Input
                name="email"
                type="email"
                placeholder={copy.email}
              />
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                <ImagePlus className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl text-cream">{copy.photos}</h2>
            </div>
            <PhotoUploader locale={locale} />
          </Card>
        </div>
        <div className="mt-6 flex justify-end">
          <GenerateReportSubmit disabled={!hasCredits} locale={locale} />
        </div>
      </NewReportForm>
    </DashboardShell>
  );
}
