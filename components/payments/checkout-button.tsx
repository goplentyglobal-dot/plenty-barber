"use client";

import { useState, useTransition } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import type { PaymentPlanKey } from "@/lib/payments/plans";

const copyByLocale = {
  es: {
    pending: "Abriendo checkout...",
    openingTitle: "Abriendo checkout",
    openingText: "Te llevaremos a la pasarela segura para completar el pago.",
    errorTitle: "No se pudo iniciar el pago",
    errorText: "No se pudo iniciar el pago."
  },
  en: {
    pending: "Opening checkout...",
    openingTitle: "Opening checkout",
    openingText: "We will take you to the secure payment provider to complete the purchase.",
    errorTitle: "Unable to start payment",
    errorText: "Unable to start payment."
  },
  pt: {
    pending: "Abrindo checkout...",
    openingTitle: "Abrindo checkout",
    openingText: "Vamos levar voce para a passarela segura para concluir o pagamento.",
    errorTitle: "Nao foi possivel iniciar o pagamento",
    errorText: "Nao foi possivel iniciar o pagamento."
  }
} as const;

type LocaleKey = keyof typeof copyByLocale;

export function CheckoutButton({
  plan,
  label = "Comprar",
  variant = "gold",
  className
}: {
  plan: PaymentPlanKey;
  label?: string;
  variant?: "gold" | "outline" | "ghost";
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const locale = getClientLocale();
  const copy = copyByLocale[locale];

  function startCheckout() {
    setError("");
    showToast({ type: "info", title: copy.openingTitle, description: copy.openingText });
    startTransition(async () => {
      try {
        const origin = window.location.origin;
        const response = await fetch("/api/payments/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            successUrl: `${origin}/dashboard/credits?checkout=success`,
            cancelUrl: `${origin}/dashboard/credits?checkout=cancelled`
          })
        });
        const payload = (await response.json().catch(() => null)) as { checkoutUrl?: string; error?: string } | null;

        if (!response.ok || !payload?.checkoutUrl) {
          const message = payload?.error || copy.errorText;
          setError(message);
          showToast({ type: "error", title: copy.errorTitle, description: message, persistent: true });
          return;
        }

        window.location.href = payload.checkoutUrl;
      } catch {
        setError(copy.errorText);
        showToast({ type: "error", title: copy.errorTitle, description: copy.errorText, persistent: true });
        return;
      }
    });
  }

  return (
    <div className="grid gap-2">
      <Button type="button" variant={variant} className={className} disabled={isPending} onClick={startCheckout}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {isPending ? copy.pending : label}
      </Button>
      {error ? <p className="text-xs leading-5 text-red-100/80">{error}</p> : null}
    </div>
  );
}

function getClientLocale(): LocaleKey {
  const locale = document.documentElement.lang;
  return locale === "en" || locale === "pt" ? locale : "es";
}
