import { reportJsonSchema } from "@/lib/ai/schema-json";
import { buildVisagismSystemPrompt, buildVisagismUserPrompt } from "@/lib/ai/prompts/visagism-analysis";
import { generatedReportSchema } from "@/lib/ai/validators/report-schema";
import type { AnalyzeFaceInput, AnalyzeFaceResult } from "@/lib/ai/providers/types";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
      refusal?: string;
    }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
};

export async function analyzeWithOpenAI(input: AnalyzeFaceInput): Promise<AnalyzeFaceResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const systemPrompt = buildVisagismSystemPrompt(input.locale);
  const userPrompt = buildVisagismUserPrompt(input.locale);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
        {
          role: "user",
          content: [
            { type: "input_text", text: userPrompt },
            { type: "input_image", image_url: input.imageDataUrl }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "visagism_report",
          strict: true,
          schema: reportJsonSchema
        }
      }
    })
  });

  if (!response.ok) {
    const detail = await readOpenAIError(response);
    throw new Error(`OpenAI analysis request failed${detail ? `: ${detail}` : "."}`);
  }

  const payload = (await response.json()) as OpenAIResponse;
  const jsonText = extractOpenAIText(payload);
  const parsed = generatedReportSchema.parse(JSON.parse(jsonText));

  return {
    provider: "openai",
    model,
    report: parsed,
    inputTokens: payload.usage?.input_tokens ?? 0,
    outputTokens: payload.usage?.output_tokens ?? 0,
    costUsd: 0
  };
}

async function readOpenAIError(response: Response) {
  try {
    const payload = (await response.json()) as {
      error?: {
        message?: string;
        type?: string;
        code?: string;
        param?: string;
      };
    };
    const error = payload.error;

    if (!error) {
      return `HTTP ${response.status}`;
    }

    const meta = [response.status, error.code, error.type, error.param].filter(Boolean).join(" / ");
    return `${meta}: ${error.message || "OpenAI returned an error."}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

function extractOpenAIText(payload: OpenAIResponse) {
  if (payload.output_text) {
    return payload.output_text;
  }

  for (const output of payload.output ?? []) {
    for (const content of output.content ?? []) {
      if (content.refusal) {
        throw new Error("OpenAI refused the analysis request.");
      }

      if (content.type === "output_text" && content.text) {
        return content.text;
      }
    }
  }

  throw new Error("OpenAI response did not include report JSON.");
}
