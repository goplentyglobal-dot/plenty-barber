import type { Locale } from "@/lib/i18n/config";
import type { VisagismReport } from "@/lib/ai/validators/report-schema";

export type IllustrationProviderName = "openai" | "openai_edit" | "demo";

export type GenerateIllustrationsInput = {
  report: VisagismReport;
  locale: Locale;
  referenceImageUrls?: string[];
};

export type GenerateIllustrationsResult = {
  provider: IllustrationProviderName;
  model: string;
  urls: string[];
};
