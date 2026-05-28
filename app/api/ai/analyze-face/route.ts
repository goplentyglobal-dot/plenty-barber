import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeFace } from "@/lib/ai/analyze-face";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { getBusinessById } from "@/lib/database/businesses";

const requestSchema = z.object({
  imageDataUrl: z.string().startsWith("data:image/"),
  provider: z.enum(["openai", "anthropic", "deepseek", "demo"]).optional(),
  locale: z.enum(["es", "en", "pt"]).optional()
});

export async function POST(request: Request) {
  try {
    const businessUser = await requireCurrentBusinessUser();
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid analysis request." }, { status: 400 });
    }

    const business = await getBusinessById(businessUser.business_id);

    if (business.credits_remaining <= 0) {
      return NextResponse.json({ error: "Not enough credits to run AI analysis." }, { status: 402 });
    }

    const result = await analyzeFace(parsed.data);

    return NextResponse.json({
      provider: result.provider,
      model: result.model,
      report: result.report,
      usage: {
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        costUsd: result.costUsd
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
