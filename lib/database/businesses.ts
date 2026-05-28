import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Business } from "@/lib/database/types";
import { demoBusiness } from "@/lib/demo/data";
import { hasSupabasePublicEnv } from "@/lib/validations/env";

export async function getBusinessById(businessId: string) {
  if (!hasSupabasePublicEnv()) {
    return demoBusiness;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  if (error) {
    throw new Error("Unable to load business.");
  }

  return data as Business;
}

export async function updateBusinessProfile(
  businessId: string,
  input: {
    name: string;
    phone: string | null;
    logo_url: string | null;
  }
) {
  if (!hasSupabasePublicEnv()) {
    return demoBusiness;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("businesses")
    .update(input)
    .eq("id", businessId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Unable to update business.");
  }

  return data as Business;
}
