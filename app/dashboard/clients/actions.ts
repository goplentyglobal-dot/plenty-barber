"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabasePublicEnv } from "@/lib/validations/env";

const clientSchema = z.object({
  full_name: z.string().trim().min(2, "Client name is required.").max(120),
  phone: z.string().trim().max(40).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional()
});

export type ClientActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const idleState: ClientActionState = { status: "idle", message: "" };

export async function createClient(_state: ClientActionState = idleState, formData?: FormData): Promise<ClientActionState> {
  const businessUser = await requireCurrentBusinessUser();

  if (!formData) {
    return errorState("No recibimos los datos del cliente. Intenta de nuevo.");
  }

  const parsed = clientSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes")
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message || "Datos de cliente invalidos.");
  }

  if (!hasSupabasePublicEnv()) {
    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return successState("Cliente creado.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("end_clients").insert({
    business_id: businessUser.business_id,
    full_name: parsed.data.full_name,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    notes: parsed.data.notes || null
  });

  if (error) {
    return errorState("No pudimos crear el cliente.");
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  return successState("Cliente creado.");
}

export async function updateClient(_state: ClientActionState = idleState, formData?: FormData): Promise<ClientActionState> {
  const businessUser = await requireCurrentBusinessUser();

  if (!formData) {
    return errorState("No recibimos los datos del cliente. Intenta de nuevo.");
  }

  const id = String(formData.get("id") ?? "");
  const parsed = clientSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes")
  });

  if (!id || !parsed.success) {
    return errorState(parsed.success ? "Falta el id del cliente." : parsed.error.issues[0]?.message || "Datos invalidos.");
  }

  if (!hasSupabasePublicEnv()) {
    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return successState("Cliente actualizado.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("end_clients")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("business_id", businessUser.business_id);

  if (error) {
    return errorState("No pudimos actualizar el cliente.");
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  return successState("Cliente actualizado.");
}

export async function deleteClient(_state: ClientActionState = idleState, formData?: FormData): Promise<ClientActionState> {
  const businessUser = await requireCurrentBusinessUser();

  if (!formData) {
    return errorState("No recibimos la solicitud de eliminacion. Intenta de nuevo.");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return errorState("Falta el id del cliente.");
  }

  if (!hasSupabasePublicEnv()) {
    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    return successState("Cliente eliminado.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("end_clients")
    .delete()
    .eq("id", id)
    .eq("business_id", businessUser.business_id);

  if (error) {
    return errorState("No pudimos eliminar el cliente.");
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  return successState("Cliente eliminado.");
}

function successState(message: string): ClientActionState {
  return { status: "success", message };
}

function errorState(message: string): ClientActionState {
  return { status: "error", message };
}
