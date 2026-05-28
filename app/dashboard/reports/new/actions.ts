"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { analyzeFace } from "@/lib/ai/analyze-face";
import { generateStyleIllustrations } from "@/lib/ai/illustrations/generate";
import { getBusinessById } from "@/lib/database/businesses";
import { getLocale } from "@/lib/i18n/server";
import { uploadClientPhoto, uploadReportIllustrations } from "@/lib/storage/report-assets";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabasePublicEnv } from "@/lib/validations/env";

const reportFormSchema = z.object({
  client_id: z.string().optional(),
  full_name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal(""))
});

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export type CreateReportState = {
  error: string | null;
};

export async function createReport(_state: CreateReportState, formData: FormData): Promise<CreateReportState> {
  const result = await createReportResult(formData);

  if (!result.ok) {
    return { error: result.error };
  }

  redirect(result.redirectTo);
}

type CreateReportResult =
  | {
      ok: true;
      redirectTo: string;
    }
  | {
      ok: false;
      error: string;
    };

async function createReportResult(formData: FormData): Promise<CreateReportResult> {
  try {
    const businessUser = await requireCurrentBusinessUser();
    const locale = getLocale();
    const parsed = reportFormSchema.safeParse({
      client_id: formData.get("client_id"),
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      email: formData.get("email")
    });

    if (!parsed.success) {
      return failure(parsed.error.issues[0]?.message || "Los datos del informe no son validos.");
    }

    const photos = getPhotos(formData);
    const photoError = validatePhotos(photos);

    if (photoError) {
      return failure(photoError);
    }

    if (!hasSupabasePublicEnv()) {
      return { ok: true, redirectTo: "/report/demo-report" };
    }

    const business = await getBusinessById(businessUser.business_id);

    if (business.credits_remaining <= 0) {
      return { ok: true, redirectTo: "/dashboard/credits?error=not_enough_credits" };
    }

    const photoDataUrls = await Promise.all(photos.map(fileToDataUrl));
    const imageDataUrl = photoDataUrls[0];
    const analysis = await analyzeFace({ imageDataUrl, locale });
    const illustrations = await generateStyleIllustrations({
      report: analysis.report,
      locale,
      referenceImageUrls: photoDataUrls
    });

    const [photoUrls, illustrationUrls] = await Promise.all([
      Promise.all(photos.map((file, index) => uploadClientPhoto({ businessId: businessUser.business_id, file, index }))),
      uploadReportIllustrations({ businessId: businessUser.business_id, urls: illustrations.urls })
    ]);

    const supabase = createSupabaseAdminClient();
    let clientId = parsed.data.client_id || null;

    if (!clientId) {
      if (!parsed.data.full_name || parsed.data.full_name.length < 2) {
        return failure("Selecciona un cliente o escribe el nombre del nuevo cliente.");
      }

      const { data: client, error: clientError } = await supabase
        .from("end_clients")
        .insert({
          business_id: businessUser.business_id,
          full_name: parsed.data.full_name,
          phone: parsed.data.phone || null,
          email: parsed.data.email || null
        })
        .select("id")
        .single();

      if (clientError || !client) {
        return failure("No pudimos crear el cliente. Revisa la base de datos e intenta de nuevo.");
      }

      clientId = client.id;
    }

    const { data: generation, error } = await supabase
      .from("generations")
      .insert({
        business_id: businessUser.business_id,
        end_client_id: clientId,
        created_by: businessUser.id,
        photo_urls: photoUrls,
        ai_provider: analysis.provider,
        ai_model: analysis.model,
        image_provider: illustrations.provider,
        tokens_used: analysis.inputTokens + analysis.outputTokens,
        cost_usd: analysis.costUsd,
        report_json: analysis.report,
        illustration_urls: illustrationUrls,
        status: "done"
      })
      .select("id")
      .single();

    if (error || !generation) {
      return failure(`No pudimos crear el informe: ${error?.message || "error desconocido"}.`);
    }

    await Promise.all([
      supabase
        .from("businesses")
        .update({ credits_remaining: Math.max(0, business.credits_remaining - 1) })
        .eq("id", businessUser.business_id),
      supabase.from("credit_transactions").insert({
        business_id: businessUser.business_id,
        credits_delta: -1,
        type: "generation_use",
        note: "Credit consumed by report generation"
      }),
      supabase.from("ai_logs").insert({
        business_id: businessUser.business_id,
        generation_id: generation.id,
        provider: analysis.provider,
        model: analysis.model,
        request_type: "visagism_analysis",
        input_tokens: analysis.inputTokens,
        output_tokens: analysis.outputTokens,
        cost_usd: analysis.costUsd,
        status: "done"
      })
    ]);

    return { ok: true, redirectTo: `/report/${generation.id}?generated=1` };
  } catch (error) {
    return failure(error instanceof Error ? error.message : "No pudimos generar el informe.");
  }
}

function failure(error: string): CreateReportResult {
  return { ok: false, error };
}

function getPhotos(formData: FormData) {
  const photos = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!photos.length) {
    const legacyPhoto = formData.get("photo");

    if (legacyPhoto instanceof File && legacyPhoto.size > 0) {
      return [legacyPhoto];
    }
  }

  return photos;
}

function validatePhotos(photos: File[]) {
  if (!photos.length) {
    return "Sube o toma al menos una foto del cliente.";
  }

  if (photos.length > 3) {
    return "Puedes subir máximo 3 fotos.";
  }

  for (const photo of photos) {
    if (!allowedImageTypes.includes(photo.type)) {
      return "Solo puedes subir imágenes JPG, PNG o WebP.";
    }
  }

  const maxUploadMb = Number(process.env.MAX_UPLOAD_IMAGE_MB || 10);
  const maxBytes = maxUploadMb * 1024 * 1024;

  for (const photo of photos) {
    if (photo.size > maxBytes) {
      return `Cada imagen debe pesar ${maxUploadMb} MB o menos.`;
    }
  }

  return null;
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}
