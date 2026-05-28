import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { EndClient } from "@/lib/database/types";
import { demoClients } from "@/lib/demo/data";
import { hasSupabasePublicEnv } from "@/lib/validations/env";

export async function listClients(businessId: string, search?: string) {
  if (!hasSupabasePublicEnv()) {
    const normalizedSearch = search?.toLowerCase().trim();
    return normalizedSearch
      ? demoClients.filter((client) =>
          [client.full_name, client.email, client.phone].some((value) =>
            value?.toLowerCase().includes(normalizedSearch)
          )
        )
      : demoClients;
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("end_clients")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (search) {
    const sanitizedSearch = search.replaceAll(",", " ").trim();
    query = query.or(
      `full_name.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%,phone.ilike.%${sanitizedSearch}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Unable to load clients.");
  }

  return data as EndClient[];
}

export async function countClients(businessId: string) {
  if (!hasSupabasePublicEnv()) {
    return demoClients.length;
  }

  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from("end_clients")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId);

  if (error) {
    throw new Error("Unable to count clients.");
  }

  return count ?? 0;
}
