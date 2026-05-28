import "server-only";
import { createPlaceholderReport } from "@/lib/ai/placeholder-report";
import { analyzeWithAnthropic } from "@/lib/ai/providers/anthropic";
import { analyzeWithDeepSeek } from "@/lib/ai/providers/deepseek";
import { analyzeWithOpenAI } from "@/lib/ai/providers/openai";
import type { AiProviderName, AnalyzeFaceInput, AnalyzeFaceResult } from "@/lib/ai/providers/types";

export async function analyzeFace(input: AnalyzeFaceInput): Promise<AnalyzeFaceResult> {
  const provider = input.provider || chooseConfiguredProvider();

  if (provider === "openai") {
    return analyzeWithOpenAI(input);
  }

  if (provider === "anthropic") {
    return analyzeWithAnthropic(input);
  }

  if (provider === "deepseek") {
    return analyzeWithDeepSeek(input);
  }

  return analyzeWithDemo(input);
}

export function chooseConfiguredProvider(): AiProviderName {
  if (process.env.PREFERRED_AI_PROVIDER) {
    return process.env.PREFERRED_AI_PROVIDER as AiProviderName;
  }

  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return "anthropic";
  }

  if (process.env.DEEPSEEK_API_KEY) {
    return "deepseek";
  }

  return "demo";
}

function analyzeWithDemo(input: AnalyzeFaceInput): AnalyzeFaceResult {
  return {
    provider: "demo",
    model: "development-placeholder",
    report: createPlaceholderReport(input.locale),
    inputTokens: 0,
    outputTokens: 0,
    costUsd: 0
  };
}
