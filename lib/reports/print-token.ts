import "server-only";
import crypto from "crypto";
import { serverEnv } from "@/lib/validations/server-env";

const TOKEN_TTL_SECONDS = 300;

export function createPrintToken(reportId: string, issuedAt = Math.floor(Date.now() / 1000)) {
  const payload = `${reportId}.${issuedAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifyPrintToken(reportId: string, token: string | null | undefined) {
  if (!token) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [tokenReportId, issuedAtText, signature] = parts;
  const issuedAt = Number(issuedAtText);

  if (tokenReportId !== reportId || !Number.isFinite(issuedAt)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);

  if (now - issuedAt > TOKEN_TTL_SECONDS || issuedAt - now > 30) {
    return false;
  }

  const expected = sign(`${tokenReportId}.${issuedAtText}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

function sign(payload: string) {
  const secret = serverEnv.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "plenty-demo";
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
