export const locales = ["es", "en", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "es" || value === "en" || value === "pt";
}
