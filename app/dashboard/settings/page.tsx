import { Building2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { SettingsForm } from "@/components/settings/settings-form";
import { Card } from "@/components/ui/card";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { getBusinessById } from "@/lib/database/businesses";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const copyByLocale = {
  es: {
    eyebrow: "Ajustes",
    title: "Configuracion del negocio",
    description: "Prepara marca, contacto y datos publicos para la experiencia del informe.",
    profile: "Perfil del negocio",
    name: "Nombre del negocio",
    phone: "Telefono del negocio",
    logo: "URL del logo",
    save: "Guardar ajustes",
    saving: "Guardando ajustes..."
  },
  en: {
    eyebrow: "Settings",
    title: "Business settings",
    description: "Prepare brand, contact and public-facing business details for the report experience.",
    profile: "Business profile",
    name: "Business name",
    phone: "Business phone",
    logo: "Logo URL",
    save: "Save settings",
    saving: "Saving settings..."
  },
  pt: {
    eyebrow: "Ajustes",
    title: "Configuracoes do negocio",
    description: "Prepare marca, contato e dados publicos para a experiencia do relatorio.",
    profile: "Perfil do negocio",
    name: "Nome do negocio",
    phone: "Telefone do negocio",
    logo: "URL do logo",
    save: "Salvar ajustes",
    saving: "Salvando ajustes..."
  }
} satisfies Record<Locale, Record<string, string>>;

export default async function SettingsPage() {
  const locale = getLocale();
  const copy = copyByLocale[locale];
  const businessUser = await requireCurrentBusinessUser();
  const business = await getBusinessById(businessUser.business_id);

  return (
    <DashboardShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Card className="mt-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl text-cream">{copy.profile}</h2>
        </div>
        <SettingsForm business={business} copy={copy} />
      </Card>
    </DashboardShell>
  );
}
