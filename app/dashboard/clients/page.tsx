import { Search, Users } from "lucide-react";
import { ClientCreateForm } from "@/components/clients/client-create-form";
import { ClientRowForm } from "@/components/clients/client-row-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { listClients } from "@/lib/database/clients";
import { formatShortDate } from "@/lib/utils/date";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const copyByLocale = {
  es: {
    eyebrow: "Clientes",
    title: "Libro de clientes",
    description: "Ten perfiles listos para asesoria de imagen, historial y entrega por WhatsApp.",
    createClient: "Crear cliente",
    fullName: "Nombre completo",
    phoneWhatsapp: "Telefono o WhatsApp",
    email: "Correo",
    notes: "Notas",
    creating: "Creando cliente...",
    clients: "Clientes",
    searchClients: "Buscar clientes",
    search: "Buscar",
    phone: "Telefono",
    created: "Creado",
    save: "Guardar",
    saving: "Guardando...",
    deleting: "Eliminando...",
    deleteClient: "Eliminar cliente",
    confirmDeleteTitle: "Eliminar cliente",
    confirmDeleteDescription: "Vas a eliminar a {name}. Esta accion no se puede deshacer.",
    cancel: "Cancelar",
    confirmDelete: "Confirmar eliminacion",
    noMatches: "Ningun cliente coincide con la busqueda",
    noClients: "Aun no hay clientes",
    noMatchesText: "Prueba con otro nombre, correo o telefono.",
    noClientsText: "Crea el primer cliente para empezar a construir historial de informes."
  },
  en: {
    eyebrow: "Clients",
    title: "Client book",
    description: "Keep client profiles ready for image consulting, history and WhatsApp delivery.",
    createClient: "Create client",
    fullName: "Full name",
    phoneWhatsapp: "Phone or WhatsApp",
    email: "Email",
    notes: "Notes",
    creating: "Creating client...",
    clients: "Clients",
    searchClients: "Search clients",
    search: "Search",
    phone: "Phone",
    created: "Created",
    save: "Save",
    saving: "Saving...",
    deleting: "Deleting...",
    deleteClient: "Delete client",
    confirmDeleteTitle: "Delete client",
    confirmDeleteDescription: "You are deleting {name}. This action cannot be undone.",
    cancel: "Cancel",
    confirmDelete: "Confirm deletion",
    noMatches: "No clients match your search",
    noClients: "No clients yet",
    noMatchesText: "Try another name, email or phone number.",
    noClientsText: "Create the first client to start building report history."
  },
  pt: {
    eyebrow: "Clientes",
    title: "Livro de clientes",
    description: "Mantenha perfis prontos para consultoria de imagem, historico e entrega por WhatsApp.",
    createClient: "Criar cliente",
    fullName: "Nome completo",
    phoneWhatsapp: "Telefone ou WhatsApp",
    email: "Email",
    notes: "Notas",
    creating: "Criando cliente...",
    clients: "Clientes",
    searchClients: "Buscar clientes",
    search: "Buscar",
    phone: "Telefone",
    created: "Criado",
    save: "Salvar",
    saving: "Salvando...",
    deleting: "Excluindo...",
    deleteClient: "Excluir cliente",
    confirmDeleteTitle: "Excluir cliente",
    confirmDeleteDescription: "Voce vai excluir {name}. Esta acao nao pode ser desfeita.",
    cancel: "Cancelar",
    confirmDelete: "Confirmar exclusao",
    noMatches: "Nenhum cliente corresponde a busca",
    noClients: "Ainda nao ha clientes",
    noMatchesText: "Tente outro nome, email ou telefone.",
    noClientsText: "Crie o primeiro cliente para comecar a construir historico de relatorios."
  }
} satisfies Record<Locale, Record<string, string>>;

export default async function ClientsPage({
  searchParams
}: {
  searchParams?: { q?: string };
}) {
  const locale = getLocale();
  const copy = copyByLocale[locale];
  const businessUser = await requireCurrentBusinessUser();
  const search = searchParams?.q?.trim() || "";
  const clients = await listClients(businessUser.business_id, search);

  return (
    <DashboardShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <Card className="mt-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl text-cream">{copy.createClient}</h2>
        </div>
        <ClientCreateForm copy={copy} />
      </Card>

      <section className="mt-8">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="font-display text-2xl text-cream">{copy.clients}</h2>
          <form className="flex min-w-0 gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-cream/38" />
              <Input
                name="q"
                defaultValue={search}
                placeholder={copy.searchClients}
                className="min-h-11 w-full pl-10"
              />
            </div>
            <Button type="submit" variant="outline">{copy.search}</Button>
          </form>
        </div>

        {clients.length ? (
          <div className="grid gap-3">
            {clients.map((client) => (
              <Card key={client.id} className="p-4">
                <ClientRowForm
                  client={client}
                  createdLabel={`${copy.created} ${formatShortDate(client.created_at, locale)}`}
                  copy={copy}
                />
              </Card>
            ))}
          </div>
        ) : (
          <Card className="grid min-h-80 place-items-center text-center">
            <div>
              <Users className="mx-auto h-10 w-10 text-gold" />
              <h2 className="mt-5 font-display text-2xl text-cream">
                {search ? copy.noMatches : copy.noClients}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-cream/62">
                {search
                  ? copy.noMatchesText
                  : copy.noClientsText}
              </p>
            </div>
          </Card>
        )}
      </section>
    </DashboardShell>
  );
}
