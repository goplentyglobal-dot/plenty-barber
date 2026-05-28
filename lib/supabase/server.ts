import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/lib/validations/env";

export function assertSupabaseConfigured() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing public Supabase environment variables.");
  }
}

export function createSupabaseServerClient() {
  assertSupabaseConfigured();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Components cannot write cookies. Middleware refreshes sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Server Components cannot write cookies. Middleware refreshes sessions.
        }
      }
    }
  });
}
