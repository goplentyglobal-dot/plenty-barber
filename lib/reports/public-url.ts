import { env } from "@/lib/validations/env";

export function publicReportUrl(token: string) {
  return `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/r/${token}`;
}
