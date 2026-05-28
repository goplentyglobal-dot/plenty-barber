import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  Sparkles,
  Users,
  UsersRound
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { BrandLogo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { getCurrentAppRole, getSessionUser, requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

const navItems = [
  { href: "/dashboard", labelKey: "overview", icon: LayoutDashboard },
  { href: "/dashboard/reports", labelKey: "reports", icon: FileText },
  { href: "/dashboard/clients", labelKey: "clients", icon: Users },
  { href: "/dashboard/credits", labelKey: "credits", icon: CreditCard },
  { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
  { href: "/dashboard/team", labelKey: "team", icon: UsersRound }
] as const;

const dashboardCopy = {
  es: {
    nav: {
      overview: "Resumen",
      reports: "Informes",
      clients: "Clientes",
      credits: "Creditos",
      settings: "Ajustes",
      team: "Equipo"
    },
    active: "Activo",
    consoleTitle: "Consola Plenty",
    consoleSubtitle: "Espacio premium",
    eyebrow: "Plenty Barber",
    subtitle: "Workspace premium de visagismo",
    live: "Dashboard activo"
  },
  en: {
    nav: {
      overview: "Overview",
      reports: "Reports",
      clients: "Clients",
      credits: "Credits",
      settings: "Settings",
      team: "Team"
    },
    active: "Active",
    consoleTitle: "Plenty Console",
    consoleSubtitle: "Premium workspace",
    eyebrow: "Plenty Barber",
    subtitle: "Luxury visagism workspace",
    live: "Live dashboard"
  },
  pt: {
    nav: {
      overview: "Resumo",
      reports: "Relatorios",
      clients: "Clientes",
      credits: "Creditos",
      settings: "Ajustes",
      team: "Equipe"
    },
    active: "Ativo",
    consoleTitle: "Console Plenty",
    consoleSubtitle: "Espaco premium",
    eyebrow: "Plenty Barber",
    subtitle: "Workspace premium de visagismo",
    live: "Dashboard ativo"
  }
} satisfies Record<Locale, {
  nav: Record<(typeof navItems)[number]["labelKey"], string>;
  active: string;
  consoleTitle: string;
  consoleSubtitle: string;
  eyebrow: string;
  subtitle: string;
  live: string;
}>;

export async function DashboardShell({
  children,
  requireBusinessUser = true
}: {
  children: React.ReactNode;
  requireBusinessUser?: boolean;
}) {
  const locale = getLocale();
  const copy = dashboardCopy[locale];
  const businessUser = requireBusinessUser ? await requireCurrentBusinessUser() : null;
  const role = await getCurrentAppRole();
  const sessionUser = await getSessionUser();
  const avatarUrl =
    sessionUser && "user_metadata" in sessionUser ? String(sessionUser.user_metadata?.avatar_url || "") : "";
  const displayName = businessUser?.full_name || sessionUser?.email || "Plenty user";
  const initials = getInitials(displayName);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0A0A0A,#141414_48%,#0A0A0A)] text-cream">
      <aside className="fixed inset-y-0 left-0 hidden w-80 border-r border-white/10 bg-noir/95 p-5 shadow-[20px_0_80px_rgba(0,0,0,0.35)] lg:block">
        <div className="flex h-full flex-col">
          <div className="rounded-lg border border-gold/15 bg-white/[0.025] p-4">
            <BrandLogo />
          </div>

          <div className="mt-5 rounded-lg border border-gold/20 bg-[linear-gradient(135deg,rgba(201,168,76,0.14),rgba(255,255,255,0.03))] p-4">
            <div className="flex items-center gap-3">
              <UserAvatar avatarUrl={avatarUrl} initials={initials} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-cream">{displayName}</p>
                <p className="mt-1 truncate text-xs text-cream/54">{businessUser?.email || sessionUser?.email}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-full border border-white/10 bg-noir/55 px-3 py-2">
              <span className="flex items-center gap-2 text-xs capitalize text-gold-light">
                <Sparkles className="h-3.5 w-3.5" />
                {businessUser?.role || role || "member"}
              </span>
              <span className="text-xs text-cream/42">{copy.active}</span>
            </div>
          </div>

          <nav className="mt-6 grid gap-1.5">
            {navItems.map((item) => (
              <DashboardNavLink key={item.href} href={item.href} label={copy.nav[item.labelKey]} icon={item.icon} />
            ))}
            {role === "super_admin" ? (
              <DashboardNavLink href="/admin" label="Admin" icon={Shield} />
            ) : null}
          </nav>

          <div className="mt-auto grid gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-center gap-3 rounded-lg bg-noir-soft/80 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-cream">{copy.consoleTitle}</p>
                <p className="text-xs text-cream/46">{copy.consoleSubtitle}</p>
              </div>
            </div>
            <LanguageSwitcher currentLocale={locale} />
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="lg:pl-80">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-noir/82 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <BrandLogo />
            <UserAvatar avatarUrl={avatarUrl} initials={initials} compact />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-cream/72"
                >
                  <Icon className="h-4 w-4 text-gold" />
                  {copy.nav[item.labelKey]}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
          <div className="mb-6 hidden items-center justify-between rounded-lg border border-white/10 bg-white/[0.025] px-5 py-4 lg:flex">
            <div>
              <p className="text-xs uppercase text-gold-light/70">{copy.eyebrow}</p>
              <p className="mt-1 text-sm text-cream/54">{copy.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher currentLocale={locale} />
              <span className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold-light">
                {copy.live}
              </span>
              <UserAvatar avatarUrl={avatarUrl} initials={initials} compact />
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function DashboardNavLink({
  href,
  label,
  icon: Icon
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-full px-4 py-3 text-sm text-cream/68 transition hover:bg-white/5 hover:text-cream"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-gold-light transition group-hover:border-gold/35 group-hover:bg-gold/10">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span>{label}</span>
    </Link>
  );
}

function UserAvatar({
  avatarUrl,
  initials,
  compact = false
}: {
  avatarUrl: string;
  initials: string;
  compact?: boolean;
}) {
  const size = compact ? "h-11 w-11" : "h-14 w-14";

  return (
    <div className={`${size} shrink-0 overflow-hidden rounded-full border border-gold/35 bg-gold/10`}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="User profile" className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center font-display text-sm font-semibold text-gold-light">
          {initials}
        </div>
      )}
    </div>
  );
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
