import "server-only";
import { buildIllustrationPrompts, buildPersonalizedHairstylePrompts } from "@/lib/ai/illustrations/prompts";
import type { GenerateIllustrationsInput, GenerateIllustrationsResult } from "@/lib/ai/illustrations/types";

export async function generateStyleIllustrations(input: GenerateIllustrationsInput): Promise<GenerateIllustrationsResult> {
  const referenceImageUrl = input.referenceImageUrls?.find(Boolean);
  const wantsPersonalizedPreview = Boolean(referenceImageUrl && process.env.OPENAI_HAIRSTYLE_PREVIEW_MODE !== "reference");
  const prompts = wantsPersonalizedPreview
    ? buildPersonalizedHairstylePrompts(input.report, input.locale)
    : buildIllustrationPrompts(input.report, input.locale);

  if (!prompts.length) {
    return { provider: "demo", model: "none", urls: [] };
  }

  if (process.env.OPENAI_API_KEY) {
    if (wantsPersonalizedPreview && referenceImageUrl) {
      const edited = await generatePersonalizedWithOpenAI(prompts, referenceImageUrl);

      if (edited.urls.length >= prompts.length) {
        return edited;
      }

      if (edited.urls.length) {
        const missingPrompts = prompts.slice(edited.urls.length);
        const generated = await generateWithOpenAI(missingPrompts);
        return fillMissingIllustrations(
          {
            ...edited,
            urls: [...edited.urls, ...generated.urls]
          },
          prompts
        );
      }
    }

    const generated = await generateWithOpenAI(prompts);

    if (generated.urls.length) {
      return fillMissingIllustrations(generated, prompts);
    }
  }

  return createDemoIllustrations(prompts);
}

function fillMissingIllustrations(
  result: GenerateIllustrationsResult,
  prompts: string[]
): GenerateIllustrationsResult {
  if (result.urls.length >= prompts.length) {
    return {
      ...result,
      urls: result.urls.slice(0, prompts.length)
    };
  }

  const missing = prompts.slice(result.urls.length);
  const fallbackUrls = createDemoIllustrations(missing).urls;

  return {
    ...result,
    urls: [...result.urls, ...fallbackUrls]
  };
}

async function generatePersonalizedWithOpenAI(
  prompts: string[],
  referenceImageUrl: string
): Promise<GenerateIllustrationsResult> {
  const model = process.env.OPENAI_IMAGE_EDIT_MODEL || process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
  const quality = process.env.OPENAI_IMAGE_QUALITY || "high";
  const urls: string[] = [];

  for (const prompt of prompts) {
    const sourceImage = await imageToBlob(referenceImageUrl);

    if (!sourceImage) {
      break;
    }

    const body = new FormData();
    body.set("model", model);
    body.set("prompt", prompt);
    body.set("size", "1024x1024");
    body.set("quality", quality);
    body.set("n", "1");
    body.set("output_format", "png");
    body.append("image", sourceImage.blob, sourceImage.filename);

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body
    });

    if (!response.ok) {
      continue;
    }

    const payload = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    const image = payload.data?.[0];

    if (image?.b64_json) {
      urls.push(`data:image/png;base64,${image.b64_json}`);
    } else if (image?.url) {
      urls.push(image.url);
    }
  }

  return {
    provider: "openai_edit",
    model,
    urls
  };
}

async function generateWithOpenAI(prompts: string[]): Promise<GenerateIllustrationsResult> {
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
  const quality = process.env.OPENAI_IMAGE_QUALITY || "high";
  const urls: string[] = [];

  for (const prompt of prompts) {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        prompt,
        size: "1024x1024",
        quality,
        n: 1
      })
    });

    if (!response.ok) {
      continue;
    }

    const payload = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    const image = payload.data?.[0];

    if (image?.b64_json) {
      urls.push(`data:image/png;base64,${image.b64_json}`);
    } else if (image?.url) {
      urls.push(image.url);
    }
  }

  return {
    provider: "openai",
    model,
    urls
  };
}

async function imageToBlob(imageUrl: string) {
  if (imageUrl.startsWith("data:image/")) {
    const match = imageUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);

    if (!match) {
      return null;
    }

    const mimeType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
    const bytes = Buffer.from(match[2], "base64");

    return {
      blob: new Blob([bytes], { type: mimeType }),
      filename: `client-reference.${extensionForMime(mimeType)}`
    };
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return null;
  }

  const response = await fetch(imageUrl);

  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const mimeType = contentType.includes("png")
    ? "image/png"
    : contentType.includes("webp")
      ? "image/webp"
      : "image/jpeg";
  const bytes = await response.arrayBuffer();

  return {
    blob: new Blob([bytes], { type: mimeType }),
    filename: `client-reference.${extensionForMime(mimeType)}`
  };
}

function extensionForMime(mimeType: string) {
  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function createDemoIllustration(prompt: string, index: number) {
  const title = `Referencia ${index + 1}`;
  const subtitle = prompt.slice(0, 145);
  const colors = [
    ["#0A0A0A", "#C9A84C", "#F7F3EC"],
    ["#141414", "#8A6820", "#F7F3EC"],
    ["#0E0E0E", "#D6B96A", "#F7F3EC"]
  ][index % 3];
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="1" stop-color="#1E1E1E"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <circle cx="512" cy="338" r="150" fill="${colors[2]}" opacity="0.9"/>
  <path d="M322 818c28-176 112-268 190-268s162 92 190 268" fill="${colors[2]}" opacity="0.82"/>
  <path d="M360 322c34-110 264-132 304 4-42-34-94-56-154-56-57 0-108 18-150 52z" fill="${colors[1]}"/>
  <path d="M348 486c82 86 242 86 328 0" fill="none" stroke="${colors[1]}" stroke-width="18" stroke-linecap="round" opacity="0.7"/>
  <rect x="96" y="760" width="832" height="156" rx="36" fill="#0A0A0A" opacity="0.72"/>
  <text x="512" y="822" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="${colors[1]}">${escapeSvg(title)}</text>
  <text x="512" y="872" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="${colors[2]}">${escapeSvg(subtitle)}</text>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function createDemoIllustrations(prompts: string[]): GenerateIllustrationsResult {
  return {
    provider: "demo",
    model: "svg-reference-placeholder",
    urls: prompts.map((prompt, index) => createDemoIllustration(prompt, index))
  };
}

function escapeSvg(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
