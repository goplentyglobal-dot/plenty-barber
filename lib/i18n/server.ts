import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function getLocale(): Locale {
  const cookieLocale = cookies().get("pb_locale")?.value;
  return isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

export function getDictionary(locale = getLocale()) {
  return dictionaries[locale];
}
