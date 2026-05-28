import { NextResponse } from "next/server";
import { z } from "zod";
import { getBusinessById } from "@/lib/database/businesses";
import { getReportById } from "@/lib/database/reports";
import { createWhatsAppShareUrl } from "@/lib/whatsapp/create-share-url";

const requestSchema = z.object({
  reportId: z.string(),
  baseUrl: z.string().url()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid WhatsApp share request." }, { status: 400 });
  }

  const report = await getReportById(parsed.data.reportId);

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const business = await getBusinessById(report.business_id);
  const reportUrl = `${parsed.data.baseUrl.replace(/\/$/, "")}/report/${report.id}`;

  return NextResponse.json({
    shareUrl: createWhatsAppShareUrl({
      phone: report.end_clients?.phone,
      clientName: report.end_clients?.full_name || "cliente",
      businessName: business.name,
      reportUrl
    })
  });
}
