import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasSupabasePublicEnv } from "@/lib/validations/env";

export async function POST() {
  if (hasSupabasePublicEnv() || process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Demo login is disabled." }, { status: 403 });
  }

  cookies().set("pb_demo_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ ok: true });
}
