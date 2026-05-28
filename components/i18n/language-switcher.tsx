"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions/locale";
import { locales, type Locale } from "@/lib/i18n/config";
import { useToast } from "@/components/ui/toast-provider";

const labels: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT"
};

const copyByLocale: Record<Locale, { title: string; description: string }> = {
  es: { title: "Idioma actualizado", description: "La interfaz esta ahora en espanol." },
  en: { title: "Language updated", description: "The interface is now in English." },
  pt: { title: "Idioma atualizado", description: "A interface agora esta em portugues." }
};

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function changeLocale(locale: Locale) {
    if (locale === currentLocale || isPending) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("locale", locale);
      await setLocale(formData);
      showToast({ type: "success", title: copyByLocale[locale].title, description: copyByLocale[locale].description });
      router.refresh();
    });
  }

  return (
    <div className="flex rounded-md border border-white/10 p-1" aria-label="Language selector">
      {locales.map((locale) => (
        <button
          key={locale}
          type="submit"
          disabled={isPending}
          onClick={() => changeLocale(locale)}
          className={
            locale === currentLocale
              ? "rounded bg-gold px-2 py-1 text-xs font-semibold text-noir"
              : "rounded px-2 py-1 text-xs font-semibold text-cream/62 hover:text-gold-light disabled:opacity-60"
          }
        >
          {labels[locale]}
        </button>
      ))}
    </div>
  );
}
