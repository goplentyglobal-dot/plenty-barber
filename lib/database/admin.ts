import "server-only";
import { demoBusiness, demoReports } from "@/lib/demo/data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabasePublicEnv } from "@/lib/validations/env";

export type AdminOverview = {
  activeBusinesses: number;
  generationsThisMonth: number;
  aiCostUsd: number;
  lowCreditBusinesses: Array<{ id: string; name: string; credits_remaining: number }>;
  recentAiLogs: Array<{
    id: string;
    provider: string | null;
    model: string | null;
    status: string | null;
    cost_usd: number | null;
    created_at: string;
  }>;
};

export async function getAdminOverview(): Promise<AdminOverview> {
  if (!hasSupabasePublicEnv()) {
    return {
      activeBusinesses: 1,
      generationsThisMonth: demoReports.length,
      aiCostUsd: 0,
      lowCreditBusinesses:
        demoBusiness.credits_remaining <= demoBusiness.credits_alert_threshold
          ? [{ id: demoBusiness.id, name: demoBusiness.name, credits_remaining: demoBusiness.credits_remaining }]
          : [],
      recentAiLogs: [
        {
          id: "demo-ai-log",
          provider: "demo",
          model: "development-placeholder",
          status: "done",
          cost_usd: 0,
          created_at: new Date().toISOString()
        }
      ]
    };
  }

  const supabase = createSupabaseAdminClient();
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [businesses, generations, aiLogs, lowCredits] = await Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("active", true),
    supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString()),
    supabase.from("ai_logs").select("id,provider,model,status,cost_usd,created_at").order("created_at", { ascending: false }).limit(10),
    supabase
      .from("businesses")
      .select("id,name,credits_remaining")
      .eq("active", true)
      .lte("credits_remaining", 10)
      .order("credits_remaining", { ascending: true })
      .limit(10)
  ]);

  const aiCostUsd =
    aiLogs.data?.reduce((sum, log) => sum + (typeof log.cost_usd === "number" ? log.cost_usd : 0), 0) ?? 0;

  return {
    activeBusinesses: businesses.count ?? 0,
    generationsThisMonth: generations.count ?? 0,
    aiCostUsd,
    lowCreditBusinesses: lowCredits.data ?? [],
    recentAiLogs: aiLogs.data ?? []
  };
}
