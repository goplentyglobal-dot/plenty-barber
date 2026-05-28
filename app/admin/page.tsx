import { Building2, Coins, Cpu, DollarSign, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";
import { requireSuperAdmin } from "@/lib/auth/current-user";
import { getAdminOverview } from "@/lib/database/admin";
import { formatShortDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireSuperAdmin();
  const overview = await getAdminOverview();

  return (
    <DashboardShell requireBusinessUser={false}>
      <PageHeading
        eyebrow="Admin"
        title="GoPlenty Global control room"
        description="Monitor businesses, credits, report generation and AI cost from one protected workspace."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <MetricCard label="MRR" value="$0" detail="Payment provider pending" icon={<DollarSign className="h-5 w-5" />} />
        <MetricCard label="Businesses" value={String(overview.activeBusinesses)} detail="Active accounts" icon={<Building2 className="h-5 w-5" />} />
        <MetricCard label="Generations" value={String(overview.generationsThisMonth)} detail="This month" icon={<Sparkles className="h-5 w-5" />} />
        <MetricCard label="AI cost" value={`$${overview.aiCostUsd.toFixed(2)}`} detail="Recent logged cost" icon={<Cpu className="h-5 w-5" />} />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
              <Coins className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl">Low credit businesses</h2>
          </div>
          {overview.lowCreditBusinesses.length ? (
            <div className="mt-5 grid gap-3">
              {overview.lowCreditBusinesses.map((business) => (
                <div key={business.id} className="flex justify-between rounded-lg border border-white/10 bg-noir/70 p-4">
                  <span>{business.name}</span>
                  <span className="text-gold-light">{business.credits_remaining} credits</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-cream/62">No low-credit businesses.</p>
          )}
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl">Recent AI logs</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {overview.recentAiLogs.map((log) => (
              <div key={log.id} className="rounded-lg border border-white/10 bg-noir/70 p-4">
                <div className="flex justify-between gap-4">
                  <span className="text-cream">{log.provider || "provider"} / {log.model || "model"}</span>
                  <span className="text-gold-light">{log.status || "pending"}</span>
                </div>
                <p className="mt-2 text-sm text-cream/52">
                  {formatShortDate(log.created_at)} - ${Number(log.cost_usd || 0).toFixed(4)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
