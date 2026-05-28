"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/validations/env";

export async function signInWithGoogle() {
  const supabase = createSupabaseServerClient();
  const redirectTo = `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo
    }
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message || "Unable to start Google login.")}`);
  }

  redirect(data.url);
}
