import type { Locale } from "@/lib/i18n/config";

const dateLocales: Record<Locale, string> = {
  es: "es-CO",
  en: "en-US",
  pt: "pt-BR"
};

export function formatShortDate(value: string | null | undefined, locale: Locale = "es") {
  if (!value) {
    return locale === "en" ? "No date" : locale === "pt" ? "Sem data" : "Sin fecha";
  }

  return new Intl.DateTimeFormat(dateLocales[locale], {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}
