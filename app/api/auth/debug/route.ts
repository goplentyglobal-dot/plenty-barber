import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 404 });
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({
      authenticated: false,
      userError: userError?.message || null
    });
  }

  const { data: businessUser, error: businessUserError } = await supabase
    .from("business_users")
    .select("id,business_id,email,role,active")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email
    },
    businessUser,
    businessUserError: businessUserError?.message || null
  });
}
