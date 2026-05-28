"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { updateBusinessProfile } from "@/lib/database/businesses";

const settingsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional(),
  logo_url: z.string().trim().url().optional().or(z.literal(""))
});

export type SettingsActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateSettings(
  _state: SettingsActionState = { status: "idle", message: "" },
  formData: FormData
): Promise<SettingsActionState> {
  const businessUser = await requireCurrentBusinessUser();
  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    logo_url: formData.get("logo_url")
  });

  if (!parsed.success) {
    return { status: "error", message: "Datos del negocio invalidos." };
  }

  try {
    await updateBusinessProfile(businessUser.business_id, {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      logo_url: parsed.data.logo_url || null
    });
  } catch {
    return { status: "error", message: "No pudimos guardar los ajustes." };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { status: "success", message: "Ajustes guardados." };
}
