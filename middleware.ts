import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { env } from "@/lib/validations/env";

const protectedPrefixes = ["/dashboard", "/admin"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV !== "production" && request.cookies.get("pb_demo_session")?.value === "active") {
      return NextResponse.next();
    }

    return redirectToLogin(request);
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request);

  if (!supabase) {
    return redirectToLogin(request);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin(request);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();

    if (!superAdminEmail || user.email?.toLowerCase() !== superAdminEmail) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
