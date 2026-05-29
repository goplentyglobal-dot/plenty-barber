"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { analyzeFace } from "@/lib/ai/analyze-face";
import { generateStyleIllustrations } from "@/lib/ai/illustrations/generate";
import { getBusinessById } from "@/lib/database/businesses";
import { getLocale } from "@/lib/i18n/server";
import { uploadClientPhoto, uploadReportIllustrations } from "@/lib/storage/report-assets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

    const supabase = createSupabaseServerClient();
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
        console.error("createReport: end_clients insert failed", clientError);
        return failure("No pudimos crear el cliente. Revisa la base de datos e intenta de nuevo.");
      }

      clientId = client.id;
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

    // Atomic: decrement a credit, insert the generation, log the transaction and
    // AI usage in a single security-definer transaction. Prevents the
    // check-then-decrement race and partial writes on failure.
    const { data: generationId, error } = await supabase.rpc("create_generation_with_credit", {
      p_business_id: businessUser.business_id,
      p_end_client_id: clientId,
      p_created_by: businessUser.id,
      p_photo_urls: photoUrls,
      p_report_json: analysis.report,
      p_ai_provider: analysis.provider,
      p_ai_model: analysis.model,
      p_input_tokens: analysis.inputTokens,
      p_output_tokens: analysis.outputTokens,
      p_cost_usd: analysis.costUsd,
      p_image_provider: illustrations.provider,
      p_illustration_urls: illustrationUrls
    });

    if (error || !generationId) {
      const reason = error?.message ?? "";

      if (reason.includes("not enough credits")) {
        return { ok: true, redirectTo: "/dashboard/credits?error=not_enough_credits" };
      }

      if (reason.includes("not authorized")) {
        return failure("No tienes permiso para crear informes en este negocio.");
      }

      console.error("createReport: create_generation_with_credit failed", error);
      return failure("No pudimos crear el informe. Intenta de nuevo.");
    }

    return { ok: true, redirectTo: `/report/${generationId}?generated=1` };
  } catch (error) {
    console.error("createReport failed", error);
    return failure("No pudimos generar el informe. Intenta de nuevo.");
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
