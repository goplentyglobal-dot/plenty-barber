"use client";

import { useState, useTransition } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

const copyByLocale = {
  es: {
    pending: "Generando...",
    regenerate: "Regenerar simulaciones",
    generate: "Simular peinados",
    startTitle: "Simulando peinados",
    startText: "Estamos creando previews visuales sobre la foto del cliente cuando la IA lo permite.",
    successTitle: "Simulaciones listas",
    successText: "El informe se actualizara con la nueva galeria visual.",
    errorTitle: "No se pudieron generar las simulaciones",
    errorText: "No se pudieron generar las simulaciones."
  },
  en: {
    pending: "Generating...",
    regenerate: "Regenerate simulations",
    generate: "Simulate hairstyles",
    startTitle: "Simulating hairstyles",
    startText: "We are creating visual previews on the client photo when the AI allows it.",
    successTitle: "Simulations ready",
    successText: "The report will refresh with the new visual gallery.",
    errorTitle: "Unable to generate simulations",
    errorText: "Unable to generate simulations."
  },
  pt: {
    pending: "Gerando...",
    regenerate: "Regenerar simulacoes",
    generate: "Simular penteados",
    startTitle: "Simulando penteados",
    startText: "Estamos criando previews visuais sobre a foto do cliente quando a IA permite.",
    successTitle: "Simulacoes prontas",
    successText: "O relatorio sera atualizado com a nova galeria visual.",
    errorTitle: "Nao foi possivel gerar as simulacoes",
    errorText: "Nao foi possivel gerar as simulacoes."
  }
} as const;

type LocaleKey = keyof typeof copyByLocale;

export function GenerateIllustrationsButton({
  reportId,
  hasIllustrations
}: {
  reportId: string;
  hasIllustrations: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const copy = copyByLocale[getClientLocale()];

  function generate() {
    setError("");
    showToast({ type: "info", title: copy.startTitle, description: copy.startText });
    startTransition(async () => {
      try {
        const response = await fetch("/api/ai/generate-illustrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId })
        });
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;

        if (!response.ok) {
          const message = payload?.error || copy.errorText;
          setError(message);
          showToast({ type: "error", title: copy.errorTitle, description: message, persistent: true });
          return;
        }

        showToast({ type: "success", title: copy.successTitle, description: copy.successText });
        window.location.reload();
      } catch {
        setError(copy.errorText);
        showToast({ type: "error", title: copy.errorTitle, description: copy.errorText, persistent: true });
        return;
      }
    });
  }

  return (
    <div className="grid gap-2">
      <Button type="button" variant="outline" className="w-full gap-2 sm:w-auto" disabled={isPending} onClick={generate}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {isPending ? copy.pending : hasIllustrations ? copy.regenerate : copy.generate}
      </Button>
      {error ? <p className="text-xs text-red-100/80">{error}</p> : null}
    </div>
  );
}

function getClientLocale(): LocaleKey {
  const locale = document.documentElement.lang;
  return locale === "en" || locale === "pt" ? locale : "es";
}
