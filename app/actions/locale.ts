"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isLocale } from "@/lib/i18n/config";

export async function setLocale(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");

  if (!isLocale(locale)) {
    return;
  }

  cookies().set("pb_locale", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });
  revalidatePath("/");
}
