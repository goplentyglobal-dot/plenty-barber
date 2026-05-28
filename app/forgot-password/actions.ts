"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/validations/env";

const forgotSchema = z.object({
  email: z.string().trim().email("Enter a valid email.")
});

export async function sendPasswordReset(formData: FormData) {
  const parsed = forgotSchema.safeParse({
    email: formData.get("email")
  });

  if (!parsed.success) {
    redirect(`/forgot-password?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid email.")}`);
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/reset-password`
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?sent=1");
}
