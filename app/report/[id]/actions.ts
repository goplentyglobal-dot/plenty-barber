"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { publishReport, unpublishReport } from "@/lib/database/reports";

export async function publishReportAction(formData: FormData) {
  const businessUser = await requireCurrentBusinessUser();
  const reportId = String(formData.get("report_id") ?? "");

  if (!reportId) {
    throw new Error("Missing report id.");
  }

  const token = await publishReport(reportId, businessUser.business_id);
  revalidatePath(`/report/${reportId}`);
  revalidatePath(`/r/${token}`);
  redirect(`/report/${reportId}?published=${token}`);
}

export async function unpublishReportAction(formData: FormData) {
  const businessUser = await requireCurrentBusinessUser();
  const reportId = String(formData.get("report_id") ?? "");

  if (!reportId) {
    throw new Error("Missing report id.");
  }

  await unpublishReport(reportId, businessUser.business_id);
  revalidatePath(`/report/${reportId}`);
  redirect(`/report/${reportId}`);
}
