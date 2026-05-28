import type { AnalyzeFaceInput, AnalyzeFaceResult } from "@/lib/ai/providers/types";

export async function analyzeWithDeepSeek(_input: AnalyzeFaceInput): Promise<AnalyzeFaceResult> {
  throw new Error(
    "DeepSeek is configured as a future text provider, but this report flow requires vision input."
  );
}
