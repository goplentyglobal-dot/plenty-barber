import { NextResponse } from "next/server";
import { createReportPdf } from "@/lib/pdf/simple-report-pdf";
import { getReportById } from "@/lib/database/reports";
import { getCurrentBusinessUser } from "@/lib/auth/current-user";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reportId = url.searchParams.get("reportId");

  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId." }, { status: 400 });
  }

  const report = await getReportById(reportId);

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  if (!report.is_public) {
    const businessUser = await getCurrentBusinessUser();

    if (!businessUser || businessUser.business_id !== report.business_id) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }
  }

  const pdf = createReportPdf(report);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="plenty-barber-${report.id}.pdf"`
    }
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { reportId?: string } | null;

  if (!body?.reportId) {
    return NextResponse.json({ error: "Missing reportId." }, { status: 400 });
  }

  const report = await getReportById(body.reportId);

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  if (!report.is_public) {
    const businessUser = await getCurrentBusinessUser();

    if (!businessUser || businessUser.business_id !== report.business_id) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }
  }

  return NextResponse.json({
    downloadUrl: `/api/pdf/generate?reportId=${encodeURIComponent(report.id)}`
  });
}
