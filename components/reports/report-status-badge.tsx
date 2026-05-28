import { cn } from "@/lib/utils/cn";
import type { GenerationStatus } from "@/lib/database/types";
import type { Locale } from "@/lib/i18n/config";

const statusStyles: Record<GenerationStatus, string> = {
  pending: "border-white/20 text-cream/70",
  processing: "border-gold/35 bg-gold/10 text-gold-light",
  done: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  error: "border-red-400/30 bg-red-500/10 text-red-100"
};

const statusLabels = {
  es: {
    pending: "Pendiente",
    processing: "Procesando",
    done: "Listo",
    error: "Error"
  },
  en: {
    pending: "Pending",
    processing: "Processing",
    done: "Done",
    error: "Error"
  },
  pt: {
    pending: "Pendente",
    processing: "Processando",
    done: "Pronto",
    error: "Erro"
  }
} satisfies Record<Locale, Record<GenerationStatus, string>>;

export function ReportStatusBadge({ status, locale = "es" }: { status: GenerationStatus; locale?: Locale }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center justify-center rounded-full border px-3 text-xs font-semibold",
        statusStyles[status]
      )}
    >
      {statusLabels[locale][status]}
    </span>
  );
}
