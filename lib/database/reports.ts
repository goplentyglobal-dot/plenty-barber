import "server-only";
import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ReportListItem } from "@/lib/database/types";
import { demoReports } from "@/lib/demo/data";
import { resolveReportAssetUrls } from "@/lib/storage/report-assets";
import { hasSupabasePublicEnv } from "@/lib/validations/env";

export async function getReportById(reportId: string) {
  if (!hasSupabasePublicEnv()) {
    return demoReports.find((report) => report.id === reportId) ?? demoReports[0] ?? null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("generations")
    .select("*, end_clients(full_name, phone, email), businesses(name, phone)")
    .eq("id", reportId)
    .single();

  if (error || !data) {
    return null;
  }

  return resolveReportAssetUrls(data as ReportListItem);
}

export async function getReportForBusiness(reportId: string, businessId: string) {
  if (!hasSupabasePublicEnv()) {
    return demoReports.find((report) => report.id === reportId) ?? demoReports[0] ?? null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("generations")
    .select("*, end_clients(full_name, phone, email), businesses(name, phone)")
    .eq("id", reportId)
    .eq("business_id", businessId)
    .single();

  if (error || !data) {
    return null;
  }

  return resolveReportAssetUrls(data as ReportListItem);
}

export async function getReportByPublicToken(publicToken: string) {
  if (!hasSupabasePublicEnv()) {
    return demoReports[0] ?? null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("generations")
    .select("*, end_clients(full_name, phone, email), businesses(name, phone)")
    .eq("public_token", publicToken)
    .eq("is_public", true)
    .single();

  if (error || !data) {
    return null;
  }

  await supabase
    .from("generations")
    .update({ views_count: (Number(data.views_count) || 0) + 1 })
    .eq("id", data.id);

  return resolveReportAssetUrls(data as ReportListItem);
}

export async function publishReport(reportId: string, businessId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: current } = await supabase
    .from("generations")
    .select("public_token")
    .eq("id", reportId)
    .eq("business_id", businessId)
    .single();
  const token = current?.public_token || crypto.randomBytes(12).toString("hex");
  const { data, error } = await supabase
    .from("generations")
    .update({
      public_token: token,
      is_public: true,
      published_at: new Date().toISOString()
    })
    .eq("id", reportId)
    .eq("business_id", businessId)
    .select("public_token")
    .single();

  if (error || !data) {
    throw new Error("Unable to publish report.");
  }

  return data.public_token as string;
}

export async function unpublishReport(reportId: string, businessId: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("generations")
    .update({
      is_public: false,
      public_expires_at: new Date().toISOString()
    })
    .eq("id", reportId)
    .eq("business_id", businessId);

  if (error) {
    throw new Error("Unable to unpublish report.");
  }
}

export async function updateReportIllustrations(input: {
  reportId: string;
  businessId: string;
  illustrationUrls: string[];
  imageProvider: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("generations")
    .update({
      illustration_urls: input.illustrationUrls,
      image_provider: input.imageProvider
    })
    .eq("id", input.reportId)
    .eq("business_id", input.businessId);

  if (error) {
    throw new Error("Unable to update report illustrations.");
  }
}

export async function listReports(businessId: string, limit = 50) {
  if (!hasSupabasePublicEnv()) {
    return demoReports.slice(0, limit);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("generations")
    .select("*, end_clients(full_name, phone, email), businesses(name, phone)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Unable to load reports.");
  }

  return Promise.all((data as ReportListItem[]).map(resolveReportAssetUrls));
}

export async function countReportsThisMonth(businessId: string) {
  if (!hasSupabasePublicEnv()) {
    return demoReports.length;
  }

  const supabase = createSupabaseAdminClient();
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", startOfMonth.toISOString());

  if (error) {
    throw new Error("Unable to count reports.");
  }

  return count ?? 0;
}
