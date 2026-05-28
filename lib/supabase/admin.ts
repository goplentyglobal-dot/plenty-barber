import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/validations/env";
import { serverEnv } from "@/lib/validations/server-env";

export function createSupabaseAdminClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
