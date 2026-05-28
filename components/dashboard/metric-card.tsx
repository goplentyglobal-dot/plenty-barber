import { Card } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon?: React.ReactNode;
};

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gold/10" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-cream/58">{label}</p>
          <p className="mt-3 font-display text-4xl text-cream">{value}</p>
          <p className="mt-2 text-sm text-gold-light/72">{detail}</p>
        </div>
        {icon ? (
          <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
