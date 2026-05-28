"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

const copyByLocale = {
  es: {
    idle: "Generar informe",
    pending: "Generando informe..."
  },
  en: {
    idle: "Generate report",
    pending: "Generating report..."
  },
  pt: {
    idle: "Gerar relatorio",
    pending: "Gerando relatorio..."
  }
} as const;

export function GenerateReportSubmit({
  disabled,
  locale = "es"
}: {
  disabled?: boolean;
  locale?: keyof typeof copyByLocale;
}) {
  const { pending } = useFormStatus();
  const copy = copyByLocale[locale] ?? copyByLocale.es;

  return (
    <Button type="submit" disabled={disabled || pending} className="gap-2">
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {pending ? copy.pending : copy.idle}
    </Button>
  );
}
