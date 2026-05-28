import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user?.email) {
      await ensureBusinessUser(user.id, user.email, user.user_metadata?.full_name);
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}

async function ensureBusinessUser(authUserId: string, email: string, fullName?: string) {
  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin
    .from("business_users")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (existing) {
    await admin
      .from("business_users")
      .update({
        email,
        full_name: fullName || email,
        active: true
      })
      .eq("id", existing.id);
    return;
  }

  const { data: existingBusiness } = await admin
    .from("businesses")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  const businessName = fullName ? `${fullName}'s Studio` : "Plenty Barber Studio";
  const { data: business, error: businessError } = existingBusiness
    ? { data: existingBusiness, error: null }
    : await admin
    .from("businesses")
    .insert({
      name: businessName,
      email,
      credits_remaining: 25,
      credits_alert_threshold: 10,
      active: true
    })
    .select("id")
    .single();

  if (businessError || !business) {
    return;
  }

  await admin.from("business_users").upsert(
    {
    business_id: business.id,
    auth_user_id: authUserId,
    email,
    role: "owner",
    full_name: fullName || email,
    active: true
    },
    { onConflict: "auth_user_id" }
  );
}
