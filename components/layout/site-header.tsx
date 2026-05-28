import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { getDictionary, getLocale } from "@/lib/i18n/server";

export function SiteHeader() {
  const locale = getLocale();
  const dictionary = getDictionary(locale);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-noir/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <BrandLogo />
        <nav className="hidden items-center gap-3 text-sm text-cream/72 md:flex">
          <Link
            href="/pricing"
            className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-gold-light"
          >
            {dictionary.nav.pricing}
          </Link>
          <LanguageSwitcher currentLocale={locale} />
          <Link
            href="/dashboard"
            className="rounded-full border border-gold/30 px-4 py-2 font-medium text-cream transition hover:border-gold/60 hover:bg-gold/10"
          >
            {dictionary.nav.dashboard}
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-gold px-5 py-2 font-semibold text-noir shadow-gold transition hover:bg-gold-light"
          >
            {dictionary.nav.login}
          </Link>
        </nav>
        <Link
          href="/login"
          className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-noir shadow-gold transition hover:bg-gold-light md:hidden"
        >
          {dictionary.nav.login}
        </Link>
      </div>
    </header>
  );
}
