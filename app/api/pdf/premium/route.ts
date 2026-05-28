import { NextResponse } from "next/server";
import { getReportById } from "@/lib/database/reports";
import { getCurrentBusinessUser } from "@/lib/auth/current-user";
import { createPrintToken } from "@/lib/reports/print-token";
import { env } from "@/lib/validations/env";

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

  try {
    const playwright = await loadPlaywright();
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1020, height: 1320 }, deviceScaleFactor: 1 });
    const printToken = createPrintToken(report.id);
    await page.goto(`${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/report/${report.id}/print?token=${printToken}`, {
      waitUntil: "networkidle"
    });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((image) => {
          if (image.complete) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          });
        })
      );
      await document.fonts.ready;
    });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" }
    });
    await browser.close();

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="plenty-barber-premium-${report.id}.pdf"`
      }
    });
  } catch {
    const printToken = createPrintToken(report.id);
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/report/${report.id}/print?token=${printToken}`);
  }
}

async function loadPlaywright() {
  const dynamicImport = new Function("specifier", "return import(specifier)") as (specifier: string) => Promise<{
    chromium: {
      launch: (options: { headless: boolean }) => Promise<{
        newPage: (options?: { viewport: { width: number; height: number }; deviceScaleFactor: number }) => Promise<{
          goto: (url: string, options: { waitUntil: "networkidle" }) => Promise<unknown>;
          emulateMedia: (options: { media: "print" }) => Promise<void>;
          evaluate: <T>(pageFunction: () => T | Promise<T>) => Promise<T>;
          pdf: (options: {
            format: "Letter";
            printBackground: boolean;
            margin: { top: string; right: string; bottom: string; left: string };
          }) => Promise<Buffer>;
        }>;
        close: () => Promise<void>;
      }>;
    };
  }>;

  return dynamicImport("playwright");
}
