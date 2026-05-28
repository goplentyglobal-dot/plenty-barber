import type { VisagismReport } from "@/lib/ai/validators/report-schema";
import type { Locale } from "@/lib/i18n/config";

export type AiProviderName = "openai" | "anthropic" | "deepseek" | "demo";

export type AnalyzeFaceInput = {
  imageDataUrl: string;
  provider?: AiProviderName;
  locale?: Locale;
};

export type AnalyzeFaceResult = {
  provider: AiProviderName;
  model: string;
  report: VisagismReport;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
};
