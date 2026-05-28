import { UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const copyByLocale = {
  es: {
    eyebrow: "Equipo",
    title: "Equipo del negocio",
    description: "Gestiona estilistas, operadores y propietarios a medida que la cuenta crece.",
    invite: "Invitar estilista",
    coming: "El acceso de equipo viene despues",
    text: "La gestion de roles de propietario y operador quedara conectada en una fase posterior."
  },
  en: {
    eyebrow: "Team",
    title: "Business team",
    description: "Manage stylists, operators and owners as the account grows.",
    invite: "Invite stylist",
    coming: "Team access comes next",
    text: "Owner and operator role management will be wired in a later phase."
  },
  pt: {
    eyebrow: "Equipe",
    title: "Equipe do negocio",
    description: "Gerencie estilistas, operadores e proprietarios conforme a conta cresce.",
    invite: "Convidar estilista",
    coming: "O acesso da equipe vem depois",
    text: "A gestao de funcoes de proprietario e operador sera conectada em uma fase posterior."
  }
} satisfies Record<Locale, Record<string, string>>;

export default function TeamPage() {
  const locale = getLocale();
  const copy = copyByLocale[locale];

  return (
    <DashboardShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={
        <Button disabled>{copy.invite}</Button>
        }
      />
      <Card className="mt-8 grid min-h-80 place-items-center text-center">
        <div>
          <UsersRound className="mx-auto h-10 w-10 text-gold" />
          <h2 className="mt-5 font-display text-2xl text-cream">{copy.coming}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-cream/62">
            {copy.text}
          </p>
        </div>
      </Card>
    </DashboardShell>
  );
}
