import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Flame, OctagonAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CreditHealthState = "healthy" | "attention" | "critical" | "exhausted";

type CreditHealthLabels = Record<
  CreditHealthState,
  {
    title: string;
    text: string;
  }
> & {
  cta: string;
};

const stateStyles: Record<CreditHealthState, { card: string; icon: string; Icon: typeof CheckCircle2 }> = {
  healthy: {
    card: "border-emerald-400/25 bg-emerald-500/8",
    icon: "border-emerald-300/25 bg-emerald-500/10 text-emerald-100",
    Icon: CheckCircle2
  },
  attention: {
    card: "border-gold/30 bg-gold/10",
    icon: "border-gold/30 bg-gold/10 text-gold-light",
    Icon: AlertTriangle
  },
  critical: {
    card: "border-orange-300/30 bg-orange-500/10",
    icon: "border-orange-300/30 bg-orange-500/10 text-orange-100",
    Icon: Flame
  },
  exhausted: {
    card: "border-red-400/35 bg-red-500/10",
    icon: "border-red-400/35 bg-red-500/10 text-red-100",
    Icon: OctagonAlert
  }
};

export function CreditHealthCard({
  credits,
  labels
}: {
  credits: number;
  labels: CreditHealthLabels;
}) {
  const state = getCreditHealthState(credits);
  const style = stateStyles[state];
  const Icon = style.Icon;

  return (
    <Card className={`mt-6 ${style.card}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${style.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-cream">{labels[state].title}</h2>
            <p className="mt-1 text-sm leading-6 text-cream/64">{labels[state].text}</p>
          </div>
        </div>
        <Link href="/dashboard/credits">
          <Button variant={state === "healthy" ? "outline" : "gold"} className="gap-2">
            {labels.cta} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export function getCreditHealthState(credits: number): CreditHealthState {
  if (credits <= 4) {
    return "exhausted";
  }

  if (credits <= 19) {
    return "critical";
  }

  if (credits <= 50) {
    return "attention";
  }

  return "healthy";
}
