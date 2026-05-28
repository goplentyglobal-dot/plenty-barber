import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/validations/server-env";
import { hasSupabasePublicEnv } from "@/lib/validations/env";
import type { AppRole, BusinessRole } from "@/lib/auth/roles";

export type CurrentBusinessUser = {
  id: string;
  business_id: string;
  auth_user_id: string | null;
  email: string;
  role: BusinessRole;
  full_name: string | null;
  active: boolean;
};

export async function getSessionUser() {
  if (!hasSupabasePublicEnv() && cookies().get("pb_demo_session")?.value === "active") {
    return {
      id: "demo-auth-user",
      email: "demo@plentybarber.local"
    };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireSessionUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getCurrentBusinessUser(): Promise<CurrentBusinessUser | null> {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  if (!hasSupabasePublicEnv()) {
    return {
      id: "demo-business-user",
      business_id: "demo-business",
      auth_user_id: "demo-auth-user",
      email: "demo@plentybarber.local",
      role: "owner",
      full_name: "Demo Owner",
      active: true
    };
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("business_users")
    .select("id,business_id,auth_user_id,email,role,full_name,active")
    .eq("auth_user_id", user.id)
    .eq("active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as CurrentBusinessUser;
}

export async function requireCurrentBusinessUser() {
  const businessUser = await getCurrentBusinessUser();

  if (!businessUser) {
    redirect("/onboarding");
  }

  return businessUser;
}

export async function getCurrentAppRole(): Promise<AppRole | null> {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  if (!hasSupabasePublicEnv()) {
    return "super_admin";
  }

  if (
    serverEnv.SUPER_ADMIN_EMAIL &&
    user.email?.toLowerCase() === serverEnv.SUPER_ADMIN_EMAIL.toLowerCase()
  ) {
    return "super_admin";
  }

  const businessUser = await getCurrentBusinessUser();
  return businessUser?.role ?? null;
}

export async function requireSuperAdmin() {
  const role = await getCurrentAppRole();

  if (role !== "super_admin") {
    redirect("/dashboard?error=unauthorized");
  }
}
