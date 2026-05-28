import "server-only";
import crypto from "crypto";

export function verifyPaymentWebhook(input: {
  provider: string;
  rawBody: string;
  payload: unknown;
  headers: Headers;
}) {
  if (input.provider === "wompi") {
    return verifyWompiWebhook(input.payload, input.headers);
  }

  if (input.provider === "stripe") {
    return verifyStripeWebhook(input.rawBody, input.headers);
  }

  return true;
}

function verifyWompiWebhook(payload: unknown, headers: Headers) {
  const secret = process.env.WOMPI_EVENTS_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const event = payload as {
    data?: Record<string, unknown>;
    timestamp?: number | string;
    signature?: {
      properties?: string[];
      checksum?: string;
    };
  };
  const checksum = headers.get("x-event-checksum") || event.signature?.checksum || "";
  const properties = event.signature?.properties || [];

  if (!event.data || !event.timestamp || !checksum || !properties.length) {
    return false;
  }

  const data = event.data;
  const values = properties.map((property) => String(readNested(data, property) ?? "")).join("");
  const expected = sha256(`${values}${event.timestamp}${secret}`);
  return safeEqual(checksum, expected);
}

function verifyStripeWebhook(rawBody: string, headers: Headers) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const signatureHeader = headers.get("stripe-signature") || "";
  const timestamp = signatureHeader
    .split(",")
    .map((item) => item.split("="))
    .find(([key]) => key === "t")?.[1];
  const signatures = signatureHeader
    .split(",")
    .map((item) => item.split("="))
    .filter(([key]) => key === "v1")
    .map(([, value]) => value);

  if (!timestamp || !signatures.length) {
    return false;
  }

  const timestampSeconds = Number(timestamp);
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (!Number.isFinite(timestampSeconds) || Math.abs(nowSeconds - timestampSeconds) > 300) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  return signatures.some((signature) => safeEqual(signature, expected));
}

function readNested(source: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, source);
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
