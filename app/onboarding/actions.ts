"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireSessionUser } from "@/lib/auth/current-user";

const onboardingSchema = z.object({
  business_name: z.string().trim().min(2, "Business name is required.").max(120),
  full_name: z.string().trim().min(2, "Full name is required.").max(120),
  phone: z.string().trim().max(40).optional()
});

export async function completeOnboarding(formData: FormData) {
  const user = await requireSessionUser();
  const parsed = onboardingSchema.safeParse({
    business_name: formData.get("business_name"),
    full_name: formData.get("full_name"),
    phone: formData.get("phone")
  });

  if (!parsed.success) {
    redirect(`/onboarding?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid data.")}`);
  }

  if (!user.email) {
    redirect("/login?error=missing_email");
  }

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin
    .from("business_users")
    .select("id,business_id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existing) {
    await admin
      .from("business_users")
      .update({
        email: user.email,
        role: "owner",
        full_name: parsed.data.full_name,
        active: true
      })
      .eq("id", existing.id);
    redirect("/dashboard");
  }

  const { data: existingBusiness } = await admin
    .from("businesses")
    .select("id")
    .eq("email", user.email)
    .maybeSingle();

  const { data: createdBusiness, error: businessError } = existingBusiness
    ? { data: existingBusiness, error: null }
    : await admin
    .from("businesses")
    .insert({
      name: parsed.data.business_name,
      email: user.email,
      phone: parsed.data.phone || null,
      credits_remaining: 25,
      credits_alert_threshold: 10,
      active: true
    })
    .select("id")
    .single();

  if (businessError || !createdBusiness) {
    redirect(`/onboarding?error=${encodeURIComponent(businessError?.message || "Unable to create business.")}`);
  }

  const { error: userError } = await admin.from("business_users").upsert(
    {
    business_id: createdBusiness.id,
    auth_user_id: user.id,
    email: user.email,
    role: "owner",
    full_name: parsed.data.full_name,
    active: true
    },
    { onConflict: "auth_user_id" }
  );

  if (userError) {
    if (!existingBusiness) {
      await admin.from("businesses").delete().eq("id", createdBusiness.id);
    }
    redirect(`/onboarding?error=${encodeURIComponent(userError.message)}`);
  }

  redirect("/dashboard");
}
