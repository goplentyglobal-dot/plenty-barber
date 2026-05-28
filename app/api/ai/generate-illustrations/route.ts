import { NextResponse } from "next/server";
import { z } from "zod";
import { reportSchema } from "@/lib/ai/validators/report-schema";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { generateStyleIllustrations } from "@/lib/ai/illustrations/generate";
import { getReportForBusiness, updateReportIllustrations } from "@/lib/database/reports";
import { getLocale } from "@/lib/i18n/server";
import { uploadReportIllustrations } from "@/lib/storage/report-assets";

const requestSchema = z.object({
  reportId: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const businessUser = await requireCurrentBusinessUser();
    const locale = getLocale();
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid illustration request." }, { status: 400 });
    }

    const report = await getReportForBusiness(parsed.data.reportId, businessUser.business_id);

    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const reportJson = reportSchema.parse(report.report_json);
    const illustrations = await generateStyleIllustrations({
      report: reportJson,
      locale: reportJson.idioma || locale,
      referenceImageUrls: report.photo_urls?.filter(Boolean) ?? []
    });
    const illustrationUrls = await uploadReportIllustrations({
      businessId: businessUser.business_id,
      urls: illustrations.urls
    });

    await updateReportIllustrations({
      reportId: report.id,
      businessId: businessUser.business_id,
      illustrationUrls,
      imageProvider: illustrations.provider
    });

    return NextResponse.json({
      provider: illustrations.provider,
      model: illustrations.model,
      urls: illustrationUrls
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate illustrations.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
