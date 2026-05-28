"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hasSupabasePublicEnv } from "@/lib/validations/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function logout() {
  if (hasSupabasePublicEnv()) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  cookies().delete("pb_demo_session");
  redirect("/login");
}
