"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const signupSchema = z.object({
  business_name: z.string().trim().min(2, "Business name is required.").max(120),
  full_name: z.string().trim().min(2, "Full name is required.").max(120),
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export async function createBusinessAccount(formData: FormData) {
  const parsed = signupSchema.safeParse({
    business_name: formData.get("business_name"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect(`/signup?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid data.")}`);
  }

  const supabase = createSupabaseAdminClient();
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.full_name,
      business_name: parsed.data.business_name
    }
  });

  if (authError || !authData.user) {
    redirect(`/signup?error=${encodeURIComponent(authError?.message || "Unable to create user.")}`);
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .insert({
      name: parsed.data.business_name,
      email: parsed.data.email,
      credits_remaining: 25,
      credits_alert_threshold: 10,
      active: true
    })
    .select("id")
    .single();

  if (businessError || !business) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    redirect(`/signup?error=${encodeURIComponent("Unable to create business.")}`);
  }

  const { error: userError } = await supabase.from("business_users").insert({
    business_id: business.id,
    auth_user_id: authData.user.id,
    email: parsed.data.email,
    role: "owner",
    full_name: parsed.data.full_name,
    active: true
  });

  if (userError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    await supabase.from("businesses").delete().eq("id", business.id);
    redirect(`/signup?error=${encodeURIComponent("Unable to attach user to business.")}`);
  }

  const authClient = createSupabaseServerClient();
  const { error: signInError } = await authClient.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (signInError) {
    redirect(`/login?created=1&email=${encodeURIComponent(parsed.data.email)}`);
  }

  redirect("/dashboard");
}
