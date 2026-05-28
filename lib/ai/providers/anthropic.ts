import { buildVisagismSystemPrompt, buildVisagismUserPrompt } from "@/lib/ai/prompts/visagism-analysis";
import { generatedReportSchema } from "@/lib/ai/validators/report-schema";
import type { AnalyzeFaceInput, AnalyzeFaceResult } from "@/lib/ai/providers/types";

type AnthropicResponse = {
  content?: Array<{ type: string; text?: string }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
};

export async function analyzeWithAnthropic(input: AnalyzeFaceInput): Promise<AnalyzeFaceResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
  const image = parseDataUrl(input.imageDataUrl);
  const systemPrompt = buildVisagismSystemPrompt(input.locale);
  const userPrompt = buildVisagismUserPrompt(input.locale);
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      system: `${systemPrompt}\nReturn JSON only. Do not wrap it in markdown.`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mediaType,
                data: image.base64
              }
            },
            { type: "text", text: userPrompt }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("Anthropic analysis request failed.");
  }

  const payload = (await response.json()) as AnthropicResponse;
  const text = payload.content?.find((item) => item.type === "text")?.text;

  if (!text) {
    throw new Error("Anthropic response did not include report JSON.");
  }

  const parsed = generatedReportSchema.parse(JSON.parse(stripJsonFence(text)));

  return {
    provider: "anthropic",
    model,
    report: parsed,
    inputTokens: payload.usage?.input_tokens ?? 0,
    outputTokens: payload.usage?.output_tokens ?? 0,
    costUsd: 0
  };
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid image data URL.");
  }

  return {
    mediaType: match[1],
    base64: match[2]
  };
}

function stripJsonFence(text: string) {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}
